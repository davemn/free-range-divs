import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import React, { useEffect, useReducer } from 'react';
import { createUseStyles } from 'react-jss';
var useStyles = createUseStyles({
  window: {
    position: 'absolute',
    display: 'grid',
    gridTemplateColumns: '8px 1fr 8px',
    gridTemplateRows: '8px 1fr 8px',
    gridTemplateAreas: "\n      '. edge-top .'\n      'edge-left content edge-right'\n      '. edge-bottom .'\n      "
  },
  activeWindow: {
    extend: 'window',
    zIndex: 100
  },
  topEdge: "\n    grid-area: edge-top;\n    place-self: stretch;\n    cursor: ns-resize;\n  ",
  leftEdge: "\n    grid-area: edge-left;\n    place-self: stretch;\n    cursor: ew-resize;\n  ",
  content: "\n    grid-area: content;\n    place-self: stretch;\n    overflow: hidden;\n  ",
  rightEdge: "\n    grid-area: edge-right;\n    place-self: stretch;\n    cursor: ew-resize;\n  ",
  bottomEdge: "\n    grid-area: edge-bottom;\n    place-self: stretch;\n    cursor: ns-resize;\n  "
});
var WindowOp = {
  NONE: 0,
  MOVE: 1,
  RESIZE: 2
};
var WindowEdge = {
  NONE: 0,
  TOP: 1,
  LEFT: 2,
  RIGHT: 3,
  BOTTOM: 4
};

function WindowReducer(state, action) {
  switch (action.type) {
    case 'startMove':
      return _objectSpread({}, state, {
        activeOperation: WindowOp.MOVE
      });

    case 'moveRelative':
      return _objectSpread({}, state, {
        position: [state.position[0] + action.value[0], state.position[1] + action.value[1]]
      });

    case 'startResize':
      return _objectSpread({}, state, {
        activeOperation: WindowOp.RESIZE,
        activeEdge: action.value
      });

    case 'resizeRelative':
      var newPosition = state.position;
      var newSize = state.size;

      switch (state.activeEdge) {
        case WindowEdge.TOP:
          newPosition = [state.position[0], state.position[1] + action.value[1]];
          newSize = [state.size[0], state.size[1] - action.value[1]];
          break;

        case WindowEdge.LEFT:
          newPosition = [state.position[0] + action.value[0], state.position[1]];
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

      return _objectSpread({}, state, {
        position: newPosition,
        size: newSize
      });

    case 'endOperation':
      return _objectSpread({}, state, {
        activeOperation: WindowOp.NONE,
        activeEdge: WindowEdge.NONE
      });

    default:
      throw new Error();
  }
}

var Window = function Window(_ref) {
  var canDrag = _ref.canDrag,
      canResize = _ref.canResize,
      canScrollX = _ref.canScrollX,
      canScrollY = _ref.canScrollY,
      children = _ref.children,
      _ref$initialSize = _ref.initialSize,
      initialSize = _ref$initialSize === void 0 ? [250, 250] : _ref$initialSize,
      id = _ref.id,
      isActive = _ref.isActive,
      onActivate = _ref.onActivate;
  var classes = useStyles();

  var _useReducer = useReducer(WindowReducer, {
    activeOperation: WindowOp.NONE,
    activeEdge: WindowEdge.NONE,
    position: [0, 0],
    size: _toConsumableArray(initialSize)
  }),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var handleMouseUp = function handleMouseUp() {
    dispatch({
      type: 'endOperation'
    });
  };

  var handleMouseDownTitleBar = function handleMouseDownTitleBar(event) {
    dispatch({
      type: 'startMove'
    });
  }; // Handle state updates for moving a window


  useEffect(function () {
    if (state.activeOperation !== WindowOp.MOVE) {
      return;
    }

    var prevPosition = null;

    var handleMouseMove = function handleMouseMove(event) {
      var newPosition = [event.pageX, event.pageY];

      if (!prevPosition) {
        prevPosition = newPosition;
      }

      dispatch({
        type: 'moveRelative',
        value: [newPosition[0] - prevPosition[0], newPosition[1] - prevPosition[1]]
      });
      prevPosition = newPosition;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return function () {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state.activeOperation]);

  var handleMouseDownEdge = function handleMouseDownEdge(edge) {
    return function (event) {
      dispatch({
        type: 'startResize',
        value: edge
      });
    };
  }; // Handle state updates for resizing a window


  useEffect(function () {
    if (state.activeOperation !== WindowOp.RESIZE) {
      return;
    }

    var prevPosition = null;

    var handleMouseMove = function handleMouseMove(event) {
      var newPosition = [event.pageX, event.pageY];

      if (!prevPosition) {
        prevPosition = newPosition;
      }

      dispatch({
        type: 'resizeRelative',
        value: [newPosition[0] - prevPosition[0], newPosition[1] - prevPosition[1]]
      });
      prevPosition = newPosition;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return function () {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state.activeOperation]);
  var edgeGrabSize = 8;
  return /*#__PURE__*/React.createElement("div", {
    key: id,
    className: isActive ? classes.activeWindow : classes.window,
    onMouseDown: function onMouseDown() {
      return onActivate(id);
    },
    onMouseUp: handleMouseUp,
    style: {
      width: "".concat(state.size[0] + 2 * edgeGrabSize, "px"),
      height: "".concat(state.size[1] + 2 * edgeGrabSize, "px"),
      left: "".concat(state.position[0] - edgeGrabSize, "px"),
      top: "".concat(state.position[1] - edgeGrabSize, "px")
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.topEdge,
    onMouseDown: handleMouseDownEdge(WindowEdge.TOP)
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.leftEdge,
    onMouseDown: handleMouseDownEdge(WindowEdge.LEFT)
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.content
  }, children({
    isActive: isActive,
    titleProps: {
      onMouseDown: handleMouseDownTitleBar,
      style: {
        userSelect: 'none',
        cursor: 'grab'
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: classes.rightEdge,
    onMouseDown: handleMouseDownEdge(WindowEdge.RIGHT)
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.bottomEdge,
    onMouseDown: handleMouseDownEdge(WindowEdge.BOTTOM)
  }));
};

export { Window };