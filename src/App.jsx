import './App.css'
import { useState } from 'react';

function App() {

    const size = {width: 50, height: 50};
    const x = 300;
    const colors = ["white", "orange", "red", "chartreuse", "deepskyblue"];

    // states
    const [y, setY] = useState([200, 250, 300, 350, 400]);
    const [adjustment, setAdjustment] = useState(0);
    const [grabbedSquare, setGrabbedSquare] = useState(0);
    const [click, setClick] = useState(false);
    // index of closest square
    const [closestSquare, setClosestSquare] = useState(0);

    function handlePointerDown(e, i) {
        e.target.setPointerCapture(e.targetId);
        setGrabbedSquare(i);
        // adjust y position of grabbed square so it dosen't pop around on pointer down
        setAdjustment(e.clientY - y[i]);
        setClosestSquare(findClosestSquare(y[i]));
        setClick(true);
    }
    function handlePointerUp() {
        setClick(false);
        // ensure grabbed square pops into place
        if (y[grabbedSquare] < y[closestSquare]) {
            const newY = [...y];
            newY[grabbedSquare] = y[closestSquare] - size.height;
            setY(newY);
        }
        else if (y[grabbedSquare] > y[closestSquare]){
            const newY = [...y];
            newY[grabbedSquare] = y[closestSquare] + size.height;
            setY(newY);
        }    
    }
    
    function handleMouseMove(e) {
        if(click) {
            const newY = [...y];
            newY[grabbedSquare] = e.clientY - adjustment;
            setY(newY);
            const closestIndex = findClosestSquare(newY[grabbedSquare]);
            setClosestSquare(closestIndex);
            if (Math.abs(newY[closestIndex] - newY[grabbedSquare]) < 15) {
                if (newY[closestIndex] > newY[grabbedSquare]) {
                    // grabbed is moving down -> pop up
                    const newerY = [...newY];
                    newerY[closestIndex] = newY[closestIndex] - size.height;
                    setY(newerY);
                }
                else {
                    // pop down
                    const newerY = [...newY];
                    newerY[closestIndex] = newY[closestIndex] + size.height;
                    setY(newerY);
                }
            }
        }
    }
    function findClosestSquare(yCoodinate) {
        let closestIndex = 0;
        let j = 1;
        if (closestIndex == grabbedSquare) {
            closestIndex++;
            j++;
        }
        if(Math.abs(y[closestIndex] - yCoodinate) < 25) {
            return closestIndex;
        }
        for(; j < y.length; j++) {
            if(Math.abs(y[j] - yCoodinate) < 25 && j != grabbedSquare) {
                return j;
            }
            if (Math.abs(y[j] - yCoodinate) < Math.abs(y[closestIndex] - yCoodinate) && j != grabbedSquare) {
                closestIndex = j;
            }
        }
        return closestIndex;
    }

    const squares = colors.map((color, i) => {
        return (
            <div key={i}
                style={{
                    background: color,
                    position: 'absolute',
                    cursor: 'grab',
                    left:x, 
                    top:y[i],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, i);
                }}
                onPointerUp={handlePointerUp}
            />
        );
    });

    return (
        <>
            {squares}
            {/* <div
                key={0}
                style={{
                    background: "white",
                    position: 'absolute',
                    left:x, 
                    top:y[0],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, 0);
                }}
                onPointerUp={handlePointerUp}
            />
            <div
                key={1}
                style={{
                    background: "orange",
                    position: 'absolute',
                    left:x, 
                    top:y[1],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, 1);
                }}
                onPointerUp={handlePointerUp}
            />
            <div
                key={2}
                style={{
                    background: "red",
                    position: 'absolute',
                    left:x, 
                    top:y[2],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, 2);
                }}
                onPointerUp={handlePointerUp}
            />
            <div
                key={3}
                style={{
                    background: "chartreuse",
                    position: 'absolute',
                    left:x, 
                    top:y[3],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, 3);
                }}
                onPointerUp={handlePointerUp}
            />
            <div
                key={4}
                style={{
                    background: "deepskyblue",
                    position: 'absolute',
                    left:x, 
                    top:y[4],
                    width: size.width,
                    height: size.height
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, 4);
                }}
                onPointerUp={handlePointerUp}
            /> */}
        </>
    );
}

export default App