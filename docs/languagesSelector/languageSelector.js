let selectedTransfer = {
    source: null,
    data: ''
}
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
    .on('click', (d, i, divs) => {
        divs.forEach(div => {
            div.classList.remove('selected')
        })
        if (selectedTransfer.source == divs[i]) {
            selectedTransfer.source = null
            selectedTransfer.data = null
            return
        }
        divs[i].classList.add('selected')
        selectedTransfer.source = divs[i]
        selectedTransfer.data = d
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
    .on('click', (d, i, divs) => {
        divs.forEach(div => {
            div.classList.remove('selected')
        })
        if (selectedTransfer.source == divs[i]) {
            selectedTransfer.source = null
            selectedTransfer.data = null
            return
        }
        divs[i].classList.add('selected')
        selectedTransfer.source = divs[i]
        selectedTransfer.data = d.langs.join(',')
    })

let addButton = document.getElementById('add-graph')

addButton.addEventListener('click', event => {
    let graphSize = graphData.length > 0 ? graphData[graphData.length - 1].size : 460
    graphData.push(new Graph(graphSize))
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

class Graph {
    constructor(size) {
        this.size = size
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
        newGraphDiv.style.width = (this.size - 2) + 'px'
        newGraphDiv.style.height = (this.size - 2) + 'px'
        graphWrapper.appendChild(newGraphDiv)
        $(newGraphDiv).resizable({
            aspectRatio: 1,
            grid: 10,
            alsoResize: '.resize-together div.graph',
            resize: (event, ui) => {
                for (let graph of graphData) {
                    let graphSize = parseInt(graph.svg.style.width)
                    graph.size = graphSize
                }
                updateGraphs()
            }
        })
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

let graphData = [new Graph(460)]
updateGraphs()

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
        if (selectedTransfer.source) {
            return
        }
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

    graphSelector.addEventListener('click', event => {
        if (!selectedTransfer.source) {
            return
        }
        let langNames = selectedTransfer.data.split(',')
        langNames.forEach(langName => {
            addLanguage(langName, graphSelector)
        })
        selectedTransfer.source.classList.remove('selected')
        selectedTransfer.source = null
        selectedTransfer.data = ''
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

function resizeAllGraphs(newSize) {
    for (let index in graphData) {
        graphData[index].svg.style.width = newSize + 'px'
        graphData[index].svg.style.height = newSize + 'px'
        graphData[index].size = newSize
    }
    updateGraphs()
}