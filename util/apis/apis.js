import { uuidMojang } from "./uuid/mojang.js"
import { uuidAshcon } from "./uuid/ashcon.js"

import { statsSbdCf, statsSbdAz } from "./stats/sbd.js"
import { statsSBE } from "./stats/sbecommands.js"
import { statsSkyCrypt } from "./stats/skycrypt.js"

const uuidApis = [
    uuidMojang,
    uuidAshcon,
]

const statsApis = [
    statsSbdAz,
    statsSbdCf,
    statsSBE,
    statsSkyCrypt,
]

module.exports = { uuidApis, statsApis }
