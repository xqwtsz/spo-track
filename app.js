require('dotenv').config()

const axios = require('axios')
const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require('toad-scheduler')

if (!process.env.CLIENT_INFO || !process.env.PLAYLIST_ID) {
  console.log('❌ ENVIRONMENTAL VARIABLES MISSING')
}

const scheduler = new ToadScheduler()

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi()

const getAccessToken = async () => {
  const url = `https://accounts.spotify.com/api/token`

  return await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${process.env.CLIENT_INFO}`,
    },
  })
}

const getPlaylistUpdate = async () => {
  const {
    data: { access_token },
  } = await getAccessToken()
  spotifyApi.setAccessToken(access_token)

  const playlist = await spotifyApi.getPlaylist(process.env.PLAYLIST_ID)
  console.log(
    '🚀 ~ file: index.js ~ line 11 ~ getPlaylistUpdate ~ playlist',
    playlist,
  )
}

const task = new AsyncTask(
  'simple task',
  async () => {
    await getPlaylistUpdate()
    console.log(`running a task NOW: ${new Date().toISOString()}`)
  },
  err => {
    console.log(`Something went wrong here: ${err.message}`)
  },
)

const job = new SimpleIntervalJob({ seconds: 5 }, task)

scheduler.addSimpleIntervalJob(job)
