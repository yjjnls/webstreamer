export LIBWEBSTREAMER_PATH=/home/conan/.conan/data/libwebstreamer/0.1.0-dev/yjjnls/testing/package/80002cc1408dfc29403972e449fcc333d06485db
export TESSERACT_PLUGIN_PATH=/home/conan/.conan/data/tesseract.plugin/0.1.0-dev.10/yjjnls/testing/package/12010c1eb8c1547f26417b7b24f3854acc90eb3a/lib
export LD_LIBRARY_PATH=/home/conan/.conan/data/libwebstreamer/0.1.0-dev/yjjnls/testing/package/80002cc1408dfc29403972e449fcc333d06485db:/opt/gstreamer/linux_x86_64/bin/:/opt/gstreamer/linux_x86_64/lib:/opt/gstreamer/linux_x86_64/lib/gstreamer-1.0:/home/conan/.conan/data/zlib/1.2.11/conan/stable/package/c6d75a933080ca17eb7f076813e7fb21aaa740f2/lib:/home/conan/.conan/data/libtiff/4.0.9/bincrafters/stable/package/45238820c0e0d46e1009733d9fb3b3e4a3f7986e/lib:/home/conan/.conan/data/libpng/1.6.34/bincrafters/stable/package/45238820c0e0d46e1009733d9fb3b3e4a3f7986e/lib:/home/conan/.conan/data/libjpeg/9c/bincrafters/stable/package/c6d75a933080ca17eb7f076813e7fb21aaa740f2/lib:/home/conan/.conan/data/giflib/5.1.4/bincrafters/stable/package/b869e6c05cb587ad588e5ec485deb62012ec7b93/lib:/home/conan/.conan/data/leptonica/1.76.0/bincrafters/stable/package/daa9207d1858ef5f2fa5034b7fd1b394094e17bd/lib:/home/conan/.conan/data/tesseract/3.05.01/yjjnls/stable/package/533d5c771833956109d02e81befd808fa3fb50bb/lib:/home/conan/.conan/data/tesseract.plugin/0.1.0-dev.10/yjjnls/testing/package/12010c1eb8c1547f26417b7b24f3854acc90eb3a/lib

pushd /tmp
git clone https://github.com/yjjnls/nothing.git
export TESSDATA_PREFIX=/tmp/nothing/tessdata/
popd -
export GST_DEBUG=webstreamer:5
export GSTREAMER_ROOT=/opt/gstreamer/linux_x86_64