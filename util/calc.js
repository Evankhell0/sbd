const timeToString = (timeMilliseconds) => {
    if(!timeMilliseconds) {
        return "No S+"
    }
    timeSeconds = Math.floor(timeMilliseconds / 1000)
    timeMinutes = Math.floor(timeSeconds / 60)
    return `${timeMinutes}:${(timeSeconds % 60).toString().padStart(2, "0")}`
}

// for Config.selectedfloor
const indexToFloor = (index) => {
    switch(index) {
        case 0:
            return "F7"
        case 1:
            return "M4"
        case 2:
            return "M5"
        case 3:
            return "M6"
        case 4:
            return "M7"
        default:
            return "?"
    }
}

const yn = (bool) => {
    return bool ? "Yes" : "No"
}

const decodeRomanFloor = (roman) => {
    if(!roman) {
        return 0
    }
    // only works up to VII for now
    const numerals = ["E", "I", "II", "III", "IV", "V", "VI", "VII"]
    return numerals.indexOf(roman)
}

const CATA_XP_REQUIREMENTS = [
    50,
    125,
    235,
    395,
    625,
    955,
    1425,
    2095,
    3045,
    4385,
    6275,
    8940,
    12700,
    17960,
    25340,
    35640,
    50040,
    70040,
    97640,
    135640,
    188140,
    259640,
    356640,
    488640,
    668640,
    911640,
    1239640,
    1684640,
    2284640,
    3084640,
    4149640,
    5559640,
    7459640,
    9959640,
    13259640,
    17559640,
    23159640,
    30359640,
    39559640,
    51559640,
    66559640,
    85559640,
    109559640,
    139559640,
    177559640,
    225559640,
    285559640,
    360559640,
    453559640,
    569809640
]

const calcSkillLevel = (cataXp) => {
    let i
    for(i = 0; i < CATA_XP_REQUIREMENTS.length; i++) {
        if(CATA_XP_REQUIREMENTS[i] > cataXp) {
            break
        }
    }
    const remainingXp = cataXp - CATA_XP_REQUIREMENTS[49]
    const level = remainingXp > 0 ? i + Math.floor(remainingXp / 200000000) : i
    return level
}

module.exports = { timeToString, indexToFloor, yn, decodeRomanFloor, calcSkillLevel }
