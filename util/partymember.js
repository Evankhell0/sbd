import config from "../db/config.js"
import request from "requestV2"

class PartyMember {
    constructor(name) {
        this.name = name;
        this.secrets = {
            old: 0,
            new: 0
        }
    }

    updateSecrets() {
        //TODO change uuid from config to actual party members
        return request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${config.uuid}`, json: true}).then(data => {
            this.secrets.old = this.secrets.new
            this.secrets.new = data.player.achievements.skyblock_treasure_hunter
            let difference = this.secrets.new - this.secrets.old
            return difference
        }).catch(e => console.log(`[SBD] Could not update Secrets for ${this.name}: ${e}`))
    }
}

module.exports = { PartyMember }
