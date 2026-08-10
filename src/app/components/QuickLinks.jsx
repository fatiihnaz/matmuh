import Link from "next/link";
import { ExternalLink } from "lucide-react";
import MainCard from "./MainCard";
import { quickLinks } from "@/data/landing";

function QuickLinkTile({ link }) {
  const className = "flex flex-col items-center gap-2 min-w-18 shrink-0 group";
  const content = (
    <>
      <div className="w-10 h-10 rounded-xl bg-secondary-500/8 hover:bg-secondary-600/10 flex items-center justify-center">
        <link.icon className="w-4.5 h-4.5 text-secondary-500 group-hover:text-secondary-600" />
      </div>
      <span className="text-[9px] text-primary-500/50 text-center group-hover:text-primary-500 leading-tight">
        {link.shortLabel}
      </span>
    </>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

function QuickLinkRow({ link }) {
  const className = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors";
  const content = (
    <>
      <link.icon className="w-4 h-4 text-primary-500/60 shrink-0" />
      <span className="flex-1">{link.label}</span>
      {link.external && <ExternalLink className="w-3 h-3 text-primary-500/30 shrink-0" />}
    </>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export default function QuickLinks() {
  return (
    <>
      <div className="lg:hidden bg-white rounded-xl shadow-sm p-4">
        <div className="flex overflow-x-auto no-scrollbar pb-1">
          <div className="flex gap-2 mx-auto">
            {quickLinks.map((link) => (
              <QuickLinkTile key={link.label} link={link} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <MainCard title="Hızlı Erişim">
          <nav className="space-y-1">
            {quickLinks.map((link) => (
              <QuickLinkRow key={link.label} link={link} />
            ))}
          </nav>
        </MainCard>
      </div>
    </>
  );
}
