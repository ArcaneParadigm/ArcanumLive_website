import { discoverPageArt, discoverPageOverlay } from '@/lib/utils/realmImages'
import { featuredWorlds } from '@/lib/data/worlds'
import Home2Hero from '@/components/home2/Home2Hero'
import Home2DomeSection from '@/components/home2/Home2DomeSection'
import Home2WorldsSection from '@/components/home2/Home2WorldsSection'
import Home2AscensionSection from '@/components/home2/Home2AscensionSection'
import Home2PortalCards from '@/components/home2/Home2PortalCards'

// Experimental homepage — visit at localhost:3000/home2
// Art: public/art/home2/   UI overlay: public/art/home2/ui-overlay.png
// Section art: public/art/home2/dome.jpg  public/art/home2/movies.jpg

export default function Home2Page() {
  const heroImages = discoverPageArt('home2', ['/images/arcanum-portal-v1.jpg'])
  const uiOverlay  = discoverPageOverlay('home2')

  // Section art — optional, panels show placeholder if missing
  const domeImage   = heroImages.find((i) => i.includes('dome'))
  const moviesImage = heroImages.find((i) => i.includes('movie') || i.includes('360') || i.includes('vr'))

  return (
    <div className="min-h-screen bg-obsidian-200">
      {/* Full-screen hero with cycling art */}
      <Home2Hero heroImages={heroImages} uiOverlay={uiOverlay} />

      {/* Dome Shows + 360 Movies — fly in from sides */}
      <Home2DomeSection domeImage={domeImage} moviesImage={moviesImage} />

      {/* World cards — staggered wobble in */}
      <Home2WorldsSection worlds={featuredWorlds} />

      {/* Ascension Chamber — mode chips wobble in */}
      <Home2AscensionSection />

      {/* Portal navigation cards */}
      <Home2PortalCards />
    </div>
  )
}
