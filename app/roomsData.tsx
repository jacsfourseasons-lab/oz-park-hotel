import React from "react";

export type RoomCategorySlug = "rooms" | "studios" | "suites";

export type RoomSlug =
  | "deluxe-room"
  | "superior-room"
  | "superior-studio"
  | "twin-junior-suite"
  | "superior-suite"
  | "deluxe-suite"
  | "royal-suite";

export type AmenityIconName =
  | "size"
  | "bed"
  | "guests"
  | "view"
  | "balcony"
  | "sitting"
  | "connecting"
  | "wifi"
  | "room-service"
  | "bathtub"
  | "shower"
  | "coffee"
  | "tv"
  | "hairdryer"
  | "iron"
  | "minibar"
  | "safe"
  | "desk"
  | "kitchenette"
  | "view-all";

export type RoomAmenityItem = {
  icon: AmenityIconName;
  label: string;
};

export type RoomDetailData = {
  slug: RoomSlug;
  categorySlug: RoomCategorySlug;
  categoryEyebrow: string;
  name: string;
  cardDescription: string;
  size: string;
  bed: string;
  occupancy: string;
  view: string;
  heroImage: string;
  cardImage: string;
  collageHeading: string;
  collageDescription: string;
  collageImages: [string, string, string, string, string];
  allGalleryImages: string[];
  privilegesTitle: string;
  featuredAmenities: RoomAmenityItem[];
  allAmenities: RoomAmenityItem[];
  upgradeBanner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
    targetRoomSlug: RoomSlug;
    image: string;
  };
};

export type RoomCategoryPageData = {
  slug: RoomCategorySlug;
  eyebrow: string;
  title: string;
  shortTitle: string;
  heroSubtitle: string;
  heroImage: string;
  discoverEyebrow: string;
  discoverTitle: string;
  discoverSubtitle: string;
  roomSlugs: RoomSlug[];
  privilegesTitle: string;
  upgradeBanner: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonLabel: string;
    targetCategorySlug?: RoomCategorySlug;
    targetRoomSlug?: RoomSlug;
    image: string;
  };
};

export type PrivilegeCardItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type PrivilegeAccordionItem = {
  id: string;
  title: string;
  lines: string[];
};

/**
 * Exact Atlantis thin-stroke SVG icon set (matching Deluxe Rooms & Deluxe King Room pages)
 */
export function AtlantisRoomIcon({
  name,
  stroke = "#2559a8",
  size = 24,
}: {
  name: AmenityIconName;
  stroke?: string;
  size?: number;
}) {
  const s = {
    fill: "none",
    stroke,
    strokeMiterlimit: 10,
    strokeWidth: "0.75px",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "size":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M19.76,14.91v3.94c0,.5-.41.91-.91.91h-3.94" />
          <path style={s} d="M14.91,4.24h3.94c.5,0,.91.41.91.91v3.94" />
          <path style={s} d="M4.24,9.09v-3.94c0-.5.41-.91.91-.91h3.94" />
          <path style={s} d="M9.09,19.76h-3.94c-.5,0-.91-.41-.91-.91v-3.94" />
        </svg>
      );
    case "bed":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M2.27,11.54h19.46c.61,0,1.1.49,1.1,1.1v5.05H1.16v-5.05c0-.61.49-1.1,1.1-1.1Z" />
          <path style={s} d="M4.88,4.78h14.25c.61,0,1.1.49,1.1,1.1v5.65H3.77v-5.65c0-.61.49-1.1,1.1-1.1Z" />
          <rect style={s} x="6.01" y="8.71" width="4.78" height="2.83" rx="1.1" ry="1.1" />
          <rect style={s} x="13.21" y="8.71" width="4.78" height="2.83" rx="1.1" ry="1.1" />
          <line style={s} x1="1.16" y1="17.41" x2="1.16" y2="19.22" />
          <line style={s} x1="22.84" y1="17.41" x2="22.84" y2="19.22" />
        </svg>
      );
    case "guests":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M11.82,7.83c0,2.04-1.66,3.7-3.7,3.7s-3.7-1.66-3.7-3.7,1.66-3.7,3.7-3.7,3.7,1.66,3.7,3.7Z" />
          <path style={s} d="M5.36,13.58h6.17c1.71,0,3.09,1.39,3.09,3.09v3.2H2.27v-3.2c0-1.71,1.39-3.09,3.09-3.09Z" />
          <path style={s} d="M19.51,9.53c0,1.61-1.31,2.92-2.92,2.92s-2.92-1.31-2.92-2.92,1.31-2.92,2.92-2.92,2.92,1.31,2.92,2.92Z" />
          <path style={s} d="M13.2,14.07h8.53v2.53c0,1.35-1.09,2.44-2.44,2.44h-4.88" />
        </svg>
      );
    case "view":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M12,7.28c-4.22,0-7.81,1.97-9.18,4.72,1.37,2.75,4.96,4.72,9.18,4.72s7.81-1.97,9.18-4.72c-1.37-2.75-4.96-4.72-9.18-4.72Z" />
          <path style={s} d="M14.91,12c0,1.61-1.3,2.91-2.91,2.91s-2.91-1.3-2.91-2.91,1.3-2.91,2.91-2.91,2.91,1.3,2.91,2.91Z" />
        </svg>
      );
    case "balcony":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <polyline style={s} points="7.4 12.93 7.4 3.72 16.6 3.72 16.6 12.93" />
          <line style={s} x1="12" y1="12.93" x2="12" y2="3.72" />
          <line style={s} x1="7.4" y1="10.28" x2="16.6" y2="10.28" />
          <polyline style={s} points="19.72 11.55 19.72 20.38 4.28 20.38 4.28 11.55" />
          <line style={s} x1="17.84" y1="12.81" x2="17.84" y2="20.38" />
          <line style={s} x1="15.86" y1="12.81" x2="15.86" y2="20.38" />
          <line style={s} x1="13.88" y1="12.81" x2="13.88" y2="20.38" />
          <line style={s} x1="11.89" y1="12.81" x2="11.89" y2="20.38" />
          <line style={s} x1="9.91" y1="12.81" x2="9.91" y2="20.38" />
          <line style={s} x1="7.93" y1="12.81" x2="7.93" y2="20.38" />
          <line style={s} x1="5.95" y1="12.81" x2="5.95" y2="20.38" />
          <line style={s} x1="4.28" y1="18.75" x2="19.72" y2="18.75" />
          <line style={s} x1="4.28" y1="12.93" x2="19.72" y2="12.93" />
        </svg>
      );
    case "sitting":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M12.81,9.21v-1.89c0-1.33-1.08-2.41-2.41-2.41h-4.73c-1.33,0-2.41,1.08-2.41,2.41v1.89" />
          <path style={s} d="M14.32,11.53v-.82c0-.83-.68-1.51-1.51-1.51h0c-.83,0-1.51.68-1.51,1.51v3.95h-6.32v-3.95c0-.83-.68-1.51-1.51-1.51h0c-.83,0-1.51.68-1.51,1.51v6.89h12.36v-4.05" />
          <line style={s} x1="4.98" y1="12.18" x2="11.31" y2="12.18" />
          <path style={s} d="M21.02,13.56h-6.79c-.56,0-1.01-.45-1.01-1.01h0c0-.56.45-1.01,1.01-1.01h6.79c.56,0,1.01.45,1.01,1.01h0c0,.56-.45,1.01-1.01,1.01Z" />
          <rect style={s} x="16.02" y="13.56" width="3.22" height="5.03" />
          <line style={s} x1="3.27" y1="19.09" x2="3.27" y2="17.6" />
          <line style={s} x1="12.65" y1="19.09" x2="12.65" y2="17.6" />
        </svg>
      );
    case "connecting":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M14.44,4.27h1.42c.61,0,1.1.49,1.1,1.1v13.09c0,.61-.49,1.1-1.1,1.1h-1.42" />
          <line style={s} x1="14.5" y1="12" x2="12.43" y2="12" />
          <line style={s} x1="14.44" y1="19.56" x2="20.65" y2="19.56" />
          <line style={s} x1="3.35" y1="19.56" x2="7.11" y2="19.56" />
          <path style={s} d="M13.12,21.24l-5.6-1.47c-.48-.13-.82-.56-.82-1.06V5.32c0-.5.33-.93.81-1.06l5.6-1.5c.7-.19,1.38.34,1.38,1.06v16.37c0,.72-.68,1.24-1.37,1.06Z" />
        </svg>
      );
    case "wifi":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M2.5 8.5C7.8 3.8 16.2 3.8 21.5 8.5" />
          <path style={s} d="M5.5 12C9.2 8.7 14.8 8.7 18.5 12" />
          <path style={s} d="M8.5 15.5C10.5 13.7 13.5 13.7 15.5 15.5" />
          <circle style={s} cx="12" cy="18.7" r="1.4" />
        </svg>
      );
    case "room-service":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="4.61" y="10.14" width="14.75" height="9" />
          <polyline style={s} points="5.21 10.14 5.21 8.87 3.58 7.23" />
          <polyline style={s} points="16.5 10.14 15.27 10.14 15.27 6.59 15.89 5.73 15.89 3.05 17.72 3.05 17.72 5.73 18.33 6.59 18.33 10.14 17.1 10.14" />
          <path style={s} d="M13.26,10.14h-6.25v-1.29c0-1.73,1.4-3.12,3.12-3.12s3.12,1.4,3.12,3.12v1.29Z" />
          <circle style={s} cx="6.28" cy="20.04" r="0.91" />
          <circle style={s} cx="17.68" cy="20.04" r="0.91" />
          <line style={s} x1="4.61" y1="17.62" x2="16.39" y2="17.62" />
        </svg>
      );
    case "bathtub":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Z" />
          <path style={s} d="M5 12V6a2 2 0 0 1 4 0v1" />
          <line style={s} x1="7" y1="19" x2="6" y2="21" />
          <line style={s} x1="17" y1="19" x2="18" y2="21" />
        </svg>
      );
    case "shower":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="5" y="3" width="14" height="18" rx="1" />
          <path style={s} d="M12 3v4a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2" />
          <line style={s} x1="10" y1="12" x2="10" y2="14" />
          <line style={s} x1="12" y1="12" x2="12" y2="15" />
          <line style={s} x1="14" y1="12" x2="14" y2="14" />
        </svg>
      );
    case "coffee":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="5" y="4" width="14" height="16" rx="1.5" />
          <line style={s} x1="5" y1="9" x2="19" y2="9" />
          <path style={s} d="M9 13h5v4a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9 17v-4Z" />
          <path style={s} d="M14 14h1.5a1 1 0 0 1 0 2H14" />
        </svg>
      );
    case "tv":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="3" y="5" width="18" height="12" rx="1.2" />
          <line style={s} x1="8" y1="20" x2="16" y2="20" />
          <line style={s} x1="12" y1="17" x2="12" y2="20" />
        </svg>
      );
    case "hairdryer":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M4 9a4 4 0 0 1 4-4h7l3 2v4l-3 2H8a4 4 0 0 1-4-4Z" />
          <path style={s} d="M9 13l-1.5 6h3L12 13" />
          <circle style={s} cx="8" cy="9" r="1.5" />
        </svg>
      );
    case "iron":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path style={s} d="M4 16h16l-2-6H9a5 5 0 0 0-5 6Z" />
          <path style={s} d="M9 10V7h7" />
          <line style={s} x1="3" y1="19" x2="21" y2="19" />
        </svg>
      );
    case "minibar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="6" y="3" width="12" height="18" rx="1.2" />
          <line style={s} x1="6" y1="10" x2="18" y2="10" />
          <line style={s} x1="9" y1="6.5" x2="9" y2="8" />
          <line style={s} x1="9" y1="13" x2="9" y2="16" />
        </svg>
      );
    case "safe":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="4" y="5" width="16" height="14" rx="1.5" />
          <rect style={s} x="7" y="8" width="10" height="8" rx="0.8" />
          <circle style={s} cx="11" cy="12" r="1.5" />
          <line style={s} x1="14.5" y1="10.5" x2="15.5" y2="10.5" />
          <line style={s} x1="14.5" y1="13.5" x2="15.5" y2="13.5" />
        </svg>
      );
    case "desk":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <line style={s} x1="3" y1="10" x2="21" y2="10" />
          <line style={s} x1="5" y1="10" x2="5" y2="19" />
          <line style={s} x1="19" y1="10" x2="19" y2="19" />
          <rect style={s} x="13" y="10" width="6" height="5" />
          <rect style={s} x="8" y="6" width="5" height="4" />
        </svg>
      );
    case "kitchenette":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <rect style={s} x="3" y="11" width="18" height="9" rx="1" />
          <line style={s} x1="12" y1="11" x2="12" y2="20" />
          <path style={s} d="M8 11V7a2 2 0 0 1 4 0v1" />
          <line style={s} x1="6" y1="14" x2="9" y2="14" />
          <line style={s} x1="15" y1="14" x2="18" y2="14" />
        </svg>
      );
    case "view-all":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            fill={stroke}
            d="M4 5a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 4 5m0 14a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 4 19M18 5a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 18 5m0 7a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 18 12m-7 0a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 11 12m-7 0a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 4 12m7-7a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 11 5m0 14a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 11 19m7 0a1.2 1.2 0 1 1 2.4 0A1.2 1.2 0 0 1 18 19"
          />
        </svg>
      );
  }
}

