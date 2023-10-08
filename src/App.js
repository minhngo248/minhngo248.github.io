import './App.css';
import HomePage from './pages/home';
import EducationPage from "./pages/education";
import ProjectPage from "./pages/project";
import NotFoundPage from "./pages/notfound";
import {Switch, Route, BrowserRouter} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route path="/education">
                    <EducationPage />
                </Route>
                <Route path="/project">
                    <ProjectPage />
                </Route>
                <Route path="*">
                    <NotFoundPage />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
