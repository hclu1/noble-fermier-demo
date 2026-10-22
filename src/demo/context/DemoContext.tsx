// Path: src/demo/context/DemoContext.tsx

import React, { createContext, useContext, useState } from 'react'

export type DeviceMode = 'desktop' | 'mobile'

interface DemoContextValue {
  isModalOpen: boolean
  blockedActionName: string | null
  triggerDemoNotice: (actionName?: string) => void
  closeDemoNotice: () => void
  deviceMode: DeviceMode
  setDeviceMode: (mode: DeviceMode) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function useDemoContext() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemoContext doit être utilisé dans un DemoProvider')
  return ctx
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [blockedActionName, setBlockedActionName] = useState<string | null>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')

  function triggerDemoNotice(actionName?: string) {
    setBlockedActionName(actionName || 'Cette action')
    setIsModalOpen(true)
  }

  function closeDemoNotice() {
    setIsModalOpen(false)
    setBlockedActionName(null)
  }

  return (
    <DemoContext.Provider
      value={{
        isModalOpen,
        blockedActionName,
        triggerDemoNotice,
        closeDemoNotice,
        deviceMode,
        setDeviceMode,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}
