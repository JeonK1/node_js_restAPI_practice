const Teacher = require("../models/teacher_model");

// Create
exports.create = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // Create Teacher
    const teacher = new Teacher({
        id: req.body.id,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone
    });

    // Save in database
    Teacher.create(teacher, (err, data) => {
        if(err){
            res.status(500).send({
                message: err.message
            });
        } else {
            res.send(data);
        }
    });
};

// Update
exports.update = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // Update in database
    Teacher.updateById(req.params.teacherId, new Teacher(req.body), (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({
                    message: `Not found Teacher with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: `Error updating Teacher with id ${req.params.teacherId}`
                });
            }
        } else {
            res.send(data);
        }
    });

};

// Retrieve all
exports.findAll = (req, res) => {
    Teacher.getAll((err, data) => {
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
    Teacher.findById(req.params.teacherId, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.teacherId}`
                });
            }
        } else {
            res.send(data);
        }
    });
};

// Delete
exports.delete = (req, res) => {
    Teacher.remove(req.params.teacherId, (err, data) => {
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Student with id" + req.params.teacherId
                });
            }
        } else {
            res.send({
                message: "Student delete successfully!"
            })
        }
    })
};