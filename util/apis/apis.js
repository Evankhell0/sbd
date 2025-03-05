import { uuidMojang } from "./uuid/mojang.js"
import { uuidAshcon } from "./uuid/ashcon.js"
import { uuidPlayerDB } from "./uuid/playerdb.js"

import { statsSbdCf, statsSbdAz } from "./stats/sbd.js"
import { statsSkyCrypt } from "./stats/skycrypt.js"

const uuidApis = [
    uuidPlayerDB,
    uuidMojang,
    uuidAshcon
]

const statsApis = [
    statsSbdAz,
    statsSbdCf,
    statsSkyCrypt
]

module.exports = { uuidApis, statsApis }
