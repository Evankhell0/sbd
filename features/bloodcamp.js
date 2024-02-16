let splits = []
let mobCount = 0

const registerBloodCampTriggers = () => {
    //const messagesBloodEnter = ["Ah, we meet again...", "So you made it this far... interesting.", "You've managed to scratch and claw your way here, eh?", "I'm starting to get tired of seeing you around here...", "Oh.. hello?", "Things feel a little more roomy now, eh?"]
    const messagesMobSpawn = ["This guy looks like a fighter.", "Hmmm... this one!", "You'll do.", "Go, fight!", "Go and live again!"]

    register("chat", () => {
        saveSplit("Opened Blood")
    }).setChatCriteria("[BOSS] The Watcher").setContains()

    // only f7 dialogue
    register("chat", () => {
        //saveSplit("Dialogue 1")
    }).setChatCriteria("Things feel a little more roomy now, eh?").setContains()
    register("chat", () => {
        saveSplit("Dialogue 2")
    }).setChatCriteria("I've knocked down those pillars to go for a more...open concept.").setContains()
    register("chat", () => {
        saveSplit("Dialogue 3")
    }).setChatCriteria("Plus I needed to give my new friends some space to roam...").setContains()

    messagesMobSpawn.forEach(msg => {
        register("chat", () => {
            mobCount++
            ChatLib.chat(`§4[§cSBD§4] Mobcount§r: ${mobCount}`)
            saveSplit("First Mob")
        }).setChatCriteria(msg).setContains()
    })

    // doesnt always play
    register("chat", () => {
        saveSplit("Spawning Finished")
    }).setChatCriteria("That will be enough for now.").setContains()

    register("chat", () => {
        saveSplit("Cleared Blood")
        splits.forEach(x => {
            ChatLib.chat(`§c[§4SBD§c] §4${x.name}§r: ${x.time}`)
        })
        ChatLib.chat(`§c[§4SBD§c] §4Mob Count§r: ${mobCount}`)
        //console.log(JSON.stringify(splits, null, 5))
        splits = []
        mobCount = 0
    }).setChatCriteria("You have proven yourself. You may pass.").setContains()
}

const saveSplit = (name) => {
    if(!splits.some(x => x.name == name)) {
        const split = {
            name: name,
            timestamp: Date.now()
        }
        const bloodOpen = splits.find(x => x.name == "Opened Blood") ?? split
        const timeMilli = split.timestamp - bloodOpen.timestamp
        split.time = (timeMilli / 1000).toFixed(2)
        ChatLib.chat(`§4[§cSBD§4] ${name}§r: ${split.time}`)
        splits.push(split)
    }
}

module.exports = { registerBloodCampTriggers }
