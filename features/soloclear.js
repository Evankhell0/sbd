import Dungeon from "BloomCore/dungeons/Dungeon"
import PogObject from "PogData"

import Config from "../Config.js"
import { timeToString, yn } from "../util/calc.js"

let finishedClear = false
const pogData = new PogObject("sbd", {
    soloClears: {}
})

export const registerSoloClearTriggers = () => {
    register("tick", () => {
        if(!Dungeon.inDungeon || !Config.tracksoloclears) {
            return
        }
        const dungeonScore = Dungeon.isPaul ? Dungeon.score - 10 : Dungeon.score
        if(!finishedClear && dungeonScore >= 300 && isSoloClear()) {
            finishedClear = true
            ChatLib.chat(formatEndOfRun(isPB()))
            saveSoloClear()
        }
    })

    register("worldLoad", () => {
        finishedClear = false
    })

    register("command", (floor = "F7", amount = 5) => {
        const floorUpper = floor.toUpperCase()
        const sorted = pogData.soloClears[floorUpper]?.sort((a, b) => a.seconds - b.seconds) ?? []
        ChatLib.chat(`§8[§eSBD§8]§r Top Solo Clears (§e${floorUpper}§r):`)
        for(let i = 0; i < amount; i++) {
            if(sorted[i]) {
                formatSoloClear(sorted[i], i+1).chat()
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
                ChatLib.chat(` §7➜§r Sub ${multi} Clears: §a${sorted.filter(x => x.seconds < 60 * multi && x.seconds >= 60 * (multi - 1)).length}`)
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
    const puzzleHover = data.puzzles.join("\n")
    const extraHover = `Date: ${new Date(data.date).toLocaleDateString("en-US")}
Mimic: ${yn(data.mimicKilled)}
Paul: ${yn(data.isPaul)}`
    const message = new Message(
        `§8[§e#${rank}§8]§r §b${timeToString(data.seconds * 1000)}§r | §a${data.secretsFound}§r/§a${data.totalSecrets}§r | `,
        new TextComponent(`§d${data.completedPuzzles}P§r`).setHover("show_text", `${puzzleHover}`),
        `§r | §a${data.crypts}c§r | `,
        new TextComponent(`§7Extra§r`).setHover("show_text", `${extraHover}`),
    )
    return message
}

const formatEndOfRun = (isPB) => {
    return `§8[§eSBD§8]§r Reached 300 score in §b${timeToString(Dungeon.seconds * 1000)}§r (§e${Dungeon.floor}§r)${isPB ? " (§d§lPB§r)" : ""}`
}

const isSoloClear = () => {
    const lines = Scoreboard.getLines()
    for(let i = 0; i < lines.length; i++) {
        if(/§3§lSolo/.test(lines[i])) {
            return true
        }
    }
    return false
}

const isPB = () => {
    if(!pogData.soloClears[Dungeon.floor]) {
        return true
    }
    const pb = Math.min(...pogData.soloClears[Dungeon.floor].map(x => x.seconds))
    return Dungeon.seconds < pb
}
