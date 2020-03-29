const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./DB.js');
const path = require('path');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useCreateIndex: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/users');
const imageRoutes = require('./api/routes/image');

app.use(passport.initialize());
require('./passport.js')(passport);

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + 'client/build/index.html'));
})
//}

app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/image/', imageRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server is running on Port:', port);
});