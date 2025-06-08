require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Course site backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});