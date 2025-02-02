import { uuidMojang } from "./apis/uuid/mojang.js"
import { uuidAshcon } from "./apis/uuid/ashcon.js"

import { statsSBD } from "./apis/stats/sbd.js"
import { statsSBE } from "./apis/stats/sbecommands.js"
import { statsSkyCrypt } from "./apis/stats/skycrypt.js"

const uuidApis = [
    uuidMojang,
    uuidAshcon,
]

const statsApis = [
    statsSBD,
    statsSBE,
    statsSkyCrypt,
]

module.exports = { uuidApis, statsApis }
