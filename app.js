const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const {login, createUser} = require('./controllers/users');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db', (e) => {
  if (e) {
    console.error('DB error', e);
  }
});

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(routes);



app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});