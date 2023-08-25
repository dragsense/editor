import React, { useState, useEffect } from "react";
import { Button } from "antd";
import ImageComponent from "@/components/dashboard/media/Images";

export default function Image({ content, setContent, onSave }) {

  
    const onSelect = (image) => {

        if(!image)
        return;

        setContent(image.path);
        onSave(image.path);
    }
    const onRemove = (image) => {
        setContent('');
        onSave('');
    }

    return <>
    <ImageComponent image={content} setImage={setContent} onSelect ={onSelect} onRemove={onRemove}/>
   
    </>
};

