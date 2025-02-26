import React from 'react';
export interface IRenderFnProps {
    isActive: boolean;
    titleProps: {
        onMouseDown: (event: React.MouseEvent) => void;
        style: React.CSSProperties;
    };
}
export interface IFreeDivProps {
    children: (props: IRenderFnProps) => React.ReactNode;
    initialSize?: [number, number];
    id?: number;
    isActive?: boolean;
    onActivate?: (id: number) => void;
}
export declare const FreeDiv: ({ children, initialSize, id, isActive, onActivate, }: IFreeDivProps) => React.JSX.Element;
