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
  {
    labelEn: string;
    labelAr: string;
    eyebrowEn: string;
    eyebrowAr: string;
    templateSlug: RoomSlug;
  }
> = {
  rooms: {
    labelEn: "Rooms",
    labelAr: "الغرف",
    eyebrowEn: "DELUXE & SUPERIOR ROOMS",
    eyebrowAr: "غرف الديلوكس والسوبيريور",
    templateSlug: "deluxe-room",
  },
  studios: {
    labelEn: "Studios",
    labelAr: "الاستوديوهات",
    eyebrowEn: "SUPERIOR STUDIOS",
    eyebrowAr: "استوديو سوبيريور",
    templateSlug: "superior-studio",
  },
  suites: {
    labelEn: "Suites",
    labelAr: "الأجنحة",
    eyebrowEn: "LUXURY SUITES",
    eyebrowAr: "الأجنحة الفاخرة",
    templateSlug: "superior-suite",
  },
};

export default function AdminDashboard({
  language = "ar",
  onToggleLanguage,
  cmsState,
  onUpdateCmsState,
  onResetCmsState,
  onOpenWebsiteHome,
  onOpenBookingPage,
  onOpenRoomPage,
}: {
  language?: "ar" | "en";
  onToggleLanguage?: () => void;
  cmsState: OzParkRoomsCmsState;
  onUpdateCmsState: (next: OzParkRoomsCmsState) => void;
  onResetCmsState: () => void;
  onOpenWebsiteHome: () => void;
  onOpenBookingPage: (roomSlug?: RoomSlug) => void;
  onOpenRoomPage: (roomSlug: RoomSlug) => void;
}) {
  const [localLang, setLocalLang] = useState<"ar" | "en">(language);
  const activeLang = onToggleLanguage ? language : localLang;
  const isAr = activeLang === "ar";

  const handleSwitchLanguage = () => {
    if (onToggleLanguage) {
      onToggleLanguage();
    } else {
      setLocalLang((prev) => (prev === "ar" ? "en" : "ar"));
    }
  };

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
      triggerToast(
        isAr ? "مرحباً بك في لوحة تحكم فندق أوز بارك" : "Welcome to OZ Park Hotel Admin"
      );
    } else {
      setLoginError(
        isAr
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : "Invalid email or password. Please verify your credentials."
      );
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
    const rmName = cmsState.roomsData[activeLang][slug]?.name || "Room";
    triggerToast(
      isAr
        ? `تم تحديث حالة "${rmName}" إلى ${nextAvail ? "متاح للحجز" : "غير متاح"}`
        : `${rmName} set to ${nextAvail ? "Available" : "Sold Out"}`
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
    triggerToast(isAr ? "تم تحديث الصورة الرئيسية للغرفة" : "Main cover photo updated");
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
    const titleEn = newRoomNameEn.trim() || newRoomNameAr.trim();
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
    triggerToast(
      isAr ? `تمت إضافة "${titleAr}" إلى الموقع` : `Added "${titleEn}" to the website`
    );
  };

  // Delete a room from the website
  const handleDeleteRoom = (slug: RoomSlug) => {
    if (allRoomSlugs.length <= 1) {
      triggerToast(
        isAr
          ? "يجب إبقاء غرفة واحدة على الأقل في الموقع."
          : "At least one room must remain on the website."
      );
      setDeleteConfirmSlug(null);
      return;
    }
    const roomTitle = cmsState.roomsData[activeLang][slug]?.name || slug;
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
    triggerToast(isAr ? `تم حذف "${roomTitle}"` : `Deleted "${roomTitle}"`);
  };

  const filteredSlugs = allRoomSlugs.filter((slug) => {
    if (categoryFilter === "all") return true;
    return cmsState.roomsData.en[slug]?.categorySlug === categoryFilter;
  });

  // ============================================================================
  // 1. MINIMALIST LUXURY LOGIN GATE (EN / AR)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="oz-admin-login-shell" dir={isAr ? "rtl" : "ltr"}>
        <div className="oz-admin-login-card">
          <div className="oz-admin-login-top-row">
            <button
              type="button"
              className="oz-admin-lang-switch-btn oz-admin-lang-switch-btn--login"
              onClick={handleSwitchLanguage}
            >
              {isAr ? "English" : "العربية"}
            </button>
          </div>

          <button
            type="button"
            className="oz-admin-wordmark oz-admin-wordmark--login"
            onClick={onOpenWebsiteHome}
            dir="ltr"
          >
            <span className="oz-admin-wordmark-emblem">OZ</span>
            <span className="oz-admin-wordmark-text">PARK</span>
          </button>

          <p className="oz-admin-login-eyebrow">
            {isAr ? "بوابة الإدارة" : "ADMINISTRATION PORTAL"}
          </p>
          <h1 className="oz-admin-login-title">
            {isAr ? "إدارة الغرف والأسعار" : "Rooms & Rates Management"}
          </h1>
          <p className="oz-admin-login-subtitle">
            {isAr
              ? "سجّل الدخول لإدارة الغرف وأسعار الليالي ومعرض الصور."
              : "Sign in to manage rooms, nightly rates, and photo galleries."}
          </p>

          <form className="oz-admin-login-form" onSubmit={handleLoginSubmit}>
            <div className="oz-admin-field">
              <label htmlFor="oz-admin-email">
                {isAr ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <input
                id="oz-admin-email"
                type="email"
                required
                dir="ltr"
                autoComplete="username"
                placeholder="jacsfourseasons@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="oz-admin-field">
              <label htmlFor="oz-admin-password">
                {isAr ? "كلمة المرور" : "Password"}
              </label>
              <div className="oz-admin-pass-row" dir="ltr">
                <input
                  id="oz-admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder={isAr ? "أدخل كلمة المرور" : "Enter password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="oz-admin-pass-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword
                    ? isAr
                      ? "إخفاء"
                      : "Hide"
                    : isAr
                    ? "إظهار"
                    : "Show"}
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
                <span>{isAr ? "البقاء قيد تسجيل الدخول" : "Keep me signed in"}</span>
              </label>
            </div>

            {loginError && <div className="oz-admin-login-error">{loginError}</div>}

            <button type="submit" className="oz-admin-primary-btn oz-admin-login-submit">
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            className="oz-admin-back-site-link"
            onClick={onOpenWebsiteHome}
          >
            {isAr
              ? "العودة إلى موقع فندق أوز بارك ←"
              : "← Return to OZ Park Hotel Website"}
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. MINIMALIST LUXURY ROOMS DASHBOARD (EN / AR)
  // ============================================================================
  const editingRoomEn = editingRoomSlug ? cmsState.roomsData.en[editingRoomSlug] : null;
  const editingRoomAr = editingRoomSlug ? cmsState.roomsData.ar[editingRoomSlug] : null;

  return (
    <div className="oz-admin-shell" dir={isAr ? "rtl" : "ltr"}>
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
              title={isAr ? "العودة إلى الموقع الرئيسي" : "Back to OZ Park Hotel Website"}
              dir="ltr"
            >
              <span className="oz-admin-wordmark-emblem">OZ</span>
              <span className="oz-admin-wordmark-text">PARK</span>
            </button>
            <span className="oz-admin-topbar-divider" />
            <span className="oz-admin-topbar-label">
              {isAr ? "إدارة الغرف والأسعار" : "Rooms & Pricing"}
            </span>
          </div>

          <div className="oz-admin-topbar-right">
            <button
              type="button"
              className="oz-admin-lang-switch-btn"
              onClick={handleSwitchLanguage}
              title={isAr ? "Switch to English" : "التبديل إلى العربية"}
            >
              {isAr ? "English" : "العربية"}
            </button>
            <button
              type="button"
              className="oz-admin-ghost-btn"
              onClick={onOpenWebsiteHome}
            >
              {isAr ? "عرض الموقع" : "View Website"}
            </button>
            <button
              type="button"
              className="oz-admin-ghost-btn"
              onClick={() => onOpenBookingPage()}
            >
              {isAr ? "صفحة الحجز" : "Booking Page"}
            </button>
            <button
              type="button"
              className="oz-admin-ghost-btn oz-admin-ghost-btn--signout"
              onClick={handleLogout}
            >
              {isAr ? "تسجيل الخروج" : "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="oz-admin-container">
        {/* Clean Header Row: Title + Global Breakfast Setting + Add New Room */}
        <section className="oz-admin-header-bar">
          <div className="oz-admin-header-title-group">
            <h1>{isAr ? "الغرف والأجنحة" : "Rooms & Suites"}</h1>
            <p>
              {isAr
                ? "تحكم بأسعار الغرف، التفاصيل، الصور، أو أضف واحذف الغرف مباشرة على الموقع."
                : "Manage room rates, descriptions, photos, or add and remove rooms on the live website."}
            </p>
          </div>

          <div className="oz-admin-header-controls">
            <div className="oz-admin-inline-setting">
              <label htmlFor="global-breakfast-sar">
                {isAr ? "سعر الإفطار الإضافي" : "Breakfast Add-On"}
              </label>
              <div className="oz-admin-inline-input-wrap" dir="ltr">
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
                <span>{isAr ? "/ للشخص" : "/ person"}</span>
              </div>
            </div>

            <button
              type="button"
              className="oz-admin-primary-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              {isAr ? "+ إضافة غرفة جديدة" : "+ Add New Room"}
            </button>
          </div>
        </section>

        {/* Filter Bar + Reset Link */}
        <div className="oz-admin-toolbar">
          <div className="oz-admin-filter-pills">
            {(
              [
                [
                  "all",
                  isAr
                    ? `جميع الغرف (${allRoomSlugs.length})`
                    : `All Rooms (${allRoomSlugs.length})`,
                ],
                [
                  "rooms",
                  isAr
                    ? `الغرف (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "rooms"
                        ).length
                      })`
                    : `Rooms (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "rooms"
                        ).length
                      })`,
                ],
                [
                  "studios",
                  isAr
                    ? `الاستوديوهات (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "studios"
                        ).length
                      })`
                    : `Studios (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "studios"
                        ).length
                      })`,
                ],
                [
                  "suites",
                  isAr
                    ? `الأجنحة (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "suites"
                        ).length
                      })`
                    : `Suites (${
                        allRoomSlugs.filter(
                          (s) => cmsState.roomsData.en[s]?.categorySlug === "suites"
                        ).length
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
                  isAr
                    ? "هل تريد استعادة جميع الغرف والأسعار والصور الافتراضية للموقع؟"
                    : "Reset all rooms, prices, and photos back to the original website defaults?"
                )
              ) {
                onResetCmsState();
                triggerToast(
                  isAr
                    ? "تمت استعادة الغرف والأسعار الافتراضية"
                    : "Restored default rooms and pricing"
                );
              }
            }}
          >
            {isAr ? "استعادة الإعدادات الافتراضية" : "Reset to Defaults"}
          </button>
        </div>

        {/* Minimalist 3-Column Visual Room Grid */}
        <section className="oz-admin-grid">
          {filteredSlugs.map((slug) => {
            const rmEn = cmsState.roomsData.en[slug];
            const rmAr = cmsState.roomsData.ar[slug];
            if (!rmEn || !rmAr) return null;
            const rmDisplay = isAr ? rmAr : rmEn;
            const rmSecondary = isAr ? rmEn : rmAr;
            const rate = cmsState.baseRatesSar[slug] ?? 400;
            const isAvail = cmsState.roomAvailable[slug] ?? true;
            const catMeta = CATEGORY_META[rmEn.categorySlug];
            const catLabel = isAr ? catMeta?.labelAr || "غرفة" : catMeta?.labelEn || "Room";

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
                  <img src={rmEn.cardImage} alt={rmDisplay.name} />
                  <span className="oz-admin-card-cat">{catLabel}</span>
                  <button
                    type="button"
                    className={`oz-admin-status-pill ${isAvail ? "is-live" : "is-hidden"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRoomAvailability(slug);
                    }}
                    title={isAr ? "اضغط لتغيير حالة التوفر" : "Click to toggle availability"}
                  >
                    <span className="oz-admin-status-dot" />
                    {isAvail
                      ? isAr
                        ? "متاح للحجز"
                        : "Available"
                      : isAr
                      ? "غير متاح"
                      : "Sold Out"}
                  </button>
                  <span className="oz-admin-photo-count">
                    {isAr
                      ? `${rmEn.allGalleryImages.length} صور`
                      : `${rmEn.allGalleryImages.length} Photos`}
                  </span>
                </div>

                {/* Room Info */}
                <div className="oz-admin-card-body">
                  <div className="oz-admin-card-titles">
                    <h3>{rmDisplay.name}</h3>
                    <span className="oz-admin-card-ar">{rmSecondary.name}</span>
                  </div>

                  <p className="oz-admin-card-specs">
                    {rmDisplay.size} &bull; {rmDisplay.bed} &bull; {rmDisplay.view}
                  </p>

                  {/* Instant Inline Price Editor */}
                  <div className="oz-admin-price-box">
                    <div className="oz-admin-price-box-left">
                      <span className="oz-admin-price-label">
                        {isAr ? "سعر الليلة (غرفة فقط)" : "Nightly Rate (Room Only)"}
                      </span>
                      <span className="oz-admin-price-sub">
                        {isAr
                          ? `شامل الإفطار: ${rate + cmsState.breakfastPriceSar} ريال`
                          : `With Breakfast: SAR ${rate + cmsState.breakfastPriceSar}`}
                      </span>
                    </div>
                    <div className="oz-admin-price-input-group" dir="ltr">
                      <span>SAR</span>
                      <input
                        type="number"
                        min={50}
                        step={10}
                        value={rate}
                        onChange={(e) => updateRoomRate(slug, Number(e.target.value))}
                        aria-label={`${rmDisplay.name} nightly rate in SAR`}
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
                      {isAr ? "تعديل الغرفة والصور" : "Edit Room & Photos"}
                    </button>
                    <button
                      type="button"
                      className="oz-admin-preview-icon-btn"
                      onClick={() => onOpenRoomPage(slug)}
                      title={
                        isAr ? "معاينة صفحة الغرفة" : "Preview Room Page on Website"
                      }
                    >
                      {isAr ? "معاينة" : "View"}
                    </button>
                    <button
                      type="button"
                      className="oz-admin-delete-icon-btn"
                      onClick={() => setDeleteConfirmSlug(slug)}
                      title={isAr ? "حذف الغرفة" : "Delete Room"}
                    >
                      {isAr ? "حذف" : "Delete"}
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
            dir={isAr ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">
                  {isAr ? "تعديل الغرفة" : "EDIT ROOM"}
                </span>
                <h2>{isAr ? editingRoomAr.name : editingRoomEn.name}</h2>
              </div>
              <div className="oz-admin-drawer-header-actions">
                <button
                  type="button"
                  className="oz-admin-ghost-btn"
                  onClick={() => onOpenRoomPage(editingRoomSlug)}
                >
                  {isAr ? "عرض الصفحة ↗" : "Open Live Page ↗"}
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
                <h3 className="oz-admin-section-heading">
                  {isAr ? "1. السعر والفئة والتوفر" : "1. Pricing & Category"}
                </h3>
                <div className="oz-admin-form-grid-3">
                  <div className="oz-admin-field">
                    <label>{isAr ? "سعر الليلة (ريال سعودي SAR)" : "Nightly Rate (SAR)"}</label>
                    <input
                      type="number"
                      min={50}
                      step={10}
                      dir="ltr"
                      value={cmsState.baseRatesSar[editingRoomSlug] ?? 400}
                      onChange={(e) =>
                        updateRoomRate(editingRoomSlug, Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="oz-admin-field">
                    <label>{isAr ? "فئة الغرفة" : "Room Category"}</label>
                    <select
                      value={editingRoomEn.categorySlug}
                      onChange={(e) =>
                        updateRoomCategory(
                          editingRoomSlug,
                          e.target.value as RoomCategorySlug
                        )
                      }
                    >
                      <option value="rooms">
                        {isAr ? "غرف الديلوكس والسوبيريور" : "Deluxe & Superior Rooms"}
                      </option>
                      <option value="studios">
                        {isAr ? "استوديو سوبيريور" : "Superior Studios"}
                      </option>
                      <option value="suites">
                        {isAr ? "الأجنحة الفاخرة" : "Luxury Suites"}
                      </option>
                    </select>
                  </div>

                  <div className="oz-admin-field">
                    <label>{isAr ? "حالة الحجز" : "Booking Status"}</label>
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
                      <option value="available">
                        {isAr ? "متاح للحجز" : "Available for Booking"}
                      </option>
                      <option value="soldout">
                        {isAr ? "غير متاح / مخفي" : "Sold Out / Hidden"}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ROOM NAME, SPECS & DESCRIPTION */}
              <div className="oz-admin-section-block">
                <div className="oz-admin-section-heading-row">
                  <h3 className="oz-admin-section-heading">
                    {isAr
                      ? "2. تفاصيل ومواصفات الغرفة"
                      : "2. Room Details & Specifications"}
                  </h3>
                  <button
                    type="button"
                    className="oz-admin-text-link"
                    onClick={() => setShowArabicSpecs((v) => !v)}
                  >
                    {showArabicSpecs
                      ? isAr
                        ? "إخفاء المواصفات الإضافية"
                        : "Hide Arabic Specs"
                      : isAr
                      ? "تعديل المواصفات باللغتين"
                      : "Edit Arabic Specs"}
                  </button>
                </div>

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field" dir="ltr">
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
                    <label>اسم الغرفة (العربية)</label>
                    <input
                      type="text"
                      value={editingRoomAr.name}
                      onChange={(e) =>
                        updateRoomField(editingRoomSlug, "ar", "name", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="oz-admin-form-grid-4" dir={isAr ? "rtl" : "ltr"}>
                  <div className="oz-admin-field">
                    <label>{isAr ? "المساحة" : "Size"}</label>
                    <input
                      type="text"
                      value={isAr ? editingRoomAr.size : editingRoomEn.size}
                      onChange={(e) =>
                        updateRoomField(
                          editingRoomSlug,
                          isAr ? "ar" : "en",
                          "size",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "نوع السرير" : "Bed Type"}</label>
                    <input
                      type="text"
                      value={isAr ? editingRoomAr.bed : editingRoomEn.bed}
                      onChange={(e) =>
                        updateRoomField(
                          editingRoomSlug,
                          isAr ? "ar" : "en",
                          "bed",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "عدد الضيوف" : "Max Guests"}</label>
                    <input
                      type="text"
                      value={isAr ? editingRoomAr.occupancy : editingRoomEn.occupancy}
                      onChange={(e) =>
                        updateRoomField(
                          editingRoomSlug,
                          isAr ? "ar" : "en",
                          "occupancy",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "الإطلالة" : "View"}</label>
                    <input
                      type="text"
                      value={isAr ? editingRoomAr.view : editingRoomEn.view}
                      onChange={(e) =>
                        updateRoomField(
                          editingRoomSlug,
                          isAr ? "ar" : "en",
                          "view",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {showArabicSpecs && (
                  <div className="oz-admin-form-grid-4" dir={isAr ? "ltr" : "rtl"}>
                    <div className="oz-admin-field">
                      <label>{isAr ? "Size (English)" : "المساحة (Arabic)"}</label>
                      <input
                        type="text"
                        value={isAr ? editingRoomEn.size : editingRoomAr.size}
                        onChange={(e) =>
                          updateRoomField(
                            editingRoomSlug,
                            isAr ? "en" : "ar",
                            "size",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>{isAr ? "Bed Type (English)" : "نوع السرير (Arabic)"}</label>
                      <input
                        type="text"
                        value={isAr ? editingRoomEn.bed : editingRoomAr.bed}
                        onChange={(e) =>
                          updateRoomField(
                            editingRoomSlug,
                            isAr ? "en" : "ar",
                            "bed",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>{isAr ? "Max Guests (English)" : "عدد الضيوف (Arabic)"}</label>
                      <input
                        type="text"
                        value={isAr ? editingRoomEn.occupancy : editingRoomAr.occupancy}
                        onChange={(e) =>
                          updateRoomField(
                            editingRoomSlug,
                            isAr ? "en" : "ar",
                            "occupancy",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="oz-admin-field">
                      <label>{isAr ? "View (English)" : "الإطلالة (Arabic)"}</label>
                      <input
                        type="text"
                        value={isAr ? editingRoomEn.view : editingRoomAr.view}
                        onChange={(e) =>
                          updateRoomField(
                            editingRoomSlug,
                            isAr ? "en" : "ar",
                            "view",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field" dir="ltr">
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
                    <label>وصف الغرفة (العربية)</label>
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
                      {isAr
                        ? `3. صور الغرفة (${editingRoomEn.allGalleryImages.length})`
                        : `3. Room Photos (${editingRoomEn.allGalleryImages.length})`}
                    </h3>
                    <p className="oz-admin-section-sub">
                      {isAr
                        ? "الصورة الأولى هي الغلاف الرئيسي للغرفة. مرر فوق أي صورة لتعيينها كغلاف أو حذفها."
                        : "The first photo is used as the main room cover. Hover any photo to set it as cover or remove it."}
                    </p>
                  </div>
                  <div className="oz-admin-photo-upload-btns">
                    <button
                      type="button"
                      className="oz-admin-secondary-btn"
                      onClick={() => galleryUploadRef.current?.click()}
                    >
                      {isAr ? "+ رفع صور من الجهاز" : "+ Upload Photos"}
                    </button>
                    <button
                      type="button"
                      className="oz-admin-ghost-btn"
                      onClick={() => setLibraryTarget("edit-gallery")}
                    >
                      {isAr ? "اختيار من مكتبة الفندق" : "Choose from Library"}
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
                        triggerToast(
                          isAr
                            ? `تم رفع ${uploaded.length} صورة بنجاح`
                            : `Uploaded ${uploaded.length} photo(s)`
                        );
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
                          <span className="oz-admin-cover-badge">
                            {isAr ? "الغلاف الرئيسي" : "Main Cover"}
                          </span>
                        )}
                        <div className="oz-admin-photo-overlay">
                          {!isMainCover && (
                            <button
                              type="button"
                              className="oz-admin-photo-action"
                              onClick={() => updateRoomCoverPhoto(editingRoomSlug, imgUrl)}
                            >
                              {isAr ? "تعيين كغلاف" : "Set as Cover"}
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
                              title={isAr ? "حذف الصورة" : "Remove photo"}
                            >
                              {isAr ? "حذف" : "Remove"}
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
                {isAr ? "حذف الغرفة" : "Delete Room"}
              </button>
              <div className="oz-admin-drawer-footer-right">
                <button
                  type="button"
                  className="oz-admin-ghost-btn"
                  onClick={() => setEditingRoomSlug(null)}
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
                <button
                  type="button"
                  className="oz-admin-primary-btn"
                  onClick={() => {
                    setEditingRoomSlug(null);
                    triggerToast(
                      isAr
                        ? "تم حفظ التعديلات ونشرها على الموقع"
                        : "Changes saved & published to website"
                    );
                  }}
                >
                  {isAr ? "حفظ التغييرات" : "Save Changes"}
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
            dir={isAr ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">
                  {isAr ? "إنشاء غرفة جديدة" : "CREATE NEW ROOM"}
                </span>
                <h2>{isAr ? "إضافة غرفة أو جناح جديد" : "Add a Room or Suite"}</h2>
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
                <h3 className="oz-admin-section-heading">
                  {isAr
                    ? "1. اسم الغرفة وسعر الليلة"
                    : "1. Room Identity & Nightly Price"}
                </h3>
                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field" dir="ltr">
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
                    <label>اسم الغرفة (العربية)</label>
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
                    <label>{isAr ? "الفئة" : "Category"}</label>
                    <select
                      value={newRoomCategory}
                      onChange={(e) =>
                        setNewRoomCategory(e.target.value as RoomCategorySlug)
                      }
                    >
                      <option value="rooms">
                        {isAr ? "غرف الديلوكس والسوبيريور" : "Deluxe & Superior Rooms"}
                      </option>
                      <option value="studios">
                        {isAr ? "استوديو سوبيريور" : "Superior Studios"}
                      </option>
                      <option value="suites">
                        {isAr ? "الأجنحة الفاخرة" : "Luxury Suites"}
                      </option>
                    </select>
                  </div>
                  <div className="oz-admin-field">
                    <label>
                      {isAr
                        ? "سعر الليلة — غرفة فقط (SAR) *"
                        : "Nightly Rate — Room Only (SAR) *"}
                    </label>
                    <input
                      type="number"
                      required
                      dir="ltr"
                      min={50}
                      step={10}
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="oz-admin-section-block">
                <h3 className="oz-admin-section-heading">
                  {isAr ? "2. المواصفات والوصف" : "2. Specifications & Description"}
                </h3>
                <div className="oz-admin-form-grid-4">
                  <div className="oz-admin-field">
                    <label>{isAr ? "المساحة" : "Size"}</label>
                    <input
                      type="text"
                      value={newRoomSize}
                      onChange={(e) => setNewRoomSize(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "نوع السرير" : "Bed Type"}</label>
                    <input
                      type="text"
                      value={newRoomBed}
                      onChange={(e) => setNewRoomBed(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "عدد الضيوف" : "Max Guests"}</label>
                    <input
                      type="text"
                      value={newRoomGuests}
                      onChange={(e) => setNewRoomGuests(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field">
                    <label>{isAr ? "الإطلالة" : "View"}</label>
                    <input
                      type="text"
                      value={newRoomView}
                      onChange={(e) => setNewRoomView(e.target.value)}
                    />
                  </div>
                </div>

                <div className="oz-admin-form-grid-2">
                  <div className="oz-admin-field" dir="ltr">
                    <label>Description (English)</label>
                    <textarea
                      rows={3}
                      value={newRoomDescEn}
                      onChange={(e) => setNewRoomDescEn(e.target.value)}
                    />
                  </div>
                  <div className="oz-admin-field" dir="rtl">
                    <label>وصف الغرفة (العربية)</label>
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
                      {isAr
                        ? `3. صور الغرفة (${newRoomPhotos.length})`
                        : `3. Room Photos (${newRoomPhotos.length})`}
                    </h3>
                    <p className="oz-admin-section-sub">
                      {isAr
                        ? "ارفع صوراً من جهازك أو اختر من مكتبة صور الفندق."
                        : "Upload photos from your computer or choose from the hotel library."}
                    </p>
                  </div>
                  <div className="oz-admin-photo-upload-btns">
                    <button
                      type="button"
                      className="oz-admin-secondary-btn"
                      onClick={() => newRoomUploadRef.current?.click()}
                    >
                      {isAr ? "+ رفع صور" : "+ Upload Photos"}
                    </button>
                    <button
                      type="button"
                      className="oz-admin-ghost-btn"
                      onClick={() => setLibraryTarget("new-room")}
                    >
                      {isAr ? "من مكتبة الفندق" : "Choose from Library"}
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
                        <span className="oz-admin-cover-badge">
                          {isAr ? "الغلاف الرئيسي" : "Main Cover"}
                        </span>
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
                            {isAr ? "تعيين كغلاف" : "Set as Cover"}
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
                            {isAr ? "حذف" : "Remove"}
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
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button type="submit" className="oz-admin-primary-btn">
                    {isAr ? "إنشاء ونشر الغرفة" : "Create & Publish Room"}
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
            dir={isAr ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{isAr ? "تأكيد حذف الغرفة؟" : "Delete Room?"}</h3>
            <p>
              {isAr ? (
                <>
                  هل أنت متأكد من رغبتك في حذف{" "}
                  <strong>{cmsState.roomsData.ar[deleteConfirmSlug]?.name}</strong>؟ سيتم
                  إزالتها فوراً من الموقع ومحرك الحجز. يمكنك استعادة الغرف الافتراضية في أي
                  وقت عبر زر &ldquo;استعادة الإعدادات الافتراضية&rdquo;.
                </>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <strong>{cmsState.roomsData.en[deleteConfirmSlug]?.name}</strong>? It will
                  be removed from the website and booking engine immediately. You can
                  restore default rooms anytime using &ldquo;Reset to Defaults&rdquo;.
                </>
              )}
            </p>
            <div className="oz-admin-confirm-actions">
              <button
                type="button"
                className="oz-admin-ghost-btn"
                onClick={() => setDeleteConfirmSlug(null)}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                className="oz-admin-danger-btn"
                onClick={() => handleDeleteRoom(deleteConfirmSlug)}
              >
                {isAr ? "نعم، احذف الغرفة" : "Yes, Delete Room"}
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
            dir={isAr ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="oz-admin-drawer-header">
              <div>
                <span className="oz-admin-drawer-overline">
                  {isAr ? "مكتبة صور الفندق" : "HOTEL MEDIA LIBRARY"}
                </span>
                <h2>{isAr ? "اختر صورة للغرفة" : "Select a Room Photo"}</h2>
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
                      triggerToast(
                        isAr
                          ? "تمت إضافة الصورة إلى معرض الغرفة"
                          : "Added photo to room gallery"
                      );
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
