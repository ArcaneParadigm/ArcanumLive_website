import Header from './Header'
import Footer from './Footer'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  noFooter?: boolean
  noHeader?: boolean
}

export default function PageShell({ children, className = '', noFooter = false, noHeader = false }: PageShellProps) {
  return (
    <div className="min-h-screen bg-obsidian-200 text-white">
      {!noHeader && <Header />}
      <main className={className}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}
