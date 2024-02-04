import { Data } from "./util/data.js"
import Config from "./Config.js"
import { setApiKey } from "./util/updateconfig.js"
import { registerPartyFinderTriggers } from "./features/partyfinder.js"
import { sbdCommand } from "./commands/sbdcommand.js"

const main = () => {
    registerPartyFinderTriggers()

    register("chat", (apikey) => {
        setApiKey(apikey)
        Config.apikey = apikey
    }).setChatCriteria("Your new API key is ${apikey}").setContains()
}

main()
