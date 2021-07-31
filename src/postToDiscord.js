const axios = require('axios')

const postToDiscord = async items => {
  const url = process.env.DISCORD_WEBHOOK
  const delay = (ms = 2500) => new Promise(r => setTimeout(r, ms))

  for (let item of items) {
    await delay()
    const artistName = item.track.artists[0].name
    const trackURL = item.track.external_urls.spotify
    const imageURL = item.track.album.images[0].url
    const embedTitle = item.track.name

    const embeds = [
      {
        author: {
          name: artistName,
          url: trackURL,
          icon_url: imageURL,
        },
        url: 'https://open.spotify.com/playlist/6V9lTgHvp0dDsuqjBFo8Ma?si=fea6ac8fd8bc4a27',
        description:
          'Check out the playlist [here](https://open.spotify.com/playlist/6V9lTgHvp0dDsuqjBFo8Ma?si=fea6ac8fd8bc4a27)!',
        title: embedTitle,
        url: trackURL,
        color: 16777215,
        image: {
          url: imageURL,
        },
      },
    ]

    const postBody = {
      content:
        "Hey! I just added a new song to the 'Uuhh baby baby baby' Playlist",
      embeds,
    }

    await axios.post(url, postBody)
  }
}

exports.postToDiscord = postToDiscord
