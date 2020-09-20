import { tags as getAPITags } from './API.js'
import pkg from 'lodash'
const { get } = pkg

let cachedAllTags

const allTags = async () => {
    if (cachedAllTags) return cachedAllTags

    const apiTags = await getAPITags()
    if (!apiTags) throw new Error('API Tags are undefined.')

    //flatten the object and filter out hidden tags
    cachedAllTags = apiTags.data
        .map((t) => {
            //each tag has either zero or one parent.
            const parentId = get(t, 'relationships.parent.data.id')
            return {
                id: t.id,
                ...t.attributes,
                parentId
            }
        })
        .filter((t) => !t.isHidden)

    return cachedAllTags
}

export const categoryTags = async () => {
    const tags = await allTags()
    return tags.filter((t) => t.type === 'primary' && t.isChild === false).sort((a, b) => a.position - b.position)
}

export const childTags = async (parentId) => {
    const tags = await allTags()
    return tags.filter((t) => t.type === 'primary' && t.parentId === parentId).sort((a, b) => a.position - b.position)
}

// childTags('12').then((r) => console.log(r))
