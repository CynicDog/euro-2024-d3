import './index.css'
import * as d3 from 'd3';
import {useEffect, useState} from "react";
import DarkModeSwitch from "./components/DarkmodeSwitch.jsx";
import BracketView from "./charts/BracketView.jsx";
import {JSONToHierarchy} from "./data/util.js";

function App() {

    const [bracket, setBracket] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <div className="container p-3">
                    <div style={{'marginBottom': '60px'}}>
                        <div className="d-flex justify-content-between align-items-center">
                            {/*<h2>EURO 2024 Match Stats</h2>*/}
                            <DarkModeSwitch/>
                        </div>
                    </div>
                    <div>
                        <BracketView
                            root={bracket}/>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
