const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbURI = 'mongodb://localhost:27017/animal-finder';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  likedAnimals: [String], // store animal IDs
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password, likedAnimals: [] });
  await newUser.save();
  res.status(201).json(newUser);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/animals', async (req, res) => {
  const response = await axios.get('https://api.petfinder.com/v2/animals', {
    headers: { Authorization: `Bearer ${process.env.PETFINDER_API_KEY}` }
  });
  res.json(response.data.animals);
});

app.post('/like', async (req, res) => {
  const { userId, animalId } = req.body;
  const user = await User.findById(userId);
  user.likedAnimals.push(animalId);
  await user.save();
  res.json(user);
});

app.get('/liked-animals/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.likedAnimals);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});