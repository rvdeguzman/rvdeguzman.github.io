export interface Photo {
  src: string;
  title: string;
  note: string;
  alt: string;
  objectPosition?: string;
}

// Resized copies live in /public/img/roll (up to 1000px, q80).
export const photos: Photo[] = [
  {
    src: "/img/roll/desk-lamp.jpg",
    title: "the setup",
    note: "most of my hours spent here",
    alt: "A warmly lit desk with an adjustable lamp, monitor, split keyboard, and laptops",
  },
  {
    src: "/img/roll/candle-perfumes.jpg",
    title: "after hours",
    note: "chrome & warmth",
    alt: "A lit candle and perfume bottles above silver watches, jewelry, and a Fujifilm camera on a tray",
    objectPosition: "center bottom",
  },
  {
    src: "/img/roll/city-light.jpg",
    title: "golden hour",
    note: "urban reflections",
    alt: "Low sunlight reflecting off tall buildings above a city street",
  },
  {
    src: "/img/roll/watch-rotation.jpg",
    title: "the rotation",
    note: "timepieces",
    alt: "Three silver Casio and Seiko watches beside glasses on a green cutting mat",
  },
  {
    src: "/img/roll/camera-break.jpg",
    title: "kyoto",
    note: "camera & a cold drink",
    alt: "A Fujifilm X100VI camera and an iced green drink on a table",
  },
  {
    src: "/img/roll/reading-desk.jpg",
    title: "reading corner",
    note: "e-ink for tired eyes",
    alt: "A wooden reading stand holding an e-ink tablet and phone above a split keyboard and cutting mat",
  },
  {
    src: "/img/roll/mazda-taillights.jpg",
    title: "rear view",
    note: "mzd3",
    alt: "The rear of a dark Mazda with round taillights, a turbo badge, and clouds reflected in the glass",
  },
  {
    src: "/img/roll/barbatos.jpg",
    title: "barbatos",
    note: "the faustian bargain",
    alt: "A white, red, and blue Barbatos model holding a large sword on a desk in front of a code editor",
  },
  {
    src: "/img/roll/red-gunpla.jpg",
    title: "darilbalde",
    note: "gunpla is fun <3",
    alt: "A red Darilbalde model posed with green blades on a cutting mat in front of its assembly instructions",
  },

];
