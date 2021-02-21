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
            confirmPassword: "",
            redirect: false
            // logMeIn: false
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
            const data = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
            axios.post('http://localhost:4200/api/signup', data).then((res)=> {
                if(res && res.data && res.data.success){
                    // let login = {
                    //     email: data.email,
                    //     password: data.password
                    // }
                    //log the user in afterward if they want
                    // if(this.state.logMeIn){
                    //     axios.post('http://localhost:4200/api/login', login).then((res)=> {
                    //         sessionStorage.setItem('jwt', res.data.token);
                    //         sessionStorage.setItem("email", data.email);
                    //     });
                    // }
                    toast.info("Sign-up was successful. Welcome!");
                    setTimeout(()=>{this.setState({redirect:true})}, 3000);
                }else{
                    console.log("Something went wrong. Sign-up failed.");
                    toast.info("Oops, something went wrong. Sign-up failed.");
                }
            });
        }else{
            toast.info("Error: passwords must match.");
        }
    }

    render(){
        var {username, email, password, confirmPassword, redirect} = this.state;
        if(redirect){
            return <Redirect to="/"/>
        }else{
            return (
                <main id="form_main">
                    <ToastContainer autoClose={3000}/>
                    <p id="back"><Link to="/">Back to home</Link></p><br/><br/>
                    <h1>Sign Up</h1>
                    <form id="signup_form" onSubmit={this.submitHandler}>
                        <input type="text" name="username" value={username} onChange={this.changeHandler} placeholder="Username" maxLength="50" required="required"/>
                        <input type="email" name="email" value = {email} onChange={this.changeHandler} placeholder="Email" required="required"/>
                        <input type="password" name="password" value={password} onChange={this.changeHandler} placeholder="Password" minLength="6" required="required"/>
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={this.changeHandler} placeholder="Confirm Password" minLength="6" required="required"/><br/>

                        {/* <div id="login_checkbox"> */}
                            {/* <label>Keep me signed in</label> */}
                            {/* <input type='checkbox' id="login_checkbox" name="logMeIn" value={logMeIn} onChange={this.changeHandler}/><br/> */}
                        {/* </div> */}

                        <button type="submit">Sign Up</button>
                        <p>Already have an account? <Link to='/login'>Log in</Link></p>
                    </form>
                    <div id="end_signup"/>
                </main>
            );
        }
    }
}

export default SignupPage;