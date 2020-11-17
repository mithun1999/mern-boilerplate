require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB CONNECTED");
});


//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);

//PORT
const port = 8000;


//Starting Server
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`);
});