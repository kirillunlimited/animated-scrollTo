'use strict';

var scrollHelper = (function(global, window, document, undefined) {

  function getYScrollPosition() {
    return window.scrollY || window.pageYOffset;
  }

  function scrollTo(targetSelector, duration) {
    var start = performance.now(),
      target = document.querySelector(targetSelector),
      scrolledDistance = getYScrollPosition(),
      scrollTargetY = target.offsetTop || 0,
      currentTime = 0,
      previousTimePassed = 0;

    requestAnimationFrame(function animate(time) {
      var timePassed = time - start,
        scrollByCoords = {
          x: 0,
          y: 0
        };

      if (timePassed > 0) {
        var timeDiff = (previousTimePassed) ? timePassed - previousTimePassed : timePassed,
          yDiff = Math.abs(scrolledDistance - scrollTargetY),
          timeLeft = duration - timePassed;

        scrollByCoords.y = timeDiff * yDiff / timeLeft;
        previousTimePassed = timePassed;
      }

      window.scrollBy(scrollByCoords.x, scrollByCoords.y);

      scrolledDistance = getYScrollPosition();

      if (timePassed < duration) {
        requestAnimationFrame(animate);
      } else {
        timePassed = duration;
        window.scrollTo(0, target.offsetTop);
      }
    });
  }

  return {
    scrollTo: scrollTo
  }

})(this, window, window.document);