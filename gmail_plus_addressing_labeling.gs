function tagEmail() {
  const PAGE_SIZE = 50;
  let start = 0;
  let untaggedMails;
  const myTags = GmailApp.getUserLabels();
  const tags = myTags.reduce((obj, tag) => ({...obj, [tag.getName()]: tag}), {});
  const untaggedLabel = tags["Untagged"];

  do {
    untaggedMails = GmailApp.search('label:Untagged', start, PAGE_SIZE);
    untaggedMails.forEach(thread => processThread(thread, tags, untaggedLabel));
    start += PAGE_SIZE;
  } while (untaggedMails.length === PAGE_SIZE);
}

function processThread(thread, tags, untaggedLabel) {
  try {
    const destinatary = thread.getMessages()[0].getTo();
    const subaddress = getSubadress(destinatary)
    if (!subaddress) 
      return null
    
    const tag = getOrCreateTag(tags, subaddress)
    thread.addLabel(tag);
    if (untaggedLabel)
      thread.removeLabel(untaggedLabel)

  } catch (error) {
    console.error(`Failed to tag email: ${error}`)
  }
}

function getSubadress(email) {
  const match = email.match(/(\+)(.*)(@)/);
  return match ? match[2] : null;
}

function getOrCreateTag(tags, subaddress) {
  let tag = tags[subaddress];
  if (!tag && !tags.hasOwnProperty(subaddress)) {
    try {
      tag = GmailApp.createLabel(subaddress);
      tags[subaddress] = tag;
    } catch (error) {
      console.error(`Failed to create label: ${error}`)
    }
  }
  return tag
}
