import { jsx as _jsx } from "react/jsx-runtime";
// Path: src/demo/context/DemoContext.tsx
import { createContext, useContext, useState } from 'react';
const DemoContext = createContext(null);
export function useDemoContext() {
    const ctx = useContext(DemoContext);
    if (!ctx)
        throw new Error('useDemoContext doit être utilisé dans un DemoProvider');
    return ctx;
}
export function DemoProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockedActionName, setBlockedActionName] = useState(null);
    const [deviceMode, setDeviceMode] = useState('desktop');
    function triggerDemoNotice(actionName) {
        setBlockedActionName(actionName || 'Cette action');
        setIsModalOpen(true);
    }
    function closeDemoNotice() {
        setIsModalOpen(false);
        setBlockedActionName(null);
    }
    return (_jsx(DemoContext.Provider, { value: {
            isModalOpen,
            blockedActionName,
            triggerDemoNotice,
            closeDemoNotice,
            deviceMode,
            setDeviceMode,
        }, children: children }));
}
