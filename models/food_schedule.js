const mongoose = require('mongoose');

const Food_schedule = new mongoose.Schema({
  _id: { type: String, required: true },
  food_id: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('food_schedule', Food_schedule);
