import { discoverPageArt, discoverPageOverlay, discoverRealmCardImage } from '@/lib/utils/realmImages'
import { featuredWorlds } from '@/lib/data/worlds'
import Home2Nav from '@/components/home2/Home2Nav'
import Home2Hero from '@/components/home2/Home2Hero'
import Home2Content from '@/components/home2/Home2Content'

// Experimental homepage — visit at localhost:3000/home2
// Drop hero art into: public/art/home2/   (any 16:9 JPGs cycle automatically)
// UI chrome overlay:  public/art/home2/ui-overlay.png  (screen blend — black = transparent)
// Realm card images:  public/realms/[slug]/card.jpg    (portrait 3:4)

export default function Home2Page() {
  const heroImages = discoverPageArt('home2', ['/images/arcanum-portal-v1.jpg'])
  const uiOverlay  = discoverPageOverlay('home2')

  const cardImages = Object.fromEntries(
    featuredWorlds
      .filter(w => w.slug)
      .map(w => [w.slug, discoverRealmCardImage(w.slug!)])
  ) as Record<string, string | null>

  return (
    <div className="w-full min-h-screen" style={{ background: '#08060e' }}>
      <Home2Nav />
      <Home2Hero heroImages={heroImages} uiOverlay={uiOverlay} />
      <Home2Content worlds={featuredWorlds} cardImages={cardImages} />
    </div>
  )
}
