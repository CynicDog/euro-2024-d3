import {useMatch} from "../../Context.jsx";
import {useEffect} from "react";

const PassesChordView = (props) => {

    const {match} = useMatch();

    useEffect(() => {
        if (match !== null) {
            console.log(match);
        }
    }, [match]);

    return (
        <>
            {(match === null) ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="d-flex fs-5">
                    <span className="country-name bg-light-subtle">
                        {match.home.countryName}
                    </span>
                    <span className="px-1">
                        vs.
                    </span>
                    <span className="country-name bg-light-subtle">
                        {match.away.countryName}
                    </span>
                </div>
            )}
        </>
    );
}

export default PassesChordView;