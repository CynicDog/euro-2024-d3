import {useMatch, useScale, useTeam, useTheme} from "../../Context.jsx";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PassesNetworkView = ({ period }) => {
    const width = 500;
    const height = 500;
    const margin = { top: 30, right: 80, bottom: 30, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { theme } = useTheme();
    const { scaledFontSize } = useScale();
    const { match } = useMatch();

    const { team, setTeam } = useTeam();

    useEffect(() => {
        setTeam(match?.home);
    }, [match]);

    useEffect(() => {
        if (team) {
            updateNetworkDiagram(team);
        }
    }, [match, team, theme, scaledFontSize]);

    const networkRef = useRef();

    const updateNetworkDiagram = (selectedTeam) => {
        if (!match) return;

        // Filter pass events for the selected team
        const eventData = match.events.filter(
            e => e.teamId === selectedTeam?.teamId && e.type.displayName === "Pass" && e.period.displayName === period
        );

        // Extract nodes and edges spatial location
        const startNodes = eventData.map(e => ({ x: e.x, y: e.y, playerId: e.playerId }));
        const endNodes = eventData.map(e => ({ x: e.endX, y: e.endY, playerId: e.playerId }));
        const routes = eventData.map(e => ({
            x1: e.x,
            y1: e.y,
            x2: e.endX,
            y2: e.endY,
            playerId: e.playerId
        }));

        const playerIds = [...new Set(startNodes.map(d => d.playerId))];

        // Clear existing nodes
        d3.select(networkRef.current).selectAll("*").remove();

        // Create the SVG container
        const svg = d3.select(networkRef.current)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Set up scales
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([innerHeight, 0]);

        const colorScale = d3.scaleOrdinal()
            .domain(playerIds)
            .range(d3.schemeSet3);

        // Transition
        const t = d3.transition()
            .duration(500)
            .ease(d3.easeExpOut);

        // Append the lines to the SVG with transitions
        svg.selectAll(".route")
            .data(routes)
            .join(
                enter => enter
                    .append("line")
                        .attr("class", "route")
                        .attr("x1", d => xScale(d.y1))
                        .attr("y1", d => yScale(d.x1))
                        .attr("x2", d => xScale(d.y1))
                        .attr("y2", d => yScale(d.x1))
                        .attr("stroke", d => colorScale(d.playerId))
                        .attr("stroke-width", .6)
                        .attr("opacity", 0.3)
                        .call(enter => enter
                            // .transition(t.duration(800))
                            .attr("x2", d => xScale(d.y2))
                            .attr("y2", d => yScale(d.x2))
                        ),
                update => update,
                exit => exit.call(exit => exit
                    // .transition(t)
                    .attr("x2", d => xScale(d.x1))
                    .attr("y2", d => yScale(d.y1))
                    .style("opacity", 0)
                    .remove()
                )
            );

        // Append the start nodes to the SVG with transitions
        svg.selectAll(".start-node")
            .data(startNodes)
            .join(
                enter => enter
                    .append("circle")
                        .attr("class", "start-node")
                        .attr("cx", d => xScale(d.y))
                        .attr("cy", d => yScale(d.x))
                        .attr("r", 0)
                        .attr("fill", d => colorScale(d.playerId))
                        .attr("opacity", 0.5)
                        .attr("stroke", theme === "light"? "black" : "white")
                        .attr("stroke-width", 0.3)
                        .call(enter => enter
                            // .transition(t)
                            .attr("r", 4)
                            .style("opacity", 0.6)
                        ),
                update => update,
                exit => exit.call(exit => exit.transition(t)
                    .attr("r", 0)
                    .style("opacity", 0)
                    .remove()
                )
            );

        // Append the end nodes to the SVG with transitions
        svg.selectAll(".end-node")
            .data(endNodes)
            .join(
                enter => enter
                    .append("circle")
                        .attr("class", "end-node")
                        .attr("cx", d => xScale(d.y))
                        .attr("cy", d => yScale(d.x))
                        .attr("r", 0)
                        .attr("fill", d => colorScale(d.playerId))
                        .attr("opacity", 0.3)
                        .attr("stroke", theme === "light"? "black" : "white")
                        .attr("stroke-width", 0.3)
                        .call(enter => enter
                            // .transition(t)
                            .attr("r", 2)
                            .style("opacity", 0.4)
                        ),
                update => update,
                exit => exit.call(exit => exit
                    // .transition(t)
                    .attr("r", 0)
                    .style("opacity", 0)
                    .remove()
                )
            );
    };

    return (
        <>
            {match !== null && (
                <div className="py-2">
                    {/* Network view */}
                    <svg
                        ref={networkRef}
                        width="80%"
                        height="80%"
                        viewBox={`0 0 ${width} ${height}`}
                        style={{ display: 'block', margin: '0 auto' }}>
                    </svg>
                </div>
            )}
        </>
    );
}

export default PassesNetworkView;
