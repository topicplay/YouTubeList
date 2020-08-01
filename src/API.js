import got from 'got'

const BASE_URL = 'https://topicplay.com/api/'
const TAGS_ENDPOINT = 'tags'

const baseRequest = async (endpoint) => {
    const request = {
        method: 'GET',
        prefixUrl: BASE_URL,
        resolveBodyOnly: true,
        responseType: 'json'
    }

    return got(endpoint, request)
}

export const tags = async () => {
    return baseRequest(TAGS_ENDPOINT)
}
