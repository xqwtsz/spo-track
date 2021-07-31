require('dotenv').config()
if (
  !process.env.CLIENT_INFO ||
  !process.env.PLAYLIST_ID ||
  !process.env.DISCORD_WEBHOOK
) {
  console.log('❌ ENVIRONMENTAL VARIABLES MISSING ❌ ')
  return
}
const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require('toad-scheduler')
const dayjs = require('dayjs')

// -------------
const { getPlaylistUpdate } = require('./getPlaylistUpdate')
const { postToDiscord } = require('./postToDiscord')

let lastChecked = undefined

const scheduler = new ToadScheduler()

const setLastChecked = () => {
  if (!lastChecked) {
    lastChecked = dayjs().subtract(15, 'minutes')
  } else {
    lastChecked = dayjs()
  }
}

const mainTask = async () => {
  setLastChecked()
  const newSongsSinceLastChecked = await getPlaylistUpdate(lastChecked)
  await postToDiscord(newSongsSinceLastChecked)

  console.log(`running a task NOW: ${dayjs()}`)
}
mainTask()

const task = new AsyncTask(
  'checking for new tracks',
  async () => {
    mainTask()
  },
  err => {
    console.log(`Something went wrong here: ${err.message}`)
  },
)

const job = new SimpleIntervalJob({ minutes: 1 }, task)

scheduler.addSimpleIntervalJob(job)
