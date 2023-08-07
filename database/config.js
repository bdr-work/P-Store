const mongoose = require("mongoose");

const databaseConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database connection ${conn.connection.host}`);
  });
  //.catch((err)=>{
  //  console.log(`Database Error ${err}`);
  //  process.exit(1);
  // })
};
module.exports = databaseConnection;
