// in Server.js will have everthings that starts
//in here we will listen to server
// database configuration, error handling stuff, env variable
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// const puppeteer = require('puppeteer-core');
// (async () => {
//   const browser = await puppeteer.launch({
//     executablePath: '/usr/bin/chromium-browser',
//     headless: false,
//   });
//   const page = await browser.newPage();
//   await page.goto('https://google.com');
//   await page.screenshot({ path: 'example.png' });

//   await browser.close();
// })();
