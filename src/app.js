require('dotenv').config()
const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require('toad-scheduler')
const dayjs = require('dayjs')

// -------------
const { getPlaylistUpdate } = require('./getPlaylistUpdate')
const { postToDiscord } = require('./postToDiscord')

if (!process.env.CLIENT_INFO || !process.env.PLAYLIST_ID) {
  console.log('❌ ENVIRONMENTAL VARIABLES MISSING')
}

let lastChecked = undefined

const scheduler = new ToadScheduler()

const task = new AsyncTask(
  'simple task',
  async () => {
    if (!lastChecked) {
      lastChecked = dayjs().subtract(15, 'minutes')
    } else {
      lastChecked = dayjs()
    }
    const newSongsSinceLastChecked = await getPlaylistUpdate(lastChecked)
    await postToDiscord(newSongsSinceLastChecked)

    console.log(`running a task NOW: ${dayjs()}`)
  },
  err => {
    console.log(`Something went wrong here: ${err.message}`)
    console.log(`Something went wrong here: ${err}`)
  },
)

const job = new SimpleIntervalJob({ seconds: 10 }, task)

scheduler.addSimpleIntervalJob(job)
