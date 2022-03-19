const ecoMap = new Map();
const { initEcoUser, getUserEarnings, updateUserEarnings } = require('../function/dbfunctions(2)')
module.exports = async (message) => {
    await initEcoUser(message.author)
    const cooldown = 10000;
    const earning = 10;
    if (ecoMap.has(message.author.id)) {
        const userData = ecoMap.get(message.author.id);
        const { lastcmd } = userData;
        const difference = message.createdTimestamp - lastcmd.createdTimestamp;

        if (difference > cooldown) {
            const data = await getUserEarnings(message.author);
            //update coins count
            //console.log(data.balance)
            let newAmt = data.balance + earning;
            newAmt = parseInt(newAmt)
            // console.log(newAmt)
            await updateUserEarnings(message.author, newAmt);

            //change lastcmd
            userData.lastcmd = message;
            ecoMap.set(message.author.id, userData);
        }
    }
    else {
        ecoMap.set(message.author.id, {
            lastcmd: message
        })
    }

}