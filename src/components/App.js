import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())

    function allNewDice() {
        const newDice = []
        for(let i = 0; i < 10; i++) {
            newDice.push({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            })
        }
        return newDice 
    }

    function roll() {
        setDice(prevDice => prevDice.map(die => {
            return !die.isHeld ?
                {value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()} :
                die
        }))
    }

    function hold(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => hold(die.id)} />
    ))

    return (
        <main>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-btn" onClick={roll}>
                Roll
            </button>
        </main>
    )
}