const getTags = () => {
  return GmailApp.getUserLabels().reduce((obj, tag) => {
    obj[tag.getName()] = tag
    return obj
  }, {})
}

const getSubaddress = (email) => {
  const match = email.match(/\+([^@]*)@/)
  return match ? match[1] : UNTAGGED
}

const getOrCreateTag = (tags, subaddress) => {
  if (!Object.prototype.hasOwnProperty.call(tags, subaddress)) {
    try {
      const tag = GmailApp.createLabel(subaddress)
      console.log(`Created label: ${subaddress}`)
      tags[subaddress] = tag
    } catch (error) {
      console.error(`Failed to create label: ${error}`)
    }
  }
  return tags[subaddress]
}
