import { PartyMember } from "./partymember.js"

class Party {
    //TODO always add yourself to the party
    constructor() {
        this.partyMembers = []
        this.registerTriggers()
    }

    addPartyMember(user) {
        user = user.split(" ")
        let lastElement = user[user.length - 1]
        this.partyMembers.push(new PartyMember(lastElement))
        ChatLib.chat(this.getNames())
    }

    clearParty() {
        this.partyMembers = []
        ChatLib.chat(this.getNames())
    }

    removePartyMember(user) {
        user = user.split(" ")
        let lastElement = user[user.length - 1];
        this.partyMembers = this.partyMembers.filter(member => member.name != lastElement)
        ChatLib.chat(this.getNames())
    }

    getNames() {
        return this.partyMembers.map(member => member.name).join(", ")
    }

    registerTriggers() {
        register("chat", (user) => {
            this.addPartyMember(user)
        }).setChatCriteria("You have joined ${user}'s party!")

        register("chat", (users) => {
            //TODO
        }).setChatCriteria("You'll be partying with: ${users}")

        register("chat", () => {
            this.clearParty()
        }).setChatCriteria("You left the party.")

        register("chat", (user) => {
            this.removePartyMember(user)
        }).setChatCriteria("${user} has left the party.")

        register("chat", (user) => {
            this.clearParty()
        }).setChatCriteria("${user} has disbanded the party!")

        register("chat", (user) => {
            this.clearParty()
        }).setChatCriteria("You have been kicked from the party by ${user}")

        register("chat", (user) => {
            this.removePartyMember(user)
        }).setChatCriteria("${user} has been removed from the party.")
    }
}

module.exports = { Party }
