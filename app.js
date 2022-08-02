require('dotenv').config();

const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: false }));
app.use(express.static('public'));

// Define routes, using router-controller
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Run app
const PORT = 3000;
app.listen(PORT, () => console.log(`Running server http://localhost:${PORT}`));
