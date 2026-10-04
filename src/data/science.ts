export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  description: string;
}
export const SOURCES: Source[] = [
  {
    id: "challenge",
    title: "Build a Junior Astronaut Mission Trainer",
    publisher: "NASA Space Apps",
    url: "https://www.spaceappschallenge.org/2026/challenges/build-a-junior-astronaut-mission-trainer/",
    description:
      "The 2026 challenge: make the engineering trade-offs of a lunar or Martian outpost tangible and fun.",
  },
  {
    id: "eclss",
    title: "Environmental Control and Life Support Systems",
    publisher: "NASA",
    url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/",
    description:
      "How oxygen generation, air revitalization, and water recovery work together.",
  },
  {
    id: "water",
    title: "NASA achieves 98% water recovery",
    publisher: "NASA",
    url: "https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/",
    description:
      "The brine processor helped demonstrate 98% water recovery aboard the space station.",
  },
  {
    id: "plants",
    title: "Growing Plants in Space",
    publisher: "NASA",
    url: "https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/",
    description:
      "Plant growth chambers need controlled light, water, nutrients, and air.",
  },
  {
    id: "veggie",
    title: "VEGGIE: a garden in orbit",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/mission/veggie/",
    description:
      "Fresh vegetables supplement astronaut meals and support well-being.",
  },
  {
    id: "plant-challenges",
    title: "The Challenges of Growing Plants in Space",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/biological-physical/the-challenges-of-growing-plants-in-space/",
    description:
      "Why resource delivery and environmental control matter for space crops.",
  },
  {
    id: "moon",
    title: "Moon Facts",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/moon/facts/",
    description:
      "An unbreathable exosphere, weak magnetic protection, and a long lunar solar day.",
  },
  {
    id: "mars",
    title: "Mars Facts",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/mars/facts/",
    description:
      "A cold, dusty world with a thin atmosphere and a 24.6-hour sol.",
  },
  {
    id: "polar",
    title: "Shadows near the Moon’s South Pole",
    publisher: "NASA Science / SVS",
    url: "https://science.nasa.gov/resource/shadows-near-the-moons-south-pole/",
    description:
      "Low-angle sunlight and terrain cause long shadows at the lunar poles.",
  },
  {
    id: "radiation",
    title: "Protecting astronauts from radiation at the Moon",
    publisher: "NASA Science",
    url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/",
    description:
      "Solar-particle events make sheltered, well-shielded spaces essential.",
  },
  {
    id: "cosmic",
    title: "Space radiation and human exploration",
    publisher: "NASA",
    url: "https://www.nasa.gov/humans-in-space/space-radiation-wont-stop-nasas-human-exploration/",
    description:
      "Cosmic rays and solar particles present different shielding challenges.",
  },
  {
    id: "dust",
    title: "Opportunity hunkers down during a dust storm",
    publisher: "NASA JPL",
    url: "https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/",
    description:
      "Dust blocked sunlight and left the rover short of solar power.",
  },
  {
    id: "fission",
    title: "Fission Surface Power",
    publisher: "NASA",
    url: "https://www.nasa.gov/exploration-systems-development-mission-directorate/fission-surface-power/",
    description:
      "An alternative source of steady power that does not depend on sunlight.",
  },
  {
    id: "moxie",
    title: "MOXIE completes its Mars mission",
    publisher: "NASA JPL",
    url: "https://www.jpl.nasa.gov/news/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/",
    description:
      "An experiment demonstrated making oxygen from Mars’ carbon dioxide atmosphere.",
  },
];
export const sourceFor = (id: string) => SOURCES.find((s) => s.id === id)!;
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: "power" | "oxygen" | "water" | "food" | "shield" | "planet";
  content: string;
  connection: string;
  sources: string[];
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  discussion: string;
}
export const LESSONS: Lesson[] = [
  {
    id: "power",
    title: "Sunshine is a resource.",
    subtitle: "Power & resilience",
    icon: "power",
    content:
      "Solar panels turn sunlight into electricity. At the Moon’s poles, nearby ridges can cast long shadows. On Mars, dust can block the Sun. Batteries store energy for these gaps; they do not create it. NASA is also developing surface fission power that can work without sunlight.",
    connection:
      "Watch generation and demand separately. Adding a battery increases storage; adding an array increases generation. Shade lasts two scripted turns in your mission.",
    sources: ["polar", "dust", "fission"],
    question:
      "Your base has empty batteries and too little generation. Which upgrade produces new energy?",
    answers: ["A battery bank", "A solar array in sunlight", "A storm shelter"],
    correct: 1,
    explanation:
      "An illuminated solar array generates energy. A battery only stores energy supplied by another source.",
    discussion:
      "Compare two bases: many solar arrays with a battery, versus fewer arrays with a reactor. Which is better during a dust storm? What do they cost?",
  },
  {
    id: "oxygen",
    title: "Take a deep breath.",
    subtitle: "Life support",
    icon: "oxygen",
    content:
      "A habitat needs breathable air, pressure control, and carbon dioxide removal. NASA’s oxygen generation system splits water into oxygen and hydrogen using electricity. On Mars, MOXIE demonstrated another route: extracting oxygen from carbon dioxide in the atmosphere.",
    connection:
      "Your electrolyzer uses water and power. A fictional Mars oxygen lab uses power without draining water, but only works on Mars.",
    sources: ["eclss", "moxie"],
    question:
      "Your oxygen machine has enough electricity but no water. What happens to its water-based oxygen production?",
    answers: ["It doubles", "It continues normally", "It stops"],
    correct: 2,
    explanation:
      "Electrolysis requires both water and electricity. Extra power cannot replace the missing input.",
    discussion:
      "Why might making oxygen from the Martian atmosphere be useful? Why would the same machine fail on the Moon?",
  },
  {
    id: "water",
    title: "Every drop comes back.",
    subtitle: "Water & recycling",
    icon: "water",
    content:
      "Space-station equipment collects water from sources such as humidity and wastewater, then purifies it. NASA demonstrated 98% total recovery using a brine processor. Recycling greatly reduces resupply needs, but the equipment still needs maintenance and energy.",
    connection:
      "A recycler returns some crew water. It cannot create extra water, and it slows down during a power shortage. The fictional game rate is different from the real ISS system.",
    sources: ["water", "eclss"],
    question: "What is the best reason to install a water recycler?",
    answers: [
      "It reduces water lost from the system",
      "It produces unlimited free water",
      "It works without electricity",
    ],
    correct: 0,
    explanation:
      "Recovery reuses water that would otherwise be lost. It does not make water from nothing.",
    discussion:
      "Trace a drop from a crew member to the recycler and then to a plant or oxygen generator. Where can the loop lose water?",
  },
  {
    id: "food",
    title: "A garden, a world away.",
    subtitle: "Food production",
    icon: "food",
    content:
      "NASA’s Veggie system grows vegetables in orbit. Plants need suitable light, water, nutrients, air, and controlled conditions. Fresh crops supplement stored meals. They do not instantly make an entire astronaut diet self-sufficient.",
    connection:
      "New greenhouses need two game turns to mature, and still draw water and power while growing. Real crops take much longer; time is compressed here to show the trade-off.",
    sources: ["plants", "veggie", "plant-challenges"],
    question:
      "You build a greenhouse. What should you check before expecting more food?",
    answers: [
      "Only the number of crew",
      "Water, power, and growing time",
      "Only whether the Sun looks bright",
    ],
    correct: 1,
    explanation:
      "The garden needs water and powered environmental control, plus time for crops to develop.",
    discussion:
      "Add a greenhouse and compare the forecast before and after. Why can solving a food problem create a water problem?",
  },
  {
    id: "shield",
    title: "Sometimes, stay inside.",
    subtitle: "Radiation & shielding",
    icon: "shield",
    content:
      "Outside Earth’s magnetic protection, astronauts face solar particles and galactic cosmic rays. A sheltered area with extra shielding can reduce exposure during a solar particle event. NASA discusses using supplies, water, and lunar regolith as shielding; cosmic rays remain a difficult problem.",
    connection:
      "Build a shelter before the scripted solar event. Keeping the crew indoors adds protection, while continuing an expedition increases the modeled impact. Health here is a game score, not radiation dose.",
    sources: ["radiation", "cosmic"],
    question:
      "A solar particle event is approaching. Which plan best reduces crew exposure?",
    answers: [
      "Send a longer rover expedition",
      "Ignore the forecast",
      "Move the crew into a shielded shelter",
    ],
    correct: 2,
    explanation:
      "Shelter combines shielding with reduced time outside. It reduces risk but does not make radiation disappear.",
    discussion:
      "Would you trade science points for crew safety? Compare the health forecast for the four daily plans during the event.",
  },
  {
    id: "planet",
    title: "Same crew. Different world.",
    subtitle: "Moon & Mars",
    icon: "planet",
    content:
      "The Moon has a very thin, unbreathable exosphere and a solar day of about 29.5 Earth days. Mars has a thin atmosphere and a sol of about 24.6 hours. A base needs life support on either world, but the local environment changes its engineering choices.",
    connection:
      "Moon turns are Earth days at a fictional polar ridge. Mars turns are sols. This game’s solar rates and weather dates are authored teaching settings, not forecasts for a real location.",
    sources: ["moon", "mars", "polar"],
    question: "What does one turn in the lunar mission represent?",
    answers: [
      "An Earth day at a fictional polar site",
      "A complete 29.5-day lunar solar cycle",
      "A Martian sol",
    ],
    correct: 0,
    explanation:
      "One Moon turn is one Earth day. The ridge-shadow event is terrain shading, not a daily lunar sunset.",
    discussion:
      "Play the same build strategy on both worlds. Which resource becomes more difficult to manage on Mars?",
  },
];
