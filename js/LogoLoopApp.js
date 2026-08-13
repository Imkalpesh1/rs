(function () {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React and ReactDOM must be loaded before LogoLoopApp.js');
        return;
    }

    const { useState, useEffect, useRef, useMemo, useCallback, memo } = React;

    const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

    const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

    const useResizeObserver = (callback, elements, dependencies) => {
        useEffect(() => {
            if (!window.ResizeObserver) {
                const handleResize = () => callback();
                window.addEventListener('resize', handleResize);
                callback();
                return () => window.removeEventListener('resize', handleResize);
            }
            const observers = elements.map(ref => {
                if (!ref.current) return null;
                const observer = new ResizeObserver(callback);
                observer.observe(ref.current);
                return observer;
            });
            callback();
            return () => {
                observers.forEach(observer => observer?.disconnect());
            };
        }, [callback, elements, dependencies]);
    };

    const useImageLoader = (seqRef, onLoad, dependencies) => {
        useEffect(() => {
            const images = seqRef.current?.querySelectorAll('img') ?? [];
            if (images.length === 0) {
                onLoad();
                return;
            }
            let remainingImages = images.length;
            const handleImageLoad = () => {
                remainingImages -= 1;
                if (remainingImages === 0) onLoad();
            };
            images.forEach(img => {
                const htmlImg = img;
                if (htmlImg.complete) {
                    handleImageLoad();
                } else {
                    htmlImg.addEventListener('load', handleImageLoad, { once: true });
                    htmlImg.addEventListener('error', handleImageLoad, { once: true });
                }
            });
            return () => {
                images.forEach(img => {
                    img.removeEventListener('load', handleImageLoad);
                    img.removeEventListener('error', handleImageLoad);
                });
            };
        }, [onLoad, seqRef, dependencies]);
    };

    const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) => {
        const rafRef = useRef(null);
        const lastTimestampRef = useRef(null);
        const offsetRef = useRef(0);
        const velocityRef = useRef(0);

        useEffect(() => {
            const track = trackRef.current;
            if (!track) return;

            const seqSize = isVertical ? seqHeight : seqWidth;

            if (seqSize > 0) {
                offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
                const transformValue = isVertical
                    ? `translate3d(0, ${-offsetRef.current}px, 0)`
                    : `translate3d(${-offsetRef.current}px, 0, 0)`;
                track.style.transform = transformValue;
            }

            const animate = timestamp => {
                if (lastTimestampRef.current === null) {
                    lastTimestampRef.current = timestamp;
                }

                const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
                lastTimestampRef.current = timestamp;

                const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

                const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
                velocityRef.current += (target - velocityRef.current) * easingFactor;

                if (seqSize > 0) {
                    let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                    nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
                    offsetRef.current = nextOffset;

                    const transformValue = isVertical
                        ? `translate3d(0, ${-offsetRef.current}px, 0)`
                        : `translate3d(${-offsetRef.current}px, 0, 0)`;
                    track.style.transform = transformValue;
                }

                rafRef.current = requestAnimationFrame(animate);
            };

            rafRef.current = requestAnimationFrame(animate);

            return () => {
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
                lastTimestampRef.current = null;
            };
        }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
    };

    const LogoLoop = memo(
        ({
            logos,
            speed = 120,
            direction = 'left',
            width = '100%',
            logoHeight = 28,
            gap = 32,
            pauseOnHover,
            hoverSpeed,
            fadeOut = false,
            fadeOutColor,
            scaleOnHover = false,
            renderItem,
            ariaLabel = 'Partner logos',
            className,
            style
        }) => {
            const containerRef = useRef(null);
            const trackRef = useRef(null);
            const seqRef = useRef(null);

            const [seqWidth, setSeqWidth] = useState(0);
            const [seqHeight, setSeqHeight] = useState(0);
            const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
            const [isHovered, setIsHovered] = useState(false);

            const effectiveHoverSpeed = useMemo(() => {
                if (hoverSpeed !== undefined) return hoverSpeed;
                if (pauseOnHover === true) return 0;
                if (pauseOnHover === false) return undefined;
                return 0;
            }, [hoverSpeed, pauseOnHover]);

            const isVertical = direction === 'up' || direction === 'down';

            const targetVelocity = useMemo(() => {
                const magnitude = Math.abs(speed);
                let directionMultiplier;
                if (isVertical) {
                    directionMultiplier = direction === 'up' ? 1 : -1;
                } else {
                    directionMultiplier = direction === 'left' ? 1 : -1;
                }
                const speedMultiplier = speed < 0 ? -1 : 1;
                return magnitude * directionMultiplier * speedMultiplier;
            }, [speed, direction, isVertical]);

            const updateDimensions = useCallback(() => {
                const containerWidth = containerRef.current?.clientWidth ?? 0;
                const sequenceRect = seqRef.current?.getBoundingClientRect?.();
                const sequenceWidth = sequenceRect?.width ?? 0;
                const sequenceHeight = sequenceRect?.height ?? 0;
                if (isVertical) {
                    const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
                    if (containerRef.current && parentHeight > 0) {
                        const targetHeight = Math.ceil(parentHeight);
                        if (containerRef.current.style.height !== `${targetHeight}px`)
                            containerRef.current.style.height = `${targetHeight}px`;
                    }
                    if (sequenceHeight > 0) {
                        setSeqHeight(Math.ceil(sequenceHeight));
                        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
                        const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
                        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
                    }
                } else if (sequenceWidth > 0) {
                    setSeqWidth(Math.ceil(sequenceWidth));
                    const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
                    setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
                }
            }, [isVertical]);

            useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

            useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

            useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

            const cssVariables = useMemo(
                () => ({
                    '--logoloop-gap': `${gap}px`,
                    '--logoloop-logoHeight': `${logoHeight}px`,
                    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
                }),
                [gap, logoHeight, fadeOutColor]
            );

            const rootClassName = useMemo(
                () =>
                    [
                        'logoloop',
                        isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
                        fadeOut && 'logoloop--fade',
                        scaleOnHover && 'logoloop--scale-hover',
                        className
                    ]
                        .filter(Boolean)
                        .join(' '),
                [isVertical, fadeOut, scaleOnHover, className]
            );

            const handleMouseEnter = useCallback(() => {
                if (effectiveHoverSpeed !== undefined) setIsHovered(true);
            }, [effectiveHoverSpeed]);
            const handleMouseLeave = useCallback(() => {
                if (effectiveHoverSpeed !== undefined) setIsHovered(false);
            }, [effectiveHoverSpeed]);

            const renderLogoItem = useCallback(
                (item, key) => {
                    if (renderItem) {
                        return React.createElement('li', { className: 'logoloop__item', key: key, role: 'listitem' }, renderItem(item, key));
                    }
                    const isNodeItem = 'node' in item;
                    const content = isNodeItem
                        ? React.createElement('span', { className: 'logoloop__node', 'aria-hidden': !!item.href && !item.ariaLabel }, item.node)
                        : React.createElement('img', {
                            src: item.src,
                            srcSet: item.srcSet,
                            sizes: item.sizes,
                            width: item.width,
                            height: item.height,
                            alt: item.alt ?? '',
                            title: item.title,
                            loading: 'lazy',
                            decoding: 'async',
                            draggable: false
                        });
                    const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
                    const itemContent = item.href
                        ? React.createElement('a', {
                            className: 'logoloop__link',
                            href: item.href,
                            'aria-label': itemAriaLabel || 'logo link',
                            target: '_blank',
                            rel: 'noreferrer noopener'
                        }, content)
                        : content;

                    return React.createElement('li', { className: 'logoloop__item', key: key, role: 'listitem' }, itemContent);
                },
                [renderItem]
            );

            const logoLists = useMemo(
                () =>
                    Array.from({ length: copyCount }, (_, copyIndex) =>
                        React.createElement('ul', {
                            className: 'logoloop__list',
                            key: `copy-${copyIndex}`,
                            role: 'list',
                            'aria-hidden': copyIndex > 0,
                            ref: copyIndex === 0 ? seqRef : undefined
                        }, logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`)))
                    ),
                [copyCount, logos, renderLogoItem]
            );

            const containerStyle = useMemo(
                () => ({
                    width: isVertical
                        ? toCssLength(width) === '100%'
                            ? undefined
                            : toCssLength(width)
                        : (toCssLength(width) ?? '100%'),
                    ...cssVariables,
                    ...style
                }),
                [width, cssVariables, style, isVertical]
            );

            return React.createElement('div', {
                ref: containerRef,
                className: rootClassName,
                style: containerStyle,
                role: 'region',
                'aria-label': ariaLabel
            }, React.createElement('div', {
                className: 'logoloop__track',
                ref: trackRef,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave
            }, logoLists));
        }
    );

    LogoLoop.displayName = 'LogoLoop';
    window.LogoLoop = LogoLoop;

    // Helper function to create SVG partner badges
    const createPartnerNode = (title, iconSvg, color) => {
        return React.createElement('div', {
            style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                borderRadius: '30px',
                background: 'rgba(248, 250, 252, 0.9)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                fontWeight: 600,
                fontSize: '15px',
                color: '#334155',
                whiteSpace: 'nowrap'
            }
        }, [
            React.createElement('span', { key: 'icon', style: { display: 'flex', color: color || '#7c3aed' } }, iconSvg),
            React.createElement('span', { key: 'text' }, title)
        ]);
    };

    const techPartners = [
        {
            node: createPartnerNode('aws partner network', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M18.75 14.25a.75.75 0 0 0-.75.75c0 1.28-1.56 2.25-3.75 2.25s-3.75-.97-3.75-2.25a.75.75 0 0 0-1.5 0c0 2.22 2.36 3.75 5.25 3.75s5.25-1.53 5.25-3.75a.75.75 0 0 0-.75-.75z' }),
                React.createElement('path', { d: 'M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm-3.5 13.5a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0zm7 0a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0z' })
            ), '#FF9900'),
            title: 'AWS Partner Network',
            href: 'https://aws.amazon.com'
        },
        {
            node: createPartnerNode('Azure Machine Learning', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' })
            ), '#0078D4'),
            title: 'Azure Machine Learning',
            href: 'https://azure.microsoft.com'
        },
        {
            node: createPartnerNode('Google Cloud Platform', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z' })
            ), '#4285F4'),
            title: 'Google Cloud Platform',
            href: 'https://cloud.google.com'
        },
        {
            node: createPartnerNode('Amazon SageMaker', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-2h2zm0-4h-2V7h2z' })
            ), '#FF9900'),
            title: 'Amazon SageMaker',
            href: 'https://aws.amazon.com/sagemaker'
        },
        {
            node: createPartnerNode('Vertex AI', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z' })
            ), '#1A73E8'),
            title: 'Vertex AI',
            href: 'https://cloud.google.com/vertex-ai'
        },
        {
            node: createPartnerNode('React & Next.js', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
                React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
                React.createElement('ellipse', { cx: 12, cy: 12, rx: 10, ry: 4 }),
                React.createElement('ellipse', { cx: 12, cy: 12, rx: 10, ry: 4, transform: 'rotate(60 12 12)' }),
                React.createElement('ellipse', { cx: 12, cy: 12, rx: 10, ry: 4, transform: 'rotate(120 12 12)' })
            ), '#61DAFB'),
            title: 'React & Next.js',
            href: 'https://react.dev'
        },
        {
            node: createPartnerNode('TypeScript & Tailwind', React.createElement('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'currentColor' },
                React.createElement('path', { d: 'M3 3h18v18H3V3zm11.5 12.5v-2h-3v-1.5h3v-2h-3v-1.5h3v-2h-5v9h5z' })
            ), '#3178C6'),
            title: 'TypeScript & Tailwind',
            href: 'https://tailwindcss.com'
        }
    ];

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('logo-loop-container');
        if (container) {
            const root = ReactDOM.createRoot ? ReactDOM.createRoot(container) : null;
            const element = React.createElement(LogoLoop, {
                logos: techPartners,
                speed: 70,
                direction: 'left',
                logoHeight: 44,
                gap: 24,
                hoverSpeed: 0,
                scaleOnHover: true,
                fadeOut: true,
                fadeOutColor: '#ffffff',
                ariaLabel: 'Technology partners and platforms'
            });

            if (root) {
                root.render(element);
            } else if (ReactDOM.render) {
                ReactDOM.render(element, container);
            }
        }
    });
})();
