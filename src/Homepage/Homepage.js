import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

export default class HomePage extends Component {

    state = {
        labels: [
            "Dining",
            "Rent/Mortgage",
            "Groceries",
            "Pharmacy",
            "Entertainment"
        ],
        datasets: [{
            data: [ 40, 300, 200, 35, 50 ],
            backgroundColor: [
                '#CDB4DB',
                '#FFC8DD',
                '#FFAFCC',
                '#BDE0FE',
                '#A2D2FF'
            ]
        }]
    }

    getBudget() {
        return this.state;
    }

    render() {
        return (
        <main className="center" id="main">
            <div className="page-area">
                <article>
                    <h1>Stay on track</h1>
                    <p>
                        Do you know where you are spending your money? If you really stop to track it down,
                        you would get surprised! Proper budget management depends on real data... and this
                        app will help you with that!
                    </p>
                </article>

                <article>
                    <h1>Alerts</h1>
                    <p>
                        What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                    </p>
                </article>

                <article>
                    <h1>Results</h1>
                    <p>
                        People who stick to a financial plan, budgeting every expense, get out of debt faster!
                        Also, they to live happier lives... since they expend without guilt or fear...
                        because they know it is all good and accounted for.
                    </p>
                </article>

                <article>
                    <h1>Free</h1>
                    <p>
                        This app is free!!! And you are the only one holding your data!
                    </p>
                </article>

                <article>
                    <h1>Stay on track</h1>
                    <p>
                        Do you know where you are spending your money? If you really stop to track it down,
                        you would get surprised! Proper budget management depends on real data... and this
                        app will help you with that!
                    </p>
                </article>

                <article>
                    <h1>Alerts</h1>
                    <p>
                        What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                    </p>
                </article>

                <article>
                    <h1>Results</h1>
                    <p>
                        People who stick to a financial plan, budgeting every expense, get out of debt faster!
                        Also, they to live happier lives... since they expend without guilt or fear...
                        because they know it is all good and accounted for.
                    </p>
                </article>

                <article>
                    <h1>Example Chart</h1>
                    <p>
                        <Pie data={this.state} width={400} height={400}/>
                    </p>
                </article>
            </div>
        </main>
    );
    }
}