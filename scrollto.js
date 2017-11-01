'use strict';

var scrollHelper = (function(global, window, document, undefined) {

  function getCurrentScrollPosition(container) {
    return {
      x: container.scrollX || container.pageXOffset || container.scrollLeft,
      y: container.scrollY || container.pageYOffset || container.scrollTop
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

  function scrollTo(containerSelector, targetSelector, duration) {
    var start = performance.now(),
      container = document.querySelector(containerSelector) || window,
      target = document.querySelector(targetSelector),
      currentScrollPosition = getCurrentScrollPosition(container),
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

      if (nextScrollPosition.x >= target.offsetLeft || nextScrollPosition.y >= target.offsetTop || timePassed >= duration) {
        container.scrollTo(target.offsetLeft, target.offsetTop);
      } else {
        container.scrollBy(scrollByDistance.x, scrollByDistance.y);
        currentScrollPosition = getCurrentScrollPosition(container);
        requestAnimationFrame(animate);
      }

    });
  }

  return {
    scrollTo: scrollTo
  }

})(this, window, window.document);