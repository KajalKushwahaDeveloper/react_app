import { Marker } from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";

const EmulatorMarkerDirection = ({ rotationAngle, id, latLng }) => {
  console.log("EmulatorMarkerDirection refreshed");
  const markerRef = useRef(null);
  // copy latLng to initialPosition but don't update it on latLng change
  useEffect(() => {
    if (markerRef.current === null || markerRef.current === undefined) {
      return;
    }
    animateMarkerTo(markerRef.current, latLng);
  }, [latLng, markerRef]);

  // https://stackoverflow.com/a/55043218/9058905
  function animateMarkerTo(marker, newPosition) {
    var options = {
      duration: 1000,
      easing: function (x, t, b, c, d) {
        // jquery animation: swing (easeOutQuad)
        return -c * (t /= d) * (t - 2) + b;
      },
    };

    window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
    marker.AT_startPosition_lat = marker.getPosition().lat();
    marker.AT_startPosition_lng = marker.getPosition().lng();
    var newPosition_lat = newPosition.lat;
    var newPosition_lng = newPosition.lng;

    // crossing the 180° meridian and going the long way around the earth?
    if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
      if (newPosition_lng > marker.AT_startPosition_lng) {
        newPosition_lng -= 360;
      } else {
        newPosition_lng += 360;
      }
    }

    var animateStep = function (marker, startTime) {
      var ellapsedTime = new Date().getTime() - startTime;
      var durationRatio = ellapsedTime / options.duration; // 0 - 1
      var easingDurationRatio = options.easing(
        durationRatio,
        ellapsedTime,
        0,
        1,
        options.duration
      );

      if (durationRatio < 1) {
        marker.setPosition({
          lat:
            marker.AT_startPosition_lat +
            (newPosition_lat - marker.AT_startPosition_lat) *
              easingDurationRatio,
          lng:
            marker.AT_startPosition_lng +
            (newPosition_lng - marker.AT_startPosition_lng) *
              easingDurationRatio,
        });

        // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
        if (window.requestAnimationFrame) {
          marker.AT_animationHandler = window.requestAnimationFrame(
            function () {
              animateStep(marker, startTime);
            }
          );
        } else {
          marker.AT_animationHandler = setTimeout(function () {
            animateStep(marker, startTime);
          }, 17);
        }
      } else {
        marker.setPosition(newPosition);
      }
    };

    // stop possibly running animation
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(marker.AT_animationHandler);
    } else {
      clearTimeout(marker.AT_animationHandler);
    }

    animateStep(marker, new Date().getTime());
  }

  const arePropsEqual = (prevProps, nextProps) => {
    // compare all props except latLng
    const { latLng: prevLatLng, rotationAngle : prevRotationAngle, ...restPrevProps } = prevProps;
    const { latLng: nextLatLng, rotationAngle : nextRotationAngle, ...restNextProps } = nextProps;
    const isEqual = _.isEqual(restPrevProps, restNextProps);
    console.log("EmulatorMarker arePropsEqual:", isEqual);
    return isEqual;
  };

  const MemoizedMarker = React.memo(Marker, arePropsEqual);
  // SVG with gradient and rotation

  const svgIcon = `
      <svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" transform="rotate(${rotationAngle})">
      <defs>
        <radialGradient id="grad1" cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
          <stop offset="0%" style="stop-color:rgb(0,255,255);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(0,0,0,0);stop-opacity:0" />
        </radialGradient>
      </defs>
      <path d="M32,0 A16,16 0 0,1 48,16 L32,32 L16,16 A16,16 0 0,1 32,0" fill="url(#grad1)" />
      </svg>`;
  return (
    <MemoizedMarker
      key={id}
      onLoad={(marker) => {
        markerRef.current = marker;
      }}
      icon={{
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgIcon),
        scaledSize: new window.google.maps.Size(100, 100),
        anchor: new window.google.maps.Point(50, 50),
        rotation: rotationAngle,
      }}
      rotation={rotationAngle}
      position={{
        lat: latLng.lat,
        lng: latLng.lng,
      }}
      zIndex={0}
    />
  );
};

export default EmulatorMarkerDirection;
