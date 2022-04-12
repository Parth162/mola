import React, { Component } from 'react';

import questions from './Questions.json';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

var _ = require('underscore');

class App extends Component {
  state = {
    quesnum: '',
    responseToPost: '',
    questions: [],
    timeTaken: new Date().getTime(),
    answers: []
  };
  
  // Initializing variables when the page is reloaded
  componentDidMount() {
    //Selecting random 10 integers between 1 to 36 for the questions
    var arr = [];
    while(arr.length < 10){
      var r = Math.floor(Math.random() * 36) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    this.setState({quesnum: arr.toString()})
    var quesarr = [];
    arr.forEach(element => {
      quesarr.push(questions[element]["questiontext"]);
    });
    this.setState({questions: quesarr});

    //Initial all radio buttons default to Neutral
    this.setState({answers: ["Neutral","Neutral","Neutral","Neutral","Neutral","Neutral","Neutral","Neutral","Neutral","Neutral"]});
  }
  
  //Call API to create the response in the database
  
  handleSubmit = async (e) => {
    e.preventDefault();
    let time = new Date().getTime();
    time = (time - this.state.timeTaken)/1000;

    document.getElementById("submit").disabled=true;  // Disabling the submit button after recording the response

    const response = await fetch('/api/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Response has questions, answers and time taken to complete
      body: JSON.stringify({ questions: this.state.questions, answers: this.state.answers, timeTaken: time }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };

  onValueChange = (event) =>{
    var index = event.target.name.substring(4);
    index = parseInt(index);
    var temp = this.state.answers;
    temp[index-1] = event.target.value;
    this.setState({answers: temp});
  }
  
render() {
  var arrstring = this.state.quesnum.toString().split(',');
  const arrloop = _.range(10);
  if(arrstring.length === 1) return (<div className="container">
                                        <div className="jumbotron">
                                          <div className="p-3 mb-2 text-center"><h1>MOLA</h1></div>
                                      </div>
                                      </div>);
  else {
    return (
      <div className="container">
        <div className="jumbotron">
          <div className="p-3 mb-2 text-center"><h1>MOLA</h1></div>
      </div>
      <div>
      <p className="fw-bold">Complete the following questionnaire</p>
      <form className=" bg-white">
        {arrloop.map(index =>(
          <div className = "card card-body"><form>
          <p>{(index+1).toString()+". "+questions[arrstring[index]]["questiontext"]}</p>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Strongly Disagree" checked={this.state.answers[index]==="Strongly Disagree"} onChange={this.onValueChange}/>
            <label className="form-check-label">
              Strongly Disagree
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Disagree" checked={this.state.answers[index]==="Disagree"} onChange={this.onValueChange}/>
            <label className="form-check-label">
              Disagree
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Slightly Disagree" checked={this.state.answers[index]==="Slightly Disagree"} onChange={this.onValueChange} />
            <label className="form-check-label">
              Slightly Disagree
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Neutral" checked={this.state.answers[index]==="Neutral"} onChange={this.onValueChange} />
            <label className="form-check-label">
              Neutral
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Slightly Agree" checked={this.state.answers[index]==="Slightly Agree"} onChange={this.onValueChange} />
            <label className="form-check-label">
              Slightly Agree
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Agree" checked={this.state.answers[index]==="Agree"} onChange={this.onValueChange} />
            <label className="form-check-label">
              Agree
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="radio" name={"Form"+(index+1).toString()} value="Strongly Agree" checked={this.state.answers[index]==="Strongly Agree"} onChange={this.onValueChange} />
            <label className="form-check-label">
              Strongly Agree
            </label>
          </div></form>
        </div>
        ))}
        <div className="text-center mt-3 mb-3">
          <button type="button" className="btn btn-primary btn-lg" onClick={this.handleSubmit} id="submit">Submit</button>
        </div>
      </form>
      <p className='text-center'>{this.state.responseToPost}</p>
      </div>
      </div>
    );}
  }
}

export default App;