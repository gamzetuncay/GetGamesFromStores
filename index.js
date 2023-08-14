const gplay = require('google-play-scraper')

gplay.developer({ devId: 'Rollic Games' }).then((games) => {
  games.forEach((game) => {
    gplay.app({ appId: game['appId'] }).then((g) => {
      const releaseDate = new Date(g['released'])
      const currentDate = new Date()
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(currentDate.getMonth() - 1)

      if (releaseDate >= threeMonthsAgo && releaseDate <= currentDate) {
        console.log(`Title: ${game['title']}`)
        console.log(`Release Date: ${g['released']}`)
        console.log(`URL: ${game['url']}`)
        console.log('-----------------')
      }
    })
  })
})
/*
const appStore = require('app-store-scraper')

console.log(' ')
console.log('**********************************')
console.log('ROLLIC GAMES')
console.log('**********************************')

appStore.developer({ devId: 1452111779 }).then((apps) => {
  apps.forEach((app) => {
    const releaseDate = new Date(app['released'])
    const formattedDate = releaseDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const currentDate = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3)

    if (releaseDate >= threeMonthsAgo && releaseDate <= currentDate) {
      console.log(`Title: ${app['title']}`)
      console.log(`Release Date: ${formattedDate}`)
      console.log('-----------------')
    }
  })
})
*/
