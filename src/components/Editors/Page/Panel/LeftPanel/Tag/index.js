
import Tags from './Tags';

export function TagComponent({gridStyle, 
    HtmlConvertComponent,
    onSelect, tag, width}) {

    return <><Tags 
    gridStyle={gridStyle} 
    tag={tag} 
    HtmlConvertComponent={HtmlConvertComponent}
    onSelect={onSelect} 
    width={width}/></>
   
};

