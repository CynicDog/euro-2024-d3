import * as d3 from 'd3';
import {useEffect, useState} from "react";
import DarkModeSwitch from "./components/DarkmodeSwitch.jsx";
import Formation from "./charts/Formation.jsx";

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        d3.json('src/data/data.json')
            .then(fetchedData => {
                console.log(fetchedData);
                setData(fetchedData);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {!loading && (
                <div className="container p-3">
                    <div style={{'marginBottom': '60px'}}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h1>⚽️ EURO 2024 Match Stats | 🇩🇪🏴󠁧󠁢󠁳󠁣󠁴󠁿 June 15th</h1>
                            <DarkModeSwitch/>
                        </div>
                        <div>Home:
                            <span>{data.home.name}</span>
                        </div>
                        <div>Away:
                            <span>{data.away.name}</span>
                        </div>
                    </div>

                    <div style={{'marginBottom': '60px'}}>
                        <h3>🏟️ Venue</h3>
                        <span id="venueName" className="mono">
                            {data.venueName}
                        </span>
                    </div>

                    <div className="d-flex align-items-center" style={{'marginBottom': '60px'}}>
                        <h3 className="me-3">🥅 Score</h3>
                        <span id="scoreSpan" className="underscore fs-5">
                            {data.ftScore}
                        </span>
                    </div>

                    <div style={{'marginBottom': '60px'}}>
                        <h3>📍 Formations</h3>

                        <div className="row">
                            <div className="col-md-6">
                                <div id="formation-home"
                                     className="responsive-svg-container border border-1 rounded-4 m-1 p-1">
                                    <Formation
                                        data={data.home.formations[0].formationPositions}
                                        team={'home'}/>
                                </div>
                                <div className="d-flex">
                                    <div className="ms-auto">Germany</div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div id="formation-away"
                                     className="responsive-svg-container border border-1 rounded-4 m-1 p-1">
                                    <Formation
                                        data={data.away.formations[0].formationPositions}
                                        team={'away'}/>
                                </div>
                                <div className="d-flex">
                                    <div className="ms-auto">Scotland</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div style={{'marginBottom': '60px'}}>
                        <h3>🚀 Passes</h3>
                        <div id="pass-home"></div>
                    </div>

                    {loading && <div>Loading...</div>}
                </div>
            )}
        </>
    );
}

export default App;
