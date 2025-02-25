/* global d3, document */
/* jshint latedef:nofunc */
'use strict';

function Neo4jD3(_selector, _options) {
    var container, info, node, nodes, relationship, relationshipOverlay, relationshipText, relationships, selector, simulation, svg, svgNodes, svgRelationships, svgScale, svgTranslate,
        classes2colors = {},
        justLoaded = false,
        numClasses = 0,
        options = {
            arrowSize: 4,
            colors: colors(),
            highlight: undefined,
            iconMap: undefined,
            icons: undefined,
            imageMap: {},
            images: undefined,
            infoPanel: true,
            minCollision: undefined,
            neo4jData: undefined,
            neo4jDataUrl: undefined,
            nodeOutlineFillColor: undefined,
            nodeRadius: 25,
            relationshipColor: '#a5abb6',
            zoomFit: false,
            counters: [true, false, false],
            simulationQuality: 2,
        },
        builtRelations = {},
        VERSION = '0.0.1';

    function appendGraph(container) {
        svg = container.append('svg')
                       .attr('width', '100%')
                       .attr('height', '100%')
                       .attr('class', 'neo4jd3-graph')
                       .call(d3.zoom().on('zoom', function(event, d) {
                           var scale = event.transform.k,
                               translate = [event.transform.x, event.transform.y];

                           if (svgTranslate) {
                               translate[0] += svgTranslate[0];
                               translate[1] += svgTranslate[1];
                           }

                           if (svgScale) {
                               scale *= svgScale;
                           }

                           svg.attr('transform', 'translate(' + translate[0] + ', ' + translate[1] + ') scale(' + scale + ')');
                       }))
                       .on('dblclick.zoom', null)
                       .append('g')
                       .attr('width', '100%')
                       .attr('height', '100%');

        svgRelationships = svg.append('g')
                              .attr('class', 'relationships');

        svgNodes = svg.append('g')
                      .attr('class', 'nodes');
        
        addTriangleMarkerEnds(svg, 'hard');
        addTriangleMarkerEnds(svg, 'soft');
        addTriangleMarkerEnds(svg, 'minor');
    }

    function addTriangleMarkerEnds(svg, type) {
        svg.append("svg:defs").append("svg:marker")
            .attr("id", type + "Triangle")
            .attr("refX", 3)
            .attr("refY", 3)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("orient", "0")
            .append("path")
            .attr("d", "M0,0 L0,6 L9,3 z")
            .attr("class", type + "countertriangle");
    }

    function appendImageToNode(node) {
        return node.append('image')
                   .attr('height', function(d) {
                       return icon(d) ? '24px': '70px';
                   })
                   .attr('x', function(d) {
                       return icon(d) ? '5px': '-35px';
                   })
                   .attr('xlink:href', function(d) {
                       return image(d);
                   })
                   .attr('y', function(d) {
                       return icon(d) ? '5px': '-35px';
                   })
                   .attr('width', function(d) {
                       return icon(d) ? '24px': '70px';
                   });
    }

    function appendInfoPanel(container) {
        return container.append('div')
                        .attr('class', 'neo4jd3-info');
    }

    function appendInfoElement(cls, isNode, property, value) {
        var elem = info.append('a');

        elem.attr('href', '#')
            .attr('class', cls)
            .html('<strong>' + property + '</strong>' + (value ? (': ' + value) : ''));

        if (!value) {
            elem.style('background-color', function(d) {
                    return options.nodeOutlineFillColor ? options.nodeOutlineFillColor : (isNode ? class2color(property) : defaultColor());
                })
                .style('border-color', function(d) {
                    return options.nodeOutlineFillColor ? class2darkenColor(options.nodeOutlineFillColor) : (isNode ? class2darkenColor(property) : defaultDarkenColor());
                })
                .style('color', function(d) {
                    return options.nodeOutlineFillColor ? class2darkenColor(options.nodeOutlineFillColor) : '#fff';
                });
        }
    }

    /**
     * Filter graph data to only show certain counter relationships
     * @param data The original graph data
     * @param hard Boolean for whether hard counters should be shown
     * @param soft Boolean for whether soft counters should be shown
     * @param minor Boolean for whether minor counters should be shown
     */
    function filterDataByCounterLevel(data, hard, soft, minor) {
        data.results.forEach(function(result) {
            result.data.forEach(function(data) {
                data.graph.relationships = data.graph.relationships.filter(function(relationship) {
                    if (hard && relationship.type === 'Hard Counter') {
                        return true;
                    } else if (soft && relationship.type === 'Soft Counter') {
                        return true;
                    } else if (minor && relationship.type === 'Minor Counter') {
                        return true;
                    }
                    return false;
                });
            });
        });
        return data;
    }

    function appendInfoElementClass(cls, node) {
        appendInfoElement(cls, true, node);
    }

    function appendInfoElementProperty(cls, property, value) {
        // we don't want to show an ID property
        if (property !== '&lt;id&gt;') {
            appendInfoElement(cls, false, property, value);
        }
    }

    function appendInfoElementRelationship(cls, relationship) {
        appendInfoElement(cls, false, relationship);
    }

    function appendNode() {
        return node.enter()
                   .append('g')
                   .attr('class', function(d) {
                       var highlight, i,
                           classes = 'node';

                       if (options.highlight) {
                           for (i = 0; i < options.highlight.length; i++) {
                               highlight = options.highlight[i];

                               if (d.labels[0] === highlight.class && d.properties[highlight.property] === highlight.value) {
                                   classes += ' node-highlighted';
                                   break;
                               }
                           }
                       }

                       return classes;
                   })
                   .on('click', function(event, d) {
                       d.fx = d.fy = null;

                       if (typeof options.onNodeClick === 'function') {
                           options.onNodeClick(d);
                       }
                   })
                   .on('dblclick', function(event, d) {
                       stickNode(event, d);

                       if (typeof options.onNodeDoubleClick === 'function') {
                           options.onNodeDoubleClick(d);
                       }
                   })
                   .on('mouseenter', function(event, d) {
                       if (info) {
                           updateInfo(d);
                       }

                       if (typeof options.onNodeMouseEnter === 'function') {
                           options.onNodeMouseEnter(d);
                       }
                   })
                   .on('mouseleave', function(event, d) {
                       if (info) {
                           clearInfo(d);
                       }

                       if (typeof options.onNodeMouseLeave === 'function') {
                           options.onNodeMouseLeave(d);
                       }
                   })
                   .call(d3.drag()
                           .on('start', dragStarted)
                           .on('drag', dragged)
                           .on('end', dragEnded));
    }

    function appendNodeToGraph() {
        var n = appendNode();

        if (options.images) {
            appendImageToNode(n);
        }

        return n;
    }

    function appendRelationship() {
        return relationship.enter()
                           .append('g')
                           .attr('class', 'relationship')
                           .on('dblclick', function(event, d) {
                               if (typeof options.onRelationshipDoubleClick === 'function') {
                                   options.onRelationshipDoubleClick(d);
                               }
                           })
                           .on('mouseenter', function(event, d) {
                               if (info) {
                                   updateInfo(d);
                               }
                           });
    }

    function appendOutlineToRelationship(r) {
        return r.append('path')
            .attr('class', function(d) {
                if (d.type === 'Hard Counter') {
                    return 'hardcounter';
                } else if (d.type === 'Soft Counter') {
                    return 'softcounter';
                } else if (d.type === 'Minor Counter') {
                    return 'minorcounter';
                }
                return '';
            })
            .attr('marker-end', function(d) {
                if (d.type === 'Hard Counter') {
                    return 'url(#hardTriangle)';
                } else if (d.type === 'Soft Counter') {
                    return 'url(#softTriangle)';
                } else {
                    return 'url(#minorTriangle)';
                }
            });
    }

    function appendOverlayToRelationship(r) {
        return r.append('path')
                .attr('class', 'overlay');
    }

    function appendTextToRelationship(r) {
        return r.append('text')
                .attr('class', 'text')
                .attr('fill', '#ffffff')
                .attr('font-size', '8px')
                .attr('pointer-events', 'none')
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    var text = d.type;
                    //builtRelations[`${d.startNode},${d.endNode},${d.type},`] ? '  '.repeat(d.type.length): d.type;
                    //builtRelations[`${d.endNode},${d.startNode},${d.type},`] = true;
                    builtRelations[d.endNode+','+d.startNode+','+d.type+','] = true;
                    return text;
                });
    }

    function appendRelationshipToGraph() {
        var relationship = appendRelationship(),
            text = appendTextToRelationship(relationship),
            outline = appendOutlineToRelationship(relationship),
            overlay = appendOverlayToRelationship(relationship);

        return {
            outline: outline,
            overlay: overlay,
            relationship: relationship,
            text: text
        };
    }

    function class2color(cls) {
        var color = classes2colors[cls];

        if (!color) {
//            color = options.colors[Math.min(numClasses, options.colors.length - 1)];
            color = options.colors[numClasses % options.colors.length];
            classes2colors[cls] = color;
            numClasses++;
        }

        return color;
    }

    function class2darkenColor(cls) {
        return d3.rgb(class2color(cls)).darker(1);
    }

    function clearInfo() {
        info.html('');
    }

    function color() {
        return options.colors[options.colors.length * Math.random() << 0];
    }

    function colors() {
        // d3.schemeCategory10,
        // d3.schemeCategory20,
        return [
            '#68bdf6', // light blue
            '#6dce9e', // green #1
            '#faafc2', // light pink
            '#f2baf6', // purple
            '#ff928c', // light red
            '#fcea7e', // light yellow
            '#ffc766', // light orange
            '#405f9e', // navy blue
            '#a5abb6', // dark gray
            '#78cecb', // green #2,
            '#b88cbb', // dark purple
            '#ced2d9', // light gray
            '#e84646', // dark red
            '#fa5f86', // dark pink
            '#ffab1a', // dark orange
            '#fcda19', // dark yellow
            '#797b80', // black
            '#c9d96f', // pistacchio
            '#47991f', // green #3
            '#70edee', // turquoise
            '#ff75ea'  // pink
        ];
    }

    function contains(array, id) {
        var filter = array.filter(function(elem) {
            return elem.id === id;
        });

        return filter.length > 0;
    }

    function defaultColor() {
        return options.relationshipColor;
    }

    function defaultDarkenColor() {
        return d3.rgb(options.colors[options.colors.length - 1]).darker(1);
    }

    function dragEnded(event, d) {
        if (!event.active) {
            simulation.alphaTarget(0);
        }

        if (typeof options.onNodeDragEnd === 'function') {
            options.onNodeDragEnd(d);
        }
    }

    function dragged(event, d) {
        stickNode(event, d);
    }

    function dragStarted(event, d) {
        if (!event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        d.fx = d.x;
        d.fy = d.y;

        if (typeof options.onNodeDragStart === 'function') {
            options.onNodeDragStart(d);
        }
    }

    function icon(d) {
        var code;

        if (options.iconMap && options.showIcons && options.icons) {
            if (options.icons[d.labels[0]] && options.iconMap[options.icons[d.labels[0]]]) {
                code = options.iconMap[options.icons[d.labels[0]]];
            } else if (options.iconMap[d.labels[0]]) {
                code = options.iconMap[d.labels[0]];
            } else if (options.icons[d.labels[0]]) {
                code = options.icons[d.labels[0]];
            }
        }

        return code;
    }

    function image(d) {
        var i, imagesForLabel, img, imgLevel, label, labelPropertyValue, property, value;

        if (options.images) {
            imagesForLabel = options.imageMap[d.labels[0]];

            if (imagesForLabel) {
                imgLevel = 0;

                for (i = 0; i < imagesForLabel.length; i++) {
                    labelPropertyValue = imagesForLabel[i].split('|');

                    switch (labelPropertyValue.length) {
                        case 3:
                        value = labelPropertyValue[2];
                        /* falls through */
                        case 2:
                        property = labelPropertyValue[1];
                        /* falls through */
                        case 1:
                        label = labelPropertyValue[0];
                    }

                    if (d.labels[0] === label &&
                        (!property || d.properties[property] !== undefined) &&
                        (!value || d.properties[property] === value)) {
                        if (labelPropertyValue.length > imgLevel) {
                            img = options.images[imagesForLabel[i]];
                            imgLevel = labelPropertyValue.length;
                        }
                    }
                }
            }
        }

        return img;
    }

    function init(_selector, _options) {
        merge(options, _options);
        if (options.icons) {
            options.showIcons = true;
        }

        if (!options.minCollision) {
            options.minCollision = options.nodeRadius * 2;
        }

        initImageMap();

        selector = _selector;

        container = d3.select(selector);

        container.attr('class', 'neo4jd3')
                 .html('');

        if (options.infoPanel) {
            info = appendInfoPanel(container);
        }

        appendGraph(container);

        simulation = initSimulation();

        if (options.neo4jData) {
            loadNeo4jData(options.neo4jData);
        } else if (options.neo4jDataUrl) {
            loadNeo4jDataFromUrl(options.neo4jDataUrl);
        } else {
            console.error('Error: both neo4jData and neo4jDataUrl are empty!');
        }
    }

    function initImageMap() {
        var key, keys, selector;

        for (key in options.images) {
            if (options.images.hasOwnProperty(key)) {
                keys = key.split('|');

                if (!options.imageMap[keys[0]]) {
                    options.imageMap[keys[0]] = [key];
                } else {
                    options.imageMap[keys[0]].push(key);
                }
            }
        }
    }

    function initSimulation() {
        var simulation = d3.forceSimulation()
//                           .velocityDecay(0.8)
//                           .force('x', d3.force().strength(0.002))
//                           .force('y', d3.force().strength(0.002))
                           .force('collide', d3.forceCollide().radius(function(d) {
                               return options.minCollision;
                           }).iterations(options.simulationQuality))
                           .force('charge', d3.forceManyBody())
                           .force('link', d3.forceLink().id(function(d) {
                               return d.id;
                           }))
                           .force('center', d3.forceCenter(svg.node().parentElement.parentElement.clientWidth / 2, svg.node().parentElement.parentElement.clientHeight / 2))
                           .on('tick', function() {
                               tick();
                           })
                           .on('end', function() {
                               if (options.zoomFit && !justLoaded) {
                                   justLoaded = true;
                                   zoomFit(2);
                               }
                           });

        return simulation;
    }

    /**
     * If a simulation is running, stop it. This method is used before reinitalizing the graph.
     */
    function stopSimulation() {
        if (simulation) {
            simulation.stop();
        }
    }

    /**
     * Unreezes all nodes. This means they can be effected by simlulation forces
     */
    function unfreezeAllNodes() {
        for(var i = 0; i < nodes.length; i++){
            unfreezeNode(nodes[i]);
        }
    }

    /**
     * Freezes all nodes in their current position
     */
    function freezeAllNodes() {
        for(var i = 0; i < nodes.length; i++){
            freezeNode(nodes[i]);
        }
    }
    function loadNeo4jData() {
        nodes = [];
        relationships = [];

        updateWithNeo4jData(options.neo4jData);
    }

    function loadNeo4jDataFromUrl(neo4jDataUrl) {
        nodes = [];
        relationships = [];

        d3.json(neo4jDataUrl).then(function(data) {

            data = filterDataByCounterLevel(data, options.counters[0], options.counters[1], options.counters[2]);
            updateWithNeo4jData(data);
        });
    }

    function merge(target, source) {
        Object.keys(source).forEach(function(property) {
            target[property] = source[property];
        });
    }

    function neo4jDataToD3Data(data) {
        var graph = {
            nodes: [],
            relationships: []
        };

        data.results.forEach(function(result) {
            result.data.forEach(function(data) {
                data.graph.nodes.forEach(function(node) {
                    if (!contains(graph.nodes, node.id)) {
                        graph.nodes.push(node);
                    }
                });

                var rels = data.graph.relationships;
                rels.forEach(function(relationship) {
                    if (relationship.startNode === relationship.endNode) {
                        return;
                    }
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(relationship);
                });

                for (var i = 0; i < rels.length; i++) {
                    for (var j = i; j < rels.length; j++) {
                        if (!rels[i].linknum) {
                            rels[i].linknum = 1;
                        }
                        if (!rels[j].linknum) {
                            rels[j].linknum = 1;
                        }
                        // if a bi-directional relationship, update linknum to 2
                        if (rels[i].source === rels[j].target && rels[i].target === rels[j].source) {
                            rels[i].linknum = 2;
                            rels[j].linknum = 2;
                        }
                    }
                }
            });
        });

        return graph;
    }

    function rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

        return { x: nx, y: ny };
    }

    function rotatePoint(c, p, angle) {
        return rotate(c.x, c.y, p.x, p.y, angle);
    }

    function rotation(source, target) {
        return Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI;
    }

    function size() {
        return {
            nodes: nodes.length,
            relationships: relationships.length
        };
    }
    
    /**
     * Used for dragging and sticking a node's position
     * @param d the node being dragged 
     */
    function stickNode(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    /**
     * Freezes a node in its current position
     * @param d the node to be frozen
     */
    function freezeNode(d) {
        d.fx = d.x;
        d.fy = d.y;
    }

    /**
     * Unfreezes a node letting it be effected by simulation forces again
     * @param d the node to be unfrozen
     */
    function unfreezeNode(d) {
        d.fx = d.fy = null;
    }

    /**
     * Tick function for the simulation
     */
    function tick() {
        var nodeTransforms = tickNodes();

        if (!node) {
            return;
        }

        var relationshipTransforms = tickRelationships();

        // do all rendering AFTER processing for performance reasons
        renderGraph(nodeTransforms, relationshipTransforms);
    }

    /**
     * Processes the transformations for each node in the graph.
     * @returns {string[]} an array of transforms for each node
     */
    function tickNodes() {
        if (!node) {
            return null;
        }

        var nodeTransforms = [];
        
        // process all node transforms
        node.each(function (d) {
            nodeTransforms.push('translate(' + d.x + ', ' + d.y + ')');
        });

        return nodeTransforms;
    }


    /**
     * Processes the transformations for each relationship in the graph.
     * @returns {Object} an object with properties holding arrays of each type of transform.
     */
    function tickRelationships() {
        var relationshipTransforms = {};

        if (relationship) {
            relationshipTransforms.mainRelationshipTransforms = tickRelationshipsMain();
            relationshipTransforms.outlineTransforms = tickRelationshipsOutlines();
            relationshipTransforms.textTransforms = tickRelationshipsTexts();
            relationshipTransforms.overlayTransforms = tickRelationshipsOverlays();
        }

        return relationshipTransforms;
    }

    /**
     * Processes the transformations for the relationship as a whole.
     * @returns {string[]} an array of transforms for each relationship
     */
    function tickRelationshipsMain() {
        var relationshipTransforms = [];

        // process all relationship transforms
        relationship.each(function (d) {
            var center = {x: 0, y: 0},
              angle = rotation(d.source, d.target),
              u = unitaryVector(d.source, d.target),
              n = unitaryNormalVector(d.source, d.target),
              g = rotatePoint(center, u, -10),
              source = rotatePoint(center, {
                x: 0 + (options.nodeRadius + 1) * u.x - n.x,
                y: 0 + (options.nodeRadius + 1) * u.y - n.y
              }, angle + 10),
              target = rotatePoint(center, {
                x: d.target.x - d.source.x - (options.nodeRadius + 2) * g.x,
                y: d.target.y - d.source.y - (options.nodeRadius + 2) * g.y
              }, angle),
              uu = unitaryNormalVector(source, target),
              middle = {
                x: (source.x + target.x) / 2 + uu.x * 20,
                y: (source.y + target.y) / 2 + uu.y * 20
              };
            d.outline = { middle: middle, source: source, target: target, u: uu };

            relationshipTransforms.push('translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')');
        });

        return relationshipTransforms;
    }

    /**
     * Processes the transformations for each relationship outline in the graph.
     * @returns {string[]} an array of transforms for each relationship outline
     */
    function tickRelationshipsOutlines() {
        var outlineTransforms = [];

        // process all outline transforms
        relationship.each(function (d) {
            var text = d3.select(this).select('.text');
            if (d.linknum === 1) {
                // takes into account the label on the line
                outlineTransforms.push(tickStraightRelationshipsOutline(d, text));
            } else {
                outlineTransforms.push(tickCurvedRelationshipsOutline(d));
            }
        });

        return outlineTransforms;
    }

    function tickStraightRelationshipsOutline(d, text) {
        const center = { x: 0, y: 0 };
        const baseRadius = options.nodeRadius + 1;
        const angle = rotation(d.source, d.target);

        // getBBox is expensive so cache the
        // bounding box on the data object
        if (!d._cachedTextBBox) {
            d._cachedTextBBox = text.node().getBBox();
        }

        const textPadding = 5;
        const textWidthPad = d._cachedTextBBox.width + textPadding;

        const u = unitaryVector(d.source, d.target);
        const textMargin = {
            x: (d.target.x - d.source.x - textWidthPad * u.x) * 0.5,
            y: (d.target.y - d.source.y - textWidthPad * u.y) * 0.5
        };
        const n = unitaryNormalVector(d.source, d.target);

        const rotatedPointA1 = rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle);
        const rotatedPointB1 = rotatePoint(center, { x: baseRadius * u.x, y: baseRadius * u.y }, angle);
        const rotatedPointA2 = rotatePoint(center, { x: d.target.x - d.source.x - baseRadius * u.x, y: d.target.y - d.source.y - baseRadius * u.y }, angle);
        const rotatedPointB2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle);

        return 'M ' + rotatedPointA1.x + ' ' + rotatedPointA1.y +
            ' L ' + rotatedPointB1.x + ' ' + rotatedPointB1.y +
            ' Z M ' + rotatedPointA2.x + ' ' + rotatedPointA2.y +
            ' L ' + rotatedPointB2.x + ' ' + rotatedPointB2.y +
            ' Z';
    }

    function tickCurvedRelationshipsOutline(d) {
        var source = d.outline.source,
        target = d.outline.target,
        middle = d.outline.middle;
        return 'M ' + target.x + ', ' + target.y + ' ' +
            'Q ' + middle.x + ' ' + middle.y + ' ' + source.x + ' ' + source.y + ' ' +
            'Q ' + middle.x + ' ' + middle.y + ' ' + target.x + ', ' + target.y;
    }

    /**
     * Processes the transformations for each relationship overlay in the graph.
     * @returns {string[]} an array of transforms for each relationship overlay
     */
    function tickRelationshipsOverlays() {
        var overlayTransforms = [];

        // process all overlay transforms
        relationshipOverlay.each(function (d) {
            if (d.linknum === 1) {
                overlayTransforms.push(tickStraightRelationshipsOverlay(d));
            } else {
                overlayTransforms.push(tickCurvedRelationshipsOverlay(d));
            }
        });

        return overlayTransforms;
    }

    function tickStraightRelationshipsOverlay(d) {
        var center = { x: 0, y: 0 },
            angle = rotation(d.source, d.target),
            n1 = unitaryNormalVector(d.source, d.target),
            n = unitaryNormalVector(d.source, d.target, 50),
            rotatedPointA = rotatePoint(center, { x: 0 - n.x, y: 0 - n.y }, angle),
            rotatedPointB = rotatePoint(center, { x: d.target.x - d.source.x - n.x, y: d.target.y - d.source.y - n.y }, angle),
            rotatedPointC = rotatePoint(center, { x: d.target.x - d.source.x + n.x - n1.x, y: d.target.y - d.source.y + n.y - n1.y }, angle),
            rotatedPointD = rotatePoint(center, { x: 0 + n.x - n1.x, y: 0 + n.y - n1.y }, angle);

        return 'M ' + rotatedPointA.x + ' ' + rotatedPointA.y +
            ' L ' + rotatedPointB.x + ' ' + rotatedPointB.y +
            ' L ' + rotatedPointC.x + ' ' + rotatedPointC.y +
            ' L ' + rotatedPointD.x + ' ' + rotatedPointD.y +
            ' Z';
    }

    function tickCurvedRelationshipsOverlay(d) {
        var source = d.outline.source,
            target = d.outline.target,
            middle = d.outline.middle;
        var lineThickness = 5;
        return 'M ' + (source.x + lineThickness) + ', ' + (source.y + lineThickness) + ' ' +
            'Q ' + (middle.x + lineThickness) + ' ' + (middle.y + lineThickness) + ' ' + (target.x - lineThickness) + ' ' + (target.y - lineThickness) +
            'Q  ' + (middle.x - lineThickness) + ' ' + (middle.y - lineThickness) + '  ' + (source.x - lineThickness)  + ' ' + (source.y - lineThickness)  +
            'Z M ' + (target.x - lineThickness) + ', ' + (target.y - lineThickness) + ' ' +
            'Q ' + (middle.x - lineThickness) + ' ' + (middle.y - lineThickness) + ' ' + (source.x + lineThickness) + ' ' + (source.y + lineThickness) +
            'Q  ' + (middle.x + lineThickness) + ' ' + (middle.y + lineThickness) + '  ' + (target.x + lineThickness)  + ' ' + (target.y + lineThickness)  +
            'Z';
    }

    /**
     * Processes the transformations for each relationship text in the graph.
     * @returns {string[]} an array of transforms for each relationship text
     */
    function tickRelationshipsTexts() {
        var textTransforms = [];

        // process all text transforms
        relationshipText.each(function (d) {
            if (d.linknum === 1) {
                textTransforms.push(tickStraightRelationshipsText(d));
            } else {
                textTransforms.push(tickCurvedRelationshipsText(d));
            }
        });

        return textTransforms;
    }

    function tickStraightRelationshipsText(d) {
        var angle = (rotation(d.source, d.target) + 360) % 360,
            mirror = angle > 90 && angle < 270,
            center = { x: 0, y: 0 },
            n = unitaryNormalVector(d.source, d.target),
            nWeight = mirror ? 2 : -3,
            point = { x: (d.target.x - d.source.x) * 0.5 + n.x * nWeight, y: (d.target.y - d.source.y) * 0.5 + n.y * nWeight },
            rotatedPoint = rotatePoint(center, point, angle);

        return 'translate(' + rotatedPoint.x + ', ' + rotatedPoint.y + ') rotate(' + (mirror ? 180 : 0) + ')';
    }

    function tickCurvedRelationshipsText(d) {
        var angle = (rotation(d.source, d.target) + 360) % 360,
            mirror = angle > 90 && angle < 270,
            source = d.outline.source,
            target = d.outline.target,
            u = d.outline.u,
            middle = {
                x: (source.x + target.x) / 2 + u.x * (mirror ? 8 : 10) + u.x,
                y: (source.y + target.y) / 2 + u.y * (mirror ? 8 : 10) + u.y
            };
        return 'translate(' + middle.x + ', ' + middle.y + ') rotate(' + (mirror ? 180 : 0) + ')';
    }

    /**
     * Render all node + relationship transforms.
     * @param {string[]} nodeTransforms - The node transforms to apply
     * @param {object} relationshipTransforms - The relationship transforms to apply
     */
    function renderGraph(nodeTransforms, relationshipTransforms) {
        // render all node transforms
        node.attr('transform', function (d, index) {
            return nodeTransforms[index];
        });

        // render all main relationship transforms
        relationship.attr('transform', function (d, index) {
            return relationshipTransforms.mainRelationshipTransforms[index];
        });

        // render all outline transforms
        relationship
            .select('.hardcounter,.softcounter,.minorcounter')
            .attr('d', function (d, index) {
                return relationshipTransforms.outlineTransforms[index];
            });

        // render all text transforms
        relationshipText.attr('transform', function (d, index) {
            return relationshipTransforms.textTransforms[index];
        });

        // render all overlay transforms
        relationshipOverlay.attr('d', function (d, index) {
            return relationshipTransforms.overlayTransforms[index];
        });
    }

    function unitaryNormalVector(source, target, newLength) {
        var center = { x: 0, y: 0 },
            vector = unitaryVector(source, target, newLength);

        return rotatePoint(center, vector, 90);
    }

    function unitaryVector(source, target, newLength) {
        var length = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)) / Math.sqrt(newLength || 1);

        return {
            x: (target.x - source.x) / length,
            y: (target.y - source.y) / length,
        };
    }

    function updateWithD3Data(d3Data) {
        updateNodesAndRelationships(d3Data.nodes, d3Data.relationships);
    }

    function updateWithNeo4jData(neo4jData) {
        var d3Data = neo4jDataToD3Data(neo4jData);
        updateWithD3Data(d3Data);
    }

    function updateInfo(d) {
        clearInfo();

        if (d.labels) {
            appendInfoElementClass('class', d.labels[0]);
        } else {
            appendInfoElementRelationship('class', d.type);
        }

        appendInfoElementProperty('property', '&lt;id&gt;', d.id);

        Object.keys(d.properties).forEach(function(property) {
            appendInfoElementProperty('property', property, JSON.stringify(d.properties[property]));
        });
    }

    function updateNodes(n) {
        Array.prototype.push.apply(nodes, n);

        node = svgNodes.selectAll('.node')
                       .data(nodes, function(d) { return d.id; });
        var nodeEnter = appendNodeToGraph();
        node = nodeEnter.merge(node);
    }

    function updateNodesAndRelationships(n, r) {
        updateRelationships(r);
        updateNodes(n);

        simulation.nodes(nodes);
        simulation.force('link').links(relationships);
    }

    function updateRelationships(r) {
        Array.prototype.push.apply(relationships, r);

        relationship = svgRelationships.selectAll('.relationship')
                                       .data(relationships, function(d) { return d.id; });

        var relationshipEnter = appendRelationshipToGraph();

        relationship = relationshipEnter.relationship.merge(relationship);

        relationshipOverlay = svg.selectAll('.relationship .overlay');
        relationshipOverlay = relationshipEnter.overlay.merge(relationshipOverlay);

        relationshipText = svg.selectAll('.relationship .text');
        relationshipText = relationshipEnter.text.merge(relationshipText);
    }

    function version() {
        return VERSION;
    }

    function zoomFit(transitionDuration) {
        var bounds = svg.node().getBBox(),
            parent = svg.node().parentElement.parentElement,
            fullWidth = parent.clientWidth,
            fullHeight = parent.clientHeight,
            width = bounds.width,
            height = bounds.height,
            midX = bounds.x + width / 2,
            midY = bounds.y + height / 2;

        if (width === 0 || height === 0) {
            return; // nothing to fit
        }

        svgScale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
        svgTranslate = [fullWidth / 2 - svgScale * midX, fullHeight / 2 - svgScale * midY];

        svg.attr('transform', 'translate(' + svgTranslate[0] + ', ' + svgTranslate[1] + ') scale(' + svgScale + ')');
    }

    init(_selector, _options);

    return {
        neo4jDataToD3Data: neo4jDataToD3Data,
        size: size,
        updateWithD3Data: updateWithD3Data,
        updateWithNeo4jData: updateWithNeo4jData,
        version: version,
        unfreezeAllNodes: unfreezeAllNodes,
        freezeAllNodes: freezeAllNodes,
        stopSimulation: stopSimulation
    };
}

export default Neo4jD3;