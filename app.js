const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/notesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Note Schema
const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    tags: [String],
    date: { type: Date, default: Date.now }
});
const Note = mongoose.model("Note", noteSchema);

// Routes

// Home: Display all notes
app.get("/", async (req, res) => {
    try {
        const notes = await Note.find({}).sort({ date: -1 });
        res.render("index", { notes });
    } catch (err) {
        console.log(err);
        res.send("Error loading notes");
    }
});

// Add note
app.post("/add", async (req, res) => {
    try {
        const tags = req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()) : [];
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content,
            tags: tags
        });
        await newNote.save();
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

// Delete note
app.post("/delete/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
