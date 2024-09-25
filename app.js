const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const port = process.env.PORT || 8000;
const path = require('path');
const mongoose = require('mongoose');
const seedDb = require('./seedDb');
const URL ='mongodb+srv://sharmavis77:hExlSusGnybd2VPe@recipes.zieqa.mongodb.net/?retryWrites=true&w=majority&appName=recipes';
mongoose
  .connect(URL)
  // .connect('mongodb://127.0.0.1:27017/cookingBlog')
  .then(console.log('dbConnected'))
  .catch((e) => {
    console.log('db not Connected', e);
  });

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(cookieParser('CookingBlogSecure'));
app.use(
  session({
    secret: 'CookingBlogSecretSecure',
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// seedDb();
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => {
  console.log(`server connected at port ${port}`);
});
