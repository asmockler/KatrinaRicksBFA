'use strict'

////
// New
//

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

  if ($('#word-new').length > 0) $('body').css('overflow', 'hidden')
  else return

  // Get the inputs as needed
  var jqInput = $('.word-input')
  var jqInputWidth = jqInput.innerWidth()
  var input = jqInput[0]

  // Get the maximum font size, according to what is set on the page
  var maxFontSize = parseInt(jqInput.css('font-size'), 10)

  // Create the progress bar
  // progressbar.js@1.0.0 version is used
  // Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
  var bar = new ProgressBar.Circle('#progress-bar-container', {
    strokeWidth: 50,
    easing: 'linear',
    duration: 2500,
    color: '#333',
    trailColor: 'transparent',
    trailWidth: 1,
    svgStyle: null
  });

  jqInput.focus()

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
        success: function () {
          showThankYouScreen(bar, jqInput)
        }
      })

    }
  })

})

/*
 * Ok, I know what you're thinking: "what the hell are those setTimeouts for?!"
 * I don't blame you. I wish they weren't there. Unfortunately, Chrome didn't like
 * re-running the animation without them. Its a bummer. I bet there is a better fix,
 * but I'm not smart enough to know it. Thx bye.
 */
var showThankYouScreen = function (bar, input) {
  input.blur()

  var submittedWord = input.val(),
      submittedWordWidth = submittedWord.width(input.css('font')),
      inputPosition = input[0].getBoundingClientRect(),
      inputFontSize = input.css('font-size'),
      prompt = $('#prompt')

  var position = (window.innerWidth / 2) - (submittedWordWidth / 2) - parseInt($('body').css('padding-left'), 10)
  input.css({
    'left': position,
  })
  prompt.css('opacity', 0)

  window.setTimeout(function () { input.css('opacity', 0) }, 1500)

  window.setTimeout(function () {
    // Bring in the thank you screen
    var thankYouScreen = $('.thank-you-screen')

    // Slide the screen in
    thankYouScreen.removeClass('slide-down bounce-out').addClass('slide-up')
    window.setTimeout(function () {
      thankYouScreen.addClass('bounce-in')
    }, 0)

    // Reset the progress and start the animation
    bar.set(0)
    bar.animate(1.0, function () {
      // Slide the screen out
      thankYouScreen.removeClass('bounce-in slide-up').addClass('slide-down')
      window.setTimeout(function () {
        thankYouScreen.addClass('bounce-out')
      }, 0)

      // Reset the input
      input.css({
        'left': 0,
        'font-size': 290,
        'opacity': 1
      }).val('').focus()
      prompt.css('opacity', 1)
    });
  }, 2000)

}


////
// Show
//
$(function () {
  $('.toggle-word-visibility').on('click', function (e) {
    e.preventDefault()
    var link = $(this)

    $.get($(this).attr('href'), function (data) {
      e.preventDefault();
      link.html(data.visibility ? "un-approve" : "approve")
    })
  })
})
