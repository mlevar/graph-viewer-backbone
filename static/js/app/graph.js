var nodes;
var links;
var foce;
var charge = -200;
var linkDst = 60;
var selfDst = 60;

$("#charge").val(charge);
$("#linkDst").val(linkDst);
$("#selfDst").val(selfDst);

$("#charge").blur(function () {
    charge = $("#charge").val();
    force.stop()
    force.charge(charge);
    force.start();
});
$("#linkDst").blur(function () {
    linkDst = $("#linkDst").val();
    force.stop()
    force.linkDistance(function (d) {
        if (d.self)
            return selfDst;
        else
            return linkDst;
    })

    force.start();
});
$("#selfDst").blur(function () {
    selfDst = $("#selfDst").val();
    force.stop()
    force.linkDistance(function (d) {
        if (d.self)
            return selfDst;
        else
            return linkDst;
    })
    force.start();
});


function drawGraph(graph){
    console.log(graph.name);
    $("#graphname").text(graph.name);
    lnks = JSON.parse(graph.nodes);
    links = []
    lnks.nodes.forEach(function (l) {
        links.push({'source':l[0], 'target':l[1], 'value':1})
    });

    var self_links = [];
    nodes = {};
    var pathgen = d3.svg.line().interpolate("linear");
    var cycle_pathgen = d3.svg.line().interpolate("basis").tension(0.9);


    links.forEach(function (link) {
        if (link.source == link.target) {
            var src = link.source
            if (!nodes["s" + src]) {
                nodes["s" + src] = { visible: false, name: "s" + src, self: true };
                link.source = nodes[link.source] || (nodes[link.source] = { name: link.source, visible: true });
                link.target = nodes["s" + src];
                self_links.push({ test: "test", source: nodes["s" + src], target: nodes[src], self: true, visible: false });
                link.self = true;
                link.visible = true;
            } else {
                link.self = true;
                link.visible = false;
            }
        } else {
            link.source = nodes[link.source] || (nodes[link.source] = { name: link.source, visible: true });
            link.target = nodes[link.target] || (nodes[link.target] = { name: link.target, visible: true });
            link.self = false;
            link.visible = true;
        }
    });

    links = links.concat(self_links);

    var w = 1100,
        h = 750,
        cycle_curvep = 0.2;

    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([w, h])
        .linkDistance(function (d) {
            if (d.self)
                return selfDst;
            else
                return linkDst;
        })
        .charge(charge)
        .on("tick", tick)
        .start();

    var svg = d3.select("#canvas").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "svgcanvas");


    svg.append("svg:defs").selectAll("marker")
        .data(["normal"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    svg.append("svg:defs").selectAll("marker")
        .data(["self"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
        .attr("refY", -3)
        .attr("markerWidth", 9)
        .attr("markerHeight", 9)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
      .enter().append("svg:path")
        .attr("class", function (n) {
            if (n.visible)
                return "link";
            else
                return "self";
        })
        .attr("marker-end", function (l) {
            if (l.visible && !l.self)
                return "url(#normal)";
            else if (!l.visible && l.self)
                return "url(#self)";
        });

    var circle = svg.append("svg:g").selectAll("circle")
        .data(force.nodes())
      .enter().append("svg:circle")
        .attr("r", 10)
        .attr("class", function (n) {
            if (n.visible)
                return "";
            else
                return "invisible";
        })
        .call(force.drag);

    var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
    .enter().append("svg:g");
    text.append("svg:text")
    .attr("x", function (d) {
        if (d.name / 10 < 1)
            return -3;
        else if (d.name / 100 < 1)
            return -6;
        else
            return -9;
    })
    .attr("y", 4)
    .attr("class", "text")
    .text(function (d) { if (d.visible) return d.name; else return ""; });

    function tick() {
        path.attr("d", function (d) {
            if (d.self && d.visible) {
                var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
                linedata = [
                            [d.source.x, d.source.y],
                            [d.target.x - cycle_curvep * dy, d.target.y + cycle_curvep * dx],
                            [d.target.x + cycle_curvep * dx, d.target.y + cycle_curvep * dy],
                            [d.target.x + cycle_curvep * dy, d.target.y - cycle_curvep * dx],
                            [d.source.x, d.source.y]
                ];
                return cycle_pathgen(linedata);
            }
            linedata = [[d.source.x, d.source.y],
                        [d.target.x, d.target.y],
            ];
            return pathgen(linedata);
        });

        circle.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    }
}