export const roomPrivilegesCarouselData: Record<"en" | "ar", PrivilegeCardItem[]> = {
  en: [
    {
      id: "diwan-mada-privilege",
      title: "Diwan Mada Restaurant",
      description:
        "Enjoy an exclusive 10% guest privilege across daily breakfast buffets, dinner buffets, and à la carte dining overlooking the Red Sea.",
      image: "/images/ozpark/offer4-hero-diwan-4k.jpg",
    },
    {
      id: "oz-park-cafe-privilege",
      title: "OZ Park Café",
      description:
        "Unwind with 10% off barista-crafted coffee, chilled drinks, fresh juices, smoothies, and artisanal cakes with panoramic sea views.",
      image: "/images/ozpark/cafe-hero-4k.jpg",
    },
    {
      id: "south-corniche-access",
      title: "South Corniche Waterfront",
      description:
        "Step directly onto Al Qunfudhah's scenic South Corniche promenade for peaceful seaside walks and unforgettable Red Sea sunsets.",
      image: "/images/ozpark/tour-south-corniche-sunset.png",
    },
    {
      id: "concierge-parking",
      title: "24-Hour Concierge & Parking",
      description:
        "Experience effortless coastal hospitality with 24/7 front-desk assistance, room service, and complimentary on-site guest parking.",
      image: "/images/ozpark/slider-hotel.jpg",
    },
    {
      id: "upcoming-pool-fitness",
      title: "Wellness & Fitness Centre",
      description:
        "Recharge body and mind with our upcoming state-of-the-art fitness facilities and indoor swimming pool experience.",
      image: "/images/ozpark/slider-pool-gym.jpg",
    },
  ],
  ar: [
    {
      id: "diwan-mada-privilege",
      title: "مطعم ديوان مدى",
      description:
        "استمتع بخصم حصري 10% لنزلاء الفندق على بوفيه الإفطار وبوفيه العشاء وقائمة الطعام المتنوعة بإطلالة بانورامية على البحر الأحمر.",
      image: "/images/ozpark/offer4-hero-diwan-4k.jpg",
    },
    {
      id: "oz-park-cafe-privilege",
      title: "مقهى أوز بارك",
      description:
        "احصل على خصم 10% على القهوة المختصة والمشروبات الباردة والعصائر الطازجة والحلويات الفاخرة بإطلالة ساحلية هادئة.",
      image: "/images/ozpark/cafe-hero-4k.jpg",
    },
    {
      id: "south-corniche-access",
      title: "الواجهة البحرية للكورنيش الجنوبي",
      description:
        "موقع مباشر على الكورنيش الجنوبي في القنفذة للاستمتاع بنزهات المساء وإطلالات غروب الشمس على البحر الأحمر.",
      image: "/images/ozpark/tour-south-corniche-sunset.png",
    },
    {
      id: "concierge-parking",
      title: "استقبال على مدار الساعة ومواقف مجانية",
      description:
        "ضيافة متكاملة تشمل مكتب استقبال وخدمة غرف على مدار 24 ساعة مع مواقف سيارات مجانية خاصة بضيوف الفندق.",
      image: "/images/ozpark/slider-hotel.jpg",
    },
    {
      id: "upcoming-pool-fitness",
      title: "النادي الرياضي والمسبح الداخلي",
      description:
        "تجربة متجددة للعافية واللياقة البدنية مع مرافق النادي الرياضي والمسبح الداخلي القادمة قريباً في فندق أوز بارك.",
      image: "/images/ozpark/slider-pool-gym.jpg",
    },
  ],
};

