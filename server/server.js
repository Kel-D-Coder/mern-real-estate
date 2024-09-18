const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connect = require('./db/mongo');
const Router = require('./routes/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: 'http://localhost:3000' ,
    credentials: true
}));
app.use('/', Router);

app.listen('8080', () => {
    console.log("Server is running on port 8080...");
    connect()
})