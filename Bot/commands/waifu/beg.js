const {addCoins, getProduct} = require("../../function/dbfunctions(2)")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'beg',
    category: 'waifu',
    description: 'Beg a waifu for money!',
    cooldown: 20,
    run: async (client,message,args)=>{
        //return message.channel.send("command not working!");
        let character = Math.floor(Math.random() * 43527) + 1;
        character = await getProduct(character);

        let TheCoins = Math.floor(Math.random()*150) + 2;
        let ResponsesArray = [
            "I don't have my credit card now",
            TheCoins,
            "Uhh i don't have money but you're cute *huggies*",
            "Well no",
            "Try someone else cutie",
            TheCoins,
            "*walks away*",
            "Can i give you something else owo",
            TheCoins,
            "Hmm let me think *runs away*",
            "Nonononononononono",
            "Sorry sweety",
            TheCoins,
        ];

        let NResponsesArray = ResponsesArray[Math.floor(Math.random() * ResponsesArray.length)+0];
        
        if(NResponsesArray<151) {
            addCoins(message.author.id, TheCoins);
            console.log(`Added ${TheCoins} coins to ${message.author.tag}`)
            return message.channel.send(`**${character.name}** gave you ${TheCoins} coins! Remember to say thanks!`);
        } else {
            return message.channel.send(`**${character.name}**: ${NResponsesArray}`)
        }
    }
}