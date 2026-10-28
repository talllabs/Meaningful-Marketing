/* Every photo and film on the KC Brown pages comes from this one list.
   Photos load straight from KC's site (kenchrisbrown.com) and films from Vimeo.
   Film stills are fetched from Vimeo automatically, so a film only needs its link.

   hero:      the big opening image.
   backups:   a photo to show instead if one of the links above ever fails
              (the LinkedIn banner link expires, so it has one).
   reel:      the film that plays from the "Watch the reel" button.
   tileFilms: films looping in four of the collage tiles the opening image shrinks into.
   tiles:     photos for the other four collage tiles.
   editorial: the big photos between sections: What I do, the About band,
              the full-screen quote, and the band above Contact.
   featured:  the curated showcase (the first is the big one).
   more:      the rest of KC's films, in the archive below the showcase. */
(() => {
  const sq = (path, size) =>
    `https://images.squarespace-cdn.com/content/v1/530d82afe4b0e5f490d7e8e8/${path}?format=${size || "1000w"}`;

  window.KC_MEDIA = {
    hero: sq("1552282700523-J6X9A3QWSF4VGPR5JAUF/IMG_5892.JPG", "2500w"),
    backups: {
      hero: sq("1566279623266-VI13OJH7IAUUC0E5WLPX/DSC02171.jpg", "2500w"),
      "editorial.0": sq("1398888498264-R37YPHUS75RQM6CH35ML/IMG_8930.jpg", "1500w")
    },
    reel: "https://vimeo.com/354113974",

    // the four big collage tiles play these films; the other four show photos
    tileFilms: [
      "https://vimeo.com/430135095",
      "https://vimeo.com/866610422",
      "https://vimeo.com/257223094",
      "https://vimeo.com/136686992"
    ],

    tiles: [
      sq("1394402715996-O9CU6LM5N3LBY37JO1S3/0001390-R2-051-24.jpg"),
      sq("1394595768995-TIP75E78LFGBEKQDE2F3/TOMS_RoastingCo_Bag_Front_Wood.jpg"),
      sq("1552278951387-U5N9AAAWF5R2GTHF4ULK/L1186111.jpg"),
      sq("1394402716683-UXQQWGM8RAZVAELH63ZA/0001390-R3-011-4.jpg")
    ],

    editorial: [
      "https://media.licdn.com/dms/image/v2/D5616AQFvR57FSP0yEg/profile-displaybackgroundimage-shrink_200_800/B56ZdRoCUEGoAU-/0/1749421140675?e=1795046400&v=beta&t=qXPi4hBg339aPgkOF3uL08w4ULaCQZAOyJjx_SI1NhA",
      sq("1552282837220-A7Z5UN1YL0F1MS5ZWVX3/L1000659.JPG", "1000w"),
      sq("1394402868561-M93HYZISWD89SNHK7Z1B/Patrick+Torres+Wright-1.jpg", "2500w"),
      sq("1439958245699-OIYL3ASWB1V2ZP7U89FR/IMG_0438-2.jpg", "2500w")
    ],

    featured: [
      { title: "Giving Manifesto", watch: "https://vimeo.com/354113974" },
      { title: "South Shore Drill Team", watch: "https://vimeo.com/293594624" },
      { title: "Madefor - Why It Works", watch: "https://vimeo.com/508261807" },
      { title: "Every Little Color", watch: "https://vimeo.com/430135095" },
      { title: "Magic Bus", watch: "https://vimeo.com/866610422" },
      { title: "Every Mother Counts", watch: "https://vimeo.com/136686992" },
      { title: "Clare V", watch: "https://vimeo.com/257223094" }
    ],

    more: [
      { title: "The Venice Collection", watch: "https://vimeo.com/256491859" },
      { title: "Animal Act", watch: "https://vimeo.com/232832117" },
      { title: "Pit Stop", watch: "https://vimeo.com/354114160" },
      { title: "Shoe Box Office", watch: "https://vimeo.com/174456782" },
      { title: "Camp TOMS", watch: "https://vimeo.com/85489219" },
      { title: "Apple Watch Band", watch: "https://vimeo.com/196013297" },
      { title: "South Shore Drill Team - Jashon", watch: "https://vimeo.com/293608639" },
      { title: "SideChef - Step Into The Kitchen", watch: "https://vimeo.com/146186425" },
      { title: "TRVL LITE", watch: "https://vimeo.com/258905646" },
      { title: "Rodney Lucas for TRVL LITE", watch: "https://vimeo.com/293605988" },
      { title: "Roll N Peace", watch: "https://vimeo.com/354114238" },
      { title: "Stand For Tomorrow", watch: "https://vimeo.com/322411122" },
      { title: "shuberX", watch: "https://vimeo.com/90921291" },
      { title: "Your Next Big Step", watch: "https://vimeo.com/85491292" },
      { title: "Spring/Summer '17", watch: "https://vimeo.com/174457691" },
      { title: "James Petry - TOMS MoBro", watch: "https://vimeo.com/85491656" },
      { title: "TOMS Holiday Cheer", watch: "https://vimeo.com/119200524" },
      { title: "TOMS Internship Program", watch: "https://vimeo.com/86629417" },
      { title: "Ben Affleck & ECI - TOMS Friends", watch: "https://vimeo.com/87644824" },
      { title: "Stand Up", watch: "https://vimeo.com/174458983" },
      { title: "Virtual Try On", watch: "https://vimeo.com/87743879" },
      { title: "Corporate International Incorporated", watch: "https://vimeo.com/87946399" },
      { title: "Spaceboy vs The House Warden", watch: "https://vimeo.com/3744527" }
    ]
  };
})();
