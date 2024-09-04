
import Tags from './Tags';

export function TagComponent({gridStyle, 
    HtmlConvertComponent, setSelectedTagType = () => {},
    onSelect, tag, width}) {

    return <><Tags 
    gridStyle={gridStyle} 
    tag={tag} 
    setSelectedTagType={setSelectedTagType}
    HtmlConvertComponent={HtmlConvertComponent}
    onSelect={onSelect} 
    width={width}/></>
   
};

