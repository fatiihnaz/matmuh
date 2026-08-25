import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function MainCard({ title, buttonTitle, href, prefetch, action, children, dark }) {
    return (
        <div className={`rounded-xl border border-primary-500/10 shadow-xs w-full overflow-hidden ${dark ? "bg-primary-500" : "bg-white"}`}>
            <div className="p-5 sm:p-6">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-secondary-500 rounded-full" />

                        <h2 className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-white" : "text-primary-700"}`}>
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {action}
                        {buttonTitle && href && (
                            <Link href={href} prefetch={prefetch} className="group text-xs text-secondary-700 hover:text-secondary-700 flex items-center gap-1 transition-colors">
                                {buttonTitle}
                                <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
};
