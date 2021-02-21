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
            // rememberMe: false,
            redirect: false
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    submitHandler = (e) => {
        e.preventDefault();
        const {email, password} = this.state;
        var credentials = {email, password}
        axios.post('http://localhost:4200/api/login', credentials).then((res)=> {
            if(res && res.data && res.data.success) {
                const token = res.data.token;
                localStorage.setItem('jwt', token);
                localStorage.setItem("email", email);

                toast.info("Sign-in successful. Welcome!");
                setTimeout(()=>{this.setState({redirect:true})}, 3000);
            }else{
                toast.info("Email or password is incorrect.");
            }
        });
    }

    render(){
        const {email, password, redirect} = this.state;
        // const {email, password, redirect} = this.state;
        if(redirect){
            return <Redirect to="/dashboard"/>
        }else{
            return (
                <main id="form_main">
                    <ToastContainer autoClose={3000}/>
                    <p id="back"><Link to="/">Back to home</Link></p><br/><br/>
                    <h1>Login</h1>
                    <form id="login_form">
                        <input type="email" name="email" placeholder="Email" required="required" value={email} onChange={this.changeHandler}/> <br/>
                        <input type="password" name="password" placeholder="Password" required="required" value={password} onChange={this.changeHandler}/><br/>
                        
                        {/* <div id="login_checkbox"> */}
                        {/* <label>Keep me signed in</label> */}
                        {/* <input type='checkbox' name="rememberMe" value={rememberMe} onChange={this.changeHandler}/><br/> */}
                        {/* </div> */}

                        <br/>
                        <button type="button" onClick={this.submitHandler}>Login</button> <br/>
                        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </form>
                </main>
            );
        }
    }
}
export default LoginPage;
