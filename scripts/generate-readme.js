import { readFileSync, writeFileSync } from 'fs'
import lodash from 'lodash'
const { intersection } = lodash
import toc from 'markdown-toc'
import { categoryTags as getCategoryTags, childTags as getChildTags } from '../src/Tags.js'
import { channelsByTag } from '../src/Channels.js'

const README_TEMPLATE_PATH = './templates/readme.md'
const TARGET_PATH = './README.md'
const STATS_FLAG = '%STATS%'
const INDEX_FLAG = '%INDEX%'
const CHANNELS_FLAG = '%CHANNELS%'

const channelLink = (channel) => {
    return `[${channel.title}](https://www.youtube.com/channel/${channel.updateId})`
}

const channelTopicPlayLink = (channel) => {
    return `[&#128279;](https://topicplay.com/d/${channel.id}-${channel.slug})`
}

const printChannels = (channels) => {
    const lines = []
    channels.sort((a, b) => b.popularityScore - a.popularityScore)
    for (let channel of channels) {
        let markdown = `1. ${channelLink(channel)} - popularity: ${channel.popularityScore} - ${channelTopicPlayLink(channel)}`
        lines.push(markdown)
    }
    return lines
}

const tagDescription = (tag) => {
    const description = tag.description
    if (!description) return
    return '***' + description.replace('${subtag}', 'channels') + '***'
}

const generateChannelsList = async () => {
    const lines = []
    const categoryTags = await getCategoryTags()

    for (let tag of categoryTags) {
        lines.push(`## ${tag.name}`)
        lines.push(tagDescription(tag))
        lines.push('')

        const channels = await channelsByTag(tag.slug)

        const childTags = await getChildTags(tag.id)
        for (let childTag of childTags) {
            lines.push(`### ${childTag.name}`)
            lines.push(tagDescription(childTag))
            lines.push('')

            const childTagChannels = channels.filter((c) => c.tagIds.includes(childTag.id))
            lines.push(...printChannels(childTagChannels))
            lines.push('')
        }

        const childTagIds = childTags.map((t) => t.id)
        const otherChannels = channels.filter((c) => !intersection(c.tagIds, childTagIds).length)

        if (childTagIds.length && otherChannels.length) {
            lines.push('### Other')
            lines.push('')
        }

        lines.push(...printChannels(otherChannels))
        lines.push('')

        // if (tag.slug == 'development') break
    }

    return lines.join('\n')
}

const totalChannelCount = (channelsList) => {
    return channelsList.split('\n').filter((line) => line.startsWith('1.')).length
}

const buildReadme = async () => {
    const readme = readFileSync(README_TEMPLATE_PATH, 'utf-8')
    const channelsList = await generateChannelsList()
    const tableOfContents = toc(channelsList).content
    const stats = `Channels Added: ${totalChannelCount(channelsList)}`

    return readme
        .split('\n')
        .map((line) => {
            if (line.includes(STATS_FLAG)) return stats
            if (line.includes(INDEX_FLAG)) return tableOfContents
            if (line.includes(CHANNELS_FLAG)) return channelsList
            return line
        })
        .join('\n')
}

const generateReadme = async () => {
    let readme = await buildReadme()
    writeFileSync(TARGET_PATH, readme)
}

generateReadme()
