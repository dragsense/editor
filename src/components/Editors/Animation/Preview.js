import { useState, useEffect } from "react";
import { Card } from "antd";
import { MdKeyboardReturn } from "react-icons/md";

// Function to render the animation
const renderAnimation = (style) => {
    return (
        <div style={{ ...style, perspective: undefined, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Amazing Animation!
        </div>
    );
}

// Main Preview function
export function Preview({ style }) {

    return (
        <div style={{ display: 'flex', padding: 50, perspective: style.perspective, justifyContent: 'center' }}>
            {renderAnimation(style)}
        </div>
    );
}