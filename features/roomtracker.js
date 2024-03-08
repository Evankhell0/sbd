import Config from "../Config.js";
import Dungeon from "BloomCore/dungeons/Dungeon";

const dungeonRooms = [];

const registerWorldLoad = () => {
    register("tick", () => {
        if(!Dungeon.inDungeon)
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
    })

    register("chat", (score, rank) => {
        console.log("Completed Dungeon");
        combineTimes(dungeonRooms);
    }).setChatCriteria("Team Score: ${score} (${rank})").setContains();

    register("command", (args) => {
        console.log(dungeonRooms.map(x => JSON.stringify(x)))
    }).setName("rooms")

    register("command", (args) => {
        combineTimes(dungeonRooms);
    }).setName("combine")
};

const combineTimes = (arr) => {
    for(let i = 0; i < arr.length; i++) {
        if(i == arr.length - 1) {
            arr[i].time = Date.now() - arr[i].timestamp
        } else {
            arr[i].time = arr[i+1].timestamp - arr[i].timestamp
        }
    }
    console.log(arr.map(x => JSON.stringify(x)))

    const map = {};
    arr.forEach(x => {
        map[x.roomname] = map[x.roomname] ? map[x.roomname] + x.time : x.time
    })
    console.dir(map)
}


module.exports = { registerWorldLoad };
