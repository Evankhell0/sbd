import request from "requestV2"

import Data from "./data.js"
import { uuidApis, statsApis } from "./apis.js"
import { handleError } from "./error.js"

const requestAndTransformData = (url, func, headers = { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }) => {
    return request({url: url, headers: headers, json: true}).then(data => {
        return func(data)
    })
}

const requestDataDynamic = (value, apiList) => {
    const tryAPIs = (index) => {
        if(index >= apiList.length) {
            handleError(`Could not get Data for ${value}`)
            return null
        }

        const { urlFunc, transformFunc } = apiList[index]
        return requestAndTransformData(urlFunc(value), transformFunc).catch((e) => {
            return tryAPIs(index + 1)
        })
    };

    return tryAPIs(0)
}

const requestUUID = (name) => {
    return requestDataDynamic(name, uuidApis)
        .catch(e => handleError("Failed to get UUID", e))
}

const requestStats = (uuid) => {
    return requestDataDynamic(uuid, statsApis)
        .catch(e => handleError("Failed to get Dungeon Stats", e))
}

module.exports = { requestUUID, requestStats }
