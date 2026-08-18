"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { segment: "", label: "개요" },
  { segment: "players", label: "참가자" },
  { segment: "leaderboard", label: "랭킹" },
  { segment: "sessions", label: "세션" },
  { segment: "settings", label: "설정" },
];

export function Sidebar({ roomId, roomName }: { roomId: number; roomName: string }) {
  const pathname = usePathname();
  const base = `/rooms/${roomId}`;
  return (
      <aside className="hidden w-56 shrink-0 border-r border-line bg-bg font-sans md:block">
        <div className="border-b border-line px-3 py-5">
          <Link href="/rooms" className="text-sm text-muted hover:text-text">← 그룹 목록</Link>
          <p className="mt-3 px-2 font-semibold leading-snug">{roomName}</p>
        </div>
        <nav className="p-2">
          {NAV.map((item) => {
            const href = item.segment ? `${base}/${item.segment}` : base;
            const active = item.segment ? pathname.startsWith(href) : pathname === base;
            return (
              <Link key={item.segment} href={href} className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${active ? "bg-raised font-medium text-text" : "text-muted hover:bg-raised/60 hover:text-text"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
  );
}
