import config from "../db/config.js"
import request from "requestV2"

class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = {
            old: null,
            new: null
        }
        this.secrets = {
            old: 0,
            new: 0
        }
        this.setUUID(name)
    }

    setUUID(name) {
        request({url: `https://api.mojang.com/users/profiles/minecraft/${name}`, json: true}).then(data => {
            this.uuid.new = data.id
            this.updateSecrets()
        }).catch(e => console.log(`[SBD] Could not find uuid for ${name}: ${e}`))
    }

    updateSecrets() {
        request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${this.uuid.new}`, json: true}).then(data => {
            this.secrets.old = this.secrets.new
            this.secrets.new = data.player.achievements.skyblock_treasure_hunter
        }).catch(e => console.log(`[SBD] Could not update Secrets for ${this.name}: ${e}`))
    }

    getUUID() {
        this.uuid.old = this.uuid.new
        return this.uuid.new
    }

    getSecrets() {
        this.secrets.old = this.secrets.new
        return this.secrets.new
    }
}

module.exports = { PartyMember }
