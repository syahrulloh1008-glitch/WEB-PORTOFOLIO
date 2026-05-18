const accentSet = {
  cyan: { accent: "#00FFFF", accentRgb: "0,255,255" },
  purple: { accent: "#A855F7", accentRgb: "168,85,247" },
  pink: { accent: "#FF00FF", accentRgb: "255,0,255" },
  green: { accent: "#00FF88", accentRgb: "0,255,136" },
  yellow: { accent: "#FFD43B", accentRgb: "255,212,59" },
};

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const whatsappLink = (phone, message = "Halo, saya ingin menghubungi tim portfolio.") =>
  `https://wa.me/62${phone.replace(/^0/, "")}?text=${encodeURIComponent(message)}`;

export const groupInfo = {
  title: "WEB PORTOFOLIO",
  groupName: "Kelompok Tim 7",
  tagline: "Website portfolio kelompok bertema cyberpunk untuk menampilkan identitas, keahlian, sertifikat, dan karya anggota.",
  school: {
    name: "SMK SURABAYA",
    program: "Teknik Komputer dan Jaringan",
    description:
      "Kami adalah kelompok siswa yang berfokus pada praktik IT support, jaringan komputer, instalasi sistem operasi, service perangkat, dan pengembangan web sebagai media dokumentasi karya.",
  },
  identity: [
    { label: "ANGGOTA", value: "4" },
    { label: "PROGRAM", value: "TKJ / IT SUPPORT" },
    { label: "FOKUS", value: "NETWORK + WEB" },
    { label: "STATUS", value: "READY" },
  ],
  contact: {
    representative: "Syahrulloh",
    email: "syahrulloh1008-glitch@users.noreply.github.com",
    whatsapp: "083848904397",
  },
};

export const teamMembers = [
  {
    id: "syahrulloh",
    name: "Syahrulloh",
    role: "IT Support & Network Practice",
    classInfo: "Kelas 11 TKJ 1",
    photoUrl: assetPath("profiles/syahrulloh.jpg"),
    skills: ["Praktik jaringan LAN", "Instalasi sistem operasi", "Web portfolio"],
    whatsapp: "083848904397",
    instagram: "https://www.instagram.com/syhrullllllllll_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/syahrulloh1008-glitch",
    cv: assetPath("cv/syahrulloh-cv.txt"),
    ...accentSet.cyan,
  },
  {
    id: "moch-rofiq",
    name: "Moch. Rofiq",
    role: "IT Support & Network Technician",
    classInfo: "Kelas 11 TKJ 1",
    photoUrl: assetPath("profiles/rofiq.jpg"),
    skills: ["Crimping kabel LAN", "Instalasi sistem operasi", "Mikrotik dan switch"],
    whatsapp: "083812378082",
    instagram: "https://www.instagram.com/zrofeq/?hl=enutm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/rofeqz",
    cv: assetPath("cv/rofiq-cv.txt"),
    ...accentSet.purple,
  },
  {
    id: "randy-aryasadewa",
    name: "Randy Aryasadewa",
    role: "Computer Service Technician",
    classInfo: "Kelas 11 TKJ 1",
    photoUrl: assetPath("profiles/randy.jpg"),
    skills: ["Cleaning laptop", "Instalasi sistem operasi", "Sambung kabel"],
    whatsapp: "088901904469",
    instagram: "https://www.instagram.com/randysadewaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    github: "https://github.com/randysadewaaa",
    cv: assetPath("cv/randy-cv.txt"),
    ...accentSet.pink,
  },
  {
    id: "rafiki-nugraha",
    name: "Rafiki Nugraha",
    role: "Network Technician",
    classInfo: "Kelas 11 TKJ 1",
    photoUrl: assetPath("profiles/rafiki.jpg"),
    skills: ["Crimping LAN", "Instalasi sistem operasi", "Setting Mikrotik"],
    whatsapp: "085648475611",
    instagram: "https://www.instagram.com/nugraharafiki/?utm_source=ig_web_button_share_sheet",
    github: "https://github.com/RafikiNugraha",
    cv: assetPath("cv/rafiki-cv.txt"),
    ...accentSet.green,
  },
];

export const certificates = [
  {
    title: "Magang PKL sebagai IT Support",
    owner: "Syahrulloh",
    issuer: "Program Praktik Kerja Lapangan",
    year: "2026",
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80",
    ...accentSet.cyan,
  },
  {
    title: "Magang PKL sebagai IT Support",
    owner: "Moch. Rofiq",
    issuer: "Program Praktik Kerja Lapangan",
    year: "2026",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80",
    ...accentSet.purple,
  },
  {
    title: "Sertifikat PKL di Service Komputer",
    owner: "Randy Aryasadewa",
    issuer: "Program Praktik Kerja Lapangan",
    year: "2026",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
    ...accentSet.pink,
  },
  {
    title: "Sertifikat PKL di KOMINFO",
    owner: "Rafiki Nugraha",
    issuer: "Program Praktik Kerja Lapangan",
    year: "2026",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80",
    ...accentSet.green,
  },
];

export const projects = [
  {
    title: "WEB PORTOFOLIO KELOMPOK",
    owner: "Kelompok Tim 7",
    desc: "Website portfolio kelompok dengan tema cyberpunk, profil anggota, sertifikat, karya, dan kontak perwakilan.",
    tech: ["React", "Vite", "GitHub Pages"],
    github: "https://github.com/syahrulloh1008-glitch/WEB-PORTOFOLIO",
    status: "LIVE",
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80",
    ...accentSet.cyan,
  },
  {
    title: "SERVICE LAPTOP LOG",
    owner: "Randy Aryasadewa",
    desc: "Dokumentasi pekerjaan service laptop, cleaning perangkat, instalasi sistem operasi, dan pengecekan dasar hardware.",
    tech: ["Hardware", "Windows", "Maintenance"],
    github: "https://github.com/randysadewaaa",
    status: "DOCS",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
    ...accentSet.pink,
  },
  {
    title: "NETWORK PRACTICE NOTE",
    owner: "Moch. Rofiq",
    desc: "Catatan praktik crimping kabel LAN, konfigurasi perangkat jaringan, dan pengenalan Mikrotik serta switch.",
    tech: ["LAN", "Mikrotik", "Switch"],
    github: "https://github.com/rofeqz",
    status: "ARCHIVE",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    ...accentSet.purple,
  },
  {
    title: "MIKROTIK BASIC CONFIG",
    owner: "Rafiki Nugraha",
    desc: "Dokumentasi konfigurasi dasar Mikrotik, penyambungan kabel, instalasi sistem operasi, dan praktik troubleshooting jaringan.",
    tech: ["Mikrotik", "Networking", "OS Install"],
    github: "https://github.com/RafikiNugraha",
    status: "PRACTICE",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    ...accentSet.green,
  },
];
