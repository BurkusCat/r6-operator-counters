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
            .attr("id", "hardTriangle")
            .attr("refX", 2)
            .attr("refY", 2)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("orient", "0")
            .append("path")
            .attr("d", "M 0 0 8 2 0 4 1 2")
            .attr("class", "hardcountertriangle");
  
        svg.append("svg:defs").append("svg:marker")
            .attr("id", "softTriangle")
            .attr("refX", 2)
            .attr("refY", 2)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("orient", "0")
            .append("path")
            .attr("d", "M 0 0 8 2 0 4 1 2")
            .attr("class", "softcountertriangle");
  
        svg.append("svg:defs").append("svg:marker")
            .attr("id", "minorTriangle")
            .attr("refX", 2)
            .attr("refY", 2)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("orient", "0")
            .append("path")
            .attr("d", "M 0 0 8 2 0 4 1 2")
            .attr("class", "minorcountertriangle");
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
            .attr('class', function(d) {
                if (d.type === 'Hard Counter') {
                    return 'outline hardcounter';
                } else if (d.type === 'Soft Counter') {
                    return 'outline softcounter';
                } else if (d.type === 'Minor Counter') {
                    return 'outline minorcounter';
                }
                return 'outline';
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi9pbmRleC5qcyIsInNyYy9tYWluL3NjcmlwdHMvbmVvNGpkMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIG5lbzRqZDMgPSByZXF1aXJlKCcuL3NjcmlwdHMvbmVvNGpkMycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZW80amQzO1xyXG4iLCIvKiBnbG9iYWwgZDMsIGRvY3VtZW50ICovXG4vKiBqc2hpbnQgbGF0ZWRlZjpub2Z1bmMgKi9cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gTmVvNGpEMyhfc2VsZWN0b3IsIF9vcHRpb25zKSB7XG4gICAgdmFyIGNvbnRhaW5lciwgZ3JhcGgsIGluZm8sIG5vZGUsIG5vZGVzLCByZWxhdGlvbnNoaXAsIHJlbGF0aW9uc2hpcE91dGxpbmUsIHJlbGF0aW9uc2hpcE92ZXJsYXksIHJlbGF0aW9uc2hpcFRleHQsIHJlbGF0aW9uc2hpcHMsIHNlbGVjdG9yLCBzaW11bGF0aW9uLCBzdmcsIHN2Z05vZGVzLCBzdmdSZWxhdGlvbnNoaXBzLCBzdmdTY2FsZSwgc3ZnVHJhbnNsYXRlLFxuICAgICAgICBjbGFzc2VzMmNvbG9ycyA9IHt9LFxuICAgICAgICBqdXN0TG9hZGVkID0gZmFsc2UsXG4gICAgICAgIG51bUNsYXNzZXMgPSAwLFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgYXJyb3dTaXplOiA0LFxuICAgICAgICAgICAgY29sb3JzOiBjb2xvcnMoKSxcbiAgICAgICAgICAgIGhpZ2hsaWdodDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaWNvbk1hcDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaWNvbnM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGltYWdlTWFwOiB7fSxcbiAgICAgICAgICAgIGltYWdlczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgaW5mb1BhbmVsOiB0cnVlLFxuICAgICAgICAgICAgbWluQ29sbGlzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBuZW80akRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG5lbzRqRGF0YVVybDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbm9kZU91dGxpbmVGaWxsQ29sb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG5vZGVSYWRpdXM6IDI1LFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwQ29sb3I6ICcjYTVhYmI2JyxcbiAgICAgICAgICAgIHpvb21GaXQ6IGZhbHNlLFxuICAgICAgICAgICAgY291bnRlcnM6IFt0cnVlLCB0cnVlLCBmYWxzZV1cbiAgICAgICAgfSxcbiAgICAgICAgYnVpbHRSZWxhdGlvbnMgPSB7fSxcbiAgICAgICAgVkVSU0lPTiA9ICcwLjAuMSc7XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRHcmFwaChjb250YWluZXIpIHtcbiAgICAgICAgc3ZnID0gY29udGFpbmVyLmFwcGVuZCgnc3ZnJylcbiAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbmVvNGpkMy1ncmFwaCcpXG4gICAgICAgICAgICAgICAgICAgICAgIC5jYWxsKGQzLnpvb20oKS5vbignem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gZDMuZXZlbnQudHJhbnNmb3JtLmssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlID0gW2QzLmV2ZW50LnRyYW5zZm9ybS54LCBkMy5ldmVudC50cmFuc2Zvcm0ueV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdmdUcmFuc2xhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVbMF0gKz0gc3ZnVHJhbnNsYXRlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVsxXSArPSBzdmdUcmFuc2xhdGVbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdmdTY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlICo9IHN2Z1NjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgdHJhbnNsYXRlWzBdICsgJywgJyArIHRyYW5zbGF0ZVsxXSArICcpIHNjYWxlKCcgKyBzY2FsZSArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrLnpvb20nLCBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgJzEwMCUnKTtcblxuICAgICAgICBzdmdSZWxhdGlvbnNoaXBzID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwcycpO1xuXG4gICAgICAgIHN2Z05vZGVzID0gc3ZnLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ25vZGVzJyk7XG4gIFxuICAgICAgICBzdmcuYXBwZW5kKFwic3ZnOmRlZnNcIikuYXBwZW5kKFwic3ZnOm1hcmtlclwiKVxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcInRyaWFuZ2xlXCIpXG4gICAgICAgICAgICAuYXR0cihcInJlZlhcIiwgMilcbiAgICAgICAgICAgIC5hdHRyKFwicmVmWVwiLCAyKVxuICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXJXaWR0aFwiLCAzMClcbiAgICAgICAgICAgIC5hdHRyKFwibWFya2VySGVpZ2h0XCIsIDMwKVxuICAgICAgICAgICAgLmF0dHIoXCJtYXJrZXJVbml0c1wiLCBcInVzZXJTcGFjZU9uVXNlXCIpXG4gICAgICAgICAgICAuYXR0cihcIm9yaWVudFwiLCBcImF1dG9cIilcbiAgICAgICAgICAgIC5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgXCJNIDAgMCA0IDIgMCA0IDEgMlwiKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIiNhNWFiYjZcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kSW1hZ2VUb05vZGUobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5hcHBlbmQoJ2ltYWdlJylcbiAgICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWNvbihkKSA/ICcyNHB4JzogJzcwcHgnO1xuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzVweCc6ICctMzVweCc7XG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlKGQpO1xuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzVweCc6ICctMzVweCc7XG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpY29uKGQpID8gJzI0cHgnOiAnNzBweCc7XG4gICAgICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kSW5mb1BhbmVsKGNvbnRhaW5lcikge1xuICAgICAgICByZXR1cm4gY29udGFpbmVyLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICduZW80amQzLWluZm8nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGlzTm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgIHZhciBlbGVtID0gaW5mby5hcHBlbmQoJ2EnKTtcblxuICAgICAgICBlbGVtLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCBjbHMpXG4gICAgICAgICAgICAuaHRtbCgnPHN0cm9uZz4nICsgcHJvcGVydHkgKyAnPC9zdHJvbmc+JyArICh2YWx1ZSA/ICgnOiAnICsgdmFsdWUpIDogJycpKTtcblxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICBlbGVtLnN0eWxlKCdiYWNrZ3JvdW5kLWNvbG9yJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvciA/IG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgOiAoaXNOb2RlID8gY2xhc3MyY29sb3IocHJvcGVydHkpIDogZGVmYXVsdENvbG9yKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdib3JkZXItY29sb3InLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yID8gY2xhc3MyZGFya2VuQ29sb3Iob3B0aW9ucy5ub2RlT3V0bGluZUZpbGxDb2xvcikgOiAoaXNOb2RlID8gY2xhc3MyZGFya2VuQ29sb3IocHJvcGVydHkpIDogZGVmYXVsdERhcmtlbkNvbG9yKCkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdjb2xvcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMubm9kZU91dGxpbmVGaWxsQ29sb3IgPyBjbGFzczJkYXJrZW5Db2xvcihvcHRpb25zLm5vZGVPdXRsaW5lRmlsbENvbG9yKSA6ICcjZmZmJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbHRlciBncmFwaCBkYXRhIHRvIG9ubHkgc2hvdyBjZXJ0YWluIGNvdW50ZXIgcmVsYXRpb25zaGlwc1xuICAgICAqIEBwYXJhbSBkYXRhIFRoZSBvcmlnaW5hbCBncmFwaCBkYXRhXG4gICAgICogQHBhcmFtIGhhcmQgQm9vbGVhbiBmb3Igd2hldGhlciBoYXJkIGNvdW50ZXJzIHNob3VsZCBiZSBzaG93blxuICAgICAqIEBwYXJhbSBzb2Z0IEJvb2xlYW4gZm9yIHdoZXRoZXIgc29mdCBjb3VudGVycyBzaG91bGQgYmUgc2hvd25cbiAgICAgKiBAcGFyYW0gbWlub3IgQm9vbGVhbiBmb3Igd2hldGhlciBtaW5vciBjb3VudGVycyBzaG91bGQgYmUgc2hvd25cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJEYXRhQnlDb3VudGVyTGV2ZWwoZGF0YSwgaGFyZCwgc29mdCwgbWlub3IpIHtcbiAgICAgICAgZGF0YS5yZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMgPSBkYXRhLmdyYXBoLnJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGFyZCAmJiByZWxhdGlvbnNoaXAudHlwZSA9PT0gJ0hhcmQgQ291bnRlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNvZnQgJiYgcmVsYXRpb25zaGlwLnR5cGUgPT09ICdTb2Z0IENvdW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtaW5vciAmJiByZWxhdGlvbnNoaXAudHlwZSA9PT0gJ01pbm9yIENvdW50ZXInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGVuZEluZm9FbGVtZW50Q2xhc3MoY2xzLCBub2RlKSB7XG4gICAgICAgIGFwcGVuZEluZm9FbGVtZW50KGNscywgdHJ1ZSwgbm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eShjbHMsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICAvLyB3ZSBkb24ndCB3YW50IHRvIHNob3cgYW4gSUQgcHJvcGVydHlcbiAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAnJmx0O2lkJmd0OycpIHtcbiAgICAgICAgICAgIGFwcGVuZEluZm9FbGVtZW50KGNscywgZmFsc2UsIHByb3BlcnR5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcChjbHMsIHJlbGF0aW9uc2hpcCkge1xuICAgICAgICBhcHBlbmRJbmZvRWxlbWVudChjbHMsIGZhbHNlLCByZWxhdGlvbnNoaXApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGVuZE5vZGUoKSB7XG4gICAgICAgIHJldHVybiBub2RlLmVudGVyKClcbiAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIHZhciBoaWdobGlnaHQsIGksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzID0gJ25vZGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBkLmxhYmVsc1swXTtcblxuICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWNvbihkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NlcyArPSAnIG5vZGUtaWNvbic7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1hZ2UoZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWltYWdlJztcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhpZ2hsaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMuaGlnaGxpZ2h0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0ID0gb3B0aW9ucy5oaWdobGlnaHRbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZC5sYWJlbHNbMF0gPT09IGhpZ2hsaWdodC5jbGFzcyAmJiBkLnByb3BlcnRpZXNbaGlnaGxpZ2h0LnByb3BlcnR5XSA9PT0gaGlnaGxpZ2h0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMgKz0gJyBub2RlLWhpZ2hsaWdodGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICBkLmZ4ID0gZC5meSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZUNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTm9kZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICBzdGlja05vZGUoZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uTm9kZURvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbmZvKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZU1vdXNlRW50ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlTW91c2VFbnRlcihkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbmZvKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTm9kZU1vdXNlTGVhdmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlTW91c2VMZWF2ZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgLmNhbGwoZDMuZHJhZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ3N0YXJ0JywgZHJhZ1N0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2RyYWcnLCBkcmFnZ2VkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdlbmQnLCBkcmFnRW5kZWQpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmROb2RlVG9HcmFwaCgpIHtcbiAgICAgICAgdmFyIG4gPSBhcHBlbmROb2RlKCk7XG5cbiAgICAgICAgLy9hcHBlbmRSaW5nVG9Ob2RlKG4pO1xuICAgICAgICAvL2FwcGVuZE91dGxpbmVUb05vZGUobik7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaWNvbnMpIHtcbiAgICAgICAgICAgIC8vYXBwZW5kVGV4dFRvTm9kZShuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmltYWdlcykge1xuICAgICAgICAgICAgYXBwZW5kSW1hZ2VUb05vZGUobik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRSZWxhdGlvbnNoaXAoKSB7XG4gICAgICAgIHJldHVybiByZWxhdGlvbnNoaXAuZW50ZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncmVsYXRpb25zaGlwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZGJsY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uUmVsYXRpb25zaGlwRG91YmxlQ2xpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vblJlbGF0aW9uc2hpcERvdWJsZUNsaWNrKGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5mbyhkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRPdXRsaW5lVG9SZWxhdGlvbnNoaXAocikge1xuICAgICAgICByZXR1cm4gci5hcHBlbmQoJ3BhdGgnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ291dGxpbmUgbGluaycpXG4gICAgICAgICAgICAuYXR0cignZmlsbCcsICcjYTVhYmI2JylcbiAgICAgICAgICAgIC5hdHRyKFwibWFya2VyLWVuZFwiLCBcInVybCgjdHJpYW5nbGUpXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGVuZE92ZXJsYXlUb1JlbGF0aW9uc2hpcChyKSB7XG4gICAgICAgIHJldHVybiByLmFwcGVuZCgncGF0aCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ292ZXJsYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhcHBlbmRUZXh0VG9SZWxhdGlvbnNoaXAocikge1xuICAgICAgICByZXR1cm4gci5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignZmlsbCcsICcjZmZmZmZmJylcbiAgICAgICAgICAgICAgICAuYXR0cignZm9udC1zaXplJywgJzhweCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBkLnR5cGU7Ly9idWlsdFJlbGF0aW9uc1tgJHtkLnN0YXJ0Tm9kZX0sJHtkLmVuZE5vZGV9LCR7ZC50eXBlfSxgXSA/ICfigIIgJy5yZXBlYXQoZC50eXBlLmxlbmd0aCk6IGQudHlwZTtcbiAgICAgICAgICAgICAgICAgICAgLy9idWlsdFJlbGF0aW9uc1tgJHtkLmVuZE5vZGV9LCR7ZC5zdGFydE5vZGV9LCR7ZC50eXBlfSxgXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWx0UmVsYXRpb25zW2QuZW5kTm9kZSsnLCcrZC5zdGFydE5vZGUrJywnK2QudHlwZSsnLCddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwZW5kUmVsYXRpb25zaGlwVG9HcmFwaCgpIHtcbiAgICAgICAgdmFyIHJlbGF0aW9uc2hpcCA9IGFwcGVuZFJlbGF0aW9uc2hpcCgpLFxuICAgICAgICAgICAgdGV4dCA9IGFwcGVuZFRleHRUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApLFxuICAgICAgICAgICAgb3V0bGluZSA9IGFwcGVuZE91dGxpbmVUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApLFxuICAgICAgICAgICAgb3ZlcmxheSA9IGFwcGVuZE92ZXJsYXlUb1JlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvdXRsaW5lOiBvdXRsaW5lLFxuICAgICAgICAgICAgb3ZlcmxheTogb3ZlcmxheSxcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsYXNzMmNvbG9yKGNscykge1xuICAgICAgICB2YXIgY29sb3IgPSBjbGFzc2VzMmNvbG9yc1tjbHNdO1xuXG4gICAgICAgIGlmICghY29sb3IpIHtcbi8vICAgICAgICAgICAgY29sb3IgPSBvcHRpb25zLmNvbG9yc1tNYXRoLm1pbihudW1DbGFzc2VzLCBvcHRpb25zLmNvbG9ycy5sZW5ndGggLSAxKV07XG4gICAgICAgICAgICBjb2xvciA9IG9wdGlvbnMuY29sb3JzW251bUNsYXNzZXMgJSBvcHRpb25zLmNvbG9ycy5sZW5ndGhdO1xuICAgICAgICAgICAgY2xhc3NlczJjb2xvcnNbY2xzXSA9IGNvbG9yO1xuICAgICAgICAgICAgbnVtQ2xhc3NlcysrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsYXNzMmRhcmtlbkNvbG9yKGNscykge1xuICAgICAgICByZXR1cm4gZDMucmdiKGNsYXNzMmNvbG9yKGNscykpLmRhcmtlcigxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckluZm8oKSB7XG4gICAgICAgIGluZm8uaHRtbCgnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29sb3IoKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNvbG9yc1tvcHRpb25zLmNvbG9ycy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbG9ycygpIHtcbiAgICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkxMCxcbiAgICAgICAgLy8gZDMuc2NoZW1lQ2F0ZWdvcnkyMCxcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICcjNjhiZGY2JywgLy8gbGlnaHQgYmx1ZVxuICAgICAgICAgICAgJyM2ZGNlOWUnLCAvLyBncmVlbiAjMVxuICAgICAgICAgICAgJyNmYWFmYzInLCAvLyBsaWdodCBwaW5rXG4gICAgICAgICAgICAnI2YyYmFmNicsIC8vIHB1cnBsZVxuICAgICAgICAgICAgJyNmZjkyOGMnLCAvLyBsaWdodCByZWRcbiAgICAgICAgICAgICcjZmNlYTdlJywgLy8gbGlnaHQgeWVsbG93XG4gICAgICAgICAgICAnI2ZmYzc2NicsIC8vIGxpZ2h0IG9yYW5nZVxuICAgICAgICAgICAgJyM0MDVmOWUnLCAvLyBuYXZ5IGJsdWVcbiAgICAgICAgICAgICcjYTVhYmI2JywgLy8gZGFyayBncmF5XG4gICAgICAgICAgICAnIzc4Y2VjYicsIC8vIGdyZWVuICMyLFxuICAgICAgICAgICAgJyNiODhjYmInLCAvLyBkYXJrIHB1cnBsZVxuICAgICAgICAgICAgJyNjZWQyZDknLCAvLyBsaWdodCBncmF5XG4gICAgICAgICAgICAnI2U4NDY0NicsIC8vIGRhcmsgcmVkXG4gICAgICAgICAgICAnI2ZhNWY4NicsIC8vIGRhcmsgcGlua1xuICAgICAgICAgICAgJyNmZmFiMWEnLCAvLyBkYXJrIG9yYW5nZVxuICAgICAgICAgICAgJyNmY2RhMTknLCAvLyBkYXJrIHllbGxvd1xuICAgICAgICAgICAgJyM3OTdiODAnLCAvLyBibGFja1xuICAgICAgICAgICAgJyNjOWQ5NmYnLCAvLyBwaXN0YWNjaGlvXG4gICAgICAgICAgICAnIzQ3OTkxZicsIC8vIGdyZWVuICMzXG4gICAgICAgICAgICAnIzcwZWRlZScsIC8vIHR1cnF1b2lzZVxuICAgICAgICAgICAgJyNmZjc1ZWEnICAvLyBwaW5rXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29udGFpbnMoYXJyYXksIGlkKSB7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBhcnJheS5maWx0ZXIoZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW0uaWQgPT09IGlkO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmlsdGVyLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdENvbG9yKCkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5yZWxhdGlvbnNoaXBDb2xvcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0RGFya2VuQ29sb3IoKSB7XG4gICAgICAgIHJldHVybiBkMy5yZ2Iob3B0aW9ucy5jb2xvcnNbb3B0aW9ucy5jb2xvcnMubGVuZ3RoIC0gMV0pLmRhcmtlcigxKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmFnRW5kZWQoZCkge1xuICAgICAgICBpZiAoIWQzLmV2ZW50LmFjdGl2ZSkge1xuICAgICAgICAgICAgc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVEcmFnRW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvcHRpb25zLm9uTm9kZURyYWdFbmQoZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmFnZ2VkKGQpIHtcbiAgICAgICAgc3RpY2tOb2RlKGQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRyYWdTdGFydGVkKGQpIHtcbiAgICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMC4zKS5yZXN0YXJ0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBkLmZ4ID0gZC54O1xuICAgICAgICBkLmZ5ID0gZC55O1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbk5vZGVEcmFnU3RhcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wdGlvbnMub25Ob2RlRHJhZ1N0YXJ0KGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKG9iajEsIG9iajIpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgICAgIG1lcmdlKG9iaiwgb2JqMSk7XG4gICAgICAgIG1lcmdlKG9iaiwgb2JqMik7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpY29uKGQpIHtcbiAgICAgICAgdmFyIGNvZGU7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaWNvbk1hcCAmJiBvcHRpb25zLnNob3dJY29ucyAmJiBvcHRpb25zLmljb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV0gJiYgb3B0aW9ucy5pY29uTWFwW29wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dXSkge1xuICAgICAgICAgICAgICAgIGNvZGUgPSBvcHRpb25zLmljb25NYXBbb3B0aW9ucy5pY29uc1tkLmxhYmVsc1swXV1dO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmljb25NYXBbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICAgICAgY29kZSA9IG9wdGlvbnMuaWNvbk1hcFtkLmxhYmVsc1swXV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dKSB7XG4gICAgICAgICAgICAgICAgY29kZSA9IG9wdGlvbnMuaWNvbnNbZC5sYWJlbHNbMF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW1hZ2UoZCkge1xuICAgICAgICB2YXIgaSwgaW1hZ2VzRm9yTGFiZWwsIGltZywgaW1nTGV2ZWwsIGxhYmVsLCBsYWJlbFByb3BlcnR5VmFsdWUsIHByb3BlcnR5LCB2YWx1ZTtcblxuICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMpIHtcbiAgICAgICAgICAgIGltYWdlc0ZvckxhYmVsID0gb3B0aW9ucy5pbWFnZU1hcFtkLmxhYmVsc1swXV07XG5cbiAgICAgICAgICAgIGlmIChpbWFnZXNGb3JMYWJlbCkge1xuICAgICAgICAgICAgICAgIGltZ0xldmVsID0gMDtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbWFnZXNGb3JMYWJlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbFByb3BlcnR5VmFsdWUgPSBpbWFnZXNGb3JMYWJlbFtpXS5zcGxpdCgnfCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobGFiZWxQcm9wZXJ0eVZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBsYWJlbFByb3BlcnR5VmFsdWVbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IGxhYmVsUHJvcGVydHlWYWx1ZVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGFiZWxQcm9wZXJ0eVZhbHVlWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGQubGFiZWxzWzBdID09PSBsYWJlbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCFwcm9wZXJ0eSB8fCBkLnByb3BlcnRpZXNbcHJvcGVydHldICE9PSB1bmRlZmluZWQpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXZhbHVlIHx8IGQucHJvcGVydGllc1twcm9wZXJ0eV0gPT09IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGggPiBpbWdMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZyA9IG9wdGlvbnMuaW1hZ2VzW2ltYWdlc0ZvckxhYmVsW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdMZXZlbCA9IGxhYmVsUHJvcGVydHlWYWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW1nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQoX3NlbGVjdG9yLCBfb3B0aW9ucykge1xuICAgICAgICBtZXJnZShvcHRpb25zLCBfb3B0aW9ucyk7XG4gICAgICAgIGlmIChvcHRpb25zLmljb25zKSB7XG4gICAgICAgICAgICBvcHRpb25zLnNob3dJY29ucyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW9wdGlvbnMubWluQ29sbGlzaW9uKSB7XG4gICAgICAgICAgICBvcHRpb25zLm1pbkNvbGxpc2lvbiA9IG9wdGlvbnMubm9kZVJhZGl1cyAqIDI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0SW1hZ2VNYXAoKTtcblxuICAgICAgICBzZWxlY3RvciA9IF9zZWxlY3RvcjtcblxuICAgICAgICBjb250YWluZXIgPSBkMy5zZWxlY3Qoc2VsZWN0b3IpO1xuXG4gICAgICAgIGNvbnRhaW5lci5hdHRyKCdjbGFzcycsICduZW80amQzJylcbiAgICAgICAgICAgICAgICAgLmh0bWwoJycpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmluZm9QYW5lbCkge1xuICAgICAgICAgICAgaW5mbyA9IGFwcGVuZEluZm9QYW5lbChjb250YWluZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwZW5kR3JhcGgoY29udGFpbmVyKTtcblxuICAgICAgICBzaW11bGF0aW9uID0gaW5pdFNpbXVsYXRpb24oKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5uZW80akRhdGEpIHtcbiAgICAgICAgICAgIGxvYWROZW80akRhdGEob3B0aW9ucy5uZW80akRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubmVvNGpEYXRhVXJsKSB7XG4gICAgICAgICAgICBsb2FkTmVvNGpEYXRhRnJvbVVybChvcHRpb25zLm5lbzRqRGF0YVVybCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogYm90aCBuZW80akRhdGEgYW5kIG5lbzRqRGF0YVVybCBhcmUgZW1wdHkhJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0SW1hZ2VNYXAoKSB7XG4gICAgICAgIHZhciBrZXksIGtleXMsIHNlbGVjdG9yO1xuXG4gICAgICAgIGZvciAoa2V5IGluIG9wdGlvbnMuaW1hZ2VzKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pbWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGtleXMgPSBrZXkuc3BsaXQoJ3wnKTtcblxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmltYWdlTWFwW2tleXNbMF1dID0gW2tleV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5pbWFnZU1hcFtrZXlzWzBdXS5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdFNpbXVsYXRpb24oKSB7XG4gICAgICAgIHZhciBzaW11bGF0aW9uID0gZDMuZm9yY2VTaW11bGF0aW9uKClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLnZlbG9jaXR5RGVjYXkoMC44KVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ3gnLCBkMy5mb3JjZSgpLnN0cmVuZ3RoKDAuMDAyKSlcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvcmNlKCd5JywgZDMuZm9yY2UoKS5zdHJlbmd0aCgwLjAwMikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ2NvbGxpZGUnLCBkMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHRpb25zLm1pbkNvbGxpc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLml0ZXJhdGlvbnMoMikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yY2UoJ2NoYXJnZScsIGQzLmZvcmNlTWFueUJvZHkoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JjZSgnbGluaycsIGQzLmZvcmNlTGluaygpLmlkKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvcmNlKCdjZW50ZXInLCBkMy5mb3JjZUNlbnRlcihzdmcubm9kZSgpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIDIsIHN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAvIDIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCd0aWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuem9vbUZpdCAmJiAhanVzdExvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0TG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgem9vbUZpdCgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2ltdWxhdGlvbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTmVvNGpEYXRhKCkge1xuICAgICAgICBub2RlcyA9IFtdO1xuICAgICAgICByZWxhdGlvbnNoaXBzID0gW107XG5cbiAgICAgICAgdXBkYXRlV2l0aE5lbzRqRGF0YShvcHRpb25zLm5lbzRqRGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE5lbzRqRGF0YUZyb21VcmwobmVvNGpEYXRhVXJsKSB7XG4gICAgICAgIG5vZGVzID0gW107XG4gICAgICAgIHJlbGF0aW9uc2hpcHMgPSBbXTtcblxuICAgICAgICBkMy5qc29uKG5lbzRqRGF0YVVybCwgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRhID0gZmlsdGVyRGF0YUJ5Q291bnRlckxldmVsKGRhdGEsIG9wdGlvbnMuY291bnRlcnNbMF0sIG9wdGlvbnMuY291bnRlcnNbMV0sIG9wdGlvbnMuY291bnRlcnNbMl0pO1xuICAgICAgICAgICAgdXBkYXRlV2l0aE5lbzRqRGF0YShkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmVvNGpEYXRhVG9EM0RhdGEoZGF0YSkge1xuICAgICAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgICAgICBub2RlczogW10sXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIGRhdGEucmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0LmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5ncmFwaC5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWlucyhncmFwaC5ub2Rlcywgbm9kZS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoLm5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciByZWxzID0gZGF0YS5ncmFwaC5yZWxhdGlvbnNoaXBzO1xuICAgICAgICAgICAgICAgIHJlbHMuZm9yRWFjaChmdW5jdGlvbihyZWxhdGlvbnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0aW9uc2hpcC5zdGFydE5vZGUgPT09IHJlbGF0aW9uc2hpcC5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpb25zaGlwLnNvdXJjZSA9IHJlbGF0aW9uc2hpcC5zdGFydE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcC50YXJnZXQgPSByZWxhdGlvbnNoaXAuZW5kTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGgucmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGk7IGogPCByZWxzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbHNbaV0ubGlua251bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbaV0ubGlua251bSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbHNbal0ubGlua251bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbal0ubGlua251bSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGJpLWRpcmVjdGlvbmFsIHJlbGF0aW9uc2hpcCwgdXBkYXRlIGxpbmtudW0gdG8gMlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbHNbaV0uc291cmNlID09PSByZWxzW2pdLnRhcmdldCAmJiByZWxzW2ldLnRhcmdldCA9PT0gcmVsc1tqXS5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWxzW2ldLmxpbmtudW0gPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbHNbal0ubGlua251bSA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGdyYXBoO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmRvbUQzRGF0YShkLCBtYXhOb2Rlc1RvR2VuZXJhdGUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGxhYmVsLFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIG51bU5vZGVzID0gKG1heE5vZGVzVG9HZW5lcmF0ZSAqIE1hdGgucmFuZG9tKCkgPDwgMCkgKyAxLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwLFxuICAgICAgICAgICAgcyA9IHNpemUoKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtTm9kZXM7IGkrKykge1xuICAgICAgICAgICAgbGFiZWwgPSByYW5kb21MYWJlbCgpO1xuXG4gICAgICAgICAgICBub2RlID0ge1xuICAgICAgICAgICAgICAgIGlkOiBzLm5vZGVzICsgMSArIGksXG4gICAgICAgICAgICAgICAgbGFiZWxzOiBbbGFiZWxdLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcmFuZG9tOiBsYWJlbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeDogZC54LFxuICAgICAgICAgICAgICAgIHk6IGQueVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGF0YS5ub2Rlc1tkYXRhLm5vZGVzLmxlbmd0aF0gPSBub2RlO1xuXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHMucmVsYXRpb25zaGlwcyArIDEgKyBpLFxuICAgICAgICAgICAgICAgIHR5cGU6IGxhYmVsLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkLmlkLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZyb206IERhdGUubm93KClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNvdXJjZTogZC5pZCxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHMubm9kZXMgKyAxICsgaSxcbiAgICAgICAgICAgICAgICBsaW5rbnVtOiBzLnJlbGF0aW9uc2hpcHMgKyAxICsgaVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGF0YS5yZWxhdGlvbnNoaXBzW2RhdGEucmVsYXRpb25zaGlwcy5sZW5ndGhdID0gcmVsYXRpb25zaGlwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmFuZG9tTGFiZWwoKSB7XG4gICAgICAgIHZhciBpY29ucyA9IE9iamVjdC5rZXlzKG9wdGlvbnMuaWNvbk1hcCk7XG4gICAgICAgIHJldHVybiBpY29uc1tpY29ucy5sZW5ndGggKiBNYXRoLnJhbmRvbSgpIDw8IDBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZShjeCwgY3ksIHgsIHksIGFuZ2xlKSB7XG4gICAgICAgIHZhciByYWRpYW5zID0gKE1hdGguUEkgLyAxODApICogYW5nbGUsXG4gICAgICAgICAgICBjb3MgPSBNYXRoLmNvcyhyYWRpYW5zKSxcbiAgICAgICAgICAgIHNpbiA9IE1hdGguc2luKHJhZGlhbnMpLFxuICAgICAgICAgICAgbnggPSAoY29zICogKHggLSBjeCkpICsgKHNpbiAqICh5IC0gY3kpKSArIGN4LFxuICAgICAgICAgICAgbnkgPSAoY29zICogKHkgLSBjeSkpIC0gKHNpbiAqICh4IC0gY3gpKSArIGN5O1xuXG4gICAgICAgIHJldHVybiB7IHg6IG54LCB5OiBueSB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJvdGF0ZVBvaW50KGMsIHAsIGFuZ2xlKSB7XG4gICAgICAgIHJldHVybiByb3RhdGUoYy54LCBjLnksIHAueCwgcC55LCBhbmdsZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcm90YXRpb24oc291cmNlLCB0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGFyZ2V0LnkgLSBzb3VyY2UueSwgdGFyZ2V0LnggLSBzb3VyY2UueCkgKiAxODAgLyBNYXRoLlBJO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2Rlczogbm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgcmVsYXRpb25zaGlwczogcmVsYXRpb25zaGlwcy5sZW5ndGhcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RpY2tOb2RlKGQpIHtcbiAgICAgICAgZC5meCA9IGQzLmV2ZW50Lng7XG4gICAgICAgIGQuZnkgPSBkMy5ldmVudC55O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgICAgIHRpY2tOb2RlcygpO1xuICAgICAgICB0aWNrUmVsYXRpb25zaGlwcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpY2tOb2RlcygpIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnggKyAnLCAnICsgZC55ICsgJyknO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwcygpIHtcbiAgICAgICAgaWYgKHJlbGF0aW9uc2hpcCkge1xuICAgICAgICAgICAgcmVsYXRpb25zaGlwLmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uKGQpIHsgIFxuICAgICAgICAgICAgICAgIHZhciBjZW50ZXIgPSB7eDogMCwgeTogMH0sXG4gICAgICAgICAgICAgICAgICBhbmdsZSA9IHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgICAgICAgICB1ID0gdW5pdGFyeVZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgbiA9IHVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAgIGcgPSByb3RhdGVQb2ludChjZW50ZXIsIHUsIC0xMCksXG4gICAgICAgICAgICAgICAgICBzb3VyY2UgPSByb3RhdGVQb2ludChjZW50ZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCAtIG4ueCxcbiAgICAgICAgICAgICAgICAgICAgeTogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSAtIG4ueVxuICAgICAgICAgICAgICAgICAgfSwgYW5nbGUgKyAxMCksXG4gICAgICAgICAgICAgICAgICB0YXJnZXQgPSByb3RhdGVQb2ludChjZW50ZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMikgKiBnLngsXG4gICAgICAgICAgICAgICAgICAgIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gKG9wdGlvbnMubm9kZVJhZGl1cyArIDIpICogZy55XG4gICAgICAgICAgICAgICAgICB9LCBhbmdsZSksXG4gICAgICAgICAgICAgICAgICB1dSA9IHVuaXRhcnlOb3JtYWxWZWN0b3Ioc291cmNlLCB0YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgbWlkZGxlID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiAoc291cmNlLnggKyB0YXJnZXQueCkgLyAyICsgdXUueCAqIDIwLFxuICAgICAgICAgICAgICAgICAgICB5OiAoc291cmNlLnkgKyB0YXJnZXQueSkgLyAyICsgdXUueSAqIDIwXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGQub3V0bGluZSA9IHsgbWlkZGxlOiBtaWRkbGUsIHNvdXJjZTogc291cmNlLCB0YXJnZXQ6IHRhcmdldCwgdTogdXUgfTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyBkLnNvdXJjZS54ICsgJywgJyArIGQuc291cmNlLnkgKyAnKSByb3RhdGUoJyArIGFuZ2xlICsgJyknO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzVGV4dHMoKTtcbiAgICAgICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKTtcbiAgICAgICAgICAgIHRpY2tSZWxhdGlvbnNoaXBzT3ZlcmxheXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpY2tSZWxhdGlvbnNoaXBzT3V0bGluZXMoKSB7XG4gICAgICAgIHJlbGF0aW9uc2hpcC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvdXRsaW5lID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnLm91dGxpbmUnKTtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZDMuc2VsZWN0KHRoaXMpLnNlbGVjdCgnLnRleHQnKTtcbiAgICAgICAgICAgIG91dGxpbmUuYXR0cignZCcsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGQubGlua251bSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlja1N0cmFpZ2h0UmVsYXRpb25zaGlwc091dGxpbmUoZCwgdGV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzT3V0bGluZShkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGlja1N0cmFpZ2h0UmVsYXRpb25zaGlwc091dGxpbmUoZCwgdGV4dCkge1xuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgICAgICBhbmdsZSA9IHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgICB0ZXh0Qm91bmRpbmdCb3ggPSB0ZXh0Lm5vZGUoKS5nZXRCQm94KCksXG4gICAgICAgICAgICB0ZXh0UGFkZGluZyA9IDUsXG4gICAgICAgICAgICB1ID0gdW5pdGFyeVZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgICAgdGV4dE1hcmdpbiA9IHsgeDogKGQudGFyZ2V0LnggLSBkLnNvdXJjZS54IC0gKHRleHRCb3VuZGluZ0JveC53aWR0aCArIHRleHRQYWRkaW5nKSAqIHUueCkgKiAwLjUsIHk6IChkLnRhcmdldC55IC0gZC5zb3VyY2UueSAtICh0ZXh0Qm91bmRpbmdCb3gud2lkdGggKyB0ZXh0UGFkZGluZykgKiB1LnkpICogMC41IH0sXG4gICAgICAgICAgICBuID0gdW5pdGFyeU5vcm1hbFZlY3RvcihkLnNvdXJjZSwgZC50YXJnZXQpLFxuICAgICAgICAgICAgcm90YXRlZFBvaW50QTEgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogdGV4dE1hcmdpbi54IC0gbi54LCB5OiB0ZXh0TWFyZ2luLnkgLSBuLnkgfSwgYW5nbGUpLFxuICAgICAgICAgICAgcm90YXRlZFBvaW50QjEgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogMCArIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueSB9LCBhbmdsZSksXG4gICAgICAgICAgICByb3RhdGVkUG9pbnRBMiA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiBkLnRhcmdldC54IC0gZC5zb3VyY2UueCAtIChvcHRpb25zLm5vZGVSYWRpdXMgKyAxKSAqIHUueCwgeTogZC50YXJnZXQueSAtIGQuc291cmNlLnkgLSAob3B0aW9ucy5ub2RlUmFkaXVzICsgMSkgKiB1LnkgfSwgYW5nbGUpLFxuICAgICAgICAgICAgcm90YXRlZFBvaW50QjIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSB0ZXh0TWFyZ2luLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gdGV4dE1hcmdpbi55IC0gbi55IH0sIGFuZ2xlKTtcblxuICAgICAgICByZXR1cm4gJ00gJyArIHJvdGF0ZWRQb2ludEExLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMS55ICtcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjEueCArICcgJyArIHJvdGF0ZWRQb2ludEIxLnkgK1xuICAgICAgICAgICAgJyBaIE0gJyArIHJvdGF0ZWRQb2ludEEyLnggKyAnICcgKyByb3RhdGVkUG9pbnRBMi55ICtcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50QjIueCArICcgJyArIHJvdGF0ZWRQb2ludEIyLnkgK1xuICAgICAgICAgICAgJyBaJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrQ3VydmVkUmVsYXRpb25zaGlwc091dGxpbmUoZCkge1xuICAgICAgICB2YXIgc291cmNlID0gZC5vdXRsaW5lLnNvdXJjZSxcbiAgICAgICAgdGFyZ2V0ID0gZC5vdXRsaW5lLnRhcmdldCxcbiAgICAgICAgbWlkZGxlID0gZC5vdXRsaW5lLm1pZGRsZTtcbiAgICAgICAgcmV0dXJuICdNICcgKyB0YXJnZXQueCArICcsICcgKyB0YXJnZXQueSArICcgJyArXG4gICAgICAgICAgICAnUSAnICsgbWlkZGxlLnggKyAnICcgKyBtaWRkbGUueSArICcgJyArIHNvdXJjZS54ICsgJyAnICsgc291cmNlLnkgKyAnICcgK1xuICAgICAgICAgICAgJ1EgJyArIG1pZGRsZS54ICsgJyAnICsgbWlkZGxlLnkgKyAnICcgKyB0YXJnZXQueCArICcsICcgKyB0YXJnZXQueTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwc092ZXJsYXlzKCkge1xuICAgICAgICByZWxhdGlvbnNoaXBPdmVybGF5LmF0dHIoJ2QnLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgaWYgKGQubGlua251bSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aWNrU3RyYWlnaHRSZWxhdGlvbnNoaXBzT3ZlcmxheShkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzT3ZlcmxheShkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGlja1N0cmFpZ2h0UmVsYXRpb25zaGlwc092ZXJsYXkoZCkge1xuICAgICAgICB2YXIgY2VudGVyID0geyB4OiAwLCB5OiAwIH0sXG4gICAgICAgICAgICBhbmdsZSA9IHJvdGF0aW9uKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgICBuMSA9IHVuaXRhcnlOb3JtYWxWZWN0b3IoZC5zb3VyY2UsIGQudGFyZ2V0KSxcbiAgICAgICAgICAgIG4gPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCwgNTApLFxuICAgICAgICAgICAgcm90YXRlZFBvaW50QSA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwIC0gbi54LCB5OiAwIC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICAgIHJvdGF0ZWRQb2ludEIgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggLSBuLngsIHk6IGQudGFyZ2V0LnkgLSBkLnNvdXJjZS55IC0gbi55IH0sIGFuZ2xlKSxcbiAgICAgICAgICAgIHJvdGF0ZWRQb2ludEMgPSByb3RhdGVQb2ludChjZW50ZXIsIHsgeDogZC50YXJnZXQueCAtIGQuc291cmNlLnggKyBuLnggLSBuMS54LCB5OiBkLnRhcmdldC55IC0gZC5zb3VyY2UueSArIG4ueSAtIG4xLnkgfSwgYW5nbGUpLFxuICAgICAgICAgICAgcm90YXRlZFBvaW50RCA9IHJvdGF0ZVBvaW50KGNlbnRlciwgeyB4OiAwICsgbi54IC0gbjEueCwgeTogMCArIG4ueSAtIG4xLnkgfSwgYW5nbGUpO1xuXG4gICAgICAgIHJldHVybiAnTSAnICsgcm90YXRlZFBvaW50QS54ICsgJyAnICsgcm90YXRlZFBvaW50QS55ICtcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qi54ICsgJyAnICsgcm90YXRlZFBvaW50Qi55ICtcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50Qy54ICsgJyAnICsgcm90YXRlZFBvaW50Qy55ICtcbiAgICAgICAgICAgICcgTCAnICsgcm90YXRlZFBvaW50RC54ICsgJyAnICsgcm90YXRlZFBvaW50RC55ICtcbiAgICAgICAgICAgICcgWic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGlja0N1cnZlZFJlbGF0aW9uc2hpcHNPdmVybGF5KGQpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGQub3V0bGluZS5zb3VyY2UsXG4gICAgICAgICAgICB0YXJnZXQgPSBkLm91dGxpbmUudGFyZ2V0LFxuICAgICAgICAgICAgbWlkZGxlID0gZC5vdXRsaW5lLm1pZGRsZTtcbiAgICAgICAgdmFyIGxpbmVUaGlja25lc3MgPSA1O1xuICAgICAgICByZXR1cm4gJ00gJyArIChzb3VyY2UueCArIGxpbmVUaGlja25lc3MpICsgJywgJyArIChzb3VyY2UueSArIGxpbmVUaGlja25lc3MpICsgJyAnICtcbiAgICAgICAgICAgICdRICcgKyAobWlkZGxlLnggKyBsaW5lVGhpY2tuZXNzKSArICcgJyArIChtaWRkbGUueSArIGxpbmVUaGlja25lc3MpICsgJyAnICsgKHRhcmdldC54IC0gbGluZVRoaWNrbmVzcykgKyAnICcgKyAodGFyZ2V0LnkgLSBsaW5lVGhpY2tuZXNzKSArXG4gICAgICAgICAgICAnUSAgJyArIChtaWRkbGUueCAtIGxpbmVUaGlja25lc3MpICsgJyAnICsgKG1pZGRsZS55IC0gbGluZVRoaWNrbmVzcykgKyAnICAnICsgKHNvdXJjZS54IC0gbGluZVRoaWNrbmVzcykgICsgJyAnICsgKHNvdXJjZS55IC0gbGluZVRoaWNrbmVzcykgICtcbiAgICAgICAgICAgICdaIE0gJyArICh0YXJnZXQueCAtIGxpbmVUaGlja25lc3MpICsgJywgJyArICh0YXJnZXQueSAtIGxpbmVUaGlja25lc3MpICsgJyAnICtcbiAgICAgICAgICAgICdRICcgKyAobWlkZGxlLnggLSBsaW5lVGhpY2tuZXNzKSArICcgJyArIChtaWRkbGUueSAtIGxpbmVUaGlja25lc3MpICsgJyAnICsgKHNvdXJjZS54ICsgbGluZVRoaWNrbmVzcykgKyAnICcgKyAoc291cmNlLnkgKyBsaW5lVGhpY2tuZXNzKSArXG4gICAgICAgICAgICAnUSAgJyArIChtaWRkbGUueCArIGxpbmVUaGlja25lc3MpICsgJyAnICsgKG1pZGRsZS55ICsgbGluZVRoaWNrbmVzcykgKyAnICAnICsgKHRhcmdldC54ICsgbGluZVRoaWNrbmVzcykgICsgJyAnICsgKHRhcmdldC55ICsgbGluZVRoaWNrbmVzcykgICtcbiAgICAgICAgICAgICdaJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrUmVsYXRpb25zaGlwc1RleHRzKCkge1xuICAgICAgICByZWxhdGlvbnNoaXBUZXh0LmF0dHIoJ3RyYW5zZm9ybScsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBpZiAoZC5saW5rbnVtID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tTdHJhaWdodFJlbGF0aW9uc2hpcHNUZXh0KGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGlja0N1cnZlZFJlbGF0aW9uc2hpcHNUZXh0KGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrU3RyYWlnaHRSZWxhdGlvbnNoaXBzVGV4dChkKSB7XG4gICAgICAgIHZhciBhbmdsZSA9IChyb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpICsgMzYwKSAlIDM2MCxcbiAgICAgICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXG4gICAgICAgICAgICBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgICAgIG4gPSB1bml0YXJ5Tm9ybWFsVmVjdG9yKGQuc291cmNlLCBkLnRhcmdldCksXG4gICAgICAgICAgICBuV2VpZ2h0ID0gbWlycm9yID8gMiA6IC0zLFxuICAgICAgICAgICAgcG9pbnQgPSB7IHg6IChkLnRhcmdldC54IC0gZC5zb3VyY2UueCkgKiAwLjUgKyBuLnggKiBuV2VpZ2h0LCB5OiAoZC50YXJnZXQueSAtIGQuc291cmNlLnkpICogMC41ICsgbi55ICogbldlaWdodCB9LFxuICAgICAgICAgICAgcm90YXRlZFBvaW50ID0gcm90YXRlUG9pbnQoY2VudGVyLCBwb2ludCwgYW5nbGUpO1xuXG4gICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyByb3RhdGVkUG9pbnQueCArICcsICcgKyByb3RhdGVkUG9pbnQueSArICcpIHJvdGF0ZSgnICsgKG1pcnJvciA/IDE4MCA6IDApICsgJyknO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpY2tDdXJ2ZWRSZWxhdGlvbnNoaXBzVGV4dChkKSB7XG4gICAgICAgIHZhciBhbmdsZSA9IChyb3RhdGlvbihkLnNvdXJjZSwgZC50YXJnZXQpICsgMzYwKSAlIDM2MCxcbiAgICAgICAgICAgIG1pcnJvciA9IGFuZ2xlID4gOTAgJiYgYW5nbGUgPCAyNzAsXG4gICAgICAgICAgICBzb3VyY2UgPSBkLm91dGxpbmUuc291cmNlLFxuICAgICAgICAgICAgdGFyZ2V0ID0gZC5vdXRsaW5lLnRhcmdldCxcbiAgICAgICAgICAgIHUgPSBkLm91dGxpbmUudSxcbiAgICAgICAgICAgIG1pZGRsZSA9IHtcbiAgICAgICAgICAgICAgICB4OiAoc291cmNlLnggKyB0YXJnZXQueCkgLyAyICsgdS54ICogKG1pcnJvciA/IDggOiAxMCkgKyB1LngsXG4gICAgICAgICAgICAgICAgeTogKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMiArIHUueSAqIChtaXJyb3IgPyA4IDogMTApICsgdS55XG4gICAgICAgICAgICB9O1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgbWlkZGxlLnggKyAnLCAnICsgbWlkZGxlLnkgKyAnKSByb3RhdGUoJyArIChtaXJyb3IgPyAxODAgOiAwKSArICcpJztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nKGQpIHtcbiAgICAgICAgdmFyIHMgPSBkLmxhYmVscyA/IGQubGFiZWxzWzBdIDogZC50eXBlO1xuXG4gICAgICAgIHMgKz0gJyAoPGlkPjogJyArIGQuaWQ7XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZC5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICBzICs9ICcsICcgKyBwcm9wZXJ0eSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShkLnByb3BlcnRpZXNbcHJvcGVydHldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcyArPSAnKSc7XG5cbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5pdGFyeU5vcm1hbFZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKSB7XG4gICAgICAgIHZhciBjZW50ZXIgPSB7IHg6IDAsIHk6IDAgfSxcbiAgICAgICAgICAgIHZlY3RvciA9IHVuaXRhcnlWZWN0b3Ioc291cmNlLCB0YXJnZXQsIG5ld0xlbmd0aCk7XG5cbiAgICAgICAgcmV0dXJuIHJvdGF0ZVBvaW50KGNlbnRlciwgdmVjdG9yLCA5MCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5pdGFyeVZlY3Rvcihzb3VyY2UsIHRhcmdldCwgbmV3TGVuZ3RoKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSBNYXRoLnNxcnQoTWF0aC5wb3codGFyZ2V0LnggLSBzb3VyY2UueCwgMikgKyBNYXRoLnBvdyh0YXJnZXQueSAtIHNvdXJjZS55LCAyKSkgLyBNYXRoLnNxcnQobmV3TGVuZ3RoIHx8IDEpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiAodGFyZ2V0LnggLSBzb3VyY2UueCkgLyBsZW5ndGgsXG4gICAgICAgICAgICB5OiAodGFyZ2V0LnkgLSBzb3VyY2UueSkgLyBsZW5ndGgsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlV2l0aEQzRGF0YShkM0RhdGEpIHtcbiAgICAgICAgdXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKGQzRGF0YS5ub2RlcywgZDNEYXRhLnJlbGF0aW9uc2hpcHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVdpdGhOZW80akRhdGEobmVvNGpEYXRhKSB7XG4gICAgICAgIHZhciBkM0RhdGEgPSBuZW80akRhdGFUb0QzRGF0YShuZW80akRhdGEpO1xuICAgICAgICB1cGRhdGVXaXRoRDNEYXRhKGQzRGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlSW5mbyhkKSB7XG4gICAgICAgIGNsZWFySW5mbygpO1xuXG4gICAgICAgIGlmIChkLmxhYmVscykge1xuICAgICAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRDbGFzcygnY2xhc3MnLCBkLmxhYmVsc1swXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHBlbmRJbmZvRWxlbWVudFJlbGF0aW9uc2hpcCgnY2xhc3MnLCBkLnR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCAnJmx0O2lkJmd0OycsIGQuaWQpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGQucHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgYXBwZW5kSW5mb0VsZW1lbnRQcm9wZXJ0eSgncHJvcGVydHknLCBwcm9wZXJ0eSwgSlNPTi5zdHJpbmdpZnkoZC5wcm9wZXJ0aWVzW3Byb3BlcnR5XSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVOb2RlcyhuKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KG5vZGVzLCBuKTtcblxuICAgICAgICBub2RlID0gc3ZnTm9kZXMuc2VsZWN0QWxsKCcubm9kZScpXG4gICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKG5vZGVzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkOyB9KTtcbiAgICAgICAgdmFyIG5vZGVFbnRlciA9IGFwcGVuZE5vZGVUb0dyYXBoKCk7XG4gICAgICAgIG5vZGUgPSBub2RlRW50ZXIubWVyZ2Uobm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlTm9kZXNBbmRSZWxhdGlvbnNoaXBzKG4sIHIpIHtcbiAgICAgICAgdXBkYXRlUmVsYXRpb25zaGlwcyhyKTtcbiAgICAgICAgdXBkYXRlTm9kZXMobik7XG5cbiAgICAgICAgc2ltdWxhdGlvbi5ub2Rlcyhub2Rlcyk7XG4gICAgICAgIHNpbXVsYXRpb24uZm9yY2UoJ2xpbmsnKS5saW5rcyhyZWxhdGlvbnNoaXBzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVSZWxhdGlvbnNoaXBzKHIpIHtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVsYXRpb25zaGlwcywgcik7XG5cbiAgICAgICAgcmVsYXRpb25zaGlwID0gc3ZnUmVsYXRpb25zaGlwcy5zZWxlY3RBbGwoJy5yZWxhdGlvbnNoaXAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEocmVsYXRpb25zaGlwcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDsgfSk7XG5cbiAgICAgICAgdmFyIHJlbGF0aW9uc2hpcEVudGVyID0gYXBwZW5kUmVsYXRpb25zaGlwVG9HcmFwaCgpO1xuXG4gICAgICAgIHJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcEVudGVyLnJlbGF0aW9uc2hpcC5tZXJnZShyZWxhdGlvbnNoaXApO1xuXG4gICAgICAgIHJlbGF0aW9uc2hpcE91dGxpbmUgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdXRsaW5lJyk7XG4gICAgICAgIHJlbGF0aW9uc2hpcE91dGxpbmUgPSByZWxhdGlvbnNoaXBFbnRlci5vdXRsaW5lLm1lcmdlKHJlbGF0aW9uc2hpcE91dGxpbmUpO1xuXG4gICAgICAgIHJlbGF0aW9uc2hpcE92ZXJsYXkgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC5vdmVybGF5Jyk7XG4gICAgICAgIHJlbGF0aW9uc2hpcE92ZXJsYXkgPSByZWxhdGlvbnNoaXBFbnRlci5vdmVybGF5Lm1lcmdlKHJlbGF0aW9uc2hpcE92ZXJsYXkpO1xuXG4gICAgICAgIHJlbGF0aW9uc2hpcFRleHQgPSBzdmcuc2VsZWN0QWxsKCcucmVsYXRpb25zaGlwIC50ZXh0Jyk7XG4gICAgICAgIHJlbGF0aW9uc2hpcFRleHQgPSByZWxhdGlvbnNoaXBFbnRlci50ZXh0Lm1lcmdlKHJlbGF0aW9uc2hpcFRleHQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiBWRVJTSU9OO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHpvb21GaXQodHJhbnNpdGlvbkR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBib3VuZHMgPSBzdmcubm9kZSgpLmdldEJCb3goKSxcbiAgICAgICAgICAgIHBhcmVudCA9IHN2Zy5ub2RlKCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgICAgZnVsbFdpZHRoID0gcGFyZW50LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgZnVsbEhlaWdodCA9IHBhcmVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aCA9IGJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICBtaWRYID0gYm91bmRzLnggKyB3aWR0aCAvIDIsXG4gICAgICAgICAgICBtaWRZID0gYm91bmRzLnkgKyBoZWlnaHQgLyAyO1xuXG4gICAgICAgIGlmICh3aWR0aCA9PT0gMCB8fCBoZWlnaHQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gbm90aGluZyB0byBmaXRcbiAgICAgICAgfVxuXG4gICAgICAgIHN2Z1NjYWxlID0gMC44NSAvIE1hdGgubWF4KHdpZHRoIC8gZnVsbFdpZHRoLCBoZWlnaHQgLyBmdWxsSGVpZ2h0KTtcbiAgICAgICAgc3ZnVHJhbnNsYXRlID0gW2Z1bGxXaWR0aCAvIDIgLSBzdmdTY2FsZSAqIG1pZFgsIGZ1bGxIZWlnaHQgLyAyIC0gc3ZnU2NhbGUgKiBtaWRZXTtcblxuICAgICAgICBzdmcuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgc3ZnVHJhbnNsYXRlWzBdICsgJywgJyArIHN2Z1RyYW5zbGF0ZVsxXSArICcpIHNjYWxlKCcgKyBzdmdTY2FsZSArICcpJyk7XG4gICAgfVxuXG4gICAgaW5pdChfc2VsZWN0b3IsIF9vcHRpb25zKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG5lbzRqRGF0YVRvRDNEYXRhOiBuZW80akRhdGFUb0QzRGF0YSxcbiAgICAgICAgcmFuZG9tRDNEYXRhOiByYW5kb21EM0RhdGEsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIHVwZGF0ZVdpdGhEM0RhdGE6IHVwZGF0ZVdpdGhEM0RhdGEsXG4gICAgICAgIHVwZGF0ZVdpdGhOZW80akRhdGE6IHVwZGF0ZVdpdGhOZW80akRhdGEsXG4gICAgICAgIHZlcnNpb246IHZlcnNpb25cbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5lbzRqRDM7Il19
