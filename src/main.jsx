import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {LayoutProvider, MatchProvider, ScaleProvider, ThemeProvider} from "../Context.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <LayoutProvider>
            <ScaleProvider>
                <MatchProvider>
                    <App/>
                </MatchProvider>
            </ScaleProvider>
        </LayoutProvider>
    </ThemeProvider>
)
