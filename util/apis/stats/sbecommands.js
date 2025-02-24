import { timeToString } from "../../calc.js"

const urlFunc = (uuid) => `https://sbecommands-api.icarusphantom.dev/v1/sbecommands/cata/${uuid}`

const transformFunc = (data) => {
    const obj = {
        dungeons: {
            pb: {
                catacombs: floorsToPB(data.data.dungeons.catacombs.floors),
                master_catacombs: floorsToPB(data.data.dungeons.catacombs.master_mode_floors)
            },
            cataxp: data.data.dungeons.catacombs.skill.xp,
            secrets: data.data.dungeons.secrets_found,
            runs: getRunCount(data.data.dungeons.catacombs),
            catalevel: data.data.dungeons.catacombs.skill.level
        }
    }
    return obj
}

const floorsToPB = (floors) => {
    const obj = {}
    Object.entries(floors).forEach(([key, value]) => {
        let match = key.toString().match(/^floor_(\d)$/)
        if(!match) {
            return
        }
        let floor = match[1]
        obj[floor] = {
            "S": timeToString(value.fastest_s),
            "S+": timeToString(value.fastest_s_plus),
            "rawS": value.fastest_s,
            "rawS+": value.fastest_s_plus
        }
    })
    return obj
}

const getRunCount = (catacombs) => {
    let runCount = 0
    Object.entries(catacombs.floors).forEach(([key, value]) => {
        runCount += value.times_played
    })
    Object.entries(catacombs.master_mode_floors).forEach(([key, value]) => {
        runCount += value.times_played
    })
    return runCount
}

const statsSBE = { urlFunc, transformFunc, key: "stats-sbe" }

module.exports = { statsSBE }
