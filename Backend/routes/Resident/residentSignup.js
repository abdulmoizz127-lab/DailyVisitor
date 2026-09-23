// Express framework ko import kar rahe hain.
// Express ki help se backend API routes banate hain.
const express = require('express');

// bcrypt password hashing ke liye use hota hai.
// Tumhare current code mein hashing wali line commented hai,
// isliye abhi bcrypt actually use nahi ho raha.
const bcrypt = require('bcryptjs');

// MySQL database connection import kar rahe hain.
// 'db' ke through hum MySQL queries execute karenge.
const db = require('../../config/db');

// Express ka router create kar rahe hain.
// Is router ke andar Resident ki APIs define hongi.
const router = express.Router();


// ======================================================
// RESIDENT SIGNUP API
// ======================================================

// Frontend se POST request '/signup' par aayegi.
// Frontend ka complete URL hai:
// http://localhost:5000/api/residents/signup
//
// req = frontend ki request
// res = backend ka response jo frontend ko wapas bhejna hai
router.post('/signup', async (req, res) => {

  // Ye console mein show karega ke Resident Signup API call hui hai.
  console.log('Resident signup API called');

  // req.body mein frontend se bheja gaya signup data hota hai.
  console.log('Signup data:', req.body);


  // ======================================================
  // FRONTEND SE AAYA HUA DATA RECEIVE KARNA
  // ======================================================

  // req.body se values nikal kar individual variables mein store kar rahe hain.
  //
  // Ye values frontend ke fetch() ke body se aa rahi hain.
  const {
    email,
    password,
    confirmPassword,
    fullName,
    contactNo,
    gender,
    latitude,
    longitude,
    locationName,
    country,
    province,
    city,
    locationType
  } = req.body;


  // ======================================================
  // REQUIRED FIELDS CHECK
  // ======================================================

  // Backend check kar raha hai ke required fields empty/missing to nahi hain.
  //
  // Agar koi required field missing ho:
  // backend request ko reject karega aur 400 response bhejega.
  if (
    !email ||
    !password ||
    !confirmPassword ||
    !fullName ||
    !contactNo ||
    !gender ||
    latitude === undefined ||
    longitude === undefined ||
    !locationName
  ) {

    // 400 = Bad Request.
    // Matlab frontend ne required data complete nahi bheja.
    return res.status(400).json({
      message: 'Please fill all required fields'
    });
  }


  // ======================================================
  // PASSWORD CONFIRMATION CHECK
  // ======================================================

  // Password aur Confirm Password ko compare kar rahe hain.
  // Agar dono same nahi hain to signup stop ho jayega.
  if (password !== confirmPassword) {

    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }


  try {

    // ======================================================
    // DATABASE MEIN EMAIL CHECK KARNA
    // ======================================================

    // Ye SQL query User table mein check karegi
    // ke provided email already exist karti hai ya nahi.
    const checkSql =
      'SELECT user_id FROM User WHERE user_email = ?';


    // checkSql query MySQL ko bhej rahe hain.
    //
    // [email] mein frontend se aayi hui email ki actual value
    // '?' placeholder ki jagah use hogi.
    db.query(checkSql, [email], async (err, results) => {


      // Agar database se email check karte waqt error aaye,
      // to signup process stop ho jayega.
      if (err) {

        console.log('Email check error:', err.message);

        // 500 = Server Error.
        return res.status(500).json({
          message: 'Server error'
        });
      }


      // Agar results.length > 0 hai,
      // iska matlab ye email User table mein already maujood hai.
      if (results.length > 0) {

        // 409 = Conflict.
        // Matlab same email pehle se database mein exist karti hai.
        return res.status(409).json({
          message: 'Email already exists'
        });
      }


      // ======================================================
      // PASSWORD HASHING
      // ======================================================

      // Password hashing currently disabled hai.
      //
      // Ye line agar active hoti to password hash hota.
      // Lekin current code mein ye commented hai,
      // isliye neeche User table mein original password use ho raha hai.
      //
      // const hashedPassword = await bcrypt.hash(password, 10);


      // ======================================================
      // USER TABLE MEIN RESIDENT INSERT KARNA
      // ======================================================

      // User table mein new resident create karne ke liye SQL query.
      const userSql = `
        INSERT INTO User
        (user_name, user_email, user_password, gender, contact_no, role)
        VALUES (?, ?, ?, ?, ?, 'RESIDENT')
      `;


      // User table mein data insert kar rahe hain.
      //
      // '?' placeholders ki values:
      //
      // 1st ? = fullName
      // 2nd ? = email
      // 3rd ? = password
      // 4th ? = gender
      // 5th ? = contactNo
      //
      // role ko directly 'RESIDENT' set kiya gaya hai.
      db.query(
        userSql,
        [fullName, email, password, gender, contactNo],
        (err, result) => {


          // Agar User table mein insert karte waqt error aaye.
          if (err) {

            console.log('User insert error:', err.message);

            return res.status(500).json({
              message: 'User creation failed'
            });
          }


          // ======================================================
          // NEW USER KI ID RECEIVE KARNA
          // ======================================================

          // MySQL new User record ki generated ID
          // result.insertId mein return karta hai.
          //
          // Is ID ko userId variable mein store kar rahe hain.
          const userId = result.insertId;


          // ======================================================
          // ADDRESS TABLE MEIN LOCATION INSERT KARNA
          // ======================================================

          // Ab resident ki location Address table mein save karne
          // ke liye SQL query bana rahe hain.
          const addressSql = `
            INSERT INTO Address
            (user_id, latitude, longitude, country, province, city, area, location_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;


          // Address table mein location data insert kar rahe hain.
          //
          // '?' placeholders ki values:
          //
          // 1st ? = userId
          // 2nd ? = latitude
          // 3rd ? = longitude
          // 4th ? = country
          // 5th ? = province
          // 6th ? = city
          // 7th ? = locationName
          // 8th ? = locationType
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


              // Agar Address table mein location insert karte waqt error aaye.
              if (err) {

                console.log('Address insert error:', err.message);

                return res.status(500).json({
                  message: 'Address creation failed'
                });
              }


              // ======================================================
              // SUCCESS RESPONSE
              // ======================================================

              // User aur Address dono successfully database mein
              // insert ho gaye hain.
              //
              // Ab backend frontend ko success response bhej raha hai.
              //
              // 201 = Successfully Created.
              res.status(201).json({

                // Frontend ko success message bhej rahe hain.
                message: 'Resident signup successful!',

                // Newly created User ki ID frontend ko bhej rahe hain.
                userId: userId,

                // Newly created Address ki ID frontend ko bhej rahe hain.
                addressId: addressResult.insertId
              });

            }
          );

        }
      );

    });

  } catch (error) {

    // Agar try block ke andar unexpected error aaye
    // to yahan error handle hoga.
    console.log('Signup error:', error.message);

    // Frontend ko signup failed ka response bhej rahe hain.
    res.status(500).json({
      message: 'Signup failed'
    });
  }
});


// Ye router main server file ko export kar rahe hain
// taake server.js is Resident Signup route ko use kar sake.
module.exports = router;