import Dungeon from "BloomCore/dungeons/Dungeon"
import PogObject from "PogData"

import Config from "../Config.js"
import { timeToString } from "../util/calc.js"

let finishedClear = false
const pogData = new PogObject("sbd", {
    soloClears: {}
})

export const registerSoloClearTriggers = () => {
    register("tick", () => {
        if(!Dungeon.inDungeon) {
            return
        }
        if(!finishedClear && Dungeon.score >= 300 && Dungeon.partySize == 0) {
            finishedClear = true
            ChatLib.chat(`§8[§eSBD§8]§r Reached 300 score in §e${Dungeon.seconds}§rs`)
            saveSoloClear()
        }
    })

    register("worldLoad", () => {
        finishedClear = false
    })

    register("command", (args) => {
        ChatLib.chat("inDungeon: " + Dungeon.inDungeon)
        ChatLib.chat("score: " + Dungeon.score)
        ChatLib.chat("secretsFound: " + Dungeon.secretsFound)
        ChatLib.chat("totalSecrets: " + Dungeon.totalSecrets)
        ChatLib.chat("crypts: " + Dungeon.crypts)
        ChatLib.chat("completedPuzzles: " + Dungeon.completedPuzzles)
        ChatLib.chat("puzzles: " + Dungeon.puzzles)
        ChatLib.chat("seconds: " + Dungeon.seconds)
        ChatLib.chat("partySize: " + Dungeon.partySize)
        ChatLib.chat("floor: " + Dungeon.floor)
        ChatLib.chat("floorNumber: " + Dungeon.floorNumber)
        ChatLib.chat("dungeonType: " + Dungeon.dungeonType)
    }).setName("dst")

    register("command", (args) => {
        console.log(JSON.stringify(pogData, null, 2))
        ChatLib.chat(JSON.stringify(pogData, null, 2))
    }).setName("soloclears")

    register("command", (args) => {
        const sorted = pogData.soloClears["F7"].sort((a, b) => b.seconds - a.seconds)
        ChatLib.chat(`§8[§eSBD§8]§r Top Solo Clears (F7):`)
        for(let i = 0; i < 5; i++) {
            if(sorted[i]) {
                ChatLib.chat(formatSoloClear(sorted[i], i+1))
            }
        }
    }).setName("topsoloclears")
}

const saveSoloClear = () => {
    const obj = {
        secretsFound: Dungeon.secretsFound,
        totalSecrets: Dungeon.totalSecrets,
        crypts: Dungeon.crypts,
        completedPuzzles: Dungeon.completedPuzzles,
        puzzles: Dungeon.puzzles,
        seconds: Dungeon.seconds,
        mimicKilled: Dungeon.mimicKilled,
        date: Date.now()
    }
    if(!pogData.soloClears[Dungeon.floor]) {
        pogData.soloClears[Dungeon.floor] = []
    }
    pogData.soloClears[Dungeon.floor].push(obj)
    pogData.save()
}

const formatSoloClear = (data, rank = 0) => {
    return `§8[§e#${rank}§8]§r §b${timeToString(data.seconds * 1000)}§r | §a${data.secretsFound}§r/§a${data.totalSecrets}§r | §a${data.completedPuzzles}P§r | §a${data.crypts}c§r`
}
