const tagEmail = () => {
  let start = 0
  let inboxMails = null
  const tags = getTags()

  do {
    inboxMails = GmailApp.search(INBOX_QUERY, start, PAGE_SIZE)
    inboxMails.forEach((thread) => processThread(thread, tags))
    start += PAGE_SIZE
  } while (inboxMails.length === PAGE_SIZE)
}

const main = () => {
  tagEmail()
}
