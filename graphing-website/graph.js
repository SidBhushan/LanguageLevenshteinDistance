function draw(div, size, languages, graphIndex) {
div
    .attr('id', `graph-div-${graphIndex}`)
div.selectAll('svg')
    .remove()   
let svg = div.append('svg')
svg
    .attr('width', size)
    .attr('height', size)
let data = getData(languages)

let nodes = languages.map((lang, index) => { 
    return { lang, index }
})

let links = data.map(item => {
    return {
        langs: item.langs,
        distance: item.distance * 100,
        source: languages.indexOf(item.langs[0]),
        target: languages.indexOf(item.langs[1])
    }
})

let simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
        .distance(link => link.distance)
        .strength(1)
        .iterations(10)
    )
    .force('x', d3.forceX()
        .strength(0.5)
    )
    .force('y', d3.forceY()
        .strength(0.5)
    )
    .stop()

for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick();
}

function minimumNode(acc, val) {
    if (val.x < acc) {
        return val.y < val.x ? val.y : val.x
    } else {
        return val.y < acc ? val.y : acc
    }
}

function maximumNode(acc, val) {
    if (val.x > acc) {
        return val.y > val.x ? val.y : val.x
    } else {
        return val.y > acc ? val.y : acc
    }
}

let marginScale = d3.scaleLinear()
    .domain([100, 600])
    .range([20, 100])
marginScale.clamp(true)

let internalSizeScale = d3.scaleLinear()
    .domain([100, 600])
    .range([10, 25])
internalSizeScale.clamp(true)
let sizeScale = d3.scaleLinear()
    .domain([0, 25])
    .range([0, internalSizeScale(size)])

let scale = d3.scaleLinear()
    .domain([nodes.reduce(minimumNode, Number.MAX_SAFE_INTEGER), nodes.reduce(maximumNode, Number.MIN_SAFE_INTEGER)])
    .range([marginScale(size), size - marginScale(size)])

let bubbleColorScale = d3.scaleLinear()
    .domain([d3.min(links.filter(link => link.distance != 0).map(link => link.distance)), d3.max(links.map(link => link.distance))])
    .range([d3.color(d3.interpolateRdBu(1)).brighter(2), d3.color(d3.interpolateRdBu(0)).brighter(2)])

let linksGroup = svg.append('g')
        .attr('stroke', 'black')
linksGroup.selectAll('line.language-link')
    .data(links)
    .enter()
    .append('line')
        .attr('class', d => `language-link lang-${d.source.lang}`)
        .attr('x1', d => scale(d.source.x))
        .attr('y1', d => scale(d.source.y))
        .attr('x2', d => scale(d.target.x))
        .attr('y2', d => scale(d.target.y))



let circlesGroup = svg.append('g')


circlesGroup.selectAll('circle.language')
    .data(nodes)
    .enter()
    .append('circle')
        .attr('cx', d => scale(d.x))
        .attr('cy', d => scale(d.y))
        .attr('r', sizeScale(25))
        .attr('fill', d => {
            let avgDistance = d3.mean(links.filter(link => link.langs[0] == d.lang && link.distance != 0).map(link => link.distance))
            return bubbleColorScale(avgDistance)
        })
        .attr('class', 'language')
    .on('mouseover', (d, i, circles) => {
        d3.select(circles[i]).transition()
            .duration(500)
            .ease(d3.easeElastic)
            .attr('r', sizeScale(30))
        
        d3.selectAll(`#graph-div-${graphIndex} .language-link:not(.lang-${d.lang})`).transition()
            .duration(500)
            .attr('stroke-width', 0)

        let filteredData = links.filter(link => link.source.lang == d.lang && link.target.lang != d.lang)

        let textBackgrounds = textGroup.selectAll(`.language-link-text-background.lang-${d.lang}`)
            .data(filteredData)
            .enter()
            .append('rect')
                .attr('class', d => `language-link-text-background lang-${d.source.lang}`)
        let textLabels = textGroup.selectAll(`.language-link-text.lang-${d.lang}`)
            .data(filteredData)
            .enter()
            .append('text')
                .attr('class', d => `language-link-text lang-${d.source.lang}`)
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
                .attr('font-family', 'sans-serif')
                .attr('font-size', sizeScale(16))
                .attr('text-align', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('x', d => scale((d.source.x + d.target.x) / 2))
                .attr('y', d => scale((d.source.y + d.target.y) / 2))
                .text(d => (Math.round(d.distance) / 100).toFixed(2))
        textLabels.each((d, i, labels) => {
            filteredData[i].bb = labels[i].getBBox()
        })
        
        let paddingX = 10
        let paddingY = 5

        textBackgrounds.attr('width', 50)
            .attr('height', d => d.bb.height + paddingY)
            .attr('width', d => d.bb.width + paddingX)
            .attr('opacity', 0)
            .attr('fill', 'white')
            .attr('x', d => d.bb.x - paddingX / 2)
            .attr('y', d => d.bb.y - paddingY / 2)
            .text(d => Math.round(d.distance) / 100)

        d3.selectAll(`.language-link-text.lang-${d.lang}`).transition()
            .duration(500)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1)
        d3.selectAll(`.language-link-text-background.lang-${d.lang}`).transition()
            .duration(500)
            .attr('opacity', 1)
    })
    .on('mouseout', (d, i, circles) => {
        d3.select(circles[i]).transition()
            .duration(500)
            .ease(d3.easeElastic)
            .attr('r', sizeScale(25))
        d3.selectAll(`.language-link:not(.lang-${d.lang})`).transition()
            .duration(500)
            .attr('stroke-width', 1)
            .attr('fill', 'none')
        d3.selectAll(`.language-link-text.lang-${d.lang}`).transition()
            .duration(500)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
        d3.selectAll(`.language-link-text-background.lang-${d.lang}`).transition()
            .duration(500)
            .attr('opacity', 0)
        d3.selectAll(`.language-link-text.lang-${d.lang}`)
            .remove()
        d3.selectAll(`.language-link-text-background.lang-${d.lang}`)
            .remove()
    })

circlesGroup.selectAll('text.language-label')
    .data(nodes)
    .enter()
    .append('text')
        .attr('x', d => scale(d.x))
        .attr('y', d => scale(d.y))
        .attr('class', 'language-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'sans-serif')
        .attr('font-size', sizeScale(16))
        .attr('stroke', 'white')
        .attr('fill', 'white')
        .text(d => d.lang)

let textGroup = svg.append('g')
    .attr('stroke', 'black')
    .attr('fill', 'black')
}