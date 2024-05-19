import { useState, useRef, useEffect } from 'react';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB，你可以根據需要調整大小


function useImages() {
    const inputRef = useRef();
    const [images, setImages] = useState([]);
  
    const handleUpload = (e) => {
      const newImages = [...e.target.files].filter(file => file.size <= MAX_FILE_SIZE).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    };
  
    const handleRemove = (itemIndex) => {
      setImages((prevImages) => {
        const imageToRemove = prevImages[itemIndex];
        URL.revokeObjectURL(imageToRemove.url);
        const updatedImages = prevImages.filter((_, index) => index !== itemIndex);
        return updatedImages;
      });
    };
  
    const handleRemoveAll = () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
      setImages([]); // 將圖片列表清空
    };
  
    useEffect(() => {
      if (images.length === 0 && inputRef.current) {
        inputRef.current.value = '';
      }
    }, [images]);
  
    return {
      images,
      handleUpload,
      handleRemove,
      handleRemoveAll,
      inputRef,
      maxFileSize: MAX_FILE_SIZE,
    };
  }
  export default useImages