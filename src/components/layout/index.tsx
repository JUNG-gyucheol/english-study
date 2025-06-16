'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '../header'
import Toast from '../toast'

const queryClient = new QueryClient()

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen w-full justify-center bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1c] pb-[100px]">
        <div className="flex w-full max-w-[480px] flex-col px-[14px]">
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
    </QueryClientProvider>
  )
}

export default Layout
