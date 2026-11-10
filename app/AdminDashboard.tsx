"use client";

import React, { useRef, useState } from "react";
import {
  AtlantisRoomIcon,
  type RoomCategorySlug,
  type RoomDetailData,
  type RoomSlug,
  specificRoomsData,
} from "./roomsData";

export type OzParkRoomsCmsState = {
  roomsData: {
    en: Record<RoomSlug, RoomDetailData>;
    ar: Record<RoomSlug, RoomDetailData>;
  };
  baseRatesSar: Record<RoomSlug, number>;
  breakfastPriceSar: number;
  weekdayDiscountPct: number;
  roomAvailable: Record<RoomSlug, boolean>;
  updatedAt: string;
};

export const DEFAULT_BASE_RATES_SAR: Record<RoomSlug, number> = {
  "deluxe-room": 380,
  "superior-room": 440,
  "superior-studio": 520,
  "twin-junior-suite": 620,
  "superior-suite": 750,
  "deluxe-suite": 890,
  "royal-suite": 1250,
};

export const DEFAULT_ROOM_AVAILABLE: Record<RoomSlug, boolean> = {
  "deluxe-room": true,
  "superior-room": true,
  "superior-studio": true,
  "twin-junior-suite": true,
  "superior-suite": true,
  "deluxe-suite": true,
  "royal-suite": true,
};

export const ALL_ROOM_SLUGS: RoomSlug[] = [
  "deluxe-room",
  "superior-room",
  "superior-studio",
  "twin-junior-suite",
  "superior-suite",
  "deluxe-suite",
  "royal-suite",
];

export const CMS_STORAGE_KEY = "ozpark_cms_rooms_v1";
const ADMIN_AUTH_STORAGE_KEY = "ozpark_admin_session_v1";

const ADMIN_VALID_USER = "jacsfourseasons@gmail.com";
const ADMIN_VALID_PASS = "OZpark@7868";

export function getInitialCmsState(): OzParkRoomsCmsState {
  return {
    roomsData: JSON.parse(JSON.stringify(specificRoomsData)),
    baseRatesSar: { ...DEFAULT_BASE_RATES_SAR },
    breakfastPriceSar: 50,
    weekdayDiscountPct: 25,
    roomAvailable: { ...DEFAULT_ROOM_AVAILABLE },
    updatedAt: new Date().toISOString(),
  };
}

// Helper to compress uploaded image files via HTML5 Canvas so they store cleanly in localStorage
async function compressUploadedImage(file: File, maxWidth = 1600, quality = 0.84): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

type AdminTab = "pricing" | "details" | "images" | "preview";

export default function AdminDashboard({
  cmsState,
  onUpdateCmsState,
  onResetCmsState,
  onOpenWebsiteHome,
  onOpenBookingPage,
  onOpenRoomPage,
}: {
  cmsState: OzParkRoomsCmsState;
  onUpdateCmsState: (next: OzParkRoomsCmsState) => void;
  onResetCmsState: () => void;
  onOpenWebsiteHome: () => void;
  onOpenBookingPage: (roomSlug?: RoomSlug) => void;
  onOpenRoomPage: (roomSlug: RoomSlug) => void;
}) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "authenticated" ||
      window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "authenticated";
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard active navigation states
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<RoomSlug>("deluxe-room");
  const [activeTab, setActiveTab] = useState<AdminTab>("pricing");
  const [editLang, setEditLang] = useState<"en" | "ar" | "both">("both");
  const [categoryFilter, setCategoryFilter] = useState<"all" | RoomCategorySlug>("all");
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState("");
  const [libraryPickerTarget, setLibraryPickerTarget] = useState<
    | null
    | { type: "hero" }
    | { type: "card" }
    | { type: "collage"; index: number }
    | { type: "gallery-add" }
  >(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<
    | null
    | { type: "hero" }
    | { type: "card" }
    | { type: "collage"; index: number }
    | { type: "gallery-add" }
  >(null);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    window.setTimeout(() => {
      setSaveToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();
    if (cleanUser === ADMIN_VALID_USER.toLowerCase() && cleanPass === ADMIN_VALID_PASS) {
      setIsAuthenticated(true);
      setLoginError(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "authenticated");
        if (rememberMe) {
          window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "authenticated");
        }
      }
      triggerToast("Welcome back to OZ Park Hotel Rooms Dashboard");
    } else {
      setLoginError("Invalid email or password. Please verify your credentials and try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginPassword("");
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  };

  // Update helpers that mutate cmsState and persist immediately
  const updateRoomPrice = (slug: RoomSlug, newPrice: number) => {
    const safePrice = Math.max(50, Math.round(Number(newPrice) || 0));
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      baseRatesSar: {
        ...cmsState.baseRatesSar,
        [slug]: safePrice,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
  };

  const updateBreakfastPrice = (newPrice: number) => {
    const safePrice = Math.max(0, Math.round(Number(newPrice) || 0));
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      breakfastPriceSar: safePrice,
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
  };

  const updateWeekdayDiscount = (newPct: number) => {
    const safePct = Math.min(80, Math.max(0, Math.round(Number(newPct) || 0)));
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      weekdayDiscountPct: safePct,
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
  };

  const toggleRoomAvailability = (slug: RoomSlug) => {
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      roomAvailable: {
        ...cmsState.roomAvailable,
        [slug]: !cmsState.roomAvailable[slug],
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
    triggerToast(
      `${cmsState.roomsData.en[slug].name} marked as ${
        !cmsState.roomAvailable[slug] ? "Available" : "Sold Out"
      }`
    );
  };

  const updateRoomField = (
    lang: "en" | "ar",
    slug: RoomSlug,
    field: keyof RoomDetailData,
    value: string
  ) => {
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      roomsData: {
        ...cmsState.roomsData,
        [lang]: {
          ...cmsState.roomsData[lang],
          [slug]: {
            ...cmsState.roomsData[lang][slug],
            [field]: value,
          },
        },
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
  };

  // Sync image changes across both English & Arabic records for the room
  const updateRoomImagesBothLangs = (
    slug: RoomSlug,
    updater: (room: RoomDetailData) => RoomDetailData
  ) => {
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [slug]: updater(cmsState.roomsData.en[slug]),
        },
        ar: {
          ...cmsState.roomsData.ar,
          [slug]: updater(cmsState.roomsData.ar[slug]),
        },
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
  };

  const applyImageSelection = (imgSrc: string, target = uploadTarget ?? libraryPickerTarget) => {
    if (!target || !imgSrc.trim()) return;
    const cleanSrc = imgSrc.trim();

    updateRoomImagesBothLangs(selectedRoomSlug, (rm) => {
      if (target.type === "hero") {
        return { ...rm, heroImage: cleanSrc };
      }
      if (target.type === "card") {
        return { ...rm, cardImage: cleanSrc };
      }
      if (target.type === "collage") {
        const nextCollage = [...rm.collageImages] as [string, string, string, string, string];
        nextCollage[target.index] = cleanSrc;
        return { ...rm, collageImages: nextCollage };
      }
      if (target.type === "gallery-add") {
        return {
          ...rm,
          allGalleryImages: [...rm.allGalleryImages, cleanSrc],
        };
      }
      return rm;
    });

    setUploadTarget(null);
    setLibraryPickerTarget(null);
    triggerToast("Room image updated and synced across website");
  };

  const handleFileUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadTarget?.type === "gallery-add" && files.length > 1) {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i += 1) {
        const dataUrl = await compressUploadedImage(files[i]);
        compressedList.push(dataUrl);
      }
      updateRoomImagesBothLangs(selectedRoomSlug, (rm) => ({
        ...rm,
        allGalleryImages: [...rm.allGalleryImages, ...compressedList],
      }));
      setUploadTarget(null);
      triggerToast(`Added ${compressedList.length} photos to ${cmsState.roomsData.en[selectedRoomSlug].name}`);
    } else {
      const dataUrl = await compressUploadedImage(files[0]);
      applyImageSelection(dataUrl, uploadTarget);
    }
    e.target.value = "";
  };

  const triggerFileBrowser = (
    target:
      | { type: "hero" }
      | { type: "card" }
      | { type: "collage"; index: number }
      | { type: "gallery-add" }
  ) => {
    setUploadTarget(target);
    window.setTimeout(() => {
      fileInputRef.current?.click();
    }, 20);
  };

  const removeGalleryImage = (idxToRemove: number) => {
    updateRoomImagesBothLangs(selectedRoomSlug, (rm) => {
      if (rm.allGalleryImages.length <= 1) return rm;
      const nextGallery = rm.allGalleryImages.filter((_, i) => i !== idxToRemove);
      return { ...rm, allGalleryImages: nextGallery };
    });
    triggerToast("Photo removed from room gallery");
  };

  const moveGalleryImage = (idx: number, dir: -1 | 1) => {
    updateRoomImagesBothLangs(selectedRoomSlug, (rm) => {
      const nextGallery = [...rm.allGalleryImages];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= nextGallery.length) return rm;
      const temp = nextGallery[idx];
      nextGallery[idx] = nextGallery[targetIdx];
      nextGallery[targetIdx] = temp;
      return { ...rm, allGalleryImages: nextGallery };
    });
  };

  const resetSingleRoomToDefault = (slug: RoomSlug) => {
    const next: OzParkRoomsCmsState = {
      ...cmsState,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [slug]: JSON.parse(JSON.stringify(specificRoomsData.en[slug])),
        },
        ar: {
          ...cmsState.roomsData.ar,
          [slug]: JSON.parse(JSON.stringify(specificRoomsData.ar[slug])),
        },
      },
      baseRatesSar: {
        ...cmsState.baseRatesSar,
        [slug]: DEFAULT_BASE_RATES_SAR[slug],
      },
      roomAvailable: {
        ...cmsState.roomAvailable,
        [slug]: true,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateCmsState(next);
    triggerToast(`Reset ${specificRoomsData.en[slug].name} to factory defaults`);
  };

  // Collect all unique hotel room images for the built-in visual Media Library modal
  const allHotelLibraryPhotos = React.useMemo(() => {
    const set = new Set<string>();
    ALL_ROOM_SLUGS.forEach((s) => {
      const defRoom = specificRoomsData.en[s];
      set.add(defRoom.heroImage);
      set.add(defRoom.cardImage);
      defRoom.collageImages.forEach((img) => set.add(img));
      defRoom.allGalleryImages.forEach((img) => set.add(img));
    });
    return Array.from(set);
  }, []);

  // ============================================================================
  // 1. LUXURY ANIMATED LOGIN GATE (jacsfourseasons@gmail.com / OZpark@7868)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="oz-admin-login-screen">
        <div className="oz-admin-login-bg">
          <img src="/images/ozpark/rooms/royal-suite/1.jpg" alt="OZ Park Hotel" />
          <div className="oz-admin-login-scrim" />
        </div>

        <div className="oz-admin-login-card">
          <div className="oz-admin-login-brand">
            <span className="oz-admin-overline">AL QUNFUDHAH • RED SEA</span>
            <h1 className="oz-admin-wordmark">
              <span>OZ</span> PARK
            </h1>
            <p className="oz-admin-subtitle">Rooms & Pricing Management Portal</p>
          </div>

          <form className="oz-admin-login-form" onSubmit={handleLoginSubmit}>
            {loginError && <div className="oz-admin-login-error">{loginError}</div>}

            <div className="oz-admin-field">
              <label htmlFor="oz-admin-email">Administrator Email</label>
              <div className="oz-admin-input-wrap">
                <input
                  id="oz-admin-email"
                  type="email"
                  required
                  placeholder="jacsfourseasons@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="oz-admin-field">
              <label htmlFor="oz-admin-password">Password</label>
              <div className="oz-admin-input-wrap">
                <input
                  id="oz-admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="oz-admin-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="oz-admin-login-row">
              <label className="oz-admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            <button type="submit" className="oz-admin-login-submit">
              Sign In to Dashboard →
            </button>
          </form>

          <div className="oz-admin-login-footer">
            <button type="button" className="oz-admin-back-link" onClick={onOpenWebsiteHome}>
              ← Return to OZ Park Hotel Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. AUTHENTICATED ROOMS MANAGEMENT DASHBOARD
  // ============================================================================
  const activeRoomEn = cmsState.roomsData.en[selectedRoomSlug];
  const activeRoomAr = cmsState.roomsData.ar[selectedRoomSlug];
  const activeBaseRate = cmsState.baseRatesSar[selectedRoomSlug];
  const activeWithBreakfast1P = activeBaseRate + cmsState.breakfastPriceSar;
  const activeWithBreakfast2P = activeBaseRate + cmsState.breakfastPriceSar * 2;
  const activeWeekdayRate = Math.round(
    activeBaseRate * (1 - cmsState.weekdayDiscountPct / 100)
  );
  const isRoomAvailable = cmsState.roomAvailable[selectedRoomSlug] !== false;

  const visibleRoomSlugs = ALL_ROOM_SLUGS.filter((slug) =>
    categoryFilter === "all"
      ? true
      : cmsState.roomsData.en[slug].categorySlug === categoryFilter
  );

  return (
    <div className="oz-admin-dashboard">
      {/* Hidden File Input for Computer/Mobile Photo Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={uploadTarget?.type === "gallery-add"}
        style={{ display: "none" }}
        onChange={handleFileUploadChange}
      />

      {/* Animated Save Confirmation Toast */}
      {saveToast && (
        <div className="oz-admin-toast" role="status">
          <span className="oz-admin-toast-dot" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* TOP LUXURY ADMIN HEADER BAR */}
      <header className="oz-admin-topbar">
        <div className="oz-admin-topbar-left">
          <button
            type="button"
            className="oz-admin-logo-btn"
            onClick={onOpenWebsiteHome}
            title="View Live Website"
          >
            <span className="oz-admin-logo-circle">OZ</span>
            <div>
              <strong>OZ PARK HOTEL</strong>
              <span>Rooms & Rates CMS Dashboard</span>
            </div>
          </button>
        </div>

        <div className="oz-admin-topbar-actions">
          <button
            type="button"
            className="oz-admin-top-btn is-outline"
            onClick={onOpenWebsiteHome}
          >
            🌐 View Live Website
          </button>
          <button
            type="button"
            className="oz-admin-top-btn is-outline"
            onClick={() => onOpenRoomPage(selectedRoomSlug)}
          >
            🛏 View This Room Page
          </button>
          <button
            type="button"
            className="oz-admin-top-btn is-outline"
            onClick={() => onOpenBookingPage(selectedRoomSlug)}
          >
            📅 View Booking Engine
          </button>
          <button
            type="button"
            className="oz-admin-top-btn is-gold"
            onClick={() => triggerToast("All changes saved & live across the website!")}
          >
            ✓ Save All Changes
          </button>
          <button
            type="button"
            className="oz-admin-top-btn is-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* KPI SUMMARY STRIP & GLOBAL PRICING SETTINGS */}
      <section className="oz-admin-kpi-strip">
        <div className="oz-admin-kpi-card">
          <span className="oz-admin-kpi-label">TOTAL ROOMS & SUITES</span>
          <strong className="oz-admin-kpi-value">7 Categories / Types</strong>
          <span className="oz-admin-kpi-sub">
            {ALL_ROOM_SLUGS.filter((s) => cmsState.roomAvailable[s] !== false).length} Active on Booking Engine
          </span>
        </div>

        <div className="oz-admin-kpi-card">
          <span className="oz-admin-kpi-label">BREAKFAST ADD-ON (PER PERSON)</span>
          <div className="oz-admin-kpi-inline-input">
            <span>SAR</span>
            <input
              type="number"
              min={0}
              max={500}
              value={cmsState.breakfastPriceSar}
              onChange={(e) => updateBreakfastPrice(Number(e.target.value))}
            />
            <span>/ person</span>
          </div>
          <span className="oz-admin-kpi-sub">
            Automatically added to &ldquo;With Breakfast&rdquo; rate
          </span>
        </div>

        <div className="oz-admin-kpi-card">
          <span className="oz-admin-kpi-label">WEEKDAY PROMO DISCOUNT</span>
          <div className="oz-admin-kpi-inline-input">
            <input
              type="number"
              min={0}
              max={75}
              value={cmsState.weekdayDiscountPct}
              onChange={(e) => updateWeekdayDiscount(Number(e.target.value))}
            />
            <span>% OFF</span>
          </div>
          <span className="oz-admin-kpi-sub">Applied to Weekday Escape rate row</span>
        </div>

        <div className="oz-admin-kpi-card">
          <span className="oz-admin-kpi-label">PRICE RANGE (ROOM ONLY)</span>
          <strong className="oz-admin-kpi-value">
            SAR {Math.min(...Object.values(cmsState.baseRatesSar))} – SAR{" "}
            {Math.max(...Object.values(cmsState.baseRatesSar))}
          </strong>
          <span className="oz-admin-kpi-sub">
            Last updated: {new Date(cmsState.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </section>

      {/* MAIN 2-COLUMN WORKSPACE: LEFT ROOM SELECTOR + RIGHT ROOM EDITOR */}
      <div className="oz-admin-workspace">
        {/* LEFT SIDEBAR: ALL 7 ROOMS LIST WITH QUICK PRICING & THUMBNAIL */}
        <aside className="oz-admin-sidebar">
          <div className="oz-admin-sidebar-header">
            <h2>Select a Room to Edit</h2>
            <div className="oz-admin-cat-pills">
              {(
                [
                  ["all", "All (7)"],
                  ["rooms", "Rooms (2)"],
                  ["studios", "Studios (1)"],
                  ["suites", "Suites (4)"],
                ] as const
              ).map(([catKey, label]) => (
                <button
                  key={catKey}
                  type="button"
                  className={`oz-admin-cat-pill ${categoryFilter === catKey ? "is-active" : ""}`}
                  onClick={() => setCategoryFilter(catKey)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="oz-admin-room-list">
            {visibleRoomSlugs.map((slug) => {
              const rm = cmsState.roomsData.en[slug];
              const rmAr = cmsState.roomsData.ar[slug];
              const price = cmsState.baseRatesSar[slug];
              const isSelected = slug === selectedRoomSlug;
              const avail = cmsState.roomAvailable[slug] !== false;

              return (
                <button
                  key={slug}
                  type="button"
                  className={`oz-admin-room-item ${isSelected ? "is-selected" : ""}`}
                  onClick={() => setSelectedRoomSlug(slug)}
                >
                  <div className="oz-admin-room-item-thumb">
                    <img src={rm.cardImage} alt={rm.name} />
                    <span
                      className={`oz-admin-status-dot ${avail ? "is-online" : "is-offline"}`}
                      title={avail ? "Available" : "Sold Out"}
                    />
                  </div>
                  <div className="oz-admin-room-item-info">
                    <span className="oz-admin-room-item-cat">{rm.categoryEyebrow}</span>
                    <h3>{rm.name}</h3>
                    <p className="oz-admin-room-item-ar">{rmAr.name}</p>
                    <div className="oz-admin-room-item-meta">
                      <strong>SAR {price} / night</strong>
                      <span>📷 {rm.allGalleryImages.length} photos</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="oz-admin-sidebar-footer">
            <button
              type="button"
              className="oz-admin-reset-all-btn"
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all 7 rooms, prices, and images back to the original hotel defaults?"
                  )
                ) {
                  onResetCmsState();
                  triggerToast("All rooms reset to original factory defaults");
                }
              }}
            >
              ↺ Reset All Rooms to Default
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN PANEL: SELECTED ROOM EDITOR */}
        <section className="oz-admin-editor">
          {/* Selected Room Top Banner */}
          <div className="oz-admin-room-banner">
            <div className="oz-admin-room-banner-left">
              <img
                src={activeRoomEn.cardImage}
                alt={activeRoomEn.name}
                className="oz-admin-banner-thumb"
              />
              <div>
                <span className="oz-admin-banner-cat">
                  {activeRoomEn.categoryEyebrow} • {activeRoomAr.categoryEyebrow}
                </span>
                <h2>
                  {activeRoomEn.name} <span className="oz-admin-sep">/</span>{" "}
                  <span dir="rtl">{activeRoomAr.name}</span>
                </h2>
                <p>
                  {activeRoomEn.size} • {activeRoomEn.bed} • {activeRoomEn.occupancy} •{" "}
                  {activeRoomEn.view}
                </p>
              </div>
            </div>

            <div className="oz-admin-room-banner-right">
              <button
                type="button"
                className={`oz-admin-avail-toggle ${isRoomAvailable ? "is-available" : "is-soldout"}`}
                onClick={() => toggleRoomAvailability(selectedRoomSlug)}
              >
                <span className="oz-admin-avail-indicator" />
                {isRoomAvailable ? "Available for Booking" : "Sold Out / Paused"}
              </button>

              <button
                type="button"
                className="oz-admin-reset-room-btn"
                onClick={() => resetSingleRoomToDefault(selectedRoomSlug)}
              >
                ↺ Reset This Room
              </button>
            </div>
          </div>

          {/* 4-Tab Navigation Bar inside Editor */}
          <div className="oz-admin-tabs">
            <button
              type="button"
              className={`oz-admin-tab ${activeTab === "pricing" ? "is-active" : ""}`}
              onClick={() => setActiveTab("pricing")}
            >
              <span>01</span> 💰 Room Pricing & Breakfast Rates
            </button>
            <button
              type="button"
              className={`oz-admin-tab ${activeTab === "details" ? "is-active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <span>02</span> 📝 Room Text, Specs & Descriptions
            </button>
            <button
              type="button"
              className={`oz-admin-tab ${activeTab === "images" ? "is-active" : ""}`}
              onClick={() => setActiveTab("images")}
            >
              <span>03</span> 🖼️ Room Images & Photo Gallery ({activeRoomEn.allGalleryImages.length})
            </button>
            <button
              type="button"
              className={`oz-admin-tab ${activeTab === "preview" ? "is-active" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              <span>04</span> ✨ Live Card & Booking Preview
            </button>
          </div>

          {/* =================================================================
              TAB 1: ROOM PRICING & BREAKFAST RATES
              ================================================================= */}
          {activeTab === "pricing" && (
            <div className="oz-admin-tab-panel">
              <div className="oz-admin-panel-grid-2">
                {/* Card 1: Selected Room Base Nightly Price */}
                <div className="oz-admin-card">
                  <div className="oz-admin-card-head">
                    <h3>Nightly Rate — {activeRoomEn.name}</h3>
                    <p>Set the standard &ldquo;Room Only&rdquo; nightly rate in Saudi Riyals (SAR).</p>
                  </div>

                  <div className="oz-admin-price-control-box">
                    <button
                      type="button"
                      className="oz-admin-price-step-btn"
                      onClick={() => updateRoomPrice(selectedRoomSlug, activeBaseRate - 25)}
                    >
                      − 25 SAR
                    </button>
                    <div className="oz-admin-price-big-input">
                      <span>SAR</span>
                      <input
                        type="number"
                        min={50}
                        max={20000}
                        value={activeBaseRate}
                        onChange={(e) =>
                          updateRoomPrice(selectedRoomSlug, Number(e.target.value))
                        }
                      />
                      <small>Per Night (Room Only)</small>
                    </div>
                    <button
                      type="button"
                      className="oz-admin-price-step-btn"
                      onClick={() => updateRoomPrice(selectedRoomSlug, activeBaseRate + 25)}
                    >
                      + 25 SAR
                    </button>
                  </div>

                  <div className="oz-admin-rate-preview-table">
                    <div className="oz-admin-rate-preview-row">
                      <span>Standard Rate — Room Only</span>
                      <strong>SAR {activeBaseRate.toLocaleString()} / night</strong>
                    </div>
                    <div className="oz-admin-rate-preview-row is-highlight">
                      <span>
                        With Breakfast (1 Person • +SAR {cmsState.breakfastPriceSar})
                      </span>
                      <strong>SAR {activeWithBreakfast1P.toLocaleString()} / night</strong>
                    </div>
                    <div className="oz-admin-rate-preview-row is-highlight">
                      <span>
                        With Breakfast (2 Persons • +SAR {cmsState.breakfastPriceSar * 2})
                      </span>
                      <strong>SAR {activeWithBreakfast2P.toLocaleString()} / night</strong>
                    </div>
                    <div className="oz-admin-rate-preview-row">
                      <span>
                        Weekday Escape ({cmsState.weekdayDiscountPct}% Off) — Room Only
                      </span>
                      <strong>SAR {activeWeekdayRate.toLocaleString()} / night</strong>
                    </div>
                    <div className="oz-admin-rate-preview-row">
                      <span>
                        Weekday Escape ({cmsState.weekdayDiscountPct}% Off) — With Breakfast (1P)
                      </span>
                      <strong>
                        SAR {(activeWeekdayRate + cmsState.breakfastPriceSar).toLocaleString()} / night
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Quick Price Matrix for All 7 Rooms */}
                <div className="oz-admin-card">
                  <div className="oz-admin-card-head">
                    <h3>Quick Price Editor — All 7 Rooms</h3>
                    <p>Adjust nightly rates across all rooms & suites in one place.</p>
                  </div>

                  <div className="oz-admin-all-prices-list">
                    {ALL_ROOM_SLUGS.map((slug) => {
                      const rm = cmsState.roomsData.en[slug];
                      const rate = cmsState.baseRatesSar[slug];
                      return (
                        <div
                          key={slug}
                          className={`oz-admin-quick-price-row ${
                            slug === selectedRoomSlug ? "is-active" : ""
                          }`}
                          onClick={() => setSelectedRoomSlug(slug)}
                        >
                          <div className="oz-admin-quick-price-name">
                            <strong>{rm.name}</strong>
                            <span>
                              With Breakfast (1P): SAR {rate + cmsState.breakfastPriceSar}
                            </span>
                          </div>
                          <div className="oz-admin-quick-price-input">
                            <span>SAR</span>
                            <input
                              type="number"
                              min={50}
                              value={rate}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateRoomPrice(slug, Number(e.target.value))}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 2: ROOM TEXT, SPECS & DESCRIPTIONS (EN & AR)
              ================================================================= */}
          {activeTab === "details" && (
            <div className="oz-admin-tab-panel">
              <div className="oz-admin-lang-bar">
                <span>Editing Language Mode:</span>
                <div className="oz-admin-lang-pills">
                  <button
                    type="button"
                    className={editLang === "both" ? "is-active" : ""}
                    onClick={() => setEditLang("both")}
                  >
                    Side-by-Side (English + العربية)
                  </button>
                  <button
                    type="button"
                    className={editLang === "en" ? "is-active" : ""}
                    onClick={() => setEditLang("en")}
                  >
                    English Only
                  </button>
                  <button
                    type="button"
                    className={editLang === "ar" ? "is-active" : ""}
                    onClick={() => setEditLang("ar")}
                  >
                    العربية فقط
                  </button>
                </div>
              </div>

              <div
                className={`oz-admin-lang-columns ${
                  editLang === "both" ? "is-two-cols" : "is-one-col"
                }`}
              >
                {/* ENGLISH FIELDS */}
                {(editLang === "both" || editLang === "en") && (
                  <div className="oz-admin-card">
                    <div className="oz-admin-card-head">
                      <h3>🇬🇧 English Room Content</h3>
                      <p>Displayed when the website is viewed in English.</p>
                    </div>

                    <div className="oz-admin-form-grid">
                      <div className="oz-admin-field">
                        <label>Room Name / Title (EN)</label>
                        <input
                          type="text"
                          value={activeRoomEn.name}
                          onChange={(e) =>
                            updateRoomField("en", selectedRoomSlug, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>Category Label (EN)</label>
                        <input
                          type="text"
                          value={activeRoomEn.categoryEyebrow}
                          onChange={(e) =>
                            updateRoomField(
                              "en",
                              selectedRoomSlug,
                              "categoryEyebrow",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>Room Size (e.g. 35 sqm)</label>
                        <input
                          type="text"
                          value={activeRoomEn.size}
                          onChange={(e) =>
                            updateRoomField("en", selectedRoomSlug, "size", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>Bed Type (e.g. 1 King Bed)</label>
                        <input
                          type="text"
                          value={activeRoomEn.bed}
                          onChange={(e) =>
                            updateRoomField("en", selectedRoomSlug, "bed", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>Max Occupancy / Guests (EN)</label>
                        <input
                          type="text"
                          value={activeRoomEn.occupancy}
                          onChange={(e) =>
                            updateRoomField("en", selectedRoomSlug, "occupancy", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>View (e.g. Red Sea View)</label>
                        <input
                          type="text"
                          value={activeRoomEn.view}
                          onChange={(e) =>
                            updateRoomField("en", selectedRoomSlug, "view", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>Card & Booking Summary Description (EN)</label>
                        <textarea
                          rows={3}
                          value={activeRoomEn.cardDescription}
                          onChange={(e) =>
                            updateRoomField(
                              "en",
                              selectedRoomSlug,
                              "cardDescription",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>Room Detail Page Gallery Heading (EN)</label>
                        <input
                          type="text"
                          value={activeRoomEn.collageHeading}
                          onChange={(e) =>
                            updateRoomField(
                              "en",
                              selectedRoomSlug,
                              "collageHeading",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>Room Detail Page Gallery Description (EN)</label>
                        <textarea
                          rows={3}
                          value={activeRoomEn.collageDescription}
                          onChange={(e) =>
                            updateRoomField(
                              "en",
                              selectedRoomSlug,
                              "collageDescription",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ARABIC FIELDS */}
                {(editLang === "both" || editLang === "ar") && (
                  <div className="oz-admin-card" dir="rtl">
                    <div className="oz-admin-card-head">
                      <h3>🇸🇦 المحتوى العربي للغرفة (Arabic)</h3>
                      <p>يظهر للزوار عند تصفح الموقع باللغة العربية.</p>
                    </div>

                    <div className="oz-admin-form-grid">
                      <div className="oz-admin-field">
                        <label>اسم الغرفة (AR)</label>
                        <input
                          type="text"
                          value={activeRoomAr.name}
                          onChange={(e) =>
                            updateRoomField("ar", selectedRoomSlug, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>تصنيف الغرفة (AR)</label>
                        <input
                          type="text"
                          value={activeRoomAr.categoryEyebrow}
                          onChange={(e) =>
                            updateRoomField(
                              "ar",
                              selectedRoomSlug,
                              "categoryEyebrow",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>المساحة (مثال: 35 متر مربع)</label>
                        <input
                          type="text"
                          value={activeRoomAr.size}
                          onChange={(e) =>
                            updateRoomField("ar", selectedRoomSlug, "size", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>نوع السرير (مثال: سرير كينغ واحد)</label>
                        <input
                          type="text"
                          value={activeRoomAr.bed}
                          onChange={(e) =>
                            updateRoomField("ar", selectedRoomSlug, "bed", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>السعة / عدد الضيوف (AR)</label>
                        <input
                          type="text"
                          value={activeRoomAr.occupancy}
                          onChange={(e) =>
                            updateRoomField("ar", selectedRoomSlug, "occupancy", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field">
                        <label>الإطلالة (مثال: إطلالة على البحر الأحمر)</label>
                        <input
                          type="text"
                          value={activeRoomAr.view}
                          onChange={(e) =>
                            updateRoomField("ar", selectedRoomSlug, "view", e.target.value)
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>وصف البطاقة وصفحة الحجز (AR)</label>
                        <textarea
                          rows={3}
                          value={activeRoomAr.cardDescription}
                          onChange={(e) =>
                            updateRoomField(
                              "ar",
                              selectedRoomSlug,
                              "cardDescription",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>عنوان قسم المعرض في صفحة الغرفة (AR)</label>
                        <input
                          type="text"
                          value={activeRoomAr.collageHeading}
                          onChange={(e) =>
                            updateRoomField(
                              "ar",
                              selectedRoomSlug,
                              "collageHeading",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="oz-admin-field is-full">
                        <label>وصف قسم المعرض في صفحة الغرفة (AR)</label>
                        <textarea
                          rows={3}
                          value={activeRoomAr.collageDescription}
                          onChange={(e) =>
                            updateRoomField(
                              "ar",
                              selectedRoomSlug,
                              "collageDescription",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: ROOM IMAGES & PHOTO GALLERY MANAGER
              ================================================================= */}
          {activeTab === "images" && (
            <div className="oz-admin-tab-panel">
              {/* Row 1: Hero Banner Image & Room Card Thumbnail */}
              <div className="oz-admin-panel-grid-2">
                {/* Main Hero Image */}
                <div className="oz-admin-card">
                  <div className="oz-admin-card-head">
                    <h3>1. Main Full-Screen Hero Image</h3>
                    <p>Displayed at the top of the {activeRoomEn.name} dedicated page.</p>
                  </div>
                  <div className="oz-admin-featured-img-box">
                    <img src={activeRoomEn.heroImage} alt="Hero Preview" />
                  </div>
                  <div className="oz-admin-img-actions">
                    <button
                      type="button"
                      className="oz-admin-btn-primary"
                      onClick={() => triggerFileBrowser({ type: "hero" })}
                    >
                      📤 Upload from Device
                    </button>
                    <button
                      type="button"
                      className="oz-admin-btn-secondary"
                      onClick={() => setLibraryPickerTarget({ type: "hero" })}
                    >
                      🖼️ Choose from Hotel Library
                    </button>
                  </div>
                </div>

                {/* Card & Booking Thumbnail Image */}
                <div className="oz-admin-card">
                  <div className="oz-admin-card-head">
                    <h3>2. Room Card & Booking Thumbnail</h3>
                    <p>Displayed on Room Category cards and the Booking Engine page.</p>
                  </div>
                  <div className="oz-admin-featured-img-box">
                    <img src={activeRoomEn.cardImage} alt="Card Preview" />
                  </div>
                  <div className="oz-admin-img-actions">
                    <button
                      type="button"
                      className="oz-admin-btn-primary"
                      onClick={() => triggerFileBrowser({ type: "card" })}
                    >
                      📤 Upload from Device
                    </button>
                    <button
                      type="button"
                      className="oz-admin-btn-secondary"
                      onClick={() => setLibraryPickerTarget({ type: "card" })}
                    >
                      🖼️ Choose from Hotel Library
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: 5 Asymmetrical Bento Collage Images */}
              <div className="oz-admin-card" style={{ marginTop: "24px" }}>
                <div className="oz-admin-card-head">
                  <h3>3. 5-Photo Bento Collage Showcase</h3>
                  <p>
                    The 5 featured photographs displayed in the asymmetrical collage on the{" "}
                    {activeRoomEn.name} detail page.
                  </p>
                </div>

                <div className="oz-admin-collage-grid">
                  {activeRoomEn.collageImages.map((imgSrc, idx) => (
                    <div key={`collage-slot-${idx}`} className="oz-admin-collage-slot">
                      <div className="oz-admin-collage-thumb">
                        <img src={imgSrc} alt={`Collage ${idx + 1}`} />
                        <span className="oz-admin-slot-badge">Slot #{idx + 1}</span>
                      </div>
                      <div className="oz-admin-slot-btns">
                        <button
                          type="button"
                          onClick={() => triggerFileBrowser({ type: "collage", index: idx })}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setLibraryPickerTarget({ type: "collage", index: idx })
                          }
                        >
                          Library
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Full Room Photo Gallery (Lightbox Images) */}
              <div className="oz-admin-card" style={{ marginTop: "24px" }}>
                <div className="oz-admin-card-head oz-admin-card-head-flex">
                  <div>
                    <h3>
                      4. Full Room Photo Gallery ({activeRoomEn.allGalleryImages.length} Photos)
                    </h3>
                    <p>
                      Shown when guests click &ldquo;View Gallery&rdquo; or the camera icon on the
                      Booking Engine.
                    </p>
                  </div>
                  <div className="oz-admin-img-actions">
                    <button
                      type="button"
                      className="oz-admin-btn-primary"
                      onClick={() => triggerFileBrowser({ type: "gallery-add" })}
                    >
                      + Upload New Photos
                    </button>
                    <button
                      type="button"
                      className="oz-admin-btn-secondary"
                      onClick={() => setLibraryPickerTarget({ type: "gallery-add" })}
                    >
                      + Add from Library
                    </button>
                  </div>
                </div>

                {/* Add Image by URL Bar */}
                <div className="oz-admin-url-add-bar">
                  <input
                    type="text"
                    placeholder="Or paste an image URL (https://... or /images/ozpark/...) to add to gallery"
                    value={newPhotoUrlInput}
                    onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPhotoUrlInput.trim()) return;
                      applyImageSelection(newPhotoUrlInput.trim(), { type: "gallery-add" });
                      setNewPhotoUrlInput("");
                    }}
                  >
                    Add Photo URL
                  </button>
                </div>

                <div className="oz-admin-gallery-grid">
                  {activeRoomEn.allGalleryImages.map((imgSrc, idx) => (
                    <div key={`${imgSrc}-${idx}`} className="oz-admin-gallery-item">
                      <div className="oz-admin-gallery-thumb">
                        <img src={imgSrc} alt={`${activeRoomEn.name} ${idx + 1}`} />
                        <span className="oz-admin-slot-badge">#{idx + 1}</span>
                      </div>
                      <div className="oz-admin-gallery-controls">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveGalleryImage(idx, -1)}
                          title="Move Left"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applyImageSelection(imgSrc, { type: "card" })
                          }
                          title="Use as Room Card Cover"
                        >
                          Set Cover
                        </button>
                        <button
                          type="button"
                          disabled={idx === activeRoomEn.allGalleryImages.length - 1}
                          onClick={() => moveGalleryImage(idx, 1)}
                          title="Move Right"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          className="is-danger"
                          disabled={activeRoomEn.allGalleryImages.length <= 1}
                          onClick={() => removeGalleryImage(idx)}
                          title="Delete Photo"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: LIVE INTERACTIVE PREVIEW (BOOKING ENGINE CARD + CATEGORY CARD)
              ================================================================= */}
          {activeTab === "preview" && (
            <div className="oz-admin-tab-panel">
              <div className="oz-admin-card">
                <div className="oz-admin-card-head oz-admin-card-head-flex">
                  <div>
                    <h3>Live Booking Engine Card Preview</h3>
                    <p>
                      Exact preview of how <strong>{activeRoomEn.name}</strong> appears on the
                      Atlantis-style Booking Page (#booking).
                    </p>
                  </div>
                  <button
                    type="button"
                    className="oz-admin-btn-primary"
                    onClick={() => onOpenBookingPage(selectedRoomSlug)}
                  >
                    Open Live Booking Page →
                  </button>
                </div>

                {/* Embedded 1:1 Atlantis Booking Room Card Preview */}
                <div style={{ background: "#eaf1f8", padding: "24px", borderRadius: "4px" }}>
                  <article className="ab-room-card" style={{ marginBottom: 0 }}>
                    <div className="ab-room-top">
                      <div className="ab-room-thumb">
                        <img src={activeRoomEn.cardImage} alt={activeRoomEn.name} />
                        <div className="ab-room-thumb-badges">
                          <span className="ab-thumb-badge">🛏</span>
                          <span className="ab-thumb-badge">
                            📷 {activeRoomEn.allGalleryImages.length}
                          </span>
                        </div>
                      </div>

                      <div className="ab-room-info">
                        <h3 className="ab-room-name">{activeRoomEn.name}</h3>
                        <div className="ab-room-pills">
                          <span className="ab-room-pill is-primary">{activeRoomEn.view}</span>
                          <span className="ab-room-pill">{activeRoomEn.bed}</span>
                        </div>
                        <p className="ab-room-specs">
                          {activeRoomEn.occupancy} &nbsp;|&nbsp; {activeRoomEn.bed} &nbsp;|&nbsp;{" "}
                          {activeRoomEn.size}
                        </p>
                        <p className="ab-room-desc">{activeRoomEn.cardDescription}</p>
                        <div className="arc-room-card-specs" style={{ marginTop: "8px" }}>
                          <span className="arc-room-spec-item">
                            <AtlantisRoomIcon name="size" stroke="#2559a8" size={16} />
                            <span>{activeRoomEn.size}</span>
                          </span>
                          <span className="arc-room-spec-item">
                            <AtlantisRoomIcon name="guests" stroke="#2559a8" size={16} />
                            <span>{activeRoomEn.occupancy}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ab-rate-row">
                      <div className="ab-rate-left">
                        <div className="ab-rate-title-wrap">
                          <h4 className="ab-rate-title">Room Only</h4>
                        </div>
                        <ul className="ab-rate-bullets">
                          <li>Flexible Room Only rate (meals not included)</li>
                          <li>Free cancellation up to 24 hours before arrival</li>
                        </ul>
                      </div>
                      <div className="ab-rate-right">
                        <div>
                          <div className="ab-rate-price">
                            SAR {activeBaseRate.toLocaleString()}
                          </div>
                          <div className="ab-rate-per-night">Per Night</div>
                          <div className="ab-rate-tax-note">Excluding taxes & fees</div>
                        </div>
                        <button
                          type="button"
                          className="ab-rate-book-btn"
                          onClick={() => onOpenBookingPage(selectedRoomSlug)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    <div className="ab-rate-row">
                      <div className="ab-rate-left">
                        <div className="ab-rate-title-wrap">
                          <h4 className="ab-rate-title">With Breakfast</h4>
                          <span className="ab-breakfast-pill">
                            +SAR {cmsState.breakfastPriceSar} per person
                          </span>
                        </div>
                        <ul className="ab-rate-bullets">
                          <li>
                            Daily breakfast buffet at Diwan Mada Restaurant (SAR{" "}
                            {cmsState.breakfastPriceSar} per person / night)
                          </li>
                          <li>Free cancellation up to 24 hours before arrival</li>
                        </ul>
                      </div>
                      <div className="ab-rate-right">
                        <div>
                          <div className="ab-rate-price">
                            SAR {activeWithBreakfast1P.toLocaleString()}
                          </div>
                          <div className="ab-rate-per-night">Per Night</div>
                          <div className="ab-rate-tax-note">
                            Includes breakfast (SAR {cmsState.breakfastPriceSar} × 1 person)
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ab-rate-book-btn"
                          onClick={() => onOpenBookingPage(selectedRoomSlug)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* HOTEL PHOTO LIBRARY MODAL PICKER */}
      {libraryPickerTarget && (
        <div
          className="oz-admin-modal-backdrop"
          onClick={() => setLibraryPickerTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="oz-admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="oz-admin-modal-head">
              <div>
                <h3>Select Photo from OZ Park Hotel Media Library</h3>
                <p>Click any photograph below to assign it immediately.</p>
              </div>
              <button
                type="button"
                className="oz-admin-modal-close"
                onClick={() => setLibraryPickerTarget(null)}
              >
                ✕
              </button>
            </div>

            <div className="oz-admin-library-grid">
              {allHotelLibraryPhotos.map((src) => (
                <button
                  key={src}
                  type="button"
                  className="oz-admin-library-item"
                  onClick={() => applyImageSelection(src, libraryPickerTarget)}
                >
                  <img src={src} alt="Hotel Library" loading="lazy" />
                  <span>{src.split("/").slice(-2).join("/")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
