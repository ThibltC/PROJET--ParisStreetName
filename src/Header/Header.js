import React from 'react';
import './Header.css';
import logo from '../logo.svg';



const Header = () => {

    return (
        <header className="Header">
            <img src={logo} className="Header-logo" alt="logo" />
        </header>
    );
}


export default Header;
