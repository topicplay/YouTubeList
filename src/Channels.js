import { channels as getAPIChannels } from './API.js'

let cachedChannelsByTag = {}

export const channelsByTag = async (tagSlug) => {
    if (cachedChannelsByTag[tagSlug]) return cachedChannelsByTag[tagSlug]

    const apiChannels = await getAPIChannels(tagSlug)
    if (!apiChannels) throw new Error('API Channels are undefined.')

    //flatten the object
    cachedChannelsByTag[tagSlug] = apiChannels.map((c) => {
        const tagIds = c.relationships.tags.data.map((t) => t.id)
        return {
            id: c.id,
            ...c.attributes,
            tagIds
        }
    })

    return cachedChannelsByTag[tagSlug]
}

// channelsByTag('startup').then((r) => console.log(r))
