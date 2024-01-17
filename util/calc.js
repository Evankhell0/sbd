const timeToString = (timeMilliseconds) => {
    if(!timeMilliseconds) {
        return "No S+"
    }
    timeSeconds = Math.floor(timeMilliseconds / 1000)
    timeMinutes = Math.floor(timeSeconds / 60)
    return `${timeMinutes}:${(timeSeconds % 60).toString().padStart(2, "0")}`
}

const xpToCataLevel = (cataXp) => {
    let i
    let currentXP = 0
    for(i = 0; i < CATA_XP_REQUIREMENTS.length; i++) {
        currentXP += CATA_XP_REQUIREMENTS[i]
        if(currentXP > cataXp) {
            break
        }
    }
    return i
}

const CATA_XP_REQUIREMENTS = [
    50,
    75,
    110,
    160,
    230,
    330,
    470,
    670,
    950,
    1340,
    1890,
    2665,
    3760,
    5260,
    7380,
    10300,
    14400,
    20000,
    27600,
    38000,
    52500,
    71500,
    97000,
    132000,
    180000,
    243000,
    328000,
    445000,
    600000,
    800000,
    1065000,
    1410000,
    1900000,
    2500000,
    3300000,
    4300000,
    5600000,
    7200000,
    9200000,
    12000000,
    15000000,
    19000000,
    24000000,
    30000000,
    38000000,
    48000000,
    60000000,
    75000000,
    93000000,
    116250000
]

module.exports = { timeToString, xpToCataLevel }
