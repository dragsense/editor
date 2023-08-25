import React, { useEffect, useState } from "react";

import { Cascader, Select, Input, Checkbox } from "antd";

const { Option } = Select;




export default function Columns({ onSelect, setCols }) {

const [active, setActive] = useState(0);

    const onMouseEnter = (e) => {
        e.preventDefault();

       // e.currentTarget.style.borderStyle = 'solid';
    }


    const onMouseLeave = (e) => {
        e.preventDefault();


      //  e.currentTarget.style.borderStyle = 'dashed';
    }

    const onMouseDoubleClick = (cols) => {
       
        // for(let i = 0; i < cols.count; i++){
        // onSelect({tag: 'div', type: 'layout', layout:"fg-child", width: cols.widths[i]})
        // }

        setCols(cols);
    }




    return <div className="wrapper">


        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
                display: 'flex',
                cursor: 'pointer',
                padding: 5,
                margin: 5,
                border: active == 1 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 40,
                height: 40
            }}
            onClick={(e) => {e.preventDefault(); setActive(1); onMouseDoubleClick({count: 1, widths: ['100%']})}}
            >
                <div style={{ width: '100%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div>
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
                display: 'flex',
                cursor: 'pointer',
                padding: 5,
                margin: 5,
                border: active == 2 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 80,
                height: 40
            }}
            onClick={(e) => {e.preventDefault(); setActive(2);  onMouseDoubleClick({count: 2, widths: ['50%', '50%']});}}
            >
                <div style={{ width: '50%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div><div style={{ width: 3 }}></div>
                <div style={{ width: '50%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>2</div>
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
                display: 'flex',
                cursor: 'pointer',
                padding: 5,
                margin: 5,
                border: active == 3 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 100,
                height: 40
            }}
            onClick={(e) => {e.preventDefault(); setActive(3);  onMouseDoubleClick({count: 2, widths: ['30%', '70%']});}}
            >
                <div style={{ width: '30%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1/3</div><div style={{ width: 3 }}></div>
                <div style={{ width: '70%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div>
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{
                display: 'flex',
                cursor: 'pointer',
                padding: 5,
                margin: 5,
                border: active == 4 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 100,
                height: 40
            }}
            onClick={(e) => {e.preventDefault(); setActive(4);  onMouseDoubleClick({count: 2, widths: ['70%', '30%']});}}
            >
                <div style={{ width: '70%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div><div style={{ width: 3 }}></div>
                <div style={{ width: '30%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1/3</div>
            </div>

           

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ 
                display: 'flex', 
                cursor: 'pointer', 
                padding: 5, 
                margin: 5, 
                border: active == 5 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 120,
                height: 40 }}
                onClick={(e) => {e.preventDefault(); setActive(5); onMouseDoubleClick({count: 3, widths: ['33.33%', '33.33%', '33.33%']});}}
                >
                <div style={{ width: '33.33%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div><div style={{ width: 3 }}></div>
                <div style={{ width: '33.33%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>2</div><div style={{ width: 3 }}></div>
                <div style={{ width: '33.33%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>3</div>
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ 
                display: 'flex', 
                cursor: 'pointer', 
                padding: 5, 
                margin: 5, 
                border: active == 6 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                width: 120,
                height: 40 }}
                onClick={(e) => {e.preventDefault(); setActive(6);  onMouseDoubleClick({count: 3, widths: ['30%', '40%', '30%']});}}
                >
                <div style={{ width: '30%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1/3</div><div style={{ width: 3 }}></div>
                <div style={{ width: '40%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div><div style={{ width: 3 }}></div>
                <div style={{ width: '30%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1/3</div>
            </div>


            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ 
                display: 'flex', 
                cursor: 'pointer', 
                padding: 5,
                 margin: 5, 
                 border: active == 7 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                 width: 160,
                 height: 40 }}
                 onClick={(e) => {e.preventDefault(); setActive(7);  onMouseDoubleClick({count: 4, widths: ['25%', '25%', '25%','25%']});}}
                 >
                <div style={{ width: '25%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '25%', height: '100%', backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>2</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '25%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>3</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '25%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>4</div> <div style={{ width: 3 }}></div>
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ 
                display: 'flex', 
                cursor: 'pointer', 
                padding: 5,
                 margin: 5, 
                 border: active == 8 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                 width: 200,
                 height: 40 }}
                 onClick={(e) => {e.preventDefault();  setActive(8);  onMouseDoubleClick({count: 5, widths: ['20%', '20%', '20%','20%' , '20%']});}}
                 >
                <div style={{ width: '20%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '20%', height: '100%', backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>2</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '20%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>3</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '20%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>4</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '20%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>5</div> 
            </div>

            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{ 
                display: 'flex', 
                cursor: 'pointer', 
                padding: 5,
                 margin: 5, 
                 border: active == 9 ? '1.5px solid rgb(248, 138, 36)' : '1px dashed rgb(248, 138, 36)',
                 width: 240,
                 height: 40 }}
                 onClick={(e) => {e.preventDefault();  setActive(9);  onMouseDoubleClick({count: 6, widths: ['16.66%', '16.66%', '16.66%','16.66%' , '16.66%']});}}
                 >
                <div style={{ width: '16.66%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>1</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '16.66%', height: '100%', backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>2</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '16.66%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>3</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '16.66%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>4</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '16.66%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>5</div> <div style={{ width: 3 }}></div>
                <div style={{ width: '16.66%', height: '100%',  backgroundColor: 'rgb(47, 193, 255)', textAlign: 'center', color: '#fff' }}>6</div> 
            </div>



        </div>

    </div>


}

