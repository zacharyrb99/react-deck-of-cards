import {useState} from 'react';
import './Card.css'

const Card = ({image, value}) => {
    const [{position, angle}] = useState({
        position: Math.random() * 30 - 15,
        angle: Math.random() * 45 - 22.5
    });

    return (
        <img 
            className='Card'
            src={image} 
            alt={value} 
            style={{
                transform: `translate(${position}px, ${position}px) rotate(${angle}deg)`
            }}
        />
    )
}

export default Card;