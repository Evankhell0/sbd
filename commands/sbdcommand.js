import Config from "../Config.js"

export const sbdCommand = register("command", () => Config.openGUI()).setName("sbd")