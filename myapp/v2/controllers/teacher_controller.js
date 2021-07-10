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
    Teacher.create(teacher)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
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
    Teacher.updateById(req.params.teacherId, new Teacher(req.body))
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            if(err.message === "not_found"){
                res.status(404).send({
                    message: `Not found Teacher with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: `Error updating Teacher with id ${req.params.teacherId}`
                });
            }
        });
};

// Retrieve all
exports.findAll = (req, res) => {
    Teacher.getAll()
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
    Teacher.findById(req.params.teacherId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            if(err.message === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieveing Student with id ${req.params.teacherId}`
                });
            }
        });
};

// Delete
exports.delete = (req, res) => {
    Teacher.remove(req.params.teacherId)
        .then(result => {
            res.send({
                message: "Student delete successfully!"
            });            
        })
        .catch(err => {
            if(err.message === "not_found"){
                res.status(404).send({
                    message: `Not found Student with id ${req.params.teacherId}`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Student with id" + req.params.teacherId
                });
            }
        });
};