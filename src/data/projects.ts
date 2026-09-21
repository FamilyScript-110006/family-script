export type GalleryItem = {
  image: string;
};

export type Project = {
  slug: string;
  category: "biographical" | "institutional" | "events";

  title: string;
  subtitle: string;
  location?: string;

  description: string[];

  coverImage: string;
  bookImage: string;

  gallery: GalleryItem[];

  layout: "left" | "right";
};

export const projects: Project[] = [
  // =========================================================
  // 1. AKHIL BAKSHI
  // =========================================================

  {
    slug: "akhil-bakshi",
    category: "biographical",

    title: "HERE THERE & EVERYWHERE",
    subtitle: "AKHIL BAKSHI",

    location: "GURUGRAM, HARYANA",

    description: [
      "A legacy description in the form of a book that brought out the illustrious life of Mr Bakshi, his social contributions and countless expeditions.",

      "A 70th birthday gift, given warmly by a wife to her husband, the book captured the outline of Mr Bakshi’s profound life. He is a writer, avid traveller and the author of 27 books. As the founder of Nehra Yuva Kendra, he developed the institution into a youth movement and the largest grassroots organisation in the world.",

      "When FS entered the frame, a huge corpus of old photographs of his travels, letters and extensive work in the social sector surfaced that we worked with to curate a whole volume driven by clarity and precision. Emerging as a portrait in words, FS traced a life journey through multiple correspondences, oral history sessions and careful design ideation, ultimately unfolding into a cohesive narrative arc that stands as a reflection of challenges, adventures and a lifelong commitment to service and curiosity.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/cover.jpg",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/6.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/7.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/AKHIL BAKSHI/8.jpg",
      },
    ],

    layout: "right",
  },

  // =========================================================
  // 2. REVA KHANNA
  // =========================================================

  {
    slug: "reva-khanna",
    category: "biographical",

    title: "THE WINDS WILL BLOW",
    subtitle: "REVA KHANNA",

    location: "GOLF LINKS, NEW DELHI",

    description: [
      "A chronicle of her life defined by superhuman resilience and reconstructed through Material Memory.",

      "What unfolded here was a year of layered conversations, handwritten notes, fading photographs, memories of Partition and hours spent tracing the shape of a life lived with grace and strength- one that also carries the distinction of Reva Khanna being Delhi’s first female Chartered Accountant. She is also a highly regarded ex-president and continuing associate of Delhi Commonwealth Women’s Association.",

      "The book that emerged is a tribute to the human grit, where personal memory meets collective history. It stands as an archive of love, strength and belonging, created through collaboration, trust and an unwavering belief in the power of remembering together.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/cover.jpg",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/6.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/7.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/REVA KHANNA/8.jpg",
      },
    ],

    layout: "left",
  },

  // =========================================================
  // 3. DR. V K KUTTY
  // =========================================================

  {
    slug: "dr-v-k-kutty",
    category: "biographical",

    title: "NOOR: THE LIGHT THAT LEADS US",
    subtitle: "DR. V K KUTTY",

    location: "TIRUR, KERALA",

    description: [
      "A life steered by a profound spiritual compass and translated into a book and a documentary film. Our work on Dr. V. K. Kutty decodes what makes a person deeply loved and how a lasting legacy is formed. FS documented his life through the memories of people who knew him closely.",

      "He founded Dr Kutty Healthcare and his enduring influence lives on through his pioneering efforts in promoting preventive diagnosis through setting up the Nura Centre, in collaboration with Fujifilm, across the world.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/cover.jpg",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/6.jpeg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/7.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. V K KUTTY/cover.jpg",
      },
    ],

    layout: "right",
  },

  // =========================================================
  // 4. RENU MEHRA
  // =========================================================

  {
    slug: "renu-mehra",
    category: "biographical",

    title: "MY SCRIBBLES",
    subtitle: "RENU MEHRA",

    location: "GOLF LINKS, NEW DELHI",

    description: [
      "It began with a chance encounter at the DCWA’s Diplomatic Bazaar, where the team met Mrs. Renu Mehra, who describes the meeting as guided by the hand of God. What followed was a year-long journey through memory, unfolding through journals, photographs, poetry and clippings spanning generations.",

      "Family Script carefully digitized journals, restored photographs and recorded conversations, bringing together stories of Partition, displacement, resilience and renewal. The book evolved into a living document of a family’s journey through loss, laughter and legacy. Mrs. Mehra’s handwritten scribbles, raw, emotional and spontaneous, were preserved as part of the visual narrative. My Scribbles celebrates a life lived with depth, humour, wisdom and resilience, inviting readers to pause, remember and listen.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/6.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/7.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/RENU MEHRA/8.jpg",
      },
    ],

    layout: "left",
  },

  // =========================================================
  // 5. SUDHA GUPTA
  // =========================================================

  {
    slug: "sudha-gupta",
    category: "biographical",

    title: "GRIT AND GRACE",
    subtitle: "SUDHA GUPTA",

    location: "TUGHLAQ LANE, NEW DELHI",

    description: [
      "This project celebrated her journey of rebuilding a life of purpose. FS uncovered the emotional depth of her story, looking beyond the grand events to focus on the moments in between.",

      "It revealed the making of a matriarch and whose strength and values shaped her family and legacy. She was also amongst the first to establish a children’s clothing line in Delhi.",

      "This project celebrated her resilience and journey of rebuilding a life of purpose. FS uncovered the emotional depth of her story, looking beyond the grand events to focus on the moments in between.",

      "It revealed the making of a matriarch, whose strength, grace and enduring values shaped her family and legacy. She was also among the first to establish a children’s clothing line in Delhi.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/cover.jpg",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/4.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/5.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/6.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/7.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA GUPTA/cover.jpg",
      },
    ],

    layout: "right",
  },

  // =========================================================
  // 6. SUDHA RAINA
  // =========================================================

  {
    slug: "sudha-raina",
    category: "biographical",

    title: "A FAMILY THAT DREAMED OF RAJASTHAN",
    subtitle: "SUDHA RAINA",

    location: "JAIPUR, RAJASTHAN",

    description: [
      "A family’s story unfolded as a trilogy, where lived values become a lens into social and political history.",

      "Sudha Raina’s story is a living testament to values practiced, transmitted and sustained across generations.",

      "FS traced the legacies of old Kashmiri Pandits who had migrated to Rajasthan, contributed significantly to the Bhoodan Andolan and shaped modern Jaipur. FS identified key players and crafted a trilogy of family histories, heirlooms and culinary traditions.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/1.JPG",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/6.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/7.jpg",
      },
       {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SUDHA RAINA/8.png",
      },
    ],

    layout: "left",
  },

  // =========================================================
  // 7. VINOD KUMAR KHANNA
  // =========================================================

  {
    slug: "vinod-kumar-khanna",
    category: "biographical",

    title: "PORTRAIT OF A LEGACY",
    subtitle: "VINOD KUMAR KHANNA",

    location: "DEFENCE COLONY, NEW DELHI",

    description: [
      "Mr. Vinod Kumar Khanna’s life is a remarkable journey spanning decades, diverse domains, and geographies. His work has left a lasting imprint across regions, reflecting a life anchored in ambition, perseverance and humility. This biographical documentation project seeks to thoughtfully trace Mr. Khanna’s story, from his early life in undivided India and memories of Partition to the personal and professional achievements that shaped his worldview. Through intimate conversations, personal recollections and careful documentation, Family Script captures the experiences, influences, relationships and defining moments that shaped his journey. The story explores the decisions he stood by, the values he upheld and the convictions that guided him through challenges and triumphs. Together, these fragments will create a meaningful portrait of a life lived with purpose, resilience and enduring impact.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/3.jpeg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/4.jpeg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/5.jpeg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/6.jpeg",
      },
        {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/7.jpg",
      },
        {
        image: "/assets/PROJECTS/BIOGRAPHICAL/VINOD KUMAR KHANNA/8.jpeg",
      },
    ],

    layout: "right",
  },

  // =========================================================
  // 8. BELA DEVI
  // =========================================================

  {
    slug: "bela-devi",
    category: "biographical",

    title: "A LEGACY OF LOVE, LEARNING, AND QUIET STRENGTH",
    subtitle: "BELA DEVI",

    description: [
      "Some lives unfold like verses, serene, steady, and full of depth. This project began as a tribute to a woman whose strength shaped generations of her family. Born in the early 1900s, she lived through immense change while holding firmly to values of care, education, dignity, and equal opportunity. Her legacy of empowerment and resilience lived on through the memories of her children and grandchildren, across homes in Ghaziabad, Shahdara, and Hauz Qazi.",

      "Over twelve months, Family Script conducted in-depth oral interviews, documented archival photographs, gathered letters, and captured memories of everyday life. Through research, documentation, and thoughtful design, her story emerged as a memoir of devotion, motherhood, learning, and grace. This book is a quiet homage to a woman who transformed obstacles into lessons and lessons into love.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/4.JPG",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/5.JPG",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/6.JPG",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/7.JPG",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/BELA DEVI/8.png",
      },
    ],

    layout: "left",
  },

  // =========================================================
  // 9. SULAKHYANA PATTANAYAK
  // =========================================================

  {
    slug: "sulakhyana-pattanayak",
    category: "biographical",

    title: "A VOICE UNBOUND",
    subtitle: "SULAKHYANA PATTANAYAK",

    location: "BHUBHANESHWAR, ORISSA",

    description: [
      "In the lesser-known stories of individuals often lies the true essence of wisdom and resilience. This project documented the remarkable life of a woman whose journey spanned Odisha, Santiniketan, Pune and Mysore, each chapter reflecting grace, cultural richness and quiet strength. “Sangeet,” inherited through her maternal lineage, became both an anchor and an expression of her identity, shaping her home and those around her.",

      "Family Script began with intimate conversations and explored a rich collection of personal letters, archival photographs, handwritten notes and newspaper clippings. Interviews with loved ones revealed her curiosity, warmth and calm resolve. Through months of curation, transcription, writing and design, these fragments came together as a layered memoir of legacy, love, courage and enduring presence.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/book.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/4.png",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/5.png",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/6.png",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/7.png",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/SULAKHYANA PATTANAYAK/8.png",
      },
      
    ],

    layout: "right",
  },

  // =========================================================
  // 10. DR. K D BHARGAVA
  // =========================================================

  {
    slug: "dr-k-d-bhargava",
    category: "biographical",

    title: "TWIN FLAMES",
    subtitle: "DR. K D BHARGAVA",

    location: "NEW DELHI & AUSTRALIA",

    description: [
      "This tribute book brings together the poetry, memories and heartfelt messages of loved ones to honour a life shaped by medicine, mentoring, compassion and quiet reflection. His days were devoted to healing and teaching, while his handwritten poems offered intimate glimpses into his thoughts on life, sorrow, wonder and time. Those who knew him remember his gentle demeanor, thoughtful guidance and belief that healing begins with listening.",

      "Through the process of documentation, Family Script brought together the voices of family members, friends, colleagues and well-wishers, creating a collective portrait of a life deeply cherished. His handwritten poems, preserved in crumpled pages and ink-smudged papers, were carefully digitized and curated alongside photographs, memories and personal messages. The resulting volume is a deeply personal tribute, celebrating his enduring presence through poetry, remembrance, love and the voices of those whose lives he touched.",
    ],

    coverImage: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/cover.png",

    bookImage: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/main.png",

    gallery: [
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/1.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/2.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/3.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/4.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/5.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/6.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/7.jpg",
      },
      {
        image: "/assets/PROJECTS/BIOGRAPHICAL/DR. K D BHARGAVA/8.jpg",
      },
    ],

    layout: "left",
  },

  // =========================================================
  // 11. VASANT VALLEY SCHOOL
  // =========================================================

  {
    slug: "vasant-valley-school",
    category: "institutional",

    title: "MAKING OF AN INSTITUTION",
    subtitle: "VASANT VALLEY SCHOOL",

    location: "VASANT KUNJ, DELHI",

    description: [
      "Traced a journey of 35 years through spatial documentation, creating a documentary film and historicising institutional legacy in a book.",

      "What does it mean to tell the story of an institution, one shaped by an ideal built environment and layered through three decades of lived experience?",

      "FS set out to trace how people, places and pedagogies inform one another.",

      "FS engaged with the project through a multidisciplinary lens, drawing on insights from education theory, sociology and organizational studies.",

      "Through extensive archival research, oral history interviews and a close study of spatial and built environments, the team worked to convey the lived ethos of the school and its values, questions and quiet transformations.",
    ],

    coverImage:
      "/assets/projects/institutional/VASANT VALLEY SCHOOL.JPG",

    bookImage: "/assets/projects/institutional/vasant-valley-school/book.png",

    gallery: [
      {
        image: "/assets/projects/institutional/vasant-valley-school/1.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/2.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/3.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/4.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/5.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/6.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/7.jpg",
      },
      {
        image: "/assets/projects/institutional/vasant-valley-school/8.jpg",
      },
      
    ],

    layout: "right",
  },

  // =========================================================
  // 12. STAPATI ARCHITECTS
  // =========================================================

  {
    slug: "stapati-architects",
    category: "institutional",

    title: "PEOPLE PROJECTS PRACTICES",
    subtitle: "STAPATI ARCHITECTS",

    location: "CALICUT, KERALA",

    description: [
      "Story of the evolution of a design ecosystem, unveiled through over 60 oral history interviews, archiving documents and photographs.",

      "At the heart of Stapati were the people: the clients, the architects, the collaborators and well-wishers who shaped a living legacy built on partnership and perseverance.",

      "This was unearthed by FS, through intimate interviews and archival curation. Drawings, photographs and people's stories were woven with oral histories, allowing memory to guide the narrative through our “3 Ps” framework, which is People, Practice and Philosophy.",

      "Through extensive archival research, oral history interviews and a close study of spatial and built environments, the team worked to convey the lived ethos of the school and its values, questions and quiet transformations.",
    ],

    coverImage:
      "/assets/projects/institutional/STAPATI.jpg",

    bookImage: "/assets/projects/institutional/stapati-architects/book.png",

    gallery: [
      {
        image: "/assets/projects/institutional/stapati-architects/1.jpg",
      },
      {
        image: "/assets/projects/institutional/stapati-architects/2.jpg",
      },
      {
        image: "/assets/projects/institutional/stapati-architects/3.jpg",
      },
      {
        image: "/assets/projects/institutional/stapati-architects/4.jpg",
      },
      {
        image: "/assets/projects/institutional/stapati-architects/5.jpg",
      },
        {
        image: "/assets/projects/institutional/stapati-architects/6.jpg",
      },
        {
        image: "/assets/projects/institutional/stapati-architects/7.jpg",
      },
        {
        image: "/assets/projects/institutional/stapati-architects/8.jpg",
      },
    ],

    layout: "right",
  },
];
