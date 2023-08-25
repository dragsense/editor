import { useState, useEffect } from "react";
import { useComponentsStates } from "../../PageProvider";



export default function RightPanel({ active }) {

    const [states, setStates] = useState([]);

    const [customPaths, setCustomPaths] = useState([]);

    const { getCurrentComponent } = useComponentsStates();

    useEffect( () => {

        // const id = localStorage.getItem("project");
        // const response = await fetcher('/api/projects/' + id, {
        //     method: 'GET'
        // });

        // const url = `http://${response.project.domain}:${response.project.port}`;
        // const apikey = response.project.apikey;


        // const compPaths = await fetcher(`${url}/api/components/path`, {
        //     method: 'GET',
        //     headers: { 'x-api-key': apikey },
        // })

        // setCustomPaths(compPaths);


        // if (!getCurrentComponent())
        //     return;

        // const _options = getCurrentComponent().states;
        // setStates(_options.map(state => generateCascader(state)));


    }, [getCurrentComponent()]);




    return (<></>
        // <SwitchComponents active={active}>
        //     <Navigator index='1' />
        //     <ComponentSetting index='2'
        //         states={states}  />
        //     <NodeSetting index='3'
        //         customPaths={customPaths}
        //         states={states} />
        //     <Styling index="4" states={states} />
        //     <div index="5" ></div>
        // </SwitchComponents>
    );
};