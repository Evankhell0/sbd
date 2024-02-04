const readConfig = (property) => {
    if(!FileLib.exists("sbd", "db/config.json")) {
        return ""
    }
    const data = FileLib.read("sbd", "db/config.json")
    const config = JSON.parse(data)
    return config[property]
}

class Data {
    static players = {}
    static key = readConfig("key")
}

module.exports = { Data }
