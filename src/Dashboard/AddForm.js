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
      used: 0
    }
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  changeHandler = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  submitHandler = (e) => {
      e.preventDefault();
      axios.post('http://localhost:4200/api/add', this.state).then((res)=> {
        console.log(res);
        if(res && res.data && res.data.success) {
          toast.info("Budget successfully added!");
          // <Redirect to="/dashboard"/>
        }else{
          console.log("Error: Could not be updated.");
          toast.info("Oops, something went wrong. Budget could not be added.");
        }
      });
  }

  render() {
    const token = localStorage.getItem('jwt');
    if(token){
      const {title, budget, used} = this.state;
      return (
        <main id="addform_main">
          <p id="login_back"><Link to='/dashboard'>Back to dashboard</Link></p><br/><br/>
          <h1>Add a Budget</h1>
            <form onSubmit={this.submitHandler} id="add_form">
              <label for="title">Budget category: </label><br/>
              <input type="text" id="title" name="title" value={title} required="true" onChange={this.changeHandler}/>
              <br/>
              <label for="budget">Enter your budget for this category: </label><br/>
              <input type="number" id="budget" name="budget" value={budget} required="true" onChange={this.changeHandler}/>
              <br/>
              <label for="used">Enter the amount of the budget you've already spent: </label><br/>
              <input type="number" id="used" name="used" value={used} required="true" onChange={this.changeHandler}/>
              <br/><br/>
              <button type="submit">Add budget</button>
            </form>
            <div id="end_add_form"/>
        </main>
      );
    }else{
      return <Redirect to="/login"/>
    }
  }
}
export default AddForm;