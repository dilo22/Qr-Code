"use client";

import { HomeHero } from "@/components/home/HomeHero";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HomeWorkflow } from "@/components/home/HomeWorkflow";
import { HomeAnalytics } from "@/components/home/HomeAnalytics";
import { HomeCTA } from "@/components/home/HomeCTA";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HomeBackground } from "@/components/home/HomeBackground";
import { HomeAnimationsStyle } from "@/components/home/HomeAnimationsStyle";
import { useHomePage } from "@/components/home/useHomePage";

export default function HomePage() {
  const home = useHomePage();

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans text-[14px] md:text-[15px] selection:bg-cyan-500/30 overflow-x-hidden">
      <HomeBackground mousePos={home.mousePos} />

      <HomeHeader
        scrolled={home.scrolled}
        onLogoClick={home.goHome}
        onAuthClick={home.navigateToAuth}
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