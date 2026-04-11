require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require("./db/connect");
db();

const contactRoutes = require('./routes/contactRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();

// Middleware

app.use(cors());
app.use(express.json()); 

// API routes

app.use('/travel/contact', contactRoutes);
app.use('/travel/booking', bookingRoutes);
app.use('/travel/cruise/enquiry', enquiryRoutes);
// app.use("/travel", (req, res, next) => {
//   const originalJson = res.json;
//   res.json = function (body) {
//     if (body && body.status === "fail" && body.message === "Authenticate") {
//       console.log(">> FAIL AUTHENTICATE FROM:", req.method, req.path, req.headers);
//     }
//     originalJson.call(this, body);
//   };
//   next();
// });

// Root endpoint

app.get('/', (req, res) => {
  res.send('Welcome to Vibe Miles Tour App');
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));