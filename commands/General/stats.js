const Discord = require("discord.js")
const os = require('os')
const cpuStat = require("cpu-stat");
const moment = require("moment") 
const { MessageEmbed } = require("discord.js");

module.exports = {

    name        : "stats",
    description : "Stats about me",
    cooldown    : 10,
    aliases     : ["stats"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "stats",

    async execute(Glossary, bot, message, args) {

        // Load Glossary
        Glossary = Glossary.get("commands");

            let { version } = require("discord.js");
        
            cpuStat.usagePercent(function(err, percent, seconds) {
                if (err) {
                return console.log(err);
                }
                
                let secs = Math.floor(bot.uptime % 60);
                let days = Math.floor((bot.uptime % 31536000) / 86400);
                let hours = Math.floor((bot.uptime / 3600) % 24);
                let mins = Math.floor((bot.uptime / 60) % 60);
        
                //let duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
                embed = new MessageEmbed()
                .setTitle("*** Stats ***")
                .setColor("#00ff00")
                .addField("• Mem Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
                .addField("• Uptime ", `${hours}h ${mins}m`, true) //`${duration}`, true)
                .addField("• Users", `${bot.users.cache.size}`, true)
                .addField("• Servers", `${bot.guilds.cache.size}`, true)
                .addField("• Channels ", `${bot.channels.cache.size}`, true)
                .addField("• Discord.js", `v${version}`, true)
                .addField("• Node", `${process.version}`, true)
                .addField("• CPU", `md\n${os.cpus().map(i => `${i.model}`)[0]}`)
                .addField("• CPU usage", `\`${percent.toFixed(2)}%\``,true)
                .addField("• Arch", `\`${os.arch()}\``,true)
                .addField("• Platform", `\`\`${os.platform()}\`\``,true)
                .setFooter("Luna's stats")
        
                bot.func.delAfterSend(bot, message, embed, "🗑");
            })


    }   
}