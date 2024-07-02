// Theme Provider
import {createContext, useContext, useEffect, useState} from "react";
import * as d3 from "d3";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = () => useContext(ThemeContext);

// Layout Provider
const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isDesktopLayout, setIsDesktopLayout] = useState(window.innerWidth >= 700);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktopLayout(window.innerWidth >= 700);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <LayoutContext.Provider value={{ isDesktopLayout }}>
            {children}
        </LayoutContext.Provider>
    );
};
export const useLayout = () => useContext(LayoutContext);

// Scale Provider
const ScaleContext = createContext();

export const ScaleProvider = ({ children }) => {

    const fontSizeScale = d3.scaleLinear()
        .domain([600, 1200])
        .range([20, 12])
        .clamp(true);

    const [fontSize, setFontSize] = useState(fontSizeScale(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            setFontSize(fontSizeScale(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ScaleContext.Provider value={{ scaledFontSize: fontSize }}>
            {children}
        </ScaleContext.Provider>
    );
};

export const useScale = () => useContext(ScaleContext);

// Match Provider
const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
    const [match, setMatch] = useState(null);

    return (
        <MatchContext.Provider value={{ match, setMatch }}>
            {children}
        </MatchContext.Provider>
    )
}
export const useMatch = () => useContext(MatchContext);

// Team Provider
const TeamContext = createContext();
export const TeamProvider = ({ children }) => {
    const [team, setTeam] = useState(null);

    return (
        <TeamContext.Provider value={{ team, setTeam}}>
            {children}
        </TeamContext.Provider>
    )
}

export const useTeam = () => useContext(TeamContext);