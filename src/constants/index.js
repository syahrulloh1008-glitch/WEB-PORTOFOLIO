const accentSet = {
  cyan: { accent: "#00FFFF", accentRgb: "0,255,255" },
  purple: { accent: "#A855F7", accentRgb: "168,85,247" },
  pink: { accent: "#FF00FF", accentRgb: "255,0,255" },
  green: { accent: "#00FF88", accentRgb: "0,255,136" },
  yellow: { accent: "#FFD43B", accentRgb: "255,212,59" },
};

const projectRepo = "https://github.com/syahrulloh1008-glitch/WEB-PORTOFOLIO.git";
const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const whatsappLink = (phone, message = "Halo, saya ingin menghubungi kamu lewat portfolio.") =>
  `https://wa.me/62${phone.replace(/^0/, "")}?text=${encodeURIComponent(message)}`;

const buildSkillGroups = (skills) => [
  {
    id: "core-skills",
    label: "SKILL MATRIX",
    icon: "SKL",
    ...accentSet.cyan,
    skills,
  },
];

const buildExperiences = (items) =>
  items.map((item, index) => ({
    period: "ACHIEVEMENT",
    company: "Portfolio Record",
    location: "Indonesia",
    tags: ["Experience", "Achievement"],
    ...item,
    ...[accentSet.cyan, accentSet.purple, accentSet.pink, accentSet.green][index % 4],
  }));

const buildProjects = (name) => [
  {
    title: "WEB PORTOFOLIO",
    subtitle: `${name} Personal Portfolio`,
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
    desc: "Website portfolio kelompok dengan konsep cyberpunk, selector profil anggota, skill matrix, project archive, sertifikat, dan kontak aktif.",
    tech: ["React", "Vite", "GitHub"],
    demo: projectRepo,
    github: projectRepo,
    status: "LIVE",
    ...accentSet.cyan,
  },
];

const buildCertificates = (title) => [
  {
    title,
    subtitle: "Program Praktik Kerja Lapangan",
    issuer: "PKL / Internship",
    year: "2026",
    id: "PKL-CERT",
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80",
    ...accentSet.yellow,
  },
];

const buildStats = (skills, experiences) => [
  { label: "SKILLS", value: `${skills.length}`, accent: "#00FFFF" },
  { label: "EXPERIENCE", value: `${experiences.length}`, accent: "#A855F7" },
  { label: "PROJECT", value: "1", accent: "#FF00FF" },
  { label: "CONTACT", value: "READY", accent: "#00FF88" },
];

const createProfile = ({ id, name, shortName, role, location, about, photoUrl, skills, experiences, certificate, whatsapp, instagram, github }) => ({
  id,
  name,
  shortName,
  role,
  location,
  email: "-",
  status: "Siap dihubungi untuk kolaborasi dan informasi portfolio.",
  about,
  intro: about,
  photoUrl,
  whatsapp,
  instagram,
  github,
  contacts: {
    whatsapp,
    instagram,
    github,
  },
  socials: [
    { label: "GITHUB", href: github || "#", type: "github" },
    { label: "WHATSAPP", href: whatsappLink(whatsapp, `Halo ${name}, saya melihat portfolio kamu.`), type: "whatsapp" },
    { label: "INSTAGRAM", href: instagram || "#", type: "instagram" },
  ],
  skills: buildSkillGroups(skills),
  stats: buildStats(skills, experiences),
  experiences: buildExperiences(experiences),
  projects: buildProjects(name),
  certificates: buildCertificates(certificate),
});

export const profiles = [
  createProfile({
    id: "syahrulloh",
    name: "Syahrulloh",
    shortName: "Syahrulloh",
    role: "IT Support & Network Practice",
    location: "Indonesia",
    about: "Berfokus pada praktik jaringan LAN, instalasi sistem operasi, dan pengembangan web portfolio.",
    photoUrl: assetPath("profiles/syahrulloh.jpg"),
    skills: [
      { name: "Praktik jaringan LAN", level: 75 },
      { name: "Instalasi sistem operasi", level: 99 },
    ],
    experiences: [
      { role: "Juara Lomba Tahfidz", desc: "Meraih prestasi dalam lomba tahfidz." },
      { role: "Juara Lomba Baca Kitab Kuning", desc: "Meraih prestasi dalam lomba baca kitab kuning." },
      { role: "Cerdas Cermat", desc: "Berpengalaman mengikuti kompetisi cerdas cermat." },
    ],
    certificate: "Magang PKL sebagai IT Support",
    whatsapp: "083848904397",
    instagram: "https://www.instagram.com/syhrullllllllll_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/syahrulloh1008-glitch",
  }),
  createProfile({
    id: "moch-rofiq",
    name: "Moch.Rofiq",
    shortName: "Rofiq",
    role: "IT Support & Network Technician",
    location: "Indonesia",
    about: "Berfokus pada crimping kabel LAN, instalasi sistem operasi, serta penguasaan Mikrotik dan switch.",
    photoUrl: assetPath("profiles/rofiq.jpg"),
    skills: [
      { name: "Crimping kabel LAN", level: 80 },
      { name: "Instalasi sistem operasi", level: 75 },
      { name: "Penguasaan Mikrotik dan switch", level: 80 },
    ],
    experiences: [
      { role: "Perakitan PC", desc: "Berpengalaman merakit PC dan menyiapkan perangkat komputer." },
    ],
    certificate: "Magang PKL sebagai IT Support",
    whatsapp: "083812378082",
    instagram: "https://www.instagram.com/zrofeq/?hl=enutm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/rofeqz",
  }),
  createProfile({
    id: "randy-aryasadewa",
    name: "Randy Aryasadewa",
    shortName: "Randy",
    role: "Computer Service Technician",
    location: "Indonesia",
    about: "Berfokus pada service laptop, cleaning laptop, instalasi sistem operasi, dan penyambungan kabel.",
    photoUrl: assetPath("profiles/randy.jpg"),
    skills: [
      { name: "Cleaning laptop", level: 50 },
      { name: "Instalasi sistem operasi", level: 50 },
      { name: "Sambung kabel", level: 50 },
    ],
    experiences: [
      { role: "Service Laptop", desc: "Berpengalaman melakukan service dan perawatan laptop." },
    ],
    certificate: "Sertifikat PKL di service komputer",
    whatsapp: "088901904469",
    instagram: "https://www.instagram.com/randysadewaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/randysadewaaa",
  }),
  createProfile({
    id: "rafiki-nugraha",
    name: "Rafiki Nugraha",
    shortName: "Rafiki",
    role: "Network Technician",
    location: "Indonesia",
    about: "Berfokus pada crimping LAN, instalasi sistem operasi, sambung kabel, dan setting Mikrotik.",
    photoUrl: assetPath("profiles/rafiki.jpg"),
    skills: [
      { name: "Crimping LAN", level: 100 },
      { name: "Instalasi sistem operasi", level: 75 },
      { name: "Sambung kabel", level: 80 },
    ],
    experiences: [
      { role: "Setting Mikrotik", desc: "Berpengalaman melakukan konfigurasi dasar Mikrotik." },
    ],
    certificate: "Sertifikat PKL di KOMINFO",
    whatsapp: "085648475611",
    instagram: "https://www.instagram.com/nugraharafiki/?utm_source=ig_web_button_share_sheet",
    github: "https://github.com/RafikiNugraha",
  }),
];

export const defaultProfile = profiles[0];
export { whatsappLink };
