const mongoose = require('mongoose')
const guildsettings = require('../database/schemas/guildsettings')
const guildSettings = require('../database/schemas/guildsettings')
const OAuth2Credentials = require('../database/schemas/OAuth2Credentials')
const welcome = require('../database/schemas/welcome')
const xpblacklist = require('../database/schemas/xpblacklist')
const news = require('../database/schemas/news')
const antispam = require('../database/schemas/antispam')
const autorole = require('../database/schemas/autorole')
module.exports = {
    getGuildSetting: async function(guildID){
        var guildSetting = await guildSettings.findOne({
            guild: guildID
        })
        return(guildSetting);
    },
    getToken: async function(id){
        var OAuth2Token = OAuth2Credentials.findOne({
            discordId: id
        })
        return OAuth2Token
    },
    getWelcome: function(guildID){
        const welcomeSetting = welcome.findOne({
            guild:guildID
        })
        return welcomeSetting
    },
    getXPBlacklist: function(guildID){
        const response = xpblacklist.findOne({
            guild: guildID
        })
        return response
    },
    updateGuildSetting: async function(guildID,prefix,logchannel,welcomechannel,invitelog,xplog,xpsystem,xp,xpcooldown,muterole,antispamSet){
        const update = await guildsettings.findOneAndUpdate({guild:guildID},{
            prefix: prefix,
            logchannel: logchannel,
            welcomechannel: welcomechannel,
            invitelog: invitelog,
            xplog: xplog,
            xpsystem: xpsystem, 
            xp: xp,
            xpcooldown: xpcooldown,
            muterole: muterole,
            antispam: antispamSet
            
        })
    },
    updateXPBlacklist: async function(guildID,channels){
        const update = await xpblacklist.findOneAndUpdate({
            guild:guildID
        },{
            channels: []
        })
        if(!channels) return
        channels.forEach(async c=>{
            xpblacklist.findOne({
                guild:guildID
            },(err,result)=>{
                if(err) throw err;
                result.channels.push({
                    channel:c
                })
                    
                result.save((err)=>{
                    if(err) throw err;                
                })         
            })  
        })
        
    },
    updateWelcome: async function(guildID,msg,dm,welcomedm,welcomemsg){
        const update = await welcome.findOneAndUpdate({
            guild:guildID
        },{
            msg: msg,
            dm: dm,            
            welcomedm: welcomedm,
            welcomemsg: welcomemsg,
            
        })
    },
    getNews: async function(guildID){
        const channels = await news.findOne({
            guild: guildID
        })
        return channels;
    },
    updateNews: async function(guildID,channels){
        const update = await news.findOneAndUpdate({guild:guildID},{
            channels: channels
        })
         
    },
    getAntispam: async function(guildID){
        const response = await antispam.findOne({
            guild:guildID
        })
        return response;
    },
    updateAntispam: async function(guildID,channels,difference,count,mute,warn,deletemsg){
        const update = await antispam.findOneAndUpdate({guild:guildID},{
            channels: channels,
            difference: difference,
            count: count,
            mute: mute,
            warn: warn,
            delete: deletemsg
        })
    },
    getAutoroles: async function(guildID){
        const roles = await autorole.findOne({
            guild: guildID
        })
        return roles;
    },
    updateAutoroles: async function(guildID,roles){
        const update = await autorole.findOneAndUpdate({guild:guildID},{
            roles: roles
        })
         
    },
    
}