"use client";

import { useState } from "react";
import { Menu, X, Home, BrainCircuit, BarChart3, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: Home },
  { name: "การทำนายผล", href: "/supervised", icon: BrainCircuit },
  { name: "การจัดกลุ่มลูกค้า", href: "/unsupervised", icon: BarChart3 },
  { name: "ข้อมูลเชิงลึก", href: "/insights", icon: Lightbulb },
];

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-rose-100 bg-white/80 backdrop-blur-md px-6 sticky top-0 z-40">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-teal-400">
          Kiyora
        </span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white px-6 py-8 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-10">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-teal-400">
              Kiyora Dashboard
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    isActive
                      ? "bg-rose-50 text-rose-500 shadow-sm"
                      : "text-slate-500 hover:bg-rose-50/50",
                    "flex items-center gap-x-4 rounded-2xl p-4 text-lg font-bold transition-all"
                  )}
                >
                  <item.icon className={cn(isActive ? "text-rose-500" : "text-slate-400", "h-6 w-6")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-10 left-6 right-6">
            <div className="rounded-3xl bg-teal-400/10 p-6 border border-teal-100">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Version 1.0.0</p>
              <p className="mt-1 text-base font-bold text-teal-800">Kiyora Brand Analysis</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
