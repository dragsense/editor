import { Button, Space, Tooltip } from "antd";
import { useState, useEffect } from "react";

import {
    MdTextFields,
    MdCropSquare,
    MdSelectAll,
    MdGradient,
    MdOutlineBorderOuter,
    MdOutlineFlipToFront,
    MdViewQuilt, MdRestartAlt, MdNat, MdList
} from 'react-icons/md';

import Typography from "@/components/Dashboard/Styling/Style/Typography";
import Background from "@/components/Dashboard/Styling/Style/Background";
import Size from "@/components/Dashboard/Styling/Style/Size";
import Spacing from "@/components/Dashboard/Styling/Style/Spacing";
import Position from "@/components/Dashboard/Styling/Style/Position";
import Border from "@/components/Dashboard/Styling/Style/Border";
import Other from "@/components/Dashboard/Styling/Style/Other";
import Display from "@/components/Dashboard/Styling/Style/Display";
import Transform from "@/components/Dashboard/Styling/Style/Transform";
import List from "@/components/Dashboard/Styling/Style/List";


import SwitchComponents from "@/components/Panel";

import { useNodeStates, useCssNodeStates } from "@/components/Editor/PageProvider";


export default function MainStyle({selected, active}) {

    const {selector} = useCssNodeStates();
    const { setUState, node } = useNodeStates();
   

    const [avtiveTab, setActiveTab] = useState('');
    const [style, setStyle] = useState(null);
    const [uStyle, _setUStyle] = useState(null);



    useEffect( () => {

        if (!selector) {
            setStyle(null);
            return;
        }


        setStyle(selector.style);


    }, [selector]);

    useEffect( () => {

        if (!selected) {
            return;
        }

        setActiveTab(selected.active);


    }, [selected]);


      const setUStyle = (style, name, value, priority) => {
      
        setUState({fun: () => {
            style.setProperty(name, value, priority);
        }})
      } 


    return selected ? <div>

        <Space wrap="true" style={{ paddingBottom: 10 }} >

      
           
        {selected.t && <Tooltip placement="top" title="Typeography">
                <Button
                    icon={<MdTextFields size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('1') }}
                    className={`ac-tabs-btn ${avtiveTab === '1' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>}
            {selected.s && <Tooltip placement="top" title="Size">
                <Button
                    icon={<MdCropSquare size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('2') }}
                    className={`ac-tabs-btn ${avtiveTab === '2' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>}
             {selected.sp && <Tooltip placement="top" title="Spacing">
                <Button
                    icon={<MdSelectAll size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('3') }}
                    className={`ac-tabs-btn ${avtiveTab === '3' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>}
            {selected.bg &&  <Tooltip placement="top" title="Background">
                <Button
                    icon={<MdGradient size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('4') }}
                    className={`ac-tabs-btn ${avtiveTab === '4' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>}
            {selected.b && <Tooltip placement="top" title="Border">
                <Button
                    icon={<MdOutlineBorderOuter size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('5') }}
                    className={`ac-tabs-btn ${avtiveTab === '5' ? 'active' : ''}`}
                > </Button>
            </Tooltip>}
            {selected.p && <Tooltip placement="top" title="Position">
                <Button
                    icon={<MdOutlineFlipToFront size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('6') }}
                    className={`ac-tabs-btn ${avtiveTab === '6' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>}
            {selected.d &&  <Tooltip placement="top" title="Display">
                <Button
                    icon={<MdViewQuilt size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('7') }}
                    className={`ac-tabs-btn ${avtiveTab === '7' ? 'active' : ''}`}
                >   </Button>
            </Tooltip>}

            {selected.tr &&  <Tooltip placement="top" title="Transform">
                <Button
                    icon={<MdNat size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('8') }}
                    className={`ac-tabs-btn ${avtiveTab === '8' ? 'active' : ''}`}
                >   </Button>
            </Tooltip>}

            {selected.l &&  <Tooltip placement="top" title="List">
                <Button
                    icon={<MdList size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('9') }}
                    className={`ac-tabs-btn ${avtiveTab === '9' ? 'active' : ''}`}
                >   </Button>
            </Tooltip>}

            {selected.m &&  <Tooltip placement="top" title="Shadows, Transition, Animation">
                <Button

                    onClick={(e) => { e.preventDefault(); setActiveTab('10') }}
                    className={`ac-tabs-btn ${avtiveTab === '10' ? 'active' : ''}`}
                > Misc </Button>
            </Tooltip>}
        




        </Space>

        <div className="wrapper" style={{ height: 500, overflow: 'auto' }}>
      
        <SwitchComponents active={avtiveTab}>
                <Typography style={style} index="1"  setUStyle={setUStyle} />
                <Size style={style} index="2"  setUStyle={setUStyle} />
                <Spacing style={style} index="3"  setUStyle={setUStyle} />
                <Background style={style} selector={selector}  setUStyle={setUStyle} index="4" />
                <Border style={style} selector={selector}  setUStyle={setUStyle} index="5" />
                <Position style={style} index="6"   setUStyle={setUStyle}/>
                <Display style={style} selector={selector}  setUStyle={setUStyle} index="7" isParentFlex={node?.parent.layout == 'flex'} isParentGrid={node?.parent.layout == 'grid'} />
                <Transform style={style} index="8"  setUStyle={setUStyle} />
                <List style={style} index="9"  setUStyle={setUStyle} />

                <Other style={style} selector={selector} uStyle={style} setUStyle={setUStyle} index="10" />
            </SwitchComponents>

        </div>


    </div> : <></>
}

