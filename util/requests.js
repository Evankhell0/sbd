import request from "requestV2"

import Data from "./data.js"
import { uuidApis, statsApis } from "./apis/apis.js"
import { handleError } from "./error.js"

const requestAndTransformData = (url, func, headers = { 'User-Agent': ' Mozilla/5.0', 'Content-Type': 'application/json' }) => {
    return request({url: url, headers: headers, json: true, connectTimeout: 5000}).then(data => {
        return func(data)
    })
}

const requestDataDynamic = (value, apiList) => {
    const tryAPIs = (index) => {
        if(index >= apiList.length) {
            handleError(`Could not get Data for ${value}`)
            Data.debug.req["fail"]++;
            return null
        }

        const { urlFunc, transformFunc, key } = apiList[index]

        if(Data.debug.req[key]) {
            Data.debug.req[key]++
        } else {
            Data.debug.req[key] = 1
        }

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
