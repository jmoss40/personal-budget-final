import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Doughnut, Bar, Radar} from 'react-chartjs-2';
import axios from 'axios';

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.getBudgets = this.getBudgets.bind(this);
        this.state = {
            user_budgets: []
        };
    }

    getBudgets = () => {
        const email = localStorage.getItem("email");
        axios.post('http://localhost:4200/api/budgets', {email: email}).then((res)=>{
            // If user has no budgets, can't create charts
            if(res.data.data.length === 0){
                this.setState({user_budgets: []});
            }
            //prevents component from rerendering when state changes if it doesn't need to
            if(this.state.user_budgets.length === 0){
                this.setState({user_budgets: res.data.data});
            }
        }).catch((error)=>{
            console.log("Error: Something went wrong. Could not get budgets.");
            console.log(error);
            this.setState({user_budgets: []});
        });
    }

    charts = () => {
        const data = this.state.user_budgets;
        let color_scheme = ['#CDB4DB','#FFC8DD','#FFAFCC','#BDE0FE','#A2D2FF'];

        //create empty datasets for the charts
        let chart_data = {
            labels: [],
            datasets: [{
                label: ["Amount Budgeted"],
                data: [],
                backgroundColor: [],
                hoverBackgroundColor:[]
            }, {
                label: ["Amount Spent"],
                data: [],
                backgroundColor: [],
                hoverBackgroundColor:[]
            }]
        }

        //use the users budgets to fill the chart datasets above
        for(let i = 0; i < data.length; i++){
            chart_data.labels.push(data[i].title);

            chart_data.datasets[0].data.push(data[i].budget);
            chart_data.datasets[1].data.push(data[i].used);

            chart_data.datasets[0].backgroundColor.push(color_scheme[i % 5]);
            chart_data.datasets[0].hoverBackgroundColor.push(color_scheme[i % 5]);
            chart_data.datasets[1].backgroundColor.push(color_scheme[i % 5]);
            chart_data.datasets[1].hoverBackgroundColor.push(color_scheme[i % 5]);
        }

        return chart_data;
    }
    
    radarChart = () => {
        const data = this.state.user_budgets;

        let chart_data = {
            labels: [],
            datasets: [{
                label: ["Amount Budgeted"],
                data: [],
                backgroundColor: "rgba(255, 175, 204, 0.5)",
                hoverBackgroundColor: "rgba(255, 175, 204, 0.5)"
            }, {
                label: ["Amount Spent"],
                data: [],
                backgroundColor: "rgb(162, 210, 255, 0.6)",
                hoverBackgroundColor: "rgb(162, 210, 255, 0.6)"
            }]
        }

        //use the users budgets to fill the chart datasets above
        for(let i = 0; i < data.length; i++){
            chart_data.labels.push(data[i].title);

            chart_data.datasets[0].data.push(data[i].budget);
            chart_data.datasets[1].data.push(data[i].used);
        }

        return chart_data;
    }

    //needed to provide a unique key to each dataset used by the chart
    datasetKeyProvider(){
        return Math.floor(Math.random()*100);
    }

    render() {
        const token = localStorage.getItem('jwt');
        if(token){
            this.getBudgets();
            
            // If the user does not have any budgets, display a message and the link to the add form
            // instead of empty charts
            var budgets = this.state.user_budgets;
            if(!budgets || budgets.length === 0){
                return (
                    <article id="dashboard_content">
                    <h1>Dashboard</h1>
                    <p>Welcome to your dashboard! You do not have anything in your budget yet. Click the button below to
                        add to your budget!
                    </p><br/>
                    <button><Link to="/add">Start my Budget</Link></button>
                    <br/><br/><br/><br/><br/><br/><br/>
                    </article>
                );
            }else{
                return (
                <div id="dashboard">       
                    <h1>Dashboard</h1>
                    <p>Welcome to your dashboard! Here you can view and update your budget to help
                    keep track of your finances.</p>
                    <table id="dashboard_content">
                    <tbody>
                    <tr>
                        <td className="table_text">
                            Here is a double doughnut chart showing how your budget is being divided. 
                            Hover over each section to see the category and the amount of money
                            in your budget that you have reserved for that category. The outer doughnut
                            is the amount you have budgeted for the category, and the inner circle is the
                            amount you have spent.
                        </td>
                        <td>
                        <Doughnut reponsive={true} maintainAspectRatio={true} height={200} width={400} data={this.charts}/>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                        <Bar data={this.charts} width={400} height={200} options={{legend:{display: false}}} datasetKeyProvider={this.datasetKeyProvider}/>
                        </td>
                        <td className="table_text">
                            Here is a bar graph showing each category in your budget, and the difference
                            between how much you've reserved and how much you've spent. Its a good idea to
                            analyze your spending habits so you know how to plan your budget!
                        </td>
                    </tr>
                    
                    <tr>
                        <td className="table_text">
                            Here is a radar chart showing the amount of your budget that is going towards
                            each category, versus the amount you've spent in each category. It can be useful
                            to see where the majority of your money goes. 
                        </td>
                        <td>
                        <Radar data={this.radarChart} width={400} height={200} datasetKeyProvider={this.datasetKeyProvider}/>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                    <br/><br/>
                    <button><Link to="/budgets">Edit Budget</Link></button>
                    <button><Link to="/add">Add to Budget</Link></button>
                    <br/><br/><br/><br/><br/><br/><br/>
                </div>
                );
            }
        }else{
            return <Redirect to="/login"/>
        }
    }
}
export default Dashboard;
