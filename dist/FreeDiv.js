import React, { useEffect, useReducer } from 'react';
import { Stylesheet } from './stylesheet.js';
const freeDivBaseStyles = {
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: '8px 1fr 8px',
    gridTemplateRows: '8px 1fr 8px',
    gridTemplateAreas: `
    '. edge-top .'
    'edge-left content edge-right'
    '. edge-bottom .'
    `,
};
const classes = Stylesheet.create({
    freeDiv: {
        ...freeDivBaseStyles,
    },
    activeFreeDiv: {
        ...freeDivBaseStyles,
        zIndex: 100,
    },
    topEdge: {
        gridArea: 'edge-top',
        placeSelf: 'stretch',
        cursor: 'ns-resize',
    },
    leftEdge: {
        gridArea: 'edge-left',
        placeSelf: 'stretch',
        cursor: 'ew-resize',
    },
    content: {
        gridArea: 'content',
        placeSelf: 'stretch',
        overflow: 'hidden',
    },
    rightEdge: {
        gridArea: 'edge-right',
        placeSelf: 'stretch',
        cursor: 'ew-resize',
    },
    bottomEdge: {
        gridArea: 'edge-bottom',
        placeSelf: 'stretch',
        cursor: 'ns-resize',
    },
});
var WindowOp;
(function (WindowOp) {
    WindowOp[WindowOp["NONE"] = 0] = "NONE";
    WindowOp[WindowOp["MOVE"] = 1] = "MOVE";
    WindowOp[WindowOp["RESIZE"] = 2] = "RESIZE";
})(WindowOp || (WindowOp = {}));
var WindowEdge;
(function (WindowEdge) {
    WindowEdge[WindowEdge["NONE"] = 0] = "NONE";
    WindowEdge[WindowEdge["TOP"] = 1] = "TOP";
    WindowEdge[WindowEdge["LEFT"] = 2] = "LEFT";
    WindowEdge[WindowEdge["RIGHT"] = 3] = "RIGHT";
    WindowEdge[WindowEdge["BOTTOM"] = 4] = "BOTTOM";
})(WindowEdge || (WindowEdge = {}));
const FreeDivReducer = (state, action) => {
    switch (action.type) {
        case 'startMove':
            return { ...state, activeOperation: WindowOp.MOVE };
        case 'moveRelative':
            return {
                ...state,
                position: [
                    state.position[0] + action.value[0],
                    state.position[1] + action.value[1],
                ],
            };
        case 'startResize':
            return {
                ...state,
                activeOperation: WindowOp.RESIZE,
                activeEdge: action.value,
            };
        case 'resizeRelative':
            let newPosition = state.position;
            let newSize = state.size;
            switch (state.activeEdge) {
                case WindowEdge.TOP:
                    newPosition = [
                        state.position[0],
                        state.position[1] + action.value[1],
                    ];
                    newSize = [state.size[0], state.size[1] - action.value[1]];
                    break;
                case WindowEdge.LEFT:
                    newPosition = [
                        state.position[0] + action.value[0],
                        state.position[1],
                    ];
                    newSize = [state.size[0] - action.value[0], state.size[1]];
                    break;
                case WindowEdge.RIGHT:
                    newSize = [state.size[0] + action.value[0], state.size[1]];
                    break;
                case WindowEdge.BOTTOM:
                    newSize = [state.size[0], state.size[1] + action.value[1]];
                    break;
                default:
            }
            return {
                ...state,
                position: newPosition,
                size: newSize,
            };
        case 'endOperation':
            return {
                ...state,
                activeOperation: WindowOp.NONE,
                activeEdge: WindowEdge.NONE,
            };
        default:
            throw new Error();
    }
};
export const FreeDiv = ({ children, initialSize = [250, 250], 
/* remaining are injected by <Desktop> */
id, isActive = false, onActivate = () => { }, }) => {
    const [state, dispatch] = useReducer(FreeDivReducer, {
        activeOperation: WindowOp.NONE,
        activeEdge: WindowEdge.NONE,
        position: [0, 0],
        size: [...initialSize],
    });
    const handleMouseUp = () => {
        dispatch({ type: 'endOperation' });
    };
    const handleMouseDownTitleBar = (event) => {
        dispatch({ type: 'startMove' });
    };
    // Handle state updates for moving a window
    useEffect(() => {
        if (state.activeOperation !== WindowOp.MOVE) {
            return;
        }
        let prevPosition;
        const handleMouseMove = (event) => {
            // event.preventDefault();
            // event.stopPropagation();
            const newPosition = [event.pageX, event.pageY];
            if (!prevPosition) {
                prevPosition = newPosition;
            }
            dispatch({
                type: 'moveRelative',
                value: [
                    newPosition[0] - prevPosition[0],
                    newPosition[1] - prevPosition[1],
                ],
            });
            prevPosition = newPosition;
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [state.activeOperation]);
    const handleMouseDownEdge = (edge) => (event) => {
        // Prevent accidentally highlighting text in the content area of the FreeDiv
        event.preventDefault();
        event.stopPropagation();
        dispatch({ type: 'startResize', value: edge });
    };
    // Handle state updates for resizing a window
    useEffect(() => {
        if (state.activeOperation !== WindowOp.RESIZE) {
            return;
        }
        let prevPosition;
        const handleMouseMove = (event) => {
            const newPosition = [event.pageX, event.pageY];
            if (!prevPosition) {
                prevPosition = newPosition;
            }
            dispatch({
                type: 'resizeRelative',
                value: [
                    newPosition[0] - prevPosition[0],
                    newPosition[1] - prevPosition[1],
                ],
            });
            prevPosition = newPosition;
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [state.activeOperation]);
    const edgeGrabSize = 8;
    return (React.createElement("div", { className: isActive ? classes.activeFreeDiv : classes.freeDiv, onMouseDown: () => {
            if (id !== undefined) {
                onActivate(id);
            }
        }, onMouseUp: handleMouseUp, style: {
            width: `${state.size[0] + 2 * edgeGrabSize}px`,
            height: `${state.size[1] + 2 * edgeGrabSize}px`,
            left: `${state.position[0] - edgeGrabSize}px`,
            top: `${state.position[1] - edgeGrabSize}px`,
        } },
        React.createElement("div", { className: classes.topEdge, onMouseDown: handleMouseDownEdge(WindowEdge.TOP) }),
        React.createElement("div", { className: classes.leftEdge, onMouseDown: handleMouseDownEdge(WindowEdge.LEFT) }),
        React.createElement("div", { className: classes.content }, children({
            isActive,
            titleProps: {
                onMouseDown: handleMouseDownTitleBar,
                style: {
                    userSelect: 'none',
                    cursor: 'grab',
                },
            },
        })),
        React.createElement("div", { className: classes.rightEdge, onMouseDown: handleMouseDownEdge(WindowEdge.RIGHT) }),
        React.createElement("div", { className: classes.bottomEdge, onMouseDown: handleMouseDownEdge(WindowEdge.BOTTOM) })));
};
