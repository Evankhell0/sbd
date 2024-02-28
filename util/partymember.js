import request from "requestV2"
import { calcSkillLevel } from "BloomCore/utils/Utils"

import Config from "../Config.js"
import { timeToString } from "../util/calc.js"

class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.pb = {
            catacombs: {},
            master_catacombs: {}
        }
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

            for(let i = 1; i <= 7; i++) {
                this.pb.catacombs[i] = this.getFloorPB(profile, this.uuid, "catacombs", i)
                this.pb.master_catacombs[i] = this.getFloorPB(profile, this.uuid, "master_catacombs", i)
            }

            const cataXP = profile["members"][this.uuid]["dungeons"]?.["dungeon_types"]?.["catacombs"]?.["experience"]
            this.catalevel = Math.floor(calcSkillLevel("catacombs", cataXP))

            const totalRuns = Object.values(profile["members"][this.uuid]?.["dungeons"]?.["dungeon_types"] ?? {}).map(dungeon => {
                return Object.values(dungeon["tier_completions"]).slice(0, -1).reduce((a, b) => a + b, 0)
            }).reduce((a, b) => a + b, 0)
            this.runs = totalRuns

            this.updateSecretAverage()
            this.changed = true
        }).catch(e => console.log(`[SBD] Could not get Skyblock Profile for ${this.name}: ${e}`))
    }

    getFloorPB(profile, uuid, type, floor) {
        let timeS = null
        let timeSPlus = null
        try {
            timeS = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s"][floor],
            timeSPlus = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s_plus"][floor]
        } catch(e) { }
        const pb = {
            "S": timeToString(timeS),
            "S+": timeToString(timeSPlus)
        }
        return pb
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
