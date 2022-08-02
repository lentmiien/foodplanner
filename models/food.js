const mongoose = require('mongoose');

const Food = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  ingredients: { type: Array, required: true },
  make: { type: Array, required: true },
  portions: { type: Number, required: true },
  minutes_to_make: { type: Number, required: true },
  rating: { type: Array, required: false },
  notes: { type: String, required: false },
  type_tags: { type: Array, required: true },
  image: { type: String, required: false },
  original: { type: String, required: false },
});

module.exports = mongoose.model('food', Food);
