import axios from 'axios';
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SignupPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);

    }

    changeHandler(e){
        this.setState({[e.target.name]: e.target.value});
    }


    submitHandler(e){
        e.preventDefault();
        if(this.state.password === this.state.confirmPassword){
            //perform post request (dont send confirmPassword)
            const data = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
            var success;
            axios.post('http://localhost:4200/api/signup', data).then((res)=> {
                if(res && res.data && res.data.success){
                    toast.info("Sign-up was successful. Welcome!");
                    success = res.data.success;
                }else{
                    console.log("Something went wrong. Sign-up failed.");
                }
            });
        if(success){<Redirect to="/"/>} //REDIRECT DOES NOT WORK
        }else{
            console.log("Error: passwords must match.");
            toast.info("Error: passwords must match.");
        }
    }

    render(){
        var {username, email, password, confirmPassword} = this.state;
        return (
            <main id="login_main">
                <ToastContainer/>
                <p id="login_back"><Link to="/">Back to home</Link></p><br/><br/>
                <h1>Sign Up</h1>
                <form id="signup_form" onSubmit={this.submitHandler}>
                    <input type="text" name="username" value={username} onChange={this.changeHandler} placeholder="Username" maxLength="50" required="required"/>
                    <input type="email" name="email" value = {email} onChange={this.changeHandler} placeholder="Email" required="required"/>
                    <input type="password" name="password" value={password} onChange={this.changeHandler} placeholder="Password" minLength="6" required="required"/>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={this.changeHandler} placeholder="Confirm Password" minLength="6" required="required"/><br/>
                    <button type="submit">Sign Up</button>
                    <p>Already have an account? <Link to='/login'>Log in</Link></p>
                </form>
                <div id="end_signup"/>
            </main>
        );
    }
}

export default SignupPage;