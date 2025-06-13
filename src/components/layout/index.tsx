'use client'

import Header from '../header'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full justify-center">
      <div className="flex w-full max-w-[480px] flex-col">
        <div>
          <Header />
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout
