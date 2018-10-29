import React, { Component } from 'react';
import './App.css';
import SearchBar from './SearchBar/SearchBar';
import Header from './Header/Header';
import Response from './Response/Response';
import { Route, Switch } from 'react-router-dom';


class App extends Component {

  state = {
    modalDisplay: false

  }

  click = () => {
    this.setState({ modalDisplay: !this.state.modalDisplay })
  };

  clickOff = () => {
    if (this.state.modalDisplay) {
      this.setState({ modalDisplay: false })
    }
  };


  render() {
    return (
      <div className='App'>
        <Header />
        <Switch>
          <Route exact path="/" component={SearchBar} />
          <Route path="/:typo" component={Response} />
        </Switch>
      </div>
    );
  }
}

export default App;
