import React, { useEffect, useReducer } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  window: {
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: '8px 1fr 8px',
    gridTemplateRows: '8px 1fr 8px',
    gridTemplateAreas: `
      '. edge-top .'
      'edge-left content edge-right'
      '. edge-bottom .'
      `,
  },
  activeWindow: {
    extend: 'window',
    zIndex: 100,
  },
  topEdge: `
    grid-area: edge-top;
    place-self: stretch;
    cursor: ns-resize;
  `,
  leftEdge: `
    grid-area: edge-left;
    place-self: stretch;
    cursor: ew-resize;
  `,
  content: `
    grid-area: content;
    place-self: stretch;
    overflow: hidden;
  `,
  rightEdge: `
    grid-area: edge-right;
    place-self: stretch;
    cursor: ew-resize;
  `,
  bottomEdge: `
    grid-area: edge-bottom;
    place-self: stretch;
    cursor: ns-resize;
  `,
});

const WindowOp = {
  NONE: 0,
  MOVE: 1,
  RESIZE: 2,
};
const WindowEdge = {
  NONE: 0,
  TOP: 1,
  LEFT: 2,
  RIGHT: 3,
  BOTTOM: 4,
};

function WindowReducer(state, action) {
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
}

const Window = ({
  canDrag,
  canResize,
  canScrollX,
  canScrollY,
  children,
  initialSize = [250, 250],
  /* remaining are injected by <Desktop> */
  id,
  isActive,
  onActivate,
}) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(WindowReducer, {
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

    let prevPosition = null;
    const handleMouseMove = (event) => {
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
    dispatch({ type: 'startResize', value: edge });
  };

  // Handle state updates for resizing a window
  useEffect(() => {
    if (state.activeOperation !== WindowOp.RESIZE) {
      return;
    }

    let prevPosition = null;
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

  return (
    <div
      key={id}
      className={isActive ? classes.activeWindow : classes.window}
      onMouseDown={() => onActivate(id)}
      onMouseUp={handleMouseUp}
      style={{
        width: `${state.size[0] + 2 * edgeGrabSize}px`,
        height: `${state.size[1] + 2 * edgeGrabSize}px`,
        left: `${state.position[0] - edgeGrabSize}px`,
        top: `${state.position[1] - edgeGrabSize}px`,
      }}
    >
      <div
        className={classes.topEdge}
        onMouseDown={handleMouseDownEdge(WindowEdge.TOP)}
      ></div>
      <div
        className={classes.leftEdge}
        onMouseDown={handleMouseDownEdge(WindowEdge.LEFT)}
      ></div>
      <div className={classes.content}>
        {children({
          isActive,
          titleProps: {
            onMouseDown: handleMouseDownTitleBar,
            style: {
              userSelect: 'none',
              cursor: 'grab',
            },
          },
        })}
      </div>
      <div
        className={classes.rightEdge}
        onMouseDown={handleMouseDownEdge(WindowEdge.RIGHT)}
      ></div>
      <div
        className={classes.bottomEdge}
        onMouseDown={handleMouseDownEdge(WindowEdge.BOTTOM)}
      ></div>
    </div>
  );
};

export { Window };
