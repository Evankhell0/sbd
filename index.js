register("chat", () => {
    ChatLib.chat("Entered Dungeon")
}).setChatCriteria("You are not allowed to use Potion Effects while in Dungeon, therefore all active effects have been paused and stored. They will be restored when you leave Dungeon!");

register("chat", (score, rank) => {
    let lastSlotItem = Player.getInventory().getStackInSlot(8);
    if(lastSlotItem.getName().includes("Your Score Summary")) {
        ChatLib.chat("Completed Dungeon");
    }
}).setChatCriteria("Team Score: ${score} (${rank})").setContains();
