import request from "requestV2"
import { Data } from "./data.js"

const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        const itemName = lore[0]
        lore = lore.slice(1)
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))

        let hasChanged = false
        lore = lore.map(x => {

            if(/§f\[§a[\w\?]+§f\]/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                const player = Data.players[name]
                if(player?.hasChanged()) {
                    hasChanged = true
                }
                const noSuffix = x.replace(/ §b\(§6.*/, "")
                return createSuffix(noSuffix, player)
            }

            if(/§5§o §\w\w+§f: §\w\w+§b \(§e\d+§b\)/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                let player = Data.players[name]
                if(!player) {
                    Data.addPlayer(name)
                    player = Data.players[name]
                } else if(player.uuid == null) {
                    player.setUUID(name)
                }
                hasChanged = true
                return createSuffix(x, player)
            }

            return x.replace(/§5§o/,"")
        })
        if(hasChanged) {
            item.setLore(lore)
        }
    });
}

const createSuffix = (msg, player) => {
    if(!player) {
        return msg
    }
    return `${msg} §b(§6${player.catalevel}§b) §f[§a${player.secrets}§f] §f[§9${player.pb.catacombs["7"]}§f]§r`
}

module.exports = { registerPartyFinderTriggers }
