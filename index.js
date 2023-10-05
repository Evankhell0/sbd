import request from "requestV2"
import config from "./config.js"

register("chat", () => {
    let playerData = request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${config.uuid}`, json: true}).then(data => {
        let secrets = data.player.achievements.skyblock_treasure_hunter
        ChatLib.chat(`Starting secrets: ${secrets}`)
    })
}).setChatCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!")

register("chat", (score, rank) => {
    let lastSlotItem = Player.getInventory().getStackInSlot(8)
    if(lastSlotItem?.getName()?.includes("Your Score Summary")) {
        let playerData = request({url: `https://api.hypixel.net/player?key=${config.key}&uuid=${config.uuid}`, json: true}).then(data => {
            let secrets = data.player.achievements.skyblock_treasure_hunter
            ChatLib.chat(`Ending secrets: ${secrets}`)
        })
    }
}).setChatCriteria("Team Score: ${score} (${rank})").setContains()

let partyMembers = []

register("chat", (user) => {
    user = user.split(" ")
    var lastElement = user[user.length - 1];
    partyMembers.push(lastElement)
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("You have joined ${user}'s party!")

register("chat", (users) => {
    partyMembers.push(users)
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("You'll be partying with: ${users}")

register("chat", () => {
    partyMembers = []
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("You left the party.")

register("chat", (user) => {
    user = user.split(" ")
    var lastElement = user[user.length - 1];
    partyMembers.push(lastElement)
    partyMembers = partyMembers.filter(x => x != lastElement)
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("${user} has left the party.")

register("chat", (user) => {
    partyMembers = []
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("${user} has disbanded the party!")

register("chat", (user) => {
    partyMembers = []
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("You have been kicked from the party by ${user}")

register("chat", (user) => {
    user = user.split(" ")
    var lastElement = user[user.length - 1];
    partyMembers.push(lastElement)
    partyMembers = partyMembers.filter(x => x != user)
    ChatLib.chat(partyMembers.join(","))
}).setChatCriteria("${user} has been removed from the party.")



