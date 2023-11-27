const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const { login, createUser } = require('./controllers/users');

const app = express();
const { PORT = 3001 } = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/wtwr_db';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (error) {
    console.error('Failed to connect to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

app.use(cors());
app.use(express.json());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
