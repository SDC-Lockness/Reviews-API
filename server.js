const express = require('express');
require('dotenv').config();


const app = express();
const port = process.env.PORT; // You can change the port number if needed

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port https:/localhost:${port}`);
});