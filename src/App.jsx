import './index.css'
import * as d3 from 'd3';
import {useEffect, useState} from "react";
import DarkModeSwitch from "./components/DarkmodeSwitch.jsx";
import PassesChordView from "./views/PassesChordView.jsx";
import PassesNetworkView from "./views/PassesNetworkView.jsx";
import CountryEntry from "./components/CountryEntry.jsx";
import {useMatch, useTheme} from "../Context.jsx";
import RoundsView from "./views/RoundsView.jsx";
import GitHub from "../public/GitHub.jsx";

function App() {

    const {theme} = useTheme();
    const {match} = useMatch();

    const [rounds, setRounds] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        d3.json('https://raw.githubusercontent.com/CynicDog/euro-2024-d3/main/src/data/rounds.json')
            .then(data => {
                setRounds(data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(true);
            })
    }, []);

    return (
        <div className="app-container d-flex flex-column min-vh-100">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="container p-3 fw-lighter flex-grow-1">
                    <div className="d-flex justify-content-end">
                        <a className={`link-underline-opacity-0 eb-garamond fw-lighter ${theme === 'light' ? "link-dark" : "link-light"}`}
                           href="https://cynicdog.github.io">
                            back to blog
                        </a>
                    </div>
                    <div className="draw-section">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="merriweather-light fs-1">EURO 2024 Match Stats</div>
                            <DarkModeSwitch/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="sticky-rounds">
                                <RoundsView rounds={rounds}/>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            {match !== null && (
                                <>
                                    <div className="mb-5">
                                        <CountryEntry/>
                                    </div>
                                    <div className="eb-garamond fs-3">
                                        First Half
                                        <hr className="my-3"/>
                                    </div>
                                    <div className="row draw-section">
                                        <div className="col-lg-6">
                                            <PassesNetworkView period={"FirstHalf"}/>
                                        </div>
                                        <div className="col-lg-6">
                                            <PassesChordView period={"FirstHalf"}/>
                                        </div>
                                    </div>
                                    <div className="eb-garamond fs-3">
                                        Second Half
                                        <hr className="my-3"/>
                                    </div>
                                    <div className="row draw-section">
                                        <div className="col-lg-6">
                                            <PassesNetworkView period={"SecondHalf"}/>
                                        </div>
                                        <div className="col-lg-6">
                                            <PassesChordView period={"SecondHalf"}/>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-center align-items-center text-secondary mt-3 pb-3">
                <span
                    className="me-2"
                    style={{cursor: "pointer"}}
                    onClick={() => window.location.href = "https://github.com/CynicDog/euro-2024-d3"}>
                    Code on GitHub
                </span>
                <GitHub/>
            </div>
        </div>
    );
}

export default App;
