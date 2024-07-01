import './index.css'
import * as d3 from 'd3';
import { useEffect, useRef, useState } from "react";
import DarkModeSwitch from "./components/DarkmodeSwitch.jsx";
import BracketView from "./charts/BracketView.jsx";
import { JSONToHierarchy } from "./data/util.js";
import PassesChordView from "./charts/PassesChordView.jsx";
import BackToTop from "./components/BackToTop.jsx";

function App() {

    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

    const detailViewRef = useRef(null); // Add a ref for the detail view section

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
                    <div ref={detailViewRef} className="draw-section pt-2">
                        <PassesChordView />
                    </div>
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
