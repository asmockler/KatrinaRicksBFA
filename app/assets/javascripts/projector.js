// HUGE Shoutout to https://github.com/jasondavies/d3-cloud for the fantastic,
// collision-free word cloud. Most of the word cloud code comes from the examples
// in that repo


$(function () {

  if ($('word-cloud-container').length > 0) {
    var container = document.getElementById('word-cloud-container'),
    containerSize = container.getBoundingClientRect(),
    greatestFrequency = 0,
    MAX_FONT_SIZE = 200,
    words = [
      {word: "neato", frequency: 60},
      {word: "fantastic", frequency: 332},
      {word: "magic", frequency: 124},
      {word: "magical", frequency: 333},
      {word: "enlightening", frequency: 99},
      {word: "emotional", frequency: 415},
      {word: "relaxing", frequency: 153},
      {word: "centered", frequency: 120},
      {word: "warmer", frequency: 189},
      {word: "energized", frequency: 111},
      {word: "connected", frequency: 70},
      {word: "meditative", frequency: 65},
      {word: "productive", frequency: 164},
      {word: "fluid", frequency: 43},
      {word: "awesome", frequency: 400}
    ]

    // Find the word with the greatest frequency
    analyzeWords()

    // Set up the cloud layout
    var cloud = d3.layout.cloud()
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
    .on("end", draw);

    // Start the cloud
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
  }

})
