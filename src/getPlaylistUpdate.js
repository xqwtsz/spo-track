const axios = require('axios')
const d = require('dayjs')
const utc = require('dayjs/plugin/utc')
const dayjs = d.extend(utc)
const { getAccessToken } = require('./getAccessToken')

const getPlaylistUpdate = async lastChecked => {
  const {
    data: { access_token },
  } = await getAccessToken()

  const url = `https://api.spotify.com/v1/playlists/${process.env.PLAYLIST_ID}`

  const { data } = await axios(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  const newTracksSinceLastChecked = data.tracks.items
    .sort((a, b) => dayjs(b.added_at) - dayjs(a.added_at))
    .filter(item => dayjs(item.added_at) > dayjs(lastChecked))

  console.log('🚀 ~ newTracksSinceLastChecked', newTracksSinceLastChecked)
  return { newTracksSinceLastChecked, playlist: data }
}

exports.getPlaylistUpdate = getPlaylistUpdate
