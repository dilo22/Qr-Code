"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTOPLAY_DURATION, steps } from "./home.data";

export function useHomePage() {
  const router = useRouter();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isProgressAnimating, setIsProgressAnimating] = useState(true);

  const timerRef = useRef<number | null>(null);
  const autoplayDuration = AUTOPLAY_DURATION;

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAutoplay = () => {
    clearTimer();

    setIsProgressAnimating(true);
    setProgressKey((prev) => prev + 1);

    timerRef.current = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setProgressKey((prev) => prev + 1);
      setIsProgressAnimating(true);
    }, autoplayDuration);
  };

  useEffect(() => {
    setIsMounted(true);

    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    startAutoplay();

    return () => {
      clearTimer();
    };
  }, []);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const goHome = () => {
    router.push("/");
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    startAutoplay();
  };

  return {
    mousePos,
    scrolled,
    isMounted,
    activeStep,
    progressKey,
    isProgressAnimating,
    autoplayDuration,
    navigateToAuth,
    goHome,
    scrollToSection,
    handleStepClick,
  };
}