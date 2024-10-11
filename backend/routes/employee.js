// routes/employee.js
const express = require('express');
const Employee = require('../models/Employee');
const multer = require('multer');

const router = express.Router();

// Set up multer for file uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid name conflicts
    }
});

const upload = multer({ storage });

// Get all employees
router.get('/get-employee', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Add a new employee
router.post('/add', upload.single('employeeImage'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, course, department, address } = req.body;
    let employeeImage = req.file.path; // Get the uploaded file path

    // Normalize the path by replacing backslashes with forward slashes
    employeeImage = employeeImage.replace(/\\/g, '/');

    try {
        const newEmployee = new Employee({
            employeeName: name,
            email,
            mobileNo,
            designation,
            gender,
            course,
            department,
            address,
            employeeImage // Store normalized path
        });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update an existing employee
router.put('/update/:id', upload.single('employeeImage'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, course, department, address } = req.body;
    const employeeImage = req.file ? req.file.path : undefined; // Check if a new file is uploaded

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
            employeeName: name,
            email,
            mobileNo,
            designation,
            gender,
            course,
            department,
            address,
            employeeImage: employeeImage || undefined // Update image if a new one is uploaded
        }, { new: true });

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an employee
router.delete('/delete/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
