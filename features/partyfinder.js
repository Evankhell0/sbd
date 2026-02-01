import request from "requestV2"

import Config from "../Config.js"
import Data from "../util/data.js"
import PartyMember from "../util/partymember.js"
import { decodeRomanFloor } from "../util/calc.js"

const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        if(!Config.partyfinder/* && !Config.missingclasses*/) {
            return
        }
        const itemName = lore[0]
        //lore = lore.slice(1)
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))

        const floor = getFloor(lore)
        const dungeonType = getDungeonType(lore)
        let hasChanged = false

        /*if(Config.missingclasses && isPartyFinderTooltip(itemName) && !hasMissingClasses(lore)) {
            const missingClasses = getMissingClasses(lore)
            lore.push(createMissingClassesString(missingClasses))
            item.setLore(lore)
        }*/

        if(!Config.partyfinder || !isPartyFinderTooltip(itemName)) {
            return
        }
        lore = lore.map(x => {
            const str = x.toString()
            if(!/§\w\w+(§r)*§f:\s*(§\w\s*)*§\w\w+\s*(§r\s*)*§b/.test(str)) {
                return new TextComponent(str)
            }

            const username = getUsername(str)
            if(!Data.players[username]) {
                Data.players[username] = new PartyMember(username)
            }
            const player = Data.players[username]

            if(hasCustomSuffix(str) && !player.hasChanged()) {
                return new TextComponent(str)
            }

            /*if(player.uuid == null) {
                player.init()
            }*/

            hasChanged = true
            const suffix = createSuffix(str, player, floor, dungeonType)
            return new TextComponent(suffix)
        })
        if(hasChanged) {
            item.setLore(lore)
        }
    })

    /*register("guiRender", (mouseX, mouseY, gui) => {
        const inv = Player.getOpenedInventory()
        if(!inv || inv?.getName() != "Catacombs Gate") {
          return
        }

        const slot = inv?.getStackInSlot(45)
        const itemName = slot?.getName()
        const lore = slot?.getLore()

        if(!isDungeonClassTooltip(itemName)) {
          return
        }

        Data.class = getDungeonClass(lore)
    })*/
}

const isPartyFinderTooltip = (line) => {
    return /(§\w)*\w+'s Party/.test(line)
}

const isDungeonClassTooltip = (line) => {
    return /§\wDungeon Classes/.test(line)
}

const getDungeonClass = (lore) => {
    const classRegex = /§\wCurrently Selected: §\w(\w+)/
    return lore.find(x => classRegex.test(x)).match(classRegex)?.[1]
}

const createMissingClassesString = (missingClasses) => {
    if(!Config.highlightClass) {
        return `§e§lMissing:§r§f ${missingClasses.join(", ")}`
    }
    return `§e§lMissing:§r§f ${missingClasses.map(x => x == Data.class ? "§6" + x + "§r" : x).join(", ")}`
}

const hasMissingClasses = (lore) => {
    return lore.some(x => /Missing:§r/.test(x))
}

const hasCustomSuffix = (msg) => {
    return /§r   /.test(msg)
}

const removeSuffix = (msg) => {
    return msg.replace(/\s*(§\w\s*)*\((§r)*§e\d+(§r)*§b\).*/, "")
}

const createSuffix = (msg, player, floor, dungeonType) => {
    if(!player) {
        return msg
    }
    let suffix = ""
    if(Config.partyfinderClassLevel) {
        suffix += ` §b(§e${getClassLevel(msg) ?? "?"}§b)§r`
    }
    if(Config.partyfinderCata) {
        if(!Config.partyfinderClassLevel && !player.dungeons.catalevel) {
            suffix += ` §b(§e${getClassLevel(msg) ?? "?"}§b)§r`
        } else {
            suffix += ` §b(§6${player.dungeons.catalevel ?? "?"}§b)§r`
        }
    }
    if(Config.partyfinderSecrets && Config.partyfinderSecretAverage) {
        suffix += ` §8[§a${player.dungeons.secrets ?? "?"}§8/§b${player.dungeons.secretAverage ?? "?"}§8]§r`
    } else {
        if(Config.partyfinderSecrets) {
            suffix += ` §8[§a${player.dungeons.secrets ?? "?"}§8]§r`
        }
        if(Config.partyfinderSecretAverage) {
            suffix += ` §8[§b${player.dungeons.secretAverage ?? "?"}§8]§r`
        }
    }
    if(Config.partyfinderF7PB) {
        suffix += ` §8[§9${player.dungeons.pb[dungeonType][floor]?.["S+"] ?? "?"}§8]§r`
    }
    suffix += "§r   "
    return `${removeSuffix(msg)}${suffix}`
}

const getFloor = (lore) => {
    const floorLine = lore.find(x => /(§r)*§7Floor: (§r)*§bFloor /.test(x))
    if(floorLine) {
        const floor = floorLine.toString().split(" ").pop()
        if(floor != parseInt(floor)) {
            return decodeRomanFloor(floor)
        }
        return parseInt(floor)
    }
    return 0
}

const getDungeonType = (lore) => {
    if(lore.some(x => /(§r)*§7Dungeon: (§r)*§bMaster Mode( The)* Catacombs/.test(x))) {
        return "master_catacombs"
    }
    return "catacombs"
}

const getClassLevel = (msg) => {
    return msg.match(/\((§r)*§e(\d+)(§r)*§b\)/)[2]
}

const getUsername = (msg) => {
    return msg.match(/§\w(\w+)(§r)*§f:/)[1]
}

const getMissingClasses = (lore) => {
    let classes = ["Archer", "Berserk", "Mage", "Tank", "Healer"]
    lore.forEach(x => {
        const str = x.toString()
        const match = str.match(/§5§o §\w\w+§f: §\w(\w+)§\w \(§e\d+§b\)/)
        if(match) {
            classes = classes.filter(x => str != match[1])
        }
    })
    return classes
}

module.exports = { registerPartyFinderTriggers }
