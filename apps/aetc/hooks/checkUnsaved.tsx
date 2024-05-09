import { useEffect } from "react";

const checkUnsavedData = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            // Cancel the event as returning a string will prompt the user
            event.preventDefault();
            // Chrome requires returnValue to be set
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

}