import request from "requestV2"

import Config from "../Config.js"
import { timeToString, xpToCataLevel } from "../util/calc.js"

class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.pb = {
            catacombs: {},
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
        request({url: `https://api.hypixel.net/player?key=${Config.apikey}&uuid=${this.uuid}`, json: true}).then(data => {
            this.secrets = data.player.achievements.skyblock_treasure_hunter
            this.updateSecretAverage()
            this.changed = true
        }).catch(e => console.log(`[SBD] Could not update Secrets for ${this.name}: ${e}`))
    }

    updateDungeonStats() {
        request({url: `https://api.hypixel.net/v2/skyblock/profiles?key=${Config.apikey}&uuid=${this.uuid}`, json: true}).then(data => {
            const profile = data.profiles.find(x => x.selected)

            /*for(let i = 1; i <= 7; i++) {
                try {
                    const pb = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["catacombs"]["fastest_time_s_plus"][i]
                    this.pb.catacombs[i] = timeToString(pb)

                    const masterpb = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"][i]
                    this.pb.master_catacombs[i] = timeToString(masterpb)
                } catch (error) {

                }
            }*/

            const pb = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["catacombs"]["fastest_time_s_plus"]["7"]
            this.pb.catacombs["7"] = timeToString(pb)

            const cataxp = profile["members"][this.uuid]["dungeons"]["dungeon_types"]["catacombs"]["experience"]
            this.catalevel = xpToCataLevel(cataxp)

            const totalRuns = Object.values(profile["members"][this.uuid]["dungeons"]["dungeon_types"]).map(dungeon => {
                return Object.values(dungeon["tier_completions"]).slice(0, -1).reduce((a, b) => a + b, 0)
            }).reduce((a, b) => a + b, 0)
            this.runs = totalRuns

            this.updateSecretAverage()
            this.changed = true
        }).catch(e => console.log(`[SBD] Could not get Skyblock Profile for ${this.name}: ${e}`))
    }

    updateSecretAverage() {
        if(this.secrets && this.runs) {
            this.secretAverage = (parseInt(this.secrets) / this.runs).toFixed(1)
        }
    }

    hasChanged() {
        const hasChanged = this.changed
        this.changed = false
        return hasChanged
    }
}

module.exports = { PartyMember }
