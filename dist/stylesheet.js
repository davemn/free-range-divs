/* There are several esoteric ones & SVG properties I'm leaving out */
const unitlessProperties = [
    'zIndex',
    'fontWeight',
    'lineHeight',
    'opacity',
    'flex',
    'flexGrow',
    'flexShrink',
    'order',
    'animationIterationCount',
    'gridRow',
    'gridColumn',
    'gridRowStart',
    'gridRowEnd',
    'gridColumnStart',
    'gridColumnEnd',
    'columnCount',
];
/*
 * Basic CSS-in-JS implementation that generates a random prefix
 * with each use of Stylesheet.create(). This allows me to use the
 * same class names in different components without collisions.
 *
 * This API is meant to mirror React Native's StyleSheet API.
 */
export const Stylesheet = {
    _instancePrefixes: new Set(),
    _generatePrefix() {
        const prefix = Math.random().toString(36).slice(2, 8);
        if (Stylesheet._instancePrefixes.has(prefix)) {
            return Stylesheet._generatePrefix();
        }
        Stylesheet._instancePrefixes.add(prefix);
        return prefix;
    },
    create(styleObject) {
        let styleElem = document.querySelector('style#scoped-styles');
        if (!styleElem) {
            styleElem = document.createElement('style');
            styleElem.id = 'scoped-styles';
            document.head.appendChild(styleElem);
        }
        const prefix = Stylesheet._generatePrefix();
        let classNameMap = {};
        const css = Object.entries(styleObject)
            .map(([className, styles]) => {
            const styleString = Object.entries(styles)
                .map(([property, value]) => {
                // convert camelCase to kebab-case
                const cssProperty = property
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .toLowerCase();
                let cssValue = value;
                if (typeof value === 'number' &&
                    value !== 0 &&
                    !unitlessProperties.includes(property)) {
                    cssValue = `${value}px`;
                }
                return `${cssProperty}: ${cssValue};`;
            })
                .join('\n');
            classNameMap[className] = `_${prefix}_${className}`;
            return `._${prefix}_${className} { ${styleString} }`;
        })
            .join('\n');
        // assigning to styleElem.textContent would replace other scoped styles,
        // so append instead
        styleElem.appendChild(document.createTextNode(css));
        return classNameMap;
    },
};
