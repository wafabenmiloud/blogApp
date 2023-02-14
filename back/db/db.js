const mongoose = require("mongoose");
 

const Connection = (username,password) => {
  const URL = `mongodb+srv://${username}:${password}@blog-app.ngmedr4.mongodb.net/?retryWrites=true&w=majority`;
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected ...')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
  }
};
module.exports = Connection;
