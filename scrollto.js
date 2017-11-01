'use strict';

var scrollHelper = (function(global, window, document, undefined) {

  function getCurrentScrollPosition() {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
    }
  }

  function getScrollTarget(target) {
    return {
      x: target.offsetLeft || 0,
      y: target.offsetTop || 0
    }
  }

  function getTimeDifference(previousTimePassed, timePassed) {
    return (previousTimePassed) ? timePassed - previousTimePassed : timePassed;
  }

  function getRemainingDistance(currentScrollPosition, scrollTarget) {
    return {
      x: Math.abs(currentScrollPosition.x - scrollTarget.x),
      y: Math.abs(currentScrollPosition.y - scrollTarget.y),
    }
  }

  function getScrollByDistance(timeDifference, remainingDistance, timeLeft) {
    return {
      x: timeDifference * remainingDistance.x / timeLeft,
      y: timeDifference * remainingDistance.y / timeLeft
    }
  }

  function getNextScrollPosition(currentScrollPosition, scrollByDistance) {
    return {
      x: currentScrollPosition.x + scrollByDistance.x,
      y: currentScrollPosition.y + scrollByDistance.y
    }
  }

  function scrollTo(targetSelector, duration) {
    var start = performance.now(),
      target = document.querySelector(targetSelector),
      currentScrollPosition = getCurrentScrollPosition(),
      scrollTarget = getScrollTarget(target),
      currentTime = 0,
      previousTimePassed = 0;

    requestAnimationFrame(function animate(time) {
      var timePassed = time - start,
        scrollByDistance = {
          x: 0,
          y: 0
        };

      if (timePassed > 0) {
        var timeDifference = getTimeDifference(previousTimePassed, timePassed),
          remainingDistance = getRemainingDistance(currentScrollPosition, scrollTarget),
          timeLeft = duration - timePassed,

        scrollByDistance = getScrollByDistance(timeDifference, remainingDistance, timeLeft);
        previousTimePassed = timePassed;
      }

      var nextScrollPosition = getNextScrollPosition(currentScrollPosition, scrollByDistance);

      if (nextScrollPosition.x >= target.offsetLeft || nextScrollPosition.y >= target.offsetTop) {
        window.scrollTo(target.offsetLeft, target.offsetTop);
        previousTimePassed = timePassed;
      } else {
        window.scrollBy(scrollByDistance.x, scrollByDistance.y);
        currentScrollPosition = getCurrentScrollPosition();
      }

      if (timePassed < duration) {
        requestAnimationFrame(animate);
      } else {
        timePassed = duration;
        window.scrollTo(target.offsetLeft, target.offsetTop);
      }
    });
  }

  return {
    scrollTo: scrollTo
  }

})(this, window, window.document);