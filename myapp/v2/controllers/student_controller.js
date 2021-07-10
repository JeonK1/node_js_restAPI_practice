const jwt = require("jsonwebtoken");
const Student = require("../models/student_model");
require('dotenv').config();

// Create
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    } else {
        // validate access token
        let access_token = req.get("jwt-access-token");
        jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err){
                // invalid acccess token
                res.status(403).send({
                    message: err.message
                });
            } else {
                // valid access token
                // Create Student
                const student = new Student({
                    name: req.body.name,
                    grade: req.body.grade,
                    is_delete: req.body.is_delete,
                });

                // Save in database
                Student.create(student)
                    .then(result => {
                        res.send(result);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message
                        });
                    });
            }
        });
    }
};

// Update
exports.update = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    } else {
        // validate access token
        let access_token = req.get("jwt-access-token");
        jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err){
                // invalid acccess token
                res.status(403).send({
                    message: err.message
                });
            } else {
                // valid access token
                // Update in database
                Student.updateById(req.params.studentId, new Student(req.body))
                    .then(result => {
                        res.send(result);
                    })
                    .catch(err => {
                        if(err.message === "not_found"){
                            res.status(404).send({
                                message: `Not found Student with id ${req.params.studentId}`
                            });
                        } else {
                            res.status(500).send({
                                message: `Error updating Student with id ${req.params.studentId}`
                            });
                        }
                    });
            }
        });
    }
};

// Retrieve all
exports.findAll = (req, res) => {
    Student.getAll()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Retrieve by Id
exports.findOne = (req, res) => {
    Student.findById(req.params.studentId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            if(err.message === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.studentId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.studentId}`
                });
            }
        });
};

// Delete
exports.delete = (req, res) => {
    // validate access token
    let access_token = req.get("jwt-access-token");
    jwt.verify(access_token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if(err){
            // invalid acccess token
            res.status(403).send({
                message: err.message
            });
        } else {
            // valid access token
            // remove student in database
            Student.remove(req.params.studentId)
                .then(result => {
                    res.send({
                        message: "Student delete successfully!"
                    });
                })
                .catch(err => {
                    if(err.kind === "not_found"){
                        res.status(404).send({
                            message: `Not found Student with id ${req.params.studentId}`
                        });
                    } else {
                        res.status(500).send({
                            message: "Could not delete Student with id" + req.params.studentId
                        });
                    }
                });
        }
    });
};