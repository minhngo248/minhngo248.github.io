//import logo from './logo.svg';
import './App.css';
import HomePageComponent from './home_component/homePageComponent';
import EducationPageComponent from './education_component/educationPageComponent';
import ProjectPageComponent from './project_component/projectPageComponent';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePageComponent} />

        <Route exact path="/education" component={EducationPageComponent} />

        <Route exact path="/project" component={ProjectPageComponent} />

      </Switch>
    </BrowserRouter>
  );
}

export default App;
