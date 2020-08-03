import { readFileSync, writeFileSync } from 'fs'
import lodash from 'lodash'
const { intersection } = lodash
import { categoryTags as getCategoryTags, childTags as getChildTags } from '../src/Tags.js'
import { channelsByTag } from '../src/Channels.js'

const README_TEMPLATE_PATH = './templates/readme.md'
const TARGET_PATH = './README.md'
const CHANNELS_FLAG = '%CHANNELS%'

const channelLink = (channel) => {
    return `[${channel.title}](https://www.youtube.com/channel/${channel.updateId})`
}

const printChannels = (channels) => {
    const lines = []
    channels.sort((a, b) => b.popularityScore - a.popularityScore)
    for (let channel of channels) {
        let markdown = '* ' + channelLink(channel) + ' - popularity: ' + channel.popularityScore
        lines.push(markdown)
    }
    return lines
}

const generateChannelsList = async () => {
    const lines = []
    const categoryTags = await getCategoryTags()

    for (let tag of categoryTags) {
        lines.push(`## ${tag.name}`)
        lines.push('')

        const channels = await channelsByTag(tag.slug)

        const childTags = await getChildTags(tag.id)
        for (let childTag of childTags) {
            lines.push(`### ${childTag.name}`)
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

const buildReadme = async () => {
    const readme = readFileSync(README_TEMPLATE_PATH, 'utf-8')
    const channelsList = await generateChannelsList()

    return readme
        .split('\n')
        .map((line) => {
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
