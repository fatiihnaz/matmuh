import { ChevronRight } from "lucide-react";

export default function MainCard({ title, icon: Icon, buttonTitle, href, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-secondary-500 rounded-full" />

                    <h2 className="text-xs font-semibold text-primary-700 uppercase tracking-wide flex items-center gap-2">
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
    );
};