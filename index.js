const app = require('./app');
require('dotenv').config();
const PORT = process.env.PORT || 3400;


app.listen(3300, () => {
  console.log('Server running successfully on port ' + PORT);
})