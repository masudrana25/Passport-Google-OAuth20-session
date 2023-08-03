require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;
mongoose.connect('mongodb://127.0.0.1:27017/passport_google_auth20')
  .then(() => {
    console.log('MongoDb is connected');
  })
   .catch((error) => {
     console.log(error.message);
     process.exit(1);
  })
  