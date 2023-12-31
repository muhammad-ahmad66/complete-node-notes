const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HANDLING GLOBAL UNCAUGHT EXCEPTIONS:
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥💥 Shutting down.');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);

    console.log('DB connection Successful');
  });
// .catch((err) => console.log('Error'));

// console.log(app.get('env')); // output: development

// console.log(process.env); // here we've bunch of diff variables.

const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

// HANDLING GLOBAL UNHANDLED REJECTIONS:
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥💥 Shutting down.');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
