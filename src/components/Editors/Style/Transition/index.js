import { Slider, InputNumber, Select, Input, Checkbox, Tooltip, Button } from 'antd';
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
export default function Transition({ style, properties,
    onChangeStyle, }) {

    const [duration, setDuration] = useState(0);
    const [delay, setDelay] = useState(0);
    const [easing, setEasing] = useState("linear");
    const [isCustom, setIsCustom] = useState(false);

    const [_properties, setProperties] = useState("all");

    const [stylePriority, setStylePriority] = useState({
        'transition': '',
    });

    const selectOptions = easingOptions.map((option) => (
        <Option value={option.value} key={option.value}>
            {option.label}
        </Option>
    ));

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

        if (!properties["transition"])
            properties["transition"] = {};


        const tdelay = properties["transition"].delay;
        if (tdelay) setDelay(parseFloat(tdelay));
        const tduration = properties["transition"].duration;
        if (tduration) setDuration(parseFloat(tduration));
        const ttf = properties["transition"]["timing-function"];
        if (ttf) {
            setEasing(ttf);
            if (easingOptions.some(op => op.value == ttf))
                setIsCustom(true);
        }
        const tp = properties["transition"].property;
        if (tp) setProperties(tp.trim() || "all");



    }, [properties]);




    const handleDurationChange = (value) => {

        if (!properties['transition'])
            properties['transition'] = {};

        properties['transition']['duration'] = value;
        properties['transition'].value = `${_properties} ${value}s ${easing} ${delay}s`;

        style.setProperty(
            "transition-duration",
            `${value}s`,
            stylePriority["transition"]
        );
        setDuration(value);

        onChangeStyle();
    };

    const handleDelayChange = (value) => {


        if (!properties['transition'])
            properties['transition'] = {};

        properties['transition']['delay'] = value;
        properties['transition'].value = `${_properties} ${duration}s ${easing} ${value}s`;

        style.setProperty(
            "transition-delay",
            `${value}s`,
            stylePriority["transition"]
        );
        setDelay(value);

        onChangeStyle();

    };

    const handleEasingChange = (value) => {


        if (!properties['transition'])
            properties['transition'] = {};

        properties['transition']['timing-function'] = value;
        properties['transition'].value = `${_properties} ${duration}s ${value} ${delay}s`;

        style.setProperty(
            "transition-timing-function",
            `${value}`,
            stylePriority["transition"]
        );
        setEasing(value);

        onChangeStyle();

    };


    const handleCustomEasingChange = (e) => {
        const value = e.target.value;
        if (!properties['transition'])
            properties['transition'] = {};

        properties['transition']['timing-function'] = value;
        properties['transition'].value = `${_properties} ${duration}s ${value} ${delay}s`;

        style.setProperty(
            "transition-timing-function",
            `${value}`,
            stylePriority["transition"]
        );
        setEasing(value);

        onChangeStyle();

    };

    const handlePropertiesChange = (e) => {
        const value = e.target.value;

        if (!properties['transition'])
            properties['transition'] = {};

        properties['transition']['property'] = value;
        properties['transition'].value = `${value} ${duration}s ${easing} ${delay}s`;

        style.setProperty(
            "transition-property",
            `${value}`,
            stylePriority["transition"]
        );

        setProperties(value);

        onChangeStyle();

    };



    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        if (!properties['transition'])
            properties['transition'] = {};
        properties['transition'].priority = priority;
        setStylePriority({ ...stylePriority, transition: priority })
        style.setProperty('transition', style.transition, priority);

    }



    return (
        <div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Transition: </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority.transition === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            onChangeStyle();
                            if (properties['transition'])
                                delete properties['transition'];

                                setStylePriority({ ...stylePriority, transition: "" })

                            style.removeProperty('transition');
                        }}
                    />
                </Tooltip>
            </div>

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
                <label>Easing: </label>
                <Select style={{ width: '100%', marginBottom: "10px" }} value={easing} onChange={handleEasingChange}>
                    {selectOptions}
                </Select>

                <Checkbox checked={isCustom} onChange={() => setIsCustom(!isCustom)}>
                    Custom Easing Function
                </Checkbox>

                {isCustom && (
                    <Input
                        type="text"
                        placeholder="Custom easing function"
                        value={easing}
                        onChange={handleCustomEasingChange}
                    />
                )}
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Apply on: </label>
                <TextArea onChange={handlePropertiesChange} value={_properties} />
            </div>
        </div>
    );
}