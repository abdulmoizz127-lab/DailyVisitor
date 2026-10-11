// ==================== EXPRESS IMPORT ====================
// Express ko API route banane ke liye use kar rahe hain
const express = require('express');

// ==================== DATABASE IMPORT ====================
// MySQL database ke saath kaam karne ke liye database connection import kar rahe hain
const db = require('../../config/db');

/* ==================== ROAD ROUTING: HTTPS IMPORT ==================== */
/* OSRM road routing service ko call karne ke liye Node ka built-in https module use kar rahe hain.
   Is ke liye koi npm package install karne ki zaroorat nahi. */

const https = require('https');


/* ==================== ROAD ROUTING: OSRM SERVER ==================== */
/* Free OSRM demo server. API key ki zaroorat nahi, lekin internet zaroori hai.
   Baad mein apna OSRM server chalayen to sirf ye URL badalna hoga. */

const OSRM_BASE_URL = 'https://router.project-osrm.org';

// ==================== ROUTER CREATE ====================
// Provider Home ke liye router bana rahe hain
const router = express.Router();


/* ==================== STEP 3: ROUTE CALCULATION ==================== */
/* Neeche ke functions nearest-neighbor route calculate karte hain.
   Ab route ROAD distance (OSRM) par based hai. Koi database table ya Google Maps use nahi ho raha. */


/* ==================== STEP 3: VALID COORDINATE ==================== */
/* Latitude/longitude ko Number mein convert kar rahe hain.
   null, empty ya invalid value ho to null return hota hai (Number(null) = 0 wali ghalti se bachne ke liye). */

const toValidCoordinate = (value, min, max) => {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < min ||
    number > max
  ) {
    return null;
  }

  return number;
};


/* ==================== STEP 3: HAVERSINE DISTANCE ==================== */
/* NOTE: Ab route_order aur distance_km ke liye ye function use nahi hota (road routing use hoti hai).
   Ye sirf straight-line reference ke liye rakha gaya hai, aap chahein to delete kar sakte hain. */
/* Do coordinates ke darmiyan seedhi (straight-line) doori kilometers mein nikal rahe hain.
   Ye road distance nahi hai. */

const getDistanceKm = (lat1, lon1, lat2, lon2) => {

  const earthRadiusKm = 6371;

  const toRadians = degrees =>
    degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};


/* ==================== ROAD ROUTING: DISTANCE MATRIX ==================== */
/* OSRM "table" service ko ek hi request bhej kar sab points (provider + residents) ke darmiyan
   ROAD distance ka matrix le rahe hain.
   matrix[i][j] = point i se point j tak gaadi se road distance (metres mein).
   points = [{lat, lon}, ...]  (pehla point hamesha provider hai) */

const getRoadDistanceMatrix = points => {

  return new Promise((resolve, reject) => {

    /* ==================== ROAD ROUTING: BUILD URL ==================== */
    /* OSRM ko coordinates "longitude,latitude" order mein chahiye */

    const coordinates = points
      .map(point => point.lon + ',' + point.lat)
      .join(';');

    const url =
      OSRM_BASE_URL +
      '/table/v1/driving/' +
      coordinates +
      '?annotations=distance';


    /* ==================== ROAD ROUTING: SEND REQUEST ==================== */

    const request = https.get(
      url,
      {headers: {'User-Agent': 'DailyVisitorFYP'}},
      response => {

        let body = '';

        response.on('data', chunk => {
          body += chunk;
        });

        response.on('end', () => {

          try {

            const data = JSON.parse(body);

            if (data.code !== 'Ok' || !data.distances) {
              return reject(
                new Error('OSRM error: ' + (data.code || 'unknown'))
              );
            }

            return resolve(data.distances);

          } catch (parseError) {
            return reject(parseError);
          }
        });
      }
    );


    /* ==================== ROAD ROUTING: TIMEOUT AND ERRORS ==================== */
    /* Internet na ho ya server jawab na de to promise reject hoga, API crash nahi hogi */

    request.setTimeout(10000, () => {
      request.destroy(new Error('OSRM request timeout'));
    });

    request.on('error', reject);
  });
};


