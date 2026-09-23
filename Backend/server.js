const express = require('express');

const app = express();

const PORT = 5000;

// MySQL connection
const db = require('./config/db');

app.use(express.json());
          // ====================  ROUTE ====================
          // API ko main server ke saath connect kar rahe hain

// Resident routes
const residentSignup = require('./routes/Resident/residentSignup');
app.use('/api/residents', residentSignup);
const residentLogin = require('./routes/Resident/residentLogin');
app.use('/api/residents', residentLogin);
const findProvider = require('./routes/Resident/findProvider');
app.use('/api/residents', findProvider);
const serviceRequest = require('./routes/Resident/serviceRequest');
app.use('/api/residents', serviceRequest);
const residentNotification = require('./routes/Resident/ResidentNotification');
app.use('/api/residents', residentNotification);
const residentHome = require('./routes/Resident/ResidentHome');
app.use('/api/residents', residentHome);

// Visitor routes
const visitorSignup = require('./routes/Visitor/visitorSignup');
app.use('/api/visitors', visitorSignup);
const visitorLogin = require('./routes/Visitor/visitorLogin');
app.use('/api/visitors', visitorLogin);
const visitorNotification = require('./routes/Visitor/VisitorNotification');
app.use('/api/visitors', visitorNotification);
const visitorHome = require('./routes/Visitor/VisitorHome');
app.use('/api/visitors', visitorHome);

app.get('/', (req, res) => {
  res.send('Daily Visitor Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});