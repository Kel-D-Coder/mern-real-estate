const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('connected to database')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connect