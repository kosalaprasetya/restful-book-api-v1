require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.SERVER_PORT;
const routes = require('./routes/index.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(routes); //access here for the routes

app.listen(port, () => {
  console.log(`App up and running on http://localhost:${port}`);
});
