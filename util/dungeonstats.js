import { Data } from "./data.js"

const registerDungeonTriggers = () => {
    register("chat", () => {
        Data.party.partyMembers.forEach(member => {
            member.updateSecrets()
        })
        let tabList = TabList.getNames()
        tabList.forEach(line => {
            let matches = line.match(/(?<=\§\w)(?<!\(\§\w\§\w)\w+(?=\s)/)
            if(matches.length)
               console.log(matches[0])
        })
    }).setChatCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")

    register("chat", (score, rank) => {
        let lastSlotItem = Player.getInventory().getStackInSlot(8)
        let lastSlotItemName = lastSlotItem?.getName()
        /*if(!lastSlotItemName.includes("Your Score Summary")) {
            console.log("[SBD] called Dungeon End while not being in dungeon")
            return;
        }*/
        Data.party.partyMembers.forEach(member => {
            member.updateSecrets().then(difference => {
                ChatLib.chat(`${member.name}: ${difference} secrets gained`)
            })
        })
    }).setChatCriteria("Team Score: ${score} (${rank})").setContains()
}

module.exports = { registerDungeonTriggers }
