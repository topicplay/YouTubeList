import got from 'got'

const BASE_URL = 'https://topicplay.com/api/'
const TAGS_ENDPOINT = 'tags'
const CHANNELS_ENDPOINT = 'discussions'
const CHANNELS_TAG = 'channels'

const request = {
    method: 'GET',
    prefixUrl: BASE_URL,
    resolveBodyOnly: true,
    responseType: 'json'
}

const baseRequest = async (endpoint) => {
    return got(endpoint, request)
}

const paginationRequest = async (endpoint, options) => {
    return got.paginate.all(endpoint, {
        ...request,
        ...options,
        pagination: {
            transform: (response) => {
                return response.body.data
            },
            paginate: (response, allItems, currentItems) => {
                // console.log(response.body.links)
                const links = response.body.links
                if (!links || !links.next) return false

                const nextUrl = new URL(links.next)
                const offset = nextUrl.searchParams.get('page[offset]')

                return {
                    searchParams: {
                        'page[offset]': offset
                    }
                }
            }
        }
    })
}

export const tags = async () => {
    return baseRequest(TAGS_ENDPOINT)
}

export const channels = async (tagSlug) => {
    return paginationRequest(CHANNELS_ENDPOINT, {
        searchParams: {
            'filter[q]': ' tag:' + tagSlug + ',' + CHANNELS_TAG
        }
    })
}

// channels('development').then((r) => console.log(r.length))
