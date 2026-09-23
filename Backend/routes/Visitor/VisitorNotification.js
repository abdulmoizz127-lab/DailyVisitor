// ==================== EXPRESS IMPORT ====================
// Express ko API routes banane ke liye use kar rahe hain
const express = require('express');

// ==================== DATABASE IMPORT ====================
// MySQL database ke saath kaam karne ke liye database connection import kar rahe hain
const db = require('../../config/db');

// ==================== ROUTER CREATE ====================
// Visitor notification ke liye router bana rahe hain
const router = express.Router();


// ==================== GET PROVIDER NOTIFICATIONS ====================
// Logged-in provider ki PENDING service requests database se fetch karenge
router.get('/notifications/:userId', (req, res) => {

  // ==================== GET PROVIDER USER ID ====================
  // URL se logged-in provider ka userId receive kar rahe hain
  const {userId} = req.params;

  // ==================== CHECK PROVIDER USER ID ====================
  // Agar provider userId nahi mila to request reject karenge
  if (!userId) {
    return res.status(400).json({
      message: 'Provider user ID is required',
    });
  }

  // ==================== GET PENDING REQUESTS ====================
  // Sirf logged-in provider ki PENDING requests database se nikal rahe hain
  const notificationSQL = `
    SELECT
      sr.request_id,
      sr.start_date,
      sr.selected_days,
      sr.from_time,
      sr.to_time,
      sr.status,
      sr.created_at,

      u.user_id AS resident_id,
      u.user_name AS resident_name,

      s.service,

      a.city,
      a.area

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
      AND sr.status = 'PENDING'

    ORDER BY sr.created_at DESC
  `;

  // ==================== RUN NOTIFICATION QUERY ====================
  // Provider ke userId ke basis par pending requests search kar rahe hain
  db.query(
    notificationSQL,
    [userId],
    (error, results) => {

      // ==================== DATABASE ERROR ====================
      // Database query mein problem aaye to server error bhejenge
      if (error) {
        console.log(
          'Provider notification error:',
          error.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }

      // ==================== SEND NOTIFICATIONS ====================
      // Pending requests frontend ko bhej rahe hain
      return res.status(200).json({
        message: 'Provider notifications fetched successfully',
        notifications: results,
      });
    }
  );
});


// ==================== UPDATE REQUEST STATUS ====================
// Provider ki Accept ya Reject action ko database mein save karenge
router.put('/notifications/:requestId/status', (req, res) => {

  // ==================== GET REQUEST ID ====================
  // URL se jis service request par action hua uska requestId le rahe hain
  const {requestId} = req.params;

  // ==================== GET NEW STATUS ====================
  // Frontend se ACCEPTED ya REJECTED status receive kar rahe hain
  const {status} = req.body;

  // ==================== CHECK REQUIRED DATA ====================
  // RequestId aur status dono hona zaroori hain
  if (!requestId || !status) {
    return res.status(400).json({
      message: 'Request ID and status are required',
    });
  }

  // ==================== CHECK VALID STATUS ====================
  // Sirf ACCEPTED aur REJECTED status allow kar rahe hain
  if (status !== 'ACCEPTED' && status !== 'REJECTED') {
    return res.status(400).json({
      message: 'Invalid request status',
    });
  }

  // ==================== UPDATE SERVICE REQUEST ====================
  // ServiceRequest table mein PENDING ko ACCEPTED ya REJECTED mein change karenge
  const updateSQL = `
    UPDATE ServiceRequest
    SET status = ?
    WHERE request_id = ?
      AND status = 'PENDING'
  `;

  // ==================== RUN UPDATE QUERY ====================
  // Database mein request ka status update kar rahe hain
  db.query(
    updateSQL,
    [status, requestId],
    (error, result) => {

      // ==================== DATABASE ERROR ====================
      // Database update mein problem aaye to server error bhejenge
      if (error) {
        console.log(
          'Request status update error:',
          error.message
        );

        return res.status(500).json({
          message: 'Request status could not be updated',
        });
      }

      // ==================== REQUEST NOT FOUND ====================
      // Agar request PENDING nahi thi ya requestId galat tha
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Pending request not found',
        });
      }

      // ==================== STATUS UPDATED ====================
      // Provider ka action successfully database mein save ho gaya
      console.log(
        `Request ${requestId} status changed to ${status}`
      );

      // ==================== SEND SUCCESS RESPONSE ====================
      // Frontend ko batate hain ke action successfully complete hua
      return res.status(200).json({
        message: `Request ${status.toLowerCase()} successfully`,
        requestId: requestId,
        status: status,
      });
    }
  );
});


// ==================== EXPORT ROUTER ====================
// Router ko server.js mein use karne ke liye export kar rahe hain
module.exports = router;