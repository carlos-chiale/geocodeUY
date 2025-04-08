import "./globals.css"
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/layout/Header';

export const metadata = {
  title: "Geocodificadores Uruguay",
  description: "Aplicación para probar geocodificadores en Uruguay"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
}