
import React, { useState } from "react";
import IconsComponent from "../../../../../Icons";
import TagList from "./TagList";
import HTMLTags from './htmlTags.json';
import {  Tabs, theme, Tooltip } from 'antd';
import { FiLayout, FiGrid, FiType, FiImage, FiFileText, FiCode } from 'react-icons/fi';
import { AiOutlineEdit, AiOutlineFileImage } from "react-icons/ai";
const { TabPane } = Tabs;


export default function Tags({ gridStyle, HtmlConvertComponent, setSelectedTagType,  tag, onSelect, width }) {

    const {
        token: { colorPrimaryBg, colorBgContainer, colorBgBase },
    } = theme.useToken();

    const handleTabChange = (key) => {
        const tabNames = {
            1: "Layouts",
            2: "Components",
            3: "Texts",
            4: "Media",
            5: "Form",
            6: "Icons",
            7: "HTML"
        };
        setSelectedTagType(tabNames[key]);
    };

    return (
        <div style={{ padding: 5, maxWidth: width ? width : '200px', maxHeight: '80vh', overflow: 'auto' }}>
            <Tabs defaultActiveKey="1" onChange={handleTabChange} tabBarStyle={{ background: colorBgBase, padding: 5 }}>
                <TabPane
                    tab={
                        <Tooltip title="Layouts">
                            <span><FiLayout /></span>
                        </Tooltip>
                    }
                    key="1"
                >
                    <div>
                        <TagList
                            selectedTag={tag}
                            color={colorPrimaryBg}
                            onSelect={onSelect}
                            title="Layouts"
                            tags={HTMLTags.layouts}
                            gridStyle={{ ...gridStyle, background: colorBgContainer }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Tooltip title="Components">
                            <span><FiGrid /></span>
                        </Tooltip>
                    }
                    key="2"
                >
                    <div>
                        <TagList
                            selectedTag={tag}
                            color={colorPrimaryBg}
                            onSelect={onSelect}
                            title="Components"
                            tags={HTMLTags.components}
                            gridStyle={{ ...gridStyle, background: colorBgContainer }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Tooltip title="Texts">
                            <span><FiType /></span>
                        </Tooltip>
                    }
                    key="3"
                >
                    <div>
                        <TagList
                            selectedTag={tag}
                            color={colorPrimaryBg}
                            onSelect={onSelect}
                            title="Texts"
                            tags={HTMLTags.texts}
                            gridStyle={{ ...gridStyle, background: colorBgContainer }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Tooltip title="Media">
                            <span><FiImage /></span>
                        </Tooltip>
                    }
                    key="4"
                >
                    <div>
                        <TagList
                            selectedTag={tag}
                            color={colorPrimaryBg}
                            onSelect={onSelect}
                            title="Media"
                            tags={HTMLTags.media}
                            gridStyle={{ ...gridStyle, background: colorBgContainer }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Tooltip title="I/O">
                            <span><AiOutlineEdit /></span>
                        </Tooltip>
                    }
                    key="5"
                >
                    <div>
                        <TagList
                            selectedTag={tag}
                            color={colorPrimaryBg}
                            onSelect={onSelect}
                            title="Form"
                            tags={HTMLTags.inputs}
                            gridStyle={{ ...gridStyle, background: colorBgContainer }}
                        />
                    </div>
                </TabPane>

                <TabPane
                    tab={
                        <Tooltip title="Icons">
                            <span><AiOutlineFileImage /></span>
                        </Tooltip>
                    }
                    key="6"
                >
                    <div>
                        <IconsComponent editor={true} />
                    </div>
                </TabPane>

                {React.isValidElement(HtmlConvertComponent) && (
                    <TabPane
                        tab={
                            <Tooltip title="HTML">
                                <span><FiCode /></span>
                            </Tooltip>
                        }
                        key="7"
                    >
                        <div>
                            {HtmlConvertComponent}
                        </div>
                    </TabPane>
                )}
            </Tabs>
        </div>
    );
}


