// ==================== EXPRESS IMPORT ====================
// Express ko API route banane ke liye use kar rahe hain
const express = require('express');

// ==================== DATABASE IMPORT ====================
// MySQL database ke saath kaam karne ke liye database connection import kar rahe hain
const db = require('../../config/db');

// ==================== ROUTER CREATE ====================
// Resident services ke liye router bana rahe hain
const router = express.Router();


// ==================== GET RESIDENT ACCEPTED SERVICES ====================
// Logged-in resident ki ACCEPTED service requests fetch karenge
router.get('/accepted-services/:residentId', (req, res) => {

  // ==================== GET RESIDENT ID ====================
  // URL se resident ka userId receive kar rahe hain
  const {residentId} = req.params;

  // ==================== CHECK RESIDENT ID ====================
  // Agar residentId nahi mila to request reject karenge
  if (!residentId) {
    return res.status(400).json({
      message: 'Resident ID is required',
    });
  }

  // ==================== GET ACCEPTED SERVICES ====================
  // Sirf logged-in resident ki ACCEPTED requests database se nikal rahe hain
  const servicesSQL = `
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
      AND sr.status = 'ACCEPTED'

    ORDER BY sr.start_date ASC, sr.from_time ASC
  `;

  // ==================== RUN DATABASE QUERY ====================
  // Resident ke ID ke basis par accepted services search kar rahe hain
  db.query(
    servicesSQL,
    [residentId],
    (error, results) => {

      // ==================== DATABASE ERROR ====================
      // Database query mein error aaye to server error return karenge
      if (error) {

        console.log(
          'Resident accepted services error:',
          error.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }

      // ==================== LOG ACCEPTED SERVICES ====================
      // Testing ke liye database se aane wala data console mein show kar rahe hain
      console.log(
        'Resident accepted services:',
        results
      );


      // ==================== GET RESIDENT SERVICE DAYS ====================
      // Accepted service requests ke selected_days se unique days nikal rahe hain
      const serviceDays = [];

      results.forEach(service => {

        // ==================== CHECK SELECTED DAYS ====================
        // Agar service request mein selected days available nahi hain to skip karenge
        if (!service.selected_days) {
          return;
        }

        // ==================== SPLIT SELECTED DAYS ====================
        // Database ke selected_days ko comma separated days mein divide kar rahe hain
        const days = String(service.selected_days)
          .split(',')
          .map(day => day.trim())
          .filter(Boolean);

        // ==================== ADD UNIQUE DAYS ====================
        // Sirf unique days serviceDays array mein add kar rahe hain
        days.forEach(day => {

          const alreadyExists = serviceDays.some(
            existingDay =>
              existingDay.toLowerCase() ===
              day.toLowerCase()
          );

          if (!alreadyExists) {
            serviceDays.push(day);
          }
        });
      });


      // ==================== SORT SERVICE DAYS ====================
      // Days ko Monday se Sunday ke proper order mein arrange kar rahe hain
      const weekOrder = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];

      serviceDays.sort(
        (a, b) =>
          weekOrder.indexOf(a) -
          weekOrder.indexOf(b)
      );


      // ==================== LOG SERVICE DAYS ====================
      // Testing ke liye resident ke available service days console mein show kar rahe hain
      console.log(
        'Resident service days:',
        serviceDays
      );


      /* ==================== GET ACCEPTED REQUEST IDS ==================== */
      /* Accepted services ki request_id nikal rahe hain taake un ke items fetch kar sakein */

      const requestIds = results.map(
        service => service.request_id
      );


      /* ==================== NO ACCEPTED SERVICES ==================== */
      /* Agar koi accepted service nahi hai to items query ki zaroorat nahi,
         isliye pehle jaisa hi response bhej rahe hain */

      if (requestIds.length === 0) {

        return res.status(200).json({
          message: 'Resident accepted services fetched successfully',
          services: results,
          serviceDays: serviceDays,
        });
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
              'Resident service items error:',
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


          // ==================== SEND ACCEPTED SERVICES AND DAYS ====================
          // Accepted services ke saath service days bhi frontend ko bhej rahe hain
          return res.status(200).json({
            message: 'Resident accepted services fetched successfully',
            services: results,
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