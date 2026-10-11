const express = require('express');
const db = require('../../config/db');

const router = express.Router();


// ==================== SEND SERVICE REQUEST ====================
// Resident ki selected subscription information ko database mein
// PENDING request ke taur par save karenge

router.post('/service-request', (req, res) => {

  console.log('Service Request API called');
  console.log('Request data:', req.body);


  // ==================== REQUEST DATA ====================
  // Frontend se request ki required information receive kar rahe hain
  const {
    residentId,
    providerId,
    serviceType,
    startDate,
    selectedDays,
    serviceGroups,
    fromTime,
    toTime,
  } = req.body;


  // ==================== REQUIRED DATA CHECK ====================
  // Check kar rahe hain ke request ke liye sari required information available hai
  if (
    !residentId ||
    !providerId ||
    !serviceType ||
    !startDate ||
    !selectedDays ||
    selectedDays.length === 0 ||
    !fromTime ||
    !toTime
  ) {

    return res.status(400).json({
      message: 'Required request data is missing',
    });
  }


  /* ==================== SERVICE GROUPS CHECK ==================== */
  /* Service groups zaroori hain taake har group ServiceRequestItem mein save ho sake */

  if (
    !Array.isArray(serviceGroups) ||
    serviceGroups.length === 0
  ) {

    return res.status(400).json({
      message: 'Service groups are missing',
    });
  }


  /* ==================== PREPARE SERVICE REQUEST ITEMS ==================== */
  /* Har group ke har item ki alag row banai ja rahi hai.
     selected_days us specific group ke days hain, overall selectedDays nahi.
     request_id insert ke baad lagayi jayegi. */

  const weekOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const itemRows = [];

  for (const group of serviceGroups) {

    const groupDays = weekOrder.filter(day =>
      Array.isArray(group.days) && group.days.includes(day)
    );

    if (groupDays.length === 0) {

      return res.status(400).json({
        message: 'Every service group must have days selected',
      });
    }

    if (!Array.isArray(group.items) || group.items.length === 0) {

      return res.status(400).json({
        message: 'Every service group must have at least one item',
      });
    }

    for (const item of group.items) {

      const quantity = Number(item.quantity);

      if (!item.item_name || !(quantity > 0)) {

        return res.status(400).json({
          message: 'Every item must have a name and a valid quantity',
        });
      }

      itemRows.push([
        groupDays.join(','),
        item.item_name,
        quantity,
      ]);

    }

  }


  // ==================== FIND SERVICE ====================
  // Service name se Service table ki service_id find kar rahe hain
  const serviceSQL = `
    SELECT service_id
    FROM Service
    WHERE service = ?
    LIMIT 1
  `;


  db.query(
    serviceSQL,
    [serviceType],
    (serviceError, serviceResults) => {

      if (serviceError) {

        console.log(
          'Service lookup error:',
          serviceError.message
        );

        return res.status(500).json({
          message: 'Server error',
        });
      }


      // ==================== SERVICE NOT FOUND ====================
      // Agar requested service database mein nahi mili
      if (serviceResults.length === 0) {

        return res.status(404).json({
          message: 'Service not found',
        });
      }


      const serviceId = serviceResults[0].service_id;


      // ==================== SELECTED DAYS FOR DATABASE ====================
      // Array ko comma-separated text mein convert kar rahe hain
      const selectedDaysText = selectedDays.join(',');


      // ==================== INSERT SERVICE REQUEST ====================
      // Request ko database mein PENDING status ke saath save kar rahe hain
      const insertSQL = `
        INSERT INTO ServiceRequest
        (
          resident_id,
          provider_id,
          service_id,
          start_date,
          selected_days,
          from_time,
          to_time,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `;


      db.query(
        insertSQL,
        [
          residentId,
          providerId,
          serviceId,
          startDate,
          selectedDaysText,
          fromTime,
          toTime,
        ],
        (insertError, insertResult) => {

          if (insertError) {

            console.log(
              'Service request insert error:',
              insertError.message
            );

            return res.status(500).json({
              message: 'Request could not be saved',
            });
          }


          // ==================== REQUEST CREATED ====================
          // Database mein request successfully create ho gayi
          console.log(
            'Service request created:',
            insertResult.insertId
          );


          /* ==================== SAVE SERVICE REQUEST ITEMS ==================== */
          /* Service groups ko ServiceRequestItem table mein save kar rahe hain.
             Har row mein naya request_id lagaya ja raha hai. */

          const requestId = insertResult.insertId;

          const itemValues = itemRows.map(row => [
            requestId,
            row[0],
            row[1],
            row[2],
          ]);

          const insertItemsSQL = `
            INSERT INTO ServiceRequestItem
            (
              request_id,
              selected_days,
              item_name,
              quantity
            )
            VALUES ?
          `;


          db.query(
            insertItemsSQL,
            [itemValues],
            (itemsError) => {

              if (itemsError) {

                console.log(
                  'Service request items insert error:',
                  itemsError.message
                );

                /* ==================== REMOVE INCOMPLETE REQUEST ==================== */
                /* Items save na hon to adhoori request delete kar dete hain */

                db.query(
                  'DELETE FROM ServiceRequest WHERE request_id = ?',
                  [requestId],
                  () => {

                    return res.status(500).json({
                      message: 'Request could not be saved',
                    });

                  }
                );

                return;
              }


              return res.status(201).json({

                message: 'Service request sent successfully',

                // ==================== REQUEST ID ====================
                // Newly created request ki ID frontend ko return kar rahe hain
                requestId: requestId,

                // ==================== REQUEST STATUS ====================
                // Initial request status PENDING hai
                status: 'PENDING',
              });

            }
          );

        }
      );
    }
  );
});


module.exports = router;