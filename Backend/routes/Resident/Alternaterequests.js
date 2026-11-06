// ADDED (Step 1): Express import - API route banane ke liye
const express = require('express');

// ADDED (Step 1): Existing MySQL connection reuse kar rahe hain
const db = require('../../config/db');

// ADDED (Step 1): Router create kar rahe hain, server.js isay '/api/residents' ke neeche mount karega
const router = express.Router();

// ADDED (Step 1): Sirf positive whole number ID allowed hai (e.g. 5, 42). "abc", "0", "-1", "1.5" reject honge
const ID_REGEX = /^[1-9]\d*$/;

// ADDED (Step 1): Agar sender-receiver ke darmiyan kai relations milen to kaun sa status dikhana hai.
// Bara number = zyada important.
const STATE_PRIORITY = {
  REQUEST_RECEIVED: 1,
  REQUEST_SENT: 2,
  ALREADY_ADDED: 3,
};

// ADDED (Step 1): Har state ke liye user ko dikhane wala message
const STATE_MESSAGES = {
  ALREADY_ADDED: 'This resident is already your alternate',
  REQUEST_SENT: 'A request to this resident is already pending',
  REQUEST_RECEIVED:
    'This resident has already sent you a request. Check Notifications.',
};


// ======================================================
// SEND ALTERNATE REQUEST API
// ======================================================

// ADDED (Step 1): Complete URL:
// POST http://192.168.100.10:5000/api/residents/alternate-requests
// Body (JSON): { "sender_id": 5, "receiver_id": 12 }
router.post('/alternate-requests', (req, res) => {

  // ADDED (Step 1): Unexpected errors pakadne ke liye try/catch
  try {

    // ADDED (Step 1): Body se sender aur receiver ki IDs le rahe hain
    const { sender_id, receiver_id } = req.body || {};

    // ADDED (Step 1): Dono IDs valid positive numbers honi chahiye
    if (!ID_REGEX.test(String(sender_id)) || !ID_REGEX.test(String(receiver_id))) {
      return res.status(400).json({
        message: 'Valid sender_id and receiver_id are required',
      });
    }

    const senderId = Number(sender_id);
    const receiverId = Number(receiver_id);

    // ADDED (Step 1): Resident khud ko request nahi bhej sakta
    if (senderId === receiverId) {
      return res.status(400).json({
        message: 'You cannot send an alternate request to yourself',
      });
    }


    // ======================================================
    // STEP 1: DONO USERS REGISTERED RESIDENT HAIN YA NAHI
    // ======================================================

    // ADDED (Step 1): Sirf role = RESIDENT users ginay jayenge (PROVIDER reject ho jayega).
    // Agar dono mil gaye to rows.length 2 hogi.
    const residentsSql = `
      SELECT user_id
      FROM User
      WHERE role = 'RESIDENT'
        AND user_id IN (?, ?)
    `;

    db.query(residentsSql, [senderId, receiverId], (residentsError, residentRows) => {

      // ADDED (Step 1): Database error handling
      if (residentsError) {
        console.log('Alternate request - resident check error:', residentsError.message);

        return res.status(500).json({
          message: 'Server error',
        });
      }

      // ADDED (Step 1): Dono mein se koi ek bhi registered resident nahi
      if (residentRows.length !== 2) {
        return res.status(404).json({
          message: 'Sender or receiver is not a registered resident',
        });
      }


      // ======================================================
      // STEP 2: PEHLE SE RELATION YA PENDING REQUEST TO NAHI?
      // ======================================================

      // ADDED (Step 1): Teen cheezein check hoti hain:
      // 1) Receiver pehle se sender ka alternate hai
      // 2) Sender ki receiver ko pehle se PENDING request hai
      // 3) Receiver ne sender ko pehle se PENDING request bheji hui hai
      const existingSql = `
        SELECT 'ALREADY_ADDED' AS state
        FROM ResidentAlternate
        WHERE resident_id = ? AND alternate_resident_id = ?

        UNION ALL

        SELECT 'REQUEST_SENT' AS state
        FROM AlternateRequest
        WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'

        UNION ALL

        SELECT 'REQUEST_RECEIVED' AS state
        FROM AlternateRequest
        WHERE sender_id = ? AND receiver_id = ? AND status = 'PENDING'
      `;

      const existingParams = [
        senderId, receiverId,
        senderId, receiverId,
        receiverId, senderId,
      ];

      db.query(existingSql, existingParams, (existingError, existingRows) => {

        // ADDED (Step 1): Database error handling
        if (existingError) {
          console.log('Alternate request - existing check error:', existingError.message);

          return res.status(500).json({
            message: 'Server error',
          });
        }

        // ADDED (Step 1): Agar koi relation mila to sab se important state choose karke 409 (Conflict) bhejte hain
        if (existingRows.length > 0) {
          let bestState = existingRows[0].state;

          existingRows.forEach((row) => {
            if (STATE_PRIORITY[row.state] > STATE_PRIORITY[bestState]) {
              bestState = row.state;
            }
          });

          return res.status(409).json({
            message: STATE_MESSAGES[bestState],
            alternate_status: bestState,
          });
        }


        // ======================================================
        // STEP 3: NEW PENDING REQUEST SAVE KARNA
        // ======================================================

        // ADDED (Step 1): Status DEFAULT 'PENDING' hai, is liye sirf sender aur receiver insert karte hain
        const insertSql = `
          INSERT INTO AlternateRequest (sender_id, receiver_id)
          VALUES (?, ?)
        `;

        db.query(insertSql, [senderId, receiverId], (insertError, insertResult) => {

          // ADDED (Step 1): Agar do requests ek saath aayen to database ki UNIQUE key doosri ko rok deti hai.
          // Ye "repeated API calls" se bachne ki aakhri hifazat hai.
          if (insertError && insertError.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
              message: STATE_MESSAGES.REQUEST_SENT,
              alternate_status: 'REQUEST_SENT',
            });
          }

          // ADDED (Step 1): Baaki database errors
          if (insertError) {
            console.log('Alternate request - insert error:', insertError.message);

            return res.status(500).json({
              message: 'Server error',
            });
          }

          // ADDED (Step 1): Success - 201 Created
          return res.status(201).json({
            message: 'Alternate request sent successfully',
            alternate_status: 'REQUEST_SENT',
            request: {
              request_id: insertResult.insertId,
              sender_id: senderId,
              receiver_id: receiverId,
              status: 'PENDING',
            },
          });
        });
      });
    });

  } catch (error) {

    // ADDED (Step 1): Koi unexpected error aaye to yahan handle hoga
    console.log('Alternate request error:', error.message);

    return res.status(500).json({
      message: 'Server error',
    });
  }
});


// ADDED (Step 1): Router export kar rahe hain taake server.js isay use kar sake
module.exports = router;