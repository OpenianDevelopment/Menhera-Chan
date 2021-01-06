const router = require('express').Router();
const url = require('url');
const { off } = require('../database/schemas/news');



const { getUserGuilds, getGuildChannel, getBotGuilds, CheckGuild, getGuildRole } = require('../utils/api')
const { getGuildSetting, getWelcome, getXPBlacklist, updateGuildSetting, updateXPBlacklist, updateWelcome, getNews, updateNews, getAntispam, updateAntispam, getAutoroles, updateAutoroles } = require('../utils/dbfunctions')
const {getPermissionGuilds} = require('../utils/functions')
const auth = require('./auth');

router.get('/',async (req,res)=>{
    
    if(req.user){
        guilds = await getUserGuilds(req.user.discordId)
        guilds = await getPermissionGuilds(guilds)
        res.render('dashboard',{user:req.user,
                                guild:guilds})
    }
        
    else
        res.redirect('/auth/discord')
        
})


router.use('/auth',auth);

router.get('/guild/:id',async (req,res)=>{
    
    if(!req.user)
        return res.redirect('/auth/discord')
    const BotGuild = await getBotGuilds(req.params.id)
    if(BotGuild.message){
        return res.redirect('http://www.menhera-chan.in/invite')
    }
    let UserGuild = await getUserGuilds(req.user.discordId)
    if(!UserGuild) return res.redirect('/')
    UserGuild = await getPermissionGuilds(UserGuild)
    if(!UserGuild) return res.redirect('/')
    if(req.query._method){
        req.user.save = true
    }
    const Mutual = await CheckGuild(req.params.id,UserGuild)
    
    if(!Mutual.length)
        return res.redirect('http://dashboard.menhera-chan.in/')
    else{
        const guildSetting = await getGuildSetting(req.params.id);
        const guildChannel = await getGuildChannel(req.params.id);
        const guildRole = await getGuildRole(req.params.id);
        const welcome = await getWelcome(req.params.id);
        const xpchannel = await getXPBlacklist(req.params.id);
        const newsChannel = await getNews(req.params.id);
        const antispam = await getAntispam(req.params.id);
        const autoroles = await getAutoroles(req.params.id)
        let xpblacklist = [];
        
            if(xpchannel.channels){
                xpchannel.channels.forEach(c=>{
                    xpblacklist.push(c.channel)
                })
            }
        
        
        res.render('guild',{user:req.user,mutual:Mutual,guildSetting:guildSetting,guildChannel:guildChannel,guildRole:guildRole,welcome:welcome,xpchannel: xpblacklist,news: newsChannel,antispam: antispam,autoroles:autoroles})
        req.user.save = null;
    }
    
})
router.put('/guild/:id',async (req,res)=>{
    
    if(!req.user)
        return res.redirect('/auth/discord')
        
    const guildSetting = await getGuildSetting(req.params.id)
    const welcome = await getWelcome(req.params.id)
    const antispam = await getAntispam(req.params.id);
    let prefix = req.body.prefix;
    if(prefix === ''){
        prefix = guildSetting.prefix
    }
    let welcomechannel = req.body.welcomechannel
    if(welcomechannel === 'null')
        welcomechannel = null;
    let welcomedm = req.body.dm || 0
    if(welcomedm === 'on'){
        welcomedm = 1;
    }
    let welcomemsg = req.body.msg || 0
    if(welcomemsg === 'on'){
        welcomemsg = 1
    }
    let msg = req.body.welcomemsg
    if(msg===''){
        msg = welcome.msg
    }
    let dm = req.body.welcomedm
    if(dm===''){
        dm = welcome.dm
    }
    let modlog = req.body.modlog
    if(modlog === 'null'){
        modlog = null
    }
    let invitelog = req.body.invitelog
    if(invitelog === 'null'){
        invitelog = null
    }
    let muterole = req.body.muterole
    if(muterole === 'null'){
        muterole = null
    }
    let xpsystem = req.body.xpsystem || 0
    if(xpsystem === 'on'){
        xpsystem = 1;
    }
    let xp = req.body.xp
    if(xp === ''){
        xp = guildSetting.xp
    }
    let cooldown = req.body.cooldown
    if(cooldown===''){
        cooldown=guildSetting.xpcooldown
    }
    else{
        cooldown = cooldown*1000
    }
    let level = req.body.level
    if(level==='null'){
        level = guildSetting.xplog
    }
    let antispamSet = req.body.antispamSet || 0;
    if(antispamSet==='on'){
        antispamSet = 1
    }
    const antiChannel = req.body.antichannel || [];
    const antimute = req.body.antimute || 'off';
    const antiwarn = req.body.antiwarn || 'off';
    const antidelete = req.body.antidelete || 'off'
    let difference = req.body.diff;
    if(difference === ''){
        difference = antispam.difference;
    }
    else{
        difference = difference*1000;
    }
    let count = req.body.anticount;
    if(count === ''){
        count = antispam.count;
    }
    
    let newschannel = req.body.newschannel || []
    let blacklist = req.body.blacklist || []
    const autoroles = req.body.autoroles || []
    updateGuildSetting(req.params.id,prefix,modlog,welcomechannel,invitelog,level,xpsystem,xp,cooldown,muterole,antispamSet)
    updateXPBlacklist(req.params.id,blacklist)
    updateWelcome(req.params.id,msg,dm,welcomedm,welcomemsg)
    updateNews(req.params.id,newschannel)
    updateAntispam(req.params.id,antiChannel,difference,count,antimute,antiwarn,antidelete)
    updateAutoroles(req.params.id,autoroles)

    
    res.redirect(url.format({
        pathname:`/guild/${req.params.id}`,
        query:req.query,
      })
  );

    
})
router.get('/logout',(req,res)=>{
    if(!req.user) return res.redirect('www.menhera-chan.in');
    req.logout();
    res.redirect('https://menhera-chan.in/')
})


module.exports = router;