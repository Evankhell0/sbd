import config from "../db/config.js"
import request from "requestV2"

class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.secrets = {
            old: "?",
            new: "?"
        }
        this.setUUID(name)
    }

    setUUID(name) {
        request({url: `https://api.mojang.com/users/profiles/minecraft/${name}`, json: true}).then(data => {
            this.uuid = data.id
            this.updateSecrets()
        }).catch(e => console.log(`[SBD] Could not find uuid for ${name}: ${e}`))
    }

    updateSecrets() {
        request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${this.uuid}`, json: true}).then(data => {
            this.secrets.old = this.secrets.new
            this.secrets.new = data.player.achievements.skyblock_treasure_hunter
        }).catch(e => console.log(`[SBD] Could not update Secrets for ${this.name}: ${e}`))
    }

    getSecrets() {
        this.secrets.old = this.secrets.new
        return this.secrets.new
    }
}

module.exports = { PartyMember }
