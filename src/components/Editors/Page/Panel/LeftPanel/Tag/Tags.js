
import IconsComponent from "../../../../../Icons";
import TagList from "./TagList";
import HTMLTags from './htmlTags.json';
import { Tabs, theme } from 'antd';
const { TabPane } = Tabs;


export default function Tags({ gridStyle, tag, onSelect, width }) {

    const {
        token: { colorPrimaryBg, colorBgContainer, colorBgBase },
    } = theme.useToken();

    return (<div style={{ padding: 5, maxWidth: width ? width : '200px', maxHeight: '80vh', overflow: 'auto' }}><Tabs
        defaultActiveKey="1" tabBarStyle={{ background: colorBgBase, padding: 5 }}>


        <TabPane tab={<span>
            Layouts
        </span>} key="1">
            <div>
                <TagList
                    selectedTag={tag}
                    color={colorPrimaryBg}
                    onSelect={onSelect}
                    title="Layouts"
                    tags={HTMLTags.layouts}
                    gridStyle={{ ...gridStyle, background: colorBgContainer }} />
            </div>
        </TabPane>

        <TabPane tab={<span>
            Components
        </span>} key="2">
            <div>
                <TagList
                    selectedTag={tag}
                    color={colorPrimaryBg}
                    onSelect={onSelect}
                    title="Components"
                    tags={HTMLTags.components}
                    gridStyle={{ ...gridStyle, background: colorBgContainer }} />
            </div>
        </TabPane>


        <TabPane tab={<span>
            Texts
        </span>} key="3">
            <div>
                <TagList
                    selectedTag={tag}
                    color={colorPrimaryBg}
                    onSelect={onSelect}
                    title="Texts"
                    tags={HTMLTags.texts}

                    gridStyle={{ ...gridStyle, background: colorBgContainer }} />
            </div>
        </TabPane>

        <TabPane tab={<span>
            Media
        </span>} key="4">
            <div>
                <TagList selectedTag={tag}
                    color={colorPrimaryBg}
                    onSelect={onSelect}
                    title="Media"
                    tags={HTMLTags.media}

                    gridStyle={{ ...gridStyle, background: colorBgContainer }} />
            </div>
        </TabPane>

        <TabPane tab={<span>
            I/O
        </span>} key="5">
            <div>
                <TagList
                    selectedTag={tag}
                    color={colorPrimaryBg}
                    onSelect={onSelect}
                    title="Form"
                    tags={HTMLTags.inputs}

                    gridStyle={{ ...gridStyle, background: colorBgContainer }} />

            </div>
        </TabPane>
        <TabPane tab={<span>
            Icons
        </span>} key="6">
            <div>
                <IconsComponent editor={true} />

            </div>
        </TabPane>

    </Tabs>
    </div>
    );
};

