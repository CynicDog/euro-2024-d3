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

const ColorContext = createContext();

export const ColorProvider = ({children}) => {
    const [color, setColor] = useState({
        home: '#ACE1AF',
        away: '#FFC0CB'
    });

    return (
        <ColorContext.Provider value={{color}}>
            {children}
        </ColorContext.Provider>
    )
}

export const useColor = () => useContext(ColorContext);