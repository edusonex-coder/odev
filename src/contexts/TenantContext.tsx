import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

            try {
                let data: any = null;
                let error: any = null;

                // 1. Determine the slug or domain to query
                if (debugTenant) {
                    // Manual debug override via ?tenant=slug
                    const response = await supabase
                        .from('tenants')
                        .select('*')
                        .eq('slug', debugTenant)
                        .single();
                    data = response.data;
                    error = response.error;
                } else {
                    // Try exact domain match (e.g., isikdamper.online)
                    const response = await supabase
                        .from('tenants')
                        .select('*')
                        .eq('domain', hostname)
                        .single();
                    data = response.data;
                    error = response.error;

                    if (error || !data) {
                        // Fallback: Check subdomain for .edusonex.com.tr
                        const subdomain = hostname.split('.')[0];
                        if (subdomain && subdomain !== 'odev' && subdomain !== 'www') {
                            const subResponse = await supabase
                                .from('tenants')
                                .select('*')
                                .eq('slug', subdomain)
                                .single();
                            data = subResponse.data;
                            error = subResponse.error;
                        }
                    }
                }

                if (data && !error) {
                    const config: TenantConfig = {
                        ...data,
                        // Map database column names to existing interface names
                        custom_cto_name: data.cto_name,
                        custom_cto_note: data.cto_note,
                        custom_video_url: data.video_url,
                        custom_podcast_url: data.podcast_url,
                    };
                    applyTenantBranding(config);
                    setTenant(config);
                } else {
                    setTenant(null);
                }
            } catch (err) {
                console.error("Tenant resolution error:", err);
                setTenant(null);
            } finally {
                setIsLoading(false);
            }
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

        if (config.favicon_url) {
            const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            if (link) {
                link.href = config.favicon_url;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = config.favicon_url;
                document.head.appendChild(newLink);
            }
        }
    };

    return (
        <TenantContext.Provider value={{ tenant, isLoading }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
