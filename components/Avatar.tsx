import React from 'react';

interface AvatarProps {
    name: string;
    imageUrl?: string;
    size: string;
    onClick: (e: React.MouseEvent) => void;
}
const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = `24px`, onClick }) => {

    const avatarStyle = {
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
    };

    return (
        <div
            style={avatarStyle}
            title={name}
            onClick={onClick}
            aria-label={name}
            role="button"
            className="flex items-center justify-center text-white font-bold border border-gray-300 shadow-sm bg-gray-400"
            onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.8';
            }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                <span>{name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );

}

export default Avatar;