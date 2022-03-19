const mongoose = require('mongoose'),
    guildSettings = require('../database/guildSettings'),
    LevelXP = require('../database/LevelXP'),
    warnings = require('../database/warnings'),
    moderations = require('../database/moderations'),
    xpblacklist = require('../database/xpblacklist'),
    rp = require('../database/rp'),
    bl = require('../database/blacklist'),
    mal = require('../database/myanimelist');


module.exports = {
    // adding or initializing guild settings
    addGuildSetting: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (!guild) {
                var guild = new guildSettings({
                    guild: guildID,
                    prefix: 'mc!',
                    logchannel: null,
                    welcomechannel: null,
                    invitelog: null,
                    xplog: null,
                    xpsystem: 0,
                    xp: 1,
                    xpcooldown: 8000,
                    muterole: null,
                    antispam: 0
                })
                guild.save();
            }
        })
    },
    //getting the guild setting
    getGuildSetting: async function (guildID) {
        var guildSetting = await guildSettings.findOne({
            guild: guildID
        })
        return (guildSetting);
    },
    //deleting db when bot is kicked out of the server.
    removeGuildSetting: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (guild) {
                guildSettings.deleteOne({ guild: guildID }, err => { if (err) throw err; });
            }
        })
    },
    //Changing prefix
    ChangePrefix: function (prefixnew, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.prefix = prefixnew;
            result.save();
        })
    },
    setXP: function (xp, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.xp = xp;
            result.save();
        })
    },
    setCD: function (CD, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.xpcooldown = CD;
            result.save();
        })
    },
    //changing or addding or removing mod log channel
    addModLog: function (channel, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.logchannel = channel;
            result.save();
        })
    },
    removeModLog: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.logchannel = null;
            result.save();
        })
    },
    //changing or adding or removing welcome channel
    addWelcome: function (channel, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.welcomechannel = channel;
                result.save();
            }
        })
    },

    removeWelcome: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.welcomechannel = null;
                result.save();
            }
        })
    },

    //changing invite log
    addinviteLog: function (channel, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.invitelog = channel;
                result.save();
            }
        })
    },

    removeinviteLog: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.invitelog = null;
                result.save();
            }
        })
    },
    // adding or removing mute role
    addMute: function (role, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.muterole = role;
                result.save();
            }
        })
    },

    removeMute: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.muterole = null;
                result.save()
            }
        })
    },

    //initializing xp 
    initXP: function (guildID) {
        LevelXP.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (!result) {
                var guildXP = new LevelXP({
                    guild: guildID
                })
                guildXP.save(err => {
                    if (err) throw err;
                });
            }
        })
    },

    addXP: function (guildID, userID, newxp, newlevel, newminxp, newmaxxp) {
        LevelXP.findOne({
            guild: guildID,
            'users.user': userID
        }, 'users.$', (err, result) => {
            if (err) throw err;
            if (!result) {
                LevelXP.findOne({
                    guild: guildID
                }, (err, newresult) => {
                    if (err) throw err;
                    newresult.users.push({
                        user: userID,
                        xp: newxp,
                        level: newlevel,
                        minxp: newminxp,
                        maxxp: newmaxxp
                    })
                    newresult.save((err) => {
                        if (err) throw err;
                    });
                })

            }
            if (result) {
                LevelXP.updateOne({ guild: guildID, 'users.user': userID }, {
                    '$set': {
                        'users.$.xp': newxp,
                        'users.$.level': newlevel,
                        'users.$.minxp': newminxp,
                        'users.$.maxxp': newmaxxp
                    }
                }, (err) => {
                    if (err) throw err;

                })
            }

        })
    },
    enableXP: function (guildID, digit) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.xpsystem = digit;
                result.save();
            }
        })
    },
    getXP: function (userID, guildID) {
        var userXP = LevelXP.findOne({
            guild: guildID,
            'users.user': userID
        }, 'users.$')
        return userXP;
    },
    initWarn: function (guildID) {
        warnings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (!result) {
                var guildWarn = new warnings({
                    guild: guildID
                })
                guildWarn.save(err => {
                    if (err) throw err;
                });
            }
        })
    },
    addWarn: function (guildID, userID, warning, moderator, date) {
        warnings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.warning.push({
                user: userID,
                warn: warning,
                mod: moderator,
                date: date
            })
            result.save()
        })
    },
    getWarn: async function (guildID, userID) {
        var warns = await warnings.findOne({
            guild: guildID
        }).then(d => d.warning.filter(w => w.user === userID)).catch(e => console.log(e))


        return warns;
    },
    removeWarn: function (guildID, id) {
        try {
            id = mongoose.Types.ObjectId(id);
        } catch {
            return false
        }
        warnings.updateOne({ guild: guildID }, { "$pull": { "warning": { _id: id } } }, { safe: true, multi: true }, function (err, obj) {
            //do something smart
            if (err) return false;
            return true;
        });
    },
    initModeration: function (guildID) {
        moderations.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (!result) {
                var mod = new moderations({
                    guild: guildID
                })
                mod.save(err => {
                    if (err) throw err;
                })
            }
        })
    },
    addModeration: function (guildID, userID, type, time) {
        var id = mongoose.Types.ObjectId();
        moderations.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.moderations.push({
                _id: id,
                user: userID,
                modtype: type,
                time: time
            })

            result.save((err) => {
                if (err) throw err;
            })
        })
        return id;
    },
    removeModeration: function (guildID, userID, type) {
        moderations.updateOne({ guild: guildID }, { "$pull": { "moderations": { user: userID, modtype: type } } }, { safe: true, multi: true }, function (err, obj) {
            //do something smart
            if (err) throw err;
        });
    },
    getModeration: async function (guildID) {
        var mod = await moderations.findOne({
            guild: guildID
        })
        return mod
    },
    getModerationOne: async function (guildID, id) {
        var mod = await moderations.findOne({
            guild: guildID,
            'moderations._id': id
        }, 'moderations.$')

        return mod;
    },
    initXPBlacklist: function (guildID) {
        xpblacklist.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (!result) {
                var xpguild = new xpblacklist({
                    guild: guildID
                })
                xpguild.save(err => {
                    if (err) throw err;
                });
            }
        })
    },
    addXPBlacklist: function (guildID, channelID) {
        xpblacklist.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            if (result.channels.find(data => data.channel == channelID)) return
            result.channels.push({
                channel: channelID
            })

            result.save((err) => {
                if (err) throw err;
            })
        })
    },
    removeXPBlacklist: function (guildID, channelID) {
        xpblacklist.updateOne({ guild: guildID }, { "$pull": { "channels": { channel: channelID } } }, { safe: true, multi: true }, function (err, obj) {
            //do something smart
            if (err) throw err;
        });
    },
    getXPBlacklist: async function (guildID) {
        var channel = await xpblacklist.findOne({
            guild: guildID
        })
        return channel
    },
    removeGuildModerations: function (guildID) {
        moderations.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (guild) {
                moderations.deleteOne({ guild: guild.id });
            }
        })
    },
    removeGuildWarns: function (guildID) {
        warnings.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (guild) {
                warnings.deleteOne({ guild: guild.id });
            }
        })
    },
    removeGuildXP: function (guildID) {
        LevelXP.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (guild) {
                LevelXP.deleteOne({ guild: guild.id });
            }
        })
    },
    removeGuildXPBlacklist: function (guildID) {
        xpblacklist.findOne({
            guild: guildID
        }, (err, guild) => {
            if (err) throw err;
            if (guild) {
                xpblacklist.deleteOne({ guild: guild.id });
            }
        })
    },
    addLevelLog: function (channel, guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.xplog = channel;
            result.save();
        })
    },
    removeLevelLog: function (guildID) {
        guildSettings.findOne({
            guild: guildID
        }, (err, result) => {
            if (err) throw err;
            result.xplog = null;
            result.save();
        })
    },
    RpADD: async function (MOD, IMG) {
        rpData = new rp({
            _id: mongoose.Types.ObjectId(),
            mod: MOD,
            img: IMG
        })
        rpData.save();
    },

    Rp: async function (MOD) {
        var Image = await rp.find({ mod: MOD })
        return (Image)
    },

    RpDROP: async function (_ID) {
        rp.findOne({
            _id: _ID
        }), (err, result) => {
            if (!result) {
                return
            }
            else {
                result.drop();
            }
        }
    },
    blADD: function (ID, mod) {
        bl.findOne({
            id: ID,
            mod: mod
        }, (err, result) => {
            if (err) throw err;
            if (!result) {
                var BL = new bl({
                    _id: mongoose.Types.ObjectId(),
                    id: ID,
                    mod: mod
                })
                BL.save();
            }
        })
    },
    blDROP: function (ID, mod) {
        bl.findOneAndDelete({ id: ID, mod: mod }, err => { if (err) throw err; })
    },
    bl: async function (ID, mod) {
        var BL = await bl.findOne({
            id: ID,
            mod: mod
        })
        return BL;
    },
    addMalProfile: function (username, user) {
        mal.findOne({
            user: user
        }, (err, result) => {
            if (err) throw err;
            if (result) {
                result.username = username;
                result.save();

            }
            else {
                var newprofile = new mal({
                    username: username,
                    user: user
                })
                newprofile.save();
            }
        })
    },
    getMalProfile: async function (userID) {
        var result = await mal.findOne({
            user: userID
        })
        return (result);
    },
    checkData: async function (guildID) {
        var data = await guildSettings.find({ __v: 0 })
        var check = false;
        var i = 0;
        data.forEach(element => {
            check = false
            guildID.forEach(element1 => {
                if (element1 === element.guild) { check = true }
            })
            if (check == false) {
                i++
                guildSettings.findOne({
                    guild: element.guild
                }, (err, guild) => {
                    if (err) throw err;
                    if (guild) {
                        guildSettings.deleteOne({ guild: element.guild }, err => { if (err) throw err; });
                    }
                })
            }
        });
        return i
    },
}