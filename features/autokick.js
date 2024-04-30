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
    ChatLib.chat(player.toString())
    const pb = Math.floor(player.dungeons.pb["catacombs"]["7"]["rawS+"] / 1000)
    const requiredPB = getRequiredPB()
    if(pb && requiredPB && pb > requiredPB) {
        ChatLib.chat(`§8[§eSBD§8]§r Kicking ${player.name} (PB: §e${pb}§r | Req: §e${requiredPB}§r)`)
        if(Config.kickmessage) {
            ChatLib.command(`pc [SBD] Kicking ${player.name} (PB: ${timeToString(pb * 1000)} | Req: ${timeToString(requiredPB * 1000)})`)
        }
        setTimeout(() => {
            ChatLib.command(`party kick ${player.name}`)
        }, 200)
    }
}

const getRequiredPB = () => {
    requiredPB = Config.requiredPB;
    if(requiredPB != parseInt(requiredPB)) {
        return null
    }
    return parseInt(requiredPB)
}

module.exports = { autokick }
