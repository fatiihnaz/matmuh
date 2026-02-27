import Link from "next/link";
import Landing from "./components/Landing";
import MainCard from "./components/MainCard";
import { quickLinks, announcements, news, seminars } from "@/data/landing";
import { Bell, Newspaper, CalendarDays } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Landing />
      <div className="lg:hidden px-4 py-6 mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickLinks.map((link) => (
              <Link key={link.label} href={link.href} className="flex flex-col items-center gap-2 min-w-18 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-secondary-500/8 flex items-center justify-center">
                  <link.icon className="w-4.5 h-4.5 text-secondary-500" />
                </div>
                <span className="text-[9px] text-primary-500/50 text-center leading-tight">
                  {link.shortLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 lg:py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-68 shrink-0">
            <div className="sticky top-28">
              <MainCard title="Hızlı Erişim">
                <nav className="space-y-1">
                  {quickLinks.map((link) => (
                    <Link key={link.label} href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors"
                    >
                      <link.icon className="w-4 h-4 text-primary-500/60" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </MainCard>
            </div>
          </aside>

          <main className="flex-1 min-w-0 space-y-8">
            <MainCard title="Duyurular" icon={Bell} buttonTitle="Tümünü Gör" href="/duyurular">
              <div className="divide-y divide-gray-100">
                {announcements.map((item, index) => (
                  <a key={index} href="#" className="flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                    <div className="flex flex-col py-2 px-4 items-center justify-center min-w-12 bg-primary-500/3 border border-primary-500/6 rounded-lg">
                      <span className="text-xl font-bold text-primary-700 leading-tight">
                        {item.day}
                      </span>
                      <span className="text-xs font-medium text-secondary-500 uppercase">
                        {item.month}
                      </span>
                    </div>
                    <p className="text-sm text-primary-700">{item.title}</p>
                  </a>
                ))}
              </div>
            </MainCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MainCard title="Haberler ve Etkinlikler" icon={Newspaper} buttonTitle="Tümü" href="/haberler">
                <div className="space-y-6">
                  {news.map((item, index) => (
                    <a key={index} href="#" className="block group">
                      <p className="text-xs text-secondary-500 font-medium mb-1">
                        {item.date}
                      </p>
                      <h3 className="text-sm font-semibold text-primary-700 group-hover:text-secondary-500 transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </a>
                  ))}
                </div>
              </MainCard>

              <MainCard title="Araştırmalar" icon={CalendarDays} buttonTitle="Takvim" href="/arastirmalar">
                <div className="divide-y divide-gray-100">
                  {seminars.map((item, index) => (
                    <a key={index} href="#" className="flex items-start gap-4 py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex flex-col px-3 py-1 items-center justify-center min-w-12 bg-primary-500/3 border border-primary-500/6 rounded-lg">
                        <span className="text-xl font-bold text-primary-700 leading-tight">
                          {item.day}
                        </span>
                        <span className="text-xs font-medium text-secondary-500 uppercase">
                          {item.month}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-primary-700">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.speaker} · {item.time} · {item.location}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </MainCard>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}