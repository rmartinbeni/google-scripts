const processThread = (thread, tags) => {
  try {
    const destinatary = thread.getMessages()[0]?.getTo()
    const subaddress = getSubaddress(destinatary)

    if (subaddress !== UNTAGGED || (subaddress === UNTAGGED && !thread.isUnread())) {
      thread.addLabel(getOrCreateTag(tags, subaddress))
      thread.moveToArchive()
      console.log(`Tagged email: ${thread.getFirstMessageSubject()} with ${subaddress}`)
    }
  } catch (error) {
    console.error(`Failed to tag email: ${error}`)
  }
}
