const jwt = require("jsonwebtoken");
const Student = require("../models/student_model");

// Create
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(400).send({
            message: "content can not be empty"
        });
    } else {
        // validate access token
        let access_token = req.get("jwt-access-token");
        jwt.verify(access_token, "jwtsecret", (err, payload) => {
            if(err){
                // invalid acccess token
                res.status(500).send({
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
                Student.create(student, (err, data) => {
                    if(err){
                        res.status(500).send({
                            message: err.message
                        });
                    } else {
                        res.send(data);
                    }
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
        res.status(400).send({
            message: "content can not be empty"
        });
    } else {
        // validate access token
        let access_token = req.get("jwt-access-token");
        jwt.verify(access_token, "jwtsecret", (err, payload) => {
            if(err){
                // invalid acccess token
                res.status(500).send({
                    message: err.message
                });
            } else {
                // valid access token
                // Update in database
                Student.updateById(req.params.studentId, new Student(req.body), (err, data) => {
                    if(err){
                        if(err.kind === "not_found"){
                            res.status(404).send({
                                message: `Not found Student with id ${req.params.studentId}`
                            });
                        } else {
                            res.status(500).send({
                                message: `Error updating Student with id ${req.params.studentId}`
                            });
                        }
                    } else {
                        res.send(data);
                    }
                });
            }
        });
    }
};

// Retrieve all
exports.findAll = (req, res) => {
    Student.getAll((err, data) => {
        if(err){
            res.status(500).send({
                message: err.message
            });
        } else {
            res.send(data);
        }
    });
};

// Retrieve by Id
exports.findOne = (req, res) => {
    Student.findById(req.params.studentId, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.studentId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.studentId}`
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Delete
exports.delete = (req, res) => {
    // validate access token
    let access_token = req.get("jwt-access-token");
    jwt.verify(access_token, "jwtsecret", (err, payload) => {
        if(err){
            // invalid acccess token
            res.status(500).send({
                message: err.message
            });
        } else {
            // valid access token
            // remove student in database
            Student.remove(req.params.studentId, (err, data) => {
                if(err){
                    if(err.kind === "not_found"){
                        res.status(404).send({
                            message: `Not found Student with id ${req.params.studentId}`
                        });
                    } else {
                        res.status(500).send({
                            message: "Could not delete Student with id" + req.params.studentId
                        });
                    }
                } else {
                    res.send({
                        message: "Student delete successfully!"
                    })
                }
            });
        }
    });
};