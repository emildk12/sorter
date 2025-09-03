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
    function handlePointerUp(e) {

        if (click) {
            const lastY = moveSquare(e);
            const newY = [...lastY];
            // ensure grabbed square pops into place
            const emptySpace = lastY.map(() => true);
            let i = 0;
            for(; i < lastY.length; i++) {
                if(i != grabbedSquare) {
                    emptySpace[(lastY[i] - startY)/size.height] = false; 
                }
            }
            for(i = 0; !emptySpace[i]; i++);
            newY[grabbedSquare] = size.height*i + startY;

            setY(newY);
            setPop(pop.map(() => false));
            setClick(false);
        }
    }
    
    function handleMouseMove(e) {
        if(click) {
            const newY = moveSquare(e);
            setY(newY);
        }
    }
    function moveSquare(e) {

            const newY = [...y];
            const newPop = [...pop];
            newY[grabbedSquare] = e.clientY - adjustment;
            for(let i = 0; i < y.length; i++) {
                if (i != grabbedSquare) {
                    if (newY[grabbedSquare] - 10 < newY[i] && pop[i]) {
                        newY[i] = newY[i] + size.height;
                        newPop[i] = !newPop[i];
                    }
                    else if (newY[grabbedSquare] + 10 > newY[i] && !pop[i]) {
                        newY[i] = newY[i] - size.height;
                        newPop[i] = !newPop[i];
                    }
                }
            }
            setPop(newPop);
            return newY;
    }
    // making the squares
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
        </>
    );
}

export default App