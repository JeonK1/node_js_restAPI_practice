const sql = require("./db");

// constructor
const Student = function(student) {
    this.name = student.name;
    this.grade = student.grade;
    this.is_delete = student.is_delete;
}

// Create
Student.create = (newStudent) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO student SET ?", newStudent, (err, res) => {
            if(err) {
                console.log("[model.js] student create error : ", err);
                reject(err);
                return ;
            }
            console.log("create student: ", {id: res.insertId, ...newStudent});
            resolve({id:res.insertId, ...newStudent});
        });    
    });
};

// Update
Student.updateById = (id, student) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE student SET name = ?, grade = ?, is_delete = ? WHERE id = ?",
        [student.name, student.grade, student.is_delete, id], (err, res) => {
            if(err){
                console.log("[model.js] student updateById error : ", err);
                reject(err);
                return ;
            }
            if(res.affectedRows == 0) {
                // not found with id
                reject({message: "not_found"});
                return ;
            }
            console.log("updated student: ", {id:id, ...student});
            resolve({id: id, ...student});
        });
    });
};

// Retrieve by Id
Student.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM student WHERE id=${id}`, (err, res) => {
            if(err) {
                console.log("[model.js] student findById error : ", err);
                reject(err);
                return ;
            }
            if(!res.length) {
                reject({message: "not_found"}); // not found
                return ;
            }
            console.log("found student: ", res[0]);
            resolve(res[0]);
        });
    });
};

// Retrieve All
Student.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM student", (err, res) => {
            if(err){
                console.log("[model.js] student getAll error : ", err);
                reject(err);
                return ;
            }
            console.log("student: ", res);
            resolve(res);
        });    
    });
};

// Delete
Student.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM student WHERE id = ?", id, (err, res) => {
            if(err){
                console.log("[model.js] student remove error : ", err);
                reject(err);
                return ;            
            }
            if(res.affectedRows == 0){
                // not found with id
                reject({message: "not_found"});
                return ;
            }
            console.log("delete student with id: ", id);
            resolve(res);
        });        
    });
};

module.exports = Student;