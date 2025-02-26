import React, { cloneElement, isValidElement, useState } from 'react';

import { type IFreeDivProps } from './FreeDiv.js';
import { Stylesheet } from './stylesheet.js';

const classes = Stylesheet.create({
  desktop: {
    backgroundColor: '#efefef',
    position: 'relative',
    overflow: 'hidden',
  },
});

export interface IDesktopProps {
  children: React.ReactNode;
  height: number;
  width: number;
}

export const Desktop = ({ children, height, width }: IDesktopProps) => {
  const [activeWindowId, setActiveWindowId] = useState<number>();

  const handleWindowActivate = (windowId: number) => {
    setActiveWindowId(windowId);
  };

  if (!children) {
    return null;
  }

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (!isValidElement<IFreeDivProps>(child)) {
      return child;
    }

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
