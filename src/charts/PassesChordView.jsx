import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import ChartContainer from "../components/ChartContainer.jsx";
import { useMatch } from "../../Context.jsx";

const PassesChordView = () => {
    const width = 400;
    const height = 400;
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const outerRadius = Math.min(width, height) * 0.5 - 30;
    const innerRadius = outerRadius - 20;

    const { match } = useMatch();
    const [team, setTeam] = useState(null);

    const handleTeamClick = selectedTeam => {
        setTeam(selectedTeam);
    };

    const chordRef = useRef();

    useEffect(() => {

        if (!match) return;

        // TODO: initialize team on match select

        // Filter pass events for the selected team
        const eventData = match.events.filter(
            e => e.teamId === team?.teamId && e.type.displayName === "Pass"
        );

        // Extract unique player IDs involved in passes
        let playerIds = [...new Set(eventData.flatMap(e => [e.playerId]))];

        // Create matrix for chord diagram
        let n = playerIds.length;
        let matrix = Array.from({ length: n }, () => Array(n).fill(0));

        // Mapping player IDs to indices
        let playerIndexMap = Object.fromEntries(
            playerIds.map((id, index) => [id, index])
        );

        // Populate the matrix
        for (let i = 0; i < eventData.length - 1; i++) {
            let fromIndex = playerIndexMap[eventData[i].playerId];
            let toIndex = playerIndexMap[eventData[i + 1].playerId];
            matrix[fromIndex][toIndex]++;
        }

        const chord = d3.chord()
            .padAngle(20 / innerRadius)
            .sortSubgroups(d3.descending);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon()
            .radius(innerRadius);

        const chords = chord(matrix);

        // Select the SVG container
        const svg = d3.select(chordRef.current);

        // Render groups (arcs)
        svg.selectAll(".group")
            .data(chords.groups)
            .join("path")
            .attr("class", "group")
            .attr("d", arc)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
            .append("title")
            .text(d => `Player: ${playerIds[d.index]}, Value: ${d.value}`);

        // Render ribbons (chords)
        svg.selectAll(".ribbon")
            .data(chords)
            .join("path")
            .attr("class", "ribbon")
            .attr("d", ribbon)
            .attr("fill", d => d3.schemeCategory10[d.target.index % 10])
            .attr("opacity", 0.7)
            .append("title")
            .text(d => `From: ${playerIds[d.source.index]} to ${playerIds[d.target.index]}, Value: ${d.source.value}`);

    }, [match, team]);

    return (
        <div>
            {match === null ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="d-flex fs-5">
                        <span
                            className={`country-name ${team === match.home ? 'text-decoration-underline bg-primary-subtle' : 'bg-light-subtle'}`}
                            onClick={() => handleTeamClick(match.home)}>
                            {match.home.countryName}
                        </span>
                        <span className="px-1">vs.</span>
                        <span
                            className={`country-name ${team === match.away ? 'text-decoration-underline bg-primary-subtle' : 'bg-light-subtle'}`}
                            onClick={() => handleTeamClick(match.away)}>
                            {match.away.countryName}
                        </span>
                    </div>
                    <ChartContainer width={width} height={height} margin={margin}>
                        <svg
                            ref={chordRef}
                            width={width}
                            height={height}
                            viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
                            style={{ maxWidth: "100%", height: "auto", font: "10px sans-serif" }}
                        ></svg>
                    </ChartContainer>
                </div>
            )}
        </div>
    );
};

export default PassesChordView;
