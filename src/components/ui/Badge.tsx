import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
const tones = { green:"bg-[#e8f6eb] text-[#307545]", amber:"bg-[#fff2ca] text-[#805c00]", red:"bg-[#fde9e5] text-[#a44b39]", blue:"bg-[#e8f0ff] text-[#466aa9]", gray:"bg-black/[.055] text-black/55" };
export function Badge({children,tone="gray"}:{children:ReactNode;tone?:keyof typeof tones}) { return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold",tones[tone])}>{children}</span>; }
