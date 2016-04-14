// HUGE Shoutout to https://github.com/jasondavies/d3-cloud for the fantastic,
// collision-free word cloud. Most of the word cloud code comes from the examples
// in that repo

// $(function () {
//
//   var fill = d3.scale.category20b();
//
//   var w = window.innerWidth,
//   h = window.innerHeight;
//
//   var max,
//   fontSize,
//   tags = [];
//
//   var layout = d3.layout.cloud()
//   .timeInterval(Infinity)
//   .size([w, h])
//   .fontSize(function(d) {
//     return d.size;
//   })
//   .text(function(d) {
//     return d.word;
//   })
//   .on("end", draw);
//
//   var svg = d3.select("#word-cloud-container").append("svg")
//   .attr("width", w)
//   .attr("height", h);
//
//   var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
//
//   $.get('/words.json', function (data) {
//     var a = data.map(function (d) {
//       console.log(d.word);
//       return {
//         text: d.word,
//         size: d.frequency * 20
//       }
//     })
//     tags = a
//     update();
//   })
//
//   function draw(data, bounds) {
//     var w = window.innerWidth,
//     h = window.innerHeight;
//
//     svg.attr("width", w).attr("height", h);
//
//     scale = bounds ? Math.min(
//       w / Math.abs(bounds[1].x - w / 2),
//       w / Math.abs(bounds[0].x - w / 2),
//       h / Math.abs(bounds[1].y - h / 2),
//       h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
//
//       var text = vis.selectAll("text")
//       .data(data, function(d) {
//         return d.text.toLowerCase();
//       });
//       text.transition()
//       .duration(1000)
//       .attr("transform", function(d) {
//         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//       })
//       .style("font-size", function(d) {
//         return d.size + "px";
//       });
//       text.enter().append("text")
//       .attr("text-anchor", "middle")
//       .attr("transform", function(d) {
//         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//       })
//       .style("font-size", function(d) {
//         return d.size + "px";
//       })
//       .style("opacity", 1e-6)
//       .transition()
//       .duration(1000)
//       .style("opacity", 1);
//       text.style("font-family", function(d) {
//         return d.font;
//       })
//       .style("fill", function(d) {
//         return fill(d.text.toLowerCase());
//       })
//       .text(function(d) {
//         return d.text;
//       });
//
//       vis.transition().attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
//     }
//
//     function update() {
//       console.log("update tags", tags);
//       layout.font('DIN Alternate').spiral('archimedean');
//       fontSize = d3.scale['sqrt']().range([10, 100]);
//       if (tags.length){
//         fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
//       }
//       layout.stop().words(tags).start();
//     }
// })


$(function () {

  if ($('#word-cloud-container').length > 0) {
    var container = document.getElementById('word-cloud-container'),
    containerSize = container.getBoundingClientRect(),
    greatestFrequency = 0,
    MAX_FONT_SIZE = 200,
    words;

    window.runCloud = function () {
      // Get the words from the server and kick off the party
      $.get('/words.json', function (data) {
        words = data

        console.log(data)

        // Find the word with the greatest frequency
        analyzeWords()

        // Set up the cloud layout
        window.cloud = d3.layout.cloud()
          .size([containerSize.width, containerSize.height])
          .words(words.map(function (d) {
            // Calculate the relative size of each word
            var size = (d.frequency / greatestFrequency) * MAX_FONT_SIZE

            // Only return words that will be a reasonable size
            if (size > 15) {
              return {
                text: d.word,
                size: size
              }
            } else { return {} }
          }))
          .padding(15)
          .rotate(function() { return 0 })
          .font("DIN Alternate")
          .fontSize(function(d) { return d.size; })
          .text(function(d) { return d.text; })
          .on("end", draw)

          cloud.start()

        function draw(words) {
          d3.select("#word-cloud-container").append("svg")
          .attr("width", cloud.size()[0])
          .attr("height", cloud.size()[1])
          .append("g")
            .attr("transform", "translate(" + cloud.size()[0] / 2 + "," + cloud.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "DIN Alternate")
            .style("fill", "white")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")";
            })
            .text(function(d) { return d.text; });
        }

        function analyzeWords() {
          words.forEach(function (d) {
            greatestFrequency = Math.max(d.frequency, greatestFrequency)
          })
        }

        var drawUpdate = function (words) {
          // var cloud = d3.layout.cloud()
          //   .size([containerSize.width, containerSize.height])
          //   .words(words.map(function (d) {
          //     // Calculate the relative size of each word
          //     var size = (d.frequency / greatestFrequency) * MAX_FONT_SIZE
          //
          //     // Only return words that will be a reasonable size
          //     if (size > 15) {
          //       return {
          //         text: d.word,
          //         size: size
          //       }
          //     } else { return {} }
          //   }))
          //   .padding(15)
          //   .rotate(function() { return 0 })
          //   .font("DIN Alternate")
          //   .fontSize(function(d) { return d.size; })
          //   .text(function(d) { return d.text; })
          //
          //   cloud.start()

            d3.select("svg")
              .selectAll('g')
                .attr("transform", "translate(" + cloud.size()[0] / 2 + "," + cloud.size()[1] / 2 + ")")
              .selectAll('text')
                .data(words).enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "DIN Alternate")
                .style("fill", "white")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")";
                })
                .text(function(d) { return d.text; });

        }
      })
    }

    runCloud()
    // window.setTimeout(runCloud, 60000)

  }

})
