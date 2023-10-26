const ImageKit = require("imagekit");
const { PUBLIC_KEY_IMAGEIO, PRIVATE_KEY_IMAGEIO, URL_ENDPOINT_IMAGEIO} = process.env;

module.exports = new ImageKit({
    publicKey : PUBLIC_KEY_IMAGEIO,
    privateKey : PRIVATE_KEY_IMAGEIO,
    urlEndpoint : URL_ENDPOINT_IMAGEIO
});
