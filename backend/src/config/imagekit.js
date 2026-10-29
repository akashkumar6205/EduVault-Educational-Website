import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

let imagekitInstance = null;

export const getImageKitInstance = () => {
  if (imagekitInstance) return imagekitInstance;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    console.warn(
      "[ImageKit Warning] ImageKit credentials are missing or incomplete in environment variables. File uploads will be mocked or rejected until configured."
    );
    return null;
  }

  imagekitInstance = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  return imagekitInstance;
};

export default getImageKitInstance;
