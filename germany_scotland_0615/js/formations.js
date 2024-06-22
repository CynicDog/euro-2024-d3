const renderFormations = (data, team) => {

    const margin = {top: 20, right: 40, bottom: 20, left: 40};
    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg =
        d3.select(`#formation-${team}`)
            .append("svg")
            .attr("viewBox", `0, 0, ${width}, ${height}`);

    const innerChart =
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([innerHeight, 0]);

    innerChart.selectAll('circle')
        .data(data.formationPositions)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.horizontal))
        .attr('cy', d => yScale(d.vertical))
        .attr('r', 15)
        .attr('fill', color[team])
        .attr('stroke', 'black')
    ;
}