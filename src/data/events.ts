export type EventItem = {
  slug: string;
  title: string;
  coverImage: string;
  images: string[];
  description: string[];
};

export const events: EventItem[] = [
  {
    slug: "wedding-hamper",
    title: "Wedding Hamper",
    coverImage: "/assets/PROJECTS/events/wedding-hamper/cover.jpg",
    images: [
      "/assets/PROJECTS/events/wedding-hamper/1.jpg",
      "/assets/PROJECTS/events/wedding-hamper/2.jpg",
      "/assets/PROJECTS/events/wedding-hamper/3.jpg",
      "/assets/PROJECTS/events/wedding-hamper/4.jpg",
    ],
    description: [
      "The hamper serves as a distinctive rendition of the traditional Indian Tokris to honour the union of the two families on behalf of the Baxi and Srivastava Families, celebrating the deep-rooted connection to our culture, heritage, and one another.",

      "At the heart of our wedding hamper project lies the art of storytelling, with each product narrating a tale, weaving together tradition, culture, and personal anecdotes in an exquisite blend of elegance and sustainability.",

      "From the iconic Motichoor Laddoos to the artisanal Coconut Laddoos, including Ragi Ribbons and Gujarati Chakli, each treat carries a story of tradition and taste with a contemporary twist. In addition to the culinary delights, the hamper includes traditional Chooris, inviting guests to mingle and share in the joy of celebration, including fun facts about the couple.",

      "Lastly, the hamper features bronzeware with golden rice symbolizing prosperity and abundance, and spice blends sourced from the streets of Khari Baoli, offering an immersive experience that engages the senses with aromatic flavors and textures.",
    ],
  },

  {
    slug: "the-winds-will-blow-launch",
    title: "The Winds Will Blow Launch",
    coverImage: "/assets/PROJECTS/events/the-winds-will-blow/cover.jpg",
    images: [
      "/assets/PROJECTS/events/the-winds-will-blow/1.png",
      "/assets/PROJECTS/events/the-winds-will-blow/2.jpg",
      "/assets/PROJECTS/events/the-winds-will-blow/3.jpg",
      "/assets/PROJECTS/events/the-winds-will-blow/4.jpg",
    ],
    description: [],
  },

  {
    slug: "my-scribbles-launch",
    title: "MY Scribbles Launch",
    coverImage: "/assets/PROJECTS/events/my-scribbles-launch/cover.png",
    images: [
      "/assets/PROJECTS/events/my-scribbles-launch/1.png",
      "/assets/PROJECTS/events/my-scribbles-launch/2.png",
      "/assets/PROJECTS/events/my-scribbles-launch/3.png",
      "/assets/PROJECTS/events/my-scribbles-launch/4.png",
    ],
    description: [],
  },

  {
    slug: "grit-and-grace",
    title: "Grit and Grace",
    coverImage: "/assets/PROJECTS/events/grit-and-grace-launch/cover.png",
    images: [
      "/assets/PROJECTS/events/grit-and-grace-launch/1.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/2.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/3.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/4.png",
    ],
    description: [],
  },

  {
    slug: "dcwa",
    title: "DCWA",
    coverImage: "/assets/PROJECTS/events/dcwa/cover.jpg",
    images: [
      "/assets/PROJECTS/events/dcwa/1.jpeg",
      "/assets/PROJECTS/events/dcwa/2.jpeg",
      "/assets/PROJECTS/events/dcwa/3.jpeg",
      "/assets/PROJECTS/events/dcwa/4.jpeg",
    ],
    description: [],
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((event) => event.slug === slug);
}