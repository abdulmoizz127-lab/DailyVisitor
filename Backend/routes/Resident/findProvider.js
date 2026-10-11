const express = require('express');
const db = require('../../config/db');

const router = express.Router();


/* ==================== HOURLY CAPACITY SETTINGS ==================== */
/* Ek provider ek ghante mein maximum itni services/residents handle kar sakta hai */

const HOURLY_CAPACITY = 6;


/* ==================== TIME TO MINUTES ==================== */
/* "06:30:00" ko minutes (390) mein convert karna */

const timeToMinutes = time => {

  const parts = String(time).split(':');

  return Number(parts[0]) * 60 + Number(parts[1] || 0);

};


/* ==================== FIND PROVIDER ==================== */
/* Resident ki service, service groups (days + products), time aur radius
   ke basis par matching service providers find kiye jayenge */

router.post('/find-provider', (req, res) => {

  console.log('Find Provider API called');
  console.log('Search data:', req.body);

  const {
    residentId,
    serviceType,
    serviceGroups,
    startDate,
    fromTime,
    toTime,
    radius,
  } = req.body;


  /* ==================== CHECK REQUIRED DATA ==================== */

  if (
    !residentId ||
    !serviceType ||
    !Array.isArray(serviceGroups) ||
    serviceGroups.length === 0 ||
    !startDate ||
    !fromTime ||
    !toTime ||
    !radius
  ) {
    return res.status(400).json({
      message: 'Required search data is missing',
    });
  }


  /* ==================== CHECK EACH SERVICE GROUP ==================== */
  /* Har group mein days zaroori hain.
     Garbage Collector ke ilawa har group mein products bhi zaroori hain.
     Quantity search mein use nahi hoti. */

  for (const group of serviceGroups) {

    if (!Array.isArray(group.days) || group.days.length === 0) {
      return res.status(400).json({
        message: 'Every service group must have days selected',
      });
    }

    if (
      serviceType !== 'Garbage Collector' &&
      (!Array.isArray(group.products) || group.products.length === 0)
    ) {
      return res.status(400).json({
        message: 'Every service group must have products selected',
      });
    }

  }


  /* ==================== SEARCH START DATE ==================== */
  /* startDate ko MySQL date format (YYYY-MM-DD) mein convert karna */

  const parsedStartDate = new Date(startDate);

  if (isNaN(parsedStartDate.getTime())) {
    return res.status(400).json({
      message: 'Start date is not valid',
    });
  }

  const searchDate =
    parsedStartDate.getFullYear() + '-' +
    String(parsedStartDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(parsedStartDate.getDate()).padStart(2, '0');


  /* ==================== SEARCH WEEKDAY ==================== */
  /* Search date ka weekday naam (Monday, Tuesday, ...).
     Capacity sirf is din ki requests se check hogi */

  const weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const searchWeekday = weekdayNames[parsedStartDate.getDay()];


  /* ==================== RESIDENT RADIUS ==================== */
  /* "5 km" ko number 5 mein convert karna */

  const residentRadius = parseFloat(radius);


  /* ==================== GET RESIDENT LOCATION ==================== */
  /* Resident ki home location Address table se niklegi */

  const residentAddressSQL = `
    SELECT latitude, longitude
    FROM Address
    WHERE user_id = ?
    ORDER BY address_id DESC
    LIMIT 1
  `;


  db.query(
    residentAddressSQL,
    [residentId],
    (addressError, addressResults) => {

      if (addressError) {

        console.log(
          'Resident address error:',
          addressError.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }


      if (addressResults.length === 0) {

        return res.status(404).json({
          message: 'Resident location not found',
        });
      }


      const residentLatitude =
        addressResults[0].latitude;

      const residentLongitude =
        addressResults[0].longitude;


      /* ==================== REQUIRED PRODUCTS ==================== */
      /* Saare groups ke products ek list mein (duplicate nahi).
         Resident "Ghee" select karta hai lekin database mein
         ye "Butter/Ghee" ke naam se saved hai, isliye naam convert hota hai.
         Provider ke paas ye saare products ProviderServicePrice mein hone chahiye */

      const requiredProducts = [];

      serviceGroups.forEach(group => {

        (group.products || []).forEach(product => {

          const databaseName =
            product === 'Ghee' ? 'Butter/Ghee' : product;

          if (!requiredProducts.includes(databaseName)) {
            requiredProducts.push(databaseName);
          }

        });

      });


      /* ==================== PRODUCT CONDITION ==================== */
      /* Provider ke required products count karna.
         Price ya quantity se filter nahi hota, sirf product ka hona check hota hai */

      let productCondition = '';
      const productParams = [];

      if (requiredProducts.length > 0) {

        const productPlaceholders =
          requiredProducts.map(() => '?').join(',');

        productCondition = `
          AND (
            SELECT COUNT(DISTINCT psp.item_name)
            FROM ProviderServicePrice psp
            WHERE psp.provider_id = sp.provider_id
              AND psp.item_name IN (${productPlaceholders})
          ) = ?
        `;

        productParams.push(
          ...requiredProducts,
          requiredProducts.length
        );

      }


      /* ==================== SERVICE GROUP DAY CONDITIONS ==================== */
      /* Har service group alag check hota hai.
         Provider ki Shift us group ke saare days ko common time slot
         ke saath cover karni chahiye */

      let groupDayConditions = '';
      const groupDayParams = [];

      serviceGroups.forEach(group => {

        const groupDays = [...new Set(group.days)];

        const dayPlaceholders =
          groupDays.map(() => '?').join(',');

        groupDayConditions += `
          AND (
            SELECT COUNT(DISTINCT sh.day)
            FROM Shift sh
            WHERE sh.provider_id = sp.provider_id
              AND sh.day IN (${dayPlaceholders})
              AND sh.start_time <= ?
              AND sh.end_time >= ?
          ) = ?
        `;

        groupDayParams.push(
          ...groupDays,
          fromTime,
          toTime,
          groupDays.length
        );

      });


      /* ==================== FIND MATCHING PROVIDERS ==================== */
      /* Provider ki service, products, group days, time aur location check hogi */

      const providerSQL = `
        SELECT
          sp.provider_id,
          u.user_id,
          u.user_name,
          s.service,
          a.latitude,
          a.longitude,
          sp.service_radius_km,

          ROUND(
            6371 * 2 * ASIN(
              SQRT(
                POWER(
                  SIN(
                    RADIANS(a.latitude - ?) / 2
                  ),
                  2
                )
                +
                COS(RADIANS(?))
                *
                COS(RADIANS(a.latitude))
                *
                POWER(
                  SIN(
                    RADIANS(a.longitude - ?) / 2
                  ),
                  2
                )
              )
            ),
            2
          ) AS distance

        FROM ServiceProvider sp

        INNER JOIN User u
          ON sp.user_id = u.user_id

        INNER JOIN Service s
          ON sp.service_id = s.service_id

        INNER JOIN Address a
          ON a.user_id = u.user_id

        WHERE s.service = ?

          ${productCondition}

          ${groupDayConditions}

        GROUP BY
          sp.provider_id,
          u.user_id,
          u.user_name,
          s.service,
          a.latitude,
          a.longitude,
          sp.service_radius_km

        HAVING
          distance <= ?

          AND distance <= sp.service_radius_km

        ORDER BY distance ASC
      `;


      /* Parameters ki order bilkul SQL ke placeholders jaisi honi chahiye */

      const queryParams = [

        residentLatitude,
        residentLatitude,
        residentLongitude,

        serviceType,

        ...productParams,

        ...groupDayParams,

        residentRadius,
      ];


      /* ==================== DATABASE SEARCH ==================== */
      /* MySQL se matching providers find karna */

      db.query(
        providerSQL,
        queryParams,
        (providerError, providers) => {

          if (providerError) {

            console.log(
              'Find provider error:',
              providerError.message
            );

            return res.status(500).json({
              message: 'Server error',
            });
          }


          /* ==================== NO PROVIDERS FOUND ==================== */

          if (providers.length === 0) {

            return res.status(200).json({
              message: 'Providers found successfully',
              providers: [],
            });
          }


          /* ==================== CHECK HOURLY CAPACITY ==================== */
          /* Matching providers ki existing active requests (PENDING/ACCEPTED)
             ServiceRequest table se nikalte hain jo Resident ke time se overlap
             karti hain aur jin ke selected_days mein search date ka weekday hai
             (selected_days comma-separated text hai, spaces hata kar check hota hai).
             REJECTED requests count nahi hoti. */

          const matchedProviderIds =
            providers.map(provider => provider.provider_id);

          const matchedPlaceholders =
            matchedProviderIds.map(() => '?').join(',');

          const capacitySQL = `
            SELECT
              provider_id,
              from_time,
              to_time
            FROM ServiceRequest
            WHERE provider_id IN (${matchedPlaceholders})
              AND UPPER(status) IN ('PENDING', 'ACCEPTED')
              AND start_date <= ?
              AND FIND_IN_SET(?, REPLACE(selected_days, ' ', '')) > 0
              AND from_time < ?
              AND to_time > ?
          `;


          db.query(
            capacitySQL,
            [...matchedProviderIds, searchDate, searchWeekday, toTime, fromTime],
            (capacityError, activeRequests) => {

              if (capacityError) {

                console.log(
                  'Provider capacity error:',
                  capacityError.message
                );

                return res.status(500).json({
                  message: 'Server error',
                });
              }


              /* ==================== HOURS TO CHECK ==================== */
              /* Resident ke time range ke har ghante ki list (minutes mein).
                 Example: 6:00-8:00 => 6:00-7:00 aur 7:00-8:00 */

              const searchStart = timeToMinutes(fromTime);
              const searchEnd = timeToMinutes(toTime);

              const hoursToCheck = [];

              for (
                let hourStart = Math.floor(searchStart / 60) * 60;
                hourStart < searchEnd;
                hourStart += 60
              ) {
                hoursToCheck.push(hourStart);
              }


              /* ==================== REMOVE FULL PROVIDERS ==================== */
              /* Agar kisi bhi required ghante mein 6 ya zyada active requests hon
                 to provider result se bilkul hata diya jata hai */

              const availableProviders = providers.filter(provider => {

                const providerRequests = activeRequests.filter(
                  request => request.provider_id === provider.provider_id
                );

                return hoursToCheck.every(hourStart => {

                  const hourEnd = hourStart + 60;

                  const requestsInThisHour = providerRequests.filter(request =>
                    timeToMinutes(request.from_time) < hourEnd &&
                    timeToMinutes(request.to_time) > hourStart
                  );

                  return requestsInThisHour.length < HOURLY_CAPACITY;

                });

              });


              /* ==================== ALL PROVIDERS FULL ==================== */

              if (availableProviders.length === 0) {

                return res.status(200).json({
                  message: 'Providers found successfully',
                  providers: [],
                });
              }


          /* ==================== GET PROVIDER PRICES ==================== */
          /* Provider match hone ke baad uski SAARI prices fetch hoti hain
             (sirf Resident ke requested products ki nahi), taake Resident
             provider card par provider ke saare products/prices compare kar sake */

          const providerIds =
            availableProviders.map(provider => provider.provider_id);

          const providerPlaceholders =
            providerIds.map(() => '?').join(',');

          const priceSQL = `
            SELECT
              provider_id,
              item_name,
              price,
              price_unit
            FROM ProviderServicePrice
            WHERE provider_id IN (${providerPlaceholders})
            ORDER BY provider_price_id ASC
          `;


          db.query(
            priceSQL,
            providerIds,
            (priceError, priceResults) => {

              if (priceError) {

                console.log(
                  'Provider price error:',
                  priceError.message
                );

                return res.status(500).json({
                  message: 'Server error',
                });
              }


              /* ==================== ADD PRICES TO PROVIDERS ==================== */
              /* "Butter/Ghee" Resident ko "Ghee" ke naam se dikhega */

              const providersWithPrices = availableProviders.map(provider => {

                const prices = priceResults
                  .filter(row => row.provider_id === provider.provider_id)
                  .map(row => ({
                    item_name: row.item_name,
                    display_name:
                      row.item_name === 'Butter/Ghee'
                        ? 'Ghee'
                        : row.item_name,
                    price: row.price,
                    price_unit: row.price_unit,
                  }));


                return {
                  ...provider,
                  prices: prices,
                };

              });


              /* ==================== PROVIDER RESULTS ==================== */
              /* Matching providers SelectProvider screen ko return honge */

              console.log(
                'Matching providers:',
                providersWithPrices
              );


              return res.status(200).json({
                message: 'Providers found successfully',
                providers: providersWithPrices,
              });

            }
          );

            }
          );

        }
      );

    }
  );

});


module.exports = router;