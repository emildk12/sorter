import './App.css'
import { useState } from 'react';

function App() {

    const size = {width: 50, height: 50};
    const startY = 100;
    const x = 800;
    const colors = ["white", "orange", "red", "chartreuse", "deepskyblue"];

    // states
    const [y, setY] = useState([startY, startY + 50, startY + 100, startY + 150, startY + 200]);
    const [adjustment, setAdjustment] = useState(0);
    const [grabbedSquare, setGrabbedSquare] = useState(0);
    const [click, setClick] = useState(false);
    const [pop, setPop] = useState([false, false, false, false, false]);

    function handlePointerDown(e, i) {
        e.target.setPointerCapture(e.targetId);
        setGrabbedSquare(i);
        // adjust y position of grabbed square so it dosen't pop around on pointer down
        setAdjustment(e.clientY - y[i]);
        // adjusting the pop array so squares above grabbed square is true
        const adjustPop = pop.map( (p, j) => {
            if (j != i && y[j] < y[i]) {
                return true;
            }
            return false;
        });
        setPop(adjustPop);
        setClick(true);
    }
    function handlePointerUp() {
        // litt bugga den her, bør kanskje lete gjennom y for å se om det finnes et tomrom, også gå inn i tomrommet
        setClick(false);
        const newY = [...y];
        const closestSquare = findClosestSquare(y[grabbedSquare]);
        // ensure grabbed square pops into place
        if (y[grabbedSquare] < y[closestSquare]) {
            newY[grabbedSquare] = y[closestSquare] - size.height;
            for(let i = 0; i < newY.length; i++) {
                if (i != grabbedSquare && newY[grabbedSquare] == newY[i]) {
                    console.log("WARNING 1!!!!");
                }
            }
        }
        else if (y[grabbedSquare] > y[closestSquare]){
            newY[grabbedSquare] = y[closestSquare] + size.height;
            for(let i = 0; i < newY.length; i++) {
                if (i != grabbedSquare && newY[grabbedSquare] == newY[i]) {
                    console.log("WARNING 2!!!!");
                }
            }
        }
        else {
            // possible edge case bug
            // må kanksje refaktorere handlemousemove inne i if click inn i en egen funksjon og gå gjennom den en siste gang her
            console.log("WARNING 3!!!!");
            
        }
        setY(newY);
        setPop(pop.map(() => false));
        console.log(closestSquare);
        for (let i = 0; i < y.length; i++) {
            for (let j = i + 1; j < y.length; j++) {
                if (y[i] == y[j]) {
                    console.log("ERROR: " + grabbedSquare + " ldkwlkdw" + newY);
                    return;
                }
            }
        }
    }
    
    function handleMouseMove(e) {
        if(click) {
            const newY = [...y];
            newY[grabbedSquare] = e.clientY - adjustment;
            for(let i = 0; i < y.length; i++) {
                if (i != grabbedSquare) {
                    if (y[grabbedSquare] - 10 < y[i] && pop[i]) {
                        newY[i] = y[i] + size.height;
                        doPop(i);
                    }
                    else if (y[grabbedSquare] + 10 > y[i] && !pop[i]) {
                        newY[i] = y[i] - size.height;
                        doPop(i);
                    }
                }
            }
            setY(newY);
        }
    }
    function doPop(i) {
        const newPop = [...pop];
        newPop[i] = !newPop[i];
        setPop(newPop);
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

    const squares = y.map((yCoordinate, i) => {
        return (
            <div key={i}
                style={{
                    background: colors[i%colors.length],
                    color: 'black',
                    position: 'absolute',
                    cursor: 'grab',
                    left: x, 
                    top: yCoordinate,
                    width: size.width,
                    height: size.height,
                    userSelect: 'none'
                }}
                onMouseMove={handleMouseMove}
                onPointerDown={e => {
                    handlePointerDown(e, i);
                }}
                onPointerUp={handlePointerUp}
            >
                {i}
            </div>
        );
    });
    function handleButtonClick() {
        setY([...y, startY + size.height*y.length]);
        setPop([...pop, false]);
    }

    return (
        <>  
            <button onClick={handleButtonClick}>Add Square</button>
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
            />   */}
        </>
    );
}

export default App