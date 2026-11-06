// ADDED: Express ko import kar rahe hain (API route banane ke liye)
const express = require('express');

// ADDED: Existing MySQL connection reuse kar rahe hain (naya connection nahi bana rahe)
const db = require('../../config/db');

// ADDED: Router create kar rahe hain, server.js is ko '/api/residents' ke neeche mount karega
const router = express.Router();

// CHANGED: Radius ab 200 METERS hai (pehle 200 KM tha).
// Haversine formula KM mein distance deta hai, isliye 200 meters ko 0.2 KM mein convert kiya hai.
const MAX_DISTANCE_METERS = 200;

// CHANGED: 200 meters = 0.2 KM. Filter isi value par hoga (MAX_DISTANCE_KM pehle 200 tha).
const MAX_DISTANCE_KM = MAX_DISTANCE_METERS / 1000;

// ADDED: Earth ka average radius KM mein (Haversine formula ke liye)
const EARTH_RADIUS_KM = 6371;

// ADDED (Step 1): Agar ek resident ke kai relations hon to kaun sa status dikhana hai (bara number = zyada important)
const STATUS_PRIORITY = {
  REQUEST_RECEIVED: 1,
  REQUEST_SENT: 2,
  ALREADY_ADDED: 3,
};


// ======================================================
// HELPER FUNCTIONS
// ======================================================

// ADDED: Degrees ko radians mein convert karta hai (Haversine formula ko radians chahiye)
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// ADDED: Haversine formula - do coordinates ke beech distance KM mein nikalta hai (unchanged)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.pow(Math.sin(dLon / 2), 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}


// ======================================================
// GET NEARBY RESIDENTS API
// ======================================================

