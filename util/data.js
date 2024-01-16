import { Party } from "./party.js"
import { PartyMember } from "./partymember.js"

class Data {
    //static party = new Party()
    static players = {}

    static addPlayer(name) {
        this.players[name] = new PartyMember(name)
    }
}

module.exports = { Data }
