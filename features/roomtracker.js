import Config from "../Config.js";
import Dungeon from "BloomCore/dungeons/Dungeon";
import { getRoom } from "BloomCore/utils/Utils";

const dungeonRooms = [];

const registerWorldLoad = () => {
    register("tick", () => {
        if(!Dungeon.inDungeon)
            return;
        dungeonRooms.push({
            timestamp: Date.now(),
            room: getRoom()
        });
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

    register("command", (args) => {
        console.dir(getRoom())
    }).setName("room")
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

    const map = new Map();
    arr.forEach(x => {
        map[x.room.name] = map[x.room.name] ? map[x.room.name] + x.time : x.time
    })
    console.dir(map)
}


module.exports = { registerWorldLoad };
