// HUGE Shoutout to https://github.com/jasondavies/d3-cloud for the fantastic,
// collision-free word cloud. Most of the word cloud code comes from the examples
// in that repo
// http://bl.ocks.org/jwhitfieldseed/9697914#index.html

$(function () {

  ////
  // initializeWordCloud
  // Sets up the cloud element and the needed container elements
  //
  function initializeWordCloud () {
    // Get the window size
    var containerSize = document.getElementById('word-cloud-container').getBoundingClientRect()

    // Set up the SVG container
    d3.select('#word-cloud-container')
      .append('svg')
        .attr('width', containerSize.width)
        .attr('height', containerSize.height)
        .append('g')
          .attr('transform', 'translate(' + containerSize.width / 2 + ',' + containerSize.height / 2 + ')')

    var cloud = d3.layout.cloud()
      .size([containerSize.width, containerSize.height])
      .words([])
      .padding(15)
      .rotate(function () { return 0; })
      .font('DIN Alternate')
      .fontSize(function (d) { return d.size; })
      .text(function (d) { return d.text; })
      .on('end', draw)

    cloud.start()

    return cloud
  }

  ////
  // draw
  // Draws the words in the cloud
  //
  function draw (words) {
    var g = d3.select('svg').select('g');
    var words = g.selectAll('text').data(words, function (d) { return d.text; });

    words.enter().append('text')
      .style('font-family', 'DIN Alternate')
      .style('fill', 'white')
      .attr('font-size', 1)//function (d) { return d.size + 'px'; })
      .attr('text-anchor', 'middle')
      .attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')';
      })
      .text(function(d) {
        return d.text;
      });

    words.transition()
      .duration(600)
      .style('font-size', function (d) {
        return d.size + 'px';
      })
      .attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')'
      })
      .style('fill-opacity', 1);

    words.exit()
      .transition()
        .duration(200)
        .style('fill-opacity', 1e-6)
        .attr('font-size', 1)
          .remove();
  }

  function analyzeWords(words) {
    greatestFrequency = 0
    words.forEach(function (w) {
      greatestFrequency = Math.max(w.frequency, greatestFrequency)
    })
    return greatestFrequency
  }

  function normalizeWords (words) {
    var greatestFrequency = analyzeWords(words),
      MAX_FONT_SIZE = 200;

    words = words.map(function (word) {
      var size = (word.frequency / greatestFrequency) * MAX_FONT_SIZE;

      return {
        text: word.word,
        size: size
      }
    })

    return words
  }

  function cloudShouldUpdate (newWords) {

    var shouldUpdate = false

    for (var item in window.currentWords) {
      window.currentWords[item].present = false
    }

    for (var i = 0; i < newWords.length; i++) {
      var word = newWords[i]

      // If the word isn't in the object, add it
      if (window.currentWords[word.word] === undefined) {

        window.currentWords[word.word] = {
          frequency: word.frequency,
          present: true
        }

        shouldUpdate = true

      // If the frequency changes, update the frequency
      } else if ( window.currentWords[word.word].frequency !== word.frequency ) {
        window.currentWords[word.word] = {
          frequency: word.frequency,
          present: true
        }
        shouldUpdate = true
      }

      window.currentWords[word.word].present = true
    }

    for (var item in window.currentWords) {
      if (!window.currentWords[item].present) {
        delete window.currentWords[item]
        shouldUpdate = true
      }
    }

    return shouldUpdate
  }

  function refreshCloud (cloud) {
    // Refresh the words
    $.get('/words.json', function (words) {

      if (cloudShouldUpdate(words)) {
        // Put the words in wordcloud format
        words = normalizeWords(words);

        // Make the cloud redraw
        cloud.stop().words(words).start();
      }
    })
  }

  if ($('#word-cloud-container').length > 0) {
    // Prevent overflow
    $('body').addClass('projector')

    window.currentWords = {}

    // Start the word cloud
    var cloud = initializeWordCloud()

    window.setInterval(function () {
      refreshCloud(cloud)
    }, 10000)
  }
})
