import { useRef, useEffect, useState } from 'react';
import Ruler from '../Ruler';

function CanvasEditor({ windowWidth, setWindowWidth, children }) {

    const canvasRef = useRef();

    const [steps, setSteps] = useState([]);

    function updateSize() {
        const styles = getComputedStyle(canvasRef.current);
        setWindowWidth(parseInt(styles.width));
    }

    useEffect(() => {

        if (!canvasRef.current)
            return;

        canvasRef.current.addEventListener('resize', updateSize);

        return () => {

            if (canvasRef.current)
                canvasRef.current.removeEventListener('resize', updateSize);
        }
    }, [canvasRef.current])





    useEffect(() => {

        let width = windowWidth;
        if (width == '100%') {
            const styles = getComputedStyle(canvasRef.current);
            width = parseInt(styles.width) - 30;
        }
        const stepsArray = [];
        for (let i = 0; i < width; i = i + 50)
            stepsArray.push(i);
        setSteps(stepsArray);


    }, [windowWidth])

    return (
        <>

            <div ref={canvasRef} style={{ overflow: "hidden", width: windowWidth, background: '#fff', height: '100%', margin: 'auto', position: 'relative' }}>
                <Ruler steps={steps} />
                <div style={{ height: 24, pointerEvents: 'none', background: 'white' }}></div>
                {children}

            </div>
        </>
    );


}

export default CanvasEditor;

