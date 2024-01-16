import request from "requestV2"
import { Data } from "./data.js"

const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        const itemName = lore[0];
        lore = lore.slice(1);
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))

        let hasChanged = false;
        lore = lore.map(x => {

            if(/§f\[§a\w+§f\]§r/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                const player = Data.players[name]
                if(player?.uuid.new != player?.uuid.old || player?.secrets.new != player?.secrets.old) {
                    hasChanged = true;
                }
                const noSuffix = x.replace(/ §f\[§a\w+§f\]§r/, "")
                return `${noSuffix} §f[§a${player?.getSecrets()}§f]§r`
            }

            if(/§5§o §\w\w+§f: §\w\w+§b \(§e\d+§b\)/.test(x)) {
                const name = x.replace(/(.*§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\).*)/g, "")
                Data.addPlayer(name)
                hasChanged = true;
                return `${x} §f[§a0§f]§r`
            }

            return x.replace(/§5§o/,"");
        })
        if(hasChanged) {
            item.setLore(lore)
        }

    });
}

module.exports = { registerPartyFinderTriggers }
