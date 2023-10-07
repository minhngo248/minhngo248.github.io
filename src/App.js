import './App.css';
import HomePage from './pages/home';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />

        {/*<Route exact path="/education" component={EducationPageComponent} />*/}

        {/*<Route exact path="/project" component={ProjectPageComponent} />*/}

      </Switch>
    </BrowserRouter>
  );
}

export default App;
