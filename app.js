const express = require('express')
const path = require('path')
const puppeteer = require('puppeteer')
const app = express()
const PORT = process.env.PORT || 5000

const scrapeTeams = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.robotevents.com/robot-competitions/vex-robotics-competition/RE-VRC-18-5113.html')

  const teams = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#data-table > tbody > tr > td:first-of-type'))
      .map(team => team.innerText.trim())
  )

  await browser.close()
  return teams
}

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/stateQualified', (req, res) => {
  const stateTeams = new Promise((resolve, reject) => {
    scrapeTeams()
      .then(data => resolve(data))
      .catch(err => reject('scraping failed'))
  })

  stateTeams
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err))
})

app.get('/teams', (req, res) => {
  res.send([ '109A', '109X', '109Y', '109Z', '1199A', '1199B', '1253A', '1253B', '1253C', '1253E', '1253F', '1264C', '1264D', '1264E', '1275A', '1275B', '1275C', '1275D', '1275E', '1282B', '1282C', '1291A', '1291B', '1316A', '1316B', '1320A', '1320B', '1320C', '1320D', '1320E', '1356A', '1356B', '1356C', '1356X', '1368A', '1958A', '1958B', '1961A', '1961U', '1961X', '1961Z', '2105A', '2105B', '2105C', '265A', '265S', '265T', '30047G', '3142B', '33344A', '33344B', '33344C', '3536M', '3536P', '3536R', '3536X', '383T', '383Z', '3911A', '3911B', '3921A', '3921B', '40641A', '40641B', '4207A', '4207B', '4207C', '4495A', '4495C', '4495X', '5203P', '5203R', '5203S', '5278A', '5278B', '5278C', '6140A', '675A', '675B', '675C', '675D', '675E', '7019A', '7019B', '706A', '7347B', '74047A', '74832A', '8682N', '95E', '95M', '95S', '95T', '97979A', '97979B', '98881A', '98881E' ])
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})