/* ==================== STEP 3: NEAREST NEIGHBOR ROAD ROUTE ==================== */
/* Same date + same from_time + same to_time wali services ka alag group banate hain.
   Har group mein provider ki location se start karke ROAD distance ke hisab se sabse nazdeek resident ko
   route_order 1 dete hain, phir us resident se agla nazdeek resident, aur isi tarah sab ko order milta hai.
   distance_km ab road distance (kilometers) hai: pehle resident ke liye provider se,
   baad walon ke liye pichle resident se.
   Agar coordinates missing/invalid hon, ya road routing service na chale,
   to distance_km aur route_order null rehte hain (API crash nahi hoti).
   Ye function async hai, is liye caller ko .then() use karna hota hai. */

const calculateNearestRoute = async services => {

  /* ==================== STEP 3: DEFAULT ROUTE FIELDS ==================== */
  /* Pehle sab services ko null values dete hain taake frontend ke liye fields hamesha maujood hon */

  services.forEach(service => {
    service.distance_km = null;
    service.route_order = null;

    /* ==================== PROVIDER DISTANCE: DEFAULT ==================== */
    /* Provider se har resident tak ki road distance ke liye field initialize kar rahe hain */
    service.provider_distance_km = null;
  });

  if (services.length === 0) {
    return;
  }


  /* ==================== STEP 3: ROUTE START POINT ==================== */
  /* Route provider ki location se start hota hai.
     Provider ki location invalid ho to koi route calculate nahi hoga. */

  const providerLat = toValidCoordinate(
    services[0].provider_latitude,
    -90,
    90
  );

  const providerLon = toValidCoordinate(
    services[0].provider_longitude,
    -180,
    180
  );

  if (providerLat === null || providerLon === null) {
    return;
  }


  /* ==================== STEP 3: GROUP BY DATE AND TIME WINDOW ==================== */
  /* Alag date ya alag time window wali services ko mix nahi kar rahe */

  const groups = {};

  services.forEach(service => {

    const groupKey =
      String(service.start_date) + '|' +
      String(service.from_time) + '|' +
      String(service.to_time);

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(service);
  });


  /* ==================== STEP 3: COLLECT POINTS FOR ROAD ROUTING ==================== */
  /* points[0] provider hai. Sirf wo residents add hote hain jin ki latitude/longitude valid hai.
     Har resident apna pointIndex yaad rakhta hai taake matrix mein us ki row/column mil sake. */

  const points = [{lat: providerLat, lon: providerLon}];

  const groupedResidents = {};

  Object.keys(groups).forEach(groupKey => {

    groupedResidents[groupKey] = [];

    groups[groupKey].forEach(service => {

      const lat = toValidCoordinate(
        service.resident_latitude,
        -90,
        90
      );

      const lon = toValidCoordinate(
        service.resident_longitude,
        -180,
        180
      );

      if (lat !== null && lon !== null) {

        points.push({lat, lon});

        groupedResidents[groupKey].push({
          service: service,
          pointIndex: points.length - 1,
        });
      }
    });
  });


  /* ==================== STEP 3: NO VALID RESIDENTS ==================== */

  if (points.length === 1) {
    return;
  }


  /* ==================== STEP 3: ROUTING SERVICE LIMIT ==================== */
  /* Free OSRM demo server ek request mein zyada se zyada 100 points leta hai */

  if (points.length > 100) {

    console.log(
      'Road routing skipped: too many locations for OSRM demo server:',
      points.length
    );

    return;
  }


  /* ==================== STEP 3: GET ROAD DISTANCE MATRIX ==================== */
  /* Provider + sab residents ka road distance matrix ek request mein le rahe hain.
     Fail hone par route fields null rehte hain. */

  let matrix;

  try {

    matrix = await getRoadDistanceMatrix(points);

  } catch (routingError) {

    console.log(
      'Road routing error:',
      routingError.message
    );

    return;
  }


  /* ==================== PROVIDER DISTANCE: ROAD DISTANCE FROM PROVIDER ==================== */
  /* Existing matrix hi use kar rahe hain, naya OSRM request nahi banta.
     matrix[0] provider ki row hai aur resident.pointIndex us resident ka column,
     is liye matrix[0][resident.pointIndex] = Provider se is resident tak ki road distance (metres).
     Ye route loop se pehle calculate hota hai, kyunke route loop remaining list se residents nikal deta hai.
     Value na mile to provider_distance_km null hi rehta hai. */

  Object.keys(groupedResidents).forEach(groupKey => {

    groupedResidents[groupKey].forEach(resident => {

      const providerDistance = matrix[0]
        ? matrix[0][resident.pointIndex]
        : null;

      if (typeof providerDistance === 'number') {

        resident.service.provider_distance_km = Number(
          (providerDistance / 1000).toFixed(3)
        );
      }
    });
  });


  /* ==================== STEP 3: ROUTE FOR EACH GROUP ==================== */

  Object.keys(groupedResidents).forEach(groupKey => {

    const remaining = groupedResidents[groupKey];

    let currentIndex = 0;
    let routeOrder = 0;


    /* ==================== STEP 3: PICK NEAREST RESIDENT BY ROAD ==================== */
    /* Har baar current point se sab bache hue residents ki road distance dekh kar sabse kam wala chunte hain */

    while (remaining.length > 0) {

      let nearestIndex = -1;
      let nearestMeters = Infinity;

      remaining.forEach((resident, index) => {

        const meters = matrix[currentIndex]
          ? matrix[currentIndex][resident.pointIndex]
          : null;

        /* Agar road route na mile (null) to is resident ko is round mein skip karte hain */

        if (
          typeof meters === 'number' &&
          meters < nearestMeters
        ) {
          nearestMeters = meters;
          nearestIndex = index;
        }
      });


      /* ==================== STEP 3: NO ROAD ROUTE FOUND ==================== */
      /* Bache hue residents tak road route nahi mila, un ke route fields null hi rehte hain */

      if (nearestIndex === -1) {
        break;
      }


      const nearest = remaining.splice(nearestIndex, 1)[0];

      routeOrder++;

      nearest.service.route_order = routeOrder;
      nearest.service.distance_km = Number(
        (nearestMeters / 1000).toFixed(3)
      );


      /* ==================== STEP 3: MOVE TO SELECTED RESIDENT ==================== */
      /* Agli road distance is selected resident ki location se calculate hogi */

      currentIndex = nearest.pointIndex;
    }
  });
};


