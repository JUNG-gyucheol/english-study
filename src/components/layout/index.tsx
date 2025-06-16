'use client'

import Header from '../header'
import Toast from '../toast'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1c] pb-[100px]">
      <div className="flex w-full max-w-[480px] flex-col">
        <div>
          <Header />
        </div>
        {children}
      </div>
      <Toast />
      {/* <button
        onClick={() =>
          setToastList([
            ...toastList,
            {
              status: 'error',
              message: 'Extracted error',
            },
          ])
        }>
        Test
      </button> */}
    </div>
  )
}

export default Layout
