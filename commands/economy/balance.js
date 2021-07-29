// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

module.exports = {

    name        : "balance",
    description : "Checks the balance of a person",
    cooldown    : 5,
    aliases     : ["bal"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "balance {@user}",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

        let user = message.mentions.members.first() || message.author;

        let bal = db.fetch(`money_${message.guild.id}_${user.id}`)
        if (bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.guild.id}_${user.id}`)
        if (bank === null) bank = 0;

        // Shortens the link to the user if it is pinged
        const IsPing  = message.mentions.members.first(),
        // Retrieves the user's information if it is pinged, or search the username; otherwise use the applicant's information.
        ReqUser = (IsPing ? IsPing.user : client.users.cache.find((x) => x.username === args[0]) || message.member.user),

        // Embed help list
            embed   = new MessageEmbed()
                            .setTitle("Balance")
                            .setColor("#36393f")
                            //.setDescription(`**${user}'s Balance**`)
                            .addFields(
                                {   name: `— ${ReqUser.username}'s Balance`,
                                    value: [
                                        //"```",
                                        `Pocket: ${bal}`,
                                        `Bank: ${bank}`,
                                        //"```",
                                    ].join("\n")
                                }
                                
                            );

        // Send the embed and add a reaction to be able to remove it.
        client.func.delAfterSend(client, message, embed, "🗑");
    }
};
