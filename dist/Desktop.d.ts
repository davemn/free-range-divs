import React from 'react';
export interface IDesktopProps {
    children: React.ReactNode;
    height: number;
    width: number;
}
export declare const Desktop: ({ children, height, width }: IDesktopProps) => React.JSX.Element | null;
