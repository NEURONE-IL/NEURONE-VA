const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('uploads'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const mongoURI = "mongodb://127.0.0.1/assistantdb";

mongoose.connect(mongoURI)
    .then((db) => console.log("conectado a mongodb"))
    .catch((err) => console.log("No se pudo conectar"));

app.use("/api/", require("./routes/images.routes"));
app.use("/api/", require("./routes/assistant.routes"));
app.use("/api/", require("./routes/criteria.routes"));
app.use("/api/", require("./routes/action.routes"));


app.listen(3000);
console.log("Server at port", 3000)
