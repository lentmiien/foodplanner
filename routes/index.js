var express = require('express');
var router = express.Router();

// Require controller module
var controller = require('../controllers/indexController');

// Routes
router.get('/', controller.index);
router.post('/add_rate_post', controller.index_rate_food);
router.post('/add_schedule_post', controller.index_add_schedule);
router.get('/add_food', controller.add_food);
router.post('/add_food_post', controller.add_food_post);
router.get('/food_details', controller.food_details);
router.post('/food_details_post', controller.food_details_post);
router.get('/regular_food', controller.regular_food);
router.post('/regular_food_post', controller.regular_food_post);
router.get('/tags', controller.tags);
router.post('/tags_post', controller.tags_post);
router.get('/purchase_list', controller.purchase_list);
router.get('/cook_page', controller.cook_page);

router.get('/delete', controller.delete_all);

router.get('/about', controller.about);

module.exports = router;
