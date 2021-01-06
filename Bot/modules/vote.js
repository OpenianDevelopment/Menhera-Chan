const net = require("net");
module.exports = async function(client){
const server = net.createServer((c) => {
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write(`${client.guilds.size}`);
  c.on(`data`,(data)=>{
    var list = data.toString().split(",")
    list.forEach(async (element) => {
       var member = await client.users.fetch(element)
       member.send("Thank you for voting for me! \nAs a Reward you get 100 coins!")
    });
  })
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
}