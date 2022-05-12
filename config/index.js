const mongoose = require("mongoose");

const connectWithDb = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB CONNECTED"))
    .catch((error) => {
      console.log("DB IS NOT ABLE TO CONNECT");
      console.log(error);
      process.exit(1);
    });
}

module.exports = connectWithDb;