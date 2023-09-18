// Importing necessary libraries and components
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Tooltip, theme, Modal } from "antd";
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FixedSizeGrid as Grid } from 'react-window';
import { AiOutlineCheckCircle } from 'react-icons/ai';

// Destructuring necessary components from libraries
const { Meta } = Card;
const { confirm } = Modal;

// Defining constants for card and column width
const ICON_CARD_WIDTH = 180;
const MIN_COLUMN_WIDTH = 190;

// Main function for handling icons list
const IconsList = ({ icons, onEdit, onDelete, editor = false }) => {

    // Extracting colorPrimary from theme
    const { token: { colorPrimary } } = theme.useToken();

    // Function to handle drag start event
    const onDragStart = useCallback((e, icon) => {
        // Splitting icon classes into an array and mapping to an object
        const iconClasses = icon.classes.split(" ").map(className => ({ name: className }));

        // If editor is true, set data for drag event
        if (editor) {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                tag: 'i', type: 'icons',
                layout: icon.classes ? 'icon' : 'svg-icon',
                nodeValue: icon.svg,
                classes: icon.classes ? iconClasses : {}
            }));
        }

    }, []);

    // Initializing state and ref
    const containerRef = useRef(null);
    const [newCols, setNewCols] = useState(1);
    const [newHeight, setHeight] = useState(0);

    // Effect to handle window resize event
    useEffect(() => {
        const updateCols = () => {
            if (containerRef.current) {
                const style = window.getComputedStyle(containerRef.current)
                const containerWidth = parseFloat(style.width);

                const maxColumns = Math.floor(containerWidth / MIN_COLUMN_WIDTH);
                const updatedCols = Math.max(maxColumns, 1);
                if (newCols !== updatedCols) {
                    setNewCols(updatedCols);
                }
                setHeight(parseFloat(style.height))
            }
        };
        updateCols();
        window.addEventListener('resize', updateCols);
        return () => {
            window.removeEventListener('resize', updateCols);
        };
    }, [newCols]);

    // Function to render icon
    const renderIcon = (icon) => {
        return icon?.svg ? (
            <div className="icons-svg" style={{ textAlign: 'center', height: '100%', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: icon.svg }} />
        ) : (
            <AiOutlineCheckCircle style={{ fontSize: 48 }} />
        );
    };

    // Function to render card actions
    const renderCardActions = (icon) => {
        return [
            <Tooltip title="Edit">
                <EditOutlined
                    className="ac-icon2"
                    size="2em"
                    key="edit"
                    style={{ fontSize: 20 }}
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit({ ...icon });
                    }}
                />
            </Tooltip>,
            <Tooltip title="Delete">
                <DeleteOutlined
                    className="ac-icon2"
                    size="2em"
                    key="delete"
                    onClick={(e) => {
                        e.preventDefault();
                        confirm({
                            title: 'Are you sure delete this item?',
                            icon: <ExclamationCircleFilled />,
                            okText: 'Yes',
                            okType: 'danger',
                            cancelText: 'No',
                            onOk() {
                                onDelete(icon._uid);
                            },
                        });
                    }}
                />
            </Tooltip>
        ];
    };

    // Function to render grid cell
    const GridCell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * newCols + columnIndex;
        const icon = icons[index];

        if (!icon) return null;

        return (
            <div style={{ ...style, overflow: 'hidden', width: ICON_CARD_WIDTH - 5, height: style.height }}>
                <Card
                    key={icon._id}
                    className="actions-item-card"
                    style={{ width: 'calc(100% - 10px)', height: 130 }} cover={
                        <div
                            draggable={true}
                            onDragStart={e => onDragStart(e, icon)}
                            style={{ padding: 10, textAlign: 'center', height: 80 }}
                        >
                            {renderIcon(icon)}
                        </div>
                    }
                    actions={renderCardActions(icon)}
                    hoverable
                >
                    <Meta title={icon.name} description={<></>} />
                </Card>
            </div>
        );
    };

    // Render function
    return (
        <div ref={containerRef} style={{ width: '100%', height: "63vh", overflow: 'hidden' }} id="icons-container">
            <Grid
                columnCount={newCols}
                columnWidth={ICON_CARD_WIDTH}
                height={newHeight}
                rowCount={Math.ceil(icons.length / newCols)}
                rowHeight={180}
                width={newCols * ICON_CARD_WIDTH - 1}
            >
                {GridCell}
            </Grid>
        </div>
    );
};

// Exporting IconsList as default
export default IconsList;