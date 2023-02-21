//import logo from './logo.svg';
import './App.css';
import HomePageComponent from './home_component/homePageComponent';
import EducationPageComponent from './education_component/educationPageComponent';
import ProjectPageComponent from './project_component/projectPageComponent';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';

function App() {
  return (
    <>
      {/* This is the alias of BrowserRouter i.e. Router */}
      <Router>
        <Switch>
          {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
          <Route exact path="/" component={HomePageComponent} />

          {/* This route is for about component 
          with exact path "/about", in component 
          props we passes the imported component*/}
          <Route path="/education" component={EducationPageComponent} />

          {/* This route is for about component 
          with exact path "/about", in component 
          props we passes the imported component*/}
          <Route path="/project" component={ProjectPageComponent} />

          {/* If any route mismatches the upper 
          route endpoints then, redirect triggers 
          and redirects app to home component with to="/" */}
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
