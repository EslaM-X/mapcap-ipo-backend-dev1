const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// اتصال بقاعدة البيانات - MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MapCapIPO DB Connected'))
  .catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
