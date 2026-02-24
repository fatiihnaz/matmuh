import { Award, Target, Lightbulb, TrendingUp, Globe, BookOpen, Cpu, BarChart3, Shield, Atom } from "lucide-react";

// çalışma alanları için kullanılacak
const workingAreas = [
  { label: "Veri Bilimi", icon: BarChart3, size: "lg" },
  { label: "Yapay Zeka", icon: Cpu, size: "lg" },
  { label: "Optimizasyon", icon: Target, size: "lg" },
  { label: "Finans Matematiği", icon: TrendingUp, size: "md" },
  { label: "Kriptografi", icon: Shield, size: "md" },
  { label: "Stokastik Süreçler", icon: Lightbulb, size: "md" },
  { label: "Nümerik Analiz", icon: BookOpen, size: "md" },
  { label: "Diferansiyel Denklemler", icon: Award, size: "md" },
  { label: "İstatistik", icon: BarChart3, size: "md" }, 
  { label: "Topoloji", icon: Atom, size: "sm" },
  { label: "Cebirsel Geometri", icon: Globe, size: "sm" },
  { label: "Kombinatorik", icon: Atom, size: "sm" },
];

// kilometre taşları için kullanılacak
const milestones = [
  { year: "1911", event: "Kondüktör Mekteb-i Âlîsi'nin Kurulması" },
  { year: "1982", event: "Yıldız Üniversitesi Adını Alması ve Bölümün Modern Yapılanması" },
  { year: "1992", event: "Kimya-Metalürji Fakültesi Bünyesine Geçiş ve Akademik Genişleme" },
  { year: "2011", event: "Hesaplamalı Bilim ve Mühendislik Lisansüstü Programının Açılması" },
  { year: "2020", event: "MÜDEK ve EUR-ACE Uluslararası Mühendislik Akreditasyonunun Alınması" },
  { year: "2026", event: "YTÜ Cosmos T1 Modeli Çıkışı ve Çok Disiplinli Yapay Zeka Vizyonu" },
];


const keyMetrics = [            
  { id: "kurulus", value: "1976", label: "Kuruluş", sub: "Matematik Müh." },
  { id: "deneyim", value: "50", label: "Yıllık Deneyim", sub: "Akademik Birikim" },
  { id: "mezun", value: "1892", label: "Lisans Mezunu", sub: "Güçlü Mezun Ağı" },
  { id: "doluluk", value: "%100", label: "Doluluk Oranı", sub: "YKS Tercih Performansı" }
];

const academicStats = [
  { id: "ogretimuye", value: "27", label: "Öğretim Üyesi"},
  { id: "lisansogr", value: "650+", label: "Lisans Öğrencisi"},
  { id: "ylisansogr", value: "50+", label: "Yüksek Lisans Öğrencisi"},
  { id: "arsgor", value: "6", label: "Araştırma Görevlisi"},
  { id: "laboratuvar", value: "290 m2", label: "Laboratuvar Alanı"},
  { id: "tercihendeks", value: "65.4", label: "İşveren Tercih Endeksi"},
];

export default function DepartmentInfo() {
    return (
        <main className="w-full flex-1 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
                {keyMetrics.map((stat) => (
                    <div key={stat.id} className="flex flex-col rounded-xl p-6 bg-white rounded-xl shadow-sm shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="font-mono font-semibold text-2xl">{stat.value}</div>
                    <div className="text-secondary-500 text-sm">{stat.label}</div>
                    <div className="text-xs text-primary-500/40">{stat.sub}</div>
                    </div>
                ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 grid-flow-row lg:grid-flow-col gap-6">
                    <div key="misyon" className="rounded-xl p-6 bg-white rounded-xl shadow-sm shadow-black/10">
                        <div className="flex flex-col w-full">
                            <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                            <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider font-sans">
                                Misyon & Vizyon
                            </h3>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8 w-full">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                <Target className="size-6 text-secondary-500"/>
                                <span className="font-semibold text-sm text-primary-500">Misyon</span>
                                </div>
                                <p className="text-sm text-primary-500/60">Matematiksel düşünce ve mühendislik yaklaşımını birleştirerek, toplumun ve endüstrinin ihtiyaç duyduğu nitelikli bilim insanları ve mühendisler yetiştirmek; evrensel bilime katkıda bulunmak.</p>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="size-6 text-secondary-500"/>
                                <span className="font-semibold text-sm text-primary-500">Vizyon</span>
                                </div>
                                <p className="text-sm text-primary-500/60">Matematik mühendisliği alanında ulusal ve uluslararası düzeyde öncü, yenilikçi araştırmalarıyla tanınan, tercih edilen bir bölüm olmak.</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div key="calisma" className="rounded-xl bg-white rounded-xl shadow-sm shadow-black/10 overflow-hidden">
                        <div className="p-6 pb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                            <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider font-sans">
                            Çalışma Alanları
                            </h3>
                        </div>
                        </div>

                        <div className="bg-primary-500 p-8">
                        <p className="text-sm text-white/80 font-sans mb-2">
                            Çalışma alanları.
                        </p>
                        
                        <div className="flex items-baseline space-x-2">
                            <span className="font-mono text-5xl font-bold text-white tracking-tighter">
                            69.67
                            </span>
                            <span className="font-mono text-xl text-primary-300"> 
                            / 100
                            </span>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <span className="text-xs font-medium text-secondary-400 bg-secondary-400/10 px-2 py-1 rounded">
                            Gerçek veriye dayanmaktadır.
                            </span>
                        </div>
                        </div>
                    </div>
                    <div key="arastirma" className="rounded-xl p-6 bg-white rounded-xl shadow-sm shadow-black/10">
                        <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                            <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider font-sans">
                                Araştırma Alanları
                            </h3>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div key="kilometretasi" className="rounded-xl p-6 bg-white rounded-xl shadow-sm shadow-black/10">
                        <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                            <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider font-sans">
                                Kilometre Taşları
                            </h3>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div key="akreditasyon" className="rounded-xl p-6 bg-white rounded-xl shadow-sm shadow-black/10">
                        <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-5">
                            <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                            <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider font-sans">
                                Akreditasyon
                            </h3>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div key="statlar" className="rounded-xl p-6 bg-primary-500 shadow-sm shadow-black/10">
                        <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-5 rounded-full bg-secondary-500"/>
                        <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-sans">
                            Sayılarla Bölüm
                        </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                        {academicStats.map((stat) => (
                            <div key={stat.id} className="flex flex-col">
                            <div className="font-mono text-secondary-500 font-semibold text-2xl leading-none">
                                {stat.value}
                            </div>
                            <div className="text-white/40 text-xs mt-1 tracking-tight">
                                {stat.label}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}