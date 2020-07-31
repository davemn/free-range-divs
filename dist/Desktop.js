import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { cloneElement, useState } from 'react';
import { createUseStyles } from 'react-jss';
var useStyles = createUseStyles({
  desktop: "\n    background-color: #efefef;\n    position: relative;\n    overflow: hidden;\n  "
});

var Desktop = function Desktop(_ref) {
  var children = _ref.children,
      height = _ref.height,
      width = _ref.width;
  var classes = useStyles();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      activeWindowId = _useState2[0],
      setActiveWindowId = _useState2[1];

  var handleWindowActivate = function handleWindowActivate(windowId) {
    setActiveWindowId(windowId);
  };

  var childrenWithProps = React.Children.map(children, function (child, index) {
    var id = index;
    return cloneElement(child, {
      id: id,
      onActivate: handleWindowActivate,
      isActive: typeof activeWindowId === 'undefined' ? id === React.Children.count(children) - 1 : id === activeWindowId
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    className: classes.desktop,
    style: {
      width: "".concat(width, "px"),
      height: "".concat(height, "px")
    }
  }, childrenWithProps);
};

export { Desktop };