// ██████ Integrations █████████████████████████████████████████████████████████

// Grabbing the Settings library for prefix...
const fs            = require("fs");
var   settings;

settings = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));

// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "help",
    description : "Lists the main commands.",
    cooldown    : 5,
    aliases     : ["hhh"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

        let commands = message.client.commands.array();
        
        // Embed help list
              embed   = new MessageEmbed()
                            .setTitle("Help Menu!")
                            .setColor("#36393f")
                            .setDescription("Display all commands and descriptions")

                    commands.forEach((cmd) => {
                        embed.addField(
                            `**${settings.Prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : " "}**`,
                            `${cmd.description}`,
                            `${cmd.usage}`,
                            true
                        )
                    });

        // Send the embed and add a reaction to be able to remove it.
        client.func.delAfterSend(client, message, embed, "🗑");
    }
};