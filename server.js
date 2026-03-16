const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");

const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// first page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

// login
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.user = username;
        res.redirect("/dashboard.html");
    } else {
        res.send("Invalid Login");
    }
});

// file upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// pest detection route
app.post("/upload", upload.single("image"), (req, res) => {

    const pests = [
        {
            name: "Caterpillar",
            crop: "Tomato / Leaf Plants",
            damage: "Medium",
            solution: "Use neem oil spray and remove infected leaves"
        },
        {
            name: "Ant",
            crop: "Various crops",
            damage: "Low",
            solution: "Use organic ant repellents"
        },
        {
            name: "Beetle",
            crop: "Potato / Corn",
            damage: "High",
            solution: "Apply biological pesticide"
        },
        {
            name: "Grasshopper",
            crop: "Wheat / Rice",
            damage: "Medium",
            solution: "Use eco-friendly insecticide"
        }
    ];

    const pest = pests[Math.floor(Math.random() * pests.length)];

    res.send(`
        <h1>Pest Detection Report</h1>

        <p><b>Pest Name:</b> ${pest.name}</p>
        <p><b>Crop Affected:</b> ${pest.crop}</p>
        <p><b>Damage Level:</b> ${pest.damage}</p>
        <p><b>Recommended Solution:</b> ${pest.solution}</p>

        <br>
        <a href="/dashboard.html">Back to Dashboard</a>
    `);
});

// start server
app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});