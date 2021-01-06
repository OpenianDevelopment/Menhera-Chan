const CryptoJS = require('crypto-js');

function encrypt(token){
    return CryptoJS.AES.encrypt(token,'thisisshit')
}
function decrypt(token){
    return CryptoJS.AES.decrypt(token,'thisisshit')
}
function getPermissionGuilds(guilds){
    console.log(guilds);
    return guilds.filter(g=>(g.permissions&0x20)===0x20)
}

module.exports = {encrypt, decrypt, getPermissionGuilds}