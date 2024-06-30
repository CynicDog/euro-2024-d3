// Theme Provider
import {createContext, useContext, useState} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = () => useContext(ThemeContext);

const MatchContext = createContext();

export const MatchProvider = ({children}) => {
    const [match, setMatch] = useState(null);

    return (
        <MatchContext.Provider value={{match, setMatch}}>
            {children}
        </MatchContext.Provider>
    )
}

export const useMatch = () => useContext(MatchContext);