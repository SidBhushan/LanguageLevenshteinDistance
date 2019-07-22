let languageOptionDivs = d3.select('div#language-options').selectAll('div.languages-option')
    .data(languageOptions)
    .enter()
    .append('div')
    .attr('class', 'languages-option')
    .attr('draggable', true)
    .text(d => d)
    .on('dragstart', d => {
        d3.event.dataTransfer.setData('text/plain', d)
        d3.event.dataTransfer.dropEffect = 'copy'
    })

let languageGroupDivs = d3.select('div#language-group-options').selectAll('div.languages-group')
    .data(languageGroups)
    .enter()
    .append('div')
    .attr('class', 'languages-group')
    .attr('draggable', true)
    .text(d => d.name)
    .on('dragstart', d => {
        d3.event.dataTransfer.setData('text/plain', d.langs.join(','))
        d3.event.dataTransfer.dropEffect = 'copy'
    })

let addButton = document.getElementById('add-graph')

addButton.addEventListener('click', event => {
    graphData.push(new Graph())
})

// Add Button SVG
let addButtonSVG = d3.select('#add-graph').append('svg')
    .attr('width', 92)
    .attr('height', 40)
function renderAddButtonSVG() {
    addButtonSVG
        .attr('width', 0)
        .attr('height', 0)
    let centerX = (addButton.offsetWidth / 2) - 2
    let centerY = (addButton.offsetHeight / 2) - 2
    addButtonSVG
        .attr('width', centerX * 2)
        .attr('height', centerY * 2)
    addButtonSVG.selectAll('*')
        .remove()
    addButtonSVG.append('line')
        .attr('class', 'vertical-line')
        .attr('x1', centerX)
        .attr('y1', centerY - 10)
        .attr('x2', centerX)
        .attr('y2', centerY + 10)
        .attr('stroke', 'white')
        .attr('stroke-width', 5)
    addButtonSVG.append('line')
        .attr('class', 'horizontal-line')
        .attr('x1', centerX - 10)
        .attr('y1', centerY)
        .attr('x2', centerX + 10)
        .attr('y2', centerY)
        .attr('stroke', 'white')
        .attr('stroke-width', 5)
}

const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        let graphSize = Math.min(entry.contentRect.width, entry.contentRect.height)
        let graph = graphData[Graph.findBySVG(entry.target, graphData)]
        if (graph) {
            graph.size = graphSize
            updateGraphs()
        }
    })
})

class Graph {
    constructor() {
        this.size = 460
        this.languages = []
        this.selector = this.addSelector()
        this.svg = this.addGraph()
    }

    addSelector() {
        let graphSelectorContainer = document.getElementById('graphs-selector')
        let newGraphSelector = document.createElement('div')
        newGraphSelector.classList.add('graph-selector')
        graphSelectorEventListeners(newGraphSelector)
        graphSelectorContainer.appendChild(newGraphSelector)
        return newGraphSelector
    }

    addGraph() {
        let graphWrapper = document.getElementById('graphs-wrapper')
        let newGraphDiv = document.createElement('div')
        newGraphDiv.classList.add('graph')
        graphWrapper.appendChild(newGraphDiv)
        resizeObserver.observe(newGraphDiv)
        return newGraphDiv
    }

    addLanguage(lang) {
        this.languages.push(lang)
    }

    removeLanguage(lang) {
        this.languages.splice(this.languages.indexOf(lang), 1)
    }

    remove() {
        this.selector.remove()
        this.svg.remove()
    }

    static findBySVG(svg, graphData) {
        return graphData.map(item => item.svg).indexOf(svg)
    }

    static findBySelector(selector, graphData) {
        return graphData.map(item => item.selector).indexOf(selector)
    }
}

let graphData = [new Graph()]

function updateGraphs() {
    renderAddButtonSVG()
    graphData.forEach((graph, index) => {
        draw(d3.select(graph.svg), graph.size, graph.languages, index)
    })
}

function addLanguage(langName, graphSelector) {
    for (let child of graphSelector.children) {
        if (child.innerHTML == langName) {
            return
        }
    }
    let graphIndex = Graph.findBySelector(graphSelector, graphData)
    let addElement = document.createElement('div')
    addElement.classList.add('language-option')
    addElement.innerHTML = langName
    addElement.addEventListener('click', event => {
        graphSelector.removeChild(addElement)
        graphData[graphIndex].removeLanguage(langName)
        updateGraphs()
    })
    graphSelector.appendChild(addElement)
    graphData[graphIndex].addLanguage(langName)
}

function graphSelectorEventListeners(graphSelector) {
    graphSelector.addEventListener('dragover', event => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
    })

    graphSelector.addEventListener('drop', event => {
        event.preventDefault()
        let langNames = event.dataTransfer.getData('text/plain').split(',')
        langNames.forEach(langName => {
            addLanguage(langName, graphSelector)
        })
        updateGraphs()
    })

    // Remove SVG
    let removeButtonSVG = d3.select(graphSelector).append('svg')
        .attr('width', 10)
        .attr('height', 10)
        .on('click', d => {
            let graphIndex = Graph.findBySelector(graphSelector, graphData)
            graphData[graphIndex].remove()
            graphData.splice(graphIndex, 1)
            updateGraphs()
        })

    removeButtonSVG.append('circle')
        .attr('class', 'remove-button-circle')
        .attr('cx', 5)
        .attr('cy', 5)
        .attr('r', 5)
        .attr('fill', d3.color('red').darker(0.5))
    removeButtonSVG.append('line')
        .attr('class', 'backslash-remove-line')
        .attr('x1', 3)
        .attr('y1', 3)
        .attr('x2', 7)
        .attr('y2', 7)
        .attr('stroke', 'white')
    removeButtonSVG.append('line')
        .attr('class', 'forwardslash-remove-line')
        .attr('x1', 7)
        .attr('y1', 3)
        .attr('x2', 3)
        .attr('y2', 7)
        .attr('stroke', 'white')
}