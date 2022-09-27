const mongoose = require("mongoose")

module.exports = mongoose.model(
    "songsPlayed",
        new mongoose.Schema({
            ident: String,
            songsPlayed: Number,
        })
);