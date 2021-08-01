# spo-track 🕵️
### spotify playlist new item tracker

post your whatsitsface latest finds to your whatever discord channel for your online friends to see

you need to register [here](https://developer.spotify.com/) to start the process of adding an "APP" and getting your client id & secret.

before you start with anything fancy add your:
- spotify client info (its your CLIENT_ID:CLIENT_SECRET in base64, amazing right? you can find something [here](https://duckduckgo.com/?q=base64+encoder) to do the base64 thingy
- spotify playlist id (if you dont know your id, you can find it when you click share on spotify)
- discord webhook uri
- check interval minutes (optional)

to your `.env` like so

```
CLIENT_INFO=SUPERSECRET
PLAYLIST_ID=MEGAID
DISCORD_WEBHOOK=DISCORDLOL
CHECK_INTERVAL_MINUTES=15
```

following that you need to obviously

`npm install`

you can run the app in dev mode

`npm run start:dev`

or just run it like its [hot](https://www.youtube.com/watch?v=GtUVQei3nX4) 🔥

`npm start`

I added a `Procfile` if you want to run it on `heroku`, but you can run it wherever.

PS: the playlist you're trying to get the info of, obviously needs to be public....

k bye

