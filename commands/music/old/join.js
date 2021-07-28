// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "join",
    description : "Joins Luna to VC",
    cooldown    : 5,
    aliases     : ["jj"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "join {channel_id}",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

        let user = message.author;

        channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel
    }
};
