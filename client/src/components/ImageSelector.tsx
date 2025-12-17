import { useState, useEffect } from "react";
import styles from "./imageSelector.module.css";

interface ImageSelectorProps {
  petType: string;
  selectedImageUrl: string;
  onImageSelect: (imageUrl: string) => void;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
}

const ImageSelector = ({
  petType,
  selectedImageUrl,
  onImageSelect
}: ImageSelectorProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!petType) {
      setImageUrls([]);
      return;
    }

    const fetchUnsplashImages = async () => {
      setLoading(true);
      try {
        const query = petType.toLowerCase();
        const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${query}&count=4&client_id=${accessKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data: UnsplashPhoto[] = await response.json();
        const urls = data.map((photo) => photo.urls.small);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching Unsplash images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnsplashImages();
  }, [petType]);

  if (!petType) return null;

  if (loading) {
    return (
      <div className={styles.imageSelector}>
        <h4>Loading {petType.toLowerCase()} images...</h4>
      </div>
    );
  }

  return (
    <div className={styles.imageSelector}>
      <h4>Select a {petType.toLowerCase()} image:</h4>
      <div className={styles.imageGrid}>
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${petType} option ${index + 1}`}
            className={`${styles.imageOption} ${
              selectedImageUrl === url ? styles.selected : ""
            }`}
            onClick={() => onImageSelect(url)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
