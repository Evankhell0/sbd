import request from "requestV2"

import { Data } from "../util/data.js"
import { romanToNumber } from "../util/calc.js"
import { PartyMember } from "../util/partymember.js"

const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        const itemName = lore[0]
        lore = lore.slice(1)
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))

        let floor = 0
        const floorLine = lore.find(x => /§7Floor: §bFloor /.test(x))
        if(floorLine) {
            const split = floorLine.split(" ")
            floor = romanToNumber(split[split.length - 1])
        }

        let hasChanged = false
        lore = lore.map(x => {

            if(/§b\(§6[\w\?]+§b\)/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                const player = Data.players[name]
                if(player?.hasChanged()) {
                    hasChanged = true
                }
                const noSuffix = x.replace(/ §b\(§6.*/, "")
                return createSuffix(noSuffix, player, floor)
            }

            if(/§5§o §\w\w+§f: §\w\w+§b \(§e\d+§b\)/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                let player = Data.players[name]
                if(!player) {
                    Data.players[name] = new PartyMember(name)
                    player = Data.players[name]
                } else if(player.uuid == null) {
                    player.setUUID(name)
                }
                hasChanged = true
                return createSuffix(x, player, floor)
            }

            return x.replace(/§5§o/,"")
        })
        if(hasChanged) {
            item.setLore(lore)
        }
    });
}

const createSuffix = (msg, player, floor) => {
    if(!player) {
        return msg
    }
    return `${msg} §b(§6${player.catalevel ?? "?"}§b) §8[§a${player.secrets ?? "?"}§8/§b${player.secretAverage ?? "?"}§8] §8[§9${player.pb.catacombs["7"] ?? "?"}§8]§r`
}

module.exports = { registerPartyFinderTriggers }
