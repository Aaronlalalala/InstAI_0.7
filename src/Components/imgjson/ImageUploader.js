import React, { useState } from "react";

const ImageUploader = ({ defaultValue, onChange }) => {
  const [selectedImages, setSelectedImages] = useState(defaultValue || []);
  const [previewImages, setPreviewImages] = useState(defaultValue || []);

  const handleFileSelect = (e) => {
    const files = e.target.files;

    Promise.all(
      Array.from(files).map((file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({ data: event.target.result, id: Date.now(), file: file });
          };
          reader.readAsDataURL(file);
        })
      )
    ).then((newImages) => {
      setSelectedImages((prevSelectedImages) => [...prevSelectedImages, ...newImages]);
      setPreviewImages((prevPreviewImages) => [...prevPreviewImages, ...newImages]);

      if (onChange) {
        onChange(newImages.map((image) => image.data.replace(/^data:image\/[a-zA-Z]+;base64,/, '')));
      }
    });
  };

  const handleDeleteImage = (index) => {
    setSelectedImages((prevSelectedImages) => {
      const updatedSelectedImages = [...prevSelectedImages];
      updatedSelectedImages.splice(index, 1);
      return updatedSelectedImages;
    });

    setPreviewImages((prevPreviewImages) => {
      const updatedPreviewImages = [...prevPreviewImages];
      updatedPreviewImages.splice(index, 1);
      return updatedPreviewImages;
    });

    if (onChange) {
      onChange(selectedImages.filter((image, i) => i !== index).map((image) => image.data.replace(/^data:image\/[a-zA-Z]+;base64,/, '')));
    }
  };

  const handleUpload = () => {
    if (onChange) {
      onChange(selectedImages.map((image) => image.data.replace(/^data:image\/[a-zA-Z]+;base64,/, '')));
    }
  };

  const handleDeleteAllImages = () => {
    setSelectedImages([]);
    setPreviewImages([]);
    if (onChange) {
      onChange([]);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {previewImages.map((image, index) => (
          <div key={image.id} style={{ margin: "10px", position: "relative" }}>
            <img
              src={image.data}
              alt={`Image ${index + 1}`}
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                width: "auto",
                height: "auto",
              }}
              loading="lazy"
            />
            <button
              onClick={() => handleDeleteImage(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                padding: "5px",
                background: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              刪除
            </button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleUpload}>提交</button>
        <button onClick={handleDeleteAllImages}>刪除全部照片</button>
      </div>
    </div>
  );
};

export default ImageUploader;
