import React from 'react';
import {Link} from 'react-router-dom';

function Menu() {
    return (
        <nav id="menu">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">My Dashboard</Link></li>
                <div className="right-aligned">
                <li><Link to="/logout">Log out</Link></li>
                </div>
            </ul>
        </nav>
    );
}
export default Menu;