/* ==================== STEP 4: DELIVERY SLOT ==================== */
/* Neeche ke functions STEP 3 ke route_order ke mutabiq har resident ko 10-minute ka delivery slot dete hain.
   Route dobara calculate nahi hota, sirf maujooda route_order use hota hai.
   Original from_time aur to_time (resident ki requested window) change nahi hote. */


/* ==================== STEP 4: TIME TO MINUTES ==================== */
/* "HH:MM:SS" time ko din ke minutes mein convert kar rahe hain (seconds ignore).
   Time invalid ho to null return hota hai. */

const timeToMinutes = time => {

  if (!time) {
    return null;
  }

  const parts = String(time).split(':');

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};


/* ==================== STEP 4: MINUTES TO TIME ==================== */
/* Din ke minutes ko wapas "HH:MM:SS" format mein convert kar rahe hain */

const minutesToTime = totalMinutes => {

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':00'
  );
};


/* ==================== STEP 4: ASSIGN DELIVERY SLOTS ==================== */
/* Same date + same from_time + same to_time wale group mein route_order 1 ko window ka start time milta hai,
   route_order 2 ko agla 10-minute slot, aur isi tarah aage.
   Agar slot original to_time se bahar jaye (jaise 7th resident one-hour window mein) to us ko
   naya slot nahi diya jata, delivery_start_time aur delivery_end_time null rehte hain.
   route_order null wali services (invalid coordinates) ko bhi slot nahi milta. */

