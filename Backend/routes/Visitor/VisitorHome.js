// ==================== EXPRESS IMPORT ====================
// Express ko API route banane ke liye use kar rahe hain
const express = require('express');

// ==================== DATABASE IMPORT ====================
// MySQL database ke saath kaam karne ke liye database connection import kar rahe hain
const db = require('../../config/db');

// ==================== ROUTER CREATE ====================
// Provider Home ke liye router bana rahe hain
const router = express.Router();


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
    }
  );
});


// ==================== EXPORT ROUTER ====================
// Router ko server.js mein use karne ke liye export kar rahe hain
module.exports = router;