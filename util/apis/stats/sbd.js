import { calcSkillLevel } from "BloomCore/utils/Utils"

const urlFuncCf = (uuid) => `https://sbd.evankhell.workers.dev/player/${uuid}`
const urlFuncAz = (uuid) => `http://sbd.hs.vc/player/${uuid}`

const transformFunc = (data) => {
    const obj = {
        dungeons: data.dungeons
    }

    obj.dungeons.catalevel = Math.floor(calcSkillLevel("catacombs", data.dungeons.cataxp))

    return obj
}

const statsSbdCf = { urlFunc: urlFuncCf, transformFunc, key: "stats-sbd-cf" }
const statsSbdAz = { urlFunc: urlFuncAz, transformFunc, key: "stats-sbd-az" }

module.exports = { statsSbdCf, statsSbdAz }
