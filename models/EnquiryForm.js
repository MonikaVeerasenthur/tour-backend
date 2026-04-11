const mongoose = require('mongoose');

const EnquiryFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: Number, required: true }, 
  message: { type: String, required: true }
});

module.exports = mongoose.model('Enquiry', EnquiryFormSchema);