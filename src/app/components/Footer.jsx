import { MapPin, Mail, Phone, Link } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row md:justify-between gap-10">
          <div>
            <h3 className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide mb-4">
              <MapPin size={14} className="text-secondary-500 -mt-0.5" />
              Adres
            </h3>
            <div className="text-neutral-400 text-xs font-light leading-relaxed space-y-1">
              <p>Yıldız Teknik Üniversitesi</p>
              <p>Matematik Mühendisliği Bölümü</p>
              <p>Davutpaşa Kampüsü</p>
              <p>34220 Esenler, İstanbul</p>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide mb-4">
              <Mail size={14} className="text-secondary-500 -mt-0.5" />
              İletişim
            </h3>
            <div className="text-neutral-400 text-xs font-light space-y-3">
              <a href="mailto:mtmblm@yildiz.edu.tr" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={14} className="shrink-0" />
                mtmblm@yildiz.edu.tr
              </a>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                +90 (212) 383 45 90 (Bölüm Başkanlığı)
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                +90 (212) 383 45 92 (Bölüm Öğrenci İşleri)
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                +90 (212) 383 45 91 (Bölüm Sekreterliği)
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide mb-4">
              <Link size={14} className="text-secondary-500 -mt-0.5" />
              Bağlantılar
            </h3>
            <div className="text-neutral-400 text-xs font-light space-y-3">
              <a href="https://www.yildiz.edu.tr" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                YTÜ Ana Sayfa
              </a>
              <a href="https://kmf.yildiz.edu.tr" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                Kimya-Metalurji Fakültesi
              </a>
              <a href="https://ois.yildiz.edu.tr" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                Öğrenci İşleri
              </a>
              <a href="https://kutuphane.yildiz.edu.tr" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                Kütüphane
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-neutral-500 text-xs">
          © {new Date().getFullYear()} Yıldız Teknik Üniversitesi · Matematik Mühendisliği Bölümü
        </div>
      </div>
    </footer>   
  );
}