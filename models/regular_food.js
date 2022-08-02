const mongoose = require('mongoose');

const Regular_food = new mongoose.Schema({
  _id: { type: String, required: true },
  food_id: { type: String, required: true },
});

module.exports = mongoose.model('regular_food', Regular_food);
