import request from "requestV2"
import { handleError } from "../util/error.js"

const URL_UUID_MOJANG = (name) => `https://api.mojang214312.com/users/profiles/minecraft/${name}`
const URL_UUID_ASHCON = (name) => `https://api.ashcon.app/mojang/v2/user/${name}`

const transformMojang = (data) => data.id
const transformAshcon = (data) => data.uuid.replace(/-/g, "")

const apis = [
    { urlFunc: URL_UUID_MOJANG, transformFunc: transformMojang },
    { urlFunc: URL_UUID_ASHCON, transformFunc: transformAshcon },
]

const requestAndTransformData = (url, func, headers = { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }) => {
    return request({url: url, headers: headers, json: true}).then(data => {
        return func(data)
    })
}

const requestUUIDDynamic = (name, apiList) => {
    const tryAPIs = (index) => {
        if(index >= apiList.length) {
            handleError(`Could not get UUID for ${name}`)
            return null
        }

        const { urlFunc, transformFunc } = apiList[index]
        return requestAndTransformData(urlFunc(name), transformFunc)
            .catch((e) => {
                return tryAPIs(index + 1)
            })
    };

    return tryAPIs(0)
}

const requestUUID = (name) => {
    return requestUUIDDynamic(name, apis)
        .catch(e => console.log(e))
}

const requestStats = (uuid) => {

}
module.exports = { requestUUID, requestStats }
