const fs = require('fs')

const README_TEMPLATE_PATH = './templates/readme.md'
const TARGET_PATH = './README.md'

const buildReadme = () => {
    const readme = fs.readFileSync(README_TEMPLATE_PATH, 'utf-8')
    return readme
        .split('\n')
        .map((line) => {
            return line
        })
        .join('\n')
}

fs.writeFileSync(TARGET_PATH, buildReadme())
