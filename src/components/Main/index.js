
import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from "../Layout/MainLayout";
import Main from './Main'
import Loading from "../Loading";
import { Alert } from 'antd';

// MainScreen component
const MainScreen = () => {
    // Using React's useState hook for managing storeData state
    const [storeData, setStoreData] = useState(null);
    const [error, setError] = useState(null);

    // Using React's useCallback hook to memoize the handleSessionUpdate function
    // This ensures that the function is not recreated on every render, improving performance
    const handleSessionUpdate = useCallback((value) => {
        setStoreData(value);
    }, []);

    // Using React's useEffect hook to subscribe and unsubscribe to session updates
    useEffect(() => {

        if (!window.autocode) {
            setError("This app only allows Electron Environment.");
            setStoreData(null);
            return;
        }

        try {
            window.autocode.onSessionUpdate(handleSessionUpdate);
        } catch (e) {
            setError("This app only allows Autocode Editor.")
        }
        return () => {
            try {
                window.autocode.removeSessionUpdateListener(handleSessionUpdate);
            } catch (e) {
                setError("This app only allows Autocode Editor.")

            }
        }
    }, [handleSessionUpdate]); // Adding handleSessionUpdate as a dependency to ensure it's updated version is used



    // Rendering MainLayout component
    // If storeData is available, render Main component, else render Loading component
    return (
        <MainLayout>
            
            {storeData ? <Main store={storeData} /> : <>{error && <Alert type='error' message={error} />}<Loading /></>}
        </MainLayout>
    );
};

// Exporting MainScreen component as default export
export default MainScreen;