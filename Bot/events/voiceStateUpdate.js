module.exports = (client,oldMem,newMem)=>{
    
   if(newMem.id!=client.user.id) return;
   
   if(newMem.channelID != null) return;
   
   client.queue.delete(newMem.guild.id)
}