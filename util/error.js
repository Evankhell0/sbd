import Data from "../util/data.js"

const handleError = (message, error = " ") => {
    if(/invalid api key/i.test(error)) {
        if(!Data.invalidKey) {
            console.log("[SBD] Invalid API Key, switching to SkyCrypt API")
        }
        Data.invalidKey = true;
    } else {
        console.log(`[SBD] ${message} (${error})`)
    }
}

module.exports = { handleError }
