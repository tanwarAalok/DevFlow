import React from 'react';

function Layout({children}: {children: React.ReactNode}) {
    return (
        <main className="min-h-screen w-full flex-center">
            {children}
        </main>
    );
}

export default Layout;