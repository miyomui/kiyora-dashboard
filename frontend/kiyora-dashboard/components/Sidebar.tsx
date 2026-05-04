"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BarChart3, 
  BrainCircuit, 
  Lightbulb, 
  Users,
  Settings,
  ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: Home },
  { name: "การทำนายผล", href: "/supervised", icon: BrainCircuit },
  { name: "การจัดกลุ่มลูกค้า", href: "/unsupervised", icon: BarChart3 },
  { name: "ข้อมูลเชิงลึก", href: "/insights", icon: Lightbulb },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-rose-100 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-teal-400">
          Kiyora Dashboard
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-rose-50 text-rose-500"
                          : "text-slate-500 hover:text-rose-400 hover:bg-rose-50/50",
                        "group flex gap-x-3 rounded-2xl p-3 text-sm font-medium leading-6 transition-all duration-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-rose-500" : "text-slate-400 group-hover:text-rose-400",
                          "h-6 w-6 shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="rounded-3xl bg-teal-400/10 p-5 border border-teal-100">
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Version 1.0.0</p>
              <p className="mt-1 text-sm font-bold text-teal-800">Kiyora Brand Analysis</p>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
