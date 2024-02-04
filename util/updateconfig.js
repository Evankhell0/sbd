import { Data } from "../util/data.js"

const setApiKey = (apikey) => {
    const config = {
        key: apikey
    }
    FileLib.write("sbd", "/db/config.json", JSON.stringify(config))
    Data.key = apikey
    Data.players = {}
}

module.exports = { setApiKey }