const assignDeliverySlots = services => {

  const slotMinutes = 10;


  /* ==================== STEP 4: DEFAULT SLOT FIELDS ==================== */
  /* Pehle sab services ko null dete hain taake fields hamesha maujood hon */

  services.forEach(service => {
    service.delivery_start_time = null;
    service.delivery_end_time = null;
  });


  /* ==================== STEP 4: GROUP BY DATE AND TIME WINDOW ==================== */
  /* STEP 3 jaisa hi group key, taake alag date ya alag time window mix na hon */

  const groups = {};

  services.forEach(service => {

    const groupKey =
      String(service.start_date) + '|' +
      String(service.from_time) + '|' +
      String(service.to_time);

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(service);
  });


  /* ==================== STEP 4: SLOTS FOR EACH GROUP ==================== */

  Object.keys(groups).forEach(groupKey => {

    const group = groups[groupKey];

    const windowStart = timeToMinutes(group[0].from_time);
    const windowEnd = timeToMinutes(group[0].to_time);

    if (windowStart === null || windowEnd === null) {
      return;
    }


    /* ==================== STEP 4: SORT BY ROUTE ORDER ==================== */
    /* Sirf wo services jin ka route_order maujood hai, route_order ke hisab se */

    const routedServices = group
      .filter(service => service.route_order !== null)
      .sort((a, b) => a.route_order - b.route_order);


    /* ==================== STEP 4: GIVE 10-MINUTE SLOTS ==================== */

    routedServices.forEach((service, index) => {

      const slotStart = windowStart + index * slotMinutes;
      const slotEnd = slotStart + slotMinutes;


      /* ==================== STEP 4: WINDOW FULL ==================== */
      /* Slot original window se bahar jaye to naya waqt invent nahi karte */

      if (slotEnd > windowEnd) {

        console.log(
          'No delivery slot left in window for request:',
          service.request_id
        );

        return;
      }

      service.delivery_start_time = minutesToTime(slotStart);
      service.delivery_end_time = minutesToTime(slotEnd);
    });
  });
};


