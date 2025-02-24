const urlFunc = (name) => `https://playerdb.co/api/player/minecraft/${name}`

const transformFunc = (data) => {
    return data.data.player.raw_id
}

const uuidPlayerDB = { urlFunc, transformFunc, key: "uuid-pdb" }

module.exports = { uuidPlayerDB }
