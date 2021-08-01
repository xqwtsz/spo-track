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
const d = require('dayjs')
const utc = require('dayjs/plugin/utc')
const dayjs = d.extend(utc)

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

  console.log(`lastChecked: ${lastChecked}`)
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

const job = new SimpleIntervalJob(
  { minutes: process.env.CHECK_INTERVAL_MINUTES || 15 },
  task,
)

scheduler.addSimpleIntervalJob(job)
