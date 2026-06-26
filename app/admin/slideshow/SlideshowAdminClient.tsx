"use client";

import { useRef, useState } from "react";
import {
  uploadSlideshowImage,
  deleteSlideshowImage,
  reorderSlideshow,
} from "./actions";

type SlideImage = {
  id: number;
  image_url: string;
  file_name: string | null;
  sort_order: number;
  created_at: string;
};

export default function SlideshowAdminClient({
  initialImages,
}: {
  initialImages: SlideImage[];
}) {
  const [images, setImages] = useState<SlideImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      const res = await uploadSlideshowImage(fd);
      if (res?.success && res.image) {
        setImages((prev) => [...prev, res.image as SlideImage]);
      } else if (res?.error) {
        alert(res.error);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (img: SlideImage) => {
    if (!confirm("Remove this image from the slideshow?")) return;
    setImages((prev) => prev.filter((x) => x.id !== img.id));
    await deleteSlideshowImage(img.id, img.image_url);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[index], next[j]] = [next[j], next[index]];
    setImages(next);
    await reorderSlideshow(next.map((x) => x.id));
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Home Slideshow</h1>
          <p className="text-stone-500 mt-1">
            Upload banner images shown in the slideshow on the home page. Use wide
            (landscape) images for the best look.
          </p>
        </div>

        <label
          className={`bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 self-start ${
            uploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-brand-deep"
          }`}
        >
          {uploading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              Uploading...
            </>
          ) : (
            <>
              <span>↑</span> Add Images
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="bg-white rounded-xl border border-line shadow-sm p-5">
        <h2 className="text-sm font-bold text-ink mb-4">
          Slides
          <span className="ml-2 font-medium text-stone-400">
            {images.length} image{images.length === 1 ? "" : "s"} · shown in this order
          </span>
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-12 text-stone-500 border-2 border-dashed border-line rounded-xl">
            No slideshow images yet. Click <span className="font-bold text-brand">Add Images</span> to upload.
          </div>
        ) : (
          <div className="space-y-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="flex items-center gap-4 border border-line rounded-lg p-3 bg-stone-50/50"
              >
                <span className="w-6 text-center text-sm font-bold text-stone-400 tabular-nums">
                  {index + 1}
                </span>
                <div className="w-40 h-24 flex-none rounded-md overflow-hidden bg-stone-100 border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.file_name || "Slide"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">
                    {img.file_name || "Image"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    className={`w-8 h-8 rounded-md text-base font-bold ${index === 0 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"}`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    title="Move down"
                    className={`w-8 h-8 rounded-md text-base font-bold ${index === images.length - 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-500 hover:bg-stone-100"}`}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDelete(img)}
                    title="Delete"
                    className="w-8 h-8 rounded-md text-red-500 hover:bg-red-50 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
