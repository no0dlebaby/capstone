import React, { useEffect, useState } from 'react';

const messages = [
    "free shipping for orders over $30!",
    "join our newsletter for a 10% discount!",
    "new products added monthly!",
];

const Banner = () => {
    const [currentMessage, setCurrentMessage] = useState(messages[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % messages.length);
            setCurrentMessage(messages[index]);
        }, 5000)

        return () => clearInterval(intervalId)
    }, [index]);

    return (
        <div className="banner">
            <p>{currentMessage}</p>
        </div>
    );
};

export default Banner;
