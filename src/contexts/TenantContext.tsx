import React, { createContext, useContext, useEffect, useState } from 'react';

interface TenantConfig {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    primary_color?: string; // HSL format: "263 84% 50%"
    secondary_color?: string;
    favicon_url?: string;
    // White-labeling Overrides
    hide_universe_section?: boolean;
    hide_podcast_section?: boolean;
    hide_video_section?: boolean;
    video_position?: 'left' | 'right';
    dark_mode?: boolean;
    hero_style?: 'gradient' | 'industrial' | 'modern';
    custom_cto_name?: string;
    custom_cto_note?: string;
    custom_video_url?: string;
    custom_podcast_url?: string;
    support_email?: string;
}

interface TenantContextType {
    tenant: TenantConfig | null;
    isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({
    tenant: null,
    isLoading: true,
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tenant, setTenant] = useState<TenantConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const resolveTenant = async () => {
            const hostname = window.location.hostname;
            const searchParams = new URLSearchParams(window.location.search);
            const debugTenant = searchParams.get('tenant');

            // 1. Determine the slug
            let slug = '';
            if (debugTenant) {
                slug = debugTenant;
            } else if (hostname.includes('isikdamper.online')) {
                slug = 'isikdamper';
            } else if (hostname.includes('.edusonex.com.tr')) {
                slug = hostname.split('.')[0];
                if (slug === 'odev') slug = ''; // Default odev.edusonex.com.tr
            }

            if (!slug) {
                setTenant(null);
                setIsLoading(false);
                return;
            }

            // 2. Mock fetching from Supabase
            if (slug === 'odevkolej') {
                const config: TenantConfig = {
                    id: '1',
                    name: 'Odev Koleji',
                    slug: 'odevkolej',
                    logo_url: 'https://img.logoipsum.com/296.svg', // Example blue logo
                    primary_color: '210 100% 50%', // Mavi tema
                    secondary_color: '210 20% 96%',
                    hide_universe_section: true, // Edusonex Evreni gizle
                    hide_podcast_section: true,  // Edusonex podcast'ini gizle
                    custom_cto_name: 'Okul Koordinatörü',
                    custom_cto_note: 'Öğrencilerimizin başarısı için en modern yapay zeka araçlarını müfredatımıza entegre ettik. Bu platform sadece bir ödev aracı değil, dijital bir eğitim yol arkadaşıdır.',
                };
                applyTenantBranding(config);
                setTenant(config);
            } else if (slug === 'isikdamper') {
                const config: TenantConfig = {
                    id: '2',
                    name: 'IŞIK Akademi',
                    slug: 'isikdamper',
                    logo_url: 'https://img.logoipsum.com/280.svg',
                    primary_color: '24 95% 53%', // Canlı Turuncu
                    secondary_color: '240 10% 4%', // Çok Koyu Gri (Neredeyse Siyah)
                    dark_mode: true,
                    hero_style: 'industrial',
                    hide_universe_section: true,
                    hide_podcast_section: true,
                    hide_video_section: false, // Artık videomuzu göstereceğiz
                    video_position: 'right', // Videoyu sağa alalım
                    custom_video_url: 'https://youtu.be/y8mSVCdbAWE',
                    custom_cto_name: 'Akademi Müdürü',
                    custom_cto_note: 'IŞIK Akademi olarak, teknik becerilerinizi yapay zeka destekli eğitim araçlarıyla en üst seviyeye taşıyoruz.',
                };
                applyTenantBranding(config);
                setTenant(config);
            } else {
                setTenant(null);
            }
            setIsLoading(false);
        };

        resolveTenant();
    }, []);

    const applyTenantBranding = (config: TenantConfig) => {
        if (config.primary_color) {
            document.documentElement.style.setProperty('--primary', config.primary_color);
            document.documentElement.style.setProperty('--ring', config.primary_color);
        }

        // Handle Dark Mode
        if (config.dark_mode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        if (config.name) {
            document.title = `${config.name} | OdevGPT`;
        }
    };

    return (
        <TenantContext.Provider value={{ tenant, isLoading }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
