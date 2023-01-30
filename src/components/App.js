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
    const [bestTime, setBestTime] = React.useState(
        () => JSON.parse(localStorage.getItem("bestTime")) || 0
    )

    React.useEffect(() => {
        const value = dice[0].value
        const winCheck = dice.every(die => die.isHeld && die.value === value)
        if(winCheck) {
            setTenzies(true)
            clearInterval(intervalId)
            setIntervalId(0)
            let time = minutes*100 + seconds
            if(time < bestTime){
                setBestTime(time)
            }
        }
    }, [dice])

    React.useEffect(() => {
        localStorage.setItem("bestTime", JSON.stringify(minutes*100 + seconds))
    }, [bestTime])

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
            if(!intervalId) {
                const interval = setInterval(() => {
                    getTime()
                }, 1000);
                setIntervalId(interval)
            }
        } else {
            setNumOfRolls(0)
            setTenzies(false)
            setDice(allNewDice())
            setSeconds(0)
            setMinutes(0)
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
            <div className="score">
                <p className="roll-count">Rolls : {numOfRolls}</p>
                <div className="time">
                    {minutes ? 
                    <p>Time : {minutes}m {seconds}s</p> : 
                    <p>Time : {seconds}s</p>}
                </div>
            </div>
            <div className="btn-best-time">
                <button className="roll-btn" onClick={roll}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <div>
                    {Math.floor(bestTime/100) > 0 ? 
                    <h4>Best Time : {Math.floor(bestTime/100)}m {bestTime%100}s</h4> : 
                    <h4>Best Time : {bestTime%100}s</h4>}
                </div>
            </div>
        </main>
    )
}