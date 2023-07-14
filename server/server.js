const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());


// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port https:/localhost:${port}`);
});