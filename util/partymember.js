import request from "requestV2"
import { calcSkillLevel } from "BloomCore/utils/Utils"

import Data from "../util/data.js"
import { timeToString, indexToFloor } from "../util/calc.js"
import { handleError } from "../util/error.js"
import { requestUUID, requestStats } from "../util/requests.js"

export default class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.dungeons = {
            pb: {
                catacombs: {},
                master_catacombs: {}
            }
        }
    }

    init() {
        return requestUUID(this.name).then(uuid => {
            if(!uuid) {
                handleError(`Failed to fetch valid UUID for ${this.name}`)
                return
            }
            this.uuid = uuid
            return this.updateDungeonStats()
        })
    }

    updateStatsSkyCrypt() {
        Data.staggerRequest(() => {
            return request({url: `https://sky.shiiyu.moe/api/v2/dungeons/${this.uuid}`, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}).then(data => {
                const profiles = Object.values(data["profiles"])
                const profile = profiles.find(profile => profile.selected)

                this.dungeons.profileSecrets = profile["dungeons"]["secrets_found"]
                this.dungeons.secrets = profiles.map(profile => profile?.["dungeons"]?.["secrets_found"] || 0).reduce((a, b) => a + b, 0)
                this.dungeons.catalevel = profile["dungeons"]["catacombs"]["level"]["uncappedLevel"]
                this.dungeons.runs =  profile["dungeons"]["floor_completions"]

                for(let i = 1; i <= 7; i++) {
                    const dungeonTypes = ["catacombs", "master_catacombs"]
                    dungeonTypes.forEach(type => {
                        this.dungeons.pb[type][i] = this.getFloorPB(false, profile, this.uuid, type, i)
                    })
                }

                this.updateSecretAverage()
                this.changed = true
            }).catch(e => handleError(`Could not get data from SkyCrypt API for ${this.name}`, e.error))
        })
    }

    updateDungeonStats() {
        return request({url: `https://sbd.evankhell.workers.dev/player/${this.uuid}`, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}).then(data => {
            if(!data.success) {
                return this.updateStatsSkyCrypt()
            }
            this.dungeons = data.dungeons
            this.dungeons.catalevel = Math.floor(calcSkillLevel("catacombs", data.dungeons.cataxp))
            this.updateSecretAverage()
            this.changed = true
        }).catch(e => {
            handleError(`Could not get skyblock profile from SBD API for ${this.name}`, e.cause)
            return this.updateStatsSkyCrypt()
        })
    }

    getFloorPB(hypixelAPI, profile, uuid, type, floor) {
        let timeS = null
        let timeSPlus = null
        try {
            if(hypixelAPI) {
                timeS = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s"][floor]
                timeSPlus = profile["members"][uuid]["dungeons"]["dungeon_types"][type]["fastest_time_s_plus"][floor]
            } else {
                timeS = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s"]
                timeSPlus = profile["dungeons"][type]["floors"][floor]["stats"]["fastest_time_s_plus"]
            }
        } catch(e) { }
        const pb = {
            "S": timeToString(timeS),
            "S+": timeToString(timeSPlus),
            "rawS": timeS,
            "rawS+": timeSPlus
        }
        return pb
    }

    updateSecretAverage() {
        if(this.dungeons.secrets && this.dungeons.runs) {
            this.dungeons.secretAverage = (parseInt(this.dungeons.secrets) / this.dungeons.runs).toFixed(1)
        }
    }

    hasChanged() {
        const hasChanged = this.changed
        this.changed = false
        return hasChanged
    }

    toString(floorIndex = 0, pb) {
        return `§8[§eSBD§8]§r ${this.name} | §6${this.dungeons.catalevel}§r | §a${this.dungeons.secrets}§r | §b${this.dungeons.secretAverage}§r | §9${pb ?? this.dungeons.pb["catacombs"]["7"]["S+"]}§r (§e${indexToFloor(floorIndex)}§r)`
    }
}
