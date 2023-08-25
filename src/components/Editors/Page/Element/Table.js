import React, { useEffect, useState } from "react";

import { Cascader, Select, Form, InputNumber, Checkbox, Card } from "antd";

const { Option } = Select;



export default function Table({ element }) {



    const [isThead, setIsThead] = useState(false);
    const [isFoot, setIsFoot] = useState(false);

    const [tHeadRows, setTHeadRows] = useState(1);
    const [tHeadCols, setTHeadCols] = useState(1);

    const [tBodyRows, setTBodyRows] = useState(1);
    const [tBodyCols, setTBodyCols] = useState(1);

    const [tFootRows, setTFootRows] = useState(1);
    const [tFootCols, setTFootCols] = useState(1);

    useEffect(() => {

        if (!element || element.tagName !== 'table')
            return;

            console.log(element);

        setIsThead(element.thead?.enable);
        setIsFoot(element.tfoot?.enable);

        setTHeadRows(element.thead?.rows);
        setTBodyRows(element.tbody?.rows);
        setTFootRows(element.tfoot?.rows);

        setTHeadCols(element.thead?.cols);
        setTBodyCols(element.tbody?.cols);
        setTFootCols(element.tfoot?.cols);


    }, [element]);


    const onChangeTHeadRows = (value) => {


        setTHeadRows(value);
        element.thead = element.thead ?? { rows: 1 }

        element.thead.rows = value;

    }

    const onChangeTHeadCols = (value) => {


        setTHeadCols(value);
        element.thead = element.thead ?? { cols: 1 }
        element.thead.cols = value;

    }

    const onChangeTBodyRows = (value) => {


        setTBodyRows(value);
        element.tbody = element.tbody ?? { rows: 1 }

        element.tbody.rows = value;

    }

    const onChangeTBodyCols = (value) => {


        setTBodyCols(value);
        element.tbody = element.tbody ?? { cols: 1 }

        element.tbody.cols = value;

    }

    const onChangeTFootRows = (value) => {


        setTFootRows(value);
        element.tfoot = element.tfoot ?? { rows: 1 }

        element.tfoot.rows = value;


    }

    const onChangeTFootCols = (value) => {


        setTFootCols(value);
        element.tfoot = element.tfoot ?? { cols: 1 }

        element.tfoot.cols = value;

    }




    return <div className="wrapper">



        <Card title="Table Header"
            bordered={false}
            bodyStyle={{ padding: isThead ? null : 0 }}
            extra={<Checkbox checked={isThead} onChange={() => {
                setIsThead(!isThead); element.thead.enable = !isThead
            }
            }>Is THead?</Checkbox>}>
            {isThead && <>
                <Form
                    layout="inline"

                >
                    <Form.Item label="Rows" >
                        <InputNumber value={tHeadRows} onChange={onChangeTHeadRows} />
                    </Form.Item>
                    <Form.Item label="Cols">
                        <InputNumber value={tHeadCols} onChange={onChangeTHeadCols} />
                    </Form.Item>
                </Form>
            </>}
        </Card>

        <br />

        <Card title="Table Body">
            <Form
                layout="inline"
            >
                <Form.Item label="Rows" >
                    <InputNumber value={tBodyRows} onChange={onChangeTBodyRows} />
                </Form.Item>
                <Form.Item label="Cols">
                    <InputNumber value={tBodyCols} onChange={onChangeTBodyCols} />
                </Form.Item>
            </Form>
        </Card>
        <br />
        <Card title="Table Footer"
            bordered={false}
            bodyStyle={{ padding: isFoot ? null : 0 }}
            extra={<Checkbox checked={isFoot} onChange={() => {

                setIsFoot(!isFoot)
                element.tfoot.enable = !isFoot

            }
            }>Is TFoot?</Checkbox>}>
            {isFoot && <>
                <Form
                    layout="inline"
                >
                    <Form.Item label="Rows" >
                        <InputNumber value={tFootRows} onChange={onChangeTFootRows} />
                    </Form.Item>
                    <Form.Item label="Cols">
                        <InputNumber value={tFootCols} onChange={onChangeTFootCols} />
                    </Form.Item>
                </Form>
            </>}
        </Card>
    </div>


}

