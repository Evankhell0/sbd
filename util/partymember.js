import { indexToFloor } from "../util/calc.js"
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
            return requestStats(this.uuid).then(data => {
                if(!data) {
                    return
                }
                this.dungeons = data.dungeons
                this.updateSecretAverage()
                this.changed = true
            }).catch()
        }).catch(e=>console.log(e))
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
        return `§8[§eSBD§8]§r ${this.name} | §6${this.dungeons.catalevel}§r | §a${this.dungeons.secrets}§r | §b${this.dungeons.secretAverage}§r | §9${pb ?? this.dungeons.pb["catacombs"]?.["7"]?.["S+"]}§r (§e${indexToFloor(floorIndex)}§r)`
    }
}
