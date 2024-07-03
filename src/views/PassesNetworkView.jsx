import {useEffect, useRef, useMemo, useCallback} from "react";
import * as d3 from "d3";
import { useMatch, usePlayer, useScale, useTeam, useTheme } from "../../Context.jsx";

const PassesNetworkView = ({ period }) => {
    const width = 500;
    const height = 500;
    const margin = { top: 30, right: 80, bottom: 30, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const defaultOpacity = 0.5;

    const { theme } = useTheme();
    const { match } = useMatch();
    const { team, setTeam } = useTeam();
    const { player } = usePlayer();

    const networkRef = useRef();

    useEffect(() => {
        setTeam(match?.home);
    }, [match]);

    useEffect(() => {
        updateNetworkDiagram();
    }, [match, team, theme]);

    useEffect(() => {
        highlightPlayerPassRoutes();
    }, [player]);

    const eventData = useMemo(() => {
        if (!match || !team) return [];

        return match.events.filter(
            e => e.teamId === team.teamId && e.type.displayName === "Pass" && e.period.displayName === period
        );
    }, [match, team, period]);

    const playerIds = useMemo(() => {
        return [...new Set(eventData.map(e => e.playerId))];
    }, [eventData]);

    const startNodes = useMemo(() => {
        return eventData.map(e => ({ x: e.x, y: e.y, playerId: e.playerId, period: period }));
    }, [eventData, period]);

    const endNodes = useMemo(() => {
        return eventData.map(e => ({ x: e.endX, y: e.endY, playerId: e.playerId, period: period }));
    }, [eventData, period]);

    const routes = useMemo(() => {
        return eventData.map(e => ({
            x1: e.x, y1: e.y, x2: e.endX, y2: e.endY, playerId: e.playerId, period: period
        }));
    }, [eventData, period]);

    const updateNetworkDiagram = () => {
        let svg = d3.select(networkRef.current).select("g");

        if (svg.empty()) {
            svg = d3.select(networkRef.current)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            svg.append("defs").append("marker")
                .attr("id", "arrowhead")
                .attr("viewBox", "0 0 10 10")
                .attr("refX", 8)
                .attr("refY", 5)
                .attr("markerWidth", 9)
                .attr("markerHeight", 9)
                .attr("orient", "auto-start-reverse")
                .append("path")
                .attr("d", "M 0 0 L 10 5 L 0 10 z")
                .attr("fill", "gray");

            svg.append("line")
                .attr("class", "direction-line")
                .attr("x1", innerWidth + 40)
                .attr("y1", innerHeight - 50)
                .attr("x2", innerWidth + 40)
                .attr("y2", 230)
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5")
                .attr("marker-end", "url(#arrowhead)");

            svg.append("text")
                .attr("class", "direction-label")
                .attr("x", innerWidth + 150)
                .attr("y", innerHeight / 2)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .attr("fill", "gray")
                .attr("transform", `rotate(90, ${innerWidth + 50}, ${innerHeight / 2})`)
                .text("Direction");
        }

        const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
        const colorScale = d3.scaleOrdinal().domain(playerIds).range(d3.schemeSet3);

        svg.selectAll(`.route-${period}`)
            .data(routes, d => `${d.playerId}-${d.period}-${d.x1}-${d.y1}-${d.x2}-${d.y2}`)
            .join("line")
            .attr("class", `route-${period}`)
            .attr("x1", d => xScale(d.y1))
            .attr("y1", d => yScale(d.x1))
            .attr("x2", d => xScale(d.y2))
            .attr("y2", d => yScale(d.x2))
            .attr("stroke", d => colorScale(d.playerId))
            .attr("stroke-width", 0.6)
            .attr("opacity", defaultOpacity);

        svg.selectAll(`.start-node-${period}`)
            .data(startNodes, d => `${d.playerId}-${d.period}-${d.x}-${d.y}`)
            .join("circle")
            .attr("class", `start-node-${period}`)
            .attr("cx", d => xScale(d.y))
            .attr("cy", d => yScale(d.x))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.playerId))
            .attr("opacity", defaultOpacity)
            .attr("stroke", theme === "light" ? "black" : "white")
            .attr("stroke-width", 0.3);

        svg.selectAll(`.end-node-${period}`)
            .data(endNodes, d => `${d.playerId}-${d.period}-${d.x}-${d.y}`)
            .join("circle")
            .attr("class", `end-node-${period}`)
            .attr("cx", d => xScale(d.y))
            .attr("cy", d => yScale(d.x))
            .attr("r", 3)
            .attr("fill", d => colorScale(d.playerId))
            .attr("opacity", defaultOpacity)
            .attr("stroke", theme === "light" ? "black" : "white")
            .attr("stroke-width", 0.3);
    }

    const highlightPlayerPassRoutes = () => {
        if (player.id !== null && player.period === period) {
            d3.selectAll(`.route-${period}`)
                .attr("stroke-width", 2)
                .attr("opacity", d => d.playerId === player.id ? 0.6 : 0.1);

            d3.selectAll(`.start-node-${period}`)
                .attr("r", 6)
                .attr("opacity", d => d.playerId === player.id ? 0.8 : 0.1);

            d3.selectAll(`.end-node-${period}`)
                .attr("r", 4)
                .attr("opacity", d => d.playerId === player.id ? 0.6 : 0.1);
        } else {
            d3.selectAll(`.route-${period}`)
                .attr("stroke-width", 0.6)
                .attr("opacity", defaultOpacity);

            d3.selectAll(`.start-node-${period}`)
                .attr("r", 5)
                .attr("opacity", defaultOpacity);

            d3.selectAll(`.end-node-${period}`)
                .attr("r", 3)
                .attr("opacity", defaultOpacity);
        }
    }

    return (
        <>
            {match !== null && (
                <div className="py-2">
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
