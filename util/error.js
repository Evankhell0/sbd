import Data from "../util/data.js"

const handleError = (message, error = " ") => {
    console.log(`[SBD] ${message} (${error})`)
    if(!Data.invalidKey && /invalid api key/i.test(error)) {
        Data.invalidKey = true;
    }
}

module.exports = { handleError }
