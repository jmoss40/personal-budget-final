import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class LogoutPage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const token = localStorage.getItem('jwt');
        if(token){
            localStorage.removeItem('jwt');
            setTimeout(() => {
                console.log("Attempting to redirect...");
                <Redirect to='/'/>
                console.log("Did it work?");
            }, 1000);
            return (
                <main id="logout">
                    <h1>Goodbye!</h1>
                    <p onLoad={this.redirect}>You are now logged out.</p>
                    <button><Link to="/">Homepage</Link></button>
                    <button><Link to="/login">Login</Link></button>
                    <div id="end_logout"></div>
                </main>
            );
        }else{
            return (<Redirect to='/'/>);
        }
    }
}
export default LogoutPage;