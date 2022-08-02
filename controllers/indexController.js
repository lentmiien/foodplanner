const { v4: uuidv4 } = require('uuid');

// Database
const { Food_scheduleModel, FoodModel, Regular_foodModel, Type_tagModel } = require('../database');

// Show and allow edit schedule (can only edit today and future entries), and allow rating food (last week until today)
exports.index = async (req, res) => {
  // Access data
  const foodSchedule = await Food_scheduleModel.find();
  const food = await FoodModel.find();
  const regularFood = await Regular_foodModel.find();
  const typeTag = await Type_tagModel.find();

  // Preprocess data
  const schedule = [];
  const schedule_lookup = [];
  let d = new Date(Date.now() - (1000*60*60*24*2));
  for (let i = 0; i < 10; i++) {
    const date_key = `${d.getFullYear()}-${d.getMonth() > 8 ? d.getMonth()+1 : '0' + (d.getMonth()+1)}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`;
    schedule.push({
      date: date_key,
      cook: null
    });
    schedule_lookup.push(date_key);

    d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
  }
  foodSchedule.forEach(f => {
    const date = new Date(f.date);
    const date_key = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth()+1 : '0' + (date.getMonth()+1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
    const index = schedule_lookup.indexOf(date_key);
    if (index >= 0) {
      schedule[index].cook = f.food_id;
    }
  });

  food.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0
  });

  const foodlookup = {};
  food.forEach(f => {
    foodlookup[f._id] = f.name;
  });

  const regular_lookup = [];
  regularFood.forEach(r => {
    regular_lookup.push(r.food_id);
  });

  const important_tags = [];
  typeTag.forEach(t => {
    if (t.important) important_tags.push(t.name);
  });

  // Render page
  res.render('index', { schedule, food, regular_lookup, important_tags, foodlookup });
};

// Rate food
exports.index_rate_food = async (req, res) => {
  // API endpoint
  // In: rating, food_id
  // TODO: Edit food rating
  // console.log(req.body);

  const food = await FoodModel.find();
  for (let i = 0; i < food.length; i++) {
    if (food[i]._id == req.body.food_id) {
      food[i].rating.push(req.body.rating);
      food[i].save();
    }
  }

  res.json({status: "OK"});
}

// Add schedule
exports.index_add_schedule = async (req, res) => {
  // API endpoint
  // In: date, food_id
  // TODO: Add or Edit DB entry

  // Update existing entry
  let newEntry = true;
  const foodSchedule = await Food_scheduleModel.find();
  for (let i = 0; i < foodSchedule.length; i++) {
    const d = new Date(foodSchedule[i].date);
    if (req.body.datestr === `${d.getFullYear()}-${d.getMonth() > 8 ? d.getMonth()+1 : '0' + (d.getMonth()+1)}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`) {
      foodSchedule[i].food_id = req.body.food_id;
      await foodSchedule[i].save();
      newEntry = false;
    }
  }

  // Add new entry
  if (newEntry) {
    const saveObject = {
      _id: uuidv4(),
      food_id: req.body.food_id,
      date: new Date(req.body.datestr)
    }
    await Food_scheduleModel.insertMany([saveObject]);
  }

  res.json({status: "OK"});
}

