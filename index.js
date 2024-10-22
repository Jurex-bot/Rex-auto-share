const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
