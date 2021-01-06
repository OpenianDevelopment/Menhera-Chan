const Canvas = require('canvas');
const Discord = require('discord.js')
const ssn = require('short-string-number');
const {getModeration, getGuildSetting,removeModeration} = require('./dbfunctions');
const { getWelcome } = require('./dbfunctions(2)')
module.exports = {  
    welcomeMsg: async function(member,guild,guildSet) {
        const welcome = await getWelcome(guild.id)

        if(welcome.welcomedm === 1){
                
            if(welcome.dm){
                if(welcome.dm.includes('{member}'))
                    welcome.dm = welcome.dm.replace(/{member}/,member)
                if(welcome.dm.includes('{server}'))
                    welcome.dm = welcome.dm.replace(/{server}/,guild.name)
                member.send(welcome.dm).catch(err=>{
                    
                })
            }
            
        }
        if(welcome.welcomemsg === 0) return;
        if(guildSet.welcomechannel === null) return;
        
        
                if(welcome.msg.includes('{member}'))                    
                    welcome.msg = welcome.msg.replace(/{member}/,member)
                
                
                if(welcome.msg.includes('{server}'))
                    welcome.msg = welcome.msg.replace(/{server}/,guild.name)
                
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
        
            // Declare a base size of the font
            let fontSize = 40;
        
            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `bold ${fontSize -= 10}px sans-serif`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(text).width >217);
        
            // Return the result to use in the actual canvas
            return ctx.font;
        };
        
        const canvas = Canvas.createCanvas(845,475);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./image/welcome.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        // Select the font size and type from one of the natively available fonts
	    ctx.font = applyText(canvas, member.displayName);
	    // Select the style that will be used to fill the text in
	    ctx.fillStyle = '#efefef';
	    // Actually fill the text with a solid color
	    ctx.fillText(member.displayName, canvas.width/3.4, canvas.height / 1.7);
        // Pick up the pen
	    ctx.beginPath();
	    // Start the arc to form a circle
	    ctx.arc(175, 225, 75, 0, Math.PI * 2, true);
	    // Put the pen down
	    ctx.closePath();
	    // Clip off the region you drew on
	    ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
	    // Draw a shape onto the main canvas
        ctx.drawImage(avatar, 100, 150, 150, 150);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
        
        var channel = await member.guild.channels.cache.find(channel=>channel.id===guildSet.welcomechannel);
        try{
            
            channel.send(welcome.msg,attachment)
        }
        catch{
            return;
        }
        
        
    },

    getDate: function(){
        var date = new Date()
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined,options)
    },

    getRankCard: async function(member,xp,level,minxp,maxxp){
        const canvas = Canvas.createCanvas(1026,285);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./image/rankcard.png');
        ctx.drawImage(background,0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000000";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,270,1026,20)
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeReact = (0,270,1026,20)
        ctx.stroke();

        ctx.fillStyle = '#21cc87';
        ctx.globalAlpha = 1;
        ctx.fillRect(0,270,(((xp-minxp)/(maxxp-minxp))*1026),20)
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.font = 'bold 25px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#4a5072';
        ctx.fillText(`XP: ${ssn(xp)}/${ssn(maxxp)}`, 513,260);

        ctx.textAlign = 'center';
        ctx.fillText(`Level: ${level}`, 513,220);

        ctx.font = 'bold underline 35px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${member.user.tag}`, 330,145)

        ctx.arc(170,135,125,0, Math.PI*2,true)
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.closePath();  
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
        ctx.drawImage(avatar,45,10,250,250)

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rankcard.png');
        return attachment;
    },
    sendModLogAuto: async function(guild,channels,embed,client){	
        if(channels === null)return
        var channel = await guild.channels.cache.find(channel=>channel.id===channels);
        if(!channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return	
        channel.send(embed).catch(err=>{console.log(err)});	
    },
    sendModLog: async function(message,channels,cmd,channelID,member,reason,mod,client){
        if(channels === null)return
        const ModEmbed = new Discord.MessageEmbed()
                            .setTitle(`Mod logs`)
                            .setColor('RED')
                            .addField('User:',message.author,true)
                            .addField('Used:',cmd,true)

                            if(member != null){
                                ModEmbed.addField('On User:',`${member}`)
                            }
                            if(channelID != null){
                                ModEmbed.addField('On channel:',`<#${channelID}>`)
                            }
                            if(reason != null && reason != ``){
                                ModEmbed.addField('Reason:',`${reason}`)
                            }
                            if(mod != null && mod != ``){
                                ModEmbed.addField('Mod:',`${mod}`)
                            }
        var channel = await message.guild.channels.cache.find(channel=>channel.id===channels);
        if(!channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
        channel.send(ModEmbed).catch(err=>{console.log(err)});
    },
    getTime: function( ms ) {
        var seconds = ms / 1000;
        var hours = parseInt( seconds / 3600 ); 
        seconds = seconds % 3600;
        var minutes = parseInt( seconds / 60 ); 
        seconds = parseInt(seconds % 60);
        var time = hours+':'+minutes+':'+seconds;
        return(time);
    },
    reinit: async function(guild,client){
        var mod = await getModeration(guild.id)
        var setting = await getGuildSetting(guild.id)
        if(!mod || !setting)return
        
        var muterole = setting.muterole;
        var mod_log = setting.logchannel;
        mod.moderations.forEach(async mod=>{
            var time = mod.time - Date.now();
            if(mod.modtype === 'mute'){
                if(!guild.me.hasPermission(`MANAGE_ROLES`)) return removeModeration(guild.id,mod.user,mod.modtype)
                var member = await guild.members.fetch(mod.user)
                if(!member) return removeModeration(guild.id,mod.user,mod.modtype);
                    setTimeout(async function(){
                        member.roles.remove(muterole)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Unmuted`,)
                            .setColor('#7851a9')
                            .setDescription(`${member.user.username} have been Unmuted`)
                            .addField('Unmuted by', `<@!731143954032230453>`, true)
                        removeModeration(guild.id,mod.user,mod.modtype)
                        if(mod_log === null)return
                        var channel = await guild.channels.cache.find(channel=>channel.id===mod_log);
                        if(!channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                        channel.send(embed).catch(err=>{console.log(err)});
                    },time)                           
            }
            if(mod.modtype === 'ban'){
                if(!guild.me.hasPermission(`BAN_MEMBERS`)) return removeModeration(guild.id,mod.user,mod.modtype)
                var ban = await guild.fetchBans();
                var member = await ban.get(mod.user);
                if(!member) return removeModeration(guild.id,mod.user,mod.modtype)
                    setTimeout(async function(){
                        guild.members.unban(member.user.id)
                        const embed = new Discord.MessageEmbed()
                            .setTitle(`Unbanned`,)
                            .setColor('#7851a9')
                            .setDescription(`${member.user.username} have been Unbanned`)
                            .addField('Unbanned by', `<@!731143954032230453>`, true)
                        removeModeration(guild.id,mod.user,mod.modtype)
                        if(mod_log === null)return
                        var channel = await guild.channels.cache.find(channel=>channel.id===mod_log);
                        if(!channel.permissionsFor(client.user.id).has(`SEND_MESSAGES`))return
                        channel.send(embed).catch(err=>{console.log(err)});
                    },time)
                
            }

            
            
        })

    },
    canModifyQueue: function(member) {
        const { channelID } = member.voice;
        const botChannel = member.guild.voice.channelID;
      
        if (channelID !== botChannel) {
          member.send("You need to join the voice channel first!").catch(console.error);
          return;
        }
      
        return true;
    },
    interactionMsg: async(client,args,embed)=>{
        const data = {
            "type": 4,
            "data": {
                "tts": false,
                "content": null,
                "embeds": [embed],
                "allowed_mentions": []
            }
        }
        client.api.interactions(args.id)[args.token].callback().post({data});
        
    }

}