
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Serve your index.html file when someone accesses the root URL

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.use(express.static(__dirname));
