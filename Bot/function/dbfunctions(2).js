const WelcomeRole = require('../database/autorole');
const welcome = require('../database/welcome')
const news = require('../database/news')
const antispam = require('../database/antispam')
const waifu = require('../database/waifu')
const economyuser = require('../database/EconomyUser')
const economy = require('../database/economy')
module.exports = {
    initWelcomeRole: function(guildID) {
        WelcomeRole.findOne({
            guild:guildID
        },(err,result)=>{
            if(err) throw err;
            if(!result){
                var WelcomeRoles = new WelcomeRole({
                    guild: guildID,
                    roles: []
                })
                WelcomeRoles.save(err=>{
                    if(err) throw err;
                });
            }
        })
    },
    
    
    getWelcomeRole: async function(guildID){
        var welcomeRoles = await WelcomeRole.findOne({
            guild:guildID
        })
        
        
        return welcomeRoles;
    },
    
    deleteWelcomeRole: function(guildID){
        WelcomeRole.findOne({
            guild: guildID
        },(err,guild)=>{
            if(err) throw err;
            if(guild){
                WelcomeRole.deleteOne({guild: guildID},err=>{if(err) throw err;});
            }
        })
    },
    initWelcome: function(guildID){
        welcome.findOne({
            guild:guildID
        },(err,result)=>{
            if(err) throw err;
            if(!result){
                welcome.create({
                    guild: guildID,
                    msg: 'Welcome to the {server}, {member}',
                    dm: null,
                    image:null,
                    welcomedm: 0,
                    welcomemsg: 1,
                    welcomeimage: 1
                })
            }
        })
    },
    getWelcome: function(guildID){
        const welcomeSetting = welcome.findOne({
            guild:guildID
        })
        return welcomeSetting
    },
    deleteWelcome: function(guildID){
        welcome.findOneAndDelete({
            guild:guildID
        })
    },
    initNews: function(guildID){
        news.findOne({
            guild:guildID
        },(err,result)=>{
            if(err) throw err;
            if(!result){
                news.create({
                    guild: guildID,
                    channels: []
                })
            }
        })
    },
    getNews: function(guildID){
        const channels = news.findOne({
            guild: guildID
        })
        return channels
    },
    deleteNews: function(guildID){
        news.findOneAndDelete({
            guild: guildID
        })
    },
    initAntispam: function(guildID){
        antispam.findOne({
            guild:guildID
        },(err,result)=>{
            if(err) throw err;
            if(!result){
                antispam.create({
                    guild:guildID,
                    channels: [],
                    difference: 10000,
                    count: 6,
                    mute: 'off',
                    warn: 'on',
                    delete: 'on'
        
                })
            }
        })
    },
    getAntispam: async function(guildID){
        const response = await antispam.findOne({
            guild:guildID
        })
        return response;
    },
    deleteAntispam: function(guildID){
        antispam.findOneAndDelete({
            guild:guildID
        })
    },
    getWaifu: async function(name){
        
        const response = await waifu.find({
            name: {$regex: name, $options: 'i'}
        })
        return(response);
    },
    getProduct: async function(id){
        const response = await waifu.findOne({
            id: id
        })
        return(response)
    },
    initEcoUser: function(user){
        economyuser.findOne({
            user: user.id
        },(err,result)=>{
            if(err) throw err;
            if(!result){
                const newUser = economyuser.create({
                    user: user.id,
                    username: user.username,
                    balance: 0,
                    characters: []
                })
            }
        })
    },
    getUserEarnings: async function(user){
        const response = await economyuser.findOne({
            user: user.id
        })
        return response;
    },
    updateUserEarnings: async function(user,balance){
        
        const update = await economyuser.findOneAndUpdate({
            user:user.id
        },{
            balance:balance
        })
    },
    AddCharacters: async function(user,waifu,balance){
        console.log(balance)
        const update = await economyuser.findOneAndUpdate({user:user.id},{
            characters: waifu,
            balance: balance
        })
    },
    updateWaifu:async function(ID,N,I,G,A,C){
        var data = await waifu.findOne({id:ID})
        if(data == null)return false
        if(N == null){N = data.name}
        if(I == null){I = data.image}
        if(G == null){G = data.gender}
        if(A == null){A = data.anime}
        if(C == null){C = data.cost}
        try{
        await waifu.findOneAndUpdate({id:ID},{name:N,image:I,gender:G,anime:A,cost:C},err=>{if(err)throw(err)})
        }catch{
            return false
        }finally{
            return true
        }
      },
      addCoins: async function(id,mon){
        var data = await economyuser.findOne({
            user: id
        })
        if(data == undefined)return
        var money = data.balance + mon
        await economyuser.findOneAndUpdate({user: id},{balance:money},function(err){if(err)throw (err)})
    },
}