const sectionExpr = /^\[(.*)\]/
const lineBreak = /\r?\n/g

const isSectionLine = (line: string) => sectionExpr.test(line)
const formatSection = (text: string) =>
    text.split(lineBreak)
        .map(t => t.trim())
        .filter(t => t && t[0] !== ';')
        .map(t => t.split('=', 2))
        .filter(pair => pair.length === 2)
        .reduce((map, [key, value]) => map.set(key.trim(), value.trim()), new Map<string, string>())

const iniParser = (text = '') => {
    const section = new Map<string, string>()
    if (text.length === 0) return
    const lines = text.split(lineBreak)
    let content: string[] = []
    let sectionName = ''
    for (const line of lines) {
        if (isSectionLine(line)) {
            if (sectionName !== '') {
                section.set(sectionName, content.join('\n'))
            }
            content = []
            const match = line.match(sectionExpr)
            sectionName = match && match[1]
        } else {
            content.push(line)
        }
    }

    if (sectionName !== '') {
        section.set(sectionName, content.join('\n'))
    }
    return section
}
