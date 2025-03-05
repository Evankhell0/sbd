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
        const dungeonScore = Dungeon.isPaul ? Dungeon.score - 10 : Dungeon.score
        if(!finishedClear && dungeonScore >= 300 && Dungeon.partySize == 0) {
            finishedClear = true
            ChatLib.chat(`§8[§eSBD§8]§r Reached 300 score in §b${Dungeon.seconds}s§r (§e${Dungeon.floor}§r)`)
            saveSoloClear()
        }
    })

    register("worldLoad", () => {
        finishedClear = false
    })

    register("command", () => {
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
        ChatLib.chat("mimicKilled: " + Dungeon.mimicKilled)
    }).setName("dst")

    register("command", (floor = "F7", amount = 5) => {
        const floorUpper = floor.toUpperCase()
        const sorted = pogData.soloClears[floorUpper]?.sort((a, b) => a.seconds - b.seconds) ?? []
        ChatLib.chat(`§8[§eSBD§8]§r Top Solo Clears (§e${floorUpper}§r):`)
        for(let i = 0; i < amount; i++) {
            if(sorted[i]) {
                ChatLib.chat(formatSoloClear(sorted[i], i+1))
            }
        }
    }).setName("topsoloclears")

    register("command", (floor = "F7") => {
        const floorUpper = floor.toUpperCase()
        const sorted = pogData.soloClears[floorUpper]?.sort((a, b) => a.seconds - b.seconds) ?? []
        ChatLib.chat(`§8[§eSBD§8]§r Solo Clear Stats (§e${floorUpper}§r):`)
        ChatLib.chat(` §7➜§r Fastest Clear: §b${sorted.length ? timeToString(sorted[0]?.seconds * 1000) : "n/a"}`)
        ChatLib.chat(` §7➜§r Total Clears: §a${sorted.length}`)
        if(sorted.length) {
            for(let i = 1; i < 4; i++) {
                const multi = Math.floor(sorted[0]?.seconds / 60) + i
                ChatLib.chat(` §7➜§r Sub ${multi} Clears: §a${sorted.filter(x => x.seconds < 60 * multi).length}`)
            }
        }
    }).setName("soloclearstats")
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
        isPaul: Dungeon.isPaul,
        date: Date.now()
    }
    if(!pogData.soloClears[Dungeon.floor]) {
        pogData.soloClears[Dungeon.floor] = []
    }
    pogData.soloClears[Dungeon.floor].push(obj)
    pogData.save()
}

const formatSoloClear = (data, rank = 0) => {
    return `§8[§e#${rank}§8]§r §b${timeToString(data.seconds * 1000)}§r | §a${data.secretsFound}§r/§a${data.totalSecrets}§r | §d${data.completedPuzzles}P§r | §a${data.crypts}c§r`
}
