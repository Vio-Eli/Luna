// ██████ Integrations █████████████████████████████████████████████████████████

// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name: "invitesall",
    description: "Creates an invite for each guild Luna is in",
    cooldown: 1,
    aliases: ["inviter"],
    guildOnly: true,
    privileges: ["SEND_MESSAGES"],
    usage: "invitesall",

    // –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {


        // Load Glossary
        Glossary = Glossary.get("commands");

        //753875153490018321

        if (message.author.id !== '753875153490018321') {
            console.log(`${message.author.username} is NOT Master.`);
            message.reply("Thee is not master. Thee cannot execute this command! Thou shalt not pass!");
            return;
        }

        client.guilds.cache.forEach(guild => {
            let channel = guild.channels.cache.last();
            createLink(channel, guild, message);
        });


        async function createLink(chan, guild, message) {
            let invite = await chan.createInvite().catch(console.error);
            try {
                message.channel.send(guild.name + '|' + invite);
            } catch (e) {
                message.channel.send(guild.name + '|' + 'no link available');
            }
        }

    }
};