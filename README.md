# Google Scripts Collection
Collection of custom google scripts to better utilize Gsuite

# Gmail Subaddress Tagging

This script automatically tags incoming emails in Gmail based on the recipient's subaddress.

## Example

If you receive an email at `username+bank@gmail.com`, this script will tag the email with the `bank` label.

## Setup

This script relies on having a manual filter in Gmail that tags all your incoming emails with the `Untagged` label.

### Setup Steps:

1. In Gmail, go to `Settings > See all settings > Filters and Blocked Addresses`.
2. Click on `Create a new filter`.
3. In the `To` field, enter your email address.
4. Click on `Create filter`.
5. On the next screen, select `Apply the label` and choose the `Untagged` label. If it doesn't exist, you can create it by clicking on `New label`.
6. Click on `Create filter`.

Once you have set up the filter, you can run this script to automatically tag your incoming emails based on the recipient's subaddress.
