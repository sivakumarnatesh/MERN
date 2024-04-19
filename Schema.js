const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: String,
  email: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  city: String,
  state: String,
  country: String,
});

const StudentModel = mongoose.model('Student', StudentSchema);

module.exports = StudentModel;
