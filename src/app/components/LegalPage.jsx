"use client";

import { EditableRegion } from "inscribed";

import SubHeader from "@/app/components/Header/SubHeader";
import PageLayout from "@/app/components/PageLayout";
import MainCard from "@/app/components/MainCard";
import Panel from "@/app/components/Panel";
import NewTabHint from "@/app/components/NewTabHint";
import { ExternalLink } from "lucide-react";

const YTU_SOURCES = [
  {
    href: "https://yildiz.edu.tr/universite/hukuksal-metinler/kvkk-aydinlatma-metni",
    label: "KVKK Aydınlatma Metni",
  },
  { href: "https://yildiz.edu.tr/gizlilik", label: "Gizlilik" },
  { href: "https://yildiz.edu.tr/cerezler", label: "Çerezler" },
];

function Sources() {
  return (
    <MainCard title="Üniversite Metinleri">
      <nav className="flex flex-col">
        {YTU_SOURCES.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors"
          >
            <span className="flex-1">{label}</span>
            <ExternalLink className="w-3 h-3 shrink-0 text-primary-500/70" />
            <NewTabHint />
          </a>
        ))}
      </nav>
    </MainCard>
  );
}

export default function LegalPage({ title, subtitle, body }) {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue={title}
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue={subtitle}
          />
        }
      />
      <PageLayout sidebar={<Sources />}>
        <Panel padding="p-5 sm:p-8">
          <div className="announcement-body max-w-prose text-[13px] leading-relaxed text-primary-500/70">
            <EditableRegion
              blockPath="page.body"
              blockType="RichText"
              defaultValue={body}
            />
          </div>
          <p className="mt-8 border-t border-primary-500/8 pt-4 text-[11px] text-primary-500/70">
            <EditableRegion
              blockPath="page.updated"
              blockType="ShortText"
              defaultValue=""
            />
          </p>
        </Panel>
      </PageLayout>
    </>
  );
}
