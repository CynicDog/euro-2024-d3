const renderFormations = (data, team) => {

    const margin = {top: 20, right: 40, bottom: 15, left: 40};
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg =
        d3.select(`formation-${team}`)
            .append("svg")
            .attr("viewBox", `0, 0, ${width}, ${height}`);

    const innerChart =
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


}