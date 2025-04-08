import "./globals.css"
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "Geocodificadores Uruguay",
  description: "Aplicación para probar geocodificadores en Uruguay"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'