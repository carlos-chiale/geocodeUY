import "./globals.css"
import { Analytics } from '@vercel/analytics/react';
import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ThemeToggle } from './components/ThemeToggle';

export const metadata = {
  title: "Geocodificadores Uruguay",
  description: "Aplicación para probar geocodificadores en Uruguay"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <header className="bg-blue-600 dark:bg-blue-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold truncate mr-4">Geocodificadores Uruguay</h1>
            <div className="flex gap-2 flex-shrink-0">
              <ThemeToggle />
              <Button
                type="primary"
                icon={<GithubOutlined />}
                href="https://github.com/carlos-chiale/geocodeUY"
                target="_blank"
                rel="noopener noreferrer"
                className="github-btn"
                style={{
                  background: '#1890ff',
                  borderColor: '#1890ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 8px',
                  minWidth: '32px',
                  height: '32px'
                }}
                title="GitHub"
              >
                <span className="hidden sm:inline ml-2">GitHub</span>
              </Button>
            </div>
          </div>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'