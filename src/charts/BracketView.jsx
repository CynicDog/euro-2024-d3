import { tree } from "d3-hierarchy";
import * as d3 from "d3";
import { link, curveBumpX } from "d3-shape";
import { useEffect, useRef } from "react";
import { useMatch, useScale, useTheme } from "../../Context.jsx";

const BracketView = ({ root, detailViewRef }) => {
    const { theme } = useTheme();
    const { scaledFontSize } = useScale();
    const { setMatch } = useMatch();

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 100, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const bracketRef = useRef();

    useEffect(() => {
        const bracketContainer = d3.select(bracketRef.current);

        const treeLayoutGenerator = tree().size([innerHeight, innerWidth])(root);

        const linkGenerator = link(curveBumpX)
            .x(d => innerWidth - d.y)
            .y(d => d.x);

        // Render links
        bracketContainer
            .selectAll(".bracket-link")
            .data(root.links())
            .join("path")
            .attr("class", "bracket-link")
            .attr("d", d => linkGenerator(d))
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.6);

        // Render nodes
        bracketContainer
            .selectAll(".bracket-node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "bracket-node")
            .attr("cx", d => innerWidth - d.y)
            .attr("cy", d => d.x)
            .attr("r", 4)
            .attr("fill", "gray")
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.6);

        // Render labels
        const labels = bracketContainer
            .selectAll(".bracket-label")
            .data(root.descendants())
            .join("text")
            .attr("class", "bracket-label")
            .attr("x", d => innerWidth - d.y - 4)
            .attr("y", d => d.x - 13)
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
            .style("font-weight", 100)
            .style("fill", `${theme === 'light' ? "black" : "white"}`)
            .style("font-size", `${scaledFontSize}px`)
            .text(d => (d.data.team_1 !== "" ? `${d.data.team_1} vs. ${d.data.team_2}` : ""));

        // Measure text widths and set background widths
        labels.each(function (d) {
            const bbox = this.getBBox();
            if (bbox.width > 0) {
                d.bboxWidth = bbox.width + 3;
            }
        });

        // Render background on labels based on measured width
        bracketContainer
            .selectAll(".bracket-label-background")
            .data(root.descendants())
            .join("rect")
            .attr("class", "bracket-label-background")
            .attr("x", d => innerWidth - d.y - 5)
            .attr("y", d => d.x - 22)
            .attr("rx", "3")
            .attr("height", "16px")
            .attr("width", d => d.bboxWidth)
            .style("fill", "gray")
            .style("opacity", 0.15)
            .style("cursor", "pointer")
            .on("click", (e, d) => {
                // fetch clicked match data
                d3.json(`src/data/${d.data.name}.json`).then(data => setMatch(data));
            });
    }, [root, theme, scaledFontSize]);

    return (
        <svg viewBox={`0 0 ${width} ${height}`}>
            <g ref={bracketRef} transform={`translate(${margin.left}, ${margin.top})`}></g>
        </svg>
    );
};

export default BracketView;
