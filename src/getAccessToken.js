const axios = require('axios')

const getAccessToken = async () => {
  const url = `https://accounts.spotify.com/api/token`

  return await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${process.env.CLIENT_INFO}`,
    },
  })
}

exports.getAccessToken = getAccessToken
