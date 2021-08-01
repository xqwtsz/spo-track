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

let lastChecked = dayjs().subtract(15, 'minutes')

const scheduler = new ToadScheduler()

const setLastChecked = () => {
  lastChecked = dayjs()
}

const mainTask = async () => {
  console.log(`running a task NOW: ${dayjs()}`)
  console.log(`lastChecked: ${lastChecked}`)
  const { newTracksSinceLastChecked, playlist } = await getPlaylistUpdate(
    lastChecked,
  )
  setLastChecked()
  console.log(`new lastChecked: ${lastChecked}`)
  if (newTracksSinceLastChecked.length) {
    await postToDiscord(newTracksSinceLastChecked, playlist)
  }
}

// initial run when the app is run
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
