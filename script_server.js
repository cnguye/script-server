const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;
const mysql = require("mysql");

require("dotenv").config({ path: "~/.env" });

const db = mysql.createPool({
    host: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_MAIN,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/get_pi_skus", (req, res) => {
    const sqlSELECTALL = "SELECT * FROM pi_tim_models;";
    db.query(sqlSELECTALL, (err, results) => {
        res.status(200).send(results)
    });
});

app.get("/get_pi_currencies", (req, res) => {
    const sqlSELECTALL = "SELECT * FROM pi_tim_currencies;";
    db.query(sqlSELECTALL, (err, results) => {
        res.status(200).send(results)
    });
});

app.get("/get_user_settings", (req, res) => {
    const user_id = req.query;
    const sqlSELECTALL = "SELECT user_settings FROM pi_tim_user_settings WHERE user_id=?;";
    db.query(sqlSELECTALL, [user_id], (err, results) => {
        res.status(200).send(results)
    });
});

app.post("/save_user_settings", (req, res) => {
    const user_id = req.body.user_id;
    const user_settings = JSON.stringify(req.body.user_settings);
    const sqlUPDATE = "UPDATE pi_tim_user_settings SET user_settings=? WHERE user_id=?"
    db.query(sqlUPDATE, [user_settings, user_id], (err, results) => {
        res.status(200).send(results)
    })
})


app.listen(port, () => {
    console.log("server running on port 5001... ");
});