// Form for input new food in database
exports.add_food = async (req, res) => {
  const food = await FoodModel.find().select('name');
  const typeTag = await Type_tagModel.find();
  res.render('add_food', { food, typeTag });
};
exports.add_food_post = async (req, res) => {
  //- _id: { type: String, required: true },
  //- name: { type: String, required: true },
  //- ingredients: { type: Array, required: true },
  //- make: { type: Array, required: true },
  //- portions: { type: Number, required: true },
  //- minutes_to_make: { type: Number, required: true },
  //- rating: { type: Array, required: true },
  //- notes: { type: String, required: true },
  //- type_tags: { type: Array, required: true },
  //- image: { type: String, required: true },
  //- original: { type: String, required: true },
  const saveObject = {
    _id: uuidv4(),
    name: req.body.name,
    ingredients: [],
    make: [],
    portions: parseInt(req.body.portions),
    minutes_to_make: parseInt(req.body.minutes_to_make),
    rating: [],
    notes: req.body.notes,
    type_tags: [],
    image: req.body.image,
    original: req.body.original
  };
  let i;
  for (i = 0; `ingredient_input${i}` in req.body; i++) {
    if (req.body[`ingredient_input${i}`].length > 0 && req.body[`amount_input${i}`].length > 0) {
      saveObject.ingredients.push({
        name: req.body[`ingredient_input${i}`],
        amount: parseInt(req.body[`amount_input${i}`]),
        unit: req.body[`unit_input${i}`],
      });
    }
  }
  for (i = 0; `step_input${i}` in req.body; i++) {
    if (req.body[`step_input${i}`].length > 0) {
      saveObject.make.push(req.body[`step_input${i}`]);
    }
  }
  const uniqueTags = [];
  for (i = 0; `tag_input${i}` in req.body; i++) {
    if (req.body[`tag_input${i}`].length > 0) {
      const tag_name = req.body[`tag_input${i}`].toLowerCase();
      if (uniqueTags.indexOf(tag_name) === -1) {
        uniqueTags.push(tag_name);
        saveObject.type_tags.push(tag_name);
      }
    }
  }
  if ("rating" in req.body) {
    saveObject.rating.push(parseInt(req.body["rating"]));
  }
  await FoodModel.insertMany([saveObject]);

  // Check for and add new tags
  if (uniqueTags.length > 0) {
    const typeTag = await Type_tagModel.find();
    typeTag.forEach(db_tag => {
      const index = uniqueTags.indexOf(db_tag.name);
      if (index >= 0) {
        uniqueTags.splice(index, 1);
      }
    });
  }
  const saveTagsArray = [];
  uniqueTags.forEach(ut => {
    saveTagsArray.push({
      _id: uuidv4(),
      name: ut,
      important: false
    });
  });
  if (saveTagsArray.length > 0) {
    await Type_tagModel.insertMany(saveTagsArray);
  }

  res.redirect(`/`);
  // res.redirect(`/food_details?id=${saveObject.id}`);
};

// Show a detail page for the food, and allow editing notes (and other details if admin), if not in regular food then
// show link to add there, and if regular food is full ask user to select food to replace
exports.food_details = async (req, res) => {
  // Load DB
  const food = await FoodModel.find({ _id: req.query.id });
  const typeTag = await Type_tagModel.find();

  // Calculate average rating
  let total = 0;
  let count = 0;
  food[0].rating.forEach(r => {
    total += r;
    count++;
  });
  const rating = (count === 0 ? 'None' : Math.round(10 * total / count) / 10);

  // Render page
  res.render('food_details', { f: food[0], typeTag, rating });
};
exports.food_details_post = async (req, res) => {
  // console.log(req.body);
  //- _id: { type: String, required: true },
  //- name: { type: String, required: true },
  //- ingredients: { type: Array, required: true },
  //- make: { type: Array, required: true },
  //- portions: { type: Number, required: true },
  //- minutes_to_make: { type: Number, required: true },
  //- rating: { type: Array, required: true },
  //- notes: { type: String, required: true },
  //- type_tags: { type: Array, required: true },
  //- image: { type: String, required: true },
  //- original: { type: String, required: true },
  const saveObject = {
    _id: req.body._id,
    name: req.body.name,
    ingredients: [],
    make: [],
    portions: parseInt(req.body.portions),
    minutes_to_make: parseInt(req.body.minutes_to_make),
    rating: [],
    notes: req.body.notes,
    type_tags: [],
    image: req.body.image,
    original: req.body.original
  };
  let i;
  for (i = 0; `curr_ingredient${i}` in req.body; i++) {
    if (req.body[`curr_ingredient${i}`].length > 0 && req.body[`curr_amount${i}`].length > 0) {
      saveObject.ingredients.push({
        name: req.body[`curr_ingredient${i}`],
        amount: parseInt(req.body[`curr_amount${i}`]),
        unit: req.body[`curr_unit${i}`],
      });
    }
  }
  for (i = 0; `ingredient_input${i}` in req.body; i++) {
    if (req.body[`ingredient_input${i}`].length > 0 && req.body[`amount_input${i}`].length > 0) {
      saveObject.ingredients.push({
        name: req.body[`ingredient_input${i}`],
        amount: parseInt(req.body[`amount_input${i}`]),
        unit: req.body[`unit_input${i}`],
      });
    }
  }
  for (i = 0; `curr_step${i}` in req.body; i++) {
    if (req.body[`curr_step${i}`].length > 0) {
      saveObject.make.push(req.body[`curr_step${i}`]);
    }
  }
  for (i = 0; `step_input${i}` in req.body; i++) {
    if (req.body[`step_input${i}`].length > 0) {
      saveObject.make.push(req.body[`step_input${i}`]);
    }
  }
  const uniqueTags = [];
  for (i = 0; `curr_tag${i}` in req.body; i++) {
    if (req.body[`curr_tag${i}`].length > 0) {
      const tag_name = req.body[`curr_tag${i}`].toLowerCase();
      if (uniqueTags.indexOf(tag_name) === -1) {
        uniqueTags.push(tag_name);
        saveObject.type_tags.push(tag_name);
      }
    }
  }
  for (i = 0; `tag_input${i}` in req.body; i++) {
    if (req.body[`tag_input${i}`].length > 0) {
      const tag_name = req.body[`tag_input${i}`].toLowerCase();
      if (uniqueTags.indexOf(tag_name) === -1) {
        uniqueTags.push(tag_name);
        saveObject.type_tags.push(tag_name);
      }
    }
  }
  if ("rating" in req.body) {
    saveObject.rating.push(parseInt(req.body["rating"]));
  }
  const original_data = JSON.parse(req.body.json);
  original_data.rating.forEach(r => {
    saveObject.rating.push(r);
  });
  console.log(saveObject);
  await FoodModel.replaceOne({ _id: saveObject._id }, saveObject);

  // Check for and add new tags
  if (uniqueTags.length > 0) {
    const typeTag = await Type_tagModel.find();
    typeTag.forEach(db_tag => {
      const index = uniqueTags.indexOf(db_tag.name);
      if (index >= 0) {
        uniqueTags.splice(index, 1);
      }
    });
  }
  const saveTagsArray = [];
  uniqueTags.forEach(ut => {
    saveTagsArray.push({
      _id: uuidv4(),
      name: ut,
      important: false
    });
  });
  if (saveTagsArray.length > 0) {
    await Type_tagModel.insertMany(saveTagsArray);
  }

  res.redirect(`/`);
  // res.redirect(`/food_details?id=${saveObject._id}`);
};

