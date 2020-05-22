// in Server.js will have everthings that starts
//in here we will listen to server
// database configuration, error handling stuff, env variable
const app = require('./app');
//starting server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});