"use client";

import WeeklySchedule from "@/app/[locale]/egitim/components/WeeklySchedule";

export default function StaffSchedule({ entries }) {
  return (
    <WeeklySchedule
      entries={entries}
      courseHref={(code) => `/egitim/mufredat/${code}`}
    />
  );
}
