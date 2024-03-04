import request from "requestV2"
import { calcSkillLevel } from "BloomCore/utils/Utils"

import Config from "../Config.js"
import Data from "../util/data.js"
import { timeToString } from "../util/calc.js"
import { handleError } from "../util/error.js"

export default class PartyMember {
    constructor(name) {
        this.name = name
        this.uuid = null
        this.pb = {
            catacombs: {},
            master_catacombs: {}
        }
    }

    init() {
        request({url: `https://api.mojang.com/users/profiles/minecraft/${this.name}`, json: true}).then(data => {
            this.uuid = data.id
            if(Data.invalidKey) {
                this.updateStatsSkyCrypt()
            } else {
                this.updateSecretsHypixel()
                this.updateDungeonStatsHypixel()
            }
        }).catch(e => handleError(`Could not find uuid for ${this.name}`, e.errorMessage))
    }

    updateStatsSkyCrypt() {
        request({url: `https://sky.shiiyu.moe/api/v2/dungeons/${this.uuid}`, headers: { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }, json: true}).then(data => {
            // TD replace with getting selected profile once sky shiiyu api is updated
            const getCataLevel = (profile) => profile.dungeons?.catacombs?.level?.uncappedLevel
            const profile = Object.values(data["profiles"]).filter(x => getCataLevel(x)).sort((a, b) => getCataLevel(b) - getCataLevel(a))[0]

            this.secrets = profile["dungeons"]["secrets_found"]
            this.catalevel = profile["dungeons"]["catacombs"]["level"]["uncappedLevel"]
            this.runs =  profile["dungeons"]["floor_completions"]

            for(let i = 1; i <= 7; i++) {
                const dungeonTypes = ["catacombs", "master_catacombs"]
                dungeonTypes.forEach(type => {
                    this.pb[type][i] = this.getFloorPB(false, profile, this.uuid, type, i)
                })
            }

            this.updateSecretAverage()
            this.changed = true
        }).catch(e => handleError(`Could not get data from SkyCrypt API for ${this.name}`, e.error))
    }

    updateSecretsHypixel() {
        request({url: `https://api.hypixel.net/player?key=${Config.apikey}&uuid=${this.uuid}`, json: true}).then(data => {
            this.secrets = data.player.achievements.skyblock_treasure_hunter
            this.updateSecretAverage()
            this.changed = true
        }).catch(e => handleError(`Could not get secrets from Hypixel API for ${this.name}`, e.cause))
    }

    updateDungeonStatsHypixel() {
        if(Data.invalidKey) {
            return
        }
        request({url: `https://api.hypixel.net/v2/skyblock/profiles?key=${Config.apikey}&uuid=${this.uuid}`, json: true}).then(data => {
            const profile = data.profiles.find(x => x.selected)

            for(let i = 1; i <= 7; i++) {
                this.pb.catacombs[i] = this.getFloorPB(true, profile, this.uuid, "catacombs", i)
                this.pb.master_catacombs[i] = this.getFloorPB(true, profile, this.uuid, "master_catacombs", i)
            }

            const cataXP = profile["members"][this.uuid]["dungeons"]?.["dungeon_types"]?.["catacombs"]?.["experience"]
            this.catalevel = Math.floor(calcSkillLevel("catacombs", cataXP))

            const totalRuns = Object.values(profile["members"][this.uuid]?.["dungeons"]?.["dungeon_types"] ?? {}).map(dungeon => {
                return Object.values(dungeon["tier_completions"]).slice(0, -1).reduce((a, b) => a + b, 0)
            }).reduce((a, b) => a + b, 0)
            this.runs = totalRuns

            this.updateSecretAverage()
            this.changed = true
        }).catch(e => {
            handleError(`Could not get skyblock profile from Hypixel API for ${this.name}`, e.cause)
            this.updateStatsSkyCrypt()
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
