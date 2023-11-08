const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', (e) => {
  if (e) {
    console.error('DB error', e);
  }
});

app.use((req, res, next) => {
  req.user = {
    _id: '65491b3290b7482b56d92e12'
  };
  next();
});


app.use(express.json());
app.use(routes);



app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});