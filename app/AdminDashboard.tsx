"use client";

import React, { useRef, useState } from "react";
import {
  type RoomCategorySlug,
  type RoomDetailData,
  type RoomSlug,
  specificRoomsData,
} from "./roomsData";

export type OzParkRoomsCmsState = {
  roomOrder?: RoomSlug[];
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

export function getActiveRoomSlugs(state: OzParkRoomsCmsState): RoomSlug[] {
  const rawOrder =
    state.roomOrder && state.roomOrder.length > 0
      ? state.roomOrder
      : Object.keys(state.roomsData?.en || {});
  return rawOrder.filter((slug) => Boolean(state.roomsData?.en?.[slug]));
}

export function getInitialCmsState(): OzParkRoomsCmsState {
  return {
    roomOrder: [...ALL_ROOM_SLUGS],
    roomsData: JSON.parse(JSON.stringify(specificRoomsData)),
    baseRatesSar: { ...DEFAULT_BASE_RATES_SAR },
    breakfastPriceSar: 50,
    weekdayDiscountPct: 25,
    roomAvailable: { ...DEFAULT_ROOM_AVAILABLE },
    updatedAt: new Date().toISOString(),
  };
}

// Compress uploaded image files via HTML5 Canvas so they store cleanly in localStorage
async function compressUploadedImage(
  file: File,
  maxWidth = 1600,
  quality = 0.84
): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Helper to ensure collageImages always has 5 valid image URLs from gallery
function buildFiveCollageImages(
  gallery: string[],
  fallbackCover: string
): [string, string, string, string, string] {
  const pool = gallery.length > 0 ? gallery : [fallbackCover];
  return [
    pool[0] || fallbackCover,
    pool[1] || pool[0] || fallbackCover,
    pool[2] || pool[0] || fallbackCover,
    pool[3] || pool[1] || pool[0] || fallbackCover,
    pool[4] || pool[2] || pool[0] || fallbackCover,
  ];
}

const CATEGORY_META: Record<
  RoomCategorySlug,
  { label: string; eyebrowEn: string; eyebrowAr: string; templateSlug: RoomSlug }
> = {
  rooms: {
    label: "Rooms",
    eyebrowEn: "DELUXE & SUPERIOR ROOMS",
    eyebrowAr: "غرف الديلوكس والسوبيريور",
    templateSlug: "deluxe-room",
  },
  studios: {
    label: "Studios",
    eyebrowEn: "SUPERIOR STUDIOS",
    eyebrowAr: "استوديو سوبيريور",
    templateSlug: "superior-studio",
  },
  suites: {
    label: "Suites",
    eyebrowEn: "LUXURY SUITES",
    eyebrowAr: "الأجنحة الفاخرة",
    templateSlug: "superior-suite",
  },
};

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
    return (
      window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "authenticated" ||
      window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "authenticated"
    );
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Minimalist Dashboard state
  const [categoryFilter, setCategoryFilter] = useState<"all" | RoomCategorySlug>("all");
  const [editingRoomSlug, setEditingRoomSlug] = useState<RoomSlug | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<RoomSlug | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showArabicSpecs, setShowArabicSpecs] = useState(false);

  // New Room Form state
  const [newRoomCategory, setNewRoomCategory] = useState<RoomCategorySlug>("rooms");
  const [newRoomNameEn, setNewRoomNameEn] = useState("");
  const [newRoomNameAr, setNewRoomNameAr] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState<number>(480);
  const [newRoomSize, setNewRoomSize] = useState("38 sqm");
  const [newRoomBed, setNewRoomBed] = useState("1 King Bed");
  const [newRoomGuests, setNewRoomGuests] = useState("Up to 2 adults + 1 child");
  const [newRoomView, setNewRoomView] = useState("Red Sea View");
  const [newRoomDescEn, setNewRoomDescEn] = useState(
    "A refined coastal sanctuary featuring bespoke contemporary furnishings and serene views."
  );
  const [newRoomDescAr, setNewRoomDescAr] = useState(
    "ملاذ ساحلي أنيق يجمع بين التصاميم العصرية الفاخرة والإطلالات الهادئة."
  );
  const [newRoomPhotos, setNewRoomPhotos] = useState<string[]>([
    "/images/ozpark/rooms/deluxe-room/1.jpg",
    "/images/ozpark/rooms/deluxe-room/2.jpg",
    "/images/ozpark/rooms/deluxe-room/3.jpg",
  ]);

  // Media Library Picker
  const [libraryTarget, setLibraryTarget] = useState<
    null | "edit-cover" | "edit-gallery" | "new-room"
  >(null);

  const coverUploadRef = useRef<HTMLInputElement | null>(null);
  const galleryUploadRef = useRef<HTMLInputElement | null>(null);
  const newRoomUploadRef = useRef<HTMLInputElement | null>(null);

  const allRoomSlugs = getActiveRoomSlugs(cmsState);

  const triggerToast = (message: string) => {
    setSaveToast(message);
    window.setTimeout(() => {
      setSaveToast((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginEmail.trim().toLowerCase() === ADMIN_VALID_USER.toLowerCase() &&
      loginPassword === ADMIN_VALID_PASS
    ) {
      setIsAuthenticated(true);
      setLoginError(null);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "authenticated");
        if (rememberMe) {
          window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "authenticated");
        } else {
          window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
        }
      }
      triggerToast("Welcome to OZ Park Hotel Admin");
    } else {
      setLoginError("Invalid email or password. Please verify your credentials.");
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

  // All built-in hotel photos for the quick Media Picker
  const builtInMediaLibrary = React.useMemo(() => {
    const set = new Set<string>();
    Object.values(specificRoomsData.en).forEach((rm) => {
      set.add(rm.heroImage);
      set.add(rm.cardImage);
      rm.allGalleryImages.forEach((img) => set.add(img));
    });
    return Array.from(set);
  }, []);

  // Update helpers
  const updateRoomRate = (slug: RoomSlug, rawVal: number) => {
    const clean = Math.max(50, Math.round(Number(rawVal) || 0));
    onUpdateCmsState({
      ...cmsState,
      baseRatesSar: {
        ...cmsState.baseRatesSar,
        [slug]: clean,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleRoomAvailability = (slug: RoomSlug) => {
    const nextAvail = !(cmsState.roomAvailable[slug] ?? true);
    onUpdateCmsState({
      ...cmsState,
      roomAvailable: {
        ...cmsState.roomAvailable,
        [slug]: nextAvail,
      },
      updatedAt: new Date().toISOString(),
    });
    triggerToast(
      `${cmsState.roomsData.en[slug]?.name || "Room"} set to ${
        nextAvail ? "Available" : "Sold Out"
      }`
    );
  };

  const updateRoomField = (
    slug: RoomSlug,
    lang: "en" | "ar",
    field: keyof RoomDetailData,
    value: string
  ) => {
    const currentRoom = cmsState.roomsData[lang][slug];
    if (!currentRoom) return;
    onUpdateCmsState({
      ...cmsState,
      roomsData: {
        ...cmsState.roomsData,
        [lang]: {
          ...cmsState.roomsData[lang],
          [slug]: {
            ...currentRoom,
            [field]: value,
          },
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRoomCategory = (slug: RoomSlug, cat: RoomCategorySlug) => {
    const meta = CATEGORY_META[cat];
    onUpdateCmsState({
      ...cmsState,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [slug]: {
            ...cmsState.roomsData.en[slug],
            categorySlug: cat,
            categoryEyebrow: meta.eyebrowEn,
          },
        },
        ar: {
          ...cmsState.roomsData.ar,
          [slug]: {
            ...cmsState.roomsData.ar[slug],
            categorySlug: cat,
            categoryEyebrow: meta.eyebrowAr,
          },
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const updateRoomCoverPhoto = (slug: RoomSlug, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    const enRm = cmsState.roomsData.en[slug];
    const arRm = cmsState.roomsData.ar[slug];
    if (!enRm || !arRm) return;

    const updatedGallery = enRm.allGalleryImages.includes(imageUrl)
      ? [imageUrl, ...enRm.allGalleryImages.filter((u) => u !== imageUrl)]
      : [imageUrl, ...enRm.allGalleryImages];
    const updatedCollage = buildFiveCollageImages(updatedGallery, imageUrl);

    onUpdateCmsState({
      ...cmsState,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [slug]: {
            ...enRm,
            cardImage: imageUrl,
            heroImage: imageUrl,
            allGalleryImages: updatedGallery,
            collageImages: updatedCollage,
          },
        },
        ar: {
          ...cmsState.roomsData.ar,
          [slug]: {
            ...arRm,
            cardImage: imageUrl,
            heroImage: imageUrl,
            allGalleryImages: updatedGallery,
            collageImages: updatedCollage,
          },
        },
      },
      updatedAt: new Date().toISOString(),
    });
    triggerToast("Main cover photo updated");
  };

  const updateRoomGalleryList = (slug: RoomSlug, nextGallery: string[]) => {
    if (nextGallery.length === 0) return;
    const enRm = cmsState.roomsData.en[slug];
    const arRm = cmsState.roomsData.ar[slug];
    if (!enRm || !arRm) return;

    const cover = nextGallery[0];
    const nextCollage = buildFiveCollageImages(nextGallery, cover);

    onUpdateCmsState({
      ...cmsState,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [slug]: {
            ...enRm,
            cardImage: cover,
            heroImage: cover,
            allGalleryImages: nextGallery,
            collageImages: nextCollage,
          },
        },
        ar: {
          ...cmsState.roomsData.ar,
          [slug]: {
            ...arRm,
            cardImage: cover,
            heroImage: cover,
            allGalleryImages: nextGallery,
            collageImages: nextCollage,
          },
        },
      },
      updatedAt: new Date().toISOString(),
    });
  };

  // Create a brand new room and add it to the website
  const handleCreateNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const titleEn = newRoomNameEn.trim();
    if (!titleEn) return;
    const titleAr = newRoomNameAr.trim() || titleEn;

    const baseSlug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const uniqueSlug = (
      cmsState.roomsData.en[baseSlug]
        ? `${baseSlug}-${Date.now().toString().slice(-4)}`
        : baseSlug || `room-${Date.now().toString().slice(-4)}`
    ) as RoomSlug;

    const meta = CATEGORY_META[newRoomCategory];
    const templateEn = specificRoomsData.en[meta.templateSlug];
    const templateAr = specificRoomsData.ar[meta.templateSlug];

    const gallery =
      newRoomPhotos.length > 0
        ? newRoomPhotos
        : [...templateEn.allGalleryImages.slice(0, 5)];
    const cover = gallery[0];
    const collage = buildFiveCollageImages(gallery, cover);

    const createdEn: RoomDetailData = {
      ...JSON.parse(JSON.stringify(templateEn)),
      slug: uniqueSlug,
      categorySlug: newRoomCategory,
      categoryEyebrow: meta.eyebrowEn,
      name: titleEn,
      cardDescription: newRoomDescEn.trim() || templateEn.cardDescription,
      size: newRoomSize.trim() || "35 sqm",
      bed: newRoomBed.trim() || "1 King Bed",
      occupancy: newRoomGuests.trim() || "Up to 2 adults",
      view: newRoomView.trim() || "Red Sea View",
      heroImage: cover,
      cardImage: cover,
      collageImages: collage,
      allGalleryImages: gallery,
    };

    const createdAr: RoomDetailData = {
      ...JSON.parse(JSON.stringify(templateAr)),
      slug: uniqueSlug,
      categorySlug: newRoomCategory,
      categoryEyebrow: meta.eyebrowAr,
      name: titleAr,
      cardDescription: newRoomDescAr.trim() || newRoomDescEn.trim() || templateAr.cardDescription,
      size: newRoomSize.trim() || "35 متر مربع",
      bed: newRoomBed.trim() || "سرير كينغ",
      occupancy: newRoomGuests.trim() || "حتى شخصين بالغين",
      view: newRoomView.trim() || "إطلالة على البحر الأحمر",
      heroImage: cover,
      cardImage: cover,
      collageImages: collage,
      allGalleryImages: gallery,
    };

    const nextOrder = [...allRoomSlugs, uniqueSlug];
    onUpdateCmsState({
      ...cmsState,
      roomOrder: nextOrder,
      roomsData: {
        en: {
          ...cmsState.roomsData.en,
          [uniqueSlug]: createdEn,
        },
        ar: {
          ...cmsState.roomsData.ar,
          [uniqueSlug]: createdAr,
        },
      },
      baseRatesSar: {
        ...cmsState.baseRatesSar,
        [uniqueSlug]: Math.max(50, Math.round(Number(newRoomPrice) || 450)),
      },
      roomAvailable: {
        ...cmsState.roomAvailable,
        [uniqueSlug]: true,
      },
      updatedAt: new Date().toISOString(),
    });

    setIsAddModalOpen(false);
    setNewRoomNameEn("");
    setNewRoomNameAr("");
    triggerToast(`Added "${titleEn}" to the website`);
  };

  // Delete a room from the website
  const handleDeleteRoom = (slug: RoomSlug) => {
    if (allRoomSlugs.length <= 1) {
      triggerToast("At least one room must remain on the website.");
      setDeleteConfirmSlug(null);
      return;
    }
    const roomTitle = cmsState.roomsData.en[slug]?.name || slug;
    const nextOrder = allRoomSlugs.filter((s) => s !== slug);
    const nextEn = { ...cmsState.roomsData.en };
    const nextAr = { ...cmsState.roomsData.ar };
    const nextRates = { ...cmsState.baseRatesSar };
    const nextAvail = { ...cmsState.roomAvailable };

    delete nextEn[slug];
    delete nextAr[slug];
    delete nextRates[slug];
    delete nextAvail[slug];

    onUpdateCmsState({
      ...cmsState,
      roomOrder: nextOrder,
      roomsData: { en: nextEn, ar: nextAr },
      baseRatesSar: nextRates,
      roomAvailable: nextAvail,
      updatedAt: new Date().toISOString(),
    });

    setDeleteConfirmSlug(null);
    if (editingRoomSlug === slug) {
      setEditingRoomSlug(null);
    }
    triggerToast(`Deleted "${roomTitle}"`);
  };

  const filteredSlugs = allRoomSlugs.filter((slug) => {
    if (categoryFilter === "all") return true;
    return cmsState.roomsData.en[slug]?.categorySlug === categoryFilter;
  });

  // ============================================================================
  // 1. MINIMALIST LUXURY LOGIN GATE
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="oz-admin-login-shell">
        <div className="oz-admin-login-card">
          <button
            type="button"
            className="oz-admin-wordmark oz-admin-wordmark--login"
            onClick={onOpenWebsiteHome}
          >
            <span className="oz-admin-wordmark-emblem">OZ</span>
            <span className="oz-admin-wordmark-text">PARK</span>
          </button>

          <p className="oz-admin-login-eyebrow">ADMINISTRATION PORTAL</p>
          <h1 className="oz-admin-login-title">Rooms & Rates Management</h1>
          <p className="oz-admin-login-subtitle">
            Sign in to manage rooms, nightly rates, and photo galleries.
          </p>

          <form className="oz-admin-login-form" onSubmit={handleLoginSubmit}>
            <div className="oz-admin-field">
              <label htmlFor="oz-admin-email">Email Address</label>
              <input
                id="oz-admin-email"
                type="email"
                required
                autoComplete="username"
                placeholder="jacsfourseasons@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="oz-admin-field">
              <label htmlFor="oz-admin-password">Password</label>
              <div className="oz-admin-pass-row">
                <input
                  id="oz-admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="oz-admin-pass-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="oz-admin-login-meta">
              <label className="oz-admin-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            {loginError && <div className="oz-admin-login-error">{loginError}</div>}

            <button type="submit" className="oz-admin-primary-btn oz-admin-login-submit">
              Sign In
            </button>
          </form>

          <button
            type="button"
            className="oz-admin-back-site-link"
            onClick={onOpenWebsiteHome}
          >
            ← Return to OZ Park Hotel Website
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. MINIMALIST LUXURY ROOMS DASHBOARD
  // ============================================================================
  const editingRoomEn = editingRoomSlug ? cmsState.roomsData.en[editingRoomSlug] : null;
  const editingRoomAr = editingRoomSlug ? cmsState.roomsData.ar[editingRoomSlug] : null;

  return (
    <div className="oz-admin-shell">
      {/* Toast Notification */}
      {saveToast && (
        <div className="oz-admin-toast" role="status">
          <span className="oz-admin-toast-dot" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Minimalist Top Navigation Bar */}
      <header className="oz-admin-topbar">
        <div className="oz-admin-topbar-inner">
          <div className="oz-admin-topbar-left">
            <button
              type="button"
              className="oz-admin-wordmark"
              onClick={onOpenWebsiteHome}
              title="Back to OZ Park Hotel Website"
            >
              <span className="oz-admin-wordmark-emblem">OZ</span>
              <span className="oz-admin-wordmark-text">PARK</span>
            </button>
            <span className="oz-admin-topbar-divider" />
            <span className="oz-admin-topbar-label">Rooms & Pricing</span>
          </div>

          <div className="oz-admin-topbar-right">
            <button
              type="button"
              className="oz-admin-ghost-btn"
              onClick={onOpenWebsiteHome}
            >
              View Website
            </button>
            <button
              type="button"
              className="oz-admin-ghost-btn"
              onClick={() => onOpenBookingPage()}
            >
              Booking Page
            </button>
            <button
              type="button"
              className="oz-admin-ghost-btn oz-admin-ghost-btn--signout"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="oz-admin-container">
        {/* Clean Header Row: Title + Global Breakfast Setting + Add New Room */}
        <section className="oz-admin-header-bar">
          <div className="oz-admin-header-title-group">
            <h1>Rooms & Suites</h1>
            <p>
              Manage room rates, descriptions, photos, or add and remove rooms on the live website.
            </p>
          </div>

          <div className="oz-admin-header-controls">
            <div className="oz-admin-inline-setting">
              <label htmlFor="global-breakfast-sar">Breakfast Add-On</label>
              <div className="oz-admin-inline-input-wrap">
                <span>SAR</span>
                <input
                  id="global-breakfast-sar"
                  type="number"
                  min={0}
                  step={5}
                  value={cmsState.breakfastPriceSar}
                  onChange={(e) =>
                    onUpdateCmsState({
                      ...cmsState,
                      breakfastPriceSar: Math.max(0, Math.round(Number(e.target.value) || 0)),
                      updatedAt: new Date().toISOString(),
                    })
                  }
                />
                <span>/ person</span>
              </div>
            </div>

            <button
              type="button"
              className="oz-admin-primary-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add New Room
            </button>
          </div>
        </section>

        {/* Filter Bar + Reset Link */}
        <div className="oz-admin-toolbar">
          <div className="oz-admin-filter-pills">
            {(
              [
                ["all", `All Rooms (${allRoomSlugs.length})`],
                [
                  "rooms",
                  `Rooms (${
                    allRoomSlugs.filter((s) => cmsState.roomsData.en[s]?.categorySlug === "rooms")
                      .length
                  })`,
                ],
                [
                  "studios",
                  `Studios (${
                    allRoomSlugs.filter((s) => cmsState.roomsData.en[s]?.categorySlug === "studios")
                      .length
                  })`,
                ],
                [
                  "suites",
                  `Suites (${
                    allRoomSlugs.filter((s) => cmsState.roomsData.en[s]?.categorySlug === "suites")
                      .length
                  })`,
                ],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`oz-admin-pill ${categoryFilter === key ? "is-active" : ""}`}
                onClick={() => setCategoryFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="oz-admin-reset-link"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all rooms, prices, and photos back to the original website defaults?"
                )
              ) {
                onResetCmsState();
                triggerToast("Restored default rooms and pricing");
              }
            }}
          >
            Reset to Defaults
          </button>
        </div>

        {/* Minimalist 3-Column Visual Room Grid */}
        <section className="oz-admin-grid">
          {filteredSlugs.map((slug) => {
            const rmEn = cmsState.roomsData.en[slug];
            const rmAr = cmsState.roomsData.ar[slug];
            if (!rmEn || !rmAr) return null;
            const rate = cmsState.baseRatesSar[slug] ?? 400;
            const isAvail = cmsState.roomAvailable[slug] ?? true;
            const catLabel = CATEGORY_META[rmEn.categorySlug]?.label || "Room";

            return (
              <article
                key={slug}
                className={`oz-admin-card ${!isAvail ? "is-unavailable" : ""}`}
              >
                {/* Room Photo & Badges */}
                <div
                  className="oz-admin-card-media"
                  onClick={() => setEditingRoomSlug(slug)}
                >
                  <img src={rmEn.cardImage} alt={rmEn.name} />
                  <span className="oz-admin-card-cat">{catLabel}</span>
                  <button
                    type="button"
                    className={`oz-admin-status-pill ${isAvail ? "is-live" : "is-hidden"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoomAvailability(slug);
                    }}
                    title="Click to toggle availability"
                  >
                    <span className="oz-admin-status-dot" />
                    {isAvail ? "Available" : "Sold Out"}
                  </button>
                  <span className="oz-admin-photo-count">
                    {rmEn.allGalleryImages.length} Photos
                  </span>
                </div>

                {/* Room Info */}
                <div className="oz-admin-card-body">
                  <div className="oz-admin-card-titles">
                    <h3>{rmEn.name}</h3>
                    <span className="oz-admin-card-ar" dir="rtl">
                      {rmAr.name}
                    </span>
                  </div>

                  <p className="oz-admin-card-specs">
                    {rmEn.size} &bull; {rmEn.bed} &bull; {rmEn.view}
                  </p>

                  {/* Instant Inline Price Editor */}
                  <div className="oz-admin-price-box">
                    <div className="oz-admin-price-box-left">
                      <span className="oz-admin-price-label">Nightly Rate (Room Only)</span>
                      <span className="oz-admin-price-sub">
                        With Breakfast: SAR {rate + cmsState.breakfastPriceSar}
                      </span>
                    </div>
                    <div className="oz-admin-price-input-group">
                      <span>SAR</span>
                      <input
                        type="number"
                        min={50}
                        step={10}
                        value={rate}
                        onChange={(e) => updateRoomRate(slug, Number(e.target.value))}
                        aria-label={`${rmEn.name} nightly rate in SAR`}
                      />
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="oz-admin-card-actions">
                    <button
                      type="button"
                      className="oz-admin-edit-btn"
                      onClick={() => setEditingRoomSlug(slug)}
                    >
                      Edit Room & Photos
                    </button>
                    <button
                      type="button"
                      className="oz-admin-preview-icon-btn"
                      onClick={() => onOpenRoomPage(slug)}
                      title="Preview Room Page on Website"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="oz-admin-delete-icon-btn"
                      onClick={() => setDeleteConfirmSlug(slug)}
                      title="Delete Room"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {/* ==========================================================================
          SLIDE-OVER / MODAL: EDIT EXISTING ROOM (Minimalist Single-Sheet Editor)
          ========================================================================== */}
      {editingRoomSlug && editingRoomEn && editingRoomAr && (
        <div
          className="oz-admin-modal-backdrop"
          onClick={() => setEditingRoomSlug(null)}
        >
          <div
            className="oz-admin-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">EDIT ROOM</span>
                <h2>{editingRoomEn.name}</h2>
              </div>
              <div className="oz-admin-drawer-header-actions">
                <button
                  type="button"
                  className="oz-admin-ghost-btn"
                  onClick={() => onOpenRoomPage(editingRoomSlug)}
                >
                  Open Live Page ↗
                </button>
                <button
                  type="button"
                  className="oz-admin-close-btn"
                  onClick={() => setEditingRoomSlug(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="oz-admin-drawer-body">
              {/* SECTION 1: PRICING, CATEGORY & AVAILABILITY */}
              <div className="oz-admin-section-block">
                <h3 className="oz-admin-section-heading">1. Pricing & Category</h3>
                <div className="oz-admin-form-grid-3">
                  <div className="oz-admin-field">
                    <label>Nightly Rate (SAR)</label>
                    <input
                      type="number"
                      min={50}
                      step={10}
                      value={cmsState.baseRatesSar[editingRoomSlug] ?? 400}
                      onChange={(e) =>
                        updateRoomRate(editingRoomSlug, Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="oz-admin-field">
                    <label>Room Category</label>
                    <select
                      value={editingRoomEn.categorySlug}
                      onChange={(e) =>
                        updateRoomCategory(
                          editingRoomSlug,
                          e.target.value as RoomCategorySlug
                        )
                      }
                    >
                      <option value="rooms">Deluxe & Superior Rooms</option>
                      <option value="studios">Superior Studios</option>
                      <option value="suites">Luxury Suites</option>
                    </select>
                  </div>

                  <div className="oz-admin-field">
                    <label>Booking Status</label>
                    <select
                      value={
                        (cmsState.roomAvailable[editingRoomSlug] ?? true)
                          ? "available"
                          : "soldout"
                      }
                      onChange={(e) => {
                        const avail = e.target.value === "available";
                        onUpdateCmsState({
                          ...cmsState,
                          roomAvailable: {
                            ...cmsState.roomAvailable,
                            [editingRoomSlug]: avail,
                          },
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                    >
                      <option value="available">Available for Booking</option>
                      <option value="soldout">Sold Out / Hidden</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ROOM NAME, SPECS & DESCRIPTION */}
              <div className="oz-admin-section-block">
                <div className="oz-admin-section-heading-row">
                  <h3 className="oz-admin-section-heading">2. Room Details & Specifications</h3>
                  <button
                    type="button"
                    className="oz-admin-text-link"
                    onClick={() => setShowArabicSpecs((v) => !v)}
                  >
                    {showArabicSpecs ? "Hide Arabic Specs" : "Edit Arabic Specs"}
                  </button>
                </div>

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field">
                    <label>Room Name (English)</label>
                    <input
                      type="text"
                      value={editingRoomEn.name}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "en", "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="oz-admin-field" dir="rtl">
                    <label>اسم الغرفة (Arabic)</label>
                    <input
                      type="text"
                      value={editingRoomAr.name}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "ar", "name", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="oz-admin-form-grid-4">
                  <div className="oz-admin-field">
                    <label>Size</label>
                    <input
                      type="text"
                      value={editingRoomEn.size}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "en", "size", e.target.value)
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>Bed Type</label>
                    <input
                      type="text"
                      value={editingRoomEn.bed}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "en", "bed", e.target.value)
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>Max Guests</label>
                    <input
                      type="text"
                      value={editingRoomEn.occupancy}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "en", "occupancy", e.target.value)
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>View</label>
                    <input
                      type="text"
                      value={editingRoomEn.view}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "en", "view", e.target.value)
                      }
                    />
                  </div>
                </div>

                {showArabicSpecs && (
                  <div className="oz-admin-form-grid-4" dir="rtl">
                    <div className="oz-admin-field">
                      <label>المساحة (Arabic)</label>
                      <input
                        type="text"
                        value={editingRoomAr.size}
                        onChange={(e) =>
                          updateRoomField(editingRoomSlug, "ar", "size", e.target.value)
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>نوع السرير (Arabic)</label>
                      <input
                        type="text"
                        value={editingRoomAr.bed}
                        onChange={(e) =>
                          updateRoomField(editingRoomSlug, "ar", "bed", e.target.value)
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>عدد الضيوف (Arabic)</label>
                      <input
                        type="text"
                        value={editingRoomAr.occupancy}
                        onChange={(e) =>
                          updateRoomField(editingRoomSlug, "ar", "occupancy", e.target.value)
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>الإطلالة (Arabic)</label>
                      <input
                        type="text"
                        value={editingRoomAr.view}
                        onChange={(e) =>
                          updateRoomField(editingRoomSlug, "ar", "view", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field">
                    <label>Description (English)</label>
                    <textarea
                      rows={3}
                      value={editingRoomEn.cardDescription}
                      onChange={(e) => {
                        updateRoomField(
                          editingRoomSlug,
                          "en",
                          "cardDescription",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                  <div className="oz-admin-field" dir="rtl">
                    <label>وصف الغرفة (Arabic)</label>
                    <textarea
                      rows={3}
                      value={editingRoomAr.cardDescription}
                      onChange={(e) => {
                        updateRoomField(
                          editingRoomSlug,
                          "ar",
                          "cardDescription",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ROOM PHOTOS & GALLERY */}
              <div className="oz-admin-section-block">
                <div className="oz-admin-section-heading-row">
                  <div>
                    <h3 className="oz-admin-section-heading">
                      3. Room Photos ({editingRoomEn.allGalleryImages.length})
                    </h3>
                    <p className="oz-admin-section-sub">
                      The first photo is used as the main room cover. Click any photo to set it as cover, or upload new photos.
                    </p>
                  </div>
                  <div className="oz-admin-photo-upload-btns">
                    <button
                      type="button"
                      className="oz-admin-secondary-btn"
                      onClick={() => galleryUploadRef.current?.click()}
                    >
                      + Upload Photos
                    </button>
                    <button
                      type="button"
                      className="oz-admin-ghost-btn"
                      onClick={() => setLibraryTarget("edit-gallery")}
                    >
                      Choose from Library
                    </button>
                    <input
                      ref={galleryUploadRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const uploaded: string[] = [];
                        for (const f of files) {
                          const dataUrl = await compressUploadedImage(f);
                          uploaded.push(dataUrl);
                        }
                        updateRoomGalleryList(editingRoomSlug, [
                          ...editingRoomEn.allGalleryImages,
                          ...uploaded,
                        ]);
                        triggerToast(`Uploaded ${uploaded.length} photo(s)`);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                <div className="oz-admin-photos-grid">
                  {editingRoomEn.allGalleryImages.map((imgUrl, idx) => {
                    const isMainCover = idx === 0;
                    return (
                      <div
                        key={`${imgUrl.slice(0, 35)}-${idx}`}
                        className={`oz-admin-photo-tile ${isMainCover ? "is-cover" : ""}`}
                      >
                        <img src={imgUrl} alt={`${editingRoomEn.name} ${idx + 1}`} />
                        {isMainCover && (
                          <span className="oz-admin-cover-badge">Main Cover</span>
                        )}
                        <div className="oz-admin-photo-overlay">
                          {!isMainCover && (
                            <button
                              type="button"
                              className="oz-admin-photo-action"
                              onClick={() => updateRoomCoverPhoto(editingRoomSlug, imgUrl)}
                            >
                              Set as Cover
                            </button>
                          )}
                          {editingRoomEn.allGalleryImages.length > 1 && (
                            <button
                              type="button"
                              className="oz-admin-photo-remove"
                              onClick={() => {
                                const next = editingRoomEn.allGalleryImages.filter(
                                  (_, i) => i !== idx
                                );
                                updateRoomGalleryList(editingRoomSlug, next);
                              }}
                              title="Remove photo"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="oz-admin-drawer-footer">
              <button
                type="button"
                className="oz-admin-danger-outline-btn"
                onClick={() => setDeleteConfirmSlug(editingRoomSlug)}
              >
                Delete Room
              </button>
              <div className="oz-admin-drawer-footer-right">
                <button
                  type="button"
                  className="oz-admin-ghost-btn"
                  onClick={() => setEditingRoomSlug(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="oz-admin-primary-btn"
                  onClick={() => {
                    setEditingRoomSlug(null);
                    triggerToast("Changes saved & published to website");
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: ADD NEW ROOM TO WEBSITE
          ========================================================================== */}
      {isAddModalOpen && (
        <div
          className="oz-admin-modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="oz-admin-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">CREATE NEW ROOM</span>
                <h2>Add a Room or Suite</h2>
              </div>
              <button
                type="button"
                className="oz-admin-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRoom} className="oz-admin-drawer-body">
              <div className="oz-admin-section-block">
                <h3 className="oz-admin-section-heading">1. Room Identity & Nightly Price</h3>
                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field">
                    <label>Room Name (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Executive Sea View Room"
                      value={newRoomNameEn}
                      onChange={(e) => setNewRoomNameEn(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field" dir="rtl">
                    <label>اسم الغرفة (Arabic)</label>
                    <input
                      type="text"
                      placeholder="مثال: غرفة تنفيذية مطلة على البحر"
                      value={newRoomNameAr}
                      onChange={(e) => setNewRoomNameAr(e.target.value)}
                    />
                  </div>
                </div>

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field">
                    <label>Category</label>
                    <select
                      value={newRoomCategory}
                      onChange={(e) =>
                        setNewRoomCategory(e.target.value as RoomCategorySlug)
                      }
                    >
                      <option value="rooms">Deluxe & Superior Rooms</option>
                      <option value="studios">Superior Studios</option>
                      <option value="suites">Luxury Suites</option>
                    </select>
                  </div>
                  <div className="oz-admin-field">
                    <label>Nightly Rate — Room Only (SAR) *</label>
                    <input
                      type="number"
                      required
                      min={50}
                      step={10}
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="oz-admin-section-block">
                <h3 className="oz-admin-section-heading">2. Specifications & Description</h3>
                <div className="oz-admin-form-grid-4">
                  <div className="oz-admin-field">
                    <label>Size</label>
                    <input
                      type="text"
                      value={newRoomSize}
                      onChange={(e) => setNewRoomSize(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>Bed Type</label>
                    <input
                      type="text"
                      value={newRoomBed}
                      onChange={(e) => setNewRoomBed(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>Max Guests</label>
                    <input
                      type="text"
                      value={newRoomGuests}
                      onChange={(e) => setNewRoomGuests(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>View</label>
                    <input
                      type="text"
                      value={newRoomView}
                      onChange={(e) => setNewRoomView(e.target.value)}
                    />
                  </div>
                </div>

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field">
                    <label>Description (English)</label>
                    <textarea
                      rows={3}
                      value={newRoomDescEn}
                      onChange={(e) => setNewRoomDescEn(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field" dir="rtl">
                    <label>وصف الغرفة (Arabic)</label>
                    <textarea
                      rows={3}
                      value={newRoomDescAr}
                      onChange={(e) => setNewRoomDescAr(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="oz-admin-section-block">
                <div className="oz-admin-section-heading-row">
                  <div>
                    <h3 className="oz-admin-section-heading">
                      3. Room Photos ({newRoomPhotos.length})
                    </h3>
                    <p className="oz-admin-section-sub">
                      Upload photos from your computer or choose from the hotel library.
                    </p>
                  </div>
                  <div className="oz-admin-photo-upload-btns">
                    <button
                      type="button"
                      className="oz-admin-secondary-btn"
                      onClick={() => newRoomUploadRef.current?.click()}
                    >
                      + Upload Photos
                    </button>
                    <button
                      type="button"
                      className="oz-admin-ghost-btn"
                      onClick={() => setLibraryTarget("new-room")}
                    >
                      Choose from Library
                    </button>
                    <input
                      ref={newRoomUploadRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const uploaded: string[] = [];
                        for (const f of files) {
                          const dataUrl = await compressUploadedImage(f);
                          uploaded.push(dataUrl);
                        }
                        setNewRoomPhotos((prev) => [...uploaded, ...prev]);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                <div className="oz-admin-photos-grid">
                  {newRoomPhotos.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl.slice(0, 30)}-${idx}`}
                      className={`oz-admin-photo-tile ${idx === 0 ? "is-cover" : ""}`}
                    >
                      <img src={imgUrl} alt={`New room ${idx + 1}`} />
                      {idx === 0 && (
                        <span className="oz-admin-cover-badge">Main Cover</span>
                      )}
                      <div className="oz-admin-photo-overlay">
                        {idx !== 0 && (
                          <button
                            type="button"
                            className="oz-admin-photo-action"
                            onClick={() =>
                              setNewRoomPhotos((prev) => [
                                imgUrl,
                                ...prev.filter((_, i) => i !== idx),
                              ])
                            }
                          >
                            Set as Cover
                          </button>
                        )}
                        {newRoomPhotos.length > 1 && (
                          <button
                            type="button"
                            className="oz-admin-photo-remove"
                            onClick={() =>
                              setNewRoomPhotos((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="oz-admin-drawer-footer">
                <div />
                <div className="oz-admin-drawer-footer-right">
                  <button
                    type="button"
                    className="oz-admin-ghost-btn"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="oz-admin-primary-btn">
                    Create & Publish Room
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: DELETE ROOM CONFIRMATION
          ========================================================================== */}
      {deleteConfirmSlug && (
        <div
          className="oz-admin-modal-backdrop"
          onClick={() => setDeleteConfirmSlug(null)}
        >
          <div
            className="oz-admin-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Room?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{cmsState.roomsData.en[deleteConfirmSlug]?.name}</strong>? It will be
              removed from the website and booking engine immediately. You can restore default
              rooms anytime using &ldquo;Reset to Defaults&rdquo;.
            </p>
            <div className="oz-admin-confirm-actions">
              <button
                type="button"
                className="oz-admin-ghost-btn"
                onClick={() => setDeleteConfirmSlug(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="oz-admin-danger-btn"
                onClick={() => handleDeleteRoom(deleteConfirmSlug)}
              >
                Yes, Delete Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: HOTEL MEDIA LIBRARY PICKER
          ========================================================================== */}
      {libraryTarget && (
        <div
          className="oz-admin-modal-backdrop"
          onClick={() => setLibraryTarget(null)}
        >
          <div
            className="oz-admin-library-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">HOTEL MEDIA LIBRARY</span>
                <h2>Select a Room Photo</h2>
              </div>
              <button
                type="button"
                className="oz-admin-close-btn"
                onClick={() => setLibraryTarget(null)}
              >
                ✕
              </button>
            </div>
            <div className="oz-admin-library-grid">
              {builtInMediaLibrary.map((imgUrl) => (
                <button
                  key={imgUrl}
                  type="button"
                  className="oz-admin-library-item"
                  onClick={() => {
                    if (libraryTarget === "edit-gallery" && editingRoomSlug && editingRoomEn) {
                      updateRoomGalleryList(editingRoomSlug, [
                        ...editingRoomEn.allGalleryImages,
                        imgUrl,
                      ]);
                      triggerToast("Added photo to room gallery");
                    } else if (libraryTarget === "new-room") {
                      setNewRoomPhotos((prev) => [imgUrl, ...prev]);
                    }
                    setLibraryTarget(null);
                  }}
                >
                  <img src={imgUrl} alt={imgUrl} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
