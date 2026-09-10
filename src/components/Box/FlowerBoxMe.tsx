type FlowerIconProps = {
    className?: string;
    image: string;
};

export default function FlowerBoxMe({ className, image }: FlowerIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>

                <clipPath id="flowerClip">
                    <path d="M12 22C13.5819 22 14.8778 20.7757 14.9918 19.223C16.1704 20.2403 17.9525 20.1896 19.0711 19.0711C20.1896 17.9525 20.2402 16.1705 19.2229 14.9918C20.7757 14.8778 22 13.5819 22 12C22 10.4181 20.7757 9.12224 19.223 9.00816C20.2403 7.82955 20.1896 6.04748 19.0711 4.92894C17.9525 3.81038 16.1705 3.75976 14.9918 4.77708C14.8778 3.22433 13.5819 2 12 2C10.4181 2 9.12224 3.22431 9.00816 4.77704C7.82955 3.75974 6.04749 3.81036 4.92894 4.92891C3.81038 6.04747 3.75977 7.82955 4.77708 9.00816C3.22433 9.12221 2 10.4181 2 12C2 13.5819 3.2243 14.8778 4.77703 14.9918C3.75974 16.1704 3.81037 17.9525 4.92891 19.0711C6.04747 20.1896 7.82955 20.2402 9.00816 19.2229C9.12221 20.7757 10.4181 22 12 22Z" />
                </clipPath>

                <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--lavender-purple-2)" />
                    <stop offset="50%" stopColor="var(--deep-lilac-2)" />
                    <stop offset="100%" stopColor="var(--deep-lilac-3)" />
                </linearGradient>

                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>


            <path
                fill="none"
                stroke="url(#flowerGradient)"
                filter="url(#neonGlow)"
                d="M12 22C13.5819 22 14.8778 20.7757 14.9918 19.223C16.1704 20.2403 17.9525 20.1896 19.0711 19.0711C20.1896 17.9525 20.2402 16.1705 19.2229 14.9918C20.7757 14.8778 22 13.5819 22 12C22 10.4181 20.7757 9.12224 19.223 9.00816C20.2403 7.82955 20.1896 6.04748 19.0711 4.92894C17.9525 3.81038 16.1705 3.75976 14.9918 4.77708C14.8778 3.22433 13.5819 2 12 2C10.4181 2 9.12224 3.22431 9.00816 4.77704C7.82955 3.75974 6.04749 3.81036 4.92894 4.92891C3.81038 6.04747 3.75977 7.82955 4.77708 9.00816C3.22433 9.12221 2 10.4181 2 12C2 13.5819 3.2243 14.8778 4.77703 14.9918C3.75974 16.1704 3.81037 17.9525 4.92891 19.0711C6.04747 20.1896 7.82955 20.2402 9.00816 19.2229C9.12221 20.7757 10.4181 22 12 22Z" />

            <image
                href={image}
                x="2"
                y="2"
                width="20"
                height="20"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#flowerClip)"
            />
        </svg>
    );
}