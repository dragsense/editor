
import MainLayout from "../Layout/MainLayout";
import Main from './Main'
import { useEffect, useMemo, useState } from 'react';
import Loading from "../Loading";

const MainScreen = () => {
    const [storeData, setStoreData] = useState(null);

    useEffect(() => {
        const handleSessionUpdate = (value) => {
            setStoreData(value);
        };
        window.autocode.onSessionUpdate(handleSessionUpdate);
        return () => {
            window.autocode.removeSessionUpdateListener(handleSessionUpdate);
        }
    }, []);



    return (
        <MainLayout>
            {storeData ? <Main store={storeData} /> : <Loading />}
        </MainLayout>
    );
};

export default MainScreen;