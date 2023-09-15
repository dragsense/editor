import React, { Children, useEffect, useRef, useState } from "react";

import { Input, Form, Popover, Typography, Button, Select } from "antd";

import Others from "./Others";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import ClassManager from "./ClassManager";

const { Text } = Typography;

const { Option } = Select;

export default function ElementSetting({ cascaderStates, state, setState,
    setIsChange }) {




    const onChnageAttribute = (key, value) => {

        if (!state.attributes) {
            state.attributes = {};
        }


        if (!value) {
            onRemove(key);
        } else {
            state.attributes[key] = { key, value };
            
            setState({ ...state });
        }

        setIsChange(true);


    }


    const onRemove = (key) => {

        if (state.attributes[key]) {
            delete state.attributes[key];
        }
        setState({ ...state });


    }

    const onChange = (value, name) => {
        setState({ ...state, [name]: value });

        setIsChange(true);
    };


    return <Form layout="vertical">

        <Form.Item label="Element Tag">
            <Select onChange={(value) => {

                onChange(value, "tagName")
            }
            } name="tagName" value={state.tagName}>
                <Option value="h1">
                    h1
                </Option>
                <Option value="h2">
                    h2
                </Option>
                <Option value="h3">
                    h3
                </Option>
                <Option value="h4">
                    h4
                </Option>
                <Option value="h5">
                    h5
                </Option>
                <Option value="h6">
                    h6
                </Option>
                <Option value="p">
                    p
                </Option>
                <Option value="div">
                    div
                </Option>
            </Select>

        </Form.Item>



        <Form.Item label="Name" className="font-500">
        <Text disabled>e.g. Hero Heading</Text>
            <Input maxLength={100} placeholder="Element Name" name="name"
                onChange={(e) => {
                    e.preventDefault();

                    const value = e.target.value;
                    const name = e.target.name;

                    onChange(value, name)
                }
                }
                value={state.name}
            /> 
                

            
            </Form.Item>
        <Form.Item label="Element ID">
        <Text disabled>e.g. 'hero-heading'</Text>

            <Input maxLength={200} value={state.attributes['id']?.value} name="id" placeholder="ID"
                onChange={(e) => { e.preventDefault(); onChnageAttribute('id', e.target.value) }} />
        </Form.Item>


        {state.tagName == 'a' && <Form.Item label="Custom Link">
        <Text disabled>e.g. 'https://example.com'</Text>

            <Input value={state.attributes['href']?.value} placeholder="href" name="href"
                onChange={(e) => { e.preventDefault(); onChnageAttribute('href', e.target.value) }} />
        </Form.Item>
        }

        {(state.tagName === 'img' || state.tagName === 'video') && <Form.Item label="Custom src">
        <Text disabled>e.g. 'https://example.com/src.xyz'</Text>

            <Input value={state.attributes['src']?.value} placeholder="src" name="src"
                onChange={(e) => { e.preventDefault(); onChnageAttribute('src', e.target.value) }} />
        </Form.Item>
        }

        <Popover
            placement="left"
            title={<>Others <br/>Note:<em> Use single quotes for string values</em></>}
            content={<Others state={state}
                attributes={state.attributes}
                onChnageAttribute={onChnageAttribute}
                onRemove={onRemove} />}
            trigger="click">
            <Button type="text" icon={<ArrowLeftOutlined />} > More </Button>

        </Popover>
        <br />
        <br />

        <Form.Item label="Mian Class">
            <Input
            maxLength={100}
                value={state.mainClass}
                placeholder="Main Class"
                onChange={(e) => {
                    onChange(e.target.value, "mainClass")
                }
                }
            />
        </Form.Item>

        <Form.Item label="Element Classes">
            <ClassManager element={state} 
            cascaderStates={cascaderStates} 
            setIsChange={setIsChange} />
        </Form.Item>









    </Form>


}

