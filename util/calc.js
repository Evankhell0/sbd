const timeToString = (timeMilliseconds) => {
    if(!timeMilliseconds) {
        return "No S+"
    }
    timeSeconds = Math.floor(timeMilliseconds / 1000)
    timeMinutes = Math.floor(timeSeconds / 60)
    return `${timeMinutes}:${(timeSeconds % 60).toString().padStart(2, "0")}`
}

module.exports = { timeToString }
