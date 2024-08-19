const PAGE_SIZE = 50
const UNTAGGED = 'untagged'
const INBOX_QUERY = 'is:inbox'

function tagEmail() {
  let start = 0
  let inboxMails = null
  const tags = getTags()

  do {
    inboxMails = GmailApp.search(INBOX_QUERY, start, PAGE_SIZE)
    inboxMails.forEach((thread) => processThread(thread, tags))
    start += PAGE_SIZE
  } while (inboxMails.length === PAGE_SIZE)
}

function processThread(thread, tags) {
  try {
    const destinatary = thread.getMessages()[0].getTo()
    const subaddress = getSubaddress(destinatary)

    thread.addLabel(getOrCreateTag(tags, subaddress))
    thread.moveToArchive()
    console.log(
      `Tagged email: ${thread.getFirstMessageSubject()} with ${subaddress}`
    )
  } catch (error) {
    console.error(`Failed to tag email: ${error}`)
  }
}

function getTags() {
  return GmailApp.getUserLabels().reduce((obj, tag) => {
    obj[tag.getName()] = tag
    return obj
  }, {})
}

function getSubaddress(email) {
  const match = email.match(/\+([^\@]*)@/)
  return match ? match[1] : UNTAGGED
}

function getOrCreateTag(tags, subaddress) {
  if (!tags.hasOwnProperty(subaddress)) {
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
