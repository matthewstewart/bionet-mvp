import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Loading from './components/Loading/Loading';

const Landing = lazy(() => import('./components/Landing'));

function WaitForComponent(Component, state) {
  return props => (
    <ErrorBoundary>
      <Suspense fallback={<div><Loading /></div>}>
        <Component {...state}/>
      </Suspense>
    </ErrorBoundary>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <main>
          <Switch>
            <Route path="/" exact component={WaitForComponent(Landing, this.state)}/>
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
