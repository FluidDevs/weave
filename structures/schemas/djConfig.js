const mongoose = require("mongoose")

module.exports = mongoose.model(
    "djConfig",
        new mongoose.Schema({
            guildId: String,
            enabled: Boolean,
            djRoleId: String,
        })
);