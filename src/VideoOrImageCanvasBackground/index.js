// @flow weak

import React, { useRef, useEffect, useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import { useSettings } from "../SettingsProvider"

var fs = require('fs');
var Tiff = require('tiff.js');

var imgSrc = ''
var imgData = null

const Video = styled("video")({
  zIndex: 0,
  position: "absolute",
})

const StyledImage = styled("img")({
  zIndex: 0,
  position: "absolute",
})

export default ({
  imagePosition,
  mouseEvents,
  videoTime,
  videoSrc,
  imageSrc,
  onLoad,
  useCrossOrigin = false,
  videoPlaying,
  onChangeVideoTime,
  onChangeVideoPlaying,
}) => {
  const settings = useSettings()
  const videoRef = useRef()
  const imageRef = useRef()

  useEffect(() => {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = (videoTime || 0) / 1000
    }
  }, [videoTime])

  useEffect(() => {
    let renderLoopRunning = false
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play()
        renderLoopRunning = true
        if (settings.videoPlaybackSpeed) {
          videoRef.current.playbackRate = parseFloat(
            settings.videoPlaybackSpeed
          )
        }
      } else {
        videoRef.current.pause()
      }
    }

    function checkForNewFrame() {
      if (!renderLoopRunning) return
      if (!videoRef.current) return
      const newVideoTime = Math.floor(videoRef.current.currentTime * 1000)
      if (videoTime !== newVideoTime) {
        onChangeVideoTime(newVideoTime)
      }
      if (videoRef.current.paused) {
        renderLoopRunning = false
        onChangeVideoPlaying(false)
      }
      requestAnimationFrame(checkForNewFrame)
    }
    checkForNewFrame()

    return () => {
      renderLoopRunning = false
    }
  }, [videoPlaying])

  const onLoadedVideoMetadata = useEventCallback((event) => {
    const videoElm = event.currentTarget
    videoElm.currentTime = (videoTime || 0) / 1000
    if (onLoad)
      onLoad({
        naturalWidth: videoElm.videoWidth,
        naturalHeight: videoElm.videoHeight,
        videoElm: videoElm,
        duration: videoElm.duration,
      })
  })
  const onImageLoaded = useEventCallback((event) => {
    const imageElm = event.currentTarget
    if (onLoad)
      onLoad({
        naturalWidth: imageElm.naturalWidth,
        naturalHeight: imageElm.naturalHeight,
        imageElm,
      })
  })

  const stylePosition = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y
    return {
      imageRendering: "pixelated",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
  ])

  if (!videoSrc && !imageSrc) return "No imageSrc or videoSrc provided"

  if (imageSrc.indexOf('.tif') !== -1) { 
    if (imageSrc !== imgSrc) {
      imgSrc = imageSrc
      var input = fs.readFileSync(imageSrc);
      var tiff = new Tiff({ buffer: input });
      var canvasTIF = tiff.toCanvas();
      imgData = canvasTIF.toDataURL("image/png");
    }
    var imageSrcNew = imgData
  } 
  else {
    var imageSrcNew = imgSrc
  }

  return imageSrc && videoTime === undefined ? (
    <StyledImage
      {...mouseEvents}
      src={imageSrcNew}
      ref={imageRef}
      style={stylePosition}
      onLoad={onImageLoaded}
      crossOrigin={useCrossOrigin ? "anonymous" : undefined}
    />
  ) : (
    <Video
      {...mouseEvents}
      ref={videoRef}
      style={stylePosition}
      onLoadedMetadata={onLoadedVideoMetadata}
      src={videoSrc || imageSrc}
    />
  )
}
