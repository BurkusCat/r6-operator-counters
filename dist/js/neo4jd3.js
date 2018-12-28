(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Neo4jd3 = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
'use strict';

var neo4jd3 = _dereq_('./scripts/neo4jd3');

module.exports = neo4jd3;

},{"./scripts/neo4jd3":2}],2:[function(_dereq_,module,exports){
/* global d3, document */
/* jshint latedef:nofunc */
'use strict';

function Neo4jD3(_selector, _options) {
    var container, graph, info, node, nodes, relationship, relationshipOutline, relationshipOverlay, relationshipText, relationships, selector, simulation, svg, svgNodes, svgRelationships, svgScale, svgTranslate,
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
            counters: [true, true, false]
        },
        builtRelations = {},
        VERSION = '0.0.1';

    function appendGraph(container) {
        svg = container.append('svg')
                       .attr('width', '100%')
                       .attr('height', '100%')
                       .attr('class', 'neo4jd3-graph')
                       .call(d3.zoom().on('zoom', function() {
                           var scale = d3.event.transform.k,
                               translate = [d3.event.transform.x, d3.event.transform.y];

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
  
        svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle")
            .attr("refX", 2)
            .attr("refY", 2)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 4 2 0 4 1 2")
            .style("fill", "#a5abb6");
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
                           classes = 'node',
                           label = d.labels[0];

                       if (icon(d)) {
                           classes += ' node-icon';
                       }

                       if (image(d)) {
                           classes += ' node-image';
                       }

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
                   .on('click', function(d) {
                       d.fx = d.fy = null;

                       if (typeof options.onNodeClick === 'function') {
                           options.onNodeClick(d);
                       }
                   })
                   .on('dblclick', function(d) {
                       stickNode(d);

                       if (typeof options.onNodeDoubleClick === 'function') {
                           options.onNodeDoubleClick(d);
                       }
                   })
                   .on('mouseenter', function(d) {
                       if (info) {
                           updateInfo(d);
                       }

                       if (typeof options.onNodeMouseEnter === 'function') {
                           options.onNodeMouseEnter(d);
                       }
                   })
                   .on('mouseleave', function(d) {
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

        //appendRingToNode(n);
        //appendOutlineToNode(n);

        if (options.icons) {
            //appendTextToNode(n);
        }

        if (options.images) {
            appendImageToNode(n);
        }

        return n;
    }

    function appendRelationship() {
        return relationship.enter()
                           .append('g')
                           .attr('class', 'relationship')
                           .on('dblclick', function(d) {
                               if (typeof options.onRelationshipDoubleClick === 'function') {
                                   options.onRelationshipDoubleClick(d);
                               }
                           })
                           .on('mouseenter', function(d) {
                               if (info) {
                                   updateInfo(d);
                               }
                           });
    }

    function appendOutlineToRelationship(r) {
        return r.append('path')
            .attr('class', 'outline link')
            .attr('fill', '#a5abb6')
            .attr("marker-end", "url(#triangle)");
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
                    var text = d.type;//builtRelations[`${d.startNode},${d.endNode},${d.type},`] ? '  '.repeat(d.type.length): d.type;
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

    function dragEnded(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0);
        }

        if (typeof options.onNodeDragEnd === 'function') {
            options.onNodeDragEnd(d);
        }
    }

    function dragged(d) {
        stickNode(d);
    }

    function dragStarted(d) {
        if (!d3.event.active) {
            simulation.alphaTarget(0.3).restart();
        }

        d.fx = d.x;
        d.fy = d.y;

        if (typeof options.onNodeDragStart === 'function') {
            options.onNodeDragStart(d);
        }
    }

    function extend(obj1, obj2) {
        var obj = {};

        merge(obj, obj1);
        merge(obj, obj2);

        return obj;
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
                           }).iterations(2))
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

    function loadNeo4jData() {
        nodes = [];
        relationships = [];

        updateWithNeo4jData(options.neo4jData);
    }

    function loadNeo4jDataFromUrl(neo4jDataUrl) {
        nodes = [];
        relationships = [];

        d3.json(neo4jDataUrl, function(error, data) {
            if (error) {
                throw error;
            }

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

    function randomD3Data(d, maxNodesToGenerate) {
        var data = {
                nodes: [],
                relationships: []
            },
            i,
            label,
            node,
            numNodes = (maxNodesToGenerate * Math.random() << 0) + 1,
            relationship,
            s = size();

        for (i = 0; i < numNodes; i++) {
            label = randomLabel();

            node = {
                id: s.nodes + 1 + i,
                labels: [label],
                properties: {
                    random: label
                },
                x: d.x,
                y: d.y
            };

            data.nodes[data.nodes.length] = node;

            relationship = {
                id: s.relationships + 1 + i,
                type: label.toUpperCase(),
                startNode: d.id,
                endNode: s.nodes + 1 + i,
                properties: {
                    from: Date.now()
                },
                source: d.id,
                target: s.nodes + 1 + i,
                linknum: s.relationships + 1 + i
            };

            data.relationships[data.relationships.length] = relationship;
        }

        return data;
    }

    function randomLabel() {
        var icons = Object.keys(options.iconMap);
        return icons[icons.length * Math.random() << 0];
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
    
    function stickNode(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function tick() {
        tickNodes();
        tickRelationships();
    }

    function tickNodes() {
        if (node) {
            node.attr('transform', function(d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            });
        }
    }

    function tickRelationships() {
        if (relationship) {
            relationship.attr('transform', function(d) {  
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

                return 'translate(' + d.source.x + ', ' + d.source.y + ') rotate(' + angle + ')';
            });

            tickRelationshipsTexts();
            tickRelationshipsOutlines();
            tickRelationshipsOverlays();
        }
    }

    function tickRelationshipsOutlines() {
        relationship.each(function () {
            var outline = d3.select(this).select('.outline');
            var text = d3.select(this).select('.text');
            outline.attr('d', function (d) {
                if (d.linknum === 1) {
                    return tickStraightRelationshipsOutline(d, text);
                } else {
                    return tickCurvedRelationshipsOutline(d);
                }
            });
        });
    }

    function tickStraightRelationshipsOutline(d, text) {
        var center = { x: 0, y: 0 },
            angle = rotation(d.source, d.target),
            textBoundingBox = text.node().getBBox(),
            textPadding = 5,
            u = unitaryVector(d.source, d.target),
            textMargin = { x: (d.target.x - d.source.x - (textBoundingBox.width + textPadding) * u.x) * 0.5, y: (d.target.y - d.source.y - (textBoundingBox.width + textPadding) * u.y) * 0.5 },
            n = unitaryNormalVector(d.source, d.target),
            rotatedPointA1 = rotatePoint(center, { x: textMargin.x - n.x, y: textMargin.y - n.y }, angle),
            rotatedPointB1 = rotatePoint(center, { x: 0 + (options.nodeRadius + 1) * u.x, y: 0 + (options.nodeRadius + 1) * u.y }, angle),
            rotatedPointA2 = rotatePoint(center, { x: d.target.x - d.source.x - (options.nodeRadius + 1) * u.x, y: d.target.y - d.source.y - (options.nodeRadius + 1) * u.y }, angle),
            rotatedPointB2 = rotatePoint(center, { x: d.target.x - d.source.x - textMargin.x - n.x, y: d.target.y - d.source.y - textMargin.y - n.y }, angle);

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

    function tickRelationshipsOverlays() {
        relationshipOverlay.attr('d', function (d) {
            if (d.linknum === 1) {
                return tickStraightRelationshipsOverlay(d);
            } else {
                return tickCurvedRelationshipsOverlay(d);
            }
        });
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

    function tickRelationshipsTexts() {
        relationshipText.attr('transform', function (d) {
            if (d.linknum === 1) {
                return tickStraightRelationshipsText(d);
            } else {
                return tickCurvedRelationshipsText(d);
            }
        });
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


    function toString(d) {
        var s = d.labels ? d.labels[0] : d.type;

        s += ' (<id>: ' + d.id;

        Object.keys(d.properties).forEach(function(property) {
            s += ', ' + property + ': ' + JSON.stringify(d.properties[property]);
        });

        s += ')';

        return s;
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

        relationshipOutline = svg.selectAll('.relationship .outline');
        relationshipOutline = relationshipEnter.outline.merge(relationshipOutline);

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
        randomD3Data: randomD3Data,
        size: size,
        updateWithD3Data: updateWithD3Data,
        updateWithNeo4jData: updateWithNeo4jData,
        version: version
    };
}

module.exports = Neo4jD3;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9pbmRleC5qcyIsInNyYy9tYWluL3NjcmlwdHMvbmVvNGpkMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgbmVvNGpkMyA9IHJlcXVpcmUoJy4vc2NyaXB0cy9uZW80amQzJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5lbzRqZDM7XHJcbiIsIi8qIGdsb2JhbCBkMywgZG9jdW1lbnQgKi9cclxuLyoganNoaW50IGxhdGVkZWY6bm9mdW5jICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIE5lbzRqRDMoX3NlbGVjdG9yLCBfb3B0aW9ucykge1xyXG4gICAgdmFyIGNvbnRhaW5lciwgZ3JhcGgsIGluZm8sIG5vZGUsIG5vZGVzLCByZWxhdGlvbnNoaXAsIHJlbGF0aW9uc2hpcE91dGxpbmUsIHJlbGF0aW9uc2hpcE92ZXJsYXksIHJlbGF0aW9uc2hpcFRleHQsIHJlbGF0aW9uc2hpcHMsIHNlbGVjdG9yLCBzaW11bGF0aW9uLCBzdmcsIHN2Z05vZGVzLCBzdmdSZWxhdGlvbnNoaXBzLCBzdmdTY2FsZSwgc3ZnVHJhbnNsYXRlLFxyXG4gICAgICAgIGNsYXNzZXMyY29sb3JzID0ge30sXHJcbiAgICAgICAganVzdExvYWRlZCA9IGZhbHNlLFxyXG4gICAgICAgIG51bUNsYXNzZXMgPSAwLFxyXG4gICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGFycm93U2l6ZTogNCxcclxuICAgICAgICAgICAgY29sb3JzOiBjb2xvcnMoKSxcclxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGljb25NYXA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaWNvbnM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaW1hZ2VNYXA6IHt9LFxyXG4gICAgICAgICAgICBpbWFnZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaW5mb1BhbmVsOiB0cnVlLFxyXG4gICAgICAgICAgICBtaW5Db2xsaXNpb246IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbmVvNGpEYXRhOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBub2RlT3V0bGluZUZpbGxDb2xvcjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBub2RlUmFkaXVzOiAyNSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcclxuICAgICAgICAgICAgem9vbUZpdDogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvdW50ZXJzOiBbdHJ1ZSwgdHJ1ZSwgZmFsc2VdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBidWlsdFJlbGF0aW9ucyA9IHt9LFxyXG4gICAgICAgIFZFUlNJT04gPSAnMC4wLjEnO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZEdyYXBoKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHN2ZyA9IGNvbnRhaW5lci5hcHBlbmQoJ3N2ZycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMtZ3JhcGgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIC5jYWxsKGQzLnpvb20oKS5vbignem9vbScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBkMy5ldmVudC50cmFuc2Zvcm0uayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IFtkMy5ldmVudC50cmFuc2Zvcm0ueCwgZDMuZXZlbnQudHJhbnNmb3JtLnldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN2Z1RyYW5zbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlWzBdICs9IHN2Z1RyYW5zbGF0ZVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVsxXSArPSBzdmdUcmFuc2xhdGVbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdmdTY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGUgKj0gc3ZnU2NhbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN2Zy5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB0cmFuc2xhdGVbMF0gKyAnLCAnICsgdHJhbnNsYXRlWzFdICsgJykgc2NhbGUoJyArIHNjYWxlICsgJyknKTtcclxuICAgICAgICAgICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrLnpvb20nLCBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKTtcclxuXHJcbiAgICAgICAgc3ZnUmVsYXRpb25zaGlwcyA9IHN2Zy5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwcycpO1xyXG5cclxuICAgICAgICBzdmdOb2RlcyA9IHN2Zy5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25vZGVzJyk7XHJcbiAgXHJcbiAgICAgICAgc3ZnLmFwcGVuZChcInN2ZzpkZWZzXCIpLmFwcGVuZChcInN2ZzptYXJrZXJcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRyaWFuZ2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwicmVmWFwiLCAyKVxyXG4gICAgICAgICAgICAuYXR0cihcInJlZllcIiwgMilcclxuICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXJXaWR0aFwiLCAzMClcclxuICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXJIZWlnaHRcIiwgMzApXHJcbiAgICAgICAgICAgIC5hdHRyKFwibWFya2VyVW5pdHNcIiwgXCJ1c2VyU3BhY2VPblVzZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIm9yaWVudFwiLCBcImF1dG9cIilcclxuICAgICAgICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIFwiTSAwIDAgNCAyIDAgNCAxIDJcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNhNWFiYjZcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kSW1hZ2VUb05vZGUobm9kZSkge1xyXG4gICAgICAgIHJldHVybiBub2RlLmFwcGVuZCgnaW1hZ2UnKVxyXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWNvbihkKSA/ICcyNHB4JzogJzcwcHgnO1xyXG4gICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzVweCc6ICctMzVweCc7XHJcbiAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzVweCc6ICctMzVweCc7XHJcbiAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzI0cHgnOiAnNzBweCc7XHJcbiAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvUGFuZWwoY29udGFpbmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5hcHBlbmQoJ2RpdicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWluZm8nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGlzTm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGVsZW0gPSBpbmZvLmFwcGVuZCgnYScpO1xyXG5cclxuICAgICAgICBlbGVtLmF0dHIoJ2hyZWYnLCAnIycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGNscylcclxuICAgICAgICAgICAgLmh0bWwoJzxzdHJvbmc+JyArIHByb3BlcnR5ICsgJzwvc3Ryb25nPicgKyAodmFsdWUgPyAoJzogJyArIHZhbHVlKSA6ICcnKSk7XHJcblxyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgICAgZWxlbS5zdHlsZSgnYmFja2dyb3VuZC1jb2xvcicsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiAoaXNOb2RlID8gY2xhc3MyY29sb3IocHJvcGVydHkpIDogZGVmYXVsdENvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZSgnYm9yZGVyLWNvbG9yJywgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gY2xhc3MyZGFya2VuQ29sb3Iob3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAoaXNOb2RlID8gY2xhc3MyZGFya2VuQ29sb3IocHJvcGVydHkpIDogZGVmYXVsdERhcmtlbkNvbG9yKCkpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5zdHlsZSgnY29sb3InLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBjbGFzczJkYXJrZW5Db2xvcihvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6ICcjZmZmJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbHRlciBncmFwaCBkYXRhIHRvIG9ubHkgc2hvdyBjZXJ0YWluIGNvdW50ZXIgcmVsYXRpb25zaGlwc1xyXG4gICAgICogQHBhcmFtIGRhdGEgVGhlIG9yaWdpbmFsIGdyYXBoIGRhdGFcclxuICAgICAqIEBwYXJhbSBoYXJkIEJvb2xlYW4gZm9yIHdoZXRoZXIgaGFyZCBjb3VudGVycyBzaG91bGQgYmUgc2hvd25cclxuICAgICAqIEBwYXJhbSBzb2Z0IEJvb2xlYW4gZm9yIHdoZXRoZXIgc29mdCBjb3VudGVycyBzaG91bGQgYmUgc2hvd25cclxuICAgICAqIEBwYXJhbSBtaW5vciBCb29sZWFuIGZvciB3aGV0aGVyIG1pbm9yIGNvdW50ZXJzIHNob3VsZCBiZSBzaG93blxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBmaWx0ZXJEYXRhQnlDb3VudGVyTGV2ZWwoZGF0YSwgaGFyZCwgc29mdCwgbWlub3IpIHtcclxuICAgICAgICBkYXRhLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMgPSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXJkICYmIHJlbGF0aW9uc2hpcC50eXBlID09PSAnSGFyZCBDb3VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNvZnQgJiYgcmVsYXRpb25zaGlwLnR5cGUgPT09ICdTb2Z0IENvdW50ZXInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWlub3IgJiYgcmVsYXRpb25zaGlwLnR5cGUgPT09ICdNaW5vciBDb3VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZEluZm9FbGVtZW50Q2xhc3MoY2xzLCBub2RlKSB7XHJcbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCB0cnVlLCBub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudFByb3BlcnR5KGNscywgcHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBzaG93IGFuIElEIHByb3BlcnR5XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAnJmx0O2lkJmd0OycpIHtcclxuICAgICAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnQoY2xzLCBmYWxzZSwgcHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwZW5kSW5mb0VsZW1lbnRSZWxhdGlvbnNoaXAoY2xzLCByZWxhdGlvbnNoaXApIHtcclxuICAgICAgICBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCByZWxhdGlvbnNoaXApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZE5vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUuZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhpZ2hsaWdodCwgaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyA9ICdub2RlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBkLmxhYmVsc1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKGljb24oZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaWNvbic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2UoZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaW1hZ2UnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGlnaGxpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHRpb25zLmhpZ2hsaWdodC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ID0gb3B0aW9ucy5oaWdobGlnaHRbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBoaWdobGlnaHQuY2xhc3MgJiYgZC5wcm9wZXJ0aWVzW2hpZ2hsaWdodC5wcm9wZXJ0eV0gPT09IGhpZ2hsaWdodC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWhpZ2hsaWdodGVkJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXM7XHJcbiAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBkLmZ4ID0gZC5meSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVDbGljayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTm9kZUNsaWNrKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHN0aWNrTm9kZShkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlRG91YmxlQ2xpY2soZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbmZvKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbk5vZGVNb3VzZUVudGVyKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbmZvKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbk5vZGVNb3VzZUxlYXZlKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAuY2FsbChkMy5kcmFnKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdzdGFydCcsIGRyYWdTdGFydGVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCBkcmFnZ2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2VuZCcsIGRyYWdFbmRlZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZE5vZGVUb0dyYXBoKCkge1xyXG4gICAgICAgIHZhciBuID0gYXBwZW5kTm9kZSgpO1xyXG5cclxuICAgICAgICAvL2FwcGVuZFJpbmdUb05vZGUobik7XHJcbiAgICAgICAgLy9hcHBlbmRPdXRsaW5lVG9Ob2RlKG4pO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29ucykge1xyXG4gICAgICAgICAgICAvL2FwcGVuZFRleHRUb05vZGUobik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMpIHtcclxuICAgICAgICAgICAgYXBwZW5kSW1hZ2VUb05vZGUobik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRSZWxhdGlvbnNoaXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrKGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUluZm8oZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZE91dGxpbmVUb1JlbGF0aW9uc2hpcChyKSB7XHJcbiAgICAgICAgcmV0dXJuIHIuYXBwZW5kKCdwYXRoJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUgbGluaycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJyNhNWFiYjYnKVxyXG4gICAgICAgICAgICAuYXR0cihcIm1hcmtlci1lbmRcIiwgXCJ1cmwoI3RyaWFuZ2xlKVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRPdmVybGF5VG9SZWxhdGlvbnNoaXAocikge1xyXG4gICAgICAgIHJldHVybiByLmFwcGVuZCgncGF0aCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnb3ZlcmxheScpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyKSB7XHJcbiAgICAgICAgcmV0dXJuIHIuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0ZXh0JylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdmaWxsJywgJyNmZmZmZmYnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICc4cHgnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgICAgICAgICAgICAudGV4dChmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBkLnR5cGU7Ly9idWlsdFJlbGF0aW9uc1tgJHtkLnN0YXJ0Tm9kZX0sJHtkLmVuZE5vZGV9LCR7ZC50eXBlfSxgXSA/ICfigIIgJy5yZXBlYXQoZC50eXBlLmxlbmd0aCk6IGQudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAvL2J1aWx0UmVsYXRpb25zW2Ake2QuZW5kTm9kZX0sJHtkLnN0YXJ0Tm9kZX0sJHtkLnR5cGV9LGBdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBidWlsdFJlbGF0aW9uc1tkLmVuZE5vZGUrJywnK2Quc3RhcnROb2RlKycsJytkLnR5cGUrJywnXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhcHBlbmRSZWxhdGlvbnNoaXBUb0dyYXBoKCkge1xyXG4gICAgICAgIHZhciByZWxhdGlvbnNoaXAgPSBhcHBlbmRSZWxhdGlvbnNoaXAoKSxcclxuICAgICAgICAgICAgdGV4dCA9IGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApLFxyXG4gICAgICAgICAgICBvdXRsaW5lID0gYXBwZW5kT3V0bGluZVRvUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCksXHJcbiAgICAgICAgICAgIG92ZXJsYXkgPSBhcHBlbmRPdmVybGF5VG9SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgb3V0bGluZTogb3V0bGluZSxcclxuICAgICAgICAgICAgb3ZlcmxheTogb3ZlcmxheSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsYXNzMmNvbG9yKGNscykge1xyXG4gICAgICAgIHZhciBjb2xvciA9IGNsYXNzZXMyY29sb3JzW2Nsc107XHJcblxyXG4gICAgICAgIGlmICghY29sb3IpIHtcclxuLy8gICAgICAgICAgICBjb2xvciA9IG9wdGlvbnMuY29sb3JzW01hdGgubWluKG51bUNsYXNzZXMsIG9wdGlvbnMuY29sb3JzLmxlbmd0aCAtIDEpXTtcclxuICAgICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yc1tudW1DbGFzc2VzICUgb3B0aW9ucy5jb2xvcnMubGVuZ3RoXTtcclxuICAgICAgICAgICAgY2xhc3NlczJjb2xvcnNbY2xzXSA9IGNvbG9yO1xyXG4gICAgICAgICAgICBudW1DbGFzc2VzKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xhc3MyZGFya2VuQ29sb3IoY2xzKSB7XHJcbiAgICAgICAgcmV0dXJuIGQzLnJnYihjbGFzczJjb2xvcihjbHMpKS5kYXJrZXIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2xlYXJJbmZvKCkge1xyXG4gICAgICAgIGluZm8uaHRtbCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29sb3JzW29wdGlvbnMuY29sb3JzLmxlbmd0aCAqIE1hdGgucmFuZG9tKCkgPDwgMF07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29sb3JzKCkge1xyXG4gICAgICAgIC8vIGQzLnNjaGVtZUNhdGVnb3J5MTAsXHJcbiAgICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkyMCxcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAnIzY4YmRmNicsIC8vIGxpZ2h0IGJsdWVcclxuICAgICAgICAgICAgJyM2ZGNlOWUnLCAvLyBncmVlbiAjMVxyXG4gICAgICAgICAgICAnI2ZhYWZjMicsIC8vIGxpZ2h0IHBpbmtcclxuICAgICAgICAgICAgJyNmMmJhZjYnLCAvLyBwdXJwbGVcclxuICAgICAgICAgICAgJyNmZjkyOGMnLCAvLyBsaWdodCByZWRcclxuICAgICAgICAgICAgJyNmY2VhN2UnLCAvLyBsaWdodCB5ZWxsb3dcclxuICAgICAgICAgICAgJyNmZmM3NjYnLCAvLyBsaWdodCBvcmFuZ2VcclxuICAgICAgICAgICAgJyM0MDVmOWUnLCAvLyBuYXZ5IGJsdWVcclxuICAgICAgICAgICAgJyNhNWFiYjYnLCAvLyBkYXJrIGdyYXlcclxuICAgICAgICAgICAgJyM3OGNlY2InLCAvLyBncmVlbiAjMixcclxuICAgICAgICAgICAgJyNiODhjYmInLCAvLyBkYXJrIHB1cnBsZVxyXG4gICAgICAgICAgICAnI2NlZDJkOScsIC8vIGxpZ2h0IGdyYXlcclxuICAgICAgICAgICAgJyNlODQ2NDYnLCAvLyBkYXJrIHJlZFxyXG4gICAgICAgICAgICAnI2ZhNWY4NicsIC8vIGRhcmsgcGlua1xyXG4gICAgICAgICAgICAnI2ZmYWIxYScsIC8vIGRhcmsgb3JhbmdlXHJcbiAgICAgICAgICAgICcjZmNkYTE5JywgLy8gZGFyayB5ZWxsb3dcclxuICAgICAgICAgICAgJyM3OTdiODAnLCAvLyBibGFja1xyXG4gICAgICAgICAgICAnI2M5ZDk2ZicsIC8vIHBpc3RhY2NoaW9cclxuICAgICAgICAgICAgJyM0Nzk5MWYnLCAvLyBncmVlbiAjM1xyXG4gICAgICAgICAgICAnIzcwZWRlZScsIC8vIHR1cnF1b2lzZVxyXG4gICAgICAgICAgICAnI2ZmNzVlYScgIC8vIHBpbmtcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zKGFycmF5LCBpZCkge1xyXG4gICAgICAgIHZhciBmaWx0ZXIgPSBhcnJheS5maWx0ZXIoZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbS5pZCA9PT0gaWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmaWx0ZXIubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0Q29sb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMucmVsYXRpb25zaGlwQ29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmYXVsdERhcmtlbkNvbG9yKCkge1xyXG4gICAgICAgIHJldHVybiBkMy5yZ2Iob3B0aW9ucy5jb2xvcnNbb3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMV0pLmRhcmtlcigxKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmFnRW5kZWQoZCkge1xyXG4gICAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25Ob2RlRHJhZ0VuZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBvcHRpb25zLm9uTm9kZURyYWdFbmQoZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYWdnZWQoZCkge1xyXG4gICAgICAgIHN0aWNrTm9kZShkKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmFnU3RhcnRlZChkKSB7XHJcbiAgICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcclxuICAgICAgICAgICAgc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGQuZnggPSBkLng7XHJcbiAgICAgICAgZC5meSA9IGQueTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZURyYWdTdGFydCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBvcHRpb25zLm9uTm9kZURyYWdTdGFydChkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZXh0ZW5kKG9iajEsIG9iajIpIHtcclxuICAgICAgICB2YXIgb2JqID0ge307XHJcblxyXG4gICAgICAgIG1lcmdlKG9iaiwgb2JqMSk7XHJcbiAgICAgICAgbWVyZ2Uob2JqLCBvYmoyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpY29uKGQpIHtcclxuICAgICAgICB2YXIgY29kZTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWNvbk1hcCAmJiBvcHRpb25zLnNob3dJY29ucyAmJiBvcHRpb25zLmljb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSAmJiBvcHRpb25zLmljb25NYXBbb3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gb3B0aW9ucy5pY29uTWFwW29wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlID0gb3B0aW9ucy5pY29uTWFwW2QubGFiZWxzWzBdXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25zW2QubGFiZWxzWzBdXSkge1xyXG4gICAgICAgICAgICAgICAgY29kZSA9IG9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbWFnZShkKSB7XHJcbiAgICAgICAgdmFyIGksIGltYWdlc0ZvckxhYmVsLCBpbWcsIGltZ0xldmVsLCBsYWJlbCwgbGFiZWxQcm9wZXJ0eVZhbHVlLCBwcm9wZXJ0eSwgdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLmltYWdlcykge1xyXG4gICAgICAgICAgICBpbWFnZXNGb3JMYWJlbCA9IG9wdGlvbnMuaW1hZ2VNYXBbZC5sYWJlbHNbMF1dO1xyXG5cclxuICAgICAgICAgICAgaWYgKGltYWdlc0ZvckxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICBpbWdMZXZlbCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGltYWdlc0ZvckxhYmVsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxQcm9wZXJ0eVZhbHVlID0gaW1hZ2VzRm9yTGFiZWxbaV0uc3BsaXQoJ3wnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbFByb3BlcnR5VmFsdWVbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBsYWJlbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXByb3BlcnR5IHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgKCF2YWx1ZSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldID09PSB2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGggPiBpbWdMZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nID0gb3B0aW9ucy5pbWFnZXNbaW1hZ2VzRm9yTGFiZWxbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1nTGV2ZWwgPSBsYWJlbFByb3BlcnR5VmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW1nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoX3NlbGVjdG9yLCBfb3B0aW9ucykge1xyXG4gICAgICAgIG1lcmdlKG9wdGlvbnMsIF9vcHRpb25zKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5pY29ucykge1xyXG4gICAgICAgICAgICBvcHRpb25zLnNob3dJY29ucyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIW9wdGlvbnMubWluQ29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMubWluQ29sbGlzaW9uID0gb3B0aW9ucy5ub2RlUmFkaXVzICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluaXRJbWFnZU1hcCgpO1xyXG5cclxuICAgICAgICBzZWxlY3RvciA9IF9zZWxlY3RvcjtcclxuXHJcbiAgICAgICAgY29udGFpbmVyID0gZDMuc2VsZWN0KHNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmF0dHIoJ2NsYXNzJywgJ25lbzRqZDMnKVxyXG4gICAgICAgICAgICAgICAgIC5odG1sKCcnKTtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5mb1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGluZm8gPSBhcHBlbmRJbmZvUGFuZWwoY29udGFpbmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFwcGVuZEdyYXBoKGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHNpbXVsYXRpb24gPSBpbml0U2ltdWxhdGlvbigpO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5uZW80akRhdGEpIHtcclxuICAgICAgICAgICAgbG9hZE5lbzRqRGF0YShvcHRpb25zLm5lbzRqRGF0YSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLm5lbzRqRGF0YVVybCkge1xyXG4gICAgICAgICAgICBsb2FkTmVvNGpEYXRhRnJvbVVybChvcHRpb25zLm5lbzRqRGF0YVVybCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IGJvdGggbmVvNGpEYXRhIGFuZCBuZW80akRhdGFVcmwgYXJlIGVtcHR5IScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0SW1hZ2VNYXAoKSB7XHJcbiAgICAgICAgdmFyIGtleSwga2V5cywgc2VsZWN0b3I7XHJcblxyXG4gICAgICAgIGZvciAoa2V5IGluIG9wdGlvbnMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmltYWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBrZXlzID0ga2V5LnNwbGl0KCd8Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXSA9IFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0U2ltdWxhdGlvbigpIHtcclxuICAgICAgICB2YXIgc2ltdWxhdGlvbiA9IGQzLmZvcmNlU2ltdWxhdGlvbigpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZlbG9jaXR5RGVjYXkoMC44KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JjZSgneCcsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JjZSgneScsIGQzLmZvcmNlKCkuc3RyZW5ndGgoMC4wMDIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubWluQ29sbGlzaW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5pdGVyYXRpb25zKDIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHkoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvcmNlKCdsaW5rJywgZDMuZm9yY2VMaW5rKCkuaWQoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ2NlbnRlcicsIGQzLmZvcmNlQ2VudGVyKHN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoIC8gMiwgc3ZnLm5vZGUoKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbigndGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuem9vbUZpdCAmJiAhanVzdExvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RMb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpvb21GaXQoMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc2ltdWxhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkTmVvNGpEYXRhKCkge1xyXG4gICAgICAgIG5vZGVzID0gW107XHJcbiAgICAgICAgcmVsYXRpb25zaGlwcyA9IFtdO1xyXG5cclxuICAgICAgICB1cGRhdGVXaXRoTmVvNGpEYXRhKG9wdGlvbnMubmVvNGpEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkTmVvNGpEYXRhRnJvbVVybChuZW80akRhdGFVcmwpIHtcclxuICAgICAgICBub2RlcyA9IFtdO1xyXG4gICAgICAgIHJlbGF0aW9uc2hpcHMgPSBbXTtcclxuXHJcbiAgICAgICAgZDMuanNvbihuZW80akRhdGFVcmwsIGZ1bmN0aW9uKGVycm9yLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRhdGEgPSBmaWx0ZXJEYXRhQnlDb3VudGVyTGV2ZWwoZGF0YSwgb3B0aW9ucy5jb3VudGVyc1swXSwgb3B0aW9ucy5jb3VudGVyc1sxXSwgb3B0aW9ucy5jb3VudGVyc1syXSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZVdpdGhOZW80akRhdGEoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbmVvNGpEYXRhVG9EM0RhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciBncmFwaCA9IHtcclxuICAgICAgICAgICAgbm9kZXM6IFtdLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuZ3JhcGgubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWlucyhncmFwaC5ub2Rlcywgbm9kZS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGgubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVscyA9IGRhdGEuZ3JhcGgucmVsYXRpb25zaGlwcztcclxuICAgICAgICAgICAgICAgIHJlbHMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRpb25zaGlwLnN0YXJ0Tm9kZSA9PT0gcmVsYXRpb25zaGlwLmVuZE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAuc291cmNlID0gcmVsYXRpb25zaGlwLnN0YXJ0Tm9kZTtcclxuICAgICAgICAgICAgICAgICAgICByZWxhdGlvbnNoaXAudGFyZ2V0ID0gcmVsYXRpb25zaGlwLmVuZE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGgucmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gaTsgaiA8IHJlbHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWxzW2ldLmxpbmtudW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbaV0ubGlua251bSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWxzW2pdLmxpbmtudW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbal0ubGlua251bSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSBiaS1kaXJlY3Rpb25hbCByZWxhdGlvbnNoaXAsIHVwZGF0ZSBsaW5rbnVtIHRvIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbHNbaV0uc291cmNlID09PSByZWxzW2pdLnRhcmdldCAmJiByZWxzW2ldLnRhcmdldCA9PT0gcmVsc1tqXS5zb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbaV0ubGlua251bSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxzW2pdLmxpbmtudW0gPSAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdyYXBoO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIG5vZGVzOiBbXSxcclxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBub2RlLFxyXG4gICAgICAgICAgICBudW1Ob2RlcyA9IChtYXhOb2Rlc1RvR2VuZXJhdGUgKiBNYXRoLnJhbmRvbSgpIDw8IDApICsgMSxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxyXG4gICAgICAgICAgICBzID0gc2l6ZSgpO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHJhbmRvbUxhYmVsKCk7XHJcblxyXG4gICAgICAgICAgICBub2RlID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHMubm9kZXMgKyAxICsgaSxcclxuICAgICAgICAgICAgICAgIGxhYmVsczogW2xhYmVsXSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICByYW5kb206IGxhYmVsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeDogZC54LFxyXG4gICAgICAgICAgICAgICAgeTogZC55XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBkYXRhLm5vZGVzW2RhdGEubm9kZXMubGVuZ3RoXSA9IG5vZGU7XHJcblxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogcy5yZWxhdGlvbnNoaXBzICsgMSArIGksXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBsYWJlbC50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkLmlkLFxyXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogcy5ub2RlcyArIDEgKyBpLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IERhdGUubm93KClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGQuaWQsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHMubm9kZXMgKyAxICsgaSxcclxuICAgICAgICAgICAgICAgIGxpbmtudW06IHMucmVsYXRpb25zaGlwcyArIDEgKyBpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBkYXRhLnJlbGF0aW9uc2hpcHNbZGF0YS5yZWxhdGlvbnNoaXBzLmxlbmd0aF0gPSByZWxhdGlvbnNoaXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByYW5kb21MYWJlbCgpIHtcclxuICAgICAgICB2YXIgaWNvbnMgPSBPYmplY3Qua2V5cyhvcHRpb25zLmljb25NYXApO1xyXG4gICAgICAgIHJldHVybiBpY29uc1tpY29ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XHJcbiAgICAgICAgdmFyIHJhZGlhbnMgPSAoTWF0aC5QSSAvIDE4MCkgKiBhbmdsZSxcclxuICAgICAgICAgICAgY29zID0gTWF0aC5jb3MocmFkaWFucyksXHJcbiAgICAgICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxyXG4gICAgICAgICAgICBueCA9IChjb3MgKiAoeCAtIGN4KSkgKyAoc2luICogKHkgLSBjeSkpICsgY3gsXHJcbiAgICAgICAgICAgIG55ID0gKGNvcyAqICh5IC0gY3kpKSAtIChzaW4gKiAoeCAtIGN4KSkgKyBjeTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgeDogbngsIHk6IG55IH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcm90YXRlUG9pbnQoYywgcCwgYW5nbGUpIHtcclxuICAgICAgICByZXR1cm4gcm90YXRlKGMueCwgYy55LCBwLngsIHAueSwgYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJvdGF0aW9uKHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IG5vZGVzLmxlbmd0aCxcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogcmVsYXRpb25zaGlwcy5sZW5ndGhcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBzdGlja05vZGUoZCkge1xyXG4gICAgICAgIGQuZnggPSBkMy5ldmVudC54O1xyXG4gICAgICAgIGQuZnkgPSBkMy5ldmVudC55O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2soKSB7XHJcbiAgICAgICAgdGlja05vZGVzKCk7XHJcbiAgICAgICAgdGlja1JlbGF0aW9uc2hpcHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrTm9kZXMoKSB7XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgbm9kZS5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgZC54ICsgJywgJyArIGQueSArICcpJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tSZWxhdGlvbnNoaXBzKCkge1xyXG4gICAgICAgIGlmIChyZWxhdGlvbnNoaXApIHtcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHsgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGNlbnRlciA9IHt4OiAwLCB5OiAwfSxcclxuICAgICAgICAgICAgICAgICAgYW5nbGUgPSByb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpLFxyXG4gICAgICAgICAgICAgICAgICB1ID0gdW5pdGFyeVZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxyXG4gICAgICAgICAgICAgICAgICBuID0gdW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxyXG4gICAgICAgICAgICAgICAgICBnID0gcm90YXRlUG9pbnQoY2VudGVyLCB1LCAtMTApLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2UgPSByb3RhdGVQb2ludChjZW50ZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICB4OiAwICsgKG9wdGlvbnMubm9kZVJhZGl1cyArIDEpICogdS54IC0gbi54LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgLSBuLnlcclxuICAgICAgICAgICAgICAgICAgfSwgYW5nbGUgKyAxMCksXHJcbiAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHJvdGF0ZVBvaW50KGNlbnRlciwge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDIpICogZy54LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDIpICogZy55XHJcbiAgICAgICAgICAgICAgICAgIH0sIGFuZ2xlKSxcclxuICAgICAgICAgICAgICAgICAgdXUgPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKHNvdXJjZSwgdGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgICAgbWlkZGxlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IChzb3VyY2UueCArIHRhcmdldC54KSAvIDIgKyB1dS54ICogMjAsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMiArIHV1LnkgKiAyMFxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgZC5vdXRsaW5lID0geyBtaWRkbGU6IG1pZGRsZSwgc291cmNlOiBzb3VyY2UsIHRhcmdldDogdGFyZ2V0LCB1OiB1dSB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnNvdXJjZS54ICsgJywgJyArIGQuc291cmNlLnkgKyAnKSByb3RhdGUoJyArIGFuZ2xlICsgJyknO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKTtcclxuICAgICAgICAgICAgdGlja1JlbGF0aW9uc2hpcHNPdXRsaW5lcygpO1xyXG4gICAgICAgICAgICB0aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKSB7XHJcbiAgICAgICAgcmVsYXRpb25zaGlwLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgb3V0bGluZSA9IGQzLnNlbGVjdCh0aGlzKS5zZWxlY3QoJy5vdXRsaW5lJyk7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnLnRleHQnKTtcclxuICAgICAgICAgICAgb3V0bGluZS5hdHRyKCdkJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkLmxpbmtudW0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlja1N0cmFpZ2h0UmVsYXRpb25zaGlwc091dGxpbmUoZCwgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWNrQ3VydmVkUmVsYXRpb25zaGlwc091dGxpbmUoZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNPdXRsaW5lKGQsIHRleHQpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlID0gcm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgdGV4dEJvdW5kaW5nQm94ID0gdGV4dC5ub2RlKCkuZ2V0QkJveCgpLFxyXG4gICAgICAgICAgICB0ZXh0UGFkZGluZyA9IDUsXHJcbiAgICAgICAgICAgIHUgPSB1bml0YXJ5VmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXHJcbiAgICAgICAgICAgIHRleHRNYXJnaW4gPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LngpICogMC41LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAodGV4dEJvdW5kaW5nQm94LndpZHRoICsgdGV4dFBhZGRpbmcpICogdS55KSAqIDAuNSB9LFxyXG4gICAgICAgICAgICBuID0gdW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRBMSA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IHRleHRNYXJnaW4ueSAtIG4ueSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgIHJvdGF0ZWRQb2ludEIxID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LngsIHk6IDAgKyAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRBMiA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRCMiA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIHRleHRNYXJnaW4ueCAtIG4ueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpO1xyXG5cclxuICAgICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEExLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMS55ICtcclxuICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCMS54ICsgJyAnICsgcm90YXRlZFBvaW50QjEueSArXHJcbiAgICAgICAgICAgICcgWiBNICcgKyByb3RhdGVkUG9pbnRBMi54ICsgJyAnICsgcm90YXRlZFBvaW50QTIueSArXHJcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjIueCArICcgJyArIHJvdGF0ZWRQb2ludEIyLnkgK1xyXG4gICAgICAgICAgICAnIFonO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzT3V0bGluZShkKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IGQub3V0bGluZS5zb3VyY2UsXHJcbiAgICAgICAgdGFyZ2V0ID0gZC5vdXRsaW5lLnRhcmdldCxcclxuICAgICAgICBtaWRkbGUgPSBkLm91dGxpbmUubWlkZGxlO1xyXG4gICAgICAgIHJldHVybiAnTSAnICsgdGFyZ2V0LnggKyAnLCAnICsgdGFyZ2V0LnkgKyAnICcgK1xyXG4gICAgICAgICAgICAnUSAnICsgbWlkZGxlLnggKyAnICcgKyBtaWRkbGUueSArICcgJyArIHNvdXJjZS54ICsgJyAnICsgc291cmNlLnkgKyAnICcgK1xyXG4gICAgICAgICAgICAnUSAnICsgbWlkZGxlLnggKyAnICcgKyBtaWRkbGUueSArICcgJyArIHRhcmdldC54ICsgJywgJyArIHRhcmdldC55O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKSB7XHJcbiAgICAgICAgcmVsYXRpb25zaGlwT3ZlcmxheS5hdHRyKCdkJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgaWYgKGQubGlua251bSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNPdmVybGF5KGQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzT3ZlcmxheShkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNPdmVybGF5KGQpIHtcclxuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXHJcbiAgICAgICAgICAgIGFuZ2xlID0gcm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSxcclxuICAgICAgICAgICAgbjEgPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXHJcbiAgICAgICAgICAgIG4gPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCwgNTApLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRBID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgLSBuLngsIHk6IDAgLSBuLnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRCID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gbi54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtIG4ueSB9LCBhbmdsZSksXHJcbiAgICAgICAgICAgIHJvdGF0ZWRQb2ludEMgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggKyBuLnggLSBuMS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSArIG4ueSAtIG4xLnkgfSwgYW5nbGUpLFxyXG4gICAgICAgICAgICByb3RhdGVkUG9pbnREID0gcm90YXRlUG9pbnQoY2VudGVyLCB7IHg6IDAgKyBuLnggLSBuMS54LCB5OiAwICsgbi55IC0gbjEueSB9LCBhbmdsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QS54ICsgJyAnICsgcm90YXRlZFBvaW50QS55ICtcclxuICAgICAgICAgICAgJyBMICcgKyByb3RhdGVkUG9pbnRCLnggKyAnICcgKyByb3RhdGVkUG9pbnRCLnkgK1xyXG4gICAgICAgICAgICAnIEwgJyArIHJvdGF0ZWRQb2ludEMueCArICcgJyArIHJvdGF0ZWRQb2ludEMueSArXHJcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RC54ICsgJyAnICsgcm90YXRlZFBvaW50RC55ICtcclxuICAgICAgICAgICAgJyBaJztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrQ3VydmVkUmVsYXRpb25zaGlwc092ZXJsYXkoZCkge1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSBkLm91dGxpbmUuc291cmNlLFxyXG4gICAgICAgICAgICB0YXJnZXQgPSBkLm91dGxpbmUudGFyZ2V0LFxyXG4gICAgICAgICAgICBtaWRkbGUgPSBkLm91dGxpbmUubWlkZGxlO1xyXG4gICAgICAgIHZhciBsaW5lVGhpY2tuZXNzID0gNTtcclxuICAgICAgICByZXR1cm4gJ00gJyArIChzb3VyY2UueCArIGxpbmVUaGlja25lc3MpICsgJywgJyArIChzb3VyY2UueSArIGxpbmVUaGlja25lc3MpICsgJyAnICtcclxuICAgICAgICAgICAgJ1EgJyArIChtaWRkbGUueCArIGxpbmVUaGlja25lc3MpICsgJyAnICsgKG1pZGRsZS55ICsgbGluZVRoaWNrbmVzcykgKyAnICcgKyAodGFyZ2V0LnggLSBsaW5lVGhpY2tuZXNzKSArICcgJyArICh0YXJnZXQueSAtIGxpbmVUaGlja25lc3MpICtcclxuICAgICAgICAgICAgJ1EgICcgKyAobWlkZGxlLnggLSBsaW5lVGhpY2tuZXNzKSArICcgJyArIChtaWRkbGUueSAtIGxpbmVUaGlja25lc3MpICsgJyAgJyArIChzb3VyY2UueCAtIGxpbmVUaGlja25lc3MpICArICcgJyArIChzb3VyY2UueSAtIGxpbmVUaGlja25lc3MpICArXHJcbiAgICAgICAgICAgICdaIE0gJyArICh0YXJnZXQueCAtIGxpbmVUaGlja25lc3MpICsgJywgJyArICh0YXJnZXQueSAtIGxpbmVUaGlja25lc3MpICsgJyAnICtcclxuICAgICAgICAgICAgJ1EgJyArIChtaWRkbGUueCAtIGxpbmVUaGlja25lc3MpICsgJyAnICsgKG1pZGRsZS55IC0gbGluZVRoaWNrbmVzcykgKyAnICcgKyAoc291cmNlLnggKyBsaW5lVGhpY2tuZXNzKSArICcgJyArIChzb3VyY2UueSArIGxpbmVUaGlja25lc3MpICtcclxuICAgICAgICAgICAgJ1EgICcgKyAobWlkZGxlLnggKyBsaW5lVGhpY2tuZXNzKSArICcgJyArIChtaWRkbGUueSArIGxpbmVUaGlja25lc3MpICsgJyAgJyArICh0YXJnZXQueCArIGxpbmVUaGlja25lc3MpICArICcgJyArICh0YXJnZXQueSArIGxpbmVUaGlja25lc3MpICArXHJcbiAgICAgICAgICAgICdaJztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCkge1xyXG4gICAgICAgIHJlbGF0aW9uc2hpcFRleHQuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgaWYgKGQubGlua251bSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNUZXh0KGQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzVGV4dChkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNUZXh0KGQpIHtcclxuICAgICAgICB2YXIgYW5nbGUgPSAocm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSArIDM2MCkgJSAzNjAsXHJcbiAgICAgICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXHJcbiAgICAgICAgICAgIGNlbnRlciA9IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICAgICAgICBuID0gdW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxyXG4gICAgICAgICAgICBuV2VpZ2h0ID0gbWlycm9yID8gMiA6IC0zLFxyXG4gICAgICAgICAgICBwb2ludCA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54KSAqIDAuNSArIG4ueCAqIG5XZWlnaHQsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSkgKiAwLjUgKyBuLnkgKiBuV2VpZ2h0IH0sXHJcbiAgICAgICAgICAgIHJvdGF0ZWRQb2ludCA9IHJvdGF0ZVBvaW50KGNlbnRlciwgcG9pbnQsIGFuZ2xlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHJvdGF0ZWRQb2ludC54ICsgJywgJyArIHJvdGF0ZWRQb2ludC55ICsgJykgcm90YXRlKCcgKyAobWlycm9yID8gMTgwIDogMCkgKyAnKSc7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGlja0N1cnZlZFJlbGF0aW9uc2hpcHNUZXh0KGQpIHtcclxuICAgICAgICB2YXIgYW5nbGUgPSAocm90YXRpb24oZC5zb3VyY2UsIGQudGFyZ2V0KSArIDM2MCkgJSAzNjAsXHJcbiAgICAgICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXHJcbiAgICAgICAgICAgIHNvdXJjZSA9IGQub3V0bGluZS5zb3VyY2UsXHJcbiAgICAgICAgICAgIHRhcmdldCA9IGQub3V0bGluZS50YXJnZXQsXHJcbiAgICAgICAgICAgIHUgPSBkLm91dGxpbmUudSxcclxuICAgICAgICAgICAgbWlkZGxlID0ge1xyXG4gICAgICAgICAgICAgICAgeDogKHNvdXJjZS54ICsgdGFyZ2V0LngpIC8gMiArIHUueCAqIChtaXJyb3IgPyA4IDogMTApICsgdS54LFxyXG4gICAgICAgICAgICAgICAgeTogKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMiArIHUueSAqIChtaXJyb3IgPyA4IDogMTApICsgdS55XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIG1pZGRsZS54ICsgJywgJyArIG1pZGRsZS55ICsgJykgcm90YXRlKCcgKyAobWlycm9yID8gMTgwIDogMCkgKyAnKSc7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nKGQpIHtcclxuICAgICAgICB2YXIgcyA9IGQubGFiZWxzID8gZC5sYWJlbHNbMF0gOiBkLnR5cGU7XHJcblxyXG4gICAgICAgIHMgKz0gJyAoPGlkPjogJyArIGQuaWQ7XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBzICs9ICcsICcgKyBwcm9wZXJ0eSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcyArPSAnKSc7XHJcblxyXG4gICAgICAgIHJldHVybiBzO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVuaXRhcnlOb3JtYWxWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aCkge1xyXG4gICAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcclxuICAgICAgICAgICAgdmVjdG9yID0gdW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvdGF0ZVBvaW50KGNlbnRlciwgdmVjdG9yLCA5MCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXQueCAtIHNvdXJjZS54LCAyKSArIE1hdGgucG93KHRhcmdldC55IC0gc291cmNlLnksIDIpKSAvIE1hdGguc3FydChuZXdMZW5ndGggfHwgMSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICh0YXJnZXQueCAtIHNvdXJjZS54KSAvIGxlbmd0aCxcclxuICAgICAgICAgICAgeTogKHRhcmdldC55IC0gc291cmNlLnkpIC8gbGVuZ3RoLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlV2l0aEQzRGF0YShkM0RhdGEpIHtcclxuICAgICAgICB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMoZDNEYXRhLm5vZGVzLCBkM0RhdGEucmVsYXRpb25zaGlwcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlV2l0aE5lbzRqRGF0YShuZW80akRhdGEpIHtcclxuICAgICAgICB2YXIgZDNEYXRhID0gbmVvNGpEYXRhVG9EM0RhdGEobmVvNGpEYXRhKTtcclxuICAgICAgICB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5mbyhkKSB7XHJcbiAgICAgICAgY2xlYXJJbmZvKCk7XHJcblxyXG4gICAgICAgIGlmIChkLmxhYmVscykge1xyXG4gICAgICAgICAgICBhcHBlbmRJbmZvRWxlbWVudENsYXNzKCdjbGFzcycsIGQubGFiZWxzWzBdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcCgnY2xhc3MnLCBkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCAnJmx0O2lkJmd0OycsIGQuaWQpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhkLnByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCBwcm9wZXJ0eSwgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU5vZGVzKG4pIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShub2Rlcywgbik7XHJcblxyXG4gICAgICAgIG5vZGUgPSBzdmdOb2Rlcy5zZWxlY3RBbGwoJy5ub2RlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShub2RlcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XHJcbiAgICAgICAgdmFyIG5vZGVFbnRlciA9IGFwcGVuZE5vZGVUb0dyYXBoKCk7XHJcbiAgICAgICAgbm9kZSA9IG5vZGVFbnRlci5tZXJnZShub2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVOb2Rlc0FuZFJlbGF0aW9uc2hpcHMobiwgcikge1xyXG4gICAgICAgIHVwZGF0ZVJlbGF0aW9uc2hpcHMocik7XHJcbiAgICAgICAgdXBkYXRlTm9kZXMobik7XHJcblxyXG4gICAgICAgIHNpbXVsYXRpb24ubm9kZXMobm9kZXMpO1xyXG4gICAgICAgIHNpbXVsYXRpb24uZm9yY2UoJ2xpbmsnKS5saW5rcyhyZWxhdGlvbnNoaXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVSZWxhdGlvbnNoaXBzKHIpIHtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZWxhdGlvbnNoaXBzLCByKTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwID0gc3ZnUmVsYXRpb25zaGlwcy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShyZWxhdGlvbnNoaXBzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcclxuXHJcbiAgICAgICAgdmFyIHJlbGF0aW9uc2hpcEVudGVyID0gYXBwZW5kUmVsYXRpb25zaGlwVG9HcmFwaCgpO1xyXG5cclxuICAgICAgICByZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBFbnRlci5yZWxhdGlvbnNoaXAubWVyZ2UocmVsYXRpb25zaGlwKTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwT3V0bGluZSA9IHN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm91dGxpbmUnKTtcclxuICAgICAgICByZWxhdGlvbnNoaXBPdXRsaW5lID0gcmVsYXRpb25zaGlwRW50ZXIub3V0bGluZS5tZXJnZShyZWxhdGlvbnNoaXBPdXRsaW5lKTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwT3ZlcmxheSA9IHN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLm92ZXJsYXknKTtcclxuICAgICAgICByZWxhdGlvbnNoaXBPdmVybGF5ID0gcmVsYXRpb25zaGlwRW50ZXIub3ZlcmxheS5tZXJnZShyZWxhdGlvbnNoaXBPdmVybGF5KTtcclxuXHJcbiAgICAgICAgcmVsYXRpb25zaGlwVGV4dCA9IHN2Zy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAgLnRleHQnKTtcclxuICAgICAgICByZWxhdGlvbnNoaXBUZXh0ID0gcmVsYXRpb25zaGlwRW50ZXIudGV4dC5tZXJnZShyZWxhdGlvbnNoaXBUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB2ZXJzaW9uKCkge1xyXG4gICAgICAgIHJldHVybiBWRVJTSU9OO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHpvb21GaXQodHJhbnNpdGlvbkR1cmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIGJvdW5kcyA9IHN2Zy5ub2RlKCkuZ2V0QkJveCgpLFxyXG4gICAgICAgICAgICBwYXJlbnQgPSBzdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCxcclxuICAgICAgICAgICAgZnVsbFdpZHRoID0gcGFyZW50LmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICBmdWxsSGVpZ2h0ID0gcGFyZW50LmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgd2lkdGggPSBib3VuZHMud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIG1pZFggPSBib3VuZHMueCArIHdpZHRoIC8gMixcclxuICAgICAgICAgICAgbWlkWSA9IGJvdW5kcy55ICsgaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoID09PSAwIHx8IGhlaWdodCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47IC8vIG5vdGhpbmcgdG8gZml0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdmdTY2FsZSA9IDAuODUgLyBNYXRoLm1heCh3aWR0aCAvIGZ1bGxXaWR0aCwgaGVpZ2h0IC8gZnVsbEhlaWdodCk7XHJcbiAgICAgICAgc3ZnVHJhbnNsYXRlID0gW2Z1bGxXaWR0aCAvIDIgLSBzdmdTY2FsZSAqIG1pZFgsIGZ1bGxIZWlnaHQgLyAyIC0gc3ZnU2NhbGUgKiBtaWRZXTtcclxuXHJcbiAgICAgICAgc3ZnLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHN2Z1RyYW5zbGF0ZVswXSArICcsICcgKyBzdmdUcmFuc2xhdGVbMV0gKyAnKSBzY2FsZSgnICsgc3ZnU2NhbGUgKyAnKScpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoX3NlbGVjdG9yLCBfb3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZW80akRhdGFUb0QzRGF0YTogbmVvNGpEYXRhVG9EM0RhdGEsXHJcbiAgICAgICAgcmFuZG9tRDNEYXRhOiByYW5kb21EM0RhdGEsXHJcbiAgICAgICAgc2l6ZTogc2l6ZSxcclxuICAgICAgICB1cGRhdGVXaXRoRDNEYXRhOiB1cGRhdGVXaXRoRDNEYXRhLFxyXG4gICAgICAgIHVwZGF0ZVdpdGhOZW80akRhdGE6IHVwZGF0ZVdpdGhOZW80akRhdGEsXHJcbiAgICAgICAgdmVyc2lvbjogdmVyc2lvblxyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOZW80akQzO1xyXG4iXX0=
