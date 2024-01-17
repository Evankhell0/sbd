import config from "../db/config.js"
import request from "requestV2"

import { timeToString, xpToCataLevel } from "./calc.js"

class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.secrets = "?"
        this.runs = "?"
        this.average = "?"
        this.catalevel = "?"
        this.pb = {
            catacombs: {
                "7": "?"
            },
            master_catacombs: {}
        }
        this.setUUID(name)
    }

    setUUID(name) {
        request({url: `https://api.mojang.com/users/profiles/minecraft/${name}`, json: true}).then(data => {
            this.uuid = data.id
            this.updateSecrets()
            this.updateDungeonStats()
        }).catch(e => console.log(`[SBD] Could not find uuid for ${name}: ${e}`))
    }

    updateSecrets() {
        request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${this.uuid}`, json: true}).then(data => {
            this.secrets = data.player.achievements.skyblock_treasure_hunter
            this.changed = true
        }).catch(e => console.log(`[SBD] Could not update Secrets for ${this.name}: ${e}`))
    }

    updateDungeonStats() {
        request({url: `https://api.hypixel.net/v2/skyblock/profiles?key=${config.key}&uuid=${this.uuid}`, json: true}).then(data => {
            const profile = data.profiles.find(x => x.selected)

            const fastest_f7 = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["catacombs"]["fastest_time_s_plus"]["7"]
            this.pb.catacombs["7"] = timeToString(fastest_f7)

            const cataxp = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["catacombs"]["experience"]
            this.catalevel = xpToCataLevel(cataxp)

            this.changed = true
        }).catch(e => console.log(`[SBD] Could not get Skyblock Profile for ${this.name}: ${e}`))
    }

    hasChanged() {
        const hasChanged = this.changed
        this.changed = false
        return hasChanged
    }
}

module.exports = { PartyMember }
