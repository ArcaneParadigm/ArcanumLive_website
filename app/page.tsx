import PageShell from '@/components/layout/PageShell'
import ArcanumPortalHero from '@/components/home/ArcanumPortalHero'
import WorldsGalleryBand from '@/components/home/WorldsGalleryBand'
import DomeShowsFeatureSection from '@/components/home/DomeShowsFeatureSection'
import ScreensaverFeatureSection from '@/components/home/ScreensaverFeatureSection'
import ArchiveVaultFeatureSection from '@/components/home/ArchiveVaultFeatureSection'
import MusicRealmsFeatureSection from '@/components/home/MusicRealmsFeatureSection'
import StoreFeatureSection from '@/components/home/StoreFeatureSection'
import LicensingFeatureSection from '@/components/home/LicensingFeatureSection'
import FinalPortalCTA from '@/components/home/FinalPortalCTA'
import { gatewayButtons, heroHotspots } from '@/lib/data/seed'
import { discoverPageArt } from '@/lib/utils/realmImages'

export default function HomePage() {
  // Drop 16:9 art into public/art/home/ → cycles as hero background automatically
  const heroImages = discoverPageArt('home', ['/images/arcanum-portal-v1.jpg'])

  return (
    <PageShell noHeader>
      {/* Hero has its own transparent nav built in */}
      <ArcanumPortalHero buttons={gatewayButtons} hotspots={heroHotspots} heroImages={heroImages} />

      <WorldsGalleryBand />
      <div className="arcanum-divider" />

      <DomeShowsFeatureSection />
      <div className="arcanum-divider" />

      <ScreensaverFeatureSection />
      <div className="arcanum-divider" />

      <ArchiveVaultFeatureSection />
      <div className="arcanum-divider" />

      <MusicRealmsFeatureSection />
      <div className="arcanum-divider" />

      <StoreFeatureSection />
      <div className="arcanum-divider" />

      <LicensingFeatureSection />
      <div className="arcanum-divider" />

      <FinalPortalCTA />
    </PageShell>
  )
}
