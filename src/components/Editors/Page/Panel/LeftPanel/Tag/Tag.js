


import { Card, theme } from 'antd';
import { useMemo } from 'react';
import { usePageStates } from "../../../PageProvider";

function Item({ tag, selectedTag, color, onSelect, children, gridStyle }) {

  const {
    token: { colorText, colorBgBase, },
  } = theme.useToken();


  const onSelectItem = (e) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(tag);
    }
  };

  const onDragStart = (e) => {

    e.dataTransfer.setData('text/plain', JSON.stringify(tag));
  };



  const render = useMemo(() => {
    return (
      <Card.Grid columns={1} onClick={onSelectItem}
        draggable={true}

        onDragStart={onDragStart}
        style={{ width: '100%', color: colorText, backgroundColor: colorBgBase, ...(selectedTag === tag ? { border: `1px solid ${color}` } : {}), cursor: 'grabbing' }}>
        <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: tag.html ? tag.html : tag.tag }} />
      </Card.Grid>
    );
  }, [selectedTag, colorBgBase]);

  return render;
}

export default Item;