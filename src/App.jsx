import './index.css'
import * as d3 from 'd3';
import { useEffect, useRef, useState } from "react";
import DarkModeSwitch from "./components/DarkmodeSwitch.jsx";
import BracketView from "./charts/BracketView.jsx";
import { JSONToHierarchy } from "./data/util.js";
import PassesChordView from "./charts/PassesChordView.jsx";
import BackToTop from "./components/BackToTop.jsx";
import PassesNetworkView from "./charts/PassesNetworkView.jsx";
import CountryEntry from "./components/CountryEntry.jsx";
import {useMatch} from "../Context.jsx";

function App() {

    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    const { match } = useMatch();

    useEffect(() => {
        d3.json('src/data/bracket.json')
            .then(fetchedData => {
                setBracket(JSONToHierarchy(fetchedData));
                setLoading(false);
            })
            .catch(error => {
                setLoading(true);
            });
    }, []);

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="container pt-3 fw-lighter">
                    <div className="draw-section">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="fs-2">EURO 2024 Match Stats</div>
                            <DarkModeSwitch />
                        </div>
                    </div>
                    <div className="draw-section">
                        <BracketView root={bracket} />
                    </div>
                    { match !== null && (
                        <>
                            <div className="mb-5">
                                <CountryEntry />
                            </div>
                            <div className="eb-garamond fs-3">
                                First Half
                                <hr className="my-3"/>
                            </div>
                            <div className="row draw-section">
                                <div className="col-lg-6">
                                    <PassesNetworkView period={"FirstHalf"} />
                                </div>
                                <div className="col-lg-6">
                                    <PassesChordView period={"FirstHalf"} />
                                </div>
                            </div>
                            <div className="eb-garamond fs-3">
                                Second Half
                                <hr className="my-3"/>
                            </div>
                            <div className="row draw-section">
                                <div className="col-lg-6">
                                    <PassesNetworkView period={"SecondHalf"} />
                                </div>
                                <div className="col-lg-6">
                                    <PassesChordView period={"SecondHalf"} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            {/*TODO: absolute positioning */}
            {/*<div className="d-flex justify-content-center p-2">*/}
            {/*    <BackToTop />*/}
            {/*</div>*/}
        </>
    );
}

export default App;
