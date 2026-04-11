const express = require("express");
const router = express.Router();
const Booking = require("../models/BookingForm");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

// GET bookings

router.get("/get", async (req, res) => {
  try {
    const bookings = await Booking.find(); // get all bookings
    res.json({ status: "success", bookings });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// POST contact form submission

router.post("/create", async (req, res) => {
  try {
    const { name, email, contact, startDate, endDate, country, noOfMembers, message } = req.body;
    if (!name || !email || !contact || !startDate || !endDate || !country || !noOfMembers || !message) {
      return res.status(400).json({ status: "fail", message: "Missing fields" });
    }

    const bookings = new Booking(req.body);
    await bookings.save();

    // Format the message

    const waMsg = 
      `🎉New Booking Details🎉\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Contact: ${contact}\n` +
      `Start Date: ${startDate}\n` +
      `End Date: ${endDate}\n` +
      `Country: ${country}\n` +
      `No. of Members: ${noOfMembers}\n` +
      `Message: ${message}`;

    // Send WhatsApp message via Twilio

    await client.messages.create({
      body: waMsg,
      from: WHATSAPP_FROM,
      to: WHATSAPP_TO,
    });

    res.status(201).json({ status: "success", message: "Booking confirmed ✅" ,bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
});

module.exports = router;