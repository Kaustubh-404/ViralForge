export const memes = [
  { id: 1, imageUrl: "/meme-1.webp", title: "Meme 1" },
  { id: 2, imageUrl: "/meme-2.webp", title: "Meme 2" },
  { id: 3, imageUrl: "/meme-3.webp", title: "Meme 3" },
  { id: 4, imageUrl: "/meme-4.webp", title: "Meme 4" },
  { id: 5, imageUrl: "/meme-5.webp", title: "Meme 5" },
  { id: 6, imageUrl: "/meme-6.webp", title: "Meme 6" },
  { id: 7, imageUrl: "/meme-7.webp", title: "Meme 7" },
  { id: 8, imageUrl: "/meme-8.webp", title: "Meme 8" },
  { id: 9, imageUrl: "/meme-9.webp", title: "Meme 9" },
  { id: 10, imageUrl: "/meme-10.webp", title: "Meme 10" },
  { id: 11, imageUrl: "/meme-11.webp", title: "Meme 11" },
  { id: 12, imageUrl: "/meme-12.webp", title: "Meme 12" },
];

export const templates = Array.from({ length: 18 }, (_, i) => ({
  id: `${i + 1}`,
  src: `/template-${i + 1}.jpg`,
  alt: `Meme Template ${i + 1}`,
}));

export interface MemeTemplate {
  cid: string;
  image: string;
  isTemplate: boolean;
  memeTemplate: string;
}
