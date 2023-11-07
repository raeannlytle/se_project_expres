const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', (r) => {
  console.log('connected to DB')}, e => console.log("DB error", e));

const routes = require('./routes');
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '65491b3290b7482b56d92e12'
  };
  next();
});


app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});