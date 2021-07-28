// A powerful library for interacting with the Discord API
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

// –––––– API Fetch ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

const url = 'https://api.nasa.gov/planetary/apod?api_key=JIUEnpA3isHI3q0nlYsbYiLJvgnQnpfFnVQrF4ZO&feedtype=json'

async function getapi(url){
    const response = await fetch(url);
    var data = await response.json();
}

// –––––– Parameters –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    
module.exports = {

    name        : "astronomy",
    description : "Astronomy Info Given Location",
    cooldown    : 5,
    aliases     : ["astr"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "astronomy {location}",

// –––––– Execution ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    async execute(Glossary, client, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

        let user = message.mentions.members.first() || message.author;

        const loc = args[0] || 'insert something... idek';
        

        // Shortens the link to the user if it is pinged
        const IsPing  = message.mentions.members.first(),
        // Retrieves the user's information if it is pinged, or search the username; otherwise use the applicant's information.
        ReqUser = (IsPing ? IsPing.user : client.users.cache.find((x) => x.username === args[1]) || message.member.user),

        // Embed help list
            embed   = new MessageEmbed()
                            .setTitle("Astronomy")
                            .setColor("#36393f")
                            .addField("Why am I Alive?")

        // Send the embed and add a reaction to be able to remove it.
        client.func.delAfterSend(client, message, embed, "🗑");
    }
};