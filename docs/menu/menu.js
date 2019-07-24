let menuOpen = false

let color1 = d3.rgb(255, 255, 255, 0)
let color2 = 'steelblue'
let lineColor1 = 'black'
let lineColor2 = 'white'
let strokeWidth = 1.5
let settingsButtonSize = 25
let settingsButtonScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, settingsButtonSize])
let settingButtonSVG = d3.select('#settings-button').append('svg')
    .attr('width', settingsButtonSize)
    .attr('height', settingsButtonSize)
    .style('background-color', color1)
let menu = d3.select('#settings-menu')
menu.style('background-color', color2)
menu.style('display', 'none')

let topLine = settingButtonSVG.append('line')
    .attr('x1', settingsButtonScale(10))
    .attr('y1', settingsButtonScale(15))
    .attr('x2', settingsButtonScale(40))
    .attr('y2', settingsButtonScale(15))
    .attr('stroke', lineColor1)
    .attr('stroke-width', strokeWidth)

let midLine = settingButtonSVG.append('line')
    .attr('x1', settingsButtonScale(10))
    .attr('y1', settingsButtonScale(25))
    .attr('x2', settingsButtonScale(40))
    .attr('y2', settingsButtonScale(25))
    .attr('stroke', lineColor1)
    .attr('stroke-width', strokeWidth)

let bottomLine = settingButtonSVG.append('line')
    .attr('x1', settingsButtonScale(10))
    .attr('y1', settingsButtonScale(35))
    .attr('x2', settingsButtonScale(40))
    .attr('y2', settingsButtonScale(35))
    .attr('stroke', lineColor1)
    .attr('stroke-width', strokeWidth)

settingButtonSVG.on('click', () => {
    menuOpen = !menuOpen
    if (menuOpen) { // Change to X
        // Remove middle line
        midLine.transition()
            .duration(500)
            .attr('stroke-width', 0)
        // Move down top line
        topLine.transition()
            .duration(500)
            .attr('y1', settingsButtonScale(10))
            .attr('y2', settingsButtonScale(40))
            .attr('stroke', lineColor2)
        // Move up bottom line
        bottomLine.transition()
            .duration(500)
            .attr('y1', settingsButtonScale(40))
            .attr('y2', settingsButtonScale(10))
            .attr('stroke', lineColor2)
        // Change button color
        settingButtonSVG.transition()
            .duration(500)
            .style('background-color', color2)
        // Show menu
        menu.style('display', 'block')
        menu.transition()
            .duration(500)
            .style('opacity', 1)
    } else {  // Change from X
        // Appear middle line
        midLine.transition()
            .duration(500)
            .attr('stroke-width', strokeWidth)
        // Move up top line
        topLine.transition()
            .duration(500)
            .attr('y1', settingsButtonScale(15))
            .attr('y2', settingsButtonScale(15))
            .attr('stroke', lineColor1)
        // Move down bottom line
        bottomLine.transition()
            .duration(500)
            .attr('y1', settingsButtonScale(35))
            .attr('y2', settingsButtonScale(35))
            .attr('stroke', lineColor1)
        // Change button color
        settingButtonSVG.transition()
            .duration(500)
            .style('background-color', color1)
        // Hide menu
        menu.transition()
            .duration(500)
            .style('opacity', 0)
            .on('end', () => {
                menu.style('display', 'none')
            })
    }
})

// Menu Items
let resizeTogether = document.querySelector('#resize-together-control input')
resizeTogether.addEventListener('change', event => {
    let graphsWrapper = document.getElementById('graphs-wrapper')
    if (event.target.checked) {
        graphsWrapper.classList.add('resize-together')
    } else {
        graphsWrapper.classList.remove('resize-together')
    }
})
resizeTogether.dispatchEvent(new Event('change'))

let autoResizeInput = document.querySelector('#resize-all-control input')
autoResizeInput.addEventListener('change', event => {
    if (autoResizeInput.value == '') {
        return
    }

    let newSize = (document.getElementById('graphs-wrapper').clientWidth / parseInt(autoResizeInput.value)) - 6
    resizeAllGraphs(newSize)
})