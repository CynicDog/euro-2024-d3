import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useColor } from "../../Context.jsx";
import ChartContainer from "../components/ChartContainer.jsx";

const Formation = (props) => {

    const { color } = useColor();

    const margin = { top: 20, right: 40, bottom: 20, left: 40 };
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const formationRef = useRef();

    useEffect(() => {

        const formationContainer = d3.select(formationRef.current);

        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([innerHeight, 0]);

        formationContainer
            .selectAll('.formation-circle')
            .data(props.data)
            .join('circle')
                .attr('class', 'formation-circle')
                .attr('cx', d => xScale(d.horizontal))
                .attr('cy', d => yScale(d.vertical))
                .attr('r', 15)
                .attr('fill', color[props.team])
                .attr('stroke', 'black');

    }, [props.data]);

    return (
        <ChartContainer
            width={width}
            height={height}
            margin={margin}>
            <g ref={formationRef}></g>
        </ChartContainer>
    );
};

export default Formation;
