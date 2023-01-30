import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [numOfRolls, setNumOfRolls] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)
    const [minutes, setMinutes] = React.useState(0)
    const [intervalId, setIntervalId] = React.useState(0)

    React.useEffect(() => {
        const value = dice[0].value
        const winCheck = dice.every(die => die.isHeld && die.value === value)
        if(winCheck) {
            setTenzies(true)
            clearInterval(intervalId)
            setIntervalId(0)
        }
    }, [dice])

    // React.useEffect(() => {
    //     const interval = setInterval(() => {
    //         getTime()
    //     }, 1000);
    //     setIntervalId(interval)
    // }, [])

    function getTime() {
        setSeconds(prevSec => {
            if(prevSec === 60) {
                setMinutes(prevMin => prevMin + 1)
                return 0
            } else {
                return prevSec + 1
            }
        })
    }

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
        if(!tenzies) {
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ?
                    die :
                    {value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()}
            }))
            setNumOfRolls(prevNum => prevNum + 1)
        } else {
            setNumOfRolls(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }

    function hold(id) {
        if(!intervalId) {
            const interval = setInterval(() => {
                getTime()
            }, 1000);
            setIntervalId(interval)
        }

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
            {tenzies && <Confetti recycle={false} numberOfPieces={200} />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <p className="roll-count">
                Number of Rolls : {numOfRolls} | Time : {minutes}m {seconds}s
            </p>
            <button className="roll-btn" onClick={roll}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}