// ==================== GET PROVIDER ACCEPTED SERVICES ====================
// Logged-in provider ki ACCEPTED service requests fetch karenge
router.get('/accepted-services/:userId', (req, res) => {

  // ==================== GET PROVIDER USER ID ====================
  // URL se provider ka userId receive kar rahe hain
  const {userId} = req.params;


  // ==================== CHECK PROVIDER USER ID ====================
  // Agar userId nahi mila to request reject karenge
  if (!userId) {
    return res.status(400).json({
      message: 'Provider user ID is required',
    });
  }


  // ==================== GET PROVIDER SERVICES ====================
  // Provider ki accepted requests ke saath resident aur address ki information nikal rahe hain
  const servicesSQL = `
    SELECT
      sr.request_id,
      sr.start_date,
      sr.selected_days,
      sr.from_time,
      sr.to_time,
      sr.status,
      sr.created_at,

      u.user_id AS resident_user_id,
      u.user_name AS resident_name,

      s.service,

      a.country AS resident_country,
      a.province AS resident_province,
      a.city AS resident_city,
      a.area AS resident_area,
      a.location_type AS resident_location_type,

      /* ==================== RESIDENT LOCATION ==================== */
      /* Accepted request ke resident ki latitude aur longitude fetch kar rahe hain */
      a.latitude AS resident_latitude,
      a.longitude AS resident_longitude,

      sp.provider_id

    FROM ServiceRequest sr

    INNER JOIN ServiceProvider sp
      ON sr.provider_id = sp.provider_id

    INNER JOIN User u
      ON sr.resident_id = u.user_id

    INNER JOIN Service s
      ON sr.service_id = s.service_id

    LEFT JOIN Address a
      ON a.address_id = (
        SELECT MAX(address_id)
        FROM Address
        WHERE user_id = sr.resident_id
      )

    WHERE sp.user_id = ?
      AND sr.status = 'ACCEPTED'

    ORDER BY sr.start_date ASC, sr.from_time ASC
  `;


  // ==================== GET PROVIDER DAYS ====================
  // Provider signup ke waqt Shift table mein save kiye gaye actual service days nikal rahe hain
  const daysSQL = `
    SELECT DISTINCT day
    FROM Shift
    WHERE provider_id = (
      SELECT provider_id
      FROM ServiceProvider
      WHERE user_id = ?
    )
  `;


  // ==================== RUN SERVICES DATABASE QUERY ====================
  // Provider ke userId ke basis par accepted services search kar rahe hain
  db.query(
    servicesSQL,
    [userId],
    (error, results) => {

      // ==================== DATABASE ERROR FOR SERVICES ====================
      // Accepted services query mein error aaye to server error return karenge
      if (error) {

        console.log(
          'Provider accepted services error:',
          error.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }


      // ==================== LOG PROVIDER SERVICES ====================
      // Testing ke liye database se aane wala accepted services data console mein show kar rahe hain
      console.log(
        'Provider accepted services:',
        results
      );


      /* ==================== TEST RESIDENT LOCATION ==================== */
      /* Testing ke liye accepted services ke saath resident_latitude aur resident_longitude console mein show kar rahe hain */

      console.log(
        'Provider accepted services with location:',
        results
      );


      /* ==================== PROVIDER LOCATION ==================== */
      /* Logged-in provider ki Address table se latitude aur longitude fetch kar rahe hain.
         Relation: User -> ServiceProvider -> Address (provider ka sabse latest address).
         Phir ye location har accepted service mein provider_latitude aur
         provider_longitude ke naam se laga di jati hai. */

      const addProviderLocation = done => {

        const providerLocationSQL = `
          SELECT
            a.latitude,
            a.longitude

          FROM ServiceProvider sp

          INNER JOIN Address a
            ON a.address_id = (
              SELECT MAX(address_id)
              FROM Address
              WHERE user_id = sp.user_id
            )

          WHERE sp.user_id = ?

          LIMIT 1
        `;


        db.query(
          providerLocationSQL,
          [userId],
          (locationError, locationResults) => {

            /* ==================== PROVIDER LOCATION ERROR ==================== */

            if (locationError) {

              console.log(
                'Provider location error:',
                locationError.message
              );

              return res.status(500).json({
                message: 'Server error',
              });
            }


            /* ==================== READ PROVIDER LATITUDE AND LONGITUDE ==================== */
            /* Agar provider ka address na mile to null rakh rahe hain */

            const providerLatitude =
              locationResults.length > 0
                ? locationResults[0].latitude
                : null;

            const providerLongitude =
              locationResults.length > 0
                ? locationResults[0].longitude
                : null;


            /* ==================== TEST PROVIDER LOCATION ==================== */
            /* Testing ke liye provider ki latitude aur longitude console mein show kar rahe hain */

            console.log(
              'Provider location:',
              providerLatitude,
              providerLongitude
            );


            /* ==================== ADD PROVIDER LOCATION TO SERVICES ==================== */
            /* Har accepted service mein provider_latitude aur provider_longitude add kar rahe hain.
               resident_latitude aur resident_longitude pehle jaise hi rehte hain. */

            results.forEach(service => {

              service.provider_latitude = providerLatitude;
              service.provider_longitude = providerLongitude;

            });


            /* ==================== STEP 3: ROAD ROUTE CALCULATION ==================== */
            /* Provider aur resident dono ki location ab services mein maujood hai.
               Road routing (OSRM) internet par chalti hai, is liye calculateNearestRoute async hai
               aur ham .then() mein route_order/distance_km ka intezar karte hain.
               Slots, logs aur response usi ke baad chalte hain. */

            return calculateNearestRoute(results)
              .catch(routeError => {

                /* ==================== STEP 3: ROUTE SAFETY ==================== */
                /* Koi unexpected error aaye to bhi API chalti rahe, route fields null rahenge */

                console.log(
                  'Route calculation error:',
                  routeError.message
                );

              })
              .then(() => {


                /* ==================== STEP 4: DELIVERY SLOT ==================== */
                /* Road distance se bane final route_order ke mutabiq har service ko 10-minute ka delivery slot de rahe hain.
                   Ye delivery_start_time aur delivery_end_time add karta hai,
                   original from_time aur to_time change nahi hote. */

                assignDeliverySlots(results);


                /* ==================== STEP 3 AND STEP 4: TEST ROUTE AND SLOT ==================== */
                /* Testing ke liye har service ka route_order, road distance_km aur delivery slot console mein show kar rahe hain */

                console.log(
                  'Route calculation:',
                  results.map(service => ({
                    request_id: service.request_id,
                    resident_name: service.resident_name,
                    start_date: service.start_date,
                    from_time: service.from_time,
                    to_time: service.to_time,
                    route_order: service.route_order,
                    distance_km: service.distance_km,

                    /* ==================== PROVIDER DISTANCE: TEST ==================== */
                    /* Provider se is resident tak ki road distance console mein show kar rahe hain */
                    provider_distance_km: service.provider_distance_km,

                    /* ==================== STEP 4: DELIVERY SLOT ==================== */
                    delivery_start_time: service.delivery_start_time,
                    delivery_end_time: service.delivery_end_time,
                  }))
                );


                /* ==================== TEST PROVIDER AND RESIDENT LOCATION ==================== */
                /* Testing ke liye services mein provider aur resident dono ki location show kar rahe hain */

                console.log(
                  'Provider accepted services with provider and resident location:',
                  results
                );


                return done();
              });
          }
        );
      };


      /* ==================== SEND RESPONSE WITH PROVIDER DAYS ==================== */
      /* Ye existing provider days wala hissa hai, bas ab function mein rakha hai
         taake items attach hone ke baad isay call kar sakein. Logic wahi hai. */

      const sendResponseWithDays = () => {

        // ==================== RUN PROVIDER DAYS QUERY ====================
        // Ab provider ke actual signup-selected days database se fetch kar rahe hain
        db.query(
          daysSQL,
          [userId],
          (daysError, daysResults) => {

            // ==================== DATABASE ERROR FOR PROVIDER DAYS ====================
            // Provider days query mein error aaye to server error return karenge
            if (daysError) {

              console.log(
                'Provider service days error:',
                daysError.message
              );

              return res.status(500).json({
                message: 'Server error',
              });
            }


            // ==================== CREATE SERVICE DAYS ARRAY ====================
            // Database ke result se sirf day names ka simple array bana rahe hain
            const serviceDays = daysResults.map(
              item => item.day
            );


            // ==================== LOG PROVIDER SERVICE DAYS ====================
            // Testing ke liye provider ke actual signup-selected days console mein show kar rahe hain
            console.log(
              'Provider service days:',
              serviceDays
            );


            // ==================== SEND PROVIDER SERVICES AND DAYS ====================
            // Accepted services ke saath provider ke actual service days bhi frontend ko bhej rahe hain
            return res.status(200).json({
              message: 'Provider accepted services fetched successfully',

              // Existing accepted services response
              services: results,

              // NEW: Provider signup ke actual selected service days
              serviceDays: serviceDays,
            });
          }
        );
      };


      /* ==================== GET ACCEPTED REQUEST IDS ==================== */
      /* Accepted services ki request_id nikal rahe hain taake un ke items fetch kar sakein */

      const requestIds = results.map(
        service => service.request_id
      );


      /* ==================== NO ACCEPTED SERVICES ==================== */
      /* Agar koi accepted service nahi hai to items query ki zaroorat nahi */

      if (requestIds.length === 0) {

        /* ==================== PROVIDER LOCATION STEP ==================== */
        /* Pehle provider location fetch hogi, phir existing response bheji jayegi */

        return addProviderLocation(sendResponseWithDays);
      }


      /* ==================== GET SERVICE REQUEST ITEMS ==================== */
      /* ServiceRequestItem table se in sab requests ke items aur quantities nikal rahe hain */

      const itemsSQL = `
        SELECT
          request_id,
          selected_days,
          item_name,
          quantity

        FROM ServiceRequestItem

        WHERE request_id IN (?)

        ORDER BY request_item_id ASC
      `;


      /* ==================== RUN ITEMS QUERY ==================== */

      db.query(
        itemsSQL,
        [requestIds],
        (itemsError, itemsResults) => {

          /* ==================== ITEMS DATABASE ERROR ==================== */

          if (itemsError) {

            console.log(
              'Provider service items error:',
              itemsError.message
            );

            return res.status(500).json({
              message: 'Server error',
            });
          }


          /* ==================== ATTACH ITEMS TO SERVICES ==================== */
          /* Har service ke matching items service.items mein laga rahe hain.
             Agar kisi service ke items na hon to empty array rahega.
             quantity ko number bana rahe hain (DECIMAL string ki jagah). */

          results.forEach(service => {

            service.items = itemsResults
              .filter(
                item => item.request_id === service.request_id
              )
              .map(item => ({
                request_id: item.request_id,
                selected_days: item.selected_days,
                item_name: item.item_name,
                quantity: Number(item.quantity),
              }));

          });


          /* ==================== PROVIDER LOCATION STEP ==================== */
          /* Items attach hone ke baad provider location fetch hogi, phir existing response bheji jayegi */

          return addProviderLocation(sendResponseWithDays);
        }
      );
    }
  );
});




/* ==================== START DELIVERY API ==================== */
/* Visitor ke Start button par delivery status database mein save hoga */

router.put('/start-delivery/:requestId', (req, res) => {
  const { requestId } = req.params;

  if (!requestId || isNaN(Number(requestId))) {
    return res.status(400).json({
      message: 'Valid request ID is required',
    });
  }

  /* ==================== CHECK ACCEPTED REQUEST ==================== */
  /* Sirf accepted service ka delivery record start kar sakte hain */

  const checkSQL = `
    SELECT request_id
    FROM ServiceRequest
    WHERE request_id = ?
      AND status = 'ACCEPTED'
      AND provider_id = (
        SELECT provider_id
        FROM ServiceProvider
        WHERE user_id = ?
      )
  `;

  db.query(
    checkSQL,
    [requestId, req.body.userId],
    (error, results) => {
      if (error) {
        console.log('Start delivery check error:', error.message);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: 'Accepted service not found for this provider',
        });
      }

      /* ==================== SAVE DELIVERY STATUS ==================== */
      /* Existing record ko update karein, warna naya record banayein */

     const saveSQL = `
  INSERT INTO DeliveryRecord
    (request_id, delivery_status, started_at)
  VALUES (?, 'STARTED', NOW())
  ON DUPLICATE KEY UPDATE
    started_at = IF(
      delivery_status = 'NOT_STARTED',
      NOW(),
      started_at
    ),
    delivery_status = IF(
      delivery_status = 'NOT_STARTED',
      'STARTED',
      delivery_status
    )
`;

db.query(saveSQL, [requestId], (saveError) => {
  if (saveError) {
    console.log('Start delivery save error:', saveError.message);
    return res.status(500).json({
      message: 'Server error',
    });
  }

  return res.status(200).json({
    message: 'Delivery status saved successfully',
    requestId: Number(requestId),
  });
});
    }
  );
});




// ==================== EXPORT ROUTER ====================
// Router ko server.js mein use karne ke liye export kar rahe hain
module.exports = router;