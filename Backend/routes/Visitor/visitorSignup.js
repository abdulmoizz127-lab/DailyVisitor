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

    // ==================== SERVICE PRICING ====================
    // Frontend se different services ki pricing receive kar rahe hain
    products,
    newspapers,
    newspaperPrices,
    garbagePrice,

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


  // ==================== CHECK REQUIRED FIELDS ====================
  // Basic signup fields ko check kar rahe hain
  if (
    !email ||
    !password ||
    !confirmPassword ||
    !fullName ||
    !contactNo ||
    !gender ||
    !serviceRadius ||
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


  // ==================== CHECK PASSWORD ====================
  // Password aur confirm password same hone chahiye
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }


  // ==================== CHECK SERVICE PRICE ====================
  // Selected service ke according pricing validate kar rahe hain

  if (service === 'Milkman') {

    if (
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: 'Please select at least one milk product'
      });
    }


    for (const product of products) {

      if (
        !product.name ||
        !product.price ||
        !product.unit
      ) {
        return res.status(400).json({
          message:
            'Please enter price for all selected milk products'
        });
      }

    }

  }


  if (service === 'Newspaper') {

    if (
      !Array.isArray(newspapers) ||
      newspapers.length === 0
    ) {
      return res.status(400).json({
        message: 'Please select at least one newspaper'
      });
    }


    if (!newspaperPrices) {
      return res.status(400).json({
        message:
          'Please enter prices for selected newspapers'
      });
    }


    for (const newspaper of newspapers) {

      if (
        !newspaperPrices[ newspaper ] ||
        Number(newspaperPrices[ newspaper ]) <= 0
      ) {
        return res.status(400).json({
          message:
            'Please enter price for all selected newspapers'
        });
      }

    }

  }


  if (service === 'Garbage Collector') {

    if (
      garbagePrice === null ||
      garbagePrice === undefined ||
      Number(garbagePrice) <= 0
    ) {
      return res.status(400).json({
        message:
          'Please enter garbage collection price'
      });
    }

  }


  // ==================== CHECK EMAIL ====================
  // Check kar rahe hain ke email pehle se database mein hai ya nahi
  const checkSql =
    'SELECT user_id FROM User WHERE user_email = ?';

  db.query(checkSql, [email], (err, results) => {

    if (err) {

      console.log(
        'Email check error:',
        err.message
      );

      return res.status(500).json({
        message: 'Server error'
      });

    }


    // ==================== EMAIL ALREADY EXISTS ====================
    // Agar email already registered hai to signup stop kar denge
    if (results.length > 0) {

      return res.status(409).json({
        message: 'Email already exists'
      });

    }


    // ==================== INSERT USER ====================
    // Provider ki basic information User table mein save kar rahe hain
    const userSql = `
      INSERT INTO User
      (
        user_name,
        user_email,
        user_password,
        gender,
        contact_no,
        role
      )
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

          console.log(
            'User insert error:',
            err.message
          );

          return res.status(500).json({
            message: 'User creation failed'
          });

        }


        const userId = result.insertId;


        // ==================== FIND SERVICE ====================
        // Selected service ka service_id database se find kar rahe hain
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


            // ==================== SERVICE NOT FOUND ====================
            // Agar selected service database mein nahi hai
            if (serviceResults.length === 0) {

              return res.status(400).json({
                message: 'Service not found'
              });

            }


            const serviceId =
              serviceResults[0].service_id;


            // ==================== INSERT SERVICE PROVIDER ====================
            // Provider ki service aur radius save kar rahe hain
            const providerSql = `
              INSERT INTO ServiceProvider
              (
                user_id,
                service_id,
                service_radius_km
              )
              VALUES (?, ?, ?)
            `;


            db.query(
              providerSql,
              [
                userId,
                serviceId,
                serviceRadius
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


                // ==================== INSERT SERVICE PRICES ====================
                // Selected service ki individual prices ProviderServicePrice table mein save kar rahe hain

                let priceRows = [];


                // ==================== MILK PRICE ROWS ====================
                // Milkman ke har selected product ki separate price row banayenge
                if (service === 'Milkman') {

                  priceRows = products.map((product) => {

                    return [
                      providerId,
                      product.name,
                      product.price,
                      product.unit
                    ];

                  });

                }


                // ==================== NEWSPAPER PRICE ROWS ====================
                // Har selected newspaper ki individual price row banayenge
                if (service === 'Newspaper') {

                  priceRows = newspapers.map((newspaper) => {

                    return [
                      providerId,
                      newspaper,
                      newspaperPrices[newspaper],
                      'piece'
                    ];

                  });

                }


                // ==================== GARBAGE PRICE ROW ====================
                // Garbage ki single per-KG price save kar rahe hain
                if (service === 'Garbage Collector') {

                  priceRows = [
                    [
                      providerId,
                      'Garbage Collector',
                      garbagePrice,
                      'Kg'
                    ]
                  ];

                }


                // ==================== INSERT PRICE DATA ====================
                // Multiple pricing rows ek saath database mein insert kar rahe hain
                const priceSql = `
                  INSERT INTO ProviderServicePrice
                  (
                    provider_id,
                    item_name,
                    price,
                    price_unit
                  )
                  VALUES ?
                `;


                db.query(
                  priceSql,
                  [priceRows],
                  (err) => {

                    if (err) {

                      console.log(
                        'Service price insert error:',
                        err.message
                      );

                      return res.status(500).json({
                        message:
                          'Service price creation failed'
                      });

                    }


                    // ==================== INSERT ADDRESS ====================
                    // Provider ki location Address table mein save kar rahe hain
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


                        // ==================== INSERT SHIFT ====================
                        // Provider ke selected days aur time slots Shift table mein save kar rahe hain
                        const shiftSql = `
                          INSERT INTO Shift
                          (
                            provider_id,
                            day,
                            start_time,
                            end_time
                          )
                          VALUES (?, ?, ?, ?)
                        `;


                        // ==================== COUNT TOTAL SLOTS ====================
                        // Sab selected days ke total time slots count kar rahe hain
                        const totalSlots = days.reduce(
                          (total, currentDay) => {

                            return total +
                              (
                                timeSlots[currentDay] || []
                              ).length;

                          },
                          0
                        );


                        // ==================== CHECK TIME SLOT ====================
                        // Kam az kam ek time slot required hai
                        if (totalSlots === 0) {

                          return res.status(400).json({
                            message:
                              'Please add at least one time slot'
                          });

                        }


                        let totalShifts = 0;
                        let shiftError = false;


                        // ==================== INSERT EACH DAY ====================
                        // Har selected day ke time slots database mein insert kar rahe hain
                        days.forEach((day) => {

                          const slots =
                            timeSlots[day] || [];


                          // ==================== INSERT EACH TIME SLOT ====================
                          // Har individual time slot ko Shift table mein save kar rahe hain
                          slots.forEach((slot) => {

                            const [
                              startTime,
                              endTime
                            ] = slot.split(' - ');


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


                                // ==================== SIGNUP SUCCESS ====================
                                // Jab tamam shifts successfully save ho jayein to response send kar rahe hain
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

      }
    );

  });

});


module.exports = router;