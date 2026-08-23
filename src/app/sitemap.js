import { SITE_URL } from "./layout";
import { getAllNewsSlugs, getAllSlugs } from "@/data/content";
import { getCourseCodes } from "@/data/curriculum";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/duyurular", priority: 0.9, changeFrequency: "daily" },
  { path: "/haberler", priority: 0.7, changeFrequency: "weekly" },
  { path: "/bolum/hakkinda", priority: 0.6, changeFrequency: "monthly" },
  { path: "/bolum/yonetim-kurullar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/bolum/komisyonlar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/personel", priority: 0.6, changeFrequency: "monthly" },
  { path: "/egitim/mufredat", priority: 0.8, changeFrequency: "monthly" },
  { path: "/egitim/ders-programi", priority: 0.6, changeFrequency: "weekly" },
  { path: "/egitim/lisansustu-ders-programi", priority: 0.5, changeFrequency: "weekly" },
  { path: "/egitim/programlar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/egitim/staj", priority: 0.7, changeFrequency: "monthly" },
  { path: "/egitim/yaz-okulu", priority: 0.4, changeFrequency: "monthly" },
  { path: "/egitim/formlar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/arge/laboratuvarlar", priority: 0.3, changeFrequency: "yearly" },
  { path: "/arge/projeler", priority: 0.3, changeFrequency: "yearly" },
  { path: "/arge/bilgi-kaynaklari", priority: 0.4, changeFrequency: "monthly" },
  { path: "/dis-iliskiler/erasmus", priority: 0.5, changeFrequency: "monthly" },
];

export default async function sitemap() {
  const [slugs, newsSlugs, courseCodes] = await Promise.all([
    getAllSlugs(),
    getAllNewsSlugs(),
    getCourseCodes(),
  ]);

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));

  const announcementEntries = slugs.map((slug) => ({
    url: `${SITE_URL}/duyurular/${slug}`,
    changeFrequency: "never",
    priority: 0.4,
  }));

  const newsEntries = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/haberler/${slug}`,
    changeFrequency: "never",
    priority: 0.4,
  }));

  const courseEntries = courseCodes.map((code) => ({
    url: `${SITE_URL}/egitim/mufredat/${code}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticEntries, ...announcementEntries, ...newsEntries, ...courseEntries];
}
