const axios = require('axios')

const postToDiscord = async (items, playlist) => {
  const url = process.env.DISCORD_WEBHOOK
  const delay = (ms = 2500) => new Promise(r => setTimeout(r, ms))

  const playlistName = playlist.name
  const playlistLink = playlist.external_urls.spotify

  for (let item of items) {
    await delay()
    const artistName = item.track.artists[0].name
    const trackURL = item.track.external_urls.spotify
    const imageURL = item.track.album.images[0].url
    const embedTitle = item.track.name
    const addedBy = item.added_by.id

    const embeds = [
      {
        author: {
          name: artistName,
          url: trackURL,
          icon_url: imageURL,
        },
        url: playlistLink,
        description: `Check out the playlist [here](${playlistLink})!`,
        title: embedTitle,
        url: trackURL,
        // insane embeds helper
        // https://birdie0.github.io/discord-webhooks-guide/structure/embeds.html
        color: 65280,
        image: {
          url: imageURL,
        },
      },
    ]

    const postBody = {
      content: `${addedBy} just added a new song to the '${playlistName}' playlist :robot:`,
      embeds,
    }

    await axios.post(url, postBody)
  }
}

exports.postToDiscord = postToDiscord
