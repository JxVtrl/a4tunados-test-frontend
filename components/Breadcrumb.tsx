import React from 'react';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
    label: string;
    href?: string; // Se não tiver href, é o último (ativo)
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showBack?: boolean; // Se quiser mostrar botão de voltar
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    const router = useRouter();

    return (
        <nav className="mb-4 text-sm text-gray-600 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">

            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span>/</span>}
                    {item.href ? (
                        <button
                            className="hover:underline"
                            onClick={() => router.push(item.href!)}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="font-semibold truncate">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;