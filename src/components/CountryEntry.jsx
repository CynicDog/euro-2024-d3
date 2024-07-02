import {useMatch, useTeam} from "../../Context.jsx";

const CountryEntry = () => {

    const { match } = useMatch();
    const { team, setTeam } = useTeam();

    const handleTeamClick = selectedTeam => {
        setTeam(selectedTeam);

        const countryEntrySection = document.getElementById("country-entry")
        if (countryEntrySection) {
            countryEntrySection.scrollIntoView({ behavior: "smooth"});
        }
    };

    return (
        <>
            {match !== null && (
                <div id="country-entry">
                    <div className="d-flex justify-content-between pt-2">
                        <div className="mx-auto eb-garamond fs-5">
                            <span
                                className={`country-name ${team === match.home ? 'text-decoration-underline bg-primary-subtle' : 'bg-light-subtle'}`}
                                onClick={() => handleTeamClick(match.home)}>
                                {match.home.countryName}
                            </span>
                            <span className="px-1">vs.</span>
                            <span
                                className={`country-name ${team === match.away ? 'text-decoration-underline bg-primary-subtle' : 'bg-light-subtle'}`}
                                onClick={() => handleTeamClick(match.away)}>
                                {match.away.countryName}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CountryEntry