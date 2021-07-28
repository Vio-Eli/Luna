const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {

    name        : "userinfo",
    description : "Deposits from pocket into bank",
    cooldown    : 5,
    aliases     : ["uinf"],
    guildOnly   : true,
    privileges  : ["SEND_MESSAGES"],
    usage       : "userinfo {@user}",

    async execute(Glossary, client, message, args) {
        let inline = true
        let resence = true
        const status = {
            online: /*"<:online:741365114342604831>"*/ "Online",
            idle: /*"<:idle:741365114342604831>"*/ "Idle",
            dnd: /*"<:dnd:741365114342604831>"*/ "Do Not Disturb",
            offline: /*"<:offline:774821689275056148>"*/ "Offline/Invisible"
        }
            

        let target = message.mentions.users.first() || message.author;
        const member = message.guild.member(target);
        var gamepres = target.presence.activities.length ? target.presence.activities.filter(x=>x.type === "PLAYING") : null;
        var customstat = target.presence.activities.length ? target.presence.activities.filter(x=>x.type === "CUSTOM_STATUS") : null;

        //console.log(target.presence);

        // Shortens the link to the user if it is pinged
        const IsPing  = message.mentions.members.first(),
        // Retrieves the user's information if it is pinged, or search the username; otherwise use the applicant's information.
        ReqUser = (IsPing ? IsPing.user : client.users.cache.find((x) => x.username === args[0]) || message.member.user),

            embed = new MessageEmbed()
                .setAuthor(ReqUser.username)
                .setThumbnail(ReqUser.displayAvatarURL())
                .setColor("RANDOM")
                .addField("Full Username", `${ReqUser.tag}`, inline)
                .addField("ID", ReqUser.id, inline)
                .addField("Nickname", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
                .addField("Status", `${status[ReqUser.presence.status]}`, inline, true)
                .addField("Custom Status", `${customstat && customstat.length ? customstat[0].state : 'None'}`, true)
                .addField("Playing", `${gamepres && gamepres.length ? gamepres[0].name : 'Not Playing'}`,inline, true)
                .addField("Roles:", member.roles.cache.map(roles => `${roles}`).join(', '), true)
                .addField("Joined Server On", member.joinedAt)
                .addField("Joined Discord At", ReqUser.createdAt)
                .addField("Member Permissions", member.permissions.toArray())
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()

            // Send the embed and add a reaction to be able to remove it.
            client.func.delAfterSend(client, message, embed, "🗑");
    }
};
