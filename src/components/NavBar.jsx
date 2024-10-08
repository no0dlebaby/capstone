import React from 'react'
import { Link} from 'react-router-dom'
import '../App.css'

const Header = ({loggedIn}) => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/categories">Categories</Link>
            {loggedIn ? (
                    <Link to="/profile">Profile</Link>
            ) : (
                <Link to="/login">Log in</Link>
            )}
            <Link to="/cart">Cart</Link>
        </nav>
    );
};

export default Header;
