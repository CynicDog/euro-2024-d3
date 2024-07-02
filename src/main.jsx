import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
    LayoutProvider,
    MatchProvider,
    PlayerProvider,
    ScaleProvider,
    TeamProvider,
    ThemeProvider
} from "../Context.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <LayoutProvider>
            <ScaleProvider>
                <MatchProvider>
                    <TeamProvider>
                        <PlayerProvider>
                            <App/>
                        </PlayerProvider>
                    </TeamProvider>
                </MatchProvider>
            </ScaleProvider>
        </LayoutProvider>
    </ThemeProvider>
)
