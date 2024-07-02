import {useMatch, useScale, useTheme} from "../../Context.jsx";
import {useEffect, useRef, useState} from "react";

const PassesNetworkView = () => {

    const width = 700;
    const height = 700;
    const margin = { top: 20, right: 100, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const { theme } = useTheme();
    const { scaledFontSize } = useScale();
    const { match } = useMatch();

    const [team, setTeam] = useState(null);

    useEffect(() => {
        setTeam(match?.home);
    }, [match]);

    const handleTeamClick = selectedTeam => {
        setTeam(selectedTeam);
    };

    const networkRef = useRef();

    useEffect(() => {

    }, [match, team, theme])

    return (
        <>
        </>
    );
}

export default PassesNetworkView;