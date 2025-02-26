export interface IStyleObject {
    [className: string]: {
        [property: string]: string | number;
    };
}
export declare const Stylesheet: {
    _instancePrefixes: Set<unknown>;
    _generatePrefix(): string;
    create(styleObject: IStyleObject): Record<string, string>;
};
