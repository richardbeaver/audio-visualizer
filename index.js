const express = require('express');
const morgan = require('morgan');

const HOST = 'localhost';
const PORT = 3000;

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// ======================
// ======================

// Error handler
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${PORT} of ${HOST}.`);
});