export const roomPrivilegesAccordionData: Record<"en" | "ar", PrivilegeAccordionItem[]> = {
  en: [
    {
      id: "dining-cafe-benefits",
      title: "Dining & Café privileges",
      lines: [
        "10% exclusive in-house guest discount at Diwan Mada Restaurant.",
        "10% exclusive in-house guest discount at OZ Park Café.",
        "24-hour in-room dining service delivering freshly prepared favorites to your door.",
      ],
    },
    {
      id: "hotel-exclusives",
      title: "Resort & Corniche exclusives",
      lines: [
        "Direct waterfront setting along Al Qunfudhah's South Corniche.",
        "Complimentary high-speed Wi-Fi across all rooms, studios, suites, and lounges.",
        "24-hour reception, concierge assistance, and complimentary on-site parking.",
      ],
    },
  ],
  ar: [
    {
      id: "dining-cafe-benefits",
      title: "مزايا المطعم والمقهى",
      lines: [
        "خصم حصري 10% لنزلاء الفندق في مطعم ديوان مدى.",
        "خصم حصري 10% لنزلاء الفندق في مقهى أوز بارك.",
        "خدمة الطعام داخل الغرف على مدار الساعة.",
      ],
    },
    {
      id: "hotel-exclusives",
      title: "مزايا الفندق والواجهة البحرية",
      lines: [
        "موقع مباشر على الواجهة البحرية للكورنيش الجنوبي في القنفذة.",
        "إنترنت لاسلكي عالي السرعة مجاناً في جميع الغرف والأجنحة والمرافق.",
        "استقبال وخدمة ضيوف على مدار 24 ساعة ومواقف سيارات مجانية.",
      ],
    },
  ],
};

export const roomCategoriesPageData: Record<"en" | "ar", Record<RoomCategorySlug, RoomCategoryPageData>> = {
  en: {
    rooms: {
      slug: "rooms",
      eyebrow: "ROOMS & SUITES",
      title: "Deluxe & Superior Rooms",
      shortTitle: "Rooms",
      heroSubtitle: "Red Sea-inspired comfort with calming views of Al Qunfudhah's South Corniche and coast.",
      heroImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      discoverEyebrow: "DELUXE & SUPERIOR ROOMS",
      discoverTitle: "Discover your ideal room",
      discoverSubtitle: "More space or a different view, choose what matters most.",
      roomSlugs: ["deluxe-room", "superior-room"],
      privilegesTitle: "Included with every Room",
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Luxury Suite",
        subtitle: "Separate living salons, panoramic Red Sea views, and generous multi-bedroom comfort await.",
        buttonLabel: "Explore",
        targetCategorySlug: "suites",
        image: "/images/ozpark/rooms/royal-suite/1.jpg",
      },
    },
    studios: {
      slug: "studios",
      eyebrow: "ROOMS & SUITES",
      title: "Superior Studios",
      shortTitle: "Studios",
      heroSubtitle: "The ideal balance of coastal elegance, open-plan living space, and home-like convenience.",
      heroImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      discoverEyebrow: "SUPERIOR STUDIOS",
      discoverTitle: "Discover your ideal studio",
      discoverSubtitle: "Thoughtfully designed open-plan comfort for short breaks and extended coastal stays.",
      roomSlugs: ["superior-studio"],
      privilegesTitle: "Included with every Studio",
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Luxury Suite",
        subtitle: "Step up to separate living and dining areas with expansive views over the Red Sea.",
        buttonLabel: "Explore",
        targetCategorySlug: "suites",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    suites: {
      slug: "suites",
      eyebrow: "ROOMS & SUITES",
      title: "Luxury Suites",
      shortTitle: "Suites",
      heroSubtitle: "Expansive living spaces, refined coastal interiors, and commanding views of the Red Sea.",
      heroImage: "/images/ozpark/rooms/royal-suite/1.jpg",
      discoverEyebrow: "LUXURY SUITES",
      discoverTitle: "Discover your ideal suite",
      discoverSubtitle: "From elegant junior suites to our flagship Royal Suite, experience elevated living by the sea.",
      roomSlugs: ["twin-junior-suite", "superior-suite", "deluxe-suite", "royal-suite"],
      privilegesTitle: "Included with every Suite",
      upgradeBanner: {
        eyebrow: "THE PINNACLE OF OZ PARK",
        title: "Experience the Flagship Royal Suite",
        subtitle: "Extraordinary in scale, rich in detail, and crafted for unforgettable family and VIP stays.",
        buttonLabel: "Explore",
        targetRoomSlug: "royal-suite",
        image: "/images/ozpark/rooms/royal-suite/4.jpg",
      },
    },
  },
  ar: {
    rooms: {
      slug: "rooms",
      eyebrow: "الغرف والأجنحة",
      title: "غرف الديلوكس والسوبيريور",
      shortTitle: "الغرف",
      heroSubtitle: "راحة مستوحاة من هدوء البحر الأحمر مع إطلالات جميلة على الكورنيش الجنوبي في القنفذة.",
      heroImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      discoverEyebrow: "غرف الديلوكس والسوبيريور",
      discoverTitle: "اكتشف غرفتك المثالية",
      discoverSubtitle: "مساحة أرحب أو إطلالة مختلفة، اختر ما يناسب إقامتك.",
      roomSlugs: ["deluxe-room", "superior-room"],
      privilegesTitle: "مشمولة مع كل غرفة",
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى أحد الأجنحة الفاخرة",
        subtitle: "صالات معيشة منفصلة وإطلالات بانورامية على البحر الأحمر ومساحات رحبة بانتظارك.",
        buttonLabel: "استكشف",
        targetCategorySlug: "suites",
        image: "/images/ozpark/rooms/royal-suite/1.jpg",
      },
    },
    studios: {
      slug: "studios",
      eyebrow: "الغرف والأجنحة",
      title: "استوديوهات سوبيريور",
      shortTitle: "الاستوديوهات",
      heroSubtitle: "التوازن المثالي بين الأناقة الساحلية والمساحة المفتوحة والمرونة التي تشبه دفء المنزل.",
      heroImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      discoverEyebrow: "استوديوهات سوبيريور",
      discoverTitle: "اكتشف الاستوديو المثالي لك",
      discoverSubtitle: "تصميم مفتوح يجمع بين الراحة العصرية والعملية للإقامات القصيرة والطويلة.",
      roomSlugs: ["superior-studio"],
      privilegesTitle: "مشمولة مع كل استوديو",
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى جناح فاخر",
        subtitle: "استمتع بصالات جلوس وطعام منفصلة وإطلالات ساحرة على البحر الأحمر.",
        buttonLabel: "استكشف",
        targetCategorySlug: "suites",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    suites: {
      slug: "suites",
      eyebrow: "الغرف والأجنحة",
      title: "الأجنحة الفاخرة",
      shortTitle: "الأجنحة",
      heroSubtitle: "مساحات معيشة فسيحة وتصاميم داخلية راقية وإطلالات خلابة على ساحل البحر الأحمر.",
      heroImage: "/images/ozpark/rooms/royal-suite/1.jpg",
      discoverEyebrow: "الأجنحة الفاخرة",
      discoverTitle: "اكتشف جناحك المثالي",
      discoverSubtitle: "من جناح جونيور الأنيق إلى الجناح الملكي الفاخر، عِش تجربة إقامة استثنائية على ضفاف البحر.",
      roomSlugs: ["twin-junior-suite", "superior-suite", "deluxe-suite", "royal-suite"],
      privilegesTitle: "مشمولة مع كل جناح",
      upgradeBanner: {
        eyebrow: "قمة الفخامة في أوز بارك",
        title: "اختبر فخامة الجناح الملكي (Royal Suite)",
        subtitle: "مساحة استثنائية وتفاصيل فاخرة مصممة للعائلات وكبار الضيوف.",
        buttonLabel: "استكشف",
        targetRoomSlug: "royal-suite",
        image: "/images/ozpark/rooms/royal-suite/4.jpg",
      },
    },
  },
};

