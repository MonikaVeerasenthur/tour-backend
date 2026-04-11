const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO;
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

// GET Contacts

router.get('/get', async (req, res) => {
  try {
    const contact = await Contact.find(); // get all bookings
    res.json({ status: 'success',  contact });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
});

// POST contact form submission

router.post("/create", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ status: "fail", message: "Missing fields" });
    }

    const contacts = new Contact(req.body);
    await contacts.save();

    // Format the message

    const waMsg = 
      `🎀New Message Received🎀\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Message: ${message}`;

    // Send WhatsApp message via Twilio

    await client.messages.create({
      body: waMsg,
      from: WHATSAPP_FROM,
      to: WHATSAPP_TO,
    });

    res.status(201).json({ status: "success", message: "Message sent successfully ✅", contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
});

module.exports = router;