import "./globals.css"
import { Analytics } from '@vercel/analytics/react';
import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const metadata = {
  title: "Geocodificadores Uruguay",
  description: "Aplicación para probar geocodificadores en Uruguay"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000 
        }}>
          <Button 
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/carlos-chiale/geocodeUY"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1890ff',
              borderColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            GitHub
          </Button>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'