


import { useEffect, useState } from "react";

import { Checkbox } from "antd";

export default function ElementWrapping({ state, setState, setIsChange }) {


    const onChangekey = (value) => {


        setState({ ...state, wrapper: !state.wrapper });

     

        setIsChange(true);

    }


    return <>


        <Checkbox onChange={() => onChangekey()}
            checked={state.wrapper} >Yes</Checkbox>

    </>
};


