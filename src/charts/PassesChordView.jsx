import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useMatch, useScale, useTheme } from "../../Context.jsx";

const PassesChordView = () => {
    const width = 700;
    const height = 700;
    const outerRadius = Math.min(width, height) * 0.5 - 100;
    const innerRadius = outerRadius - 20;

    const { theme } = useTheme();
    const { scaledFontSize } = useScale();
    const { match } = useMatch();

    const [team, setTeam] = useState(null);

    useEffect(() => {
        setTeam(match?.home);
    }, [match]);

    const handleTeamClick = selectedTeam => {
        setTeam(selectedTeam);
    };

    const chordRef = useRef();

    useEffect(() => {
        if (!match) return;

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
                .attr("fill", (d, i) => d3.schemeSet3[i % 10])
                // UI interaction
                .on("mouseover", (event, d) => {
                    // Find all associated indices based on ribbon connections
                    const associatedIndices = [];

                    // Iterate through all ribbons to find associated indices
                    svg.selectAll(".ribbon")
                        .each(function(ribbonData) {
                            if (ribbonData.source.index === d.index || ribbonData.target.index === d.index) {
                                associatedIndices.push(ribbonData.source.index);
                                associatedIndices.push(ribbonData.target.index);
                            }
                        });

                    // Deduplicate and sort associated indices
                    const uniqueAssociatedIndices = [...new Set(associatedIndices)].sort((a, b) => a - b);

                    // Highlight ribbons associated with the selected chord
                    svg.selectAll(".ribbon")
                        .attr("opacity", ribbonData => {
                            return (ribbonData.source.index === d.index || ribbonData.target.index === d.index) ? 0.9 : 0.1;
                        });

                    // Adjust opacity for player labels associated with the selected chord
                    svg.selectAll(".player-label")
                        .attr("opacity", labelData => uniqueAssociatedIndices.includes(labelData.index) ? 1.0 : 0.1);

                    // Highlight the hovered chord
                    svg.selectAll(".group")
                        .attr("opacity", groupData => groupData.index === d.index ? 0.9 : 0.2);
                })
                .on("mouseout", () => {
                    // Reset the opacity of all ribbons
                    svg.selectAll(".ribbon")
                        .attr("opacity", 0.7);

                    // Reset the opacity of all chords
                    svg.selectAll(".group")
                        .attr("opacity", 1);

                    // Reset the opacity of all labels
                    svg.selectAll(".player-label")
                        .attr("opacity", 1);
                })
                .append("title")
                .text(d => {
                    const player = team.players.find(p => p.playerId === playerIds[d.index]);
                    return `${player.name}, total ${d.value} passes`;
                });

        // Render ribbons (chords)
        svg.selectAll(".ribbon")
            .data(chords)
            .join("path")
                .attr("class", "ribbon")
                .attr("d", ribbon)
                .attr("fill", d => d3.schemeSet3[d.target.index % 10])
                .attr("opacity", 0.7)
                .append("title")
                .text(d => {
                    const sourcePlayer = team.players.find(p => p.playerId === playerIds[d.source.index]);
                    const targetPlayer = team.players.find(p => p.playerId === playerIds[d.target.index]);
                    return `From ${sourcePlayer.name} to ${targetPlayer.name}, ${d.source.value} passes\nFrom ${targetPlayer.name} to ${sourcePlayer.name}, ${d.target.value} passes`;
                });

        // Render text labels around the arcs
        svg.selectAll(".player-label")
            .data(chords.groups)
            .join("text")
                .attr("class", "player-label")
                .attr("transform", d => {
                    d.angle = (d.startAngle + d.endAngle) / 2;
                    return `
                            rotate(${(d.angle * 180 / Math.PI - 91)})
                            translate(${outerRadius + 10})
                            ${d.angle > Math.PI ? "rotate(180)" : ""}
                        `;
                })
                .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
                .attr("fill", theme === 'light' ? "black" : "white")
                .attr("font-size", `${scaledFontSize}px`)
                .text(d => {
                    const fullName = match.playerIdNameDictionary[playerIds[d.index]];
                    const lastName = fullName.split(" ").pop();
                    return lastName;
                });

        // Scroll to chord view
        if (chordRef.current) {
            chordRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [match, team, scaledFontSize]);

    return (
        <div>
            {match !== null && (
                <>
                    <div className="d-flex justify-content-end">
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
                    {/* Chart view */}
                    <svg
                        ref={chordRef}
                        width="70%"
                        height="70%"
                        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
                        style={{ display: 'block', margin: '0 auto' }}
                    ></svg>
                </>
            )}
        </div>
    );
};

export default PassesChordView;
