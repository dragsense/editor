import React from 'react';
import { EditorStyleNav } from '../../../Nav';

// This component is responsible for rendering the navigation bar of the editor
// It receives several props related to the editor's state and actions
export default function PreviewEditorNav({
   undoStyle,
   redoStyle,
   windowWidth,
   minMax, setMinMax,
   orientation, setOrientation,
   setWindowWidth,
   LeftTools,
   RightTools }) {

   // Render the navigation bar with a flex layout
   // The LeftTools and EditorStyleNav components are placed at the ends of the bar
   // EditorStyleNav receives all the props to manage the editor's state
   return (
      <div style={{
         display: 'flex',
         justifyContent: 'space-between',
         width: '100%',
         alignItems: 'center', 
         paddingRight: 20
      }}>

         <LeftTools />

         <EditorStyleNav
            undo={undoStyle}
            redo={redoStyle}
            windowWidth={windowWidth}
            minMax={minMax}
            setMinMax={setMinMax}
            orientation={orientation}
            setOrientation={setOrientation}
            setWindowWidth={setWindowWidth} />
            <RightTools />

      </div>
   );
}
