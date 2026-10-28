/* Every photo and film on the KC Brown pages comes from this one list.
   Paste a link between the quotes and the page picks it up. Anything left
   empty shows a tinted frame with its label until the real media arrives.

   hero:   the film that opens full screen. An .mp4 link plays best;
           a Vimeo link (https://vimeo.com/123456) works too.
   poster: a still from that film, shown while it loads.
   tiles:  eight photos the film shrinks into as you scroll.
   work:   one strong image per campaign, in page order.
   films:  the video showcase. "watch" is the Vimeo or YouTube link,
           "still" is the image on the card. The first film is featured.
   portrait: KC's photo for the About section. */
window.KC_MEDIA = {
  hero: "",
  poster: "",
  tiles: ["", "", "", "", "", "", "", ""],
  work: {
    toms: "",
    k12: "",
    widdyup: ""
  },
  films: [
    { title: "Camp TOMS", client: "TOMS", role: "Director, editor", watch: "", still: "" },
    { title: "Your Next Big Step", client: "TOMS", role: "Creative direction", watch: "", still: "" },
    { title: "Celebrating 25 Years", client: "K12", role: "Head of Video", watch: "", still: "" },
    { title: "Presenting WiddyUP", client: "WiddyUP", role: "Creative Director", watch: "", still: "" },
    { title: "Film title to confirm", client: "Madefor", role: "Content Director", watch: "", still: "" }
  ],
  portrait: ""
};