// Show list of all regular food, with remove button to remove from list
exports.regular_food = async (req, res) => {
  const food = await FoodModel.find();
  const regularFood = await Regular_foodModel.find();
  const display_list = [];
  const regular_lookup = [];
  const regular_ids = [];
  regularFood.forEach(r => {
    regular_lookup.push(r.food_id);
    regular_ids.push(r._id);
  });
  food.forEach(f => {
    const index = regular_lookup.indexOf(f._id);
    display_list.push({
      name: f.name,
      food_id: f._id,
      is_regular: index >= 0 ? true : false,
      regular_id: index >= 0 ? regular_ids[index] : "null"
    });
  });
  display_list.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  res.render('regular_food', { display_list });
};
exports.regular_food_post = async (req, res) => {
  // API endpoint
  let new_id = "null";
  if (req.body.status === false) {
    await Regular_foodModel.deleteOne({ _id: req.body._id });
  } else {
    new_id = uuidv4();
    await Regular_foodModel.insertMany([{
      _id: new_id,
      food_id: req.body.food_id
    }]);
  }
  res.json({status: "OK", new_id });
};

// Show page with all tags and allow toggling of important flag (true/false)
exports.tags = async (req, res) => {
  const typeTag = await Type_tagModel.find();
  typeTag.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  res.render('tags', { typetags: typeTag });
};
exports.tags_post = async (req, res) => {
  // API endpoint
  const saveObject = {
    _id: req.body._id,
    name: undefined,
    important: req.body.important
  };
  await Type_tagModel.updateOne(
    { _id: saveObject._id },
    { $set: { important: saveObject.important }}
  );
  res.json({status: "OK"});
};

// Generate list of needed stuff based on food schedule (maybe with check boxes?)
exports.purchase_list = async (req, res) => {
  const foodSchedule = await Food_scheduleModel.find();
  const food = await FoodModel.find();

  const d_arr = [];
  let d = new Date();
  for (let i = 0; i <= 8 ; i++) {
    d_arr.push(`${d.getFullYear()}-${d.getMonth() > 8 ? d.getMonth()+1 : '0' + (d.getMonth()+1)}-${d.getDate() > 9 ? d.getDate() : '0' + d.getDate()}`);
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);
  }

  res.render('purchase_list', { foodSchedule, food, d_arr });
};

// A page for showing the recipe when cooking the food
exports.cook_page = async (req, res) => {
  const food = await FoodModel.find({ _id: req.query.id });
  res.render('cook_page', { f: food[0] });
};

// DEBUG: For clearing test data from DB
exports.delete_all = async (req, res) => {
  // await Food_scheduleModel.deleteMany();
  // await FoodModel.deleteMany();
  // await Regular_foodModel.deleteMany();
  // await Type_tagModel.deleteMany();
  res.redirect('/');
};

exports.about = async (req, res) => {
  res.render('about');
};
