'use strict'

// Get the width of a string
String.prototype.width = function(font) {
  var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();
  o.remove();
  return w;
}

$(function () {

  // Get the inputs as needed
  var jqInput = $('.word-input')
  var jqInputWidth = jqInput.innerWidth()
  var input = jqInput[0]

  // Get the maximum font size, according to what is set on the page
  var maxFontSize = parseInt(jqInput.css('font-size'), 10)

  // Resize the text if necessary so it always fits on the screen
  jqInput.on('keyup', function (e) {
    var currentFontSize = parseInt(jqInput.css('font-size'), 10)

    // While the value's width is greater than the input width,
    // decrease the size
    while (e.target.value.width(jqInput.css('font')) > jqInputWidth) {
      currentFontSize -= 1
      jqInput.css('font-size', currentFontSize)
    }

    // While the value's width is less than the input width and
    // less than the maxFontSize, increase the size
    while (e.target.value.width(jqInput.css('font')) < jqInputWidth && currentFontSize < maxFontSize) {
      currentFontSize += 1
      jqInput.css('font-size', currentFontSize)
    }
  })

  jqInput.on('keydown', function (e) {
    // Prevent spaces (force one-word responses)
    if (e.keyCode === 32)
      e.preventDefault()

    // Submit the word on enter
    if (e.keyCode === 13) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/words',
        data: {
          word: {
            word: jqInput.val()
          }
        },
        success: function (e) {
          var thankYouScreen = $('.thank-you-screen')
          thankYouScreen.css('top', 0)
          window.setTimeout(function () {thankYouScreen.css('top', '100%')}, 2000)
        }
      })

    }
  })

})
