import { readFileSync, writeFileSync } from 'fs'

const README_TEMPLATE_PATH = './templates/readme.md'
const TARGET_PATH = './README.md'

const buildReadme = () => {
    const readme = readFileSync(README_TEMPLATE_PATH, 'utf-8')
    return readme
        .split('\n')
        .map((line) => {
            return line
        })
        .join('\n')
}

writeFileSync(TARGET_PATH, buildReadme())
