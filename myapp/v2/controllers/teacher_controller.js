const log = require('../logger');
const Teacher = require("../models/teacher_model");

// Create
exports.create = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        log.error(`teacher_create: content can not be empty`);
        res.status(404).send({
            message: "content can not be empty"
        });
        return ;
    }

    // Create Teacher
    const teacher = new Teacher({
        id: req.body.id,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone
    });

    // Save in database
    let result = await Teacher.create(teacher)
        .catch(err => {
            log.error(`teacher_create: ${err.message}`);
            res.status(500).send({
                message: err.message
            });
        });
    log.info(`teacher_create: success`);
    res.send(result);
};

// Update
exports.update = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        log.error(`teacher_update: content can not be empty`);
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // Update in database
    let result = await Teacher.updateById(req.params.teacherId, new Teacher(req.body))
        .catch(err => {
            if(err.message === "not_found"){
                log.error(`teacher_update: not found`);
                res.status(404).send({
                    message: `Not found Teacher with id ${req.params.teacherId}`
                });
            } else {
                log.error(`teacher_update: ${err.message}`);
                res.status(500).send({
                    message: `Error updating Teacher with id ${req.params.teacherId}`
                });
            }
        });
    log.info(`teacher_update: success`);
    res.send(result);
};

// Retrieve all
exports.findAll = async (req, res) => {
    let results = await Teacher.getAll()
        .catch(err => {
            log.error(`teacher_findAll: ${err.message}`);
            res.status(500).send({
                message: err.message
            });
        });
    log.info(`teacher_findAll: success`);
    res.send(results);
};

// Retrieve by Id
exports.findOne = async (req, res) => {
    let result = await Teacher.findById(req.params.teacherId)
        .catch(err => {
            if(err.message === "not_found"){
                log.error(`teacher_findOne: not found`);
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                log.error(`teacher_findOne: ${err.message}`);
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.teacherId}`
                });
            }
        });
    log.info(`teacher_findOne: success`);
    res.send(result);
};

// Delete
exports.delete = async (req, res) => {
    await Teacher.remove(req.params.teacherId)
        .catch(err => {
            if(err.message === "not_found"){
                log.error(`teacher_delete: not found`);
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                log.error(`teacher_delete: ${err.message}`);
                res.status(500).send({
                    message: "Could not delete Student with id" + req.params.teacherId
                });
            }
        });
    log.info(`teacher_delete: success`);
    res.send({
        message: "Student delete successfully!"
    });            
};