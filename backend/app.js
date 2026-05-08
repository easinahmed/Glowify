const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Update with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));

// Middleware
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

module.exports = app;
