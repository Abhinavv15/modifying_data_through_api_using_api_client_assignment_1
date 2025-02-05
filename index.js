const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const Schema = require('./schema');

require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));

mongoose.connect(process.env.mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.post('/menu', async (req, res) => {
  try {
      const { name, description, price } = req.body;
      if (!name || price === undefined) {
          return res.status(400).json({ error: 'Name and price are required.' });
      }

      const newItem = new MenuItem({ name, description, price });
      const savedItem = await newItem.save();
      res.status(201).json({ message: 'Menu item created successfully.', item: savedItem });
  } catch (err) {
      res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

app.get('/menu', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch menu items.' });
    }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
