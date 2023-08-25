import ThemeServices from '../../../../lib/services/theme';
import { Slider, InputNumber, Select, Input, Checkbox, Tooltip, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { MdRestartAlt } from 'react-icons/md';
const { Option } = Select;
const { TextArea } = Input;

const easingOptions = [
    { value: "linear", label: "Linear" },
    { value: "ease", label: "Ease" },
    { value: "ease-in", label: "Ease In" },
    { value: "ease-out", label: "Ease Out" },
    { value: "ease-in-out", label: "Ease In Out" },
];

const animationNames = [

    { value: "slideindown", label: "SlideInDown" },
    { value: "slideinup", label: "SlideInUp" },
    { value: "slideinleft", label: "SlideInLeft" },
    { value: "slideinright", label: "SlideInRight" },
    { value: "bouncein", label: "BounceIn" },
    { value: "bounceinup", label: "BounceInUp" },
    { value: "bounceindown", label: "BounceInDown" },
    { value: "bounceinleft", label: "BounceInLeft" },
    { value: "bounceinright", label: "BounceInRight" },
    { value: "zoomin", label: "ZoomIn" },
    { value: "zoominup", label: "ZoomInUp" },
    { value: "zoomindown", label: "ZoomInDown" },
    { value: "zoominleft", label: "ZoomInLeft" },
    { value: "zoominright", label: "ZoomInRight" },
    { value: "flipin", label: "FlipIn" },
    { value: "flipiny", label: "FlipInY" },
    { value: "flipinx", label: "FlipInX" },
    { value: "lightin", label: "LightIn" },
    { value: "rollin", label: "RollIn" },
    { value: "rotatein", label: "RotateIn" },
    { value: "swirlin", label: "SwirlIn" },
    { value: "tiltin", label: "TiltIn" },
    { value: "blurin", label: "BlurIn" },
    { value: "flickerin", label: "FlickerIn" },
    { value: "shake", label: "Shake" },
    { value: "tada", label: "Tada" },
    { value: "pulse", label: "Pulse" },
    { value: "flash", label: "Flash" },
    { value: "swing", label: "Swing" },
    { value: "slideoutdown", label: "SlideOutDown" },
    { value: "slideoutup", label: "SlideOutUp" },
    { value: "slideoutleft", label: "SlideOutLeft" },
    { value: "slideoutright", label: "SlideOutRight" },
    { value: "bounceout", label: "BounceOut" },
    { value: "bounceoutup", label: "BounceOutUp" },
    { value: "bounceoutdown", label: "BounceOutDown" },
    { value: "bounceoutleft", label: "BounceOutLeft" },
    { value: "bounceoutright", label: "BounceOutRight" },
    { value: "zoomout", label: "ZoomOut" },
    { value: "zoomoutup", label: "ZoomOutUp" },
    { value: "zoomoutdown", label: "ZoomOutDown" },
    { value: "zoomoutleft", label: "ZoomOutLeft" },
    { value: "zoomoutright", label: "ZoomOutRight" },
    { value: "flipout", label: "FlipOut" },
    { value: "flipouty", label: "FlipOutY" },
    { value: "flipoutx", label: "FlipOutX" },
    { value: "lightout", label: "LightOut" },
    { value: "rollout", label: "RollOut" },
    { value: "rotateout", label: "RotateOut" },
    { value: "swirlout", label: "SwirlOut" },
    { value: "tiltout", label: "TiltOut" },
    { value: "blurout", label: "BlurOut" },
    { value: "flickerout", label: "FlickerOut" },
    { value: "hinge", label: "Hinge" },
    { value: "jackinthebox", label: "JackInTheBox" },
    { value: "puffin", label: "PuffIn" },
    { value: "vanishin", label: "VanishIn" },
    { value: "vanishout", label: "VanishOut" },
    { value: "heartin", label: "HeartIn" },
    { value: "heartout", label: "HeartOut" },
    { value: "circlein", label: "CircleIn" },
    { value: "circleout", label: "CircleOut" },
    { value: "rectin", label: "RectIn" },
    { value: "rectout", label: "RectOut" },
    { value: "textboxin", label: "TextBoxIn" },
    { value: "textboxout", label: "TextBoxOut" },
    { value: "popup", label: "PopUp" }

];


export default function Animation({ style, properties,
    onChangeStyle, }) {


    const [name, setName] = useState("");
    const [customName, setCustomName] = useState("");
    const [names, setNames] = useState([]);
    const [duration, setDuration] = useState(0);
    const [delay, setDelay] = useState(0);
    const [iterationCount, setIterationCount] = useState(1);
    const [direction, setDirection] = useState("normal");
    const [fillMode, setFillMode] = useState("none");
    const [timingFunction, setTimingFunction] = useState("linear");
    const [isCustom, setIsCustom] = useState(false);

    const [stylePriority, setStylePriority] = useState({
        "animation": ""
    });

    const load = async () => {
        try {
            const res = await ThemeServices.getAnimationsNames();
   
            if (res)
                setNames(res.names);
        } catch (e) {

            message.error(e?.message || "Something went wrong.")
        }
    }

    useEffect(() => {

        load();

    }, [])

    useEffect(() => {
        if (!properties) {
            return;
        }

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }

        setStylePriority(priorities);

        if (!properties["animation"])
            properties["animation"] = {};

        const name = properties["animation"].name
        if (name) setName(name);

        const delay = properties["animation"].delay;
        if (delay) setDelay(parseFloat(delay));

        const duration = properties["animation"].duration;
        if (duration) setDuration(parseFloat(duration));

        const iterationCount = properties["animation"]["iteration-count"];
        if (iterationCount) setIterationCount(parseFloat(iterationCount));

        const direction = properties["animation"].direction;
        if (direction) setDirection(direction);

        const fillMode = properties["animation"]["fill-mode"];
        if (fillMode) setFillMode(fillMode);

        const timingFunction = properties["animation"]["timing-function"];
        if (timingFunction) {
            setTimingFunction(timingFunction);
            if (selectOptions.some(op => op.value == timingFunction))
                setIsCustom(true);
        }
    }, [properties]);

    const handleNameChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['name'] = value;
        properties['animation'].value = `${value} ${duration}s ${delay}s ${iterationCount} ${direction} ${fillMode} ${timingFunction}`;

        

        style.setProperty("animation-name", value,
            stylePriority["animation"]
        );

        setName(value);
        onChangeStyle();

    };



    const handleDurationChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['duration'] = value;
        properties['animation'].value = `${name} ${value}s ${delay}s ${iterationCount} ${direction} ${fillMode} ${timingFunction}`;

        style.setProperty(
            "animation-duration",
            `${value}s`,
            stylePriority["animation"]
        );
        setDuration(value);

        onChangeStyle();

    };

    const handleDelayChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['delay'] = value;
        properties['animation'].value = `${name} ${duration}s ${value}s ${iterationCount} ${direction} ${fillMode} ${timingFunction}`;

        style.setProperty(
            "animation-delay",
            `${value}s`,
            stylePriority["animation"]
        );
        setDelay(value);

        onChangeStyle();

    };

    const handleIterationCountChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['iteration-count'] = value;
        properties['animation'].value = `${name} ${duration}s ${delay}s ${value} ${direction} ${fillMode} ${timingFunction}`;

        style.setProperty(
            "animation-iteration-count",
            value,
            stylePriority["animation"]
        );
        setIterationCount(value);

        onChangeStyle();

    };



    const handleDirectionChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['direction'] = value;
        properties['animation'].value = `${name} ${duration}s ${delay}s ${iterationCount} ${value} ${fillMode} ${timingFunction}`;

        style.setProperty(
            "animation-direction",
            value,
            stylePriority["animation"]
        );
        setDirection(value);

        onChangeStyle();

    };

    const handleFillModeChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['fill-mode'] = value;
        properties['animation'].value = `${name} ${duration}s ${delay}s ${iterationCount} ${direction} ${value} ${timingFunction}`;

        style.setProperty(
            "animation-fill-mode",
            value,
            stylePriority["animation"]
        );
        setFillMode(value);

        onChangeStyle();

    };

    const handleTimingFunctionChange = (value) => {
        if (!properties['animation'])
            properties['animation'] = {};

        properties['animation']['timing-function'] = value;
        properties['animation'].value = `${name} ${duration}s ${delay}s ${iterationCount} ${direction} ${fillMode} ${value}`;

        style.setProperty(
            "animation-timing-function",
            value,
            stylePriority["animation"]
        );
        setTimingFunction(value);

        onChangeStyle();

    };


    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        if (!properties['animation'])
            properties['animation'] = {};
        properties['animation'].priority = priority;
        setStylePriority({ ...stylePriority, animation: priority })
        style.setProperty('animation', style.animation, priority);
        onChangeStyle();

    }


    const selectOptions = easingOptions.map((option) => (
        <Option value={option.value} key={option.value}>
            {option.label}
        </Option>
    ));

    const animationOptions = names.map((option) => (
        <Option value={option} key={option}>
            {option}
        </Option>
    ));

    return (
        <div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Animation: </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.animation === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                       

                            e.preventDefault();
                                if (properties["animation"])
                                delete properties["animation"];
                            onChangeStyle();
                            setStylePriority({ ...stylePriority, "animation": "" })   
                                                         style.removeProperty('animation');
                        }}
                    />
                </Tooltip>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Name: </label>
                <Select showSearch optionFilterProp="label" clearIcon style={{ width: '100%' }} value={name} onChange={handleNameChange}>
                    <Option value="">None</Option>
                    {animationOptions}
                </Select>
            </div>
            {/* <div style={{ marginBottom: "10px" }}>
                <label>Custom Name: </label>
                <Input value={name} onChange={(e) => handleNameChange(e.target.value)} />
            </div> */}
            <div style={{ marginBottom: "10px" }}>
                <label>Duration: </label>
                <Slider min={0} max={5} step={0.1} value={duration} onChange={handleDurationChange} />
                <InputNumber min={0} max={5} step={0.1} value={duration} onChange={handleDurationChange} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Delay: </label>
                <Slider min={0} max={5} step={0.1} value={delay} onChange={handleDelayChange} />
                <InputNumber min={0} max={5} step={0.1} value={delay} onChange={handleDelayChange} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Iteration Count: </label>
                <Slider min={1} max={10} step={1} value={iterationCount} onChange={handleIterationCountChange} />
                <InputNumber min={1} max={10} step={1} value={iterationCount} onChange={handleIterationCountChange} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Direction: </label>
                <Select style={{ width: '100%' }} value={direction} onChange={handleDirectionChange}>
                    <Option value="normal">Normal</Option>
                    <Option value="reverse">Reverse</Option>
                    <Option value="alternate">Alternate</Option>
                    <Option value="alternate-reverse">Alternate Reverse</Option>
                </Select>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Fill Mode: </label>
                <Select style={{ width: '100%' }} value={fillMode} onChange={handleFillModeChange}>
                    <Option value="none">None</Option>
                    <Option value="forwards">Forwards</Option>
                    <Option value="backwards">Backwards</Option>
                    <Option value="both">Both</Option>
                </Select>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Timing Function: </label>
                <Select style={{ width: '100%' }} value={timingFunction} onChange={handleTimingFunctionChange}>
                    {selectOptions}
                </Select>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <Checkbox checked={isCustom} onChange={() => setIsCustom(!isCustom)}>
                    Custom Easing Function
                </Checkbox>

                {isCustom && (
                    <Input
                        type="text"
                        placeholder="Custom easing function"
                        value={timingFunction}
                        onChange={(e) => handleTimingFunctionChange(e.target.value)}
                    />
                )}
            </div>
        </div>
    );
}