import { ChevronRight } from "lucide-react";

export default function MainCard({ title, icon: Icon, buttonTitle, href, children, dark }) {
    return (
        <div className={`rounded-xl border border-primary-500/10 shadow-xs w-full overflow-hidden ${dark ? "bg-primary-500" : "bg-white"}`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-secondary-500 rounded-full" />

                        <h2 className={`text-xs font-semibold uppercase tracking-widest flex items-center gap-2 ${dark ? "text-white" : "text-primary-700"}`}>
                            {title}
                            {Icon && <Icon className="w-4 h-4 text-secondary-400" />}
                        </h2>
                    </div>

                    {buttonTitle && (
                        <a href={href || "#"} className="group text-xs text-secondary-500 hover:text-secondary-600 flex items-center gap-1 transition-colors">
                            {buttonTitle}
                            <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                        </a>
                    )}
                </div>

                <div className="space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
};
