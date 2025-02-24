import { timeToString } from "../../calc.js"

const urlFunc = (uuid) => `https://sky.shiiyu.moe/api/v2/dungeons/${uuid}`

const transformFunc = (data) => {
    const profiles = Object.values(data.profiles)
    const profile = profiles.find(profile => profile.selected)

    const obj = {
        dungeons: {
            pb: {
                catacombs: {},
                master_catacombs: {}
            },
            cataxp: profile.dungeons.catacombs.level.xp,
            secrets: profiles.map(profile => profile?.dungeons?.secrets_found || 0).reduce((a, b) => a + b, 0),
            runs: profile.dungeons.floor_completions,
            catalevel: profile.dungeons.catacombs.level.uncappedLevel
        }
    }

    for(let i = 1; i <= 7; i++) {
        const dungeonTypes = ["catacombs", "master_catacombs"]
        dungeonTypes.forEach(type => {
            obj.dungeons.pb[type][i] = this.getFloorPB(profile, type, i)
        })
    }

    return obj
}

const getFloorPB = (profile, type, floor) => {
    let timeS = null
    let timeSPlus = null

    try {
        timeS = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s"]
        timeSPlus = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s_plus"]
    } catch(e) { }

    const pb = {
        "S": timeToString(timeS),
        "S+": timeToString(timeSPlus),
        "rawS": timeS,
        "rawS+": timeSPlus
    }

    return pb
}

const statsSkyCrypt = { urlFunc, transformFunc, stagger: true, key: "stats-sky" }

module.exports = { statsSkyCrypt }
