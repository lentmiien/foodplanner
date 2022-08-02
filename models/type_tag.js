const mongoose = require('mongoose');

const Type_tag = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  important: { type: Boolean, required: true },
});

module.exports = mongoose.model('type_tag', Type_tag);
