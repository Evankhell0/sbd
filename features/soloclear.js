import Dungeon from "BloomCore/dungeons/Dungeon"

import Config from "../Config.js"

const saveSoloClear = ({ secretsFound, totalSecrets, crypts, completedPuzzles, puzzles, seconds }) => {
    const obj = {
        secretsFound,
        totalSecrets,
        crypts,
        completedPuzzles,
        puzzles,
        seconds,
    }
}
