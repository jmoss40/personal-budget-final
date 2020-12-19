import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.getDashboard = this.getDashboard.bind(this);
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4200/api/login', this.state).then((res)=> {
            console.log(res);
            if(res && res.data && res.data.success) {
                const token = res.data.token;
                localStorage.setItem('jwt', token);
                console.log("Successfully signed in!");
                this.getDashboard();
            }else{
                toast.info("Email or password is incorrect.");
            }
        });
    }
    
    getDashboard(){
        const token = localStorage.getItem('jwt');
        axios.get('http://localhost:4200/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res=>{
            if(res && res.data && res.data.success){
                toast.info("Sign-in successful. Welcome!");
                console.log("Redirecting to dashboard...");
                <Redirect push to="/dashboard"/> //REDIRECTING DOESNT WORK
            }
        });
    }

    render(){
        const {email, password} = this.state;
        return (
            <main id="login_main">
                <ToastContainer/>
                <p id="login_back"><Link to="/">Back to home</Link></p><br/><br/>
                <h1>Login</h1>
                <form id="login_form" onSubmit={this.submitHandler}>
                    <input type="email" name="email" placeholder="Email" required="required" value={email} onChange={this.changeHandler}/> <br/>
                    <input type="password" name="password" placeholder="Password" required="required" value={password} onChange={this.changeHandler}/><br/>
                    <button type='submit'>Login</button>
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </form>
                <div id="end_login"></div>
            </main>
        );
    }
}
export default LoginPage;
