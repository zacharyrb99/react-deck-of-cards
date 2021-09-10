import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Card from './Card';
import './DeckOfCards.css'

const DeckOfCards = () => {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timer = useRef(null);

    const toggleAutoDraw = () => {
        setAutoDraw(bool => !bool);
    }

    const reShuffle = async () => {
        setDeck(null);
        setCards([]);
        let newDeck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        setDeck(newDeck.data);
        console.log(deck);
    }

    useEffect(() => {
        async function getDeckData(){
            let newDeck = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            console.log(newDeck.data);
            setDeck(newDeck.data);
        }

        getDeckData();
    }, [setDeck]);

    useEffect(() => {
        async function drawCard(){
            let {deck_id} = deck;

            let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw`);

            if(res.data.remaining === 0){
                alert('No cards left to draw!');
                reShuffle();
            }

            const card = res.data.cards[0];

            setCards(cards => [...cards, {id: card.code, image: card.image, value: `${card.value} of ${card.suit}`}]);
        }

        if(autoDraw && !timer.current){
            timer.current = setInterval(async() => await drawCard(), 1000);
        }

        return () => {
            clearInterval(timer.current);
            timer.current = null;
        }
    }, [autoDraw, setAutoDraw, deck]);

    return (
        <div className='DeckOfCards'>
            {deck ? (
                <button className='DeckOfCards-draw' onClick={toggleAutoDraw}>
                    {autoDraw ? "Stop Drawing Cards" : "Start Drawing Cards"}
                </button>
            ) : null}

            {cards ? (
                <button className='DeckOfCards-reshuffle' onClick={reShuffle}>
                    Shuffle New Deck
                </button>
            ) : null}

            <div className='DeckOfCards-cards'>
                {cards.map(card => <Card key={card.id} image={card.image} value={card.value} />)}
            </div>
        </div>
    )
}

export default DeckOfCards;