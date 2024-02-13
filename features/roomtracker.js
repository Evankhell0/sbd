import Config from "../Config.js";

const registerWorldLoad = () => {
    register("worldLoad", () => {
        let scoreboard = Scoreboard.getLines().map(a => { return ChatLib.removeFormatting(a) });
        let lines = TabList.getNames().map(a => { return ChatLib.removeFormatting(a) });
        for (let line of scoreboard) {
            let match = line.match(/ ⏣ The Catac.+ombs \((.+)\)/);
            if (match) {
                trackRooms();
            }
        }
    });
};

const trackRooms = () => {
    register("tick", () => {
        let dungeonRooms = [];
        let scoreboard = Scoreboard.getLines().map(a => { return ChatLib.removeFormatting(a) });
        for (let line of scoreboard) {
            let match = line.match(/^\d[\d/]+ .+ ([-\d,]+)$/);
            if (match) {
                console.log(match);
                if (dungeonRooms.length === 0 || dungeonRooms[dungeonRooms.length - 1].roomname !== match[0]) {
                    const obj = {
                        timestamp: Date.now(),
                        roomname: match[0]
                    };
                    dungeonRooms.push(obj);
                    console.log(dungeonRooms);
                }
            }
        }
    });
};

module.exports = { registerWorldLoad, trackRooms };
