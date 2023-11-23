import React from 'react';

const LoadingScreen = ({ loading, onAnimationEnd }: { loading: boolean, onAnimationEnd: () => void }) => {
    const sharedFixedStyles = "fixed top-0 left-0 h-screen w-screen";
    const loadingScreenStyle = `${sharedFixedStyles} z-10 flex items-center justify-center bg-stone-900 ${loading ? "visible" : "fade-out"}`;

    return (
        <div className={loadingScreenStyle} onAnimationEnd={onAnimationEnd}></div>
    );
};

export default LoadingScreen;
  