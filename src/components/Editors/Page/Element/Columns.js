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
const renderColumn = (active, index, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, count, widths) => {
    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
            display: 'flex',
            cursor: 'pointer',
            padding: 5,
            margin: 5,
            border: active == index ? '3px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
            width: count * 40,
            height: 40
        }}
        onClick={(e) => {e.preventDefault(); setActive(index); onMouseDoubleClick(setCols, {count: count, widths: widths})}}
        >
            {widths.map((width, index) => (
                <div key={index} style={{ width: width, height: '100%', border: '1px solid white',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>{index + 1}</div>
            ))}
        </div>
    );
}

export default function Columns({ onSelect, setCols }) {
    const [active, setActive] = useState(0);

    return (
        <div className="wrapper">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {renderColumn(active, 1, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 1, ['100%'])}
                {renderColumn(active, 2, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 2, ['50%', '50%'])}
                {renderColumn(active, 3, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 2, ['30%', '70%'])}
                {renderColumn(active, 4, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 2, ['70%', '30%'])}
                {renderColumn(active, 5, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 3, ['33.33%', '33.33%', '33.33%'])}
                {renderColumn(active, 6, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 3, ['30%', '40%', '30%'])}
                {renderColumn(active, 7, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 4, ['25%', '25%', '25%','25%'])}
                {renderColumn(active, 8, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 5, ['20%', '20%', '20%','20%' , '20%'])}
                {renderColumn(active, 9, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 6, ['16.66%', '16.66%', '16.66%','16.66%' , '16.66%', '16.66%'])}
                {renderColumn(active, 10, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 8, ['12.5%', '12.5%', '12.5%','12.5%' , '12.5%', '12.5%', '12.5%', '12.5%'])}
                {renderColumn(active, 11, setActive, setCols, onMouseEnter, onMouseLeave, onMouseDoubleClick, 12, ['8.33%', '8.33%', '8.33%','8.33%' , '8.33%', '8.33%', '8.33%', '8.33%', '8.33%','8.33%' , '8.33%', '8.33%'])}
            </div>
        </div>
    );
}
