const express = require("express");
const router = express.Router();
const Enquiry = require("../models/EnquiryForm");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

// GET bookings

router.get("/get", async (req, res) => {
  try {
    const enquires = await Enquiry.find(); // get all bookings
    res.json({ status: "success", enquires });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

// POST contact form submission

router.post("/create", async (req, res) => {
  try {
    const { name, email, contact, message } = req.body;
    if (!name || !email || !contact || !message) {
      return res.status(400).json({ status: "fail", message: "Missing fields" });
    }

    const enquires = new Enquiry(req.body);
    await enquires.save();

    // Format the message

    const waMsg = 
      `❓New Enquiry Received For Cruise Details❓\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Contact: ${contact}\n` +
      `Message: ${message}`;

    // Send WhatsApp message via Twilio

    await client.messages.create({
      body: waMsg,
      from: WHATSAPP_FROM,
      to: WHATSAPP_TO,
    });

    res.status(201).json({ status: "success", message: "Enquiry Sent ✅", enquires });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
});

module.exports = router;