import React, { Component } from 'react';
import {Redirect } from 'react-router-dom';

class LogoutPage extends Component{
    constructor(props){
        super(props);
        this.state = { redirect: false }
    }

    componentDidMount(){
        setTimeout(() => { this.setState({redirect: true}); }, 2000);
    }

    render(){
        const token = localStorage.getItem('jwt');
        if(token || !this.state.redirect){
            localStorage.removeItem('jwt');
            localStorage.removeItem('email');
            return (
                <main id="logout">
                    <h1>Goodbye!</h1>
                    <p>You are now logged out. Redirecting...</p>
                    <div id="end_logout"></div>
                </main>
            );
        }else{
            return <Redirect to='/'/>
        }
    }
}
export default LogoutPage;