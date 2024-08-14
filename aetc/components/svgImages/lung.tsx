import React, { ReactElement, useEffect, useRef, useState } from "react";
import Lung from "../../assets/lung";

export const LungImage = () => {
    const containerRef = useRef<SVGSVGElement>(null);
    const [ids, setIds] = useState<Array<{ id: string | null, label: string | null }>>([])
    const [counter, setCounter] = useState(0) // state used just to persist an click color highlight after mouseleave event

    const highlightcolor = "#708090"

    const handleMouseEnter = (e: MouseEvent) => {
        const target = e.currentTarget as SVGElement;
        target.style.opacity = `0.5`;
        target.style.fill = highlightcolor
        target.style.cursor = "pointer"
    }
    const handleMouseLeave = (e: MouseEvent) => {
        const target = e.currentTarget as SVGElement;
        // const found = ids.find(id => id.id == target.id);

        // console.log(found)

        // if (found) return
        target.style.fill = ""
        target.style.opacity = `0`;
        // highLightPath();
        setCounter(count => count + 1)
    }

    useEffect(() => {
        highLightPath()
        console.log(counter)
    }, [ids, counter])

    const highLightPath = () => {
        if (containerRef.current) {
            for (let i = 0; i < ids.length; i++) {
                const rect = containerRef.current.getElementById(ids[i].id as string) as SVGRectElement;
                rect.style.fill = highlightcolor
                rect.style.opacity = `0.5`;
            }
        }
    }

    const handleClickLister = (e: Event) => {
        console.log(e)
        const target = e.currentTarget as SVGElement;
        const label = target.getAttribute('data-label'); // Retrieve custom attribute
        const id = target.id
        setIds(ids => [...ids, { id, label }]);
    }


    useEffect(() => {
        let rects: HTMLCollectionOf<SVGRectElement>;
        if (containerRef.current) {
            rects = containerRef.current.getElementsByTagName('rect');
            for (let i = 0; i < rects.length; i++) {
                rects[i].style.fill = ``;
                rects[i].style.opacity = `0`;
                rects[i].addEventListener('mouseleave', handleMouseLeave);
                rects[i].addEventListener('mouseenter', handleMouseEnter);
                rects[i].addEventListener('click', handleClickLister)

            }
        }
        return () => {
            for (let i = 0; i < rects.length; i++) {
                rects[i].removeEventListener('mouseleave', handleMouseLeave);
                rects[i].removeEventListener('mouseenter', handleMouseEnter);
            }
        };
    }

        , [])


    return (
        <div  >
            <Lung ref={containerRef} />
        </div>
    );

};

export default LungImage;


interface DynamicSVGProps {
    svgContent: string;
    onClickHandlers: {
        [key: string]: (event: React.MouseEvent<SVGElement>) => void;
    };
}


const DynamicSVG: React.FC<DynamicSVGProps> = ({ svgContent, onClickHandlers }) => {
    const svgContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (svgContainerRef.current) {
            // Clear any existing content
            svgContainerRef.current.innerHTML = svgContent;
            // Add event listeners
            Object.keys(onClickHandlers).forEach((selector) => {
                const elements = svgContainerRef.current?.querySelectorAll(selector);
                elements?.forEach((element) => {

                    //@ts-ignore
                    element.addEventListener('click', onClickHandlers[selector]);
                });
            });

            // Cleanup event listeners on component unmount
            return () => {
                Object.keys(onClickHandlers).forEach((selector) => {
                    const elements = svgContainerRef.current?.querySelectorAll(selector);
                    elements?.forEach((element) => {
                        //@ts-ignore
                        element.removeEventListener('click', onClickHandlers[selector]);
                    });
                });
            };
        }
    }, [svgContent, onClickHandlers]);

    return <Lung />
};
