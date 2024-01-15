const registerPartyFinderTriggers = () => {
    register("itemTooltip", (lore, item) => {
        if(!/'s Party§r/.test(lore[0])) {
            return;
        }
        lore = lore.slice(1);
        lore = lore.filter(x => !/minecraft:/.test(x) && !/NBT:/.test(x))
        lore = lore.map(x => {
            if(/§5§o §\w\w+§f: §\w\w+§b \(§e\d+§b\)/.test(x)) {
                const name = x.replace(/(§5§o §\w)|(§f: §\w\w+§b \(§e\d+§b\))/g, "")
                // TODO
                // get data from hypixel api and adjust return value accordingly
                return `§b${name}`;
            }
            return x;
        })
        item.setName(lore[0].replace("'s Party§r", "'s Party§f§r"))
        item.setLore(lore)
    });
}

module.exports = { registerPartyFinderTriggers }
