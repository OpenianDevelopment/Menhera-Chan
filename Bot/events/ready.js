const mongoose = require('mongoose');
const {addGuildSetting,initXP, initWarn, initModeration, initXPBlacklist} = require('../function/dbfunctions');
const {reinit} = require('../function/functions')
const { initWelcomeRole, initWelcome, initNews, initAntispam } = require('../function/dbfunctions(2)')
const vote = require('../modules/vote')
const DBL = require("dblapi.js");



module.exports = (client)=>{
    const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczMTE0Mzk1NDAzMjIzMDQ1MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjA3NDM3NzIzfQ.Je4W0naACdZPsP_yWpHX06yYhKmPxbI9AFYO0MFif5o', client);

    
    //  vote(client)
    
    //connecting to the db when bot starts
   
        mongoid = "mongodb://localhost:27017/Menhera";
    
    mongoose.connect(mongoid,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false
    },(err)=>{
        if(err) throw err;
        console.log('Connection Completed')
    });
    
    //Looping through all guilds to check if there data is in db. If not creating one
    client.guilds.cache.forEach(guilds => {
        addGuildSetting(guilds.id);  
        initXP(guilds.id);
        initWarn(guilds.id);
        initModeration(guilds.id); 
        initXPBlacklist(guilds.id);
        reinit(guilds,client);
        initWelcomeRole(guilds.id);
        initWelcome(guilds.id);
        initNews(guilds.id);
        initAntispam(guilds.id)
    });


    
    
    // client.guilds.setting = await getAllGuildSetting()

    //for the counter
    client.counter =[];
    setInterval(async () => {
        const guildsShard = await client.shard.fetchClientValues('guilds.cache.size')
        const size = guildsShard.reduce((acc, guildCount) => acc + guildCount, 0)
        dbl.postStats(size, null, client.shard.count);
    }, 1800000);
    console.log(`${client.user.username} has logged in`);
    
    client.user.setStatus('Online');
    client.user.setActivity('mc!help', {type: 'PLAYING'});
}

