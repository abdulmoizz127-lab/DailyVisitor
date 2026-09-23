const express = require('express');
const db = require('../../config/db');

const router = express.Router();

router.post('/signup', (req, res) => {

  const {
    email,
    password,
    confirmPassword,
    fullName,
    contactNo,
    gender,
    serviceRadius,

    // ==================== SERVICE PRICE ====================
    // Provider ki service price frontend se receive kar rahe hain
    servicePrice,

    latitude,
    longitude,
    locationName,
    country,
    province,
    city,
    locationType,
    service,
    days,
    timeSlots

  } = req.body;


  // Check required fields
  if (
    !email ||
    !password ||
    !confirmPassword ||
    !fullName ||
    !contactNo ||
    !gender ||
    !serviceRadius ||

    // ==================== CHECK SERVICE PRICE ====================
    // Service price bhi required hai
    !servicePrice ||

    latitude === undefined ||
    longitude === undefined ||
    !locationName ||
    !country ||
    !province ||
    !city ||
    !service ||
    !days ||
    !timeSlots
  ) {
    return res.status(400).json({
      message: 'Please fill all required fields'
    });
  }


  // Check password
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }


  // Check email
  const checkSql =
    'SELECT user_id FROM User WHERE user_email = ?';

  db.query(checkSql, [email], (err, results) => {

    if (err) {
      console.log('Email check error:', err.message);

      return res.status(500).json({
        message: 'Server error'
      });
    }


    if (results.length > 0) {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }


    // Insert User
    const userSql = `
      INSERT INTO User
      (user_name, user_email, user_password, gender, contact_no, role)
      VALUES (?, ?, ?, ?, ?, 'PROVIDER')
    `;

    db.query(
      userSql,
      [
        fullName,
        email,
        password,
        gender,
        contactNo
      ],
      (err, result) => {

        if (err) {
          console.log('User insert error:', err.message);

          return res.status(500).json({
            message: 'User creation failed'
          });
        }


        const userId = result.insertId;


        // Find Service
        const serviceSql = `
          SELECT service_id
          FROM Service
          WHERE service = ?
        `;

        db.query(
          serviceSql,
          [service],
          (err, serviceResults) => {

            if (err) {
              console.log(
                'Service search error:',
                err.message
              );

              return res.status(500).json({
                message: 'Service search failed'
              });
            }


            if (serviceResults.length === 0) {
              return res.status(400).json({
                message: 'Service not found'
              });
            }


            const serviceId =
              serviceResults[0].service_id;


            // ==================== SET PRICE UNIT ====================
            // Selected service ke according price ki unit set kar rahe hain
            let priceUnit = 'Collection';

            if (service === 'Milkman') {
              priceUnit = 'Liter';
            }

            if (service === 'Newspaper') {
              priceUnit = 'Newspaper';
            }

            if (service === 'Garbage Collector') {
              priceUnit = 'Collection';
            }


            // ==================== INSERT SERVICE PROVIDER ====================
            // Provider ki service, radius, price aur price unit database mein save kar rahe hain
            const providerSql = `
              INSERT INTO ServiceProvider
              (
                user_id,
                service_id,
                service_radius_km,
                service_price,
                price_unit
              )
              VALUES (?, ?, ?, ?, ?)
            `;


            db.query(
              providerSql,
              [
                userId,
                serviceId,
                serviceRadius,

                // ==================== SAVE SERVICE PRICE ====================
                // Provider ki entered price database mein save kar rahe hain
                servicePrice,

                // ==================== SAVE PRICE UNIT ====================
                // Price ki unit bhi database mein save kar rahe hain
                priceUnit
              ],
              (err, providerResult) => {

                if (err) {
                  console.log(
                    'ServiceProvider insert error:',
                    err.message
                  );

                  return res.status(500).json({
                    message:
                      'Service provider creation failed'
                  });
                }


                const providerId =
                  providerResult.insertId;


                // Insert Address
                const addressSql = `
                  INSERT INTO Address
                  (
                    user_id,
                    latitude,
                    longitude,
                    country,
                    province,
                    city,
                    area,
                    location_type
                  )
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                  addressSql,
                  [
                    userId,
                    latitude,
                    longitude,
                    country,
                    province,
                    city,
                    locationName,
                    locationType
                  ],
                  (err, addressResult) => {

                    if (err) {
                      console.log(
                        'Address insert error:',
                        err.message
                      );

                      return res.status(500).json({
                        message:
                          'Address creation failed'
                      });
                    }


                    const addressId =
                      addressResult.insertId;

                    console.log(
                      'Address created:',
                      addressId
                    );


                    // Insert Shift
                    const shiftSql = `
                      INSERT INTO Shift
                      (provider_id, day, start_time, end_time)
                      VALUES (?, ?, ?, ?)
                    `;


                    const totalSlots = days.reduce(
                      (total, currentDay) => {

                        return total +
                          (timeSlots[currentDay] || [])
                            .length;

                      },
                      0
                    );


                    if (totalSlots === 0) {
                      return res.status(400).json({
                        message:
                          'Please add at least one time slot'
                      });
                    }


                    let totalShifts = 0;
                    let shiftError = false;


                    days.forEach((day) => {

                      const slots =
                        timeSlots[day] || [];


                      slots.forEach((slot) => {

                        const [startTime, endTime] =
                          slot.split(' - ');


                        db.query(
                          shiftSql,
                          [
                            providerId,
                            day,
                            startTime,
                            endTime
                          ],
                          (err) => {

                            if (err) {

                              console.log(
                                'Shift insert error:',
                                err.message
                              );

                              if (!shiftError) {

                                shiftError = true;

                                return res.status(500).json({
                                  message:
                                    'Shift creation failed'
                                });
                              }

                              return;
                            }


                            totalShifts++;


                            if (
                              totalShifts === totalSlots &&
                              !shiftError
                            ) {

                              res.status(201).json({

                                message:
                                  'Visitor signup successful!',

                                userId:
                                  userId,

                                providerId:
                                  providerId,

                                addressId:
                                  addressId,

                                shifts:
                                  totalShifts
                              });

                            }

                          }
                        );

                      });

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

});


module.exports = router;