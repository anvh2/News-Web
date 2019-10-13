var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var auth = require('./middlewares/auth');

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

require('./middlewares/view-engine')(app);

require('./middlewares/session')(app);
require('./middlewares/upload')(app);
require('./middlewares/passport')(app);
app.use(require('./middlewares/auth-locals.mdw'));
app.use(require('./middlewares/locals.mdw'));

app.use('/', require('./routes/general.route'));
app.use('/account', require('./routes/account.route'));
// app.use('/admin/category-manager', require('./routes/admin/category.route'));

app.use((req, res, next) => {
  res.render('404', { layout: false });
});

app.listen(8000, () => {
  console.log('server is running at http://localhost:8000');
});