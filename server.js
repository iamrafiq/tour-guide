// in Server.js will have everthings that starts
//in here we will listen to server
// database configuration, error handling stuff, env variable
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  //must be declare before : const app = require('./app');
  console.log('form server.js UNCAUGHT REJECTION 🔥', 'shutting down....');
  console.log(err);
  process.exit(1); // 0-for success, 1-for uncaught exception
});

dotenv.config({ path: './config.env' });
/**
 * require the app must be after dotenv and dotenvconfig
 * because we are using one of dotenv configuration in app.js
 * if(process.env.NODE_ENV==='development'){
 * other wise it will not work for app.js
 */

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD_ATLAS
);

//local db connection
/*mongoose
  .connect(process.env.DATABASE_LOCAL, {
    usedNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => console.log('DB connection successful'));*/
mongoose
  .connect(DB, {
    usedNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(`DB connection successful ${con.path}`);
  });

//starting server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

/**UnhandledPromiseRejection Error:
 * Database can not stublish connection: such as wrong password
 * Any time, form any where of the code promise can get rejected
 * 
 * Each time there is an unhandled rejection somewhere in our applicaion, then the process
 * object will emit an object called unhandled rejection, so we can subscribe to the event just 
 * like :process.on('unhandleRejection', err=>{})

 */
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('form server.js UNHANDLED REJECTION 🔥', 'shutting down....');
  server.close(() => {
    // first close the server, then exit application(optional)
    process.exit(1); // 0-for success, 1-for uncaught exception
  });
});
