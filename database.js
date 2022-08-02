const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);

// Set up default mongoose connection
const url = process.env.DB_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Food_scheduleModel = require('./models/food_schedule');
const FoodModel = require('./models/food');
const Regular_foodModel = require('./models/regular_food');
const Type_tagModel = require('./models/type_tag');

// Export models
module.exports = {
  Food_scheduleModel,
  FoodModel,
  Regular_foodModel,
  Type_tagModel,
};
