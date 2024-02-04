import { Data } from "./util/data.js"
import { registerPartyFinderTriggers } from "./features/partyfinder.js"
import { sbdCommand } from "./commands/sbdcommand.js"

const main = () => {
    registerPartyFinderTriggers()
    console.log(Data.key)
    register("chat", (apikey) => {
        const config = {
            key: apikey
        }
        FileLib.write("sbd", "/db/config.json", JSON.stringify(config))
    }).setChatCriteria("Your new API key is ${apikey}").setContains()
}

main()
