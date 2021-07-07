module.exports = app => {
  const students = require("../controllers/student_controller");
  const teachers = require("../controllers/teacher_controller");
  const user = require("../controllers/login_controller");
  const token = require("../controllers/token_controller");

  /**** Test ****/
  app.post("/token/test", token.test);

  /**** Student ****/
  // Create Student
  app.post("/students", students.create);

  // Retrieve All Student
  app.get("/students", students.findAll);

  // Retrieve by Id Student
  app.get("/students/:studentId", students.findOne);

  // Update Student
  app.put("/students/:studentId", students.update);

  // Delete Student
  app.delete("/students/:studentId", students.delete);

  /**** Teacher ****/
  // Create Teacher
  app.post("/teachers", teachers.create);

  // Retrieve All Teacher
  app.get("/teachers", teachers.findAll);

  // Retrieve by Id Teacher
  app.get("/teachers/:teacherId", teachers.findOne);

  // Update Teacher
  app.patch("/teachers/:teacherId", teachers.update);

  // Delete Teacher
  app.delete("/teachers/:teacherId", teachers.delete);

  /**** User ****/
  // Sign Up
  app.post("/users/signup", user.signUp);

  // Sign In
  app.post("/users/signin", user.signIn)

  /**** Token *****/
  // regenerate refresh token
  app.post("/token/regenerate_refresh_token", token.regenerate_refresh_token);

  // regenerate access token
  app.post("/token/regenerate_access_token", token.regenerate_access_token);
};