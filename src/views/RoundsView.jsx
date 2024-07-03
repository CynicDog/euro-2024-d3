import React from 'react';
import { useMatch } from "../../Context.jsx";
import * as d3 from "d3";

const Round = ({ title, matches, setMatch }) => (
    <div className="mb-3 me-5">
        <div className="eb-garamond fs-3">
            {title}
        </div>
        <hr />
        {matches.map((r, index) => (
            <div
                className="filter-btn merriweather-light my-2"
                key={index}
                onClick={() => {
                    d3.json(`src/data/${r.name}.json`).then(data => setMatch(data));
                }}>
                {r.team_1} vs. {r.team_2}
            </div>
        ))}
    </div>
);

const RoundsView = ({ rounds }) => {

    const { setMatch } = useMatch();

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
                    <Round key={round} title={roundTitles[round]} matches={matches} setMatch={setMatch} />
                ) : null;
            })}
        </>
    );
};

export default RoundsView;
