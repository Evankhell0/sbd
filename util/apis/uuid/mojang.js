const urlFunc = (name) => `https://api.mojang.com/users/profiles/minecraft/${name}`

const transformFunc = (data) => {
    return data.id
}

const uuidMojang = { urlFunc, transformFunc }

module.exports = { uuidMojang }
