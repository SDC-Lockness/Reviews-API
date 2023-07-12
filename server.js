const express = require('express');
const app = express();
const port = 3008; // You can change the port number if needed

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port https:/localhost:${port}`);
});