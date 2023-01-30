import React from "react";

export default function Die(props) {
    
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    function numberOfDots(value) {
        const dotsElements = []
        for(let i = 0; i < value; i++) {
            dotsElements.push(
                <span className="pip"></span>
            )
        }
        return dotsElements
    }

    return (
        <div className="die-face" style={styles} onClick={props.holdDice}>
            {numberOfDots(props.value)}
        </div>
    )
}