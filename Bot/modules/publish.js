const { getNews } = require('../function/dbfunctions(2)')
module.exports = async (client,message)=>{
    if(message.channel.type!='news') return;
    if(!message.channel.permissionsFor(client.user.id).has(`MANAGE_MESSAGES`)) return
    const channels = await getNews(message.guild.id);
    if(channels.channels.includes(message.channel.id)){
        message.crosspost();
    }
}