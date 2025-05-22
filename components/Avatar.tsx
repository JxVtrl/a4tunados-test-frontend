import React from 'react';

interface AvatarProps {
    name: string;
    imageUrl: string;
    size: number;
    onClick: () =>  React.MouseEvent<Element, MouseEvent>
        
}
const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size, onClick }) => {

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
        />
    );

}

export default Avatar;