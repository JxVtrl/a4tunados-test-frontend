import React from 'react';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
    label: string;
    href?: string; // Se não tiver href, é o último (ativo)
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showBack?: boolean; // Se quiser mostrar botão de voltar
    onClick?: (href: string) => void; // Nova prop opcional
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onClick }) => {
    const router = useRouter();

    return (
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 flex-wrap bg-white px-2 py-2 rounded shadow-sm border border-gray-100" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-gray-300">/</span>}
                    {item.href ? (
                        <button
                            className="hover:underline hover:text-gray-700 transition"
                            onClick={() => onClick ? onClick(item.href!) : router.push(item.href!)}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="font-semibold text-gray-700 truncate">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;