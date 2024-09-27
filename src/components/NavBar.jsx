import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
    return(
        <nav>
            <Link to="/">home</Link>
            <Link to="/categories">categories</Link>
            <Link to="/login">login</Link>
            <Link to="/cart">cart</Link>
        </nav>
    )
}

export default Header