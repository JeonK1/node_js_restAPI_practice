const Teacher = require("../models/teacher_model");

// Create
exports.create = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
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
            res.status(500).send({
                message: err.message
            });
        });
    res.send(result);
};

// Update
exports.update = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // Update in database
    let result = await Teacher.updateById(req.params.teacherId, new Teacher(req.body))
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
    res.send(result);
};

// Retrieve all
exports.findAll = async (req, res) => {
    let results = await Teacher.getAll()
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    res.send(results);
};

// Retrieve by Id
exports.findOne = async (req, res) => {
    let result = await Teacher.findById(req.params.teacherId)
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
    res.send(result);
};

// Delete
exports.delete = async (req, res) => {
    await Teacher.remove(req.params.teacherId)
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
    res.send({
        message: "Student delete successfully!"
    });            
};