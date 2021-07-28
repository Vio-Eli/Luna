// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "leave",
    description : "Luna leaves current VC",
    cooldown    : 5,
    aliases     : ["ll"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "leave {channel_id}",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args)  {

        message.guild.voice.channel.leave();
        message.channel.send("Disconnected!");
    }
};