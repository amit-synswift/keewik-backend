const express = require('express');
const app = express();
const configurationService = require('./services/ConfigurationService');
var cors = require('cors');
const UserRouter = require('./routes/users');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', UserRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

app.listen(3001, () =>
    console.log('App is listening on port 3001!'),
);
