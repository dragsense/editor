import { Form, Input, Button, Card, Checkbox } from "antd";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default function AddArrayTypes({ states, isMultiple, isRadio, onAdd, onRemove, onChangeState }) {


    return <> <Card title="Array Values">

        {Array.isArray(states) && states.map((state, idx) => (
            <>
                <Form.Item label="Label" className="font-500">
                    <Input
                        type="text"
                        placeholder={`Label #${idx + 1}`}
                        value={state.label}
                        onChange={(e) => {
                            e.preventDefault();
                            state.label = e.target.value;
                            onChangeState();

                        }}
                    />
                </Form.Item>

                <Form.Item label="Value" className="font-500">
                    <Input
                        type="text"
                        placeholder={`Value #${idx + 1}`}
                        value={state.value}
                        onChange={(e) => {
                            e.preventDefault();
                            state.value = e.target.value;
                            onChangeState();
                        }}
                    />
                </Form.Item>
                <Form.Item label="isSelected?" className="font-500">
                    <Checkbox
                        onChange={(e) => {
                            e.preventDefault();

                            if (isMultiple && !isRadio)
                                state.selected = !state.selected;
                            else
                                for (const s of states) {
                                    if (s === state) {
                                        s.selected = !s.selected;

                                    }
                                    else
                                        s.selected = undefined;
                                }

                            onChangeState();

                        }}
                        checked={state.selected}
                    >Yes</Checkbox>
                </Form.Item>


                <MinusCircleOutlined onClick={() => onRemove(idx)} />

            </>
        ))}
        <Form.Item>
            <Button type="dashed" onClick={onAdd} block icon={<PlusOutlined />}>
                Add
            </Button>
        </Form.Item>
    </Card></>
};

