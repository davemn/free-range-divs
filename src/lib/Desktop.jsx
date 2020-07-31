import React, { cloneElement, useState } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  desktop: `
    background-color: #efefef;
    position: relative;
    overflow: hidden;
  `,
});

const Desktop = ({ children, height, width }) => {
  const classes = useStyles();
  const [activeWindowId, setActiveWindowId] = useState();

  const handleWindowActivate = (windowId) => {
    setActiveWindowId(windowId);
  };

  const childrenWithProps = React.Children.map(children, (child, index) => {
    const id = index;
    return cloneElement(child, {
      id,
      onActivate: handleWindowActivate,
      isActive:
        typeof activeWindowId === 'undefined'
          ? id === React.Children.count(children) - 1
          : id === activeWindowId,
    });
  });

  return (
    <div
      className={classes.desktop}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {childrenWithProps}
    </div>
  );
};

export { Desktop };
