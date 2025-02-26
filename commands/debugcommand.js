import Data from "../util/data.js"

export const debugCommand = register("command", () => {
    const debugData = JSON.stringify(Data.debug.req, null, 2)
    console.log(debugData)
    ChatLib.chat(debugData)
}).setName("sbdebug")
