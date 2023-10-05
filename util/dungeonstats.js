import { Data } from "./data.js"

const registerDungeonTriggers = () => {
    register("chat", () => {
        Data.party.partyMembers.forEach(member => {
            member.updateSecrets();
        })
    }).setChatCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")

    register("chat", (score, rank) => {
        let lastSlotItem = Player.getInventory().getStackInSlot(8)
        if(lastSlotItem?.getName()?.includes("Your Score Summary")) {
            Data.party.partyMembers.forEach(member => {
                member.updateSecrets().then(difference => {
                    ChatLib.chat(`${member.name}: ${difference} secrets gained`)
                })
            })
        }
    }).setChatCriteria("Team Score: ${score} (${rank})").setContains()
}

module.exports = { registerDungeonTriggers }
