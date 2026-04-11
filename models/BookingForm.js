const mongoose = require('mongoose');

const BookingFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: Number, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  country:  { type: String, required: true },
  noOfMembers: { type: Number, required: true }, 
  message: { type: String, required: true }
});

module.exports = mongoose.model('Booking', BookingFormSchema);