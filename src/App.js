import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Homepage from './components/Homepage'
import Game from './components/Game'
import Login from './components/Login'
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      questions: [],
      randVals: [],
      category: "a",
      categorySelected: false,
      userLoggedIn: false
    }
    this.startGame = this.startGame.bind(this)
    this.generateValues = this.generateValues.bind(this)
  }

  startGame = () => {
    let category = document.getElementsByClassName('active selected item').length !== 0 ?
      document.getElementsByClassName('active selected item')[0].dataset.category : null
    this.fetchHandler(category);
  }

   getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  generateValues(data){
    let randVal = data.map((question) => this.getRandomIntInclusive(0, 500))
    console.log(randVal)
    return randVal
  }

  encode = (string) => {
    var encodedStr = string
    var parser = new DOMParser;
    var dom = parser.parseFromString(
        '<!doctype html><body>' + encodedStr,
        'text/html');
    var decodedString = dom.body.textContent;
    return decodedString
  }

  fetchHandler = (category) => {
    fetch(`http://localhost:3000/categories/${category}`)
    .then(resp => resp.json())
    .then(data => {
      return data.map((question) => {
        let q = this.encode(question.question)
        //let q = this.encode(question.text)
        let answer = this.encode(question.answer)
        // let answer = this.encode(question.answers.filter(answers => answers.correct === true)[0].text)
        return [q, answer]
      })
    })
    .then(data => {
      data.splice(-1,1)
      let vals = this.generateValues(data)
      this.setState({
        questions: data,
        randVals: vals
    })}
    )
  }

  changeCategory = (event) => {
    let selected = event.target.dataset.category
    this.setState({
      category: "/" + selected,
      categorySelected: true
    })
  }

  login = (event) => {
    let inputUsername = document.getElementById('username').value
    let inputPassword = document.getElementById('password').value
    if (inputUsername !== '' && inputPassword !== '') {
      let submit = new FormData()
      submit.append('username', inputUsername);
      submit.append('password', inputPassword);
      fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        body: submit
      }).then(res => res.json())
      .then(data => {
        debugger
      })
    }
    debugger
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path='/' render={() => <Homepage category={this.state.category} start={this.startGame} changeCategory={this.changeCategory} categorySelected={this.state.categorySelected}/>} />
            <Route exact path={this.state.category} render={() => <Game questions={this.state.questions} randomValues={this.state.randVals} />} />
            <Route exact path='/login' render={() => <Login login={this.login} loggedIn={this.state.userLoggedIn}/>}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