export const specificRoomsData: Record<"en" | "ar", Record<RoomSlug, RoomDetailData>> = {
  en: {
    "deluxe-room": {
      slug: "deluxe-room",
      categorySlug: "rooms",
      categoryEyebrow: "DELUXE & SUPERIOR ROOMS",
      name: "Deluxe King Room",
      cardDescription: "A refined retreat with a plush king bed, lounge seating, and calming views across the Red Sea.",
      size: "35 sqm",
      bed: "1 King Bed",
      occupancy: "Up to 2 adults + 1 child",
      view: "Red Sea View",
      heroImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      cardImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      collageHeading: "Wake up to full colour",
      collageDescription:
        "A spacious sea-facing room complete with picture windows, refined coastal interiors, plush king bedding, and a dedicated sitting area that reflects the calm of the Red Sea beyond the window.",
      collageImages: [
        "/images/ozpark/rooms/deluxe-room/2.jpg",
        "/images/ozpark/rooms/deluxe-room/3.jpg",
        "/images/ozpark/rooms/deluxe-room/4.jpg",
        "/images/ozpark/rooms/deluxe-room/5.jpg",
        "/images/ozpark/rooms/deluxe-room/6.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/deluxe-room/1.jpg",
        "/images/ozpark/rooms/deluxe-room/2.jpg",
        "/images/ozpark/rooms/deluxe-room/3.jpg",
        "/images/ozpark/rooms/deluxe-room/4.jpg",
        "/images/ozpark/rooms/deluxe-room/5.jpg",
        "/images/ozpark/rooms/deluxe-room/6.jpg",
        "/images/ozpark/rooms/deluxe-room/7.jpg",
      ],
      privilegesTitle: "Included with every Deluxe Room",
      featuredAmenities: [
        { icon: "balcony", label: "Sea-view window" },
        { icon: "sitting", label: "Sitting area" },
        { icon: "desk", label: "Executive work desk" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "balcony", label: "Sea-view picture window" },
        { icon: "sitting", label: "Sitting area with armchairs" },
        { icon: "desk", label: "Executive work desk" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "shower", label: "Walk-in rain shower" },
        { icon: "coffee", label: "Coffee & tea hospitality station" },
        { icon: "tv", label: "Flat-screen Smart TV" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Mini-fridge" },
        { icon: "safe", label: "In-room digital safe" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Superior Studio",
        subtitle: "Enjoy 42 sqm of open-plan living with a dedicated kitchenette counter and dining table.",
        buttonLabel: "Explore",
        targetRoomSlug: "superior-studio",
        image: "/images/ozpark/rooms/superior-studio/1.jpg",
      },
    },
    "superior-room": {
      slug: "superior-room",
      categorySlug: "rooms",
      categoryEyebrow: "DELUXE & SUPERIOR ROOMS",
      name: "Superior King Room",
      cardDescription: "A tranquil, contemporary room featuring a king bed, warm ambient lighting, and modern comforts.",
      size: "33 sqm",
      bed: "1 King Bed",
      occupancy: "Up to 2 adults",
      view: "City / Coastal View",
      heroImage: "/images/ozpark/rooms/superior-room/1.jpg",
      cardImage: "/images/ozpark/rooms/superior-room/1.jpg",
      collageHeading: "Serene comfort in every detail",
      collageDescription:
        "Thoughtfully tailored for restful nights and productive days, the Superior King Room pairs plush bedding, soundproofed interiors, and contemporary furnishings in the heart of Al Qunfudhah.",
      collageImages: [
        "/images/ozpark/rooms/superior-room/1.jpg",
        "/images/ozpark/rooms/superior-room/2.jpg",
        "/images/ozpark/rooms/superior-room/3.jpg",
        "/images/ozpark/rooms/superior-room/4.jpg",
        "/images/ozpark/rooms/superior-room/5.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/superior-room/1.jpg",
        "/images/ozpark/rooms/superior-room/2.jpg",
        "/images/ozpark/rooms/superior-room/3.jpg",
        "/images/ozpark/rooms/superior-room/4.jpg",
        "/images/ozpark/rooms/superior-room/5.jpg",
      ],
      privilegesTitle: "Included with every Superior Room",
      featuredAmenities: [
        { icon: "sitting", label: "Sitting area" },
        { icon: "desk", label: "Work desk" },
        { icon: "connecting", label: "Soundproofed room" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "sitting", label: "Lounge seating area" },
        { icon: "desk", label: "Dedicated work desk" },
        { icon: "connecting", label: "Soundproofed interiors" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "shower", label: "Walk-in shower" },
        { icon: "coffee", label: "Electric kettle & tea/coffee station" },
        { icon: "tv", label: "Flat-screen Smart TV" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Mini-fridge" },
        { icon: "safe", label: "In-room digital safe" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Deluxe King Room",
        subtitle: "Step up to extra space and calming Red Sea views along the South Corniche.",
        buttonLabel: "Explore",
        targetRoomSlug: "deluxe-room",
        image: "/images/ozpark/rooms/deluxe-room/1.jpg",
      },
    },
    "superior-studio": {
      slug: "superior-studio",
      categorySlug: "studios",
      categoryEyebrow: "SUPERIOR STUDIOS",
      name: "Superior Studio",
      cardDescription: "Generous 42 sqm open-plan studio featuring a king bedroom lounge, dining table, and kitchenette counter.",
      size: "42 sqm",
      bed: "1 King Bed",
      occupancy: "Up to 2 adults + 1 child",
      view: "Coastal / City View",
      heroImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      cardImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      collageHeading: "Space & flexibility that feels like home",
      collageDescription:
        "Designed for guests who appreciate extra room to unwind, the Superior Studio combines a plush king sleeping area and upholstered lounge with a convenient kitchenette counter and dining space.",
      collageImages: [
        "/images/ozpark/rooms/superior-studio/1.jpg",
        "/images/ozpark/rooms/superior-studio/2.jpg",
        "/images/ozpark/rooms/superior-studio/3.jpg",
        "/images/ozpark/rooms/superior-studio/4.jpg",
        "/images/ozpark/rooms/superior-studio/5.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/superior-studio/1.jpg",
        "/images/ozpark/rooms/superior-studio/2.jpg",
        "/images/ozpark/rooms/superior-studio/3.jpg",
        "/images/ozpark/rooms/superior-studio/4.jpg",
        "/images/ozpark/rooms/superior-studio/5.jpg",
      ],
      privilegesTitle: "Included with every Superior Studio",
      featuredAmenities: [
        { icon: "kitchenette", label: "Kitchenette & dining" },
        { icon: "sitting", label: "Sitting area" },
        { icon: "desk", label: "Work desk" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "kitchenette", label: "Kitchenette counter with sink & dining table" },
        { icon: "sitting", label: "Open-plan sitting area" },
        { icon: "desk", label: "Work desk & dressing mirror" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "shower", label: "Walk-in shower & premium toiletries" },
        { icon: "coffee", label: "Coffee & tea hospitality station" },
        { icon: "tv", label: "Flat-screen Smart TV" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Mini-fridge" },
        { icon: "safe", label: "In-room digital safe" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Deluxe Suite",
        subtitle: "Experience 90 sqm of coastal luxury with a separate living room, dining area, and sea views.",
        buttonLabel: "Explore",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    "twin-junior-suite": {
      slug: "twin-junior-suite",
      categorySlug: "suites",
      categoryEyebrow: "LUXURY SUITES",
      name: "Twin Junior Suite",
      cardDescription: "An elegant 50 sqm junior suite featuring two twin beds, a comfortable lounge area, and coastal views.",
      size: "50 sqm",
      bed: "2 Twin Beds",
      occupancy: "Up to 2 adults + 1 child",
      view: "Sea / Coastal View",
      heroImage: "/images/ozpark/rooms/twin-junior-suite/4.jpg",
      cardImage: "/images/ozpark/rooms/twin-junior-suite/1.jpg",
      collageHeading: "Tailored space for effortless sharing",
      collageDescription:
        "Blending twin-bed comfort with generous junior suite proportions, the Twin Junior Suite offers a relaxing lounge area, refined coastal textures, and modern en-suite amenities.",
      collageImages: [
        "/images/ozpark/rooms/twin-junior-suite/1.jpg",
        "/images/ozpark/rooms/twin-junior-suite/2.jpg",
        "/images/ozpark/rooms/twin-junior-suite/3.jpg",
        "/images/ozpark/rooms/twin-junior-suite/5.jpg",
        "/images/ozpark/rooms/twin-junior-suite/6.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/twin-junior-suite/1.jpg",
        "/images/ozpark/rooms/twin-junior-suite/2.jpg",
        "/images/ozpark/rooms/twin-junior-suite/3.jpg",
        "/images/ozpark/rooms/twin-junior-suite/4.jpg",
        "/images/ozpark/rooms/twin-junior-suite/5.jpg",
        "/images/ozpark/rooms/twin-junior-suite/6.jpg",
        "/images/ozpark/rooms/twin-junior-suite/7.jpg",
      ],
      privilegesTitle: "Included with every Twin Junior Suite",
      featuredAmenities: [
        { icon: "balcony", label: "Coastal view" },
        { icon: "sitting", label: "Junior suite lounge" },
        { icon: "desk", label: "Work desk" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "balcony", label: "Sea / coastal view windows" },
        { icon: "sitting", label: "Spacious lounge sitting area" },
        { icon: "desk", label: "Executive work desk" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "shower", label: "Walk-in rain shower" },
        { icon: "coffee", label: "Coffee & tea hospitality station" },
        { icon: "tv", label: "Flat-screen Smart TV" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Mini-fridge" },
        { icon: "safe", label: "In-room digital safe" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Superior Suite",
        subtitle: "Discover 85 sqm of two-bedroom family living with a separate salon and sea views.",
        buttonLabel: "Explore",
        targetRoomSlug: "superior-suite",
        image: "/images/ozpark/rooms/superior-suite/1.jpg",
      },
    },
    "superior-suite": {
      slug: "superior-suite",
      categorySlug: "suites",
      categoryEyebrow: "LUXURY SUITES",
      name: "Superior Suite",
      cardDescription: "A refined 85 sqm two-bedroom family suite with a separate living room, dining area, and sea & park views.",
      size: "85 sqm",
      bed: "1 King Bed + 2 Twin Beds",
      occupancy: "Up to 4 adults + 1 child",
      view: "Sea & Park View",
      heroImage: "/images/ozpark/rooms/superior-suite/6.jpg",
      cardImage: "/images/ozpark/rooms/superior-suite/1.jpg",
      collageHeading: "Generous living for memorable family stays",
      collageDescription:
        "Thoughtfully arranged across 85 sqm, the Superior Suite brings together a master king bedroom, a second twin bedroom, and an inviting living salon overlooking the coast and park.",
      collageImages: [
        "/images/ozpark/rooms/superior-suite/1.jpg",
        "/images/ozpark/rooms/superior-suite/2.jpg",
        "/images/ozpark/rooms/superior-suite/3.jpg",
        "/images/ozpark/rooms/superior-suite/7.jpg",
        "/images/ozpark/rooms/superior-suite/10.jpg",
      ],
      allGalleryImages: Array.from({ length: 21 }, (_, i) => `/images/ozpark/rooms/superior-suite/${i + 1}.jpg`),
      privilegesTitle: "Included with every Superior Suite",
      featuredAmenities: [
        { icon: "balcony", label: "Sea & park view" },
        { icon: "sitting", label: "Separate living room" },
        { icon: "connecting", label: "2 bedrooms" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "balcony", label: "Panoramic sea & waterfront park views" },
        { icon: "sitting", label: "Separate living room with sofa & dining area" },
        { icon: "connecting", label: "Two separate bedrooms (King + Twin)" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "kitchenette", label: "Hospitality kitchenette counter" },
        { icon: "shower", label: "En-suite bathrooms with walk-in shower" },
        { icon: "coffee", label: "Coffee & tea hospitality station" },
        { icon: "tv", label: "Multiple flat-screen Smart TVs" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Mini-fridge & refreshment bar" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to a Deluxe Suite",
        subtitle: "Enjoy 90 sqm of panoramic Red Sea living with an expansive salon and private balcony.",
        buttonLabel: "Explore",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    "deluxe-suite": {
      slug: "deluxe-suite",
      categorySlug: "suites",
      categoryEyebrow: "LUXURY SUITES",
      name: "Deluxe Suite",
      cardDescription: "Expansive 90 sqm two-bedroom suite with a panoramic sea-view living salon, dining table, and private balcony.",
      size: "90 sqm",
      bed: "1 King Bed + 2 Twin Beds",
      occupancy: "Up to 4 adults + 2 children",
      view: "Panoramic Red Sea View",
      heroImage: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      cardImage: "/images/ozpark/rooms/deluxe-suite/3.jpg",
      collageHeading: "Elevated coastal living with panoramic views",
      collageDescription:
        "Spanning 90 sqm of light-filled elegance, the Deluxe Suite features a stately living and dining salon, private balcony access, and two tranquil bedrooms framed by sweeping views of the Red Sea.",
      collageImages: [
        "/images/ozpark/rooms/deluxe-suite/2.jpg",
        "/images/ozpark/rooms/deluxe-suite/3.jpg",
        "/images/ozpark/rooms/deluxe-suite/4.jpg",
        "/images/ozpark/rooms/deluxe-suite/6.jpg",
        "/images/ozpark/rooms/deluxe-suite/8.jpg",
      ],
      allGalleryImages: Array.from({ length: 10 }, (_, i) => `/images/ozpark/rooms/deluxe-suite/${i + 1}.jpg`),
      privilegesTitle: "Included with every Deluxe Suite",
      featuredAmenities: [
        { icon: "balcony", label: "Balcony & sea view" },
        { icon: "sitting", label: "Expansive living salon" },
        { icon: "connecting", label: "2 bedrooms" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour room service" },
      ],
      allAmenities: [
        { icon: "balcony", label: "Private balcony & panoramic Red Sea view" },
        { icon: "sitting", label: "Expansive living room & formal dining table" },
        { icon: "connecting", label: "Two bedrooms (1 King + 2 Twin beds)" },
        { icon: "wifi", label: "Free high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour room service" },
        { icon: "kitchenette", label: "Kitchenette counter & refreshment bar" },
        { icon: "shower", label: "Luxury bathrooms with walk-in shower" },
        { icon: "coffee", label: "Premium coffee & tea station" },
        { icon: "tv", label: "Multiple Smart TVs" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "safe", label: "In-room digital safe" },
      ],
      upgradeBanner: {
        eyebrow: "UPGRADE YOUR STAY",
        title: "Elevate Your Stay to the Royal Suite",
        subtitle: "Step into our flagship 120 sqm sanctuary of luxury overlooking the Red Sea.",
        buttonLabel: "Explore",
        targetRoomSlug: "royal-suite",
        image: "/images/ozpark/rooms/royal-suite/1.jpg",
      },
    },
    "royal-suite": {
      slug: "royal-suite",
      categorySlug: "suites",
      categoryEyebrow: "SIGNATURE SUITES",
      name: "Royal Suite",
      cardDescription: "The pinnacle of OZ Park Hotel. Extraordinary in scale, rich in detail, and crafted for up to 6 guests.",
      size: "120 sqm",
      bed: "Master King + Twin Bedrooms",
      occupancy: "Up to 6 guests",
      view: "Panoramic Red Sea & Corniche View",
      heroImage: "/images/ozpark/rooms/royal-suite/1.jpg",
      cardImage: "/images/ozpark/rooms/royal-suite/4.jpg",
      collageHeading: "Where coastal grandeur meets timeless comfort",
      collageDescription:
        "Our flagship 120 sqm Royal Suite is designed for guests who expect nothing less than exceptional—combining a grand reception and dining salon, master and twin bedrooms, and uninterrupted views of the Red Sea.",
      collageImages: [
        "/images/ozpark/rooms/royal-suite/2.jpg",
        "/images/ozpark/rooms/royal-suite/3.jpg",
        "/images/ozpark/rooms/royal-suite/5.jpg",
        "/images/ozpark/rooms/royal-suite/8.jpg",
        "/images/ozpark/rooms/royal-suite/12.jpg",
      ],
      allGalleryImages: Array.from({ length: 20 }, (_, i) => `/images/ozpark/rooms/royal-suite/${i + 1}.jpg`),
      privilegesTitle: "Included with every Royal Suite",
      featuredAmenities: [
        { icon: "balcony", label: "Panoramic sea view" },
        { icon: "sitting", label: "Grand reception salon" },
        { icon: "connecting", label: "Multi-bedroom suite" },
        { icon: "wifi", label: "Free wifi" },
        { icon: "room-service", label: "24-hour VIP service" },
      ],
      allAmenities: [
        { icon: "balcony", label: "Commanding Red Sea & South Corniche views" },
        { icon: "sitting", label: "Grand reception salon & 6-seat dining area" },
        { icon: "connecting", label: "Master King bedroom + Twin bedroom" },
        { icon: "wifi", label: "Complimentary high-speed Wi-Fi" },
        { icon: "room-service", label: "24-hour VIP room service" },
        { icon: "bathtub", label: "Luxury bathrooms & vanity suites" },
        { icon: "shower", label: "Walk-in rain showers" },
        { icon: "coffee", label: "Espresso, coffee & tea hospitality bar" },
        { icon: "tv", label: "Large-format Smart TVs in salon & bedrooms" },
        { icon: "hairdryer", label: "Hair dryer" },
        { icon: "iron", label: "Iron & ironing board" },
        { icon: "minibar", label: "Full kitchenette & minibar" },
      ],
      upgradeBanner: {
        eyebrow: "ROMANTIC CELEBRATIONS",
        title: "Discover Our Deluxe Suite",
        subtitle: "Explore another spacious two-bedroom sea-view sanctuary designed for unforgettable stays.",
        buttonLabel: "Explore",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
  },
  ar: {
    "deluxe-room": {
      slug: "deluxe-room",
      categorySlug: "rooms",
      categoryEyebrow: "غرف الديلوكس والسوبيريور",
      name: "غرفة ديلوكس كينغ",
      cardDescription: "ملاذ أنيق بسرير كينغ فاخر وجلسة استرخاء مريحة وإطلالات هادئة على البحر الأحمر.",
      size: "35 م²",
      bed: "سرير كينغ",
      occupancy: "حتى شخصين بالغين وطفل",
      view: "إطلالة على البحر الأحمر",
      heroImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      cardImage: "/images/ozpark/rooms/deluxe-room/1.jpg",
      collageHeading: "استيقظ على جمال الإطلالة البحرية",
      collageDescription:
        "غرفة فسيحة مطلة على البحر تتميز بنوافذ بانورامية وتصاميم داخلية ساحلية راقية ومفروشات كينغ فاخرة ومنطقة جلوس مريحة تعكس هدوء البحر الأحمر.",
      collageImages: [
        "/images/ozpark/rooms/deluxe-room/2.jpg",
        "/images/ozpark/rooms/deluxe-room/3.jpg",
        "/images/ozpark/rooms/deluxe-room/4.jpg",
        "/images/ozpark/rooms/deluxe-room/5.jpg",
        "/images/ozpark/rooms/deluxe-room/6.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/deluxe-room/1.jpg",
        "/images/ozpark/rooms/deluxe-room/2.jpg",
        "/images/ozpark/rooms/deluxe-room/3.jpg",
        "/images/ozpark/rooms/deluxe-room/4.jpg",
        "/images/ozpark/rooms/deluxe-room/5.jpg",
        "/images/ozpark/rooms/deluxe-room/6.jpg",
        "/images/ozpark/rooms/deluxe-room/7.jpg",
      ],
      privilegesTitle: "مشمولة مع كل غرفة ديلوكس",
      featuredAmenities: [
        { icon: "balcony", label: "إطلالة بحرية" },
        { icon: "sitting", label: "منطقة جلوس" },
        { icon: "desk", label: "مكتب عمل" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "balcony", label: "نافذة بانورامية بإطلالة بحرية" },
        { icon: "sitting", label: "منطقة جلوس بكراسي مريحة" },
        { icon: "desk", label: "مكتب عمل تنفيذي" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "shower", label: "دُش استحمام عصري" },
        { icon: "coffee", label: "ركن ضيافة القهوة والشاي" },
        { icon: "tv", label: "شاشة تلفاز ذكية" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "ثلاجة صغيرة (ميني بار)" },
        { icon: "safe", label: "خزنة رقمية داخل الغرفة" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى استوديو سوبيريور",
        subtitle: "استمتع بمساحة 42 م² بتصميم مفتوح مع طاولة طعام وركن مطبخ تحضيري.",
        buttonLabel: "استكشف",
        targetRoomSlug: "superior-studio",
        image: "/images/ozpark/rooms/superior-studio/1.jpg",
      },
    },
    "superior-room": {
      slug: "superior-room",
      categorySlug: "rooms",
      categoryEyebrow: "غرف الديلوكس والسوبيريور",
      name: "غرفة سوبيريور كينغ",
      cardDescription: "غرفة عصرية هادئة تضم سرير كينغ فاخراً وإضاءة دافئة وكافة وسائل الراحة الحديثة.",
      size: "33 م²",
      bed: "سرير كينغ",
      occupancy: "حتى شخصين بالغين",
      view: "إطلالة على المدينة / الساحل",
      heroImage: "/images/ozpark/rooms/superior-room/1.jpg",
      cardImage: "/images/ozpark/rooms/superior-room/1.jpg",
      collageHeading: "راحة هادئة في كل تفصيل",
      collageDescription:
        "صُممت غرفة سوبيريور كينغ لتمنحك نوماً هانئاً وإقامة مريحة، حيث تجمع بين المفروشات الفاخرة والعزل الصوتي المتكامل والتصميم العصري الأنيق.",
      collageImages: [
        "/images/ozpark/rooms/superior-room/1.jpg",
        "/images/ozpark/rooms/superior-room/2.jpg",
        "/images/ozpark/rooms/superior-room/3.jpg",
        "/images/ozpark/rooms/superior-room/4.jpg",
        "/images/ozpark/rooms/superior-room/5.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/superior-room/1.jpg",
        "/images/ozpark/rooms/superior-room/2.jpg",
        "/images/ozpark/rooms/superior-room/3.jpg",
        "/images/ozpark/rooms/superior-room/4.jpg",
        "/images/ozpark/rooms/superior-room/5.jpg",
      ],
      privilegesTitle: "مشمولة مع كل غرفة سوبيريور",
      featuredAmenities: [
        { icon: "sitting", label: "منطقة جلوس" },
        { icon: "desk", label: "مكتب عمل" },
        { icon: "connecting", label: "عزل صوتي" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "sitting", label: "منطقة جلوس واسترخاء" },
        { icon: "desk", label: "مكتب عمل مخصص" },
        { icon: "connecting", label: "عزل صوتي كامل للغرفة" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "shower", label: "حمّام خاص بدُش استحمام" },
        { icon: "coffee", label: "غلاية وركن القهوة والشاي" },
        { icon: "tv", label: "شاشة تلفاز ذكية" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "ثلاجة صغيرة" },
        { icon: "safe", label: "خزنة رقمية داخل الغرفة" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى غرفة ديلوكس كينغ",
        subtitle: "استمتع بمساحة إضافية وإطلالة ساحرة على مياه البحر الأحمر.",
        buttonLabel: "استكشف",
        targetRoomSlug: "deluxe-room",
        image: "/images/ozpark/rooms/deluxe-room/1.jpg",
      },
    },
    "superior-studio": {
      slug: "superior-studio",
      categorySlug: "studios",
      categoryEyebrow: "استوديوهات سوبيريور",
      name: "استوديو سوبيريور",
      cardDescription: "استوديو فسيح بمساحة 42 م² بتصميم مفتوح يضم سرير كينغ ومنطقة جلوس وطاولة طعام وركن مطبخ تحضيري.",
      size: "42 م²",
      bed: "سرير كينغ",
      occupancy: "حتى شخصين بالغين وطفل",
      view: "إطلالة ساحلية / المدينة",
      heroImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      cardImage: "/images/ozpark/rooms/superior-studio/1.jpg",
      collageHeading: "رحابة ومرونة تشبه دفء المنزل",
      collageDescription:
        "صُمم استوديو سوبيريور للضيوف الذين يفضّلون المساحة الإضافية والخصوصية، حيث يجمع بين منطقة النوم والجلوس المريحة وركن المطبخ التحضيري وطاولة الطعام.",
      collageImages: [
        "/images/ozpark/rooms/superior-studio/1.jpg",
        "/images/ozpark/rooms/superior-studio/2.jpg",
        "/images/ozpark/rooms/superior-studio/3.jpg",
        "/images/ozpark/rooms/superior-studio/4.jpg",
        "/images/ozpark/rooms/superior-studio/5.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/superior-studio/1.jpg",
        "/images/ozpark/rooms/superior-studio/2.jpg",
        "/images/ozpark/rooms/superior-studio/3.jpg",
        "/images/ozpark/rooms/superior-studio/4.jpg",
        "/images/ozpark/rooms/superior-studio/5.jpg",
      ],
      privilegesTitle: "مشمولة مع كل استوديو سوبيريور",
      featuredAmenities: [
        { icon: "kitchenette", label: "ركن مطبخ وطعام" },
        { icon: "sitting", label: "منطقة جلوس" },
        { icon: "desk", label: "مكتب عمل" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "kitchenette", label: "ركن مطبخ تحضيري مع حوض وطاولة طعام" },
        { icon: "sitting", label: "منطقة جلوس رحبة بتصميم مفتوح" },
        { icon: "desk", label: "مكتب عمل ومرآة تسريحة" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "shower", label: "حمّام عصري بدُش ومستلزمات فاخرة" },
        { icon: "coffee", label: "ركن ضيافة القهوة والشاي" },
        { icon: "tv", label: "شاشة تلفاز ذكية" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "ثلاجة صغيرة" },
        { icon: "safe", label: "خزنة رقمية داخل الغرفة" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى جناح ديلوكس",
        subtitle: "اختبر 90 م² من الفخامة الساحلية مع صالة معيشة منفصلة وإطلالة بانورامية على البحر.",
        buttonLabel: "استكشف",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    "twin-junior-suite": {
      slug: "twin-junior-suite",
      categorySlug: "suites",
      categoryEyebrow: "الأجنحة الفاخرة",
      name: "جناح جونيور توأم",
      cardDescription: "جناح جونيور أنيق بمساحة 50 م² يضم سريرين مفردين ومنطقة جلوس مريحة وإطلالات ساحلية.",
      size: "50 م²",
      bed: "سريران مفردان",
      occupancy: "حتى شخصين بالغين وطفل",
      view: "إطلالة بحرية / ساحلية",
      heroImage: "/images/ozpark/rooms/twin-junior-suite/4.jpg",
      cardImage: "/images/ozpark/rooms/twin-junior-suite/1.jpg",
      collageHeading: "مساحة مصممة للراحة والمشاركة",
      collageDescription:
        "يجمع جناح جونيور التوأم بين رحابة الأجنحة وخصوصية السريرين المفردين مع منطقة جلوس أنيقة وتفاصيل ساحلية دافئة.",
      collageImages: [
        "/images/ozpark/rooms/twin-junior-suite/1.jpg",
        "/images/ozpark/rooms/twin-junior-suite/2.jpg",
        "/images/ozpark/rooms/twin-junior-suite/3.jpg",
        "/images/ozpark/rooms/twin-junior-suite/5.jpg",
        "/images/ozpark/rooms/twin-junior-suite/6.jpg",
      ],
      allGalleryImages: [
        "/images/ozpark/rooms/twin-junior-suite/1.jpg",
        "/images/ozpark/rooms/twin-junior-suite/2.jpg",
        "/images/ozpark/rooms/twin-junior-suite/3.jpg",
        "/images/ozpark/rooms/twin-junior-suite/4.jpg",
        "/images/ozpark/rooms/twin-junior-suite/5.jpg",
        "/images/ozpark/rooms/twin-junior-suite/6.jpg",
        "/images/ozpark/rooms/twin-junior-suite/7.jpg",
      ],
      privilegesTitle: "مشمولة مع كل جناح جونيور",
      featuredAmenities: [
        { icon: "balcony", label: "إطلالة ساحلية" },
        { icon: "sitting", label: "صالة جلوس" },
        { icon: "desk", label: "مكتب عمل" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "balcony", label: "نوافذ واسعة بإطلالة بحرية / ساحلية" },
        { icon: "sitting", label: "منطقة جلوس رحبة" },
        { icon: "desk", label: "مكتب عمل تنفيذي" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "shower", label: "حمّام خاص بدُش مطري" },
        { icon: "coffee", label: "ركن ضيافة القهوة والشاي" },
        { icon: "tv", label: "شاشة تلفاز ذكية" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "ثلاجة صغيرة" },
        { icon: "safe", label: "خزنة رقمية داخل الجناح" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى جناح سوبيريور",
        subtitle: "اكتشف 85 م² من الراحة العائلية بغرفتي نوم وصالة معيشة منفصلة.",
        buttonLabel: "استكشف",
        targetRoomSlug: "superior-suite",
        image: "/images/ozpark/rooms/superior-suite/1.jpg",
      },
    },
    "superior-suite": {
      slug: "superior-suite",
      categorySlug: "suites",
      categoryEyebrow: "الأجنحة الفاخرة",
      name: "جناح سوبيريور",
      cardDescription: "جناح عائلي راقٍ بمساحة 85 م² يضم غرفتي نوم وصالة معيشة منفصلة ومنطقة طعام وإطلالة على البحر والحديقة.",
      size: "85 م²",
      bed: "سرير كينغ + سريران مفردان",
      occupancy: "حتى 4 بالغين وطفل",
      view: "إطلالة على البحر والحديقة",
      heroImage: "/images/ozpark/rooms/superior-suite/6.jpg",
      cardImage: "/images/ozpark/rooms/superior-suite/1.jpg",
      collageHeading: "مساحة رحبة لإقامات عائلية لا تُنسى",
      collageDescription:
        "يمتد جناح سوبيريور على مساحة 85 م² ليوفّر غرفة نوم رئيسية بسرير كينغ وغرفة نوم ثانية بسريرين مفردين وصالة معيشة مستقلة بإطلالة ساحلية جميلة.",
      collageImages: [
        "/images/ozpark/rooms/superior-suite/1.jpg",
        "/images/ozpark/rooms/superior-suite/2.jpg",
        "/images/ozpark/rooms/superior-suite/3.jpg",
        "/images/ozpark/rooms/superior-suite/7.jpg",
        "/images/ozpark/rooms/superior-suite/10.jpg",
      ],
      allGalleryImages: Array.from({ length: 21 }, (_, i) => `/images/ozpark/rooms/superior-suite/${i + 1}.jpg`),
      privilegesTitle: "مشمولة مع كل جناح سوبيريور",
      featuredAmenities: [
        { icon: "balcony", label: "إطلالة البحر والحديقة" },
        { icon: "sitting", label: "صالة معيشة منفصلة" },
        { icon: "connecting", label: "غرفتا نوم" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "balcony", label: "إطلالات بانورامية على البحر والحديقة البحرية" },
        { icon: "sitting", label: "صالة معيشة منفصلة بأرائك وطاولة طعام" },
        { icon: "connecting", label: "غرفتا نوم منفصلتان (كينغ + توأم)" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "kitchenette", label: "ركن مطبخ تحضيري للضيافة" },
        { icon: "shower", label: "حمّامات خاصة بدُش استحمام عصري" },
        { icon: "coffee", label: "ركن القهوة والشاي" },
        { icon: "tv", label: "شاشات تلفاز ذكية متعددة" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "ثلاجة صغيرة وركن مرطبات" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى جناح ديلوكس",
        subtitle: "استمتع بمساحة 90 م² مع صالة بانورامية مطلة على البحر الأحمر وشرفة خاصة.",
        buttonLabel: "استكشف",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
    "deluxe-suite": {
      slug: "deluxe-suite",
      categorySlug: "suites",
      categoryEyebrow: "الأجنحة الفاخرة",
      name: "جناح ديلوكس",
      cardDescription: "جناح فاخر بمساحة 90 م² يضم غرفتي نوم وصالة معيشة وطعام بانورامية مطلة على البحر وشرفة خاصة.",
      size: "90 م²",
      bed: "سرير كينغ + سريران مفردان",
      occupancy: "حتى 4 بالغين وطفلين",
      view: "إطلالة بانورامية على البحر الأحمر",
      heroImage: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      cardImage: "/images/ozpark/rooms/deluxe-suite/3.jpg",
      collageHeading: "إقامة ساحلية راقية بإطلالات بانورامية",
      collageDescription:
        "يمتد جناح ديلوكس على مساحة 90 م² من الأناقة المغمورة بالضوء الطبيعي، ويضم صالة استقبال وطعام فسيحة وشرفة خاصة وغرفتي نوم هادئتين بإطلالة ساحرة على البحر الأحمر.",
      collageImages: [
        "/images/ozpark/rooms/deluxe-suite/2.jpg",
        "/images/ozpark/rooms/deluxe-suite/3.jpg",
        "/images/ozpark/rooms/deluxe-suite/4.jpg",
        "/images/ozpark/rooms/deluxe-suite/6.jpg",
        "/images/ozpark/rooms/deluxe-suite/8.jpg",
      ],
      allGalleryImages: Array.from({ length: 10 }, (_, i) => `/images/ozpark/rooms/deluxe-suite/${i + 1}.jpg`),
      privilegesTitle: "مشمولة مع كل جناح ديلوكس",
      featuredAmenities: [
        { icon: "balcony", label: "شرفة وإطلالة بحرية" },
        { icon: "sitting", label: "صالة معيشة فسيحة" },
        { icon: "connecting", label: "غرفتا نوم" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة غرف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "balcony", label: "شرفة خاصة وإطلالة بانورامية على البحر الأحمر" },
        { icon: "sitting", label: "صالة معيشة واسعة وطاولة طعام" },
        { icon: "connecting", label: "غرفتا نوم (سرير كينغ + سريران مفردان)" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف على مدار 24 ساعة" },
        { icon: "kitchenette", label: "ركن مطبخ تحضيري وميني بار" },
        { icon: "shower", label: "حمّامات فاخرة بدُش مطري" },
        { icon: "coffee", label: "ركن ضيافة القهوة والشاي الفاخر" },
        { icon: "tv", label: "شاشات تلفاز ذكية متعددة" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "safe", label: "خزنة رقمية داخل الجناح" },
      ],
      upgradeBanner: {
        eyebrow: "ارتقِ بإقامتك",
        title: "ارتقِ بإقامتك إلى الجناح الملكي (Royal Suite)",
        subtitle: "انتقل إلى جناحنا الملكي الرئيسي بمساحة 120 م² المطل على البحر الأحمر.",
        buttonLabel: "استكشف",
        targetRoomSlug: "royal-suite",
        image: "/images/ozpark/rooms/royal-suite/1.jpg",
      },
    },
    "royal-suite": {
      slug: "royal-suite",
      categorySlug: "suites",
      categoryEyebrow: "الأجنحة الملكية المميزة",
      name: "الجناح الملكي (Royal Suite)",
      cardDescription: "قمة الفخامة في فندق أوز بارك. مساحة استثنائية وتفاصيل فاخرة مصممة لاستضافة حتى 6 ضيوف.",
      size: "120 م²",
      bed: "غرفة ماستر كينغ + غرف توأم",
      occupancy: "حتى 6 ضيوف",
      view: "إطلالة بانورامية على البحر والكورنيش",
      heroImage: "/images/ozpark/rooms/royal-suite/1.jpg",
      cardImage: "/images/ozpark/rooms/royal-suite/4.jpg",
      collageHeading: "حيث تلتقي الفخامة الساحلية بالراحة المطلقة",
      collageDescription:
        "صُمم الجناح الملكي الرئيسي بمساحة 120 م² للضيوف الباحثين عن تجربة لا تُضاهى، حيث يجمع بين صالة استقبال وطعام ملكية وغرف نوم رئيسية وإضافية وإطلالات مفتوحة على البحر الأحمر.",
      collageImages: [
        "/images/ozpark/rooms/royal-suite/2.jpg",
        "/images/ozpark/rooms/royal-suite/3.jpg",
        "/images/ozpark/rooms/royal-suite/5.jpg",
        "/images/ozpark/rooms/royal-suite/8.jpg",
        "/images/ozpark/rooms/royal-suite/12.jpg",
      ],
      allGalleryImages: Array.from({ length: 20 }, (_, i) => `/images/ozpark/rooms/royal-suite/${i + 1}.jpg`),
      privilegesTitle: "مشمولة مع كل جناح ملكي",
      featuredAmenities: [
        { icon: "balcony", label: "إطلالة بانورامية" },
        { icon: "sitting", label: "صالة استقبال ملكية" },
        { icon: "connecting", label: "غرف نوم متعددة" },
        { icon: "wifi", label: "واي فاي مجاني" },
        { icon: "room-service", label: "خدمة كبار الضيوف 24 ساعة" },
      ],
      allAmenities: [
        { icon: "balcony", label: "إطلالات بانورامية على البحر الأحمر والكورنيش الجنوبي" },
        { icon: "sitting", label: "صالة استقبال ملكية وطاولة طعام لـ 6 ضيوف" },
        { icon: "connecting", label: "غرفة نوم ماستر كينغ + غرفة نوم توأم" },
        { icon: "wifi", label: "إنترنت لاسلكي عالي السرعة مجاناً" },
        { icon: "room-service", label: "خدمة غرف لكبار الضيوف على مدار 24 ساعة" },
        { icon: "bathtub", label: "حمّامات فاخرة بمساحات واسعة" },
        { icon: "shower", label: "دُش مطري ومستلزمات عناية فاخرة" },
        { icon: "coffee", label: "ركن ضيافة الإسبريسو والقهوة والشاي" },
        { icon: "tv", label: "شاشات تلفاز ذكية كبيرة في الصالة وغرف النوم" },
        { icon: "hairdryer", label: "مجفف شعر" },
        { icon: "iron", label: "مكواة وطاولة كيّ" },
        { icon: "minibar", label: "مطبخ تحضيري متكامل وميني بار" },
      ],
      upgradeBanner: {
        eyebrow: "إقامات مميزة",
        title: "اكتشف جناح ديلوكس الفاخر",
        subtitle: "استكشف جناحاً آخر بغرفتي نوم وإطلالة بانورامية ساحرة على البحر الأحمر.",
        buttonLabel: "استكشف",
        targetRoomSlug: "deluxe-suite",
        image: "/images/ozpark/rooms/deluxe-suite/1.jpg",
      },
    },
  },
};
