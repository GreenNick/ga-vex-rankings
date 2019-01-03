import React, { Component } from 'react';
//import teams from './teams.json'
import './App.css';

class App extends Component {
  state = {
    pageIndex: 0,
    teams: {}
  }

  fetchSkillRank = async (url) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.result[0].score
      }
      throw new Error('Request failed')
    } catch (error) {
      console.log(error)
    }
  }

  fetchTeamName = async (url) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.result[0].team_name
      }
      throw new Error('Request failed')
    } catch (error) {
      console.log(error)
    }
  }

  fetchAwardNum = async (url) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.result.length
      }
      throw new Error('Request failed')
    } catch (error) {
      console.log(error)
    }
  }

  fetchQualification = async (team) => {
    try {
      const response = await fetch('/api/qualified')
      if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.includes(team)
      }
      throw new Error('Request failed')
    } catch (error) {
      console.log(error)
    }
  }

  handleSkillsClick = () => {
    this.setState({ pageIndex: 0 })
  }

  handleAwardsClick = () => {
    this.setState({ pageIndex: 1 })
  }

  componentDidMount () {
    const newState = { teams: {} }
    fetch('/api/teams')
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.forEach((team) => {
        const url = `https://api.vexdb.io/v1/`
        Promise.all([
          this.fetchTeamName(`${url}get_teams?team=${team}`),
          this.fetchSkillRank(`${url}get_skills?season_rank=true&season=current&type=0&team=${team}`),
          this.fetchSkillRank(`${url}get_skills?season_rank=true&season=current&type=1&team=${team}`),
          this.fetchSkillRank(`${url}get_skills?season_rank=true&season=current&type=2&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Tournament%20Champions%20(VRC/VEXU)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Excellence%20Award%20(VRC/VEXU)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Excellence%20Award%20(High%20School)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Design%20Award%20(VRC/VEXU)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Robot%20Skills%20Champion%20(VRC/VEXU)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Judges%20Award%20(VRC/VEXU)&team=${team}`),
          this.fetchAwardNum(`${url}get_awards?season=current&name=Tournament%20Finalists%20(VRC/VEXU)&team=${team}`),
          this.fetchQualification(team)
        ])
          .then(response => {
            newState.teams[team] = {
              name: response[0],
              driverScore: response[1],
              programmingScore: response[2],
              combinedScore: response[3],
              champion: response[4],
              excellence: response[5] + response[6],
              design: response[7],
              skills: response[8],
              judges: response[9],
              finalist: response[10],
              qualified: response[11]
            }
            this.setState(newState)
          })
      }))

    /*
    const teamObject = teams.teams.reduce((acc, currVal) => {
      acc[currVal] = {
        name: '',
        driverScore: 0,
        programmingScore: 0,
        combinedScore: 0,
        qualified: false,
        champion: 0,
        excellence: 0,
        design: 0,
        skills: 0,
        judges: 0,
        finalist: 0,
      }
      return acc
    }, {})

    for (let team in teamObject) {
      this.fetchSkillRank(`https://api.vexdb.io/v1/get_skills?season_rank=true&team=${team}&season=current&type=0`)
        .then(response => {
          teamObject[team].driverScore = response
          this.setState({ teams: teamObject })
        })
      this.fetchSkillRank(`https://api.vexdb.io/v1/get_skills?season_rank=true&team=${team}&season=current&type=1`)
        .then(response => {
          teamObject[team].programmingScore = response
          this.setState({ teams: teamObject })
        })
      this.fetchSkillRank(`https://api.vexdb.io/v1/get_skills?season_rank=true&team=${team}&season=current&type=2`)
        .then(response => {
          teamObject[team].combinedScore = response
          this.setState({ teams: teamObject })
        })
      this.fetchTeamName(`https://api.vexdb.io/v1/get_teams?team=${team}`)
        .then(response => {
          teamObject[team].name = response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Tournament%20Champions%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].champion = response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Excellence%20Award%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].excellence += response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Excellence%20Award%20(High%20School)&team=${team}`)
        .then(response => {
          teamObject[team].excellence += response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Design%20Award%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].design = response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Robot%20Skills%20Champion%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].skills = response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Judges%20Award%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].judges = response
          this.setState({ teams: teamObject })
        })
      this.fetchAwardNum(`https://api.vexdb.io/v1/get_awards?season=current&name=Tournament%20Finalists%20(VRC/VEXU)&team=${team}`)
        .then(response => {
          teamObject[team].finalist = response
          this.setState({ teams: teamObject })
        })
      teamObject[team].qualified = teams.stateTeams.includes(team)
      this.setState({ teams: teamObject })
    }
    */
  }

  render () {
    return (
      <div className="App">
        <header>
          <h1>Georgia VEX Rankings</h1>
          <nav>
            <ul>
              <li onClick={this.handleSkillsClick}>Skills Ranking</li>
              <li onClick={this.handleAwardsClick}>Award Tracking</li>
            </ul>
          </nav>
        </header>
        <main>
          {
            this.state.pageIndex === 0
              ? <SkillsRanking teams={this.state.teams} />
              : <AwardsTracking teams={this.state.teams} />
          }
        </main>
      </div>
    );
  }
}

const SkillsRanking = props => {
  let dataArray = []
  for (let team in props.teams) {
    dataArray.push(
      <tr>
        <td>{team}</td>
        <td>{props.teams[team].name}</td>
        <td>{props.teams[team].combinedScore}</td>
        <td>{props.teams[team].driverScore}</td>
        <td>{props.teams[team].programmingScore}</td>
        <td>{props.teams[team].qualified.toString()}</td>
      </tr>
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Name</th>
          <th>Highest Robot Skills</th>
          <th>Highest Driver Skills</th>
          <th>Highest Programming Skills</th>
          <th>Qualified</th>
        </tr>
      </thead>
      <tbody>
        {dataArray}
      </tbody>
    </table>
  )
}

const AwardsTracking = props => {
  let dataArray = []
  for (let team in props.teams) {
    let total = props.teams[team].champion + props.teams[team].excellence + props.teams[team].design + props.teams[team].skills + props.teams[team].judges + props.teams[team].finalist

    dataArray.push(
      <tr>
        <td>{team}</td>
        <td>{props.teams[team].name}</td>
        <td>{total}</td>
        <td>{props.teams[team].champion}</td>
        <td>{props.teams[team].excellence}</td>
        <td>{props.teams[team].design}</td>
        <td>{props.teams[team].skills}</td>
        <td>{props.teams[team].judges}</td>
        <td>{props.teams[team].finalist}</td>
      </tr>
    )
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Name</th>
          <th>Total</th>
          <th>Champion</th>
          <th>Excellence</th>
          <th>Design</th>
          <th>Robot Skills</th>
          <th>Judges</th>
          <th>Finalist</th>
        </tr>
      </thead>
      <tbody>
        {dataArray}
      </tbody>
    </table>
  )
}

export default App;
