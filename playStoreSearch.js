const gplay = require('google-play-scraper')
const fs = require('fs')
const xlsx = require('xlsx')

fs.readFile('topDevelopers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err)
    return
  }

  try {
    const developers = JSON.parse(data)
    const worksheet = xlsx.utils.json_to_sheet([])
    const workbook = xlsx.utils.book_new()

    const header = ['Developer', 'Title', 'Release Date', 'URL']
    xlsx.utils.sheet_add_aoa(worksheet, [header])

    const promises = developers.map((developer) => {
      return gplay
        .developer({ devId: developer.GooglePlayName })
        .then((games) => {
          games.forEach((game) => {
            gplay.app({ appId: game['appId'] }).then((g) => {
              const releaseDate = new Date(g.released)
              const formattedDate = releaseDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              const currentDate = new Date()
              const oneMonthAgo = new Date('Jun 1, 2023 00:00:00')
              const oneWeekAgo = new Date()
              //oneMonthAgo.setMonth(currentDate.getMonth() - 1)
              oneWeekAgo.setDate(currentDate.getDate() - 6)

              if (releaseDate >= oneWeekAgo && releaseDate <= currentDate) {
                const rowData = {
                  Developer: developer.GooglePlayName,
                  Title: g.title,
                  'Release Date': formattedDate,
                  URL: g.url,
                }

                xlsx.utils.sheet_add_json(worksheet, [rowData], {
                  skipHeader: true,
                  origin: -1,
                })
              }
            })
          })
        })
    })

    Promise.all(promises).then(() => {
      const worksheetName = 'PlayStore'
      xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName)
      const excelData = xlsx.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      })
      fs.writeFile('output2.xlsx', excelData, (err) => {
        if (err) {
          console.error('Error writing Excel file:', err)
        } else {
          console.log('Excel file generated successfully!')
        }
      })
    })
  } catch (error) {
    console.error('Error parsing JSON file:', error)
  }
})
