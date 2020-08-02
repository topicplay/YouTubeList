import { readFileSync, writeFileSync } from 'fs'
import { categoryTags as getCategoryTags, childTags as getChildTags } from '../src/Tags.js'

const README_TEMPLATE_PATH = './templates/readme.md'
const TARGET_PATH = './README.md'
const CHANNELS_FLAG = '%CHANNELS%'

const generateChannelsList = async () => {
    let markdown = ''
    const categoryTags = await getCategoryTags()

    for (let tag of categoryTags) {
        markdown += '## ' + tag.name
        markdown += '\n\n'

        const childTags = await getChildTags(tag.id)
        for (let childTag of childTags) {
            markdown += '### ' + childTag.name
            markdown += '\n\n'
        }
    }

    return markdown
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
    console.log(readme)
    writeFileSync(TARGET_PATH, readme)
}

generateReadme()
