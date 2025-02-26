import React, { cloneElement, isValidElement, useState } from 'react';
import {} from './FreeDiv.js';
import { Stylesheet } from './stylesheet.js';
const classes = Stylesheet.create({
    desktop: {
        backgroundColor: '#efefef',
        position: 'relative',
        overflow: 'hidden',
    },
});
export const Desktop = ({ children, height, width }) => {
    const [activeWindowId, setActiveWindowId] = useState();
    const handleWindowActivate = (windowId) => {
        setActiveWindowId(windowId);
    };
    if (!children) {
        return null;
    }
    const childrenWithProps = React.Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
            return child;
        }
        const id = index;
        return cloneElement(child, {
            id,
            onActivate: handleWindowActivate,
            isActive: typeof activeWindowId === 'undefined'
                ? id === React.Children.count(children) - 1
                : id === activeWindowId,
        });
    });
    return (React.createElement("div", { className: classes.desktop, style: { width: `${width}px`, height: `${height}px` } }, childrenWithProps));
};
