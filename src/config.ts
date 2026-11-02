export const SITE = {
  website: "https://ianmattas.com",
  author: "Ian Mattas",
  profile: "https://ianmattas.com",
  desc: "Ian Mattas - cybersecurity student, CTF player, and security researcher writing about exploitation and OSINT.",
  title: "Ian Mattas",
  ogImage: "",
  lightAndDarkMode: false,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Caracas",
} as const;
