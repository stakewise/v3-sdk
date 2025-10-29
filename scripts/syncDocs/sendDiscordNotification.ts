import log from './log'


type Input = {
  prUrl: string
  author: string
  filesCount: number
  discordWebhookUrl?: string
}

const sendDiscordNotification = async (values: Input) => {
  const { prUrl, author, filesCount, discordWebhookUrl } = values

  if (!discordWebhookUrl) {
    log.info('Discord webhook URL not provided, skipping notification.')

    return
  }

  try {
    const users = JSON.parse(process.env.DISCORD_USERS_JSON || '{}')

    const user = users[author]
    console.log('author', author)
    const mention = user ? `**<@${user}>**` : 'Unknown author'

    const discordMessage = {
      username: 'Docs Sync Bot',
      avatar_url: 'https://github.com/github.png',
      embeds: [
        {
          title: '📚 SDK Documentation Synced',
          description: `${mention} Documentation has been automatically synchronized and a PR is ready for review.`,
          color: 0x00ff00,
          fields: [
            {
              name: '🔗 Pull Request',
              value: `[View PR](${prUrl})`,
              inline: true
            },
            {
              name: '📄 Files Synced',
              value: `${filesCount} files`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'StakeWise Docs Sync'
          }
        }
      ]
    }

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    })

    if (response.ok) {
      log.success('📢 Discord notification sent successfully.')
    }
    else {
      log.error(`Failed to send Discord notification: ${response.statusText}`)
    }
  }
  catch (error) {
    log.error(`Error sending Discord notification: ${error}`)
  }
}


export default sendDiscordNotification
