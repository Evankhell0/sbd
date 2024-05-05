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
            checkAndKick(player);
        })
    } else {
        checkAndKick(player);
    }
}).setCriteria(/&dParty Finder &r&f> &r&\w(\w+) &r&ejoined the dungeon group! \(&r&b(\w+) Level (\w+)&r&e\)&r/);

const checkAndKick = (player) => {
    const pb = getRawPB(Config.selectedfloor, player)
    const requiredPB = getRequiredPB()
    ChatLib.chat(player.toString(Config.selectedfloor, timeToString(pb)))
    if(pb && requiredPB && pb > requiredPB) {
        ChatLib.chat(`§8[§eSBD§8]§r Kicking ${player.name} (PB: §e${timeToString(pb)}§r | Req: §e${timeToString(requiredPB)}§r)`)
        if(Config.kickmessage) {
            ChatLib.command(`pc [SBD] Kicking ${player.name} (PB: ${timeToString(pb)} | Req: ${timeToString(requiredPB)})`)
        }
        setTimeout(() => {
            ChatLib.command(`party kick ${player.name}`)
        }, 400)
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
    requiredPB = Config.requiredPB;
    if(requiredPB != parseInt(requiredPB)) {
        return null
    }
    return parseInt(requiredPB) * 1000
}

module.exports = { autokick }
