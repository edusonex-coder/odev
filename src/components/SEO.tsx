import { useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface SEOProps {
    title: string;
    description?: string;
}

const SEO = ({ title, description }: SEOProps) => {
    const { tenant } = useTenant();

    useEffect(() => {
        const baseTitle = tenant ? tenant.name : "OdevGPT";
        document.title = `${title} | ${baseTitle}`;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (description) {
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [title, description, tenant]);

    return null; // This component doesn't render anything
};

export default SEO;
