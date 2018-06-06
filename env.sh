export LIBWEBSTREAMER_PATH=/root/libwebstreamer/bin/linux/x64/
export TESSERACT_PLUGIN_PATH=/root/tesseract-node/bin/linux/x64/
export LD_LIBRARY_PATH=/root/cerbero/build/dist/linux_x86_64/bin/:/root/cerbero/build/dist/linux_x86_64/lib/:/root/cerbero/build/dist/linux_x86_64/lib/gstreamer-1.0/:$LIBWEBSTREAMER_PATH:$TESSERACT_PLUGIN_PATH:/usr/lib/x86_64-linux-gnu

export TESSDATA_PREFIX=/usr/share/tesseract-ocr/tessdata/
export GST_DEBUG=webstreamer:5

export PKG_CONFIG_PATH=/root/cerbero/build/dist/linux_x86_64/lib/pkgconfig/
export PATH=/root/cerbero/build/dist/linux_x86_64/bin/:$PATH