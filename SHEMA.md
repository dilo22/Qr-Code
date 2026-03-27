qrcode/
├── app/
│   ├── auth/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── qr/
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── s/
│   │   └── [id]/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── AutoLogout.tsx
│   │   ├── hooks/
│   │   │   └── useAuthUser.ts
│   │   └── index.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── qr-details/
│   │   │   │   ├── PreviewQR.tsx
│   │   │   │   ├── QRContentDetails.tsx
│   │   │   │   ├── QrDetailsAnalytics.tsx
│   │   │   │   ├── QrDetailsHeader.tsx
│   │   │   │   ├── QRDetailsView.tsx
│   │   │   │   └── StaticTrackingNotice.tsx
│   │   │   ├── ui/
│   │   │   │   ├── EmptyChartState.tsx
│   │   │   │   ├── InfoCard.tsx
│   │   │   │   ├── ModeBadge.tsx
│   │   │   │   ├── SectionCard.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── CustomSelect.tsx
│   │   │   ├── DashboardFilters.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── MiniQR.tsx
│   │   │   ├── QRCard.tsx
│   │   │   ├── settings-form.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── styled-qr-preview.tsx
│   │   ├── create/
│   │   │   ├── CreateQRContent.tsx
│   │   │   ├── CreateQRDesign.tsx
│   │   │   ├── CreateQRExport.tsx
│   │   │   └── CreateQRForm.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboardData.ts
│   │   │   └── useQrDetails.ts
│   │   ├── lib/
│   │   │   ├── app-url.ts
│   │   │   ├── dashboard.utils.ts
│   │   │   ├── qr-details.analytics.ts
│   │   │   ├── qr-details.helpers.ts
│   │   │   └── qr-utils.ts
│   │   ├── types/
│   │   │   ├── dashboard.types.ts
│   │   │   └── qr-details.types.ts
│   │   └── index.ts
│   │
│   ├── home/
│   │   ├── components/
│   │   │   ├── HomeAnalytics.tsx
│   │   │   ├── HomeAnimationsStyle.tsx
│   │   │   ├── HomeBackground.tsx
│   │   │   ├── HomeCTA.tsx
│   │   │   ├── HomeFeatures.tsx
│   │   │   ├── HomeFooter.tsx
│   │   │   ├── HomeHeader.tsx
│   │   │   ├── HomeHero.tsx
│   │   │   └── HomeWorkflow.tsx
│   │   ├── hooks/
│   │   │   └── useHomePage.ts
│   │   ├── data/
│   │   │   └── home.data.ts
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx
│   │   │   └── NavLink.tsx
│   │   └── index.ts
│   │
│   └── steps/
│       ├── components/
│       │   ├── StepAnalyticsAnimation.tsx
│       │   ├── StepContentAnimation.tsx
│       │   ├── StepDesignAnimation.tsx
│       │   ├── StepExportAnimation.tsx
│       │   └── StepTypeAnimation.tsx
│       └── index.ts
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── lib/
│   └── supabase/
│       └── client.ts
│
├── public/
│   ├── screens/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── Sans titre-1.png
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── structure.txt
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── appréserve.tsx