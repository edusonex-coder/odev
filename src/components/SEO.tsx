import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
}

const SEO = ({ title, description }: SEOProps) => {
    useEffect(() => {
        document.title = `${title} | OdevGPT - Yapay Zeka Destekli Ders Asistanı`;

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
    }, [title, description]);

    return null; // This component doesn't render anything
};

export default SEO;
