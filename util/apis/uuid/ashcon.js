const urlFunc = (name) => `https://api.ashcon.app/mojang/v2/user/${name}`

const transformFunc = (data) => {
    return data.uuid.replace(/-/g, "")
}

const uuidAshcon = { urlFunc, transformFunc }

module.exports = { uuidAshcon }
