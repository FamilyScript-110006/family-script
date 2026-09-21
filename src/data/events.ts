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
      "The wedding hamper was conceived as a distinctive interpretation of the traditional Indian tokri, created on behalf of the Baxi and Srivastava families to honour the union of two families and celebrate their shared connection to culture, heritage, and one another.",

      "At the heart of the project was storytelling, with every element carrying a story that brought together tradition, personal memories, taste, and contemporary sensibilities. A total of 100 hampers were personally curated and prepared with meticulous care and supervision. Sustainability was integral to their making: every element was chosen to have a life beyond the wedding, with the jars, table mats, and brocade cloth pieces designed for continued use and still being used in the households today.",

      "From the iconic Motichoor Laddoos of Bahadura Sweets, Gwalior, and artisanal Coconut Laddoos handmade by Dr. Urvashi Garud, to Ragi Ribbons, Gujarati Chakli, traditional Chooris, and playful facts about the couple, every element invited guests to discover, share, and celebrate.",

      "The hampers also featured bronzeware filled with golden rice, symbolising prosperity and abundance, alongside spice blends sourced from Khari Baoli, creating an experience that engaged the senses through flavour, fragrance, texture, and memory.",

      "Distributed on 12 February 2024 in Gurugram during the two-day wedding celebrations, the hampers were warmly received and became a talking point during and after the wedding. Such was their popularity that select hampers were even transported to Bengaluru for close friends and family who could not attend.",
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
    description: [
      "The launch of The Winds Will Blow on 29 December 2024 at Golf Links Community Centre, New Delhi, brought together over 150 friends and family members to celebrate Reva ji’s vivacity, warmth, and remarkable presence. A personally signed copy by Reva ji, accompanied by a specially designed Family Script bookmark, was shared with every guest.",

      "The evening featured an intimate conversation between Reva ji and Family Script Director Meenakshi Dubey, along with reflections by Saurav and Geetanjali on their experience of creating the book. Their stories brought the making of the book alive for everyone present.",

      "What began as a documentation project grew into a relationship shaped by warmth, trust, and meaningful conversations. The book now marks the first chapter of a larger family archive for the Khanna–Mehta–Chopra household.",
    ],
  },

  {
    slug: "my-scribbles-launch",
    title: "My Scribbles Launch",
    coverImage: "/assets/PROJECTS/events/my-scribbles-launch/cover.png",
    images: [
      "/assets/PROJECTS/events/my-scribbles-launch/1.png",
      "/assets/PROJECTS/events/my-scribbles-launch/2.png",
      "/assets/PROJECTS/events/my-scribbles-launch/3.png",
      "/assets/PROJECTS/events/my-scribbles-launch/4.png",
    ],
    description: [
      "A year-long life-writing project culminated in a 450+ page volume bringing together material memories, poetry, journal excerpts, anecdotes, and reflections from Renu ji’s life. The book embraced the organic, meandering nature of memory, shaped through an intensive and collaborative process of revisiting archives and photographs.",

      "Unveiled on 10 May 2025 at Renu ji’s home in Golf Links, New Delhi, the gathering brought together close family and friends. The book was released by Renu ji’s husband Mr. Lalit Mehra. A conversation between Renu ji and Family Script offered guests a glimpse into the book’s conception, process and making. Children, grandchildren and friends shared warm anecdotes and memories of significant moments spent with her, creating a nostalgic and deeply emotional evening of storytelling and celebration, followed by a shared meal. More than 35 copies were distributed among those present.",
    ],
  },

  {
    slug: "grit-and-grace",
    title: "Grit and Grace Launch",
    coverImage: "/assets/PROJECTS/events/grit-and-grace-launch/cover.png",
    images: [
      "/assets/PROJECTS/events/grit-and-grace-launch/1.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/2.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/3.png",
      "/assets/PROJECTS/events/grit-and-grace-launch/4.png",
    ],
    description: [
      "The book was launched on 1 March 2026 at Digamber Jain Mandir, Lodi Colony, Delhi, in the august presence of over 200 guests. His Holiness Jain Guru Shri Pragya Sagar Ji Maharaj released the book and spoke of the importance of preserving family stories, drawing upon Sudha ji’s remarkable life and achievements. He also specially appreciated Family Script and its entire team for their work in documenting lives and legacies.",

      "For us, the launch marked the culmination of a year-long journey of oral history, archival research, photographs and memories. Sudha ji, Ritu ji and the entire family shared this deeply personal milestone with friends and extended family. The occasion was also covered by Jinvani TV.",
    ],
  },

  {
    slug: "dcwa",
    title: "International Diplomatic Community Bazaar organized by DCWA",
    coverImage: "/assets/PROJECTS/events/dcwa/cover.jpg",
    images: [
      "/assets/PROJECTS/events/dcwa/1.jpeg",
      "/assets/PROJECTS/events/dcwa/2.jpeg",
      "/assets/PROJECTS/events/dcwa/3.jpeg",
      "/assets/PROJECTS/events/dcwa/4.jpeg",
    ],
    description: [
      "Family Script was invited to participate in the International Diplomatic Community Bazaar, organised by the Delhi Commonwealth Women’s Association (DCWA) on 3 February 2024.",

      "The event offered an opportunity to present our rich portfolio and introduce the idea of Family Script to a diverse audience. Visitors from India and several countries across the world stopped by the stall, engaging with our work and warmly appreciating the idea of documenting personal and family histories.",

      "The bazaar also marked a special beginning for Family Script, as several conversations initiated there laid the foundations for projects that followed soon after, as people encountered and connected with our work. Our small interactive activity, inviting visitors to imagine the title of their own life story, became a memorable way of opening conversations around memory and legacy.",

      "The event significantly expanded our circle of ‘Friends of Family Script’ and opened new possibilities for collaboration and exploration.",
    ],
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return events.find((event) => event.slug === slug);
}