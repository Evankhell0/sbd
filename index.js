import { registerPartyFinderTriggers } from "./features/partyfinder.js"
import { autokick } from "./features/autokick.js"
import { registerSoloClearTriggers } from "./features/soloclear.js"
import { sbdCommand } from "./commands/sbdcommand.js"
import { debugCommand } from "./commands/debugcommand.js"

registerPartyFinderTriggers()
registerSoloClearTriggers()
