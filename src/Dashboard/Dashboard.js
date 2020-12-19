import React, {Component, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Doughnut, Bar, Radar} from 'react-chartjs-2';
import axios from 'axios';

class Dashboard extends Component{
  constructor(props){
    super(props);
    this.createChart1 = this.createChart1.bind(this);

    this.state = {
      chart1: "",
      chart_data: ""
    };
  }

  createChart1(){
    axios.get('http://localhost:4200/api/budgets').then((res)=>{
      let chart_data = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor:[]
          }, {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor:[]
          }]
      }
      let color_scheme = ['#CDB4DB','#FFC8DD','#FFAFCC','#BDE0FE','#A2D2FF'];
      for(let i = 0; i < res.data.data.length; i++){
        if(res.data.data[i].budget !== 0){
          chart_data.labels.push(res.data.data[i].title);
          chart_data.datasets[0].data.push(res.data.data[i].budget);
          chart_data.datasets[0].backgroundColor.push(color_scheme[i % 5]);
          chart_data.datasets[0].hoverBackgroundColor.push(color_scheme[i % 5]);

          chart_data.datasets[1].data.push(res.data.data[i].used);
          chart_data.datasets[1].backgroundColor.push(color_scheme[i % 5]);
          chart_data.datasets[1].hoverBackgroundColor.push(color_scheme[i % 5]);
        }
      }

      let chart1 = {
        labels: chart_data.labels,
        datasets: [{
          data: chart_data.datasets[0].data,
          backgroundColor: chart_data.datasets[0].backgroundColor,
          hoverBackgroundColor: chart_data.datasets[0].hoverBackgroundColor
        }]
      }

      this.setState({chart1: chart1, chart_data: chart_data});
    }).catch((error)=>{
      console.log("Error getting budgets.");
      console.log(error);
    });
  }

  render() {
    const token = localStorage.getItem('jwt');
    if(token){
      // this.getData();
      // this.createChart1();
      console.log("Attempting to get data...");
      // this.getData();
      // this.createChart1();
      this.createChart1();

      // let results = this.createChart1();

      // console.log(results);
      return (
        <article id="dashboard_content">
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard! Here you can view and update your budget to help
              keep track of your finances. 
            </p>
            <br/><br/>
            <article class='float-left'>
              <p>Here is a doughnut chart showing how your budget is being divided. 
                Hover over each section to see the category and the amound of money
                in your budget that you have reserved for that category.
              </p>
            </article><br/>
            <article id="chart1_container">
              <Doughnut reponsive={true} maintainAspectRatio={true} data={this.state.chart1}/>
            </article>
            <article class='float-left'>
              <p>Here is a bar graph showing each category in your budget, and the difference
                between how much you've reserved and how much you've spent. Its a good idea to
                analyze your spending habits so you know how to plan your budget!
              </p>
            </article><br/>
            <article id="chart2_container">
              <Bar reponsive={true} maintainAspectRatio={true} data={this.state.chart_data} options={{legend: {labels: ['', '']}}}/>
            </article>
            <article class='float-left'>
              <p>
                Here is a radar chart showing the amount of your budget that is going towards
                each category, versus the amound you've spent in each category. It can be useful
                to see where the majority of your money goes. 
              </p>
            </article>
            <article id="chart3_container">
              <Radar data={this.state.chart_data}/>
            </article>

            <button><Link to="/update">Update my Budget</Link></button>
        </article>
      );
    }else{
      return <Redirect to="/login"/>
    }
  }
}
export default Dashboard;
