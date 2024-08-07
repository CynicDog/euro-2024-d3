import React from 'react';
import { useMatch } from "../../Context.jsx";
import * as d3 from "d3";

const Round = ({ title, selectedMatch, matches, setMatch }) => (
    <div className="mb-3 me-5">
        <div className="eb-garamond fs-3">
            {title}
        </div>
        <hr />
        {matches.map((r, index) => {
            return (
            <div
                key={index}
                className={`filter-btn merriweather-light my-2 ${selectedMatch && selectedMatch.name === r.name ? 'fw-bold fs-5' : ''}`}
                onClick={() => {
                    d3.json(`https://raw.githubusercontent.com/CynicDog/euro-2024-d3/main/src/data/${r.name}.json`).then(data => setMatch(data));
                }}>
                {r.team_1} vs. {r.team_2}
            </div>
        )})}
    </div>
);

const RoundsView = ({ rounds }) => {
    const { match, setMatch } = useMatch();

    const roundTitles = {
        'round-of-sixteen': 'Round of Sixteen',
        'quarter-finals': 'Quarter Finals',
        'semi-finals': 'Semi Finals',
        'finals': 'Finals'
    };

    return (
        <>
            {Object.keys(roundTitles).map((round) => {
                const matches = rounds.filter(r => r.team_1 !== '' && r.round === round);
                return matches.length > 0 ? (
                    <Round key={round} title={roundTitles[round]} selectedMatch={match} matches={matches} setMatch={setMatch} />
                ) : null;
            })}
        </>
    );
};

export default RoundsView;
