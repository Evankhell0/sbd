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

module.exports = { timeToString, indexToFloor, yn }
