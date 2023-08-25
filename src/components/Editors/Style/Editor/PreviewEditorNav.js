import React, {  } from 'react';

import { EditorStyleNav } from '../../../Nav';

export default function PreviewEditorNav({
   undoStyle,
   redoStyle,
   windowWidth,
   minMax, setMinMax,
   orientation, setOrientation,
   setWindowWidth,
   LeftTools,
   RightTools }) {



   return <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center', paddingRight: 20
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


   </div>





}

