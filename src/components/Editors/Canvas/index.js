import { useRef, useEffect, useState, useCallback } from 'react';
import Ruler from '../Ruler';

// CanvasEditor component for editing canvas
function CanvasEditor({ windowWidth, setWindowWidth, children }) {

    const canvasRef = useRef();
    const [steps, setSteps] = useState([]);

    // Function to update window size
    const updateSize = useCallback(() => {
        const styles = getComputedStyle(canvasRef.current);
        setWindowWidth(parseInt(styles.width));
    }, [setWindowWidth]);

    // Effect to handle resize event
    useEffect(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas)
            return;

        currentCanvas.addEventListener('resize', updateSize);

        return () => {
            if (currentCanvas)
                currentCanvas.removeEventListener('resize', updateSize);
        }
    }, [canvasRef, updateSize]);

    // Function to calculate steps
    const calculateSteps = useCallback((width) => {
        const stepsArray = [];
        for (let i = 0; i < width; i = i + 50)
            stepsArray.push(i);
        setSteps(stepsArray);
    }, []);

    // Effect to handle window width change
    useEffect(() => {
        let width = windowWidth;
        if (width === '100%') {
            const styles = getComputedStyle(canvasRef.current);
            width = parseInt(styles.width) - 30;
        }
        calculateSteps(width);
    }, [windowWidth, calculateSteps]);

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

