import React, {useEffect} from 'react';
import {useTheme} from "../../Context.jsx";

const DarkModeSwitch = () => {
    const {theme, toggleTheme} = useTheme();
    const isDarkMode = theme === 'dark';

    const handleToggleTheme = () => {
        toggleTheme();
    };

    useEffect(() => {
        updateHtmlTheme(theme);
    }, [theme]);

    const updateHtmlTheme = (mode) => {
        const htmlElement = document.querySelector('html');

        if (mode === 'dark') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-bs-theme');
        }
    };

    return (
        <Switch
            id="dark-mode-switch"
            isChecked={isDarkMode}
            onChange={handleToggleTheme}
        />
    );
};

const Switch = ({id, isChecked, onChange}) => {
    return (
        <div className="form-check form-switch">
            <label className="form-check-label" htmlFor={id}>
            </label>
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id={id}
                checked={isChecked}
                onChange={onChange}
            />
        </div>
    );
};

export default DarkModeSwitch;
