const sql = require("./db");

// constructor
const Student = function(student) {
    this.name = student.name;
    this.grade = student.grade;
    this.is_delete = student.is_delete;
}

// Create
Student.create = (newStudent, result) => {
    sql.query("INSERT INTO student SET ?", newStudent, (err, res) => {
        if(err) {
            console.log("[model.js] student create error : ", err);
            result(err, null);
            return ;
        }

        console.log("create student: ", {id: res.insertId, ...newStudent});
        result(null, {id:res.insertId, ...newStudent});
    });
};

// Update
Student.updateById = (id, student, result) => {
    sql.query("UPDATE student SET name = ?, grade = ?, is_delete = ? WHERE id = ?",
    [student.name, student.grade, student.is_delete, id], (err, res) => {
        if(err){
            console.log("[model.js] student updateById error : ", err);
            result(err, null);
            return ;
        }
        if(res.affectedRows == 0) {
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("updated student: ", {id:id, ...student});
        result(null, {id: id, ...student});
    });
};

// Retrieve by Id
Student.findById = (id, result) => {
    sql.query(`SELECT * FROM student WHERE id=${id}`, (err, res) => {
        if(err) {
            console.log("[model.js] student findById error : ", err);
            result(err, null);
            return ;
        }
        if(res.length) {
            console.log("found student: ", res[0]);
            result(null, res[0]);
            return ;
        }
        result({kind: "not_found"}, null); // not found
    });
};

// Retrieve All
Student.getAll = result => {
    sql.query("SELECT * FROM student", (err, res) => {
        if(err){
            console.log("[model.js] student getAll error : ", err);
            result(err, null);
            return ;
        }

        console.log("student: ", res);
        result(null, res);
    });
};

// Delete
Student.remove = (id, result) => {
    sql.query("DELETE FROM student WHERE id = ?", id, (err, res) => {
        if(err){
            console.log("[model.js] student remove error : ", err);
            result(err, null);
            return ;            
        }

        if(res.affectedRows == 0){
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("delete student with id: ", id);
        result(null, res);
    });
};

module.exports = Student;