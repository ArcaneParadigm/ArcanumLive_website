import { discoverPageArt, discoverPageOverlay } from '@/lib/utils/realmImages'
import Home2Hero from '@/components/home2/Home2Hero'

// Experimental homepage — visit at localhost:3000/home2
// Art: public/art/home2/   UI overlay: public/art/home2/ui-overlay.png
export default function Home2Page() {
  const heroImages = discoverPageArt('home2', ['/images/arcanum-portal-v1.jpg'])
  const uiOverlay = discoverPageOverlay('home2')

  return (
    <div className="min-h-screen bg-obsidian-200">
      <Home2Hero heroImages={heroImages} uiOverlay={uiOverlay} />
    </div>
  )
}
