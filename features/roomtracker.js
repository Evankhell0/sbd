import Config from "../Config.js";
import Dungeon from "BloomCore/dungeons/Dungeon";
import { getRoom } from "BloomCore/utils/Utils";

let dungeonRooms = [];

const registerWorldLoad = () => {
    // TD replace tick with scoreboard update
    register("tick", () => {
        if(!Dungeon.inDungeon)
            return;
        const currentRoom = getRoom()
        if(currentRoom && (dungeonRooms.length === 0 || dungeonRooms.slice(-1)[0].room !== currentRoom.name)) {
            dungeonRooms.push({
                timestamp: Date.now(),
                room: currentRoom.name
            });
        }
    })

    register("chat", (score, rank) => {
        console.log("Completed Dungeon");
        const roomTimes = combineTimes(dungeonRooms);
        console.dir(roomTimes);
    }).setChatCriteria("Team Score: ${score} (${rank})").setContains();

    // Reset rooms when you leave the dungeon
    register("worldLoad", () => {
        dungeonRooms = [];
    });

    // Debug Commands
    register("command", (args) => {
        console.log(dungeonRooms.map(x => JSON.stringify(x)))
    }).setName("rooms")

    register("command", (args) => {
        const roomTimes = combineTimes(dungeonRooms);
        console.dir(roomTimes);
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
        map[x.room] = map[x.room] ? map[x.room] + x.time : x.time
    })
    return map;
}


module.exports = { registerWorldLoad };
