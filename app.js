const express = require('express');
const session = require('express-session');
const router = require('./routes')

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));


app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});