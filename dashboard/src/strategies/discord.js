const passport = require('passport');
const DiscordStrategy = require('passport-discord')
const User = require('../database/schemas/User')
const OAuth2Credentials = require('../database/schemas/OAuth2Credentials')
const { encrypt } = require('../utils/functions')
passport.serializeUser((user, done)=>{
    done(null, user.discordId)
})

passport.deserializeUser( async (discordId,done)=>{
    try{
        const user = await User.findOne({ discordId });
        return user ? done(null,user) : done(null,null);
    }
    catch(err){
        console.log(err);
        return done(err,null);
    }
})

passport.use(
    new DiscordStrategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLINET_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URI,
        scope: ['identify','guilds'],
    }, async (accessToken, refreshToken, profile, done)=>{
        const encryptaccessToken = encrypt(accessToken).toString()
        const encryptrefreshToken = encrypt(refreshToken).toString()
        let { id,username,discriminator,avatar,guilds } = profile;
        if(!avatar){
            avatar = 0
        }
        try{
            const findUser = await User.findOneAndUpdate({ discordId: id }, {
                discordTag: `${username}#${discriminator}`,
                avatar: avatar || null,
                guilds
            },{ new: true });
            const findCredentials = await OAuth2Credentials.findOneAndUpdate({discordId: id},{
                accessToken: encryptaccessToken,
                refreshToken: encryptrefreshToken
            })
            if(findUser){
                if(!findCredentials){
                    const newCredentials = OAuth2Credentials.create({
                        discordId: id,
                        accessToken: encryptaccessToken,
                        refreshToken: encryptrefreshToken
                    })
                }
                return done(null,findUser);
            }
            else{
                const newUser = await User.create({
                    discordId: id,
                    discordTag: `${username}#${discriminator}`,
                    avatar,
                    guilds
                });
                const newCredentials = OAuth2Credentials.create({
                    discordId: id,
                    accessToken: encryptaccessToken,
                    refreshToken: encryptrefreshToken
                })
                return done(null,newUser)
            }
        }
        catch(err){
            console.log(err);
            return done(err, null)
        }
    })
);