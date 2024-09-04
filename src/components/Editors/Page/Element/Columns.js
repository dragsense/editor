import React, { useEffect, useState } from "react";
import { Cascader, Select, Input, Checkbox } from "antd";
const { Option } = Select;

// Function to handle mouse enter event
const onMouseEnter = (e) => {
    e.preventDefault();
}

// Function to handle mouse leave event
const onMouseLeave = (e) => {
    e.preventDefault();
}

// Function to handle double click event
const onMouseDoubleClick = (setCols, cols) => {
    setCols(cols);
}

// Function to render column
const renderColumn = (active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, count, widths) => {
    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
            display: 'flex',
            cursor: 'pointer',
            padding: 5,
            margin: 5,
            border: active == count ? '3px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
            width: count * 40,
            height: 40
        }}
        onClick={(e) => {e.preventDefault(); setActive(count); onMouseDoubleClick(setCols, {count: count, widths: widths})}}
        >
            {widths.map((width, index) => (
                <div key={index} style={{ width: width, height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>{index + 1}</div>
            ))}
        </div>
    );
}

export default function Columns({ onSelect, setCols }) {
    const [active, setActive] = useState(0);

    return (
        <div className="wrapper">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 1, ['100%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 2, ['50%', '50%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 3, ['30%', '70%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 4, ['70%', '30%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 5, ['33.33%', '33.33%', '33.33%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 6, ['30%', '40%', '30%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 7, ['25%', '25%', '25%','25%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 8, ['20%', '20%', '20%','20%' , '20%'])}
                {renderColumn(active, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 9, ['16.66%', '16.66%', '16.66%','16.66%' , '16.66%'])}
            </div>
        </div>
    );
}
