const handleError = (message, error = " ") => {
    console.log(`[SBD] ${message} (${error})`)
}

module.exports = { handleError }
