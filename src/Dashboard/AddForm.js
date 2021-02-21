import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'

class AddForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            title: "",
            budget: 0,
            used: 0,
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
        const {title, budget, used} = this.state;
        const email = localStorage.getItem('email');
        let submission = {
            email: email,
            title: title,
            budget: budget,
            used: used
        }
        axios.post('http://localhost:4200/api/add', submission).then((res)=> {
            if(res && res.data && res.data.success) {
                toast.info("Successfully added!");
                setTimeout(()=>{this.setState({redirect:true})}, 3000);
            }else{
                toast.info("Oops, something went wrong. Budget could not be added.");
            }
        });
    }

    render() {
        const token = localStorage.getItem('jwt');
        // const session = sessionStorage.getItem('jwt');
        if(token){
        const {title, budget, used, redirect} = this.state;
            if(!redirect){
                return (
                    <main id="addform_main">
                        <ToastContainer autoClose={3000}/>
                        <p id="back"><Link to='/dashboard'>Back to dashboard</Link></p><br/><br/>
                        <h1>Add a Budget</h1>
                        <form onSubmit={this.submitHandler} id="add_form">
                            <label htmlFor="title">Budget category title: </label><br/>
                            <input type="text" id="title" name="title" value={title} required="required" onChange={this.changeHandler}/>
                            <br/>
                            <label htmlFor="budget">Enter your budget for this category: </label><br/>
                            <input type="number" id="budget" name="budget" value={budget} required="required" onChange={this.changeHandler}/>
                            <br/>
                            <label htmlFor="used">Enter the amount of the budget you've already spent: </label><br/>
                            <input type="number" id="used" name="used" value={used} required="required" onChange={this.changeHandler}/>
                            <br/><br/>
                            <button type="submit">Add budget</button>
                        </form>
                        <div id="end_add_form"/>
                    </main>
                );
            }else{
                return <Redirect to="/dashboard"/>
            }
        }else{
            return <Redirect to="/login"/>
        }
    }
}
export default AddForm;