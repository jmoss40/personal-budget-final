import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import pencil from '../pencil.png'
import trash from '../trash.png'

class BudgetsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            user_budgets: [],
            redirect: false
        }
    }

    getBudgets = () => {
        const email = localStorage.getItem("email");
        axios.post('http://localhost:4200/api/budgets', {email: email}).then((res)=>{
          if(res.data.data.length === 0){
            this.setState({user_budgets: []});
          }
          if(this.state.user_budgets.length === 0){
            this.setState({user_budgets: res.data.data});
          }
        }).catch((error)=>{
          console.log("Error: Something went wrong. Could not get budgets.");
          console.log(error);
          this.setState({user_budgets: []});
        });
      }

    editHandler = (e) => {
        const budgets = this.state.user_budgets;

        let entry = [
            budgets[e.target.name].title,
            budgets[e.target.name].budget,
            budgets[e.target.name].used
        ]

        localStorage.setItem("entry", entry);
        this.setState({redirect: true});
    }

    deleteHandler = (e) => {
        const budgets = this.state.user_budgets;
        const email = localStorage.getItem('email');
        let submission = {
            email: email,
            title: budgets[e.target.name].title,
            budget: budgets[e.target.name].budget,
            used: budgets[e.target.name].used
        }

        axios.post('http://localhost:4200/api/delete', submission).catch((error)=>{
            console.log("Error: Something went wrong. Could not update budget.");
            console.log(error);
        });

        this.setState({user_budgets: []}); //force page to reload
    }

    render() {
        const token = localStorage.getItem('jwt');
        // const session = sessionStorage.getItem('jwt');
        if(token){
            this.getBudgets();
            const redirect = this.state.redirect;
            if(!redirect){
                const budgets = this.state.user_budgets;
                const render = [];
                //dynamically create budgets list
                for(let i = 0; i < budgets.length; i++){
                    render.push(
                    <tr key={i}>
                        <td>{i+1}.)</td>
                        <td>{budgets[i].title}</td>
                        <td>{budgets[i].budget}</td>
                        <td>{budgets[i].used}</td>
                        <td><button type="button"><img src={pencil} onClick={this.editHandler} name={i} alt="Edit" width="15px"></img></button>
                            <button type="button"><img src={trash} onClick={this.deleteHandler} name={i} alt="Delete" width="15px"></img></button></td>
                    </tr>
                    );
                }

                return (
                    <main id="form_main">
                        <p id="back"><Link to='/dashboard'>Back to dashboard</Link></p><br/><br/>
                        <h1>Your Budget</h1>
                        <form id="budget_list">
                            <table id="budget_content">
                                <tbody>
                                <tr>
                                <td>&nbsp;</td><td><b>Category</b></td><td><b>Budgeted Amount</b></td><td><b>Amount Spent</b></td><td>&nbsp;</td>
                                </tr>
                                {render}
                                </tbody>
                            </table>
                        </form> <br/><br/>
                        <button><Link to="/add">Add to Budget</Link></button>
                        <br/><br/><br/>
                        <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> and <a href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">bqlqn</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                        <br/><br/><br/>
                    </main>
                );
            }else{
                return <Redirect to="/update"/>
            }
        }else{
            return <Redirect to="/login"/>
        }
    }
}
export default BudgetsList;