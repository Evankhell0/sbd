import { Data } from "./util/data.js"
import Config from "./Config.js"
import { registerPartyFinderTriggers } from "./features/partyfinder.js"
import { sbdCommand } from "./commands/sbdcommand.js"

const main = () => {
    registerPartyFinderTriggers()

    register("chat", (apikey) => {
        Config.apikey = apikey
        Data.players = {}
    }).setChatCriteria("Your new API key is ${apikey}").setContains()
}

main()
