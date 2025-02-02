import { calcSkillLevel } from "BloomCore/utils/Utils"

const urlFunc = (uuid) => `https://sbd.evankhell.workers.dev/player/${uuid}`

const transformFunc = (data) => {
    const obj = {
        dungeons: data.dungeons
    }

    obj.dungeons.catalevel = Math.floor(calcSkillLevel("catacombs", data.dungeons.cataxp))

    return obj
}

const statsSBD = { urlFunc, transformFunc }

module.exports = { statsSBD }
