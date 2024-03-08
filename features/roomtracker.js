import Config from "../Config.js";
import Data from "../util/data.js";
import Dungeon from "BloomCore/dungeons/Dungeon";

const dungeonRooms = [];

const registerWorldLoad = () => {
    register("worldLoad", () => {
        const scoreboard = Scoreboard.getLines().map(x => ChatLib.removeFormatting(x));
        console.log(scoreboard.map(x => JSON.stringify(x)))
        Data.inDungeon = scoreboard.some(x => /⏣ The Catac.+ombs \((.+)\)/.test(x))
        console.log("SBD " + Data.inDungeon)
    });

    register("step", () => {
        if(!Data.inDungeon)
            return;
        const scoreboard = Scoreboard.getLines().map(a => ChatLib.removeFormatting(a));
        for(let line of scoreboard) {
            const match = line.match(/^\d[\d/]+ .+ ([-\d,]+)$/);
            if(match && (dungeonRooms.length === 0 || dungeonRooms[dungeonRooms.length - 1].roomname !== match[1])) {
                dungeonRooms.push({
                    timestamp: Date.now(),
                    roomname: match[1]
                });
            }
        }
    }).setFps(1);

    register("chat", (score, rank) => {
        let lastSlotItem = Player.getInventory().getStackInSlot(8);
        if(lastSlotItem.getName().includes("Your Score Summary")) {
            ChatLib.chat("Completed Dungeon");
            combineTimes(dungeonRooms);
        }
    }).setChatCriteria("Team Score: ${score} (${rank})").setContains();

    register("command", (args) => {
        console.log(dungeonRooms.map(x => JSON.stringify(x)))
    }).setName("rooms")
};

const combineTimes = (arr) => {
    for(let i = 0; i < arr.length; i++) {
        if(i - 1 == arr.length) {
            arr[i].time = Date.now() - arr[i].timestamp
        } else {
            arr[i].time = arr[i+1].timestamp - arr[i].timestamp
        }
    }
    console.log(arr)
}


module.exports = { registerWorldLoad };
