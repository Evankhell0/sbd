import request from "requestV2"
import config from "./config.js"

import { Data } from "./util/data.js"

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
