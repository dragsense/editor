import { PageComponent } from "./Page";
import { CollectionComponent } from "./Collection";
import { ComponentComponent } from "./Component";
import { TemplateComponent } from "./Template";
import { PageComponentComponent } from "./Component";
import { MediaLinksComponent } from "./Media";
import { TagComponent } from "./Tag";
import {FormComponent} from './Form';

import SwitchComponents from "..";

export default function LeftPanel({ active }) {


    return (<>
        
        {/* <SwitchComponents active={active}>
            <PageComponent index='1' />
            <FormComponent index="2" />
            <ComponentComponent index="3" />
            <TemplateComponent  index="4"/>
            <TagComponent index="5" gridStyle={{ width: '100%', textAlign: 'center' }}/>
            <CollectionComponent index="6" collections={[]} />
         
            <MediaLinksComponent index="7"  />
            
            <div index="8" ></div>
        </SwitchComponents> */}
        </>);
};