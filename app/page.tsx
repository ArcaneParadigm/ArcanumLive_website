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

export default function HomePage() {
  return (
    <PageShell noHeader>
      {/* Hero has its own transparent nav built in */}
      <ArcanumPortalHero buttons={gatewayButtons} hotspots={heroHotspots} />

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
