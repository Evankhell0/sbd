import Config from "../Config.js"
import PartyMember from "../util/partymember.js"
import Data from "../util/data.js"
import { timeToString } from "../util/calc.js"

const autokick = register("chat", (username, dungeonClass, classLevel) => {
    if(!Config.autokick) {
        return
    }
    if(!Data.players[username]) {
        Data.players[username] = new PartyMember(username)
    }
    const player = Data.players[username]
    if(player.uuid == null) {
        player.init().then(() => {
            checkAndKick(player)
        })
    } else {
        checkAndKick(player)
    }
}).setCriteria(/&dParty Finder &r&f> &r&\w(\w+) &r&ejoined the dungeon group! \(&r&b(\w+) Level (\w+)&r&e\)&r/)

const checkAndKick = (player) => {
    const pb = getRawPB(Config.selectedfloor, player)
    const requiredPB = getRequiredPB()

    const secrets = player.dungeons.secrets
    const requiredSecrets = getRequiredSecrets()

    ChatLib.chat(player.toString(Config.selectedfloor, timeToString(pb)))
    if((pb && requiredPB && pb > requiredPB) || (requiredPB && noSPlus(pb, player))) {
        kickPlayer("pb", player.name, pb, requiredPB)
    } else if(secrets && requiredSecrets && secrets < requiredSecrets) {
        kickPlayer("secrets", player.name, secrets, requiredSecrets)
    }
}

const kickPlayer = (type, name, stat, statRequirement) => {
    ChatLib.chat(getKickPrivateMessage(type, name, stat, statRequirement))
    if(Config.kickmessage) {
        Data.staggerChatMessage(() => {
            ChatLib.command(getKickChatMessage(type, name, stat, statRequirement))
        })
    }
    Data.staggerChatMessage(() => {
        ChatLib.command(`party kick ${name}`)
    })
}

const getKickChatMessage = (type, name, stat, statRequirement) => {
    switch(type) {
        case "pb":
            return `pc [SBD] Kicking ${name} (PB: ${timeToString(stat)} | Req: ${timeToString(statRequirement)})`
        case "secrets":
            return `pc [SBD] Kicking ${name} (Secrets: ${stat} | Req: ${statRequirement})`
        default:
            return `pc [SBD] Kicking ${name}`
    }
}

const getKickPrivateMessage = (type, name, stat, statRequirement) => {
    switch(type) {
        case "pb":
            return `§8[§eSBD§8]§r Kicking ${name} (PB: §e${timeToString(stat)}§r | Req: §e${timeToString(statRequirement)}§r)`
        case "secrets":
            return `§8[§eSBD§8]§r Kicking ${name} (Secrets: §e${stat}§r | Req: §e${statRequirement}§r)`
        default:
            return `§8[§eSBD§8]§r Kicking ${name} (Error: Unknown Reason)`
    }
}

const getRawPB = (selectedfloor, player) => {
    switch(selectedfloor) {
        case 0:
            return player.dungeons.pb["catacombs"]["7"]["rawS+"]
        case 1:
            return player.dungeons.pb["master_catacombs"]["4"]["rawS+"]
        case 2:
            return player.dungeons.pb["master_catacombs"]["5"]["rawS+"]
        case 3:
            return player.dungeons.pb["master_catacombs"]["6"]["rawS+"]
        case 4:
            return player.dungeons.pb["master_catacombs"]["7"]["rawS+"]
        default:
            return 0
    }
}

const getRequiredPB = () => {
    requiredPB = Config.requiredPB
    if(requiredPB == parseInt(requiredPB)) {
        return parseInt(requiredPB) * 1000
    }
    if(/^\d+:\d\d$/.test(requiredPB)) {
        const split = requiredPB.split(":")
        const ms = (parseInt(split[0]) * 60 + parseInt(split[1])) * 1000
        return ms
    }
    return null
}

const getRequiredSecrets = () => {
    requiredSecrets = Config.requiredSecrets
    if(requiredSecrets == parseInt(requiredSecrets)) {
        return parseInt(requiredSecrets)
    }
    if(/^\d+k$/.test(requiredSecrets)) {
        const rawNr = requiredSecrets.replace("k", "")
        const nr = parseInt(rawNr) * 1000
        return nr
    }
    return null
}

const noSPlus = (pb, player) => {
    return pb == null && player.dungeons.cataxp && player.dungeons.secrets && player.dungeons.runs
}

module.exports = { autokick }
