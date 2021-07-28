// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "removemoney",
    description : "Admin ONLY! Removes Money from a Person",
    cooldown    : 0,
    aliases     : ["rmbal", "rmmoney", "removebal", "removemoney"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "removemoney amnt {@user}",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

        let user = message.mentions.members.first() || message.author;

        if (!message.member.hasPermission('ADMINISTRATOR') && message.author.id !== '568872079638790200') 
       {
           console.log(`${message.author.username} is NOT an admin.`);
           message.reply("You don't have the necessary perms to use this command");
           return;
       }

        //message.reply(args[0], args[1])

        if (isNaN(args[0])) return;

        db.subtract(`money_${message.guild.id}_${user.id}`, args[0])
        let bal = await db.fetch(`money_${message.guild.id}_${user.id}`)

        if (bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`)
        if (bank === null) bank = 0;

        /*
        if (message.author.roles.has('744663739977957532')) {
            return message.reply("You don't have the necessary perms to use this command")
        }
        */

        // Shortens the link to the user if it is pinged
        const IsPing  = message.mentions.members.first(),
        // Retrieves the user's information if it is pinged, or search the username; otherwise use the applicant's information.
        ReqUser = (IsPing ? IsPing.user : client.users.cache.find((x) => x.username === args[1]) || message.member.user),

        // Embed help list
            embed   = new MessageEmbed()
                            .setTitle("Remove Money — ADMIN")
                            .setColor("#36393f")
                            .setAuthor(message.author.username)
                            .addFields(
                                {   name: `— ${ReqUser.username}`,
                                    value: [
                                        //"```",
                                        `Removed ${args[0]} coins`,
                                        `New Balance: ${bal}`,
                                        //"```",
                                    ].join("\n")
                                }
                                
                            );

        // Send the embed and add a reaction to be able to remove it.
        client.func.delAfterSend(client, message, embed, "🗑");
    }
};
