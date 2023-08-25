import Tag from './Tag';
import { Card, Tabs, theme } from 'antd';



const TagList = ({ tags, selectedTag, color, onSelect, title, gridStyle }) => {

    return <Card bodyStyle={{ padding: 5 }}>

        {tags.map((tag, index) =>
            <Tag 
            color={color}
            onSelect={onSelect} key={index}
            selectedTag={selectedTag} 
            tag={tag} 
            
             gridStyle={gridStyle} />
        )}

    </Card>


};

export default TagList;
