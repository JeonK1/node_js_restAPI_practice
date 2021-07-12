const log = require('../logger');
const jwt = require("jsonwebtoken");
const Student = require("../models/student_model");
require('dotenv').config();

// Create
exports.create = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        log.error("student_create: content can not be empty");
        res.status(404).send({
            message: "content can not be empty"
        });
        return ;
    } 
    // validate access token
    let access_token = req.get("jwt-access-token");
    jwt.verify(access_token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err){
            // invalid acccess token
            log.error(`student_create: ${err.message}`);
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
            await Student.create(student)
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
            log.info("student_create: success");
            res.send(student);
        }
    });
};

// Update
exports.update = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        log.error("student_update: content can not be empty");
        res.status(404).send({
            message: "content can not be empty"
        });
        return;
    } 
    // validate access token
    let access_token = req.get("jwt-access-token");
    jwt.verify(access_token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err){
            // invalid acccess token
            log.error(`student_update: ${err.message}`);
            res.status(403).send({
                message: err.message
            });
        } else {
            // valid access token
            // Update in database
            let student = await Student.updateById(req.params.studentId, new Student(req.body))
                .catch(err => {
                    if(err.message === "not_found"){
                        log.error("student_update: not found");
                        res.status(404).send({
                            message: `Not found Student with id ${req.params.studentId}`
                        });
                    } else {
                        log.error(`student_update: ${err.message}`);
                        res.status(500).send({
                            message: `Error updating Student with id ${req.params.studentId}`
                        });
                    }
                });
            log.info("student_update: success");
            res.send(student);
        }
    });

};

// Retrieve all
exports.findAll = async (req, res) => {
    let students = await Student.getAll()
        .catch(err => {
            log.error(`student_findAll: ${err.message}`);
            res.status(500).send({
                message: err.message
            });
        });
    log.info(`student_findAll: success`);
    res.send(students);
};

// Retrieve by Id
exports.findOne = async (req, res) => {
    let student = await Student.findById(req.params.studentId)
        .catch(err => {
            if(err.message === "not_found"){
                log.error(`student_findOne: not found`);
                res.status(404).send({
                    message: `Not found Student with id ${req.params.studentId}`
                });
            } else {
                log.error(`student_findOne: ${err.message}`);
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.studentId}`
                });
            }
        });
    log.info(`student_findOne: success`);
    res.send(student);
};

// Delete
exports.delete = async (req, res) => {
    // validate access token
    let access_token = req.get("jwt-access-token");
    jwt.verify(access_token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err){
            // invalid acccess token
            log.error(`student_delete: ${err.message}`);
            res.status(403).send({
                message: err.message
            });
        } else {
            // valid access token
            // remove student in database
            await Student.remove(req.params.studentId)
                .catch(err => {
                    log.error(`student_delete: not found`);
                    if(err.kind === "not_found"){
                        res.status(404).send({
                            message: `Not found Student with id ${req.params.studentId}`
                        });
                    } else {
                        log.error(`student_delete: ${err.message}`);
                        res.status(500).send({
                            message: "Could not delete Student with id" + req.params.studentId
                        });
                    }
                });
            log.info(`student_delete: success`);
            res.send({
                message: "Student delete successfully!"
            });
        }
    });
};