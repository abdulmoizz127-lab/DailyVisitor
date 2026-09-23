// ==================== EXPRESS IMPORT ====================
// Express ko API route banane ke liye use kar rahe hain
const express = require('express');

// ==================== DATABASE IMPORT ====================
// MySQL database se notification data lene ke liye database connection import kar rahe hain
const db = require('../../config/db');

// ==================== ROUTER CREATE ====================
// Resident notification ke liye separate router bana rahe hain
const router = express.Router();


// ==================== GET RESIDENT NOTIFICATIONS ====================
// Logged-in resident ki ACCEPTED aur REJECTED service requests fetch karenge
router.get('/notifications/:userId', (req, res) => {

  // ==================== GET RESIDENT USER ID ====================
  // URL se logged-in resident ka userId receive kar rahe hain
  const {userId} = req.params;

  // ==================== CHECK RESIDENT USER ID ====================
  // Agar resident userId nahi mila to request reject karenge
  if (!userId) {
    return res.status(400).json({
      message: 'Resident user ID is required',
    });
  }

  // ==================== GET RESIDENT NOTIFICATIONS ====================
  // Resident ki ACCEPTED aur REJECTED requests database se nikal rahe hain
  const notificationSQL = `
    SELECT
      sr.request_id,
      sr.start_date,
      sr.selected_days,
      sr.from_time,
      sr.to_time,
      sr.status,
      sr.created_at,

      u.user_id AS provider_user_id,
      u.user_name AS provider_name,

      s.service,

      a.city AS provider_city,
      a.area AS provider_area

    FROM ServiceRequest sr

    INNER JOIN ServiceProvider sp
      ON sr.provider_id = sp.provider_id

    INNER JOIN User u
      ON sp.user_id = u.user_id

    INNER JOIN Service s
      ON sr.service_id = s.service_id

    LEFT JOIN Address a
      ON a.address_id = (
        SELECT MAX(address_id)
        FROM Address
        WHERE user_id = sp.user_id
      )

    WHERE sr.resident_id = ?
      AND sr.status IN ('ACCEPTED', 'REJECTED')

    ORDER BY sr.created_at DESC
  `;

  // ==================== RUN DATABASE QUERY ====================
  // Resident ke userId ke basis par notification records search kar rahe hain
  db.query(
    notificationSQL,
    [userId],
    (error, results) => {

      // ==================== DATABASE ERROR ====================
      // Database query mein error aaye to server error return karenge
      if (error) {

        console.log(
          'Resident notification error:',
          error.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }

      // ==================== NOTIFICATION RESULTS ====================
      // Database se milne wali notifications console mein check kar rahe hain
      console.log(
        'Resident notifications:',
        results
      );

      // ==================== SEND NOTIFICATIONS ====================
      // Accepted/rejected notifications frontend ko bhej rahe hain
      return res.status(200).json({
        message: 'Resident notifications fetched successfully',
        notifications: results,
      });
    }
  );
});


// ==================== EXPORT ROUTER ====================
// Is router ko server.js mein use karne ke liye export kar rahe hain
module.exports = router;