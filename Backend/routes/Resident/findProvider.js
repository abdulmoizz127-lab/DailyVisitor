const express = require('express');
const db = require('../../config/db');

const router = express.Router();


// ==================== FIND PROVIDER ====================
// Resident ki service, days, time aur radius ke basis par
// matching service providers find kiye jayenge

router.post('/find-provider', (req, res) => {

  console.log('Find Provider API called');
  console.log('Search data:', req.body);

  const {
    residentId,
    serviceType,
    selectedDays,
    fromTime,
    toTime,
    radius,
  } = req.body;


  // ==================== CHECK REQUIRED DATA ====================

  if (
    !residentId ||
    !serviceType ||
    !selectedDays ||
    selectedDays.length === 0 ||
    !fromTime ||
    !toTime ||
    !radius
  ) {
    return res.status(400).json({
      message: 'Required search data is missing',
    });
  }


  // ==================== RESIDENT RADIUS ====================
  // "5 km" ko number 5 mein convert karna

  const residentRadius = parseFloat(radius);


  // ==================== GET RESIDENT LOCATION ====================
  // Resident ki home location Address table se niklegi

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


      // ==================== DAYS FOR SQL ====================
      // Selected days ke liye SQL placeholders banana

      const dayPlaceholders =
        selectedDays.map(() => '?').join(',');


      // ==================== FIND MATCHING PROVIDERS ====================
      // Provider ki service, days, time aur location check hogi

      const providerSQL = `
        SELECT
          sp.provider_id,
          u.user_id,
          u.user_name,
          s.service,
          a.latitude,
          a.longitude,
          sp.service_radius_km,

          sp.service_price,
          sp.price_unit,

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

        INNER JOIN Shift sh
          ON sh.provider_id = sp.provider_id

        WHERE s.service = ?

          AND sh.day IN (${dayPlaceholders})

          AND sh.start_time < ?
          AND sh.end_time > ?

        GROUP BY
          sp.provider_id,
          u.user_id,
          u.user_name,
          s.service,
          a.latitude,
          a.longitude,
          sp.service_radius_km,
          sp.service_price,
          sp.price_unit

        HAVING
          COUNT(DISTINCT sh.day) = ?

          AND distance <= ?

          AND distance <= sp.service_radius_km

        ORDER BY distance ASC
      `;


      const queryParams = [

        residentLatitude,
        residentLatitude,
        residentLongitude,

        serviceType,

        ...selectedDays,

        toTime,
        fromTime,

        selectedDays.length,

        residentRadius,
      ];


      // ==================== DATABASE SEARCH ====================
      // MySQL se matching providers find karna

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


          // ==================== PROVIDER RESULTS ====================
          // Matching providers SelectProvider screen ko return honge
          // Price aur price unit bhi response mein jayegi

          console.log(
            'Matching providers:',
            providers
          );


          return res.status(200).json({
            message: 'Providers found successfully',
            providers: providers,
          });

        }
      );

    }
  );

});


module.exports = router;