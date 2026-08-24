"use client";

import { EditableList, EditableRegion } from "inscribed";

import CartesianField from "./CartesianField";
import CreditCard from "./CreditCard";

const CELLS = [
  "lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:self-end",
  "lg:col-start-2 lg:row-start-1 lg:justify-self-start lg:self-end",
  "lg:col-start-1 lg:row-start-2 lg:justify-self-end lg:self-start",
  "lg:col-start-2 lg:row-start-2 lg:justify-self-start lg:self-start",
];

export default function CreditsBoard() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--header-h))] w-full flex-col items-center justify-center overflow-hidden bg-primary-500 px-4 py-16">
      <CartesianField />

      <div className="relative z-10 mb-10 text-center lg:mb-14">
        <EditableRegion
          blockPath="credits.title"
          blockType="ShortText"
          defaultValue="Emeği Geçenler"
          as="h1"
          className="text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl"
        />
        <EditableRegion
          blockPath="credits.subtitle"
          blockType="ShortText"
          defaultValue="Bu siteyi dört kişi yaptı"
          as="p"
          className="mt-2 text-[13px] text-neutral-400"
        />
      </div>

      <EditableList
        blockPath="credits.people"
        as="div"
        className="relative z-10 grid w-full max-w-4xl grid-cols-1 justify-items-center gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-28 lg:gap-y-24"
        style={{ display: "grid" }}
        itemSchema={{
          name: { blockType: "ShortText", defaultValue: "" },
          role: { blockType: "ShortText", defaultValue: "" },
          photo: { blockType: "Image", defaultValue: null },
          links: {
            blockType: "ObjectArray",
            defaultValue: [],
            itemSchema: {
              icon: { blockType: "ShortText", defaultValue: "github" },
              link: { blockType: "Link", defaultValue: { href: "", label: "" } },
            },
          },
        }}
        defaultValue={[
          { name: "Kaan Necip Kalp", role: "Frontend & Tasarım", photo: null, links: [] },
          { name: "Egehan", role: "Veri Katmanı & CMS", photo: null, links: [] },
          { name: "Yusuf Acımacı", role: "Backend", photo: null, links: [] },
          { name: "Fatih Naz", role: "İçerik Yönetim Sistemi", photo: null, links: [] },
        ]}
      >
        {(person, index) => (
          <div key={index} className={`flex w-full justify-center ${CELLS[index] ?? ""}`}>
            <CreditCard person={person} idx={index} />
          </div>
        )}
      </EditableList>
    </section>
  );
}
