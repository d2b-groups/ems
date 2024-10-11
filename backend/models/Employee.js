const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    employeeImage: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true // Add department field
    },
    address: {
        type: String,
        required: true // Add address field
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
