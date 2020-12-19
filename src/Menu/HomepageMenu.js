import React from 'react';
import {Link} from 'react-router-dom';
import Menu from './Menu';

function HomepageMenu() {
    const token = localStorage.getItem("jwt");
    if(token){
        return (<Menu/>);
    }else{
        return (
            <nav id="menu">
            <ul>
                <div className="right-aligned">
                <li><Link to="/login">Log in</Link></li>
                </div>
            </ul>
        </nav>
        );
    }
}
export default HomepageMenu;