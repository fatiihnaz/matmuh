"use client";

import { EditableList, EditableRegion } from "inscribed";

import CartesianField from "./CartesianField";
import CreditCard from "./CreditCard";

const CELLS = [
  {
    place: "lg:col-start-1 lg:row-start-1 lg:justify-self-end lg:self-end",
    coord: "−, +",
    mark: "lg:left-auto lg:right-3 lg:top-auto lg:bottom-3",
  },
  {
    place: "lg:col-start-2 lg:row-start-1 lg:justify-self-start lg:self-end",
    coord: "+, +",
    mark: "lg:right-auto lg:left-3 lg:top-auto lg:bottom-3",
  },
  {
    place: "lg:col-start-1 lg:row-start-2 lg:justify-self-end lg:self-start",
    coord: "−, −",
    mark: "lg:left-auto lg:right-3",
  },
  {
    place: "lg:col-start-2 lg:row-start-2 lg:justify-self-start lg:self-start",
    coord: "+, −",
    mark: "lg:right-auto lg:left-3",
  },
];

export default function CreditsBoard() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--header-h))] w-full flex-col items-center overflow-hidden bg-primary-500 px-4 py-16">
      <div className="relative z-10 shrink-0 text-center">
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
        <EditableRegion
          blockPath="credits.intro"
          blockType="LongText"
          defaultValue=""
          as="p"
          className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-neutral-500 empty:hidden"
        />
      </div>

      {/* Duzlem yalniz kartlari sariyor. Boylece eksenlerin merkezi izgaranin
          merkeziyle ayni yere dusuyor ve baslik hicbir ekran boyunda kartlarla
          cakisamiyor — bolumun ortasina cizilen bir eksende ikisi kaciniimaz
          sekilde birbirine giriyordu. */}
      {/* Bosluk dolgu degil kenar bosluğu: `CartesianField` `inset-0` ile bu kutuyu
          kapliyor, dolgu kullanilsa eksenler dolgu dahil ortalanir ve izgaradan
          yarim dolgu kadar yukarida kalirdi. */}
      <div className="relative flex w-full flex-1 items-center justify-center mt-10 lg:mt-14">
        <CartesianField />

        <EditableList
          blockPath="credits.people"
          as="div"
          className="relative z-10 grid w-full max-w-4xl grid-cols-1 justify-items-center gap-6 lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-28 lg:gap-y-24"
          style={{ display: "grid" }}
          itemSchema={{
            name: { blockType: "ShortText", defaultValue: "" },
            role: { blockType: "ShortText", defaultValue: "" },
            photo: { blockType: "Image", defaultValue: null },
            github: { blockType: "Link", defaultValue: { href: "", label: "" } },
            linkedin: { blockType: "Link", defaultValue: { href: "", label: "" } },
            site: { blockType: "Link", defaultValue: { href: "", label: "" } },
            mail: { blockType: "Link", defaultValue: { href: "", label: "" } },
          }}
          defaultValue={[
            { name: "Kaan Necip Kalp", role: "Frontend & Tasarım", photo: null },
            { name: "Egehan", role: "Veri Katmanı & CMS", photo: null },
            { name: "Yusuf Acımacı", role: "Backend", photo: null },
            { name: "Fatih Naz", role: "İçerik Yönetim Sistemi", photo: null },
          ]}
        >
          {(person, index) => {
            const cell = CELLS[index] ?? CELLS[0];
            return (
              <div key={index} className={`flex w-full justify-center ${cell.place}`}>
                <CreditCard
                  person={person}
                  idx={index}
                  coord={cell.coord}
                  markClassName={cell.mark}
                />
              </div>
            );
          }}
        </EditableList>
      </div>
    </section>
  );
}
