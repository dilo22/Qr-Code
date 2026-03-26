"use client";

import { HomeHero } from "@/features/home/components/HomeHero";
import { HomeFeatures } from "@/features/home/components/HomeFeatures";
import { HomeWorkflow } from "@/features/home/components/HomeWorkflow";
import { HomeAnalytics } from "@/features/home/components/HomeAnalytics";
import { HomeCTA } from "@/features/home/components/HomeCTA";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { HomeFooter } from "@/features/home/components/HomeFooter";
import { HomeBackground } from "@/features/home/components/HomeBackground";
import { HomeAnimationsStyle } from "@/features/home/components/HomeAnimationsStyle";
import { useHomePage } from "@/features/home/hooks/useHomePage";

export default function HomePage() {
  const home = useHomePage();

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans text-[14px] md:text-[15px] selection:bg-cyan-500/30 overflow-x-hidden">
      <HomeBackground mousePos={home.mousePos} />

      <HomeHeader
        scrolled={home.scrolled}
        onLogoClick={home.goHome}
        onAuthClick={home.navigateToAuth}
        onDashboardClick={home.navigateToDashboard}
        onScrollToSection={home.scrollToSection}
      />

      <main className="relative z-10 animate-fade-in">
        <HomeHero
          isMounted={home.isMounted}
          onAuthClick={home.navigateToAuth}
          onScrollToSection={home.scrollToSection}
        />

        <HomeFeatures onCardClick={home.navigateToAuth} />

        <HomeWorkflow
          activeStep={home.activeStep}
          progressKey={home.progressKey}
          autoplayDuration={home.autoplayDuration}
          isProgressAnimating={home.isProgressAnimating}
          onStepClick={home.handleStepClick}
        />

        <HomeAnalytics />
        <HomeCTA onAuthClick={home.navigateToAuth} />
        <HomeFooter />
      </main>

      <HomeAnimationsStyle />
    </div>
  );
}