"use client";

import { useEffect, useState } from "react";

interface Image {
  _id: string;
  url: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    const res = await fetch("http://localhost:5000/images");
    const data = await res.json();
    setImages(data);
  };

  const uploadImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-center">upload your image here : </h1>

      <input
        className="cursor-pointer"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={uploadImage}>Upload</button>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {images.map((img) => (
          <img key={img._id} src={img.url} alt="uploaded" width={200} />
        ))}
      </div>
    </div>
  );
}
