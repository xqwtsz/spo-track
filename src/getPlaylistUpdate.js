const axios = require('axios')
const dayjs = require('dayjs')
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

  lastChecked = dayjs().subtract(2, 'days').subtract(10, 'hours')

  const newTracksSinceLastChecked = data.tracks.items
    .sort((a, b) => dayjs(b.added_at) - dayjs(a.added_at))
    .filter(item => dayjs(item.added_at) > lastChecked)
  console.log(
    '🚀 ~ file: getPlaylistUpdate.js ~ line 21 ~ getPlaylistUpdate ~ newTracksSinceLastChecked',
    newTracksSinceLastChecked,
  )
  return newTracksSinceLastChecked
}

exports.getPlaylistUpdate = getPlaylistUpdate
