import './globals.css'

export const metadata = {
  title: 'Loan Application',
  description: 'Apply for a loan',
}

// ⬇️ THIS FUNCTION IS WHAT WAS MISSING OR BROKEN ⬇️
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}