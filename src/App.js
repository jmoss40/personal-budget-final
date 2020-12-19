import './index.css';
import './App.css';
import Hero from './Hero/Hero';
import Homepage from './Homepage/Homepage';
import Footer from './Footer/Footer';
import Dashboard from './Dashboard/Dashboard';
import SignupPage from './SignupPage/SignupPage';
import LoginPage from './LoginPage/LoginPage';
import LogoutPage from './LogoutPage/LogoutPage';
import Menu from './Menu/Menu';
import AddForm from './Dashboard/AddForm'
import HomepageMenu from './Menu/HomepageMenu'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="mainContainer">
        <Switch>
          <Route path="/dashboard">
            <Menu/>
            <Dashboard/>
          </Route>
          <Route path="/signup">
            <SignupPage/>
          </Route>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <Route path="/logout">
            <LogoutPage/>
          </Route>
          <Route path="/add">
            <AddForm/>
          </Route>
          <Route path="/">
            <HomepageMenu/>
            <Hero/>
            <Homepage/>
          </Route>
        </Switch>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
