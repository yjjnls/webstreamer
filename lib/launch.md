

gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test  !tee name=t t.  ! queue ! capsfilter caps="application/x-rtp,media=video"  ! rtph264depay ! decodebin  ! autovideosink 

gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test  ! capsfilter caps="application/x-rtp,media=audio" ! rtppcmadepay ! decodebin ! audioconvert !spectrascope ! autovideosink


gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test  ! multiqueue ! capsfilter caps="application/x-rtp,media=video"  ! rtph264depay ! decodebin  ! autovideosink 

gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test  !multiqueue ! capsfilter caps="application/x-rtp,media=audio" ! rtppcmadepay ! decodebin ! audioconvert !spectrascope ! autovideosink
--OK

gst-launch-1.0 -e rtspsrc location=rtsp://127.0.0.1/test nam=r r.stream_0  ! queue !capsfilter caps="application/x-rtp,media=video"  ! rtph264depay ! decodebin  ! autovideosink sync=false r.stream_1 ! queue ! capsfilter caps="application/x-rtp,media=audio" ! rtppcmadepay ! decodebin ! audioconvert !spectrascope ! autovideosink sync=false
