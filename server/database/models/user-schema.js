const mongoose = require('mongoose');
const { array, number } = require('prop-types');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: false
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    budgets: {
        unique: false,
        type: Array,
        required: false,
        default:[{
            id: {type: Number, unique: true, required: false},
            title: {type: String, trim: false, required: false},
            budget: {type: Number, default: 0, required: false},
            used: {type: Number, default: 0, required: false}
        }]
    }
}, { minimize: false, collection: 'users'});

module.exports = mongoose.model('user', userSchema)