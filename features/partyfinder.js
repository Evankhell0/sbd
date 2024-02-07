import request from "requestV2"
import { decodeNumeral } from "BloomCore/utils/Utils"

import Config from "../Config.js"
import { Data } from "../util/data.js"
import { PartyMember } from "../util/partymember.js"

const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        if(!Config.partyfinder) {
            return
        }
        const itemName = lore[0]
        lore = lore.slice(1)
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))

        const floor = getFloor(lore)
        const dungeonType = getDungeonType(lore)
        let hasChanged = false

        lore = lore.map(x => {
            if(!/§5§o §\w\w+§f: §\w\w+§b/.test(x)) {
                return x.replace(/§5§o/, "")
            }

            const username = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
            if(!Data.players[username]) {
                Data.players[username] = new PartyMember(username)
            }
            const player = Data.players[username]

            if(hasSuffix(x) && !player.hasChanged()) {
                return x
            }

            if(player.uuid == null) {
                player.setUUID(username)
            }

            hasChanged = true
            return createSuffix(x, player, floor, dungeonType)
        })
        if(hasChanged) {
            item.setLore(lore)
        }
    });
}

const hasSuffix = (msg) => {
    return /§0§r§r/.test(msg)
}

const removeSuffix = (msg) => {
    return msg.replace(/§0§r§r.*/, "")
}

const createSuffix = (msg, player, floor, dungeonType) => {
    if(!player) {
        return msg
    }
    let suffix = "§0§r§r"
    if(Config.partyfinderCata) {
        suffix += ` §b(§6${player.catalevel ?? "?"}§b)§r`
    }
    if(Config.partyfinderSecrets && Config.partyfinderSecretAverage) {
        suffix += ` §8[§a${player.secrets ?? "?"}§8/§b${player.secretAverage ?? "?"}§8]§r`
    } else {
        if(Config.partyfinderSecrets) {
            suffix += ` §8[§a${player.secrets ?? "?"}§8]§r`
        }
        if(Config.partyfinderSecretAverage) {
            suffix += ` §8[§b${player.secretAverage ?? "?"}§8]§r`
        }
    }
    if(Config.partyfinderF7PB) {
        suffix += ` §8[§9${player.pb[dungeonType][floor]?.["S+"] ?? "?"}§8]§r`
    }
    return `${removeSuffix(msg)}${suffix}`
}

const getFloor = (lore) => {
    const floorLine = lore.find(x => /§7Floor: §bFloor /.test(x))
    if(floorLine) {
        const split = floorLine.split(" ")
        floor = decodeNumeral(split[split.length - 1])
        return floor
    }
    return 0
}

const getDungeonType = (lore) => {
    if(lore.some(x => /§5§o§7Dungeon: §bMaster Mode Catacombs/.test(x))) {
        return "master_catacombs"
    }
    return "catacombs"
}

module.exports = { registerPartyFinderTriggers }