// ADDED: Frontend ka complete URL:
// http://localhost:5000/api/residents/nearby/:residentId
router.get('/nearby/:residentId', (req, res) => {

  // ADDED: Unexpected errors pakadne ke liye try/catch
  try {

    // ADDED: URL se logged-in resident ki ID receive kar rahe hain
    const { residentId } = req.params;

    // ADDED: ID valid hai ya nahi check kar rahe hain.
    // Sirf positive whole number allowed hai (e.g. 1, 25). "abc", "-1", "0", "1.5" reject honge.
    if (!/^[1-9]\d*$/.test(residentId)) {
      return res.status(400).json({
        message: 'Invalid resident ID',
      });
    }

    // ADDED: String ID ko number mein convert kar rahe hain
    const loggedInResidentId = Number(residentId);


    // ======================================================
    // STEP 1: LOGGED-IN RESIDENT AUR USKI LOCATION NIKALNA
    // ======================================================

    // ADDED: Is query se resident ki existence aur uski latest saved location dono milti hain.
    // LEFT JOIN use kiya hai taake "resident nahi mila" aur "location nahi mili"
    // dono cases alag alag pehchane ja sakein.
    // MAX(address_id) = latest address (ResidentHome.js mein bhi yahi tareeqa use hua hai).
    const residentSql = `
      SELECT
        u.user_id,
        a.latitude,
        a.longitude

      FROM User u

      LEFT JOIN Address a
        ON a.address_id = (
          SELECT MAX(address_id)
          FROM Address
          WHERE user_id = u.user_id
        )

      WHERE u.user_id = ?
        AND u.role = 'RESIDENT'
    `;

    db.query(residentSql, [loggedInResidentId], (residentError, residentRows) => {

      // ADDED: Database error aaye to server error return karenge
      if (residentError) {
        console.log('Nearby residents - resident lookup error:', residentError.message);

        return res.status(500).json({
          message: 'Server error',
        });
      }

      // ADDED: Is ID ka koi RESIDENT nahi mila
      if (residentRows.length === 0) {
        return res.status(404).json({
          message: 'Resident not found',
        });
      }

      const currentResident = residentRows[0];

      // ADDED: Resident mil gaya lekin uski koi location Address table mein saved nahi hai
      if (currentResident.latitude === null || currentResident.longitude === null) {
        return res.status(404).json({
          message: 'Resident location not found',
        });
      }

      // ADDED: MySQL DECIMAL values string aati hain, isliye Number() mein convert kar rahe hain
      const myLatitude = Number(currentResident.latitude);
      const myLongitude = Number(currentResident.longitude);


      // ======================================================
      // STEP 2: BAAKI RESIDENTS AUR UNKI LOCATIONS NIKALNA
      // ======================================================

      // ADDED: Doosre tamam RESIDENT users unki latest address ke saath.
      // INNER JOIN ki wajah se wo residents automatically skip ho jayenge jinki location saved nahi.
      // "u.user_id <> ?" se logged-in resident khud list se bahar rehta hai.
      // Login / online status ya last login check NAHI kiya jata, isliye logged-in aur logged-out dono aate hain.
      // Sensitive fields (email, password) select nahi kiye gaye.
      const nearbySql = `
        SELECT
          u.user_id,
          u.user_name,
          a.latitude,
          a.longitude,
          a.country,
          a.province,
          a.city,
          a.area,
          a.location_type

        FROM User u

        INNER JOIN Address a
          ON a.address_id = (
            SELECT MAX(address_id)
            FROM Address
            WHERE user_id = u.user_id
          )

        WHERE u.role = 'RESIDENT'
          AND u.user_id <> ?
      `;

      db.query(nearbySql, [loggedInResidentId], (nearbyError, nearbyRows) => {

        // ADDED: Database error handling
        if (nearbyError) {
          console.log('Nearby residents - list query error:', nearbyError.message);

          return res.status(500).json({
            message: 'Server error',
          });
        }


        // ======================================================
        // STEP 2B (ADDED IN STEP 1): ALTERNATE RELATION STATUS NIKALNA
        // ======================================================

        // ADDED (Step 1): Logged-in resident ke saath har doosre resident ka relation:
        // ALREADY_ADDED (accepted alternate), REQUEST_SENT (meri pending request),
        // REQUEST_RECEIVED (us ki pending request mujh ko aayi hui).
        // Isi se frontend button ki state (Send Request / Request Sent) decide karega.
        // Online/offline ya login status yahan bhi check nahi hota.
        const relationSql = `
          SELECT alternate_resident_id AS other_id, 'ALREADY_ADDED' AS state
          FROM ResidentAlternate
          WHERE resident_id = ?

          UNION ALL

          SELECT receiver_id AS other_id, 'REQUEST_SENT' AS state
          FROM AlternateRequest
          WHERE sender_id = ? AND status = 'PENDING'

          UNION ALL

          SELECT sender_id AS other_id, 'REQUEST_RECEIVED' AS state
          FROM AlternateRequest
          WHERE receiver_id = ? AND status = 'PENDING'
        `;

        db.query(
          relationSql,
          [loggedInResidentId, loggedInResidentId, loggedInResidentId],
          (relationError, relationRows) => {

            // ADDED (Step 1): Database error handling
            if (relationError) {
              console.log('Nearby residents - relation query error:', relationError.message);

              return res.status(500).json({
                message: 'Server error',
              });
            }

            // ADDED (Step 1): Lookup object banate hain, e.g. { 12: 'REQUEST_SENT', 20: 'ALREADY_ADDED' }.
            // Agar ek resident ke kai relations hon to sab se zyada priority wala rakhte hain.
            const statusByResident = {};

            relationRows.forEach((row) => {
              const currentState = statusByResident[row.other_id];

              if (!currentState || STATUS_PRIORITY[row.state] > STATUS_PRIORITY[currentState]) {
                statusByResident[row.other_id] = row.state;
              }
            });

            // ADDED: Callback ke andar bhi try/catch, taake calculation mein koi bug ho
            // to server crash na ho
            try {

              // ======================================================
              // STEP 3: DISTANCE CALCULATE, FILTER AUR SORT KARNA
              // ======================================================

              const nearbyResidents = nearbyRows
                // ADDED: Har resident ke liye Haversine distance (KM mein) calculate kar rahe hain
                .map((row) => {
                  const distance = calculateDistanceKm(
                    myLatitude,
                    myLongitude,
                    Number(row.latitude),
                    Number(row.longitude),
                  );

                  return {
                    user_id: row.user_id,
                    user_name: row.user_name,
                    country: row.country,
                    province: row.province,
                    city: row.city,
                    area: row.area,
                    location_type: row.location_type,
                    latitude: Number(row.latitude),
                    longitude: Number(row.longitude),
                    // Raw (unrounded) distance KM mein: filter aur sorting isi par hogi,
                    // response mein meters mein round karke bhejenge
                    rawDistance: distance,
                  };
                })
                // CHANGED: Sirf 200 METERS (0.2 KM) ke andar wale residents rakhe hain (pehle 200 KM tha).
                // Filter actual calculated distance par hai, rounding se PEHLE.
                .filter((resident) => resident.rawDistance <= MAX_DISTANCE_KM)
                // ADDED: Ascending order mein sort - sab se qareeb resident sab se pehle (unchanged)
                .sort((a, b) => a.rawDistance - b.rawDistance)
                // CHANGED: Final response shape - "distance_km" ki jagah "distance_meters".
                // Meters = Haversine KM result * 1000, nearest whole meter tak round (filter ke BAAD).
                .map((resident) => ({
                  user_id: resident.user_id,
                  user_name: resident.user_name,
                  country: resident.country,
                  province: resident.province,
                  city: resident.city,
                  area: resident.area,
                  location_type: resident.location_type,
                  latitude: resident.latitude,
                  longitude: resident.longitude,
                  distance_meters: Math.round(resident.rawDistance * 1000),
                  // ADDED (Step 1): Relation status - NONE / REQUEST_SENT / REQUEST_RECEIVED / ALREADY_ADDED
                  alternate_status: statusByResident[resident.user_id] || 'NONE',
                }));


              // ======================================================
              // STEP 4: RESPONSE BHEJNA
              // ======================================================

              // CHANGED: Koi nearby resident na mile to bhi 200 OK bhej rahe hain (empty list ke saath).
              // Message aur radius ab meters mein hain ("max_distance_km" ki jagah "max_distance_meters").
              if (nearbyResidents.length === 0) {
                return res.status(200).json({
                  message: `No registered residents found within ${MAX_DISTANCE_METERS} meters`,
                  max_distance_meters: MAX_DISTANCE_METERS,
                  count: 0,
                  residents: [],
                });
              }

              // CHANGED: Success response mein "max_distance_meters": 200 bheja ja raha hai
              return res.status(200).json({
                message: 'Nearby residents fetched successfully',
                max_distance_meters: MAX_DISTANCE_METERS,
                count: nearbyResidents.length,
                residents: nearbyResidents,
              });

            } catch (calculationError) {
              console.log('Nearby residents - calculation error:', calculationError.message);

              return res.status(500).json({
                message: 'Server error',
              });
            }
          },
        );
      });
    });

  } catch (error) {

    // ADDED: Koi unexpected error aaye to yahan handle hoga
    console.log('Nearby residents error:', error.message);

    return res.status(500).json({
      message: 'Server error',
    });
  }
});


// ADDED: Router export kar rahe hain taake server.js isay use kar sake
module.exports = router;