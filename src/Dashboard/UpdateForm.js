import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

class UpdateForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            title: "",
            budget: 0,
            used: 0,
            redirect: false
        }
    }

    componentDidMount() {
        //in local storage, the array was converted to a string so split(',') tokenizes it
        //back into an array, using a comma as a delimiter
        var original = localStorage.getItem('entry');
        
        //set the state on page load so the form fields can have a starting value
        if(original != null){
            original = original.split(',');
            if(this.state.title !== original[0]){
                this.setState({title: original[0], budget: original[1], used: original[2]});
            }
        }
    }

    onSubmit = () => {
        const {title, budget, used} = this.state;
        const email = localStorage.getItem("email");
        var original = localStorage.getItem("entry");
       
        if(original !== null){
            original = original.split(',');
            let submission = {email: email, oldTitle: original[0], title: title, budget: budget, used: used}
            axios.post('http://localhost:4200/api/update', submission).then((res)=>{
                if(res && res.data && res.data.success){
                    this.setState({redirect: true});
                }
            }).catch((error)=>{
                console.log("Error: Something went wrong. Could not update budget.");
                console.log(error);
            });
        }
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        const token = localStorage.getItem('jwt');
        if(token){
            const {title, budget, used, redirect} = this.state;
            if(!redirect){
                const original = localStorage.getItem('entry');
                if(original !== null){
                    return (
                        <main id="form_main">
                            <p id="back"><Link to='/budgets'>Back to Budget</Link></p><br/><br/>
                            <h1>Edit Budget</h1>
                            <form id="update_form">
                                <table>
                                <tbody><tr>
                                    <td><b>Category</b></td><td><b>Budgeted Amount</b></td><td><b>Amount Spent</b></td>
                                </tr></tbody>
                                </table>
                                <input type="text" name="title" value={title} required="required" onChange={this.changeHandler}/>
                                <input type="number" name="budget" value={budget} required="required" onChange={this.changeHandler}/>
                                <input type="number" name="used" value={used} required="required" onChange={this.changeHandler}/><br/>
                                <button type="button" onClick={this.onSubmit}>Submit</button>
                            </form>
                        </main>
                    );
                }else{
                    console.log("Error: entry not found in local storage. Redirecting to homepage.");
                    return <Redirect to="/"/>
                }
            }else{
                return <Redirect to="/budgets"/>
            }
        }else{
            return <Redirect to="/login"/>
        }
    }
}
export default UpdateForm;