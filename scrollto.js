'use strict';

var scrollHelper = (function (global, window, document, undefined) {

  var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function getContainerDelta(container) {
    if (container === window) {
      return {
        x: 0,
        y: 0
      }
    } else {
      return {
        x: container.offsetLeft - (window.scrollX || window.pageXOffset),
        y: container.offsetTop - (window.scrollY || window.pageYOffset),
      }
    }
  }

  function getCurrentScrollPosition(container, containerDelta) {
    return {
      x: (container.scrollX || container.pageXOffset || container.scrollLeft || 0) + containerDelta.x,
      y: (container.scrollY || container.pageYOffset || container.scrollTop || 0) + containerDelta.y
    }
  }

  function getTargetScrollPosition(target, container) {
    if (container === window) {
      return {
        x: target.offsetLeft || 0,
        y: target.offsetTop || 0
      }
    } else {
      return {
        x: (target.offsetLeft || 0) - (window.scrollX || window.pageXOffset),
        y: (target.offsetTop || 0) - (window.scrollY || window.pageYOffset),
      }
    }
  }

  function getTimeDifference(previousTimePassed, timePassed) {
    return (previousTimePassed) ? timePassed - previousTimePassed : timePassed;
  }

  function getRemainingDistance(currentScrollPosition, targetScrollPosition) {
    return {
      x: Math.abs(currentScrollPosition.x - targetScrollPosition.x),
      y: Math.abs(currentScrollPosition.y - targetScrollPosition.y),
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

  function scrollTo(targetSelector, duration, options) {
    var start = performance.now(),
      options = options || {},
      container = (options.container) ? document.querySelector(options.container) : window,
      target = document.querySelector(targetSelector),
      containerDelta = getContainerDelta(container),
      currentScrollPosition = getCurrentScrollPosition(container, containerDelta),
      targetScrollPosition = getTargetScrollPosition(target, container),
      currentTime = 0,
      previousTimePassed = 0;

    requestAnimFrame(function animate(time) {
      var timePassed = time - start,
        scrollByDistance = {
          x: 0,
          y: 0
        };

      if (timePassed > 0) {
        var timeLeft = duration - timePassed,
          timeDifference = getTimeDifference(previousTimePassed, timePassed),
          remainingDistance = getRemainingDistance(currentScrollPosition, targetScrollPosition),
          scrollByDistance = getScrollByDistance(timeDifference, remainingDistance, timeLeft);

        previousTimePassed = timePassed;
      }

      var nextScrollPosition = getNextScrollPosition(currentScrollPosition, scrollByDistance);

      if (nextScrollPosition.x >= target.offsetLeft || nextScrollPosition.y >= target.offsetTop || timePassed >= duration) {
        container.scrollTo(targetScrollPosition.x - containerDelta.x, targetScrollPosition.y - containerDelta.y);
        if (options.onAfter) {
          options.onAfter();
        }
      } else {
        container.scrollBy(scrollByDistance.x, scrollByDistance.y);
        currentScrollPosition = getCurrentScrollPosition(container, containerDelta);
        requestAnimFrame(animate);
      }
    });
  }

  return {
    scrollTo: scrollTo
  }

})(this, window, window.document);