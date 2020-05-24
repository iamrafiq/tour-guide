// in Server.js will have everthings that starts
//in here we will listen to server
// database configuration, error handling stuff, env variable
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
/**
 * require the app mustbe after dotenv and dotenvconfig
 * because we are using one of dotenv configuration in app.js
 * if(process.env.NODE_ENV==='development'){
 * other wise it will not work for app.js
 */

const app = require('./app');
//starting server

//console.log(app.get('env'));
//console.log(process.env)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
