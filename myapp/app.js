const express = require('express');
const bodyParse = require('body-parser');

const app = express();

// parse requests of content-type (application/json)
app.use(bodyParse.json());

// parse request of content-type (application/x-www-form-urlencoded)
app.use(bodyParse.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
  res.json({message: "Node JS simple CRUD"});
});

require("./v2/route.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});