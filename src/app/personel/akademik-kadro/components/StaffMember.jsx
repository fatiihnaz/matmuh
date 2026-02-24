import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';

const StaffMember = ({ member, idx, bgColors }) => {
    const getInitials = (name) => {
        const parts = name.split(' ').filter(Boolean);
        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(member.name);
    const emailNick = member.email.split('@')[0];
    const avesisUrl = `https://avesis.yildiz.edu.tr/${emailNick}`;

    const fullDisplayName = `${member.rank} ${member.name}`;
    
    return (
    <div
        className="group cursor-pointer rounded-xl p-5 bg-white shadow-sm shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
        <div className="flex flex-col items-center text-center">
        <div
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: bgColors[idx % bgColors.length] }}
        >
            <span className="font-sans text-base font-semibold tracking-wider text-secondary-500">
            {initials}
            </span>
        </div>

        <div className="font-sans text-sm font-semibold text-primary-500 leading-tight transition-colors duration-200 group-hover:text-secondary-500">
            {fullDisplayName}
        </div>

        <div className="mt-1 pt-1 font-sans text-xs text-primary-500/60 leading-tight transition-colors duration-200 group-hover:text-secondary-500">
            Telefon: {member.phone}
        </div>

        <div className="mt-1 pt-1 border-t border-white/10">
            <span className="text-xs font-medium text-secondary-400 bg-secondary-400/10 px-2 py-1 rounded-md">
                Oda: {member.room}
            </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
            <a
            href={`mailto:${member.email}`}
            className="rounded-md p-1.5 text-primary-500/30 transition-all duration-200 hover:bg-secondary-500/10 hover:text-secondary-500"
            title="E-posta"
            >
            <Mail size={14} strokeWidth={1.8} />
            </a>
            <a
            href={avesisUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-primary-500/30 transition-all duration-200 hover:bg-secondary-500/10 hover:text-secondary-500"
            title="AVESIS"
            >
            <ExternalLink size={14} strokeWidth={1.8} />
            </a>
        </div>
        </div>
    </div>
    );
};

export default StaffMember;