import { Data } from "./util/data.js"
import { registerDungeonTriggers } from "./util/dungeonstats.js"
import { registerPartyFinderTriggers } from "./util/partyfinder.js"
import { sbdCommand } from "./commands/sbdcommand.js"

const main = () => {
    //registerDungeonTriggers()
    //registerDebugTriggers()
    registerPartyFinderTriggers()
}

const registerDebugTriggers = () => {
    register("command", (id) => {
        let item = Player.getInventory().getStackInSlot(id)
        let itemName = item?.getName()
        ChatLib.chat(itemName)
        console.log(itemName)
    }).setName("slot")

    register("command", (id) => {
        ChatLib.chat(Data.party.getNames())
    }).setName("py")

    register("command", (name) => {
        Data.party.addPartyMember(name)
    }).setName("add")

    register("command", (name) => {
        Data.party.removePartyMember(name)
    }).setName("remove")
}

main()
