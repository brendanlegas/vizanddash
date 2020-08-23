function buildDemData(subject) {
    d3.json('samples.json').then((data) => {
        var resultMeta = data.metadata.filter(object => object.id == subject);
        //Select the panel element in the body
        var panel = d3.select("#sample-metadata");
        //clear any existing things in the body
        panel.html('');

        //Add a ul element to the body
        var demInfo = panel.append("ul");
        //Format ul with list-group and list-group-flush
        demInfo.classed("list-group", true);
        demInfo.classed("list-group-flush", true);

        //for every key value pair, add a list item like 'key: value'
        Object.entries(resultMeta[0]).forEach(([key, value]) => {
            var item = demInfo.append('li');
            item.classed('list-group-item', true);
            item.html(key + ": " + value);
        });
        
        

    })
}

// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
// }

function buildGraphs(subject) {
    d3.json('samples.json').then((data) => {
        var result = data.samples.filter(object => object.id === subject)[0];
        var sample_values = result.sample_values.slice(0,10).reverse();
        var otu_ids = result.otu_ids.slice(0,10).reverse();
        var formatted_otu_ids = otu_ids.map(d => "OTU " + d);
        var otu_labels = result.otu_labels.slice(0,10).reverse();
        
        var bar_trace = {
            type: "bar",
            orientation: "h",
            marker: {
            color: "lightblue"},
            text: otu_labels,
            x: sample_values,
            y: formatted_otu_ids,
            hovertext: otu_labels
        };

        var bar_layout = {
            title: "Top 10 OTU's"
        }
        Plotly.newPlot("bar", [bar_trace], bar_layout);

        var bubble_trace = {
            mode: "markers",
            x: result.otu_ids,
            y: result.sample_values,
            marker: {
                size: result.sample_values,
                color: result.otu_ids
            },
            text: result.otu_labels
        };

        bubble_layout = {
            title: "Bubble Chart of Samples"
        };

        Plotly.newPlot("bubble", [bubble_trace]);

    });
}

function optionChanged(newSubject) {
    buildGraphs(newSubject);
    buildDemData(newSubject);
}

function init() {
    //pick on dropdown with id "selDataset"
    var dropdown = d3.select("#selDataset");
    //grab data from 'samples.json'
    d3.json("samples.json").then(function(data) {
        console.log(data);

        var namez = data.names;

        d3.selectAll("#selDataset")
        .selectAll("option")
        .data(namez)
        .enter()
        .append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) { return d; });

        var first = namez[0];
        buildDemData(first);
        buildGraphs(first)

        

    });


}

init();

