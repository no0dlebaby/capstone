import React from 'react'
import { Link} from 'react-router-dom'
import '../App.css'

const Header = ({loggedIn}) => {
    return (
        <div>
            <h1 className='logo'>cozy pet shop</h1>
        <nav>
            <Link className='home-button' to="/">Home</Link>
            <Link className='categories-button' to="/categories">Categories</Link>
            {loggedIn ? (
            <Link className='profile-button' to="/profile">Profile</Link>
            ) : (
            <Link className='profile-button' to="/login">Log in</Link>
            )}
            <Link className='cart-button' to="/cart">Cart</Link>
        </nav>
        </div>
    );
};

export default Header;
