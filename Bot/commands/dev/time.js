const Discord = require('discord.js');
const globalFunc = require('../../function/dbfunctions');

module.exports = {
    name: 'time',
    description: 'time',
    category:'dev',
    args: false,
    run:async (client,message,args)=>{
        var data = await globalFunc.bl(message.author.id,`dev`);
        if(data == null) return message.channel.send(`You're not a developer`);
	
	var cstm = 0; var cstm2 = `am`; var cstm3 =``
        var estm = 0; var estm2 =`am`;var estm3 =``;
        var dm = 0; var dm2 =`am`; var dm3 =``;
        var istm = 0; var istm2 =`am`;var istm3 =``;
        var cestm = 0; var cestm2 =`am`;var cestm3 =``;

        var d = (new Date().getTime() + (60000*(new Date().getTimezoneOffset())))
        if(new Date(d).getHours()>12){dm = 12; dm2 = `pm`}
        if(new Date(d).getMinutes()<10){dm3 = `0`}
	var cst = (new Date(d).getTime() +(60000*-360))
        if(new Date(cst).getHours()>12){cstm = 12; cstm2 = `pm`}
        if(new Date(cst).getMinutes()<10){cstm3 = `0`}
        var est = (new Date(d).getTime() +(60000*-300))
        if(new Date(est).getHours()>12){estm = 12; estm2 = `pm`}
        if(new Date(est).getMinutes()<10){estm3 = `0`}
        var ist = (new Date(d).getTime() +(60000*330))
        if(new Date(ist).getHours()>12){istm = 12; istm2 = `pm`}
        if(new Date(ist).getMinutes()<10){istm3 = `0`}
        var cest = (new Date(d).getTime() +(60000*120))
        if(new Date(cest).getHours()>12){cestm = 12; cestm2 = `pm`}
        if(new Date(cest).getMinutes()<10){cestm3 = `0`}

        const embed = new Discord.MessageEmbed()
        .setTitle(`Time`)
	.addField(`CST`,`${new Date(cst).getHours()-cstm}:${cstm3}${new Date(cst).getMinutes()} ${cstm2}`)
        .addField(`EST`,`${new Date(est).getHours()-estm}:${estm3}${new Date(est).getMinutes()} ${estm2}`)
        .addField(`UST`,`${new Date(d).getHours()-dm}:${dm3}${new Date(d).getMinutes()} ${dm2}`)
        .addField(`CEST`,`${new Date(cest).getHours()-cestm}:${cestm3}${new Date(est).getMinutes()} ${cestm2}`)
        .addField(`IST`,`${new Date(ist).getHours()-istm}:${istm3}${new Date(ist).getMinutes()} ${istm2}`)
        message.channel.send(embed)
    }
}