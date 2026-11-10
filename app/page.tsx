"use client";

import { useEffect, useRef, useState } from "react";
import {
  AtlantisRoomIcon,
  type RoomCategorySlug,
  type RoomSlug,
  roomCategoriesPageData,
  roomPrivilegesAccordionData,
  roomPrivilegesCarouselData,
  specificRoomsData,
} from "./roomsData";

type Language = "ar" | "en";
type ActivePage =
  | "home"
  | "wedding"
  | "offer2"
  | "offer3"
  | "offer4"
  | "dining"
  | "cafe"
  | "meeting"
  | "stay"
  | "room-category"
  | "room-detail";

const signatureImages = [
  "/images/ozpark/slider-hotel.jpg",
  "/images/ozpark/slider-restaurant.jpg",
  "/images/ozpark/slider-cafe.jpg",
  "/images/ozpark/slider-meeting.jpg",
  "/images/ozpark/slider-pool-gym.jpg",
];

const offerImages = [
  "/images/ozpark/home-card1-romantic-balloons-4k.jpg",
  "/images/ozpark/home-card2-king-seaview-4k.jpg",
  "/images/ozpark/home-card3-extendedstay-4k.jpg",
  "/images/ozpark/home-card4-dining-4k.jpg",
];

type OfferModalData = {
  id: string;
  category: string;
  title: string;
  copy: string;
  cta: string;
  image: string;
  gallery: string[];
  subtitle: string;
  details: string[];
  highlightsTitle: string;
  highlights: string[];
  conditionsTitle: string;
  conditions: string[];
};

type ExperienceSlideData = {
  id: string;
  category: string;
  title: string;
  copy: string;
  ctaLabel: string;
  comingSoon?: boolean;
  image: string;
  gallery?: string[];
  modalSubtitle?: string;
  modalDetails?: string[];
  modalHighlights?: string[];
};

type SubRoomItem = {
  name: string;
  size: string;
  occupancy: string;
  bed: string;
  view: string;
  image: string;
  description: string;
};

type AccommodationCategoryData = {
  id: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  gallery: string[];
  subtitle: string;
  overview: string;
  amenities: string[];
  subRooms: SubRoomItem[];
};

type WeddingPackageItem = {
  id: string;
  numberLabel: string;
  name: string;
  tier: string;
  badge?: string;
  image: string;
  description: string;
  includedTitle: string;
  included: string[];
  priceLabel: string;
  price: string;
  priceNote: string;
  cta: string;
  whatsappSubject: string;
};

type WeddingGalleryItem = {
  src: string;
  title: string;
  caption: string;
};

type OfferAccordionItem = {
  id: string;
  title: string;
  bullets: string[];
  images?: { src: string; caption: string }[];
};

type Offer2ShowcaseCard = {
  src: string;
  badge: string;
  title: string;
  caption: string;
};

type DiningMenuCategoryCard = {
  id: string;
  numberLabel: string;
  category: string;
  title: string;
  description: string;
  featuredDishes: string[];
  buttonLabel: string;
  image: string;
  href: string;
};

type DiningExperienceSlide = {
  id: string;
  tabLabel: string;
  smallHeading: string;
  mainHeading: string;
  description: string[];
  buttonLabel: string;
  image: string;
  secondaryImage?: string;
  primaryBadge?: string;
  secondaryBadge?: string;
  href: string;
};

type CafeMenuSlide = {
  id: string;
  tabLabel: string;
  smallHeading: string;
  mainHeading: string;
  description: string;
  buttonLabel: string;
  image: string;
  whatsappSubject: string;
};

const cafeMenuSlidesData: Record<Language, CafeMenuSlide[]> = {
  en: [
    {
      id: "hot-drinks",
      tabLabel: "Hot Drinks",
      smallHeading: "FRESHLY BREWED FAVORITES",
      mainHeading: "Warmth in Every Sip",
      description:
        "Discover the rich aromas and comforting flavors of your favorite hot beverages, thoughtfully prepared for every coffee moment.",
      buttonLabel: "EXPLORE HOT DRINKS",
      image: "/images/ozpark/cafe-slide-hot-drinks-4k.jpg",
      whatsappSubject: "OZ Park Café — Hot Drinks Menu",
    },
    {
      id: "cold-drinks",
      tabLabel: "Cold Drinks",
      smallHeading: "CHILLED & REFRESHING",
      mainHeading: "Refresh Your Moment",
      description:
        "Cool down with our selection of refreshing cold beverages, perfect for relaxing afternoons and peaceful evenings by the sea.",
      buttonLabel: "EXPLORE COLD DRINKS",
      image: "/images/ozpark/cafe-slide-cold-drinks-4k.jpg",
      whatsappSubject: "OZ Park Café — Cold Drinks Menu",
    },
    {
      id: "fresh-juices",
      tabLabel: "Fresh Juices",
      smallHeading: "FRESH & NATURAL",
      mainHeading: "A Fresh Taste of Nature",
      description:
        "Enjoy refreshing fruit flavors with our selection of freshly prepared juices, bringing a naturally delicious touch to your day.",
      buttonLabel: "EXPLORE FRESH JUICES",
      image: "/images/ozpark/cafe-slide-fresh-juices-4k.jpg",
      whatsappSubject: "OZ Park Café — Fresh Juices Menu",
    },
    {
      id: "smoothies",
      tabLabel: "Smoothies",
      smallHeading: "BLENDED TO PERFECTION",
      mainHeading: "Smooth, Fresh & Delicious",
      description:
        "Discover delightful smoothie creations, bringing together refreshing flavors and smooth textures for the perfect treat.",
      buttonLabel: "EXPLORE SMOOTHIES",
      image: "/images/ozpark/cafe-slide-smoothies-4k.jpg",
      whatsappSubject: "OZ Park Café — Smoothies Menu",
    },
    {
      id: "desserts-cakes",
      tabLabel: "Desserts & Cakes",
      smallHeading: "A LITTLE SOMETHING SWEET",
      mainHeading: "Sweet Moments to Remember",
      description:
        "Complete your café experience with a delicious selection of cakes and desserts, perfect alongside your favorite coffee.",
      buttonLabel: "EXPLORE DESSERTS",
      image: "/images/ozpark/cafe-slide-desserts-4k.jpg",
      whatsappSubject: "OZ Park Café — Desserts & Cakes Menu",
    },
  ],
  ar: [
    {
      id: "hot-drinks",
      tabLabel: "المشروبات الساخنة",
      smallHeading: "مفضلات محضّرة طازجة",
      mainHeading: "دفء في كل رشفة",
      description:
        "اكتشف الروائح الغنية والنكهات الدافئة لمشروباتك الساخنة المفضلة، المحضّرة بعناية لكل لحظة قهوة.",
      buttonLabel: "استكشف المشروبات الساخنة",
      image: "/images/ozpark/cafe-slide-hot-drinks-4k.jpg",
      whatsappSubject: "مقهى أوز بارك — قائمة المشروبات الساخنة",
    },
    {
      id: "cold-drinks",
      tabLabel: "المشروبات الباردة",
      smallHeading: "باردة ومنعشة",
      mainHeading: "انتعش في كل لحظة",
      description:
        "استمتع بالانتعاش مع تشكيلتنا المختارة من المشروبات الباردة، المثالية لأوقات الظهيرة المريحة والأمسيات الهادئة على ضفاف البحر.",
      buttonLabel: "استكشف المشروبات الباردة",
      image: "/images/ozpark/cafe-slide-cold-drinks-4k.jpg",
      whatsappSubject: "مقهى أوز بارك — قائمة المشروبات الباردة",
    },
    {
      id: "fresh-juices",
      tabLabel: "العصائر الطازجة",
      smallHeading: "طازجة وطبيعية",
      mainHeading: "مذاق الطبيعة المنعش",
      description:
        "استمتع بنكهات الفواكه المنعشة مع تشكيلتنا من العصائر الطازجة، التي تضفي لمسة طبيعية شهية على يومك.",
      buttonLabel: "استكشف العصائر الطازجة",
      image: "/images/ozpark/cafe-slide-fresh-juices-4k.jpg",
      whatsappSubject: "مقهى أوز بارك — قائمة العصائر الطازجة",
    },
    {
      id: "smoothies",
      tabLabel: "السموذي",
      smallHeading: "ممزوجة بإتقان",
      mainHeading: "قوام ناعم، طازج وشهي",
      description:
        "اكتشف ابتكارات السموذي الرائعة التي تجمع بين النكهات المنعشة والقوام الكريمي الناعم.",
      buttonLabel: "استكشف السموذي",
      image: "/images/ozpark/cafe-slide-smoothies-4k.jpg",
      whatsappSubject: "مقهى أوز بارك — قائمة السموذي",
    },
    {
      id: "desserts-cakes",
      tabLabel: "الحلويات والكيك",
      smallHeading: "لمسة حلوة مميزة",
      mainHeading: "لحظات حلوة لا تُنسى",
      description:
        "أكمل تجربتك في المقهى مع تشكيلة شهية من الكيك والحلويات الفاخرة، المثالية بجانب قهوتك المفضلة.",
      buttonLabel: "استكشف الحلويات",
      image: "/images/ozpark/cafe-slide-desserts-4k.jpg",
      whatsappSubject: "مقهى أوز بارك — قائمة الحلويات والكيك",
    },
  ],
};

type MeetingInclusionCategory = {
  categoryTitle: string;
  items: string[];
};

type MeetingPackageSlide = {
  id: string;
  tabLabel: string;
  smallHeading: string;
  mainHeading: string;
  description: string;
  price: string;
  inclusionsLabel: string;
  inclusions: MeetingInclusionCategory[];
  buttonLabel: string;
  viewInclusionsLabel: string;
  image: string;
  whatsappSubject: string;
};

const meetingPackageSlidesData: Record<Language, MeetingPackageSlide[]> = {
  en: [
    {
      id: "standard-coffee-break",
      tabLabel: "Standard Coffee Break",
      smallHeading: "STANDARD PACKAGE",
      mainHeading: "A Refreshing Meeting Break",
      description:
        "Keep your team refreshed with a carefully selected assortment of hot and cold beverages, savory snacks, and delicious pastries.",
      price: "SAR 50 per person",
      inclusionsLabel: "Package Inclusions:",
      inclusions: [
        {
          categoryTitle: "Cold Beverages",
          items: ["Selection of juices", "Mineral water"],
        },
        {
          categoryTitle: "Hot Beverages",
          items: ["American coffee", "Nescafé", "Assorted tea"],
        },
        {
          categoryTitle: "Savory Bites",
          items: ["Mixed mini sandwiches", "Cheese bites"],
        },
        {
          categoryTitle: "Bakery & Pastries",
          items: ["Croissants", "Danish pastries", "Cookies"],
        },
      ],
      buttonLabel: "INQUIRE ON WHATSAPP",
      viewInclusionsLabel: "VIEW PACKAGE DETAILS",
      image: "/images/ozpark/meeting-pkg-standard-4k.jpg",
      whatsappSubject: "Meeting Room — Standard Coffee Break Package (SAR 50 per person)",
    },
    {
      id: "special-coffee-break",
      tabLabel: "Special Coffee Break",
      smallHeading: "SPECIAL PACKAGE",
      mainHeading: "Elevate Your Meeting Experience",
      description:
        "Add an elevated touch to your gathering with a generous selection of refreshing drinks, premium savory bites, delightful pastries, and sweet treats.",
      price: "SAR 70 per person",
      inclusionsLabel: "Package Inclusions:",
      inclusions: [
        {
          categoryTitle: "Cold Beverages",
          items: ["Two kinds of juice", "Mineral water"],
        },
        {
          categoryTitle: "Hot Beverages",
          items: ["American coffee", "Nescafé", "Assorted tea"],
        },
        {
          categoryTitle: "Savory Bites",
          items: [
            "Mixed mini sandwiches",
            "Smoked salmon",
            "Mini burgers",
            "Mini chicken",
            "Cheese bites",
          ],
        },
        {
          categoryTitle: "Bakery, Pastries & Desserts",
          items: [
            "English cake",
            "Croissants",
            "Danish pastries",
            "Two kinds of mini desserts",
            "Cookies",
            "Mixed seasonal fruits",
          ],
        },
      ],
      buttonLabel: "INQUIRE ON WHATSAPP",
      viewInclusionsLabel: "VIEW PACKAGE DETAILS",
      image: "/images/ozpark/meeting-pkg-special-4k.jpg",
      whatsappSubject: "Meeting Room — Special Coffee Break Package (SAR 70 per person)",
    },
  ],
  ar: [
    {
      id: "standard-coffee-break",
      tabLabel: "استراحة القهوة القياسية",
      smallHeading: "الباقة القياسية",
      mainHeading: "استراحة اجتماع منعشة",
      description:
        "حافظ على نشاط فريقك مع تشكيلة مختارة بعناية من المشروبات الساخنة والباردة، والوجبات الخفيفة المالحة، والمعجنات الشهية.",
      price: "SAR 50 للشخص الواحد",
      inclusionsLabel: "محتويات الباقة:",
      inclusions: [
        {
          categoryTitle: "المشروبات الباردة",
          items: ["تشكيلة من العصائر", "مياه معدنية"],
        },
        {
          categoryTitle: "المشروبات الساخنة",
          items: ["قهوة أمريكية", "نسكافيه", "شاي مشكّل"],
        },
        {
          categoryTitle: "المقبلات المالحة",
          items: ["ساندويتشات ميني مشكلة", "مقبلات الجبن"],
        },
        {
          categoryTitle: "المخبوزات والمعجنات",
          items: ["كرواسون", "معجنات دانيش", "كوكيز"],
        },
      ],
      buttonLabel: "استفسر عبر واتساب",
      viewInclusionsLabel: "عرض تفاصيل الباقة",
      image: "/images/ozpark/meeting-pkg-standard-4k.jpg",
      whatsappSubject: "قاعة الاجتماعات — باقة استراحة القهوة القياسية (SAR 50 للشخص الواحد)",
    },
    {
      id: "special-coffee-break",
      tabLabel: "استراحة القهوة المميزة",
      smallHeading: "الباقة المميزة",
      mainHeading: "ارتقِ بتجربة اجتماعاتك",
      description:
        "أضف لمسة راقية لاجتماعك مع تشكيلة غنية من المشروبات المنعشة، والمقبلات المالحة الفاخرة، والمعجنات الشهية، والحلويات المميزة.",
      price: "SAR 70 للشخص الواحد",
      inclusionsLabel: "محتويات الباقة:",
      inclusions: [
        {
          categoryTitle: "المشروبات الباردة",
          items: ["نوعان من العصائر", "مياه معدنية"],
        },
        {
          categoryTitle: "المشروبات الساخنة",
          items: ["قهوة أمريكية", "نسكافيه", "شاي مشكّل"],
        },
        {
          categoryTitle: "المقبلات المالحة",
          items: [
            "ساندويتشات ميني مشكلة",
            "سلمون مدخن",
            "ميني برجر",
            "ميني دجاج",
            "مقبلات الجبن",
          ],
        },
        {
          categoryTitle: "المخبوزات والمعجنات والحلويات",
          items: [
            "إنجلش كيك",
            "كرواسون",
            "معجنات دانيش",
            "نوعان من الحلويات الصغيرة (ميني ديزرت)",
            "كوكيز",
            "فواكه موسمية مشكلة",
          ],
        },
      ],
      buttonLabel: "استفسر عبر واتساب",
      viewInclusionsLabel: "عرض تفاصيل الباقة",
      image: "/images/ozpark/meeting-pkg-special-4k.jpg",
      whatsappSubject: "قاعة الاجتماعات — باقة استراحة القهوة المميزة (SAR 70 للشخص الواحد)",
    },
  ],
};

const diningVisualGalleryImages: { src: string; altEn: string; altAr: string }[] = [
  {
    src: "/images/ozpark/offer4-hero-diwan-4k.jpg",
    altEn: "Diwan Mada Restaurant panoramic Red Sea dining room",
    altAr: "إطلالة بانورامية على البحر الأحمر في مطعم ديوان مدى",
  },
  {
    src: "/images/ozpark/dining-exp-breakfast-4k.jpg",
    altEn: "Breakfast Buffet at Diwan Mada Restaurant",
    altAr: "بوفيه الإفطار في مطعم ديوان مدى",
  },
  {
    src: "/images/ozpark/dining-exp-dinner-4k.jpg",
    altEn: "Dinner Buffet at Diwan Mada Restaurant",
    altAr: "بوفيه العشاء في مطعم ديوان مدى",
  },
  {
    src: "/images/ozpark/dining-exp-alacarte-restaurant-4k.jpg",
    altEn: "À La Carte dining table overlooking the Red Sea at Diwan Mada Restaurant",
    altAr: "تجربة الطلب من القائمة في مطعم ديوان مدى بإطلالة على البحر الأحمر",
  },
  {
    src: "/images/ozpark/dining-exp-alacarte-room-4k.jpg",
    altEn: "In-room dining experience at OZ Park Hotel",
    altAr: "خدمة الطعام داخل الغرف في فندق أوز بارك",
  },
  {
    src: "/images/ozpark/offer4-diwan-day-4k.jpg",
    altEn: "Daylight seaside ambiance at Diwan Mada Restaurant",
    altAr: "أجواء مطعم ديوان مدى النهارية المطلة على البحر",
  },
];

const diningMenuCategoriesData: Record<Language, DiningMenuCategoryCard[]> = {
  en: [
    {
      id: "salads-cold-appetizers",
      numberLabel: "01",
      category: "FRESH & FLAVORFUL",
      title: "Salads & Cold Appetizers",
      description:
        "Begin your dining experience with fresh salads and traditional Middle Eastern favorites, from Fattoush and Tabbouleh to Hummus, Moutabal, and more.",
      featuredDishes: ["Fattoush", "Tabbouleh", "Hummus", "Greek Salad"],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-salads-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "oriental-hot-appetizers",
      numberLabel: "02",
      category: "TRADITIONAL FAVORITES",
      title: "Oriental Hot Appetizers",
      description:
        "Enjoy comforting Middle Eastern classics, from crispy Kibbeh and savory Sambousek to traditional Shish Barak and warm Fatteh Hummus.",
      featuredDishes: ["Fried Kibbeh", "Sambousek", "Shish Barak", "Fatteh Hummus"],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-hot-appetizers-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "soups",
      numberLabel: "03",
      category: "WARM & COMFORTING",
      title: "Soups",
      description:
        "Savor a comforting selection of freshly prepared soups, from creamy chicken and mushroom varieties to traditional lentil and flavorful seafood soup.",
      featuredDishes: [
        "Cream of Chicken Soup",
        "Cream of Mushroom Soup",
        "Lentil Soup",
        "Seafood Soup",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-soups-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "grilled-specialties",
      numberLabel: "04",
      category: "FROM THE GRILL",
      title: "Grilled Specialties",
      description:
        "Discover the rich flavors of perfectly grilled meats and chicken, featuring traditional kebabs, juicy Shish Tawook, Mixed Grills, and tender Lamb Chops.",
      featuredDishes: [
        "Mixed Grill",
        "Meat Kebab",
        "Chicken Shish Tawook",
        "Grilled Lamb Chops",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-grilled-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "manakish",
      numberLabel: "05",
      category: "FRESHLY BAKED FAVORITES",
      title: "Manakish",
      description:
        "Enjoy the comforting flavors of traditional Manakish, with delicious varieties including Za'atar, Cheese, Labneh, Spinach, and Meat with Cheese.",
      featuredDishes: [
        "Za'atar Manakish",
        "Cheese Manakish",
        "Labneh & Za'atar Manakish",
        "Meat & Cheese Manakish",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-manakish-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "italian-corner",
      numberLabel: "06",
      category: "ITALIAN FAVORITES",
      title: "Italian Corner",
      description:
        "Enjoy a delicious selection of Italian favorites, from creamy Fettuccine and classic Spaghetti Bolognese to freshly prepared pizzas and Lasagna.",
      featuredDishes: [
        "Chicken Fettuccine",
        "Spaghetti Bolognese",
        "Lasagna",
        "Margherita Pizza",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-italian-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "burgers-sandwiches",
      numberLabel: "07",
      category: "CASUAL FAVORITES",
      title: "Burgers & Sandwiches",
      description:
        "Satisfy your cravings with delicious burgers and freshly prepared sandwiches, from juicy Beef Burgers and Crispy Chicken to flavorful Kebab and Shish Tawook Sandwiches.",
      featuredDishes: [
        "Double Smash Burger",
        "Classic Beef Burger",
        "Crispy Chicken Burger",
        "Shish Tawook Sandwich",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-cat-burgers-4k.jpg",
      href: "https://diwanmada.com/",
    },
  ],
  ar: [
    {
      id: "salads-cold-appetizers",
      numberLabel: "01",
      category: "طازجة وغنية بالنكهات",
      title: "السلطات والمقبلات الباردة",
      description:
        "ابدأ تجربة طعامك بتشكيلة من السلطات الطازجة والمقبلات الشرقية الأصيلة، من الفتوش والتبولة إلى الحمص والمتبل وغيرها الكثير.",
      featuredDishes: ["فتوش", "تبولة", "حمص", "سلطة يونانية"],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-salads-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "oriental-hot-appetizers",
      numberLabel: "02",
      category: "مفضلات شرقية أصيلة",
      title: "المقبلات الشرقية الساخنة",
      description:
        "استمتع بأشهى الكلاسيكيات الشرقية الدافئة، من الكبة المقرمشة والسمبوسك الشهية إلى الشيش برك التقليدي وفتة الحمص الدافئة.",
      featuredDishes: ["كبة مقلية", "سمبوسك", "شيش برك", "فتة حمص"],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-hot-appetizers-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "soups",
      numberLabel: "03",
      category: "دفء ومذاق غني",
      title: "الشوربات",
      description:
        "تذوّق تشكيلة مختارة من الشوربات المحضّرة طازجة يومياً، من شوربة كريمة الدجاج والفطر إلى شوربة العدس التقليدية وشوربة المأكولات البحرية.",
      featuredDishes: [
        "شوربة كريمة الدجاج",
        "شوربة كريمة الفطر",
        "شوربة عدس",
        "شوربة مأكولات بحرية",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-soups-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "grilled-specialties",
      numberLabel: "04",
      category: "من المشواة",
      title: "المشويات المميزة",
      description:
        "اكتشف النكهات الغنية للحوم والدجاج المشوي بإتقان، بما في ذلك الكباب التقليدي والشيش طاووق المتبل والمشويات المشكلة وريش الغنم الطرية.",
      featuredDishes: [
        "مشويات مشكلة",
        "كباب لحم",
        "شيش طاووق دجاج",
        "ريش غنم مشوية",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-grilled-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "manakish",
      numberLabel: "05",
      category: "مخبوزات طازجة من الفرن",
      title: "المناقيش",
      description:
        "استمتع بالنكهات الأصيلة للمناقيش المخبوزة طازجة بتشكيلة شهية تشمل الزعتر والجبن واللبنة والسبانخ واللحم بالجبن.",
      featuredDishes: [
        "مناقيش زعتر",
        "مناقيش جبن",
        "مناقيش لبنة وزعتر",
        "مناقيش لحم بالجبن",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-manakish-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "italian-corner",
      numberLabel: "06",
      category: "مفضلات إيطالية",
      title: "الركن الإيطالي",
      description:
        "تلذّذ بتشكيلة مختارة من أشهر الأطباق الإيطالية، من فيتوتشيني الدجاج الكريمية وسباغيتي بولونيز الكلاسيكية إلى البيتزا الطازجة واللازانيا.",
      featuredDishes: [
        "فيتوتشيني دجاج",
        "سباغيتي بولونيز",
        "لازانيا",
        "بيتزا مارغريتا",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-italian-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "burgers-sandwiches",
      numberLabel: "07",
      category: "خيارات عصرية شهية",
      title: "البرجر والساندويشات",
      description:
        "أشبع رغبتك بألذ أصناف البرجر والساندويشات المحضّرة طازجة، من برجر اللحم العصير والدجاج المقرمش إلى ساندويشات الكباب والشيش طاووق.",
      featuredDishes: [
        "دبل سماش برجر",
        "كلاسيك بيف برجر",
        "كريسبي تشيكن برجر",
        "ساندويش شيش طاووق",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-cat-burgers-4k.jpg",
      href: "https://diwanmada.com/",
    },
  ],
};

const diningExperiencesSlidesData: Record<Language, DiningExperienceSlide[]> = {
  en: [
    {
      id: "breakfast-buffet",
      tabLabel: "BREAKFAST BUFFET",
      smallHeading: "START YOUR DAY RIGHT",
      mainHeading: "Mornings Made Delicious",
      description: [
        "Start your morning with a delightful breakfast buffet featuring a selection of delicious favorites, served in a welcoming atmosphere with beautiful panoramic Red Sea views.",
      ],
      buttonLabel: "EXPLORE BREAKFAST",
      image: "/images/ozpark/dining-exp-breakfast-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "dinner-buffet",
      tabLabel: "DINNER BUFFET",
      smallHeading: "EVENINGS AT DIWAN MADA",
      mainHeading: "An Evening of Exceptional Flavors",
      description: [
        "Make your evenings memorable with a delicious dinner buffet, bringing together delightful flavors, warm hospitality, and an elegant seaside dining atmosphere.",
      ],
      buttonLabel: "EXPLORE DINNER",
      image: "/images/ozpark/dining-exp-dinner-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "a-la-carte",
      tabLabel: "À LA CARTE",
      smallHeading: "YOUR CHOICE, YOUR EXPERIENCE",
      mainHeading: "Your Favorites, Your Way",
      description: [
        "Choose from our diverse à la carte menu, featuring traditional favorites, grilled specialties, Italian dishes, and more.",
        "Join us at Diwan Mada Restaurant for an elegant dining experience or enjoy your favorite dishes from the comfort of your room at OZ Park Hotel.",
      ],
      buttonLabel: "EXPLORE MENU",
      image: "/images/ozpark/dining-exp-alacarte-restaurant-4k.jpg",
      secondaryImage: "/images/ozpark/dining-exp-alacarte-room-4k.jpg",
      primaryBadge: "RESTAURANT DINING",
      secondaryBadge: "IN-ROOM DINING",
      href: "https://diwanmada.com/",
    },
  ],
  ar: [
    {
      id: "breakfast-buffet",
      tabLabel: "بوفيه الإفطار",
      smallHeading: "ابدأ يومك بأجمل مذاق",
      mainHeading: "صباحات شهية بإطلالة بحرية",
      description: [
        "ابدأ صباحك ببوفيه إفطار شهي يضم تشكيلة مختارة من الأطباق المفضلة والطازجة، تُقدّم في أجواء ترحيبية دافئة مع إطلالات بانورامية ساحرة على البحر الأحمر.",
      ],
      buttonLabel: "استكشف الإفطار",
      image: "/images/ozpark/dining-exp-breakfast-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "dinner-buffet",
      tabLabel: "بوفيه العشاء",
      smallHeading: "أمسيات ديوان مدى",
      mainHeading: "أمسية من النكهات الاستثنائية",
      description: [
        "اجعل أمسياتك لا تُنسى مع بوفيه عشاء غني يجمع بين النكهات الشهية وكرم الضيافة والأجواء الساحلية الأنيقة المطلة على البحر.",
      ],
      buttonLabel: "استكشف العشاء",
      image: "/images/ozpark/dining-exp-dinner-4k.jpg",
      href: "https://diwanmada.com/",
    },
    {
      id: "a-la-carte",
      tabLabel: "الطلب من القائمة (À La Carte)",
      smallHeading: "اختيارك، تجربتك الخاصة",
      mainHeading: "أطباقك المفضلة، على طريقتك",
      description: [
        "اختر من قائمة الطعام المتنوعة لدينا، والتي تضم الأطباق الشرقية الأصيلة والمشويات المميزة والأطباق الإيطالية وغيرها الكثير.",
        "تفضّل بزيارتنا في مطعم ديوان مدى لتجربة طعام أنيقة أو استمتع بأطباقك المفضلة في راحة غرفتك في فندق أوز بارك.",
      ],
      buttonLabel: "استكشف القائمة",
      image: "/images/ozpark/dining-exp-alacarte-restaurant-4k.jpg",
      secondaryImage: "/images/ozpark/dining-exp-alacarte-room-4k.jpg",
      primaryBadge: "في المطعم",
      secondaryBadge: "في الغرفة",
      href: "https://diwanmada.com/",
    },
  ],
};

const offer2ShowcaseData: Record<Language, Offer2ShowcaseCard[]> = {
  en: [
    {
      src: "/images/ozpark/offer2-room-king-4k.jpg",
      badge: "UP TO 25% OFF • SUN–THU",
      title: "Spacious Ground-Floor King Rooms",
      caption: "Generous floor plans, plush king bedding, dedicated workspace, and effortless ground-floor access.",
    },
    {
      src: "/images/ozpark/room-deluxe-king-1.png",
      badge: "RED SEA VIEWS",
      title: "Calming Views of the Red Sea",
      caption: "Picture windows overlooking Al Qunfudhah's South Corniche and the tranquil Red Sea.",
    },
    {
      src: "/images/ozpark/room-twin-junior-suite-1.png",
      badge: "MODERN COMFORT",
      title: "Refined King & Twin Configurations",
      caption: "Contemporary coastal interiors with high-speed Wi-Fi, Smart TV, and refreshment station.",
    },
    {
      src: "/images/ozpark/offer2-room-seaview-4k.jpg",
      badge: "COASTAL LIVING",
      title: "Relaxing Seaside Lounge & Balcony",
      caption: "Unwind in comfort just steps away from the South Corniche waterfront.",
    },
  ],
  ar: [
    {
      src: "/images/ozpark/offer2-room-king-4k.jpg",
      badge: "خصم حتى 25% • الأحد–الخميس",
      title: "غرف كينغ فسيحة في الطابق الأرضي",
      caption: "مساحات رحبة وسرير كينغ فاخر ومكتب عمل مع سهولة الوصول في الطابق الأرضي.",
    },
    {
      src: "/images/ozpark/room-deluxe-king-1.png",
      badge: "إطلالات البحر الأحمر",
      title: "إطلالات هادئة على البحر الأحمر",
      caption: "نوافذ واسعة تطل على الكورنيش الجنوبي في القنفذة ومياه البحر الأحمر الهادئة.",
    },
    {
      src: "/images/ozpark/room-twin-junior-suite-1.png",
      badge: "راحة عصرية",
      title: "خيارات متعددة بسرير كينغ أو سريرين",
      caption: "تصاميم ساحلية أنيقة مع إنترنت عالي السرعة وشاشة ذكية وركن ضيافة متكامل.",
    },
    {
      src: "/images/ozpark/offer2-room-seaview-4k.jpg",
      badge: "إقامة ساحلية",
      title: "جلسات استرخاء وإطلالة بحرية مباشرة",
      caption: "استمتع بالهدوء والراحة على بُعد خطوات من الواجهة البحرية للكورنيش الجنوبي.",
    },
  ],
};

const offer2AccordionsData: Record<Language, OfferAccordionItem[]> = {
  en: [
    {
      id: "offer-inclusions",
      title: "Offer Inclusions",
      bullets: [
        "Enjoy up to 25% off selected ground-floor rooms.",
        "Experience comfortable accommodation with modern amenities and beautiful Red Sea views.",
        "Exclusive savings on weekday stays, Sunday through Thursday.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-hero-4k.jpg",
          caption: "Ground-Floor Deluxe King Room with Red Sea View",
        },
        {
          src: "/images/ozpark/room-superior-king-2.png",
          caption: "Contemporary Interiors & Plush Bedding",
        },
      ],
    },
    {
      id: "coastal-experiences",
      title: "Coastal Experiences",
      bullets: [
        "Discover exceptional dining with panoramic Red Sea views at Diwan Mada Restaurant.",
        "Enjoy freshly brewed coffee and refreshing beverages at OZ Park Café.",
        "Explore Al Qunfudhah's beautiful South Corniche, just steps from the hotel.",
        "Experience breathtaking Red Sea sunsets and peaceful seaside walks.",
        "Enjoy a relaxing coastal escape with the comfort and hospitality of OZ Park Hotel.",
      ],
      images: [
        {
          src: "/images/ozpark/facility-restaurant.png",
          caption: "Panoramic Sea-View Dining at Diwan Mada Restaurant",
        },
        {
          src: "/images/ozpark/facility-cafe.png",
          caption: "Specialty Coffee & Lounge at OZ Park Café",
        },
        {
          src: "/images/ozpark/tour-south-corniche-sunset.png",
          caption: "Red Sea Sunsets Along Al Qunfudhah's South Corniche",
        },
      ],
    },
    {
      id: "book-with-confidence",
      title: "Book with Confidence",
      bullets: [
        "Contact our reservations team directly through WhatsApp for personalized booking assistance.",
        "Confirm room availability, promotional rates, and booking details before making your reservation.",
        "Enjoy a straightforward reservation experience with support from our team.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-room-king-4k.jpg",
          caption: "Direct Reservation Assistance via Official WhatsApp",
        },
        {
          src: "/images/ozpark/offer2-room-seaview-4k.jpg",
          caption: "Guaranteed OZ Park Hospitality & Comfort",
        },
      ],
    },
    {
      id: "terms-and-conditions",
      title: "Terms & Conditions",
      bullets: [
        "Enjoy up to 25% off selected ground-floor rooms at OZ Park Hotel.",
        "Offer valid for stays from 1 November to 31 December 2026.",
        "Offer applies to weekday nights only (Sunday to Thursday). Friday and Saturday nights are excluded.",
        "Weekend nights included in a reservation will be charged at the applicable regular room rate.",
        "Discount applies to participating ground-floor room categories only.",
        "The offer is valid for new reservations only.",
        "Reservations must be made directly through OZ Park Hotel's official WhatsApp booking channel.",
        "All room rates are subject to applicable Saudi Arabian taxes and charges, as indicated at the time of booking.",
        "Discounted rates, room availability, and special requests are subject to availability.",
        "The offer cannot be combined with any other promotion or discount.",
        "Standard hotel booking, payment, modification, and cancellation policies apply.",
        "OZ Park Hotel reserves the right to modify or withdraw the offer for future reservations, without affecting confirmed bookings.",
      ],
    },
  ],
  ar: [
    {
      id: "offer-inclusions",
      title: "مزايا العرض",
      bullets: [
        "استمتع بخصم يصل إلى 25% على غرف مختارة في الطابق الأرضي.",
        "اختبر إقامة مريحة مع وسائل راحة عصرية وإطلالات جميلة على البحر الأحمر.",
        "توفير حصري على إقامات أيام الأسبوع، من الأحد إلى الخميس.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-hero-4k.jpg",
          caption: "غرفة ديلوكس كينغ في الطابق الأرضي بإطلالة على البحر الأحمر",
        },
        {
          src: "/images/ozpark/room-superior-king-2.png",
          caption: "تصاميم عصرية ومفروشات فاخرة",
        },
      ],
    },
    {
      id: "coastal-experiences",
      title: "تجارب ساحلية مميزة",
      bullets: [
        "اكتشف تجربة طعام استثنائية مع إطلالات بانورامية على البحر الأحمر في مطعم ديوان مدى.",
        "استمتع بالقهوة الطازجة والمشروبات المنعشة في مقهى أوز بارك.",
        "استكشف الكورنيش الجنوبي الجميل في القنفذة على بُعد خطوات من الفندق.",
        "عش لحظات غروب الشمس الساحرة على البحر الأحمر والنزهات البحرية الهادئة.",
        "استمتع بملاذ ساحلي مريح يجمع بين الراحة وكرم الضيافة في فندق أوز بارك.",
      ],
      images: [
        {
          src: "/images/ozpark/facility-restaurant.png",
          caption: "إطلالة بانورامية على البحر الأحمر في مطعم ديوان مدى",
        },
        {
          src: "/images/ozpark/facility-cafe.png",
          caption: "قهوة مختصة وجلسات راقية في مقهى أوز بارك",
        },
        {
          src: "/images/ozpark/tour-south-corniche-sunset.png",
          caption: "غروب الشمس على البحر الأحمر في الكورنيش الجنوبي بالقنفذة",
        },
      ],
    },
    {
      id: "book-with-confidence",
      title: "احجز بكل ثقة",
      bullets: [
        "تواصل مع فريق الحجوزات مباشرة عبر واتساب للحصول على مساعدة شخصية في الحجز.",
        "تأكد من توفر الغرف والأسعار الترويجية وتفاصيل الحجز قبل إتمام حجزك.",
        "استمتع بتجربة حجز سهلة ومباشرة بدعم متكامل من فريقنا.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-room-king-4k.jpg",
          caption: "خدمة حجوزات مباشرة عبر واتساب الرسمي",
        },
        {
          src: "/images/ozpark/offer2-room-seaview-4k.jpg",
          caption: "ضيافة وراحة مضمونة في فندق أوز بارك",
        },
      ],
    },
    {
      id: "terms-and-conditions",
      title: "الشروط والأحكام",
      bullets: [
        "استمتع بخصم يصل إلى 25% على غرف مختارة في الطابق الأرضي بفندق أوز بارك.",
        "يسري العرض للإقامات من 1 نوفمبر إلى 31 ديسمبر 2026.",
        "يطبق العرض على ليالي أيام الأسبوع فقط (من الأحد إلى الخميس). تُستثنى ليالي الجمعة والسبت.",
        "تُحتسب ليالي نهاية الأسبوع المشمولة في الحجز بالسعر الاعتيادي المطبق للغرفة.",
        "ينطبق الخصم على فئات الغرف المشاركة في الطابق الأرضي فقط.",
        "العرض صالح للحجوزات الجديدة فقط.",
        "يجب إجراء الحجوزات مباشرة عبر قناة الحجز الرسمية لفندق أوز بارك على واتساب.",
        "تخضع جميع أسعار الغرف للضرائب والرسوم المطبقة في المملكة العربية السعودية كما هو موضح وقت الحجز.",
        "تخضع الأسعار المخفضة وتوفر الغرف والطلبات الخاصة لإمكانية التوفر.",
        "لا يمكن دمج هذا العرض مع أي عرض ترويجي أو خصم آخر.",
        "تطبق سياسات الفندق القياسية الخاصة بالحجز والدفع والتعديل والإلغاء.",
        "يحتفظ فندق أوز بارك بالحق في تعديل العرض أو سحبه للحجوزات المستقبلية دون التأثير على الحجوزات المؤكدة.",
      ],
    },
  ],
};

const offer3ShowcaseData: Record<Language, Offer2ShowcaseCard[]> = {
  en: [
    {
      src: "/images/ozpark/offer2-room-seaview-4k.jpg",
      badge: "SAVE UP TO 35% • SUITES",
      title: "Participating Sea-View Suites",
      caption: "Expansive living and dining spaces with private sea-view balconies for extended coastal stays.",
    },
    {
      src: "/images/ozpark/offer2-room-king-4k.jpg",
      badge: "EXTENDED COMFORT • STUDIOS",
      title: "Spacious Studios with Lounge & Workspace",
      caption: "Generous 42 m² open-plan studios designed to make longer stays feel effortlessly like home.",
    },
    {
      src: "/images/ozpark/offer2-hero-4k.jpg",
      badge: "RED SEA VIEWS • ROOMS",
      title: "Comfortable Sea-View King Rooms",
      caption: "Modern amenities, plush king bedding, and panoramic windows overlooking the Red Sea.",
    },
    {
      src: "/images/ozpark/tour-south-corniche-main.png",
      badge: "AL QUNFUDHAH WATERFRONT",
      title: "Steps from the South Corniche",
      caption: "Enjoy peaceful seaside walks, refreshing coastal breezes, and memorable Red Sea sunsets.",
    },
  ],
  ar: [
    {
      src: "/images/ozpark/offer2-room-seaview-4k.jpg",
      badge: "خصم حتى 35% • الأجنحة",
      title: "أجنحة مشاركة بإطلالة بحرية",
      caption: "صالات معيشة وطعام فسيحة مع شرفات خاصة مطلة على البحر الأحمر للإقامات الطويلة.",
    },
    {
      src: "/images/ozpark/offer2-room-king-4k.jpg",
      badge: "راحة ممتدة • الاستوديوهات",
      title: "استوديوهات فسيحة مع جلسة ومكتب عمل",
      caption: "استوديوهات رحبة بمساحة 42 م² بتصميم مفتوح يمنحك دفء المنزل طوال فترة إقامتك.",
    },
    {
      src: "/images/ozpark/offer2-hero-4k.jpg",
      badge: "إطلالة البحر الأحمر • الغرف",
      title: "غرف كينغ مريحة مطلة على البحر",
      caption: "وسائل راحة عصرية وسرير كينغ فاخر ونوافذ بانورامية تطل على البحر الأحمر.",
    },
    {
      src: "/images/ozpark/tour-south-corniche-main.png",
      badge: "واجهة القنفذة البحرية",
      title: "على بُعد خطوات من الكورنيش الجنوبي",
      caption: "استمتع بالنزهات البحرية الهادئة ونسيم الساحل المنعش وغروب الشمس الساحر.",
    },
  ],
};

const offer3AccordionsData: Record<Language, OfferAccordionItem[]> = {
  en: [
    {
      id: "offer3-inclusions",
      title: "Offer Inclusions",
      bullets: [
        "Save up to 35% on eligible extended stays at OZ Park Hotel.",
        "Choose from comfortable rooms, spacious studios, and participating suites.",
        "Enjoy modern amenities and beautiful Red Sea views throughout your stay.",
        "Exclusive weekday savings, valid Sunday through Thursday, subject to the minimum stay requirement.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-room-seaview-4k.jpg",
          caption: "Participating Suites with Separate Living, Dining & Sea-View Balcony",
        },
        {
          src: "/images/ozpark/room-superior-studio-2.png",
          caption: "Spacious Studios & Dedicated Workspaces for Extended Stays",
        },
        {
          src: "/images/ozpark/room-deluxe-suite-1.jpg",
          caption: "Comfortable Bedrooms with Panoramic Red Sea Views",
        },
      ],
    },
    {
      id: "offer3-coastal-experiences",
      title: "Coastal Experiences",
      bullets: [
        "Savor exceptional flavors and panoramic sea views at Diwan Mada Restaurant.",
        "Enjoy your favorite coffee and relaxing moments overlooking the Red Sea at OZ Park Café.",
        "Discover the beauty of Al Qunfudhah's South Corniche, with its peaceful seaside atmosphere.",
        "Experience memorable sunsets and refreshing walks along the coast.",
        "Make yourself at home with the comfort and convenience of an extended stay at OZ Park Hotel.",
      ],
      images: [
        {
          src: "/images/ozpark/facility-restaurant.png",
          caption: "Exceptional Flavors & Panoramic Views at Diwan Mada Restaurant",
        },
        {
          src: "/images/ozpark/facility-cafe.png",
          caption: "Specialty Coffee & Sea-View Lounge at OZ Park Café",
        },
        {
          src: "/images/ozpark/tour-south-corniche-sunset.png",
          caption: "Memorable Red Sea Sunsets Along the South Corniche",
        },
      ],
    },
    {
      id: "offer3-book-with-confidence",
      title: "Book with Confidence",
      bullets: [
        "Explore available rooms, studios, and suites through our booking page.",
        "Select your preferred dates and review applicable promotional rates.",
        "Confirm room availability and booking conditions before completing your reservation.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-hero-4k.jpg",
          caption: "Explore Available Rooms, Studios & Suites",
        },
        {
          src: "/images/ozpark/room-deluxe-king-1.png",
          caption: "Thoughtful Amenities & Warm Red Sea Hospitality",
        },
      ],
    },
    {
      id: "offer3-terms-and-conditions",
      title: "Terms & Conditions",
      bullets: [
        "Enjoy up to 35% off eligible extended stays at OZ Park Hotel.",
        "Offer valid for stays from 1 November to 31 December 2026.",
        "Offer applies to weekday nights only (Sunday to Thursday). Friday and Saturday nights are excluded.",
        "Weekend nights included in a reservation will be charged at the applicable regular room rate.",
        "A minimum length of stay is required to qualify for the promotional discount.",
        "The offer applies to participating rooms, studios, and suites only.",
        "The offer is valid for new reservations only.",
        "Reservations must be completed through the official OZ Park Hotel booking channel.",
        "All room rates are subject to applicable Saudi Arabian taxes and charges, as indicated at the time of booking.",
        "Discounted rates, room availability, and special requests are subject to availability.",
        "The offer cannot be combined with any other promotion or discount.",
        "Standard hotel booking, payment, modification, and cancellation policies apply.",
        "OZ Park Hotel reserves the right to modify or withdraw the offer for future reservations, without affecting confirmed bookings.",
      ],
    },
  ],
  ar: [
    {
      id: "offer3-inclusions",
      title: "مزايا العرض",
      bullets: [
        "وفّر حتى 35% على الإقامات الطويلة المؤهلة في فندق أوز بارك.",
        "اختر من بين الغرف المريحة والاستوديوهات الفسيحة والأجنحة المشاركة.",
        "استمتع بوسائل الراحة العصرية والإطلالات الجميلة على البحر الأحمر طوال إقامتك.",
        "توفير حصري خلال أيام الأسبوع، يسري من الأحد إلى الخميس، وفقاً لشرط الحد الأدنى لمدة الإقامة.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-room-seaview-4k.jpg",
          caption: "أجنحة مشاركة بصالة معيشة وطعام وشرفة مطلة على البحر",
        },
        {
          src: "/images/ozpark/room-superior-studio-2.png",
          caption: "استوديوهات فسيحة ومساحات عمل مريحة للإقامات الطويلة",
        },
        {
          src: "/images/ozpark/room-deluxe-suite-1.jpg",
          caption: "غرف نوم مريحة بإطلالة بانورامية على البحر الأحمر",
        },
      ],
    },
    {
      id: "offer3-coastal-experiences",
      title: "تجارب ساحلية مميزة",
      bullets: [
        "تذوّق أشهى النكهات مع إطلالات بحرية بانورامية في مطعم ديوان مدى.",
        "استمتع بقهوتك المفضلة ولحظات الاسترخاء المطلة على البحر الأحمر في مقهى أوز بارك.",
        "اكتشف جمال الكورنيش الجنوبي في القنفذة وأجواءه الساحلية الهادئة.",
        "عش لحظات غروب الشمس الخالدة والنزهات المنعشة على طول الساحل.",
        "اشعر وكأنك في منزلك مع الراحة والمرونة التي توفرها الإقامة الطويلة في فندق أوز بارك.",
      ],
      images: [
        {
          src: "/images/ozpark/facility-restaurant.png",
          caption: "نكهات استثنائية وإطلالة بانورامية في مطعم ديوان مدى",
        },
        {
          src: "/images/ozpark/facility-cafe.png",
          caption: "قهوة مختصة وجلسات مطلة على البحر في مقهى أوز بارك",
        },
        {
          src: "/images/ozpark/tour-south-corniche-sunset.png",
          caption: "غروب الشمس الساحر على امتداد الكورنيش الجنوبي",
        },
      ],
    },
    {
      id: "offer3-book-with-confidence",
      title: "احجز بكل ثقة",
      bullets: [
        "استكشف الغرف والاستوديوهات والأجنحة المتاحة عبر صفحة الحجز لدينا.",
        "اختر التواريخ المفضلة لديك واطّلع على الأسعار الترويجية المطبقة.",
        "تأكد من توفر الغرف وشروط الحجز قبل إتمام حجزك.",
      ],
      images: [
        {
          src: "/images/ozpark/offer2-hero-4k.jpg",
          caption: "استكشف الغرف والاستوديوهات والأجنحة المتوفرة",
        },
        {
          src: "/images/ozpark/room-deluxe-king-1.png",
          caption: "وسائل راحة مدروسة وضيافة ساحلية دافئة",
        },
      ],
    },
    {
      id: "offer3-terms-and-conditions",
      title: "الشروط والأحكام",
      bullets: [
        "استمتع بخصم يصل إلى 35% على الإقامات الطويلة المؤهلة في فندق أوز بارك.",
        "يسري العرض للإقامات من 1 نوفمبر إلى 31 ديسمبر 2026.",
        "يطبق العرض على ليالي أيام الأسبوع فقط (من الأحد إلى الخميس). تُستثنى ليالي الجمعة والسبت.",
        "تُحتسب ليالي نهاية الأسبوع المشمولة في الحجز بالسعر الاعتيادي المطبق للغرفة.",
        "يلزم استيفاء الحد الأدنى لمدة الإقامة للتأهل للحصول على الخصم الترويجي.",
        "يسري العرض على الغرف والاستوديوهات والأجنحة المشاركة فقط.",
        "العرض صالح للحجوزات الجديدة فقط.",
        "يجب إتمام الحجوزات عبر قناة الحجز الرسمية لفندق أوز بارك.",
        "تخضع جميع أسعار الغرف للضرائب والرسوم المطبقة في المملكة العربية السعودية كما هو موضح وقت الحجز.",
        "تخضع الأسعار المخفضة وتوفر الغرف والطلبات الخاصة لإمكانية التوفر.",
        "لا يمكن دمج هذا العرض مع أي عرض ترويجي أو خصم آخر.",
        "تطبق سياسات الفندق القياسية الخاصة بالحجز والدفع والتعديل والإلغاء.",
        "يحتفظ فندق أوز بارك بالحق في تعديل العرض أو سحبه للحجوزات المستقبلية دون التأثير على الحجوزات المؤكدة.",
      ],
    },
  ],
};

const weddingPackagesData: Record<Language, WeddingPackageItem[]> = {
  en: [
    {
      id: "package-01",
      numberLabel: "PACKAGE 01",
      name: "First Whisper Package",
      tier: "The Essential Package",
      image: "/images/ozpark/wedding-img-0238.jpg",
      description:
        "Begin your journey together in an atmosphere filled with joy, simplicity, romance, and elegance.",
      includedTitle: "What's Included:",
      included: [
        "Helium balloons to add a joyful touch to the room.",
        "Bed decoration with natural roses.",
        "The couple's initials beautifully arranged.",
      ],
      priceLabel: "Package Price",
      price: "SAR 200",
      priceNote: "VAT included. Room accommodation is charged separately.",
      cta: "INQUIRE ON WHATSAPP",
      whatsappSubject: "Package 01 — First Whisper Package (The Essential Package - SAR 200)",
    },
    {
      id: "package-02",
      numberLabel: "PACKAGE 02",
      name: "Haneen Package",
      tier: "The Golden Package",
      image: "/images/ozpark/wedding-img-0243.jpg",
      description:
        "A touch of extra indulgence to make your first moments together even sweeter and more magical.",
      includedTitle: "What's Included:",
      included: [
        "Bed decoration with roses and balloons.",
        "The couple's initials beautifully arranged.",
        "A small, special romantic cake.",
        "Two fresh natural juices.",
        "A selection of crunchy nuts.",
      ],
      priceLabel: "Package Price",
      price: "SAR 400",
      priceNote: "VAT included. Room accommodation is charged separately.",
      cta: "INQUIRE ON WHATSAPP",
      whatsappSubject: "Package 02 — Haneen Package (The Golden Package - SAR 400)",
    },
    {
      id: "package-03",
      numberLabel: "PACKAGE 03",
      name: "A Thousand Nights & A Night Package",
      tier: "The Golden Package",
      badge: "MOST POPULAR",
      image: "/images/ozpark/wedding-img-0324.jpg",
      description:
        "A complete celebration combining romance with a luxurious dinner, designed to delight your senses on your first night together.",
      includedTitle: "What's Included:",
      included: [
        "Bed decoration with roses and balloons.",
        "A medium-sized celebration cake with a custom design.",
        "Two refreshing natural juices accompanied by premium nuts.",
        "A luxurious romantic dinner featuring assorted grills.",
        "Two varieties of salads served with dinner.",
      ],
      priceLabel: "Package Price",
      price: "SAR 700",
      priceNote: "VAT included. Room accommodation is charged separately.",
      cta: "INQUIRE ON WHATSAPP",
      whatsappSubject: "Package 03 — A Thousand Nights & A Night Package (The Golden Package - SAR 700)",
    },
    {
      id: "package-04",
      numberLabel: "PACKAGE 04",
      name: "Royal Package",
      tier: "The Royal Package",
      badge: "MOST POPULAR",
      image: "/images/ozpark/wedding-elegant-red-and-white-celebration-table.jpg",
      description:
        "Because you deserve the very best, experience an unforgettable royal celebration that exceeds every expectation.",
      includedTitle: "What's Included:",
      included: [
        "Luxurious and elaborate royal room decoration with roses and balloons.",
        "A large, premium royal celebration cake.",
        "Fresh natural juices and a premium assortment of nuts.",
        "A luxurious seafood dinner.",
        "Four varieties of distinctive international salads served with dinner.",
      ],
      priceLabel: "Package Price",
      price: "SAR 1,000",
      priceNote: "VAT included. Room accommodation is charged separately.",
      cta: "INQUIRE ON WHATSAPP",
      whatsappSubject: "Package 04 — Royal Package (The Royal Package - SAR 1,000)",
    },
  ],
  ar: [
    {
      id: "package-01",
      numberLabel: "الباقة 01",
      name: "باقة همسة أولى",
      tier: "الباقة الأساسية",
      image: "/images/ozpark/wedding-img-0238.jpg",
      description:
        "ابدأوا رحلتكما معاً في أجواء تفيض بالبهجة والبساطة والرومانسية والأناقة.",
      includedTitle: "ما تشمله الباقة:",
      included: [
        "بالونات هيليوم تضفي لمسة مبهجة على الغرفة.",
        "تزيين السرير بالورد الطبيعي.",
        "تنسيق أول حرفين من اسمي العروسين بشكل أنيق.",
      ],
      priceLabel: "سعر الباقة",
      price: "SAR 200",
      priceNote: "شامل ضريبة القيمة المضافة. رسوم إقامة الغرفة تُحتسب بشكل منفصل.",
      cta: "استفسر عبر واتساب",
      whatsappSubject: "الباقة 01 — باقة همسة أولى (الباقة الأساسية - SAR 200)",
    },
    {
      id: "package-02",
      numberLabel: "الباقة 02",
      name: "باقة حنين",
      tier: "الباقة الذهبية",
      image: "/images/ozpark/wedding-img-0243.jpg",
      description:
        "لمسة إضافية من الدلال والتميز لتجعل لحظاتكما الأولى معاً أكثر حلاوة وسحراً.",
      includedTitle: "ما تشمله الباقة:",
      included: [
        "تزيين السرير بالورود والبالونات.",
        "تنسيق أول حرفين من اسمي العروسين بشكل جميل.",
        "كيكة رومانسية صغيرة ومميزة.",
        "عصيران طبيعيان طازجان.",
        "تشكيلة مختارة من المكسرات المقرمشة.",
      ],
      priceLabel: "سعر الباقة",
      price: "SAR 400",
      priceNote: "شامل ضريبة القيمة المضافة. رسوم إقامة الغرفة تُحتسب بشكل منفصل.",
      cta: "استفسر عبر واتساب",
      whatsappSubject: "الباقة 02 — باقة حنين (الباقة الذهبية - SAR 400)",
    },
    {
      id: "package-03",
      numberLabel: "الباقة 03",
      name: "باقة ألف ليلة وليلة",
      tier: "الباقة الذهبية",
      badge: "MOST POPULAR",
      image: "/images/ozpark/wedding-img-0324.jpg",
      description:
        "احتفالية متكاملة تجمع بين الرومانسية وعشاء فاخر، صُممت لتبهج حواسكما في ليلتكما الأولى معاً.",
      includedTitle: "ما تشمله الباقة:",
      included: [
        "تزيين السرير بالورود والبالونات.",
        "كيكة احتفالية متوسطة الحجم بتصميم خاص.",
        "عصيران طبيعيان منعشان مع مكسرات فاخرة.",
        "عشاء رومانسي فاخر يضم تشكيلة مشويات.",
        "صنفان من السلطات يُقدمان مع العشاء.",
      ],
      priceLabel: "سعر الباقة",
      price: "SAR 700",
      priceNote: "شامل ضريبة القيمة المضافة. رسوم إقامة الغرفة تُحتسب بشكل منفصل.",
      cta: "استفسر عبر واتساب",
      whatsappSubject: "الباقة 03 — باقة ألف ليلة وليلة (الباقة الذهبية - SAR 700)",
    },
    {
      id: "package-04",
      numberLabel: "الباقة 04",
      name: "الباقة الملكية",
      tier: "الباقة الملكية",
      badge: "MOST POPULAR",
      image: "/images/ozpark/wedding-elegant-red-and-white-celebration-table.jpg",
      description:
        "لأنكما تستحقان الأفضل دائماً، عيشوا تجربة احتفال ملكي لا يُنسى يفوق كل التوقعات.",
      includedTitle: "ما تشمله الباقة:",
      included: [
        "تجهيز وتزيين ملكي فاخر ومميز للغرفة بالورود والبالونات.",
        "كيكة احتفال ملكية كبيرة وفاخرة.",
        "عصائر طبيعية طازجة وتشكيلة فاخرة من المكسرات.",
        "عشاء مأكولات بحرية فاخر.",
        "أربعة أصناف من السلطات العالمية المميزة تُقدم مع العشاء.",
      ],
      priceLabel: "سعر الباقة",
      price: "SAR 1,000",
      priceNote: "شامل ضريبة القيمة المضافة. رسوم إقامة الغرفة تُحتسب بشكل منفصل.",
      cta: "استفسر عبر واتساب",
      whatsappSubject: "الباقة 04 — الباقة الملكية (الباقة الملكية - SAR 1,000)",
    },
  ],
};

const weddingGalleryData: Record<Language, WeddingGalleryItem[]> = {
  en: [
    {
      src: "/images/ozpark/wedding-img-0330.jpg",
      title: "Full Wedding-Room Photographs",
      caption: "Spacious wedding rooms styled with ceiling balloons, rose petals, and warm coastal ambiance.",
    },
    {
      src: "/images/ozpark/wedding-img-0328.jpg",
      title: "Romantic Bed Arrangements",
      caption: "Signature swan towel sculptures and rose-petal heart arrangements crafted on plush king beds.",
    },
    {
      src: "/images/ozpark/wedding-img-0238.jpg",
      title: "Rose and Balloon Decorations",
      caption: "Natural red roses and floating helium balloons bringing joy and romance to every corner.",
    },
    {
      src: "/images/ozpark/wedding-img-0324.jpg",
      title: "Custom Celebration Setups",
      caption: "Private lounge tables dressed with celebration cakes, florals, and rose-petal borders.",
    },
    {
      src: "/images/ozpark/wedding-elegant-red-and-white-celebration-table.jpg",
      title: "Premium Royal Decorations",
      caption: "Elaborate red-and-white satin table settings, crystal glassware, and candlelight.",
    },
    {
      src: "/images/ozpark/wedding-romantic-hotel-room-with-red-accents.jpg",
      title: "Royal Suite Celebration",
      caption: "Candle-lit rose pathways, floating ceiling balloons, and bespoke romantic suite styling.",
    },
    {
      src: "/images/ozpark/wedding-img-0243.jpg",
      title: "The Couple's Initials",
      caption: "Personalized rose-petal initials and heartfelt floral touches arranged across the bed.",
    },
    {
      src: "/images/ozpark/wedding-img-0240.jpg",
      title: "Warm Bedside Ambiance",
      caption: "Soft bedside lighting paired with natural rose petals and celebratory balloons.",
    },
    {
      src: "/images/ozpark/wedding-img-0237.jpg",
      title: "Elegant Wedding Room View",
      caption: "Complete room preparation designed to make your first moments together unforgettable.",
    },
    {
      src: "/images/ozpark/wedding-img-0236.jpg",
      title: "Private In-Room Dining Table",
      caption: "Intimate dining table dressed in red and white for your private celebratory dinner.",
    },
    {
      src: "/images/ozpark/wedding-img-0327.jpg",
      title: "Romantic Lounge Seating",
      caption: "Plush armchairs accented with fresh red rose petals for relaxing moments together.",
    },
    {
      src: "/images/ozpark/wedding-img-0242.jpg",
      title: "Romantic Lighting and Room Details",
      caption: "Thoughtful rose-petal details and warm lighting across every surface of your room.",
    },
  ],
  ar: [
    {
      src: "/images/ozpark/wedding-img-0330.jpg",
      title: "صور كاملة لغرف الزفاف",
      caption: "غرف زفاف فسيحة مزينة ببالونات السقف وبتلات الورد وأجواء ساحلية دافئة.",
    },
    {
      src: "/images/ozpark/wedding-img-0328.jpg",
      title: "تنسيقات السرير الرومانسية",
      caption: "تشكيلات البجع وقلوب الورد الطبيعي المصممة بعناية على السرير الفاخر.",
    },
    {
      src: "/images/ozpark/wedding-img-0238.jpg",
      title: "تزيين الورود والبالونات",
      caption: "ورود طبيعية حمراء وبالونات هيليوم تضفي البهجة والرومانسية على كل زاوية.",
    },
    {
      src: "/images/ozpark/wedding-img-0324.jpg",
      title: "تجهيزات الاحتفال الخاصة",
      caption: "طاولة ضيافة مزينة بكيكة الاحتفال والزهور وإطار من بتلات الورد.",
    },
    {
      src: "/images/ozpark/wedding-elegant-red-and-white-celebration-table.jpg",
      title: "التجهيزات الملكية الفاخرة",
      caption: "تنسيق طاولة ملكي باللونين الأحمر والأبيض مع الشموع والزهور الفاخرة.",
    },
    {
      src: "/images/ozpark/wedding-romantic-hotel-room-with-red-accents.jpg",
      title: "إطلالة الجناح الملكي",
      caption: "ممرات مضاءة بالشموع وبتلات الورد مع بالونات السقف وتنسيقات الجناح المتكاملة.",
    },
    {
      src: "/images/ozpark/wedding-img-0243.jpg",
      title: "أحرف العروسين بالورد الطبيعي",
      caption: "تنسيق خاص لأحرف العروسين ببتلات الورد الطبيعي على السرير.",
    },
    {
      src: "/images/ozpark/wedding-img-0240.jpg",
      title: "أجواء رومانسية دافئة",
      caption: "إضاءة جانبية ناعمة مع بتلات الورد الطبيعي وبالونات الاحتفال.",
    },
    {
      src: "/images/ozpark/wedding-img-0237.jpg",
      title: "تجهيز متكامل للغرفة",
      caption: "تحضير شامل لكل تفاصيل الغرفة لتجعل لحظاتكما الأولى لا تُنسى.",
    },
    {
      src: "/images/ozpark/wedding-img-0236.jpg",
      title: "طاولة العشاء الرومانسي",
      caption: "طاولة طعام خاصة داخل الجناح مجهزة للعشاء الرومانسي الفاخر.",
    },
    {
      src: "/images/ozpark/wedding-img-0327.jpg",
      title: "جلسة استرخاء مزينة بالورد",
      caption: "مقاعد جلوس مريحة مزينة ببتلات الورد الأحمر للحظات هادئة معاً.",
    },
    {
      src: "/images/ozpark/wedding-img-0242.jpg",
      title: "الإضاءة الرومانسية وتفاصيل الغرفة",
      caption: "لمسات مدروسة من بتلات الورد والإضاءة الدافئة في كافة أرجاء الغرفة.",
    },
  ],
};

const offersData: Record<Language, OfferModalData[]> = {
  en: [
    {
      id: "wedding-honeymoon",
      category: "ROMANTIC STAYS",
      title: "Celebrate Your Love by the Sea",
      copy: "Make your special moments unforgettable with romantic room arrangements, thoughtful touches, and beautiful Red Sea views.",
      cta: "EXPLORE OFFER",
      image: offerImages[0],
      gallery: [
        "/images/ozpark/category-suites.png",
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/room-deluxe-suite-1.jpg",
      ],
      subtitle: "OFFER 1 — WEDDING & HONEYMOON PACKAGES",
      details: [
        "Celebrate your wedding night, honeymoon, or anniversary at OZ Park Hotel with bespoke romantic suite setups overlooking the tranquil waters of the Red Sea in Al Qunfudhah.",
        "Enjoy curated floral and swan towel arrangements, welcome hospitality treats, and serene private living spaces crafted for unforgettable moments together.",
      ],
      highlightsTitle: "Package Inclusions",
      highlights: [
        "Romantic bed & suite decoration upon arrival",
        "Welcome fruit basket, celebratory cake, and specialty beverages",
        "Priority sea-view room or suite allocation",
        "Complimentary late check-out (subject to availability)",
        "10% guest privilege at Diwan Mada Restaurant & OZ Park Café",
      ],
      conditionsTitle: "Offer Conditions",
      conditions: [
        "Advance reservation required at least 48 hours prior to arrival.",
        "Valid for Deluxe King Rooms, Studios, and Suites.",
        "Subject to availability at the time of booking.",
      ],
    },
    {
      id: "up-to-25-off",
      category: "EXCLUSIVE ROOM OFFERS",
      title: "Enjoy Up to 25% Off",
      copy: "Experience exceptional comfort at an even better value. Enjoy exclusive savings of up to 25% on selected ground-floor rooms.",
      cta: "EXPLORE OFFER",
      image: offerImages[1],
      gallery: [
        "/images/ozpark/category-refined-rooms.png",
        "/images/ozpark/stay-rooms.jpg",
        "/images/ozpark/room-superior-king-1.jpg",
      ],
      subtitle: "OFFER 2 — UP TO 25% OFF",
      details: [
        "Experience signature OZ Park Hotel comfort at an exceptional value with up to 25% savings on selected ground-floor accommodations.",
        "Ideal for travellers seeking effortless access, contemporary interiors, high-speed Wi-Fi, and premium hotel amenities in the heart of Al Qunfudhah.",
      ],
      highlightsTitle: "Offer Benefits",
      highlights: [
        "Up to 25% off best available rate on selected ground-floor rooms",
        "Full access to hotel guest services and 24-hour reception",
        "Complimentary high-speed Wi-Fi and in-room refreshment station",
        "Free on-site guest parking",
      ],
      conditionsTitle: "Offer Conditions",
      conditions: [
        "Applicable to selected ground-floor rooms only.",
        "Cannot be combined with other promotional discounts.",
        "Subject to room availability at the time of reservation.",
      ],
    },
    {
      id: "long-stay-offer",
      category: "EXTENDED STAYS",
      title: "Stay Longer, Save Up to 35%",
      copy: "A little more time by the sea makes all the difference. Enjoy special rates and save up to 35% on extended stays at OZ Park Hotel.",
      cta: "EXPLORE OFFER",
      image: offerImages[2],
      gallery: [
        "/images/ozpark/category-studio.png",
        "/images/ozpark/stay-studios.jpg",
        "/images/ozpark/stay-studios-2.jpg",
      ],
      subtitle: "OFFER 3 — LONG STAY OFFER",
      details: [
        "Whether you are visiting Al Qunfudhah for an extended coastal holiday or a business assignment, enjoy greater comfort and up to 35% savings when you stay longer at OZ Park Hotel.",
        "Our spacious rooms, studios with dining areas, and multi-room suites provide everything you need to feel right at home by the Red Sea.",
      ],
      highlightsTitle: "Extended Stay Perks",
      highlights: [
        "Save up to 35% on multi-night and extended bookings",
        "Choice of Rooms, Studios with kitchenette/dining area, or Suites",
        "Regular housekeeping and 24/7 front desk support",
        "10% guest privilege at Diwan Mada Restaurant and OZ Park Café",
      ],
      conditionsTitle: "Offer Conditions",
      conditions: [
        "Minimum length of stay applies to qualify for the maximum 35% discount tier.",
        "Valid across Direct Booking and Reservations Desk inquiries.",
        "Blackout dates may apply during peak public holidays.",
      ],
    },
    {
      id: "dining-cafe-offer",
      category: "EXCLUSIVE GUEST BENEFITS",
      title: "A Little Extra, Just for You",
      copy: "Your stay comes with more to enjoy. Receive 10% off at Diwan Mada Restaurant and OZ Park Café as our valued hotel guest.",
      cta: "EXPLORE OFFER",
      image: offerImages[3],
      gallery: [
        "/images/ozpark/culinary-portrait.png",
        "/images/ozpark/slider-restaurant.jpg",
        "/images/ozpark/slider-cafe.jpg",
      ],
      subtitle: "OFFER 4 — DINING & CAFÉ",
      details: [
        "Every stay at OZ Park Hotel comes with exclusive culinary privileges. Enjoy 10% off throughout your stay at both Diwan Mada Restaurant and OZ Park Café.",
        "Savor freshly prepared regional and international dishes with panoramic Red Sea views, or unwind with specialty coffee and artisanal desserts.",
      ],
      highlightsTitle: "Culinary Privileges",
      highlights: [
        "10% discount for all registered in-house hotel guests",
        "Valid at Diwan Mada Restaurant (panoramic sea-view dining)",
        "Valid at OZ Park Café (specialty coffee, tea & desserts)",
        "Applicable to dine-in experiences throughout your stay",
      ],
      conditionsTitle: "Offer Conditions",
      conditions: [
        "Available exclusively to registered guests staying at OZ Park Hotel.",
        "Simply mention your room number when ordering at Diwan Mada Restaurant or OZ Park Café.",
      ],
    },
  ],
  ar: [
    {
      id: "wedding-honeymoon",
      category: "إقامات رومانسية",
      title: "احتفل بحبكما على ضفاف البحر",
      copy: "اجعل لحظاتكما الخاصة لا تُنسى مع تجهيزات الغرف الرومانسية واللمسات المدروسة والإطلالات الساحرة على البحر الأحمر.",
      cta: "استكشف العرض",
      image: offerImages[0],
      gallery: [
        "/images/ozpark/category-suites.png",
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/room-deluxe-suite-1.jpg",
      ],
      subtitle: "العرض الأول — باقات الزفاف وشهر العسل",
      details: [
        "احتفل بليلة الزفاف أو شهر العسل أو ذكرى الزواج في فندق أوز بارك مع تجهيزات رومانسية خاصة في الأجنحة والغرف المطلة على مياه البحر الأحمر الهادئة في القنفذة.",
        "استمتع بترتيبات الزهور والضيافة الترحيبية والمساحات الهادئة المصممة لصناعة ذكريات لا تُنسى.",
      ],
      highlightsTitle: "مزايا الباقة",
      highlights: [
        "تجهيز وتنسيق رومانسي للغرفة أو الجناح عند الوصول",
        "سلة فواكه ترحيبية وكيك احتفالي ومشروبات مختارة",
        "أولوية تخصيص الغرف والأجنحة ذات الإطلالة البحرية",
        "تسجيل مغادرة متأخر مجاني (حسب التوفر)",
        "خصم 10% في مطعم ديوان مدى ومقهى أوز بارك",
      ],
      conditionsTitle: "شروط العرض",
      conditions: [
        "يلزم الحجز المسبق قبل 48 ساعة على الأقل من موعد الوصول.",
        "يسري العرض على غرف الديلوكس والاستوديوهات والأجنحة.",
        "يخضع لتوفر الغرف عند تأكيد الحجز.",
      ],
    },
    {
      id: "up-to-25-off",
      category: "عروض الغرف الحصرية",
      title: "استمتع بخصم يصل إلى 25%",
      copy: "عيشوا تجربة راحة استثنائية بقيمة أفضل، واستمتعوا بخصم حصري يصل إلى 25% على غرف مختارة في الدور الأرضي.",
      cta: "استكشف العرض",
      image: offerImages[1],
      gallery: [
        "/images/ozpark/category-refined-rooms.png",
        "/images/ozpark/stay-rooms.jpg",
        "/images/ozpark/room-superior-king-1.jpg",
      ],
      subtitle: "العرض الثاني — خصم يصل إلى 25%",
      details: [
        "اختبر الراحة الفندقية الراقية في فندق أوز بارك بقيمة استثنائية مع توفير يصل إلى 25% على غرف مختارة في الدور الأرضي.",
        "خيار مثالي للمسافرين الباحثين عن سهولة الوصول والتصميم العصري وخدمات الضيافة المتكاملة في قلب القنفذة.",
      ],
      highlightsTitle: "مزايا العرض",
      highlights: [
        "خصم يصل إلى 25% على غرف مختارة في الدور الأرضي",
        "استفادة كاملة من خدمات الفندق ومكتب الاستقبال على مدار الساعة",
        "إنترنت عالي السرعة مجاني وركن ضيافة داخل الغرفة",
        "مواقف سيارات مجانية لضيوف الفندق",
      ],
      conditionsTitle: "شروط العرض",
      conditions: [
        "يسري العرض على غرف مختارة في الدور الأرضي فقط.",
        "لا يمكن دمج العرض مع خصومات ترويجية أخرى.",
        "يخضع لتوفر الغرف وقت الحجز.",
      ],
    },
    {
      id: "long-stay-offer",
      category: "الإقامات الطويلة",
      title: "أقِم لفترة أطول ووفّر حتى 35%",
      copy: "مزيد من الوقت قرب البحر يصنع كل الفرق. استمتع بأسعار خاصة ووفّر حتى 35% على الإقامات الطويلة في فندق أوز بارك.",
      cta: "استكشف العرض",
      image: offerImages[2],
      gallery: [
        "/images/ozpark/category-studio.png",
        "/images/ozpark/stay-studios.jpg",
        "/images/ozpark/stay-studios-2.jpg",
      ],
      subtitle: "العرض الثالث — عرض الإقامة الطويلة",
      details: [
        "سواء كنت تزور القنفذة لقضاء عطلة ساحلية ممتدة أو رحلة عمل طويلة، استمتع بمزيد من الراحة وخصم يصل إلى 35% عند الإقامة لفترة أطول في فندق أوز بارك.",
        "توفّر غرفنا واستوديوهاتنا المجهزة والأجنحة الفسيحة كل ما تحتاجه لتشعر وكأنك في منزلك على ساحل البحر الأحمر.",
      ],
      highlightsTitle: "مزايا الإقامة الطويلة",
      highlights: [
        "خصم يصل إلى 35% على الحجوزات متعددة الليالي والإقامات الممتدة",
        "خيارات متنوعة تشمل الغرف والاستوديوهات والأجنحة",
        "خدمة تدبير فندقي منتظمة واستقبال على مدار الساعة",
        "خصم 10% لضيوف الفندق في مطعم ديوان مدى ومقهى أوز بارك",
      ],
      conditionsTitle: "شروط العرض",
      conditions: [
        "يُطبّق الحد الأدنى لعدد الليالي للاستفادة من أعلى شريحة خصم (35%).",
        "يسري العرض للحجوزات المباشرة وعبر مكتب الحجوزات.",
        "قد تُطبّق استثناءات خلال فترات الأعياد والمواسم الرسمية.",
      ],
    },
    {
      id: "dining-cafe-offer",
      category: "مزايا حصرية للضيوف",
      title: "ميزة إضافية، خصيصاً لك",
      copy: "إقامتك تحمل لك المزيد من المتعة. احصل على خصم 10% في مطعم ديوان مدى ومقهى أوز بارك كضيف عزيز في الفندق.",
      cta: "استكشف العرض",
      image: offerImages[3],
      gallery: [
        "/images/ozpark/culinary-portrait.png",
        "/images/ozpark/slider-restaurant.jpg",
        "/images/ozpark/slider-cafe.jpg",
      ],
      subtitle: "العرض الرابع — المطعم والمقهى",
      details: [
        "تمنحك إقامتك في فندق أوز بارك مزايا ضيافة حصرية، حيث يحصل جميع نزلاء الفندق على خصم 10% طوال فترة إقامتهم في كلٍّ من مطعم ديوان مدى ومقهى أوز بارك.",
        "تذوّق أشهى الأطباق المحلية والعالمية مع إطلالة بانورامية على البحر الأحمر، أو استمتع بقهوتك المختصة والحلويات الفاخرة.",
      ],
      highlightsTitle: "مزايا الضيافة",
      highlights: [
        "خصم 10% حصري لجميع نزلاء الفندق المقيمين",
        "يسري في مطعم ديوان مدى ذي الإطلالة البحرية البانورامية",
        "يسري في مقهى أوز بارك للقهوة المختصة والحلويات",
        "متاح طوال فترة الإقامة عند إبراز رقم الغرفة",
      ],
      conditionsTitle: "شروط العرض",
      conditions: [
        "متاح حصرياً للضيوف المقيمين في فندق أوز بارك.",
        "يرجى ذكر رقم الغرفة عند الطلب في المطعم أو المقهى.",
      ],
    },
  ],
};

const experienceSlidesData: Record<Language, ExperienceSlideData[]> = {
  en: [
    {
      id: "oz-park-hotel",
      category: "STAY",
      title: "A Coastal Escape Like No Other",
      copy: "Discover elevated comfort, modern elegance, and breathtaking Red Sea views at OZ Park Hotel, where every stay feels special.",
      ctaLabel: "EXPLORE THE HOTEL",
      image: signatureImages[0],
      gallery: [
        "/images/ozpark/slider-hotel.jpg",
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/stay-rooms.jpg",
      ],
      modalSubtitle: "OZ PARK HOTEL — AL QUNFUDHAH",
      modalDetails: [
        "Positioned along the South Corniche in Al Qunfudhah, OZ Park Hotel blends refined coastal architecture, serene Red Sea views, and warm Saudi hospitality.",
        "From elegantly appointed rooms and flexible studios to expansive sea-view suites, every detail is thoughtfully designed to make your stay effortless and memorable.",
      ],
      modalHighlights: [
        "Prime waterfront location overlooking the Red Sea in Al Qunfudhah",
        "44 luxury rooms, studios, and multi-room suites",
        "Diwan Mada Restaurant & OZ Park Café on site",
        "24-hour reception, concierge, and complimentary guest parking",
      ],
    },
    {
      id: "diwan-mada-restaurant",
      category: "DINE",
      title: "Dining Beyond the Horizon",
      copy: "Indulge in exceptional flavors, elegant surroundings, and panoramic sea views at Diwan Mada Restaurant.",
      ctaLabel: "EXPLORE DINING",
      image: signatureImages[1],
      gallery: [
        "/images/ozpark/slider-restaurant.jpg",
        "/images/ozpark/culinary-portrait.png",
        "/images/ozpark/facility-restaurant.png",
      ],
      modalSubtitle: "DIWAN MADA RESTAURANT",
      modalDetails: [
        "Diwan Mada Restaurant offers an elevated culinary experience framed by floor-to-ceiling panoramic windows overlooking the Red Sea coastline and waterfront park.",
        "Enjoy freshly prepared breakfast spreads, authentic Saudi specialties, and international favorites in a warm, sophisticated dining room.",
      ],
      modalHighlights: [
        "Panoramic floor-to-ceiling Red Sea & waterfront views",
        "Curated breakfast, lunch, and dinner menus",
        "10% exclusive dining privilege for registered hotel guests",
        "Welcoming setting for families, couples, and business dining",
      ],
    },
    {
      id: "oz-park-cafe",
      category: "RELAX",
      title: "Your Perfect Coffee Moment",
      copy: "Slow down, sip your favorite coffee, and enjoy a relaxing atmosphere overlooking the beautiful Red Sea.",
      ctaLabel: "DISCOVER THE CAFÉ",
      image: signatureImages[2],
      gallery: [
        "/images/ozpark/slider-cafe.jpg",
        "/images/ozpark/facility-barista.jpg",
        "/images/ozpark/facility-cafe.png",
      ],
      modalSubtitle: "OZ PARK CAFÉ",
      modalDetails: [
        "OZ Park Café is your coastal lounge for specialty barista-crafted coffee, artisanal teas, fresh pastries, and signature desserts.",
        "Whether catching up on work, meeting friends, or unwinding as the sun sets over the Red Sea, the café offers a calm, light-filled retreat.",
      ],
      modalHighlights: [
        "Specialty espresso, pour-over coffee, and signature cold drinks",
        "Freshly baked pastries and handcrafted desserts",
        "Plush lounge seating with sea and corniche views",
        "10% exclusive privilege for in-house hotel guests",
      ],
    },
    {
      id: "meeting-room",
      category: "MEET",
      title: "Where Ideas Come Together",
      copy: "From important business discussions to productive team meetings, discover a comfortable and professional space designed for meaningful connections.",
      ctaLabel: "EXPLORE MEETING SPACES",
      image: signatureImages[3],
      gallery: [
        "/images/ozpark/slider-meeting.jpg",
        "/images/ozpark/facility-meetings.png",
      ],
      modalSubtitle: "MEETING & CONFERENCE SPACE",
      modalDetails: [
        "Host executive board meetings, corporate workshops, and private presentations in OZ Park Hotel’s dedicated meeting room.",
        "Equipped with projection and presentation technology, high-speed Wi-Fi, executive boardroom seating, and tailored coffee break catering from OZ Park Café and Diwan Mada Restaurant.",
      ],
      modalHighlights: [
        "Executive boardroom layout with modern audiovisual projector",
        "High-speed Wi-Fi and dedicated power/connectivity points",
        "Custom coffee breaks and business lunch catering available",
        "Dedicated on-site coordination team",
      ],
    },
    {
      id: "gym-indoor-pool",
      category: "COMING SOON",
      title: "A New Way to Recharge",
      copy: "Something refreshing is on the horizon. Get ready for a new wellness experience with our upcoming fitness facilities and indoor swimming pool.",
      ctaLabel: "COMING SOON",
      comingSoon: true,
      image: signatureImages[4],
    },
  ],
  ar: [
    {
      id: "oz-park-hotel",
      category: "الإقامة",
      title: "ملاذ ساحلي لا مثيل له",
      copy: "اكتشف الراحة الراقية والأناقة العصرية والإطلالات الخلابة على البحر الأحمر في فندق أوز بارك، حيث تبدو كل إقامة مميزة.",
      ctaLabel: "استكشف الفندق",
      image: signatureImages[0],
      gallery: [
        "/images/ozpark/slider-hotel.jpg",
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/stay-rooms.jpg",
      ],
      modalSubtitle: "فندق أوز بارك — القنفذة",
      modalDetails: [
        "يقع فندق أوز بارك على الكورنيش الجنوبي في القنفذة، ويجمع بين التصميم الساحلي الأنيق والإطلالات الهادئة على البحر الأحمر وكرم الضيافة السعودية.",
        "من الغرف الأنيقة والاستوديوهات المرنة إلى الأجنحة الفسيحة المطلة على البحر، صُممت كل زاوية لتجعل إقامتك مريحة ولا تُنسى.",
      ],
      modalHighlights: [
        "موقع مباشر على الواجهة البحرية والكورنيش الجنوبي في القنفذة",
        "44 وحدة فندقية فاخرة من الغرف والاستوديوهات والأجنحة",
        "مطعم ديوان مدى ومقهى أوز بارك داخل الفندق",
        "استقبال وخدمة ضيوف على مدار الساعة ومواقف مجانية",
      ],
    },
    {
      id: "diwan-mada-restaurant",
      category: "المطعم",
      title: "تجربة طعام تتجاوز الأفق",
      copy: "استمتع بنكهات استثنائية وأجواء أنيقة وإطلالات بحرية بانورامية في مطعم ديوان مدى.",
      ctaLabel: "استكشف المطعم",
      image: signatureImages[1],
      gallery: [
        "/images/ozpark/slider-restaurant.jpg",
        "/images/ozpark/culinary-portrait.png",
        "/images/ozpark/facility-restaurant.png",
      ],
      modalSubtitle: "مطعم ديوان مدى",
      modalDetails: [
        "يقدّم مطعم ديوان مدى تجربة طعام راقية تحيط بها نوافذ بانورامية ممتدة تطل على ساحل البحر الأحمر والحديقة البحرية.",
        "استمتع بوجبات الإفطار الطازجة والأطباق السعودية الأصيلة والخيارات العالمية في أجواء هادئة ومميزة.",
      ],
      modalHighlights: [
        "إطلالات بانورامية مباشرة على البحر الأحمر والواجهة البحرية",
        "قوائم مختارة للإفطار والغداء والعشاء",
        "خصم 10% حصري لنزلاء الفندق المقيمين",
        "أجواء مثالية للعائلات والأفراد ولقاءات الأعمال",
      ],
    },
    {
      id: "oz-park-cafe",
      category: "استرخاء",
      title: "لحظة القهوة المثالية",
      copy: "تمهّل واستمتع بقهوتك المفضلة في أجواء هادئة ومريحة تطل على جمال البحر الأحمر.",
      ctaLabel: "اكتشف المقهى",
      image: signatureImages[2],
      gallery: [
        "/images/ozpark/slider-cafe.jpg",
        "/images/ozpark/facility-barista.jpg",
        "/images/ozpark/facility-cafe.png",
      ],
      modalSubtitle: "مقهى أوز بارك",
      modalDetails: [
        "يُعد مقهى أوز بارك مساحتك الساحلية الهادئة للاستمتاع بالقهوة المختصة والشاي الفاخر والمخبوزات والحلويات الطازجة.",
        "سواء كنت تنجز أعمالك أو تلتقي بالأصدقاء أو تستجم عند الغروب، يوفّر المقهى جلسات مريحة بإطلالة بحرية جميلة.",
      ],
      modalHighlights: [
        "قهوة مختصة ومشروبات ساخنة وباردة يحضّرها الباريستا",
        "تشكيلة من الحلويات والمخبوزات الطازجة",
        "جلسات راقية ومريحة بإطلالة على الكورنيش والبحر",
        "خصم 10% حصري لنزلاء الفندق",
      ],
    },
    {
      id: "meeting-room",
      category: "الاجتماعات",
      title: "حيث تلتقي الأفكار",
      copy: "من نقاشات الأعمال المهمة إلى اجتماعات الفرق المثمرة، اكتشف مساحة مريحة واحترافية مصممة للتواصل الفعّال.",
      ctaLabel: "استكشف قاعة الاجتماعات",
      image: signatureImages[3],
      gallery: [
        "/images/ozpark/slider-meeting.jpg",
        "/images/ozpark/facility-meetings.png",
      ],
      modalSubtitle: "قاعة الاجتماعات والأعمال",
      modalDetails: [
        "استضف اجتماعات مجلس الإدارة وورش العمل والعروض التقديمية في قاعة الاجتماعات المجهزة في فندق أوز بارك.",
        "تضم القاعة أحدث تجهيزات العرض المرئي وإنترنت عالي السرعة وطاولة اجتماعات تنفيذية مع إمكانية تنسيق ضيافة القهوة ووجبات الأعمال.",
      ],
      modalHighlights: [
        "طاولة اجتماعات تنفيذية مع جهاز عرض (بروجكتر) حديث",
        "إنترنت لاسلكي عالي السرعة وتجهيزات تقنية متكاملة",
        "خدمات ضيافة واستراحات قهوة من مقهى أوز بارك ومطعم ديوان مدى",
        "فريق تنسيق مخصص لخدمة الفعاليات والاجتماعات",
      ],
    },
    {
      id: "gym-indoor-pool",
      category: "قريباً",
      title: "طريقة جديدة لتجديد النشاط",
      copy: "تجربة منعشة تلوح في الأفق. استعد لتجربة عافية ولياقة جديدة مع مرافق النادي الرياضي والمسبح الداخلي القادمة قريباً.",
      ctaLabel: "قريباً",
      comingSoon: true,
      image: signatureImages[4],
    },
  ],
};

const accommodationCategoriesData: Record<Language, AccommodationCategoryData[]> = {
  en: [
    {
      id: "rooms",
      category: "REFINED COMFORT",
      title: "Rooms",
      description:
        "Relax in elegantly designed rooms featuring contemporary interiors, thoughtful amenities, and calming sea views. The perfect space to unwind after a day by the coast.",
      cta: "EXPLORE & Book",
      image: "/images/ozpark/stay-rooms.jpg",
      gallery: [
        "/images/ozpark/stay-rooms.jpg",
        "/images/ozpark/room-deluxe-king-1.png",
        "/images/ozpark/room-superior-king-1.jpg",
        "/images/ozpark/room-deluxe-king-2.jpg",
      ],
      subtitle: "STAY AT OZ PARK — ROOMS",
      overview:
        "Our Superior King and Deluxe King Rooms combine contemporary coastal styling with plush bedding, dedicated workspaces, and calming Red Sea or city views.",
      amenities: [
        "King-size bed with premium linens",
        "Sea-view or city-view picture windows",
        "Air conditioning & soundproofed interiors",
        "High-speed Wi-Fi & flat-screen Smart TV",
        "Mini-fridge, kettle & coffee/tea station",
        "In-room safe, wardrobe & work desk",
        "Private bathroom with walk-in shower & toiletries",
      ],
      subRooms: [
        {
          name: "Deluxe King Room",
          size: "35 m²",
          occupancy: "2 Adults, 1 Child",
          bed: "1 King Bed",
          view: "Red Sea View",
          image: "/images/ozpark/stay-rooms.jpg",
          description: "Spacious sea-facing room with king bed, armchairs by the panoramic window, and executive work desk.",
        },
        {
          name: "Superior King Room",
          size: "33 m²",
          occupancy: "2 Adults",
          bed: "1 King Bed",
          view: "City View",
          image: "/images/ozpark/room-superior-king-1.jpg",
          description: "Quiet, refined room with warm lighting, plush king bedding, and modern amenities.",
        },
      ],
    },
    {
      id: "studios",
      category: "SPACE & FLEXIBILITY",
      title: "Studios",
      description:
        "Enjoy the perfect balance of comfort and convenience. Our spacious studios offer thoughtfully designed interiors and added flexibility for a stay that feels like home.",
      cta: "EXPLORE & Book",
      image: "/images/ozpark/stay-studios.jpg",
      gallery: [
        "/images/ozpark/stay-studios.jpg",
        "/images/ozpark/stay-studios-2.jpg",
        "/images/ozpark/room-superior-studio-1.jpg",
        "/images/ozpark/room-superior-studio-2.png",
      ],
      subtitle: "STAY AT OZ PARK — STUDIOS",
      overview:
        "Designed for guests who value extra space and home-like convenience, our Studios feature a generous sleeping and lounge area alongside a dedicated dining table and kitchenette counter.",
      amenities: [
        "Open-plan sleeping & lounge seating area",
        "Dedicated kitchenette counter with sink & dining table",
        "King-size bed & upholstered armchairs",
        "High-speed Wi-Fi & flat-screen Smart TV",
        "Mini-fridge, electric kettle & refreshment station",
        "Spacious wardrobe, safe & work desk",
        "Modern en-suite bathroom with premium toiletries",
      ],
      subRooms: [
        {
          name: "Superior Studio",
          size: "42 m²",
          occupancy: "2 Adults, 1 Child",
          bed: "1 King Bed",
          view: "Coastal / City View",
          image: "/images/ozpark/stay-studios.jpg",
          description: "Generous 42 m² studio layout featuring a comfortable bedroom lounge and an adjoining dining & kitchenette space.",
        },
      ],
    },
    {
      id: "suites",
      category: "ELEVATED LIVING",
      title: "Suites",
      description:
        "Experience a new level of comfort with generous living spaces, elegant interiors, and beautiful coastal views. Designed for guests who appreciate extra room to relax.",
      cta: "EXPLORE & Book",
      image: "/images/ozpark/stay-suites.jpg",
      gallery: [
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/room-deluxe-suite-1.jpg",
        "/images/ozpark/room-superior-suite-1.jpg",
        "/images/ozpark/room-twin-junior-suite-1.png",
      ],
      subtitle: "STAY AT OZ PARK — SUITES",
      overview:
        "Our Suites deliver elevated coastal living with separate living rooms, dining areas, private sea-view balconies, and multi-bedroom configurations tailored for families and VIP guests.",
      amenities: [
        "Separate living room with plush sofa seating & dining area",
        "Private balcony or panoramic windows overlooking the Red Sea",
        "1-bedroom and 2-bedroom suite options for up to 5 guests",
        "High-speed Wi-Fi, multiple Smart TVs & soundproofing",
        "Kitchenette / minibar, coffee & tea hospitality station",
        "En-suite bathrooms with premium bath amenities",
      ],
      subRooms: [
        {
          name: "Deluxe Suite",
          size: "90 m²",
          occupancy: "4 Adults, 2 Children",
          bed: "1 King Bed + 2 Twin Beds",
          view: "Panoramic Red Sea View & Balcony",
          image: "/images/ozpark/stay-suites.jpg",
          description: "Flagship 90 m² two-bedroom suite with an expansive sea-view salon, dining table, and private balcony.",
        },
        {
          name: "Superior Suite",
          size: "85 m²",
          occupancy: "4 Adults, 1 Child",
          bed: "1 King Bed + 2 Twin Beds",
          view: "Sea & Park View",
          image: "/images/ozpark/room-superior-suite-1.jpg",
          description: "Refined 85 m² family suite featuring two bedrooms and a separate living room.",
        },
        {
          name: "Twin Junior Suite",
          size: "50 m²",
          occupancy: "2 Adults, 1 Child",
          bed: "2 Twin Beds",
          view: "Sea View",
          image: "/images/ozpark/room-twin-junior-suite-1.png",
          description: "Elegant 50 m² junior suite with twin beds, lounge seating, and coastal views.",
        },
      ],
    },
  ],
  ar: [
    {
      id: "rooms",
      category: "راحة راقية",
      title: "الغرف",
      description:
        "استرخِ في غرف مصممة بأناقة تتميز بديكورات عصرية ووسائل راحة مدروسة وإطلالات بحرية هادئة. المساحة المثالية للاستجمام بعد يوم على الساحل.",
      cta: "استكشف واحجز",
      image: "/images/ozpark/stay-rooms.jpg",
      gallery: [
        "/images/ozpark/stay-rooms.jpg",
        "/images/ozpark/room-deluxe-king-1.png",
        "/images/ozpark/room-superior-king-1.jpg",
        "/images/ozpark/room-deluxe-king-2.jpg",
      ],
      subtitle: "الإقامة في أوز بارك — الغرف",
      overview:
        "تجمع غرف سوبيريور كينغ وديلوكس كينغ بين التصميم الساحلي العصري والمفروشات الفاخرة ومساحات العمل المريحة مع إطلالات هادئة على البحر الأحمر أو المدينة.",
      amenities: [
        "سرير كينغ فاخر بمفروشات عالية الجودة",
        "نوافذ واسعة بإطلالة بحرية أو على المدينة",
        "تكييف هواء وعزل صوتي كامل للغرف",
        "إنترنت لاسلكي عالي السرعة وشاشة تلفاز ذكية",
        "ثلاجة صغيرة وغلاية وركن للقهوة والشاي",
        "خزنة أمانات وخزانة ملابس ومكتب عمل",
        "حمّام خاص مزوّد بدُش ومستلزمات عناية فاخرة",
      ],
      subRooms: [
        {
          name: "غرفة ديلوكس كينغ",
          size: "35 م²",
          occupancy: "شخصان بالغان وطفل",
          bed: "سرير كينغ",
          view: "إطلالة على البحر الأحمر",
          image: "/images/ozpark/stay-rooms.jpg",
          description: "غرفة رحبة مطلة على البحر تضم سرير كينغ وجلسة مريحة أمام النافذة البانورامية ومكتب عمل.",
        },
        {
          name: "غرفة سوبيريور كينغ",
          size: "33 م²",
          occupancy: "شخصان بالغان",
          bed: "سرير كينغ",
          view: "إطلالة على المدينة",
          image: "/images/ozpark/room-superior-king-1.jpg",
          description: "غرفة هادئة وأنيقة بإضاءة دافئة وسرير كينغ مريح وكافة وسائل الراحة العصرية.",
        },
      ],
    },
    {
      id: "studios",
      category: "رحابة ومرونة",
      title: "الاستوديوهات",
      description:
        "استمتع بالتوازن المثالي بين الراحة والعملية. توفّر استوديوهاتنا الفسيحة تصاميم داخلية مدروسة ومرونة إضافية لإقامة تشبه دفء المنزل.",
      cta: "استكشف واحجز",
      image: "/images/ozpark/stay-studios.jpg",
      gallery: [
        "/images/ozpark/stay-studios.jpg",
        "/images/ozpark/stay-studios-2.jpg",
        "/images/ozpark/room-superior-studio-1.jpg",
        "/images/ozpark/room-superior-studio-2.png",
      ],
      subtitle: "الإقامة في أوز بارك — الاستوديوهات",
      overview:
        "صُممت الاستوديوهات للضيوف الباحثين عن مساحة إضافية ومرونة منزلية، حيث تضم منطقة نوم وجلوس فسيحة إلى جانب طاولة طعام وركن مطبخ تحضيري.",
      amenities: [
        "مساحة نوم وجلوس رحبة بتصميم مفتوح",
        "ركن مطبخ تحضيري مع حوض وطاولة طعام",
        "سرير كينغ مريح وكراسي جلوس وثيرة",
        "إنترنت عالي السرعة وشاشة تلفاز ذكية",
        "ثلاجة صغيرة وغلاية كهربائية وركن ضيافة",
        "خزانة ملابس واسعة وخزنة ومكتب عمل",
        "حمّام عصري خاص بمستلزمات استحمام متكاملة",
      ],
      subRooms: [
        {
          name: "استوديو سوبيريور",
          size: "42 م²",
          occupancy: "شخصان بالغان وطفل",
          bed: "سرير كينغ",
          view: "إطلالة ساحلية / المدينة",
          image: "/images/ozpark/stay-studios.jpg",
          description: "استوديو فسيح بمساحة 42 م² يضم غرفة نوم وجلوس مريحة مع مساحة مخصصة للطعام والمطبخ التحضيري.",
        },
      ],
    },
    {
      id: "suites",
      category: "فخامة الإقامة",
      title: "الأجنحة",
      description:
        "اختبر مستوى جديداً من الراحة مع مساحات المعيشة الفسيحة والتصاميم الأنيقة والإطلالات الساحلية الجميلة. مصممة للضيوف الذين يقدّرون المساحة الإضافية للاسترخاء.",
      cta: "استكشف واحجز",
      image: "/images/ozpark/stay-suites.jpg",
      gallery: [
        "/images/ozpark/stay-suites.jpg",
        "/images/ozpark/room-deluxe-suite-1.jpg",
        "/images/ozpark/room-superior-suite-1.jpg",
        "/images/ozpark/room-twin-junior-suite-1.png",
      ],
      subtitle: "الإقامة في أوز بارك — الأجنحة",
      overview:
        "تقدّم أجنحة فندق أوز بارك تجربة إقامة ساحلية استثنائية مع صالات معيشة منفصلة ومنطقة طعام وشرفات خاصة مطلة على البحر الأحمر وخيارات بغرفة أو غرفتي نوم للعائلات وكبار الضيوف.",
      amenities: [
        "صالة معيشة منفصلة بأرائك فاخرة وطاولة طعام",
        "شرفة خاصة أو نوافذ بانورامية مطلة على البحر الأحمر",
        "خيارات بغرفة نوم واحدة أو غرفتي نوم تتسع لغاية 5 ضيوف",
        "إنترنت لاسلكي عالي السرعة وشاشات تلفاز متعددة وعزل صوتي",
        "ركن مطبخ تحضيري وميني بار وضيافة قهوة وشاي",
        "حمّامات خاصة مجهزة بمستلزمات عناية فاخرة",
      ],
      subRooms: [
        {
          name: "جناح ديلوكس",
          size: "90 م²",
          occupancy: "4 بالغين وطفلان",
          bed: "سرير كينغ + سريران مفردان",
          view: "إطلالة بانورامية على البحر وشرفة",
          image: "/images/ozpark/stay-suites.jpg",
          description: "الجناح الرئيسي بمساحة 90 م² يضم غرفتي نوم وصالة معيشة واسعة مطلة على البحر مع طاولة طعام وشرفة خاصة.",
        },
        {
          name: "جناح سوبيريور",
          size: "85 م²",
          occupancy: "4 بالغين وطفل",
          bed: "سرير كينغ + سريران مفردان",
          view: "إطلالة على البحر والحديقة",
          image: "/images/ozpark/room-superior-suite-1.jpg",
          description: "جناح عائلي أنيق بمساحة 85 م² يضم غرفتي نوم وصالة جلوس منفصلة.",
        },
        {
          name: "جناح جونيور توأم",
          size: "50 م²",
          occupancy: "شخصان بالغان وطفل",
          bed: "سريران مفردان",
          view: "إطلالة بحرية",
          image: "/images/ozpark/room-twin-junior-suite-1.png",
          description: "جناح جونيور بمساحة 50 م² بسريرين مفردين ومنطقة جلوس مريحة وإطلالة ساحلية.",
        },
      ],
    },
  ],
};

const translations = {
  en: {
    languageButton: "العربية",
    switchLanguage: "Switch language to Arabic",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    bookYourStay: "BOOK YOUR STAY",
    backToHome: "Back to Home",
    nav: [
      ["Home", "top"],
      ["Happening Now", "offers"],
      ["Wedding Packages", "wedding-packages"],
      ["Discover OZ Park", "signature"],
      ["Rooms, Studios & Suites", "stay"],
      ["Contact Us", "contact"],
    ],
    tagline:
      "Experience coastal comfort, elegant stays, and warm hospitality at OZ Park Hotel, overlooking the Red Sea in Al Qunfudhah, Saudi Arabia.",
    addressText: "South Corniche, Al Qunfudhah, Saudi Arabia",

    // SECTION 1 — HERO / MAIN BANNER
    heroEyebrow: "OZ PARK HOTEL | AL QUNFUDHAH",
    heroTitle: "Where Comfort Meets the Sea",
    heroSubtitle:
      "Discover a coastal escape where elegant stays, warm hospitality, and the beauty of the Red Sea come together.",
    heroAlt: "OZ Park Hotel overlooking the Red Sea in Al Qunfudhah",
    soundOn: "Sound On",
    soundOff: "Sound Off",

    // SECTION 2 — HAPPENING NOW
    happeningEyebrow: "EXCLUSIVE OFFERS",
    happeningTitle: "Happening Now",
    happeningCopy:
      "Discover exclusive offers and memorable experiences at OZ Park Hotel. From romantic escapes to extended stays, there's always something special waiting for you.",
    previousOffer: "Previous offer",
    nextOffer: "Next offer",

    // SECTION 3 — DISCOVER OZ PARK / EXPERIENCE SLIDER
    discoverEyebrow: "DISCOVER OZ PARK",
    discoverTitle: "More Than Just a Stay",
    discoverCopy:
      "From relaxing seaside stays to memorable dining experiences, discover everything that makes OZ Park Hotel a destination of its own.",
    signatureLabel: "Discover OZ Park Experience Slider",
    scrollToExplore: "Scroll or click to explore",

    // SECTION 4 — STAY / ACCOMMODATION
    stayEyebrow: "STAY AT OZ PARK",
    stayTitle: "Rooms, Studios & Suites",
    stayCopy:
      "A stay designed around you. Discover thoughtfully crafted spaces, modern comforts, and beautiful Red Sea views, whether you're visiting for a night or staying a little longer.",

    // WEDDING & HONEYMOON PACKAGES PAGE (ATLANTIS CELEBRATION REFERENCE + OFFICIAL PDF)
    weddingHeroSmall: "WEDDING NIGHT PACKAGES",
    weddingHeroMain: "Celebrate Love by the Sea",

    weddingIntroSmall: "A CELEBRATION TO REMEMBER",
    weddingIntroMain: "Where Beautiful Beginnings Become Lasting Memories",
    weddingIntroDesc1:
      "Every love story deserves a beautiful beginning. At OZ Park Hotel, celebrate your special moments with romantic room arrangements, thoughtful touches, and the beauty of the Red Sea.",
    weddingIntroDesc2:
      "Choose from four wedding-night packages, each designed to make your first moments together truly memorable.",

    weddingPackagesSmall: "OUR WEDDING PACKAGES",
    weddingPackagesMain: "Four Ways to Celebrate Your Love",
    weddingPackagesIntro:
      "From elegant romantic touches to a complete royal celebration, discover the perfect package for your special night.",

    weddingInquirySmall: "PLAN YOUR SPECIAL MOMENT",
    weddingInquiryMain: "Let Us Make It Unforgettable",
    weddingInquiryDesc:
      "Every love story deserves a special celebration. Contact our team to explore our wedding-night packages, check availability, and arrange the perfect experience for your memorable night.",
    weddingInquiryBtn: "INQUIRE ON WHATSAPP",
    weddingInquirySubject: "Wedding & Honeymoon Packages — General Inquiry & Availability",

    weddingGallerySmall: "THE BEAUTY IS IN THE DETAILS",
    weddingGalleryMain: "Moments Worth Remembering",
    weddingGalleryDesc:
      "Explore our beautifully arranged wedding rooms, romantic floral decorations, and thoughtful details that turn your celebration into an unforgettable experience.",
    weddingGalleryFullscreenBtn: "View Full Screen",
    weddingGalleryPrev: "Previous photo",
    weddingGalleryNext: "Next photo",

    weddingDiningSmall: "SIGNATURE DINING EXPERIENCE",
    weddingDiningMain: "Complete Your Celebration at Diwan Mada",
    weddingDiningDesc1:
      "Elevate your special moments with a memorable dining experience at Diwan Mada Restaurant.",
    weddingDiningDesc2:
      "Enjoy exceptional flavors, elegant surroundings, and panoramic Red Sea views in a beautiful setting made for unforgettable occasions.",
    weddingDiningBtn: "DISCOVER DIWAN MADA",

    // OFFER 2 PAGE — UP TO 25% OFF GROUND-FLOOR ROOMS (ATLANTIS OFFER REFERENCE + OFFICIAL PDF)
    offer2HeroSmall: "OFFERS",
    offer2HeroMain: "Up to 25% Off Your Stay",
    offer2DetailsTitle: "Offer Details",
    offer2DetailsDesc: "Receive up to 25% off selected ground-floor rooms at OZ Park Hotel.",
    offer2WeekdayNote: "Offer valid on weekdays only (Sunday–Thursday). Friday and Saturday nights are excluded.",
    offer2BookBtn: "BOOK ON WHATSAPP",
    offer2WhatsappSubject: "Offer 2 — Up to 25% Off Ground-Floor Rooms (Weekdays: Sunday–Thursday, 1 Nov – 31 Dec 2026)",
    offer2BookingDatesTitle: "Booking Dates",
    offer2BookingDatesText: "Ongoing",
    offer2StayDatesTitle: "Stay Dates",
    offer2StayDatesText: "1 November 2026 – 31 December 2026",

    // OFFER 3 PAGE — UP TO 35% OFF EXTENDED STAYS (ATLANTIS OFFER REFERENCE + OFFICIAL PDF)
    offer3HeroSmall: "OFFERS",
    offer3HeroMain: "Stay Longer, Save Up to 35%",
    offer3DetailsTitle: "Offer Details",
    offer3DetailsDesc: "Enjoy up to 35% off eligible extended stays at OZ Park Hotel.",
    offer3WeekdayNote:
      "Minimum length of stay applies. Offer valid on weekdays only (Sunday–Thursday). Friday and Saturday nights are excluded.",
    offer3BookBtn: "BOOK NOW",
    offer3BookingDatesTitle: "Booking Dates",
    offer3BookingDatesText: "Ongoing",
    offer3StayDatesTitle: "Stay Dates",
    offer3StayDatesText: "1 November 2026 – 31 December 2026",

    // OFFER 4 PAGE — 10% OFF DINING & CAFÉ (ATLANTIS REFERENCE + OFFICIAL 6-SECTION PDF)
    offer4HeroSmall: "EXCLUSIVE GUEST DINING OFFER",
    offer4HeroMain: "10% Off Dining & Café Experiences",
    offer4IntroP1:
      "From exceptional dining at Diwan Mada Restaurant to relaxing coffee moments at OZ Park Café, discover unforgettable flavors accompanied by breathtaking Red Sea views.",
    offer4IntroP2Prefix: "Enjoy an exclusive ",
    offer4IntroP2Bold: "10% discount on dining and café experiences",
    offer4IntroP2Suffix: " throughout your stay at OZ Park Hotel.",
    offer4DiningSmall: "OZ PARK HOTEL",
    offer4DiningMain: "Explore Our Dining Experiences",
    offer4DiningSubtitle:
      "From elegant seaside dining to relaxing coffee moments, discover two unique experiences at OZ Park Hotel, with an exclusive 10% discount for our hotel guests.",
    offer4Card1Category: "SIGNATURE DINING",
    offer4Card1Title: "Diwan Mada Restaurant",
    offer4Card1Desc:
      "Discover refined flavors and an elegant dining atmosphere, complemented by breathtaking panoramic Red Sea views.",
    offer4Card1Benefit: "10% Off Dining",
    offer4Card1Btn: "EXPLORE RESTAURANT",
    offer4Card2Category: "COFFEE & RELAXATION",
    offer4Card2Title: "OZ Park Café",
    offer4Card2Desc:
      "Enjoy freshly brewed coffee, refreshing beverages, and delicious desserts in a peaceful setting overlooking the Red Sea.",
    offer4Card2Benefit: "10% Off Café Orders",
    offer4Card2Btn: "EXPLORE CAFÉ",
    offer4StaySmall: "STAY AT OZ PARK HOTEL",
    offer4StayMain: "Your Stay, More to Enjoy",
    offer4StayDesc:
      "Make your coastal escape even more rewarding with a stay at OZ Park Hotel. Enjoy comfortable accommodation, breathtaking Red Sea views, and an exclusive 10% discount at Diwan Mada Restaurant and OZ Park Café throughout your stay.",
    offer4StayBtn: "BOOK YOUR STAY",
    offer4PromoSmall: "EXCLUSIVE STAY OFFERS",
    offer4PromoMain: "Stay Longer, Save Up to 35%",
    offer4PromoDesc: "More nights. More memories. More savings by the sea.",
    offer4PromoBtn: "EXPLORE OFFER",

    // DIWAN MADA RESTAURANT DEDICATED DINING PAGE (ATLANTIS DINING REFERENCE + OFFICIAL 6-SECTION PDF)
    diningHeroSmall: "DINING AT OZ PARK",
    diningHeroMain: "A Dining Experience Beyond the Horizon",
    diningIntroSmall: "WELCOME TO DIWAN MADA",
    diningIntroMain: "Where Every Flavor Meets the Sea",
    diningIntroP1:
      "Discover a memorable dining experience at Diwan Mada Restaurant, where exceptional flavors, warm hospitality, and breathtaking panoramic Red Sea views come together.",
    diningIntroP2:
      "From traditional Middle Eastern favorites to international dishes, enjoy a diverse culinary experience in an elegant setting overlooking the beautiful coast of Al Qunfudhah.",
    diningIntroBtn: "EXPLORE FULL RESTAURANT",
    diningMenuSmall: "THE FLAVORS OF DIWAN MADA",
    diningMenuMain: "A World of Flavors Awaits",
    diningMenuDesc1:
      "From authentic Middle Eastern specialties to international favorites, explore a diverse menu thoughtfully prepared to satisfy every taste.",
    diningMenuDesc2:
      "Discover seven delicious categories, each bringing its own unique flavors to your dining experience.",
    diningFeaturedDishesLabel: "Featured Dishes:",
    diningExpIntroSmall: "THE DIWAN MADA EXPERIENCE",
    diningExpIntroMain: "Dine Your Way",
    diningExpIntroDesc1:
      "From delightful breakfast mornings to memorable evening gatherings, discover dining experiences designed around your moments.",
    diningExpIntroDesc2:
      "Whether you prefer a generous buffet, a freshly prepared meal from our menu, or the comfort of dining in your room, there's always something to enjoy at Diwan Mada.",

    // OZ PARK CAFÉ DEDICATED PAGE (ATLANTIS LOST WORLD REFERENCE + OFFICIAL 5-SECTION PDF)
    cafeHeroSmall: "OZ PARK HOTEL",
    cafeHeroMain: "Coffee with a View",
    cafeIntroSmall: "WELCOME TO OZ PARK CAFÉ",
    cafeIntroMain: "Your Perfect Coffee Moment",
    cafeIntroP1:
      "Take a moment to slow down at OZ Park Café, where freshly brewed coffee, refreshing drinks, and delicious desserts meet breathtaking panoramic Red Sea views.",
    cafeIntroP2:
      "Whether you're starting your afternoon with your favorite coffee or enjoying a peaceful evening by the coast, every visit offers a little moment of relaxation.",
    cafeInfoHoursLabel: "Opening Hours",
    cafeInfoHoursValue: "Daily | 12:00 PM – 3:00 AM",
    cafeInfoLocationLabel: "Location",
    cafeInfoLocationLine1: "1st Floor, OZ Park Hotel",
    cafeInfoLocationLine2: "South Corniche, Al Qunfudhah, Saudi Arabia",
    cafeInfoContactLabel: "Contact",
    cafeInfoContactValue: "+966 50 095 5877",
    cafeInfoEmailLabel: "Email",
    cafeInfoEmailValue: "info@ozpark.sa",
    cafeMenuSmall: "THE OZ PARK CAFÉ EXPERIENCE",
    cafeMenuMain: "Something for Every Moment",
    cafeMenuDesc:
      "From rich, aromatic coffee to refreshing beverages and delightful desserts, discover your favorites at OZ Park Café.",

    // MEETING ROOM DEDICATED PAGE (ATLANTIS LOST WORLD REFERENCE + OFFICIAL 5-SECTION PDF)
    meetingHeroSmall: "MEETINGS AT OZ PARK",
    meetingHeroMain: "Where Ideas Come Together",
    meetingIntroSmall: "MEET AT OZ PARK",
    meetingIntroMain: "A Space for Meaningful Connections",
    meetingIntroP1:
      "Bring your ideas to life in a thoughtfully designed meeting space at OZ Park Hotel.",
    meetingIntroP2:
      "From business discussions and team gatherings to professional presentations, our meeting room offers a comfortable and refined setting where every detail supports a productive experience.",
    meetingIntroP3:
      "Complete your gathering with our specially prepared coffee break packages.",
    meetingInfoAvailLabel: "Availability",
    meetingInfoAvailValue: "24 Hours | 7 Days a Week",
    meetingInfoLocationLabel: "Location",
    meetingInfoLocationLine1: "1st Floor, OZ Park Hotel",
    meetingInfoLocationLine2: "South Corniche, Al Qunfudhah, Saudi Arabia",
    meetingInfoContactLabel: "Contact",
    meetingInfoContactValue: "+966 50 095 5877",
    meetingInfoEmailLabel: "Email",
    meetingInfoEmailValue: "info@ozpark.sa",
    meetingInfoBtn: "INQUIRE ON WHATSAPP",
    meetingInfoWhatsappSubject: "Meeting Room Reservation & Coffee Break Packages Inquiry",
    meetingInfoNote:
      "Meeting-room availability must be confirmed before booking. Please confirm with our reservations team whether meeting-room rental is charged separately from the coffee break packages.",
    meetingBreakSmall: "MEETINGS MADE BETTER",
    meetingBreakMain: "A Refreshing Break Between Ideas",
    meetingBreakP1:
      "Make every meeting more enjoyable with thoughtfully prepared refreshments, savory bites, and delightful pastries.",
    meetingBreakP2:
      "Explore our coffee break packages, designed to complement your gatherings and create memorable moments between conversations.",

    // STAY AT OUR HOTEL DEDICATED PAGE (ATLANTIS STAY REFERENCE + OFFICIAL 6-SECTION PDF)
    stayPageHeroSmall: "STAY AT OZ PARK",
    stayPageHeroMain: "Your Escape by the Sea",
    stayPageIntroSmall: "WHERE EVERY STAY BEGINS",
    stayPageIntroMain: "A Stay Designed Around You",
    stayPageIntroDesc:
      "Discover elegant rooms, spacious studios, and refined suites, all thoughtfully designed for comfort and relaxation. With beautiful Red Sea views and warm hospitality, every stay at OZ Park Hotel offers a peaceful escape along Al Qunfudhah's coast.",
    stayPageIntroBtn: "EXPLORE ALL ROOMS",
    stayPageAccomTabs: ["ROOMS", "STUDIOS", "SUITES"],
    stayPageAccomExploreBtns: ["EXPLORE ROOMS", "EXPLORE STUDIOS", "EXPLORE SUITES"],
    stayPageBeyondSmall: "BEYOND YOUR STAY",
    stayPageBeyondMain: "More Than Just a Stay",
    stayPageBeyondDesc:
      "Discover more at OZ Park Hotel. From exceptional dining with panoramic Red Sea views to relaxing café moments and thoughtfully designed meeting spaces, every experience adds something special to your stay.",
    stayPageBeyondBtn: "EXPLORE EXPERIENCES",
    stayPageExpTabs: ["DIWAN MADA RESTAURANT", "OZ PARK CAFÉ", "MEETING ROOM"],

    // SECTION 5 (PDF SECTION 7) — FOOTER
    footerBrand: "OZ PARK HOTEL",
    footerBrandDesc:
      "Experience coastal comfort, elegant stays, and warm hospitality at OZ Park Hotel, overlooking the Red Sea in Al Qunfudhah, Saudi Arabia.",
    footerLocationLabel: "Location",
    footerLocation: "South Corniche, Al Qunfudhah, Saudi Arabia",
    footerNavLabel: "Navigation",
    footerNavLinks: [
      { label: "Home", href: "#top" },
      { label: "About OZ Park", href: "#signature", slideIndex: 0 },
      { label: "Rooms & Suites", href: "#stay" },
      { label: "Offers", href: "#offers" },
      { label: "Wedding Packages", href: "#wedding-packages", isWedding: true },
      { label: "Diwan Mada Restaurant", href: "#signature", slideIndex: 1 },
      { label: "OZ Park Café", href: "#signature", slideIndex: 2 },
      { label: "Meeting Room", href: "#signature", slideIndex: 3 },
      { label: "Contact Us", href: "#contact" },
    ],
    footerAdditionalLabel: "Additional Links",
    footerBookLink: "Book Your Stay",
    footerPrivacyLink: "Privacy Policy",
    footerTermsLink: "Terms & Conditions",
    footerSocialLabel: "Social Media",
    copyright: "© 2026 OZ Park Hotel. All Rights Reserved.",

    // MODALS
    modalClose: "Close ✕",
    modalBookCta: "BOOK YOUR STAY",
    modalAmenitiesTitle: "Key Features & Amenities",
    modalIncludedRoomsTitle: "Available Configurations",
    privacyTitle: "Privacy Policy — OZ Park Hotel",
    privacyBody:
      "OZ Park Hotel respects your privacy and protects all personal information provided during reservations and inquiries. Guest contact details are used solely to confirm bookings, personalize your stay, and provide guest support.",
    termsTitle: "Terms & Conditions — OZ Park Hotel",
    termsBody:
      "Standard check-in starts at 4:00 PM and check-out is until 12:00 PM. Promotional offers are subject to room availability and applicable stay conditions. Valid government ID is required upon check-in.",
  },
  ar: {
    languageButton: "EN",
    switchLanguage: "التبديل إلى اللغة الإنجليزية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    bookYourStay: "احجز إقامتك",
    backToHome: "العودة للرئيسية",
    nav: [
      ["الرئيسية", "top"],
      ["عروضنا الحالية", "offers"],
      ["باقات الزفاف وشهر العسل", "wedding-packages"],
      ["اكتشف أوز بارك", "signature"],
      ["الغرف والاستوديوهات والأجنحة", "stay"],
      ["تواصل معنا", "contact"],
    ],
    tagline:
      "اختبر الراحة الساحلية والإقامة الأنيقة والضيافة الدافئة في فندق أوز بارك المطل على البحر الأحمر في القنفذة، المملكة العربية السعودية.",
    addressText: "الكورنيش الجنوبي، القنفذة، المملكة العربية السعودية",

    // SECTION 1 — HERO / MAIN BANNER
    heroEyebrow: "فندق أوز بارك | القنفذة",
    heroTitle: "حيث تلتقي الراحة بالبحر",
    heroSubtitle:
      "اكتشف ملاذاً ساحلياً تجتمع فيه الإقامة الأنيقة، والضيافة الدافئة، وجمال البحر الأحمر.",
    heroAlt: "فندق أوز بارك المطل على البحر الأحمر في القنفذة",
    soundOn: "تشغيل الصوت",
    soundOff: "كتم الصوت",

    // SECTION 2 — HAPPENING NOW
    happeningEyebrow: "عروض حصرية",
    happeningTitle: "يحدث الآن",
    happeningCopy:
      "اكتشف العروض الحصرية والتجارب المميزة في فندق أوز بارك. من الإقامات الرومانسية إلى الإقامات الطويلة، هناك دائماً ما ينتظرك.",
    previousOffer: "العرض السابق",
    nextOffer: "العرض التالي",

    // SECTION 3 — DISCOVER OZ PARK / EXPERIENCE SLIDER
    discoverEyebrow: "اكتشف أوز بارك",
    discoverTitle: "أكثر من مجرد إقامة",
    discoverCopy:
      "من الإقامات الساحلية المريحة إلى تجارب الطعام التي لا تُنسى، اكتشف كل ما يجعل فندق أوز بارك وجهة متكاملة بحد ذاته.",
    signatureLabel: "معرض تجارب أوز بارك",
    scrollToExplore: "مرّر أو اضغط للاستكشاف",

    // SECTION 4 — STAY / ACCOMMODATION
    stayEyebrow: "الإقامة في أوز بارك",
    stayTitle: "الغرف والاستوديوهات والأجنحة",
    stayCopy:
      "إقامة مصممة حول راحتك. اكتشف مساحات مصممة بعناية ووسائل راحة عصرية وإطلالات ساحرة على البحر الأحمر، سواء كنت تزورنا لليلة واحدة أو لإقامة أطول.",

    // WEDDING & HONEYMOON PACKAGES PAGE
    weddingHeroSmall: "باقات ليلة الزفاف",
    weddingHeroMain: "احتفل بحبكما على ضفاف البحر",

    weddingIntroSmall: "احتفال لا يُنسى",
    weddingIntroMain: "حيث تتحول البدايات الجميلة إلى ذكريات خالدة",
    weddingIntroDesc1:
      "كل قصة حب تستحق بداية جميلة. في فندق أوز بارك، احتفلوا بلحظاتكما الخاصة مع تجهيزات الغرف الرومانسية واللمسات المدروسة وجمال البحر الأحمر.",
    weddingIntroDesc2:
      "اختاروا من بين أربع باقات لليلة الزفاف، صُممت كل منها لتجعل لحظاتكما الأولى معاً ذكرى لا تُنسى.",

    weddingPackagesSmall: "باقات الزفاف لدينا",
    weddingPackagesMain: "أربع باقات للاحتفال بحبكما",
    weddingPackagesIntro:
      "من اللمسات الرومانسية الأنيقة إلى الاحتفال الملكي المتكامل، اكتشفوا الباقة المثالية لليلتكما المميزة.",

    weddingInquirySmall: "خطّط للحظتكما المميزة",
    weddingInquiryMain: "دعنا نجعلها ليلة لا تُنسى",
    weddingInquiryDesc:
      "كل قصة حب تستحق احتفالاً خاصاً. تواصلوا مع فريقنا لاستكشاف باقات ليلة الزفاف، والتحقق من التوفر، وترتيب التجربة المثالية لليلتكما الخالدة.",
    weddingInquiryBtn: "استفسر عبر واتساب",
    weddingInquirySubject: "باقات الزفاف وشهر العسل — استفسار وحجز",

    weddingGallerySmall: "الجمال يكمن في التفاصيل",
    weddingGalleryMain: "لحظات تستحق أن تُخلّد",
    weddingGalleryDesc:
      "استكشفوا غرف الزفاف المنسقة بعناية، وتجهيزات الورود الرومانسية، والتفاصيل المدروسة التي تحوّل احتفالكما إلى تجربة لا تُنسى.",
    weddingGalleryFullscreenBtn: "عرض بملء الشاشة",
    weddingGalleryPrev: "الصورة السابقة",
    weddingGalleryNext: "الصورة التالية",

    weddingDiningSmall: "تجربة طعام استثنائية",
    weddingDiningMain: "أكمل احتفالك في مطعم ديوان مدى",
    weddingDiningDesc1:
      "ارتقِ بلحظاتكما الخاصة مع تجربة عشاء لا تُنسى في مطعم ديوان مدى.",
    weddingDiningDesc2:
      "استمتعوا بنكهات استثنائية وأجواء أنيقة وإطلالات بانورامية على البحر الأحمر في مكان صُمم للمناسبات التي لا تُنسى.",
    weddingDiningBtn: "اكتشف مطعم ديوان مدى",

    // OFFER 2 PAGE — UP TO 25% OFF GROUND-FLOOR ROOMS
    offer2HeroSmall: "العروض",
    offer2HeroMain: "خصم يصل إلى 25% على إقامتك",
    offer2DetailsTitle: "تفاصيل العرض",
    offer2DetailsDesc: "احصل على خصم يصل إلى 25% على غرف مختارة في الطابق الأرضي بفندق أوز بارك.",
    offer2WeekdayNote: "يسري العرض خلال أيام الأسبوع فقط (من الأحد إلى الخميس). تُستثنى ليالي الجمعة والسبت.",
    offer2BookBtn: "احجز عبر واتساب",
    offer2WhatsappSubject: "العرض الثاني — خصم يصل إلى 25% على غرف الطابق الأرضي (الأحد–الخميس، 1 نوفمبر – 31 ديسمبر 2026)",
    offer2BookingDatesTitle: "تواريخ الحجز",
    offer2BookingDatesText: "متاح حالياً",
    offer2StayDatesTitle: "تواريخ الإقامة",
    offer2StayDatesText: "1 نوفمبر 2026 – 31 ديسمبر 2026",

    // OFFER 3 PAGE — UP TO 35% OFF EXTENDED STAYS
    offer3HeroSmall: "العروض",
    offer3HeroMain: "أقم لفترة أطول ووفّر حتى 35%",
    offer3DetailsTitle: "تفاصيل العرض",
    offer3DetailsDesc: "استمتع بخصم يصل إلى 35% على الإقامات الطويلة المؤهلة في فندق أوز بارك.",
    offer3WeekdayNote:
      "يطبق الحد الأدنى لمدة الإقامة. يسري العرض خلال أيام الأسبوع فقط (من الأحد إلى الخميس). تُستثنى ليالي الجمعة والسبت.",
    offer3BookBtn: "احجز الآن",
    offer3BookingDatesTitle: "تواريخ الحجز",
    offer3BookingDatesText: "متاح حالياً",
    offer3StayDatesTitle: "تواريخ الإقامة",
    offer3StayDatesText: "1 نوفمبر 2026 – 31 ديسمبر 2026",

    // OFFER 4 PAGE — 10% OFF DINING & CAFÉ
    offer4HeroSmall: "عرض طعام حصري لنزلاء الفندق",
    offer4HeroMain: "خصم 10% على تجارب المطعم والمقهى",
    offer4IntroP1:
      "من تجارب الطعام الاستثنائية في مطعم ديوان مدى إلى لحظات القهوة الهادئة في مقهى أوز بارك، اكتشف نكهات لا تُنسى ترافقها إطلالات ساحرة على البحر الأحمر.",
    offer4IntroP2Prefix: "استمتع بـ ",
    offer4IntroP2Bold: "خصم حصري 10% على تجارب المطعم والمقهى",
    offer4IntroP2Suffix: " طوال فترة إقامتك في فندق أوز بارك.",
    offer4DiningSmall: "فندق أوز بارك",
    offer4DiningMain: "استكشف تجارب الطعام والمقهى لدينا",
    offer4DiningSubtitle:
      "من العشاء الساحلي الأنيق إلى لحظات القهوة المريحة، اكتشف تجربتين فريدتين في فندق أوز بارك مع خصم حصري 10% لنزلاء الفندق.",
    offer4Card1Category: "مطعم مميز",
    offer4Card1Title: "مطعم ديوان مدى",
    offer4Card1Desc:
      "اكتشف نكهات راقية وأجواء طعام أنيقة تكتمل بإطلالات بانورامية خلابة على البحر الأحمر.",
    offer4Card1Benefit: "خصم 10% على المطعم",
    offer4Card1Btn: "استكشف المطعم",
    offer4Card2Category: "قهوة واسترخاء",
    offer4Card2Title: "مقهى أوز بارك",
    offer4Card2Desc:
      "استمتع بالقهوة الطازجة والمشروبات المنعشة والحلويات الشهية في أجواء هادئة تطل على البحر الأحمر.",
    offer4Card2Benefit: "خصم 10% على طلبات المقهى",
    offer4Card2Btn: "استكشف المقهى",
    offer4StaySmall: "الإقامة في فندق أوز بارك",
    offer4StayMain: "إقامتك، متعة أكبر",
    offer4StayDesc:
      "اجعل ملاذك الساحلي أكثر تميزاً مع إقامة في فندق أوز بارك. استمتع بإقامة مريحة وإطلالات ساحرة على البحر الأحمر وخصم حصري 10% في مطعم ديوان مدى ومقهى أوز بارك طوال فترة إقامتك.",
    offer4StayBtn: "احجز إقامتك",
    offer4PromoSmall: "عروض الإقامة الحصرية",
    offer4PromoMain: "أقم لفترة أطول ووفّر حتى 35%",
    offer4PromoDesc: "ليالٍ أكثر. ذكريات أجمل. توفير أكبر على ضفاف البحر.",
    offer4PromoBtn: "استكشف العرض",

    // DIWAN MADA RESTAURANT DEDICATED DINING PAGE
    diningHeroSmall: "المطاعم في أوز بارك",
    diningHeroMain: "تجربة طعام تتجاوز الأفق",
    diningIntroSmall: "مرحباً بكم في مطعم ديوان مدى",
    diningIntroMain: "حيث تلتقي كل نكهة بالبحر",
    diningIntroP1:
      "اكتشف تجربة طعام لا تُنسى في مطعم ديوان مدى، حيث تجتمع النكهات الاستثنائية وكرم الضيافة والإطلالات البانورامية الساحرة على البحر الأحمر.",
    diningIntroP2:
      "من الأطباق الشرقية الأصيلة إلى الخيارات العالمية المتنوعة، استمتع بتجربة طهي متكاملة في أجواء أنيقة تطل على ساحل القنفذة الجميل.",
    diningIntroBtn: "استكشف المطعم بالكامل",
    diningMenuSmall: "نكهات ديوان مدى",
    diningMenuMain: "عالم من النكهات بانتظارك",
    diningMenuDesc1:
      "من التخصصات الشرقية الأصيلة إلى المفضلات العالمية، استكشف قائمة متنوعة أُعدّت بعناية لترضي جميع الأذواق.",
    diningMenuDesc2:
      "اكتشف سبعة أقسام شهية، يقدّم كلٌّ منها نكهاته الفريدة لتجربة طعامك.",
    diningFeaturedDishesLabel: "أبرز الأطباق:",
    diningExpIntroSmall: "تجربة ديوان مدى",
    diningExpIntroMain: "استمتع بطعامك على طريقتك",
    diningExpIntroDesc1:
      "من صباحات الإفطار الشهية إلى تجمعات المساء الخالدة، اكتشف تجارب طعام صُممت لتلائم لحظاتك.",
    diningExpIntroDesc2:
      "سواء كنت تفضّل البوفيه الغني، أو وجبة محضّرة طازجة من قائمتنا، أو راحة تناول الطعام في غرفتك، فهناك دائماً ما يسعدك في ديوان مدى.",

    // OZ PARK CAFÉ DEDICATED PAGE
    cafeHeroSmall: "فندق أوز بارك",
    cafeHeroMain: "قهوة بإطلالة بحرية",
    cafeIntroSmall: "مرحباً بكم في مقهى أوز بارك",
    cafeIntroMain: "لحظة القهوة المثالية",
    cafeIntroP1:
      "خُذ لحظة للتمهّل في مقهى أوز بارك، حيث تلتقي القهوة المحضّرة طازجة والمشروبات المنعشة والحلويات الشهية بإطلالات بانورامية ساحرة على البحر الأحمر.",
    cafeIntroP2:
      "سواء كنت تبدأ فترة ما بعد الظهيرة بقهوتك المفضلة أو تستمتع بأمسية هادئة على الساحل، تمنحك كل زيارة لحظة جميلة من الاسترخاء.",
    cafeInfoHoursLabel: "ساعات العمل",
    cafeInfoHoursValue: "يومياً | 12:00 ظهراً – 3:00 صباحاً",
    cafeInfoLocationLabel: "الموقع",
    cafeInfoLocationLine1: "الطابق الأول، فندق أوز بارك",
    cafeInfoLocationLine2: "الكورنيش الجنوبي، القنفذة، المملكة العربية السعودية",
    cafeInfoContactLabel: "التواصل",
    cafeInfoContactValue: "+966 50 095 5877",
    cafeInfoEmailLabel: "البريد الإلكتروني",
    cafeInfoEmailValue: "info@ozpark.sa",
    cafeMenuSmall: "تجربة مقهى أوز بارك",
    cafeMenuMain: "خيار يناسب كل لحظة",
    cafeMenuDesc:
      "من القهوة الغنية العطرة إلى المشروبات المنعشة والحلويات الشهية، اكتشف خياراتك المفضلة في مقهى أوز بارك.",

    // MEETING ROOM DEDICATED PAGE
    meetingHeroSmall: "الاجتماعات في أوز بارك",
    meetingHeroMain: "حيث تلتقي الأفكار",
    meetingIntroSmall: "اجتمع في أوز بارك",
    meetingIntroMain: "مساحة للتواصل المثمر",
    meetingIntroP1:
      "حوّل أفكارك إلى واقع في مساحة اجتماعات مصممة بعناية في فندق أوز بارك.",
    meetingIntroP2:
      "من نقاشات العمل واجتماعات الفرق إلى العروض التقديمية الاحترافية، توفر قاعة الاجتماعات لدينا بيئة مريحة وراقية تدعم كل تفصيل فيها تجربة مثمرة.",
    meetingIntroP3:
      "أكمل اجتماعك مع باقات استراحة القهوة المحضّرة خصيصاً لضيوفك.",
    meetingInfoAvailLabel: "التوفر",
    meetingInfoAvailValue: "24 ساعة | 7 أيام في الأسبوع",
    meetingInfoLocationLabel: "الموقع",
    meetingInfoLocationLine1: "الطابق الأول، فندق أوز بارك",
    meetingInfoLocationLine2: "الكورنيش الجنوبي، القنفذة، المملكة العربية السعودية",
    meetingInfoContactLabel: "التواصل",
    meetingInfoContactValue: "+966 50 095 5877",
    meetingInfoEmailLabel: "البريد الإلكتروني",
    meetingInfoEmailValue: "info@ozpark.sa",
    meetingInfoBtn: "استفسر عبر واتساب",
    meetingInfoWhatsappSubject: "استفسار وحجز قاعة الاجتماعات وباقات استراحة القهوة",
    meetingInfoNote:
      "يجب تأكيد توفر قاعة الاجتماعات قبل الحجز. يرجى التأكد مع فريق الحجوزات مما إذا كانت رسوم حجز القاعة تُحتسب بشكل منفصل عن باقات استراحة القهوة.",
    meetingBreakSmall: "اجتماعات أفضل",
    meetingBreakMain: "استراحة منعشة بين الأفكار",
    meetingBreakP1:
      "اجعل كل اجتماع أكثر متعة مع المرطبات المحضّرة بعناية، والمقبلات المالحة، والمعجنات الشهية.",
    meetingBreakP2:
      "استكشف باقات استراحة القهوة لدينا، المصممة لتكمل اجتماعاتك وتصنع لحظات لا تُنسى بين الحوارات.",

    // STAY AT OUR HOTEL DEDICATED PAGE (ATLANTIS STAY REFERENCE + OFFICIAL 6-SECTION PDF)
    stayPageHeroSmall: "الإقامة في أوز بارك",
    stayPageHeroMain: "ملاذك على ضفاف البحر",
    stayPageIntroSmall: "حيث تبدأ كل إقامة",
    stayPageIntroMain: "إقامة مصممة حول راحتك",
    stayPageIntroDesc:
      "اكتشف غرفاً أنيقة، واستوديوهات فسيحة، وأجنحة راقية، صُممت جميعها بعناية لتوفير أقصى درجات الراحة والاسترخاء. مع الإطلالات الجميلة على البحر الأحمر وكرم الضيافة الدافئ، تمنحك كل إقامة في فندق أوز بارك ملاذاً هادئاً على ساحل القنفذة.",
    stayPageIntroBtn: "استكشف جميع الغرف",
    stayPageAccomTabs: ["الغرف", "الاستوديوهات", "الأجنحة"],
    stayPageAccomExploreBtns: ["استكشف الغرف", "استكشف الاستوديوهات", "استكشف الأجنحة"],
    stayPageBeyondSmall: "أبعد من مجرد إقامة",
    stayPageBeyondMain: "أكثر من مجرد إقامة",
    stayPageBeyondDesc:
      "اكتشف المزيد في فندق أوز بارك. من تجارب الطعام الاستثنائية مع الإطلالات البانورامية على البحر الأحمر إلى لحظات القهوة الهادئة ومساحات الاجتماعات المصممة بعناية، تضيف كل تجربة لمسة مميزة لإقامتك.",
    stayPageBeyondBtn: "استكشف التجارب",
    stayPageExpTabs: ["مطعم ديوان مدى", "مقهى أوز بارك", "قاعة الاجتماعات"],

    // SECTION 5 (PDF SECTION 7) — FOOTER
    footerBrand: "فندق أوز بارك | OZ PARK HOTEL",
    footerBrandDesc:
      "اختبر الراحة الساحلية والإقامة الأنيقة والضيافة الدافئة في فندق أوز بارك المطل على البحر الأحمر في القنفذة، المملكة العربية السعودية.",
    footerLocationLabel: "الموقع",
    footerLocation: "الكورنيش الجنوبي، القنفذة، المملكة العربية السعودية",
    footerNavLabel: "التنقل السريع",
    footerNavLinks: [
      { label: "الرئيسية", href: "#top" },
      { label: "عن أوز بارك", href: "#signature", slideIndex: 0 },
      { label: "الغرف والأجنحة", href: "#stay" },
      { label: "العروض", href: "#offers" },
      { label: "باقات الزفاف", href: "#wedding-packages", isWedding: true },
      { label: "مطعم ديوان مدى", href: "#signature", slideIndex: 1 },
      { label: "مقهى أوز بارك", href: "#signature", slideIndex: 2 },
      { label: "قاعة الاجتماعات", href: "#signature", slideIndex: 3 },
      { label: "تواصل معنا", href: "#contact" },
    ],
    footerAdditionalLabel: "روابط إضافية",
    footerBookLink: "احجز إقامتك",
    footerPrivacyLink: "سياسة الخصوصية",
    footerTermsLink: "الشروط والأحكام",
    footerSocialLabel: "التواصل الاجتماعي",
    copyright: "© 2026 فندق أوز بارك (OZ Park Hotel). جميع الحقوق محفوظة.",

    // MODALS
    modalClose: "إغلاق ✕",
    modalBookCta: "احجز إقامتك",
    modalAmenitiesTitle: "أبرز المزايا ووسائل الراحة",
    modalIncludedRoomsTitle: "الخيارات المتوفرة",
    privacyTitle: "سياسة الخصوصية — فندق أوز بارك",
    privacyBody:
      "يلتزم فندق أوز بارك بحماية خصوصية ضيوفه وجميع البيانات الشخصية المقدمة أثناء الحجز أو الاستفسار، وتُستخدم معلومات التواصل حصرياً لتأكيد الحجوزات وخدمة الضيوف.",
    termsTitle: "الشروط والأحكام — فندق أوز بارك",
    termsBody:
      "يبدأ تسجيل الدخول القياسي الساعة 4:00 مساءً وتسجيل المغادرة حتى الساعة 12:00 ظهراً. تخضع العروض الترويجية لتوفر الغرف وشروط العرض المحددة. يلزم إبراز هوية سارية عند الوصول.",
  },
} as const;

function Arrow({ reverse = false, rtl = false }: { reverse?: boolean; rtl?: boolean }) {
  const pointsLeft = reverse ? !rtl : rtl;
  return <span aria-hidden="true">{pointsLeft ? "\u2190" : "\u2192"}</span>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState(0);
  const [signatureSlide, setSignatureSlide] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  // Wedding page interactive states
  const [activeWeddingGallery, setActiveWeddingGallery] = useState(0);
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState<number | null>(null);

  // Dining page interactive states
  const [activeDiningGallery, setActiveDiningGallery] = useState(0);
  const [activeDiningExpTab, setActiveDiningExpTab] = useState(0);
  const [activeAlacarteView, setActiveAlacarteView] = useState<"restaurant" | "room">("restaurant");

  // Café page interactive state
  const [activeCafeSlide, setActiveCafeSlide] = useState(0);
  const [cafeVerticalProgress, setCafeVerticalProgress] = useState(0);

  // Meeting Room page interactive state
  const [activeMeetingSlide, setActiveMeetingSlide] = useState(0);
  const [meetingVerticalProgress, setMeetingVerticalProgress] = useState(0);

  // Stay at OZ Park page interactive state
  const [activeStayAccomSlide, setActiveStayAccomSlide] = useState(0);
  const [activeStayExpSlide, setActiveStayExpSlide] = useState(0);
  const [stayHeroProgress, setStayHeroProgress] = useState(0);
  const [stayAccomIntroProgress, setStayAccomIntroProgress] = useState(0);
  const [stayVerticalProgress, setStayVerticalProgress] = useState(0);
  const [stayExpIntroProgress, setStayExpIntroProgress] = useState(0);

  // Offer 2 & Offer 3 page accordion states (4 collapsible sections)
  const [offer2OpenAccordions, setOffer2OpenAccordions] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  });
  const [offer3OpenAccordions, setOffer3OpenAccordions] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
  });
  const [offer2Lightbox, setOffer2Lightbox] = useState<{ src: string; title: string; caption?: string } | null>(null);

  const [selectedOfferModal, setSelectedOfferModal] = useState<OfferModalData | null>(null);
  const [selectedSlideModal, setSelectedSlideModal] = useState<ExperienceSlideData | null>(null);
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<AccommodationCategoryData | null>(null);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  // Room Category & Specific Room Detail page states
  const [activeCategorySlug, setActiveCategorySlug] = useState<RoomCategorySlug>("rooms");
  const [activeRoomSlug, setActiveRoomSlug] = useState<RoomSlug>("deluxe-room");
  const [activePrivilegeSlide, setActivePrivilegeSlide] = useState(0);
  const [roomPrivilegeAccordions, setRoomPrivilegeAccordions] = useState<Record<number, boolean>>({
    0: true,
    1: false,
  });
  const [roomAmenitiesModalOpen, setRoomAmenitiesModalOpen] = useState(false);
  const [roomGalleryLightboxIndex, setRoomGalleryLightboxIndex] = useState<number | null>(null);

  const offersRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLElement>(null);
  const cafeVerticalRef = useRef<HTMLElement>(null);
  const cafeMenuRef = useRef<HTMLElement>(null);
  const meetingVerticalRef = useRef<HTMLElement>(null);
  const meetingPackagesRef = useRef<HTMLElement>(null);
  const stayHeroSectionRef = useRef<HTMLElement>(null);
  const stayAccomSliderRef = useRef<HTMLElement>(null);
  const stayVerticalRef = useRef<HTMLElement>(null);
  const stayExpSliderRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const weddingVideoRef = useRef<HTMLVideoElement>(null);
  const diningVideoRef = useRef<HTMLVideoElement>(null);
  const stayVideoRef = useRef<HTMLVideoElement>(null);
  const weddingPackagesTrackRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const offers = offersData[language];
  const slides = experienceSlidesData[language];
  const categories = accommodationCategoriesData[language];
  const weddingPackages = weddingPackagesData[language];
  const weddingGallery = weddingGalleryData[language];
  const offer2Accordions = offer2AccordionsData[language];
  const offer2Showcase = offer2ShowcaseData[language];
  const offer3Accordions = offer3AccordionsData[language];
  const offer3Showcase = offer3ShowcaseData[language];
  const diningMenuCategories = diningMenuCategoriesData[language];
  const diningExperiencesSlides = diningExperiencesSlidesData[language];
  const cafeMenuSlides = cafeMenuSlidesData[language];
  const meetingPackageSlides = meetingPackageSlidesData[language];
  const isRtl = language === "ar";

  // Sync URL hash with dedicated offer, dining, café, meeting room, category & room pages
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#wedding-packages") {
        setActivePage("wedding");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#offer-25-off") {
        setActivePage("offer2");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#offer-35-off") {
        setActivePage("offer3");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#offer-dining-cafe") {
        setActivePage("offer4");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#diwan-mada-dining") {
        setActivePage("dining");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#oz-park-cafe") {
        setActivePage("cafe");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#meeting-room") {
        setActivePage("meeting");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash === "#stay-at-oz-park") {
        setActivePage("stay");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (hash.startsWith("#stay-category-")) {
        const catSlug = hash.replace("#stay-category-", "") as RoomCategorySlug;
        if (catSlug === "rooms" || catSlug === "studios" || catSlug === "suites") {
          setActiveCategorySlug(catSlug);
          setActivePage("room-category");
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (hash.startsWith("#room-")) {
        const rmSlug = hash.replace("#room-", "") as RoomSlug;
        if (rmSlug in specificRoomsData.en) {
          setActiveRoomSlug(rmSlug);
          setActiveCategorySlug(specificRoomsData.en[rmSlug].categorySlug);
          setActivePage("room-detail");
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (hash) {
        setActivePage("home");
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = !soundOn;
    video.play().catch(() => {});
  }, [soundOn, activePage]);

  useEffect(() => {
    if (activePage === "wedding") {
      weddingVideoRef.current?.play().catch(() => {});
    } else if (activePage === "dining") {
      diningVideoRef.current?.play().catch(() => {});
    } else if (activePage === "stay") {
      const v = stayVideoRef.current;
      if (v) {
        v.muted = !soundOn;
        v.play().catch(() => {});
      }
    }
  }, [activePage, soundOn]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = isRtl ? "rtl" : "ltr";
  }, [isRtl, language]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const anyModal =
      menuOpen ||
      Boolean(selectedOfferModal) ||
      Boolean(selectedSlideModal) ||
      Boolean(selectedCategoryModal) ||
      Boolean(legalModal) ||
      roomAmenitiesModalOpen ||
      roomGalleryLightboxIndex !== null ||
      fullscreenPhotoIndex !== null;
    document.body.style.overflow = anyModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [
    menuOpen,
    selectedOfferModal,
    selectedSlideModal,
    selectedCategoryModal,
    legalModal,
    roomAmenitiesModalOpen,
    roomGalleryLightboxIndex,
    fullscreenPhotoIndex,
  ]);

  useEffect(() => {
    if (activePage !== "home") return;
    let frame = 0;
    const updateSignature = () => {
      frame = 0;
      const section = signatureRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const next = Math.round(progress * (signatureImages.length - 1));
      setSignatureSlide((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateSignature);
    };
    updateSignature();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activePage]);

  useEffect(() => {
    if (activePage !== "cafe") return;
    let frame = 0;
    const updateCafeVertical = () => {
      frame = 0;
      const section = cafeVerticalRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const normalized = Math.min(1, Math.max(0, -rect.top / range));
      const continuous = normalized * (cafeMenuSlides.length - 1);
      setCafeVerticalProgress(continuous);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateCafeVertical);
    };
    updateCafeVertical();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activePage, cafeMenuSlides.length]);

  const scrollToCafeVerticalSlide = (targetIdx: number) => {
    const section = cafeVerticalRef.current;
    if (!section) return;
    const clamped = Math.max(0, Math.min(cafeMenuSlides.length - 1, targetIdx));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const targetScrollY = sectionTop + (clamped / (cafeMenuSlides.length - 1)) * range;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  useEffect(() => {
    if (activePage !== "meeting") return;
    let frame = 0;
    const updateMeetingVertical = () => {
      frame = 0;
      const section = meetingVerticalRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const normalized = Math.min(1, Math.max(0, -rect.top / range));
      const continuous = normalized * Math.max(1, meetingPackageSlides.length - 1);
      setMeetingVerticalProgress(continuous);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateMeetingVertical);
    };
    updateMeetingVertical();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activePage, meetingPackageSlides.length]);

  const scrollToMeetingVerticalSlide = (targetIdx: number) => {
    const section = meetingVerticalRef.current;
    if (!section) return;
    const clamped = Math.max(0, Math.min(meetingPackageSlides.length - 1, targetIdx));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const targetScrollY =
      sectionTop + (clamped / Math.max(1, meetingPackageSlides.length - 1)) * range;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  useEffect(() => {
    if (activePage !== "stay") return;
    let frame = 0;
    const updateStayAnimations = () => {
      frame = 0;
      const vh = window.innerHeight;
      const headerH = window.innerWidth <= 900 ? 72 : 88;

      // 1. Section 1 — Sticky Expanding Hero (Atlantis inspirational-hero--animated)
      const heroSec = stayHeroSectionRef.current;
      if (heroSec) {
        const rect = heroSec.getBoundingClientRect();
        const stickyH = Math.max(1, vh - headerH);
        const range = Math.max(1, heroSec.offsetHeight - stickyH);
        const scrolledPx = Math.max(0, headerH - rect.top);
        const p = Math.min(1, Math.max(0, scrolledPx / range));
        setStayHeroProgress(p);
      }

      // 2. Section 3 — Accommodation Split-Screen Intro Curtain (100% -> 589px -> fade)
      const accomSec = stayAccomSliderRef.current;
      if (accomSec) {
        const rect = accomSec.getBoundingClientRect();
        const startTop = Math.max(260, Math.min(440, vh * 0.52));
        const endTop = headerH + 16;
        const p = Math.min(1, Math.max(0, (startTop - rect.top) / Math.max(1, startTop - endTop)));
        setStayAccomIntroProgress(p);
      }

      // 3. Section 5A — Vertical Curtain-Wipe Carousel (3 Experiences)
      const vertSec = stayVerticalRef.current;
      if (vertSec) {
        const rect = vertSec.getBoundingClientRect();
        const range = Math.max(1, vertSec.offsetHeight - vh);
        const normalized = Math.min(1, Math.max(0, -rect.top / range));
        setStayVerticalProgress(normalized * 2);
      }

      // 4. Section 5B — Experiences Split-Screen Intro Curtain (100% -> 589px -> fade)
      const expSec = stayExpSliderRef.current;
      if (expSec) {
        const rect = expSec.getBoundingClientRect();
        const startTop = Math.max(260, Math.min(440, vh * 0.52));
        const endTop = headerH + 16;
        const p = Math.min(1, Math.max(0, (startTop - rect.top) / Math.max(1, startTop - endTop)));
        setStayExpIntroProgress(p);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateStayAnimations);
    };
    updateStayAnimations();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activePage]);

  const scrollToStayVerticalSlide = (targetIdx: number) => {
    const section = stayVerticalRef.current;
    if (!section) return;
    const clamped = Math.max(0, Math.min(2, targetIdx));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const targetScrollY = sectionTop + (clamped / 2) * range;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  const toggleLanguage = () => {
    setLanguage((current) => (current === "ar" ? "en" : "ar"));
    setMenuOpen(false);
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setSelectedCategoryModal(null);
    setLegalModal(null);
  };

  const openWeddingPage = () => {
    setSelectedOfferModal(null);
    setMenuOpen(false);
    setActivePage("wedding");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#wedding-packages");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openOffer2Page = () => {
    setSelectedOfferModal(null);
    setMenuOpen(false);
    setActivePage("offer2");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#offer-25-off");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openOffer3Page = () => {
    setSelectedOfferModal(null);
    setMenuOpen(false);
    setActivePage("offer3");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#offer-35-off");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openOffer4Page = () => {
    setSelectedOfferModal(null);
    setMenuOpen(false);
    setActivePage("offer4");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#offer-dining-cafe");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openDiningPage = () => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setMenuOpen(false);
    setActivePage("dining");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#diwan-mada-dining");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openCafePage = () => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setMenuOpen(false);
    setActivePage("cafe");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#oz-park-cafe");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openMeetingPage = () => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setMenuOpen(false);
    setActivePage("meeting");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#meeting-room");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openStayPage = () => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setSelectedCategoryModal(null);
    setMenuOpen(false);
    setActivePage("stay");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "#stay-at-oz-park");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openRoomCategoryPage = (slug: RoomCategorySlug) => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setSelectedCategoryModal(null);
    setRoomAmenitiesModalOpen(false);
    setRoomGalleryLightboxIndex(null);
    setMenuOpen(false);
    setActiveCategorySlug(slug);
    setActivePage("room-category");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#stay-category-${slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openRoomDetailPage = (slug: RoomSlug) => {
    setSelectedOfferModal(null);
    setSelectedSlideModal(null);
    setSelectedCategoryModal(null);
    setRoomAmenitiesModalOpen(false);
    setRoomGalleryLightboxIndex(null);
    setMenuOpen(false);
    setActiveRoomSlug(slug);
    setActiveCategorySlug(specificRoomsData[language][slug].categorySlug);
    setActivePage("room-detail");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#room-${slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleRoomPrivilegeAccordion = (idx: number) => {
    setRoomPrivilegeAccordions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const movePrivilegeCarousel = (direction: number) => {
    const total = roomPrivilegesCarouselData[language].length;
    setActivePrivilegeSlide((curr) => (curr + direction + total) % total);
  };

  const getPrivilegesCarouselWindow = () => {
    const items = roomPrivilegesCarouselData[language];
    const total = items.length;
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => {
      const idx = (activePrivilegeSlide + offset + total) % total;
      return {
        item: items[idx],
        index: idx,
        offset,
        isCenter: offset === 0,
      };
    });
  };

  const moveDiningGallery = (direction: number) => {
    setActiveDiningGallery(
      (curr) => (curr + direction + diningVisualGalleryImages.length) % diningVisualGalleryImages.length
    );
  };

  const getDiningGalleryWindow = () => {
    const total = diningVisualGalleryImages.length;
    const offsets = [-1, 0, 1];
    return offsets.map((offset) => {
      const idx = (activeDiningGallery + offset + total) % total;
      return {
        item: diningVisualGalleryImages[idx],
        index: idx,
        offset,
        isCenter: offset === 0,
      };
    });
  };

  const toggleOffer2Accordion = (index: number) => {
    setOffer2OpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleOffer3Accordion = (index: number) => {
    setOffer3OpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const navigateToHomeSection = (targetId: string, slideIdx?: number) => {
    setMenuOpen(false);
    if (targetId === "wedding-packages") {
      openWeddingPage();
      return;
    }
    if (targetId === "offer-25-off") {
      openOffer2Page();
      return;
    }
    if (targetId === "offer-35-off") {
      openOffer3Page();
      return;
    }
    if (targetId === "offer-dining-cafe") {
      openOffer4Page();
      return;
    }
    if (targetId === "diwan-mada-dining") {
      openDiningPage();
      return;
    }
    if (targetId === "oz-park-cafe") {
      openCafePage();
      return;
    }
    if (targetId === "meeting-room") {
      openMeetingPage();
      return;
    }
    if (targetId === "stay-at-oz-park") {
      openStayPage();
      return;
    }
    if (activePage !== "home") {
      setActivePage("home");
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${targetId}`);
      }
      setTimeout(() => {
        if (typeof slideIdx === "number") {
          jumpToSignature(slideIdx);
        } else {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 60);
    } else {
      if (typeof slideIdx === "number") {
        jumpToSignature(slideIdx);
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOfferClick = (offer: OfferModalData) => {
    if (offer.id === "wedding-honeymoon") {
      openWeddingPage();
    } else if (offer.id === "up-to-25-off") {
      openOffer2Page();
    } else if (offer.id === "long-stay-offer") {
      openOffer3Page();
    } else if (offer.id === "dining-cafe-offer") {
      openOffer4Page();
    } else {
      setSelectedOfferModal(offer);
    }
  };

  const moveOffers = (direction: number) => {
    const next = (activeOffer + direction + offers.length) % offers.length;
    setActiveOffer(next);
    offersRef.current?.querySelectorAll<HTMLElement>(".offer-card")[next]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const moveWeddingGallery = (direction: number) => {
    setActiveWeddingGallery((curr) => (curr + direction + weddingGallery.length) % weddingGallery.length);
  };

  const moveFullscreenPhoto = (direction: number) => {
    setFullscreenPhotoIndex((curr) => {
      if (curr === null) return null;
      return (curr + direction + weddingGallery.length) % weddingGallery.length;
    });
  };

  const jumpToSignature = (index: number) => {
    const section = signatureRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: sectionTop + (range * index) / (signatureImages.length - 1), behavior: "smooth" });
  };

  const openWhatsAppBooking = (subjectText: string) => {
    const message =
      language === "ar"
        ? `مرحباً فندق أوز بارك، أود الحجز / الاستفسار عن: ${subjectText}`
        : `Hello OZ Park Hotel, I would like to inquire / book: ${subjectText}`;
    window.open(`https://wa.me/966500955877?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  // Compute visible 5-card window for the Atlantis-style folding gallery carousel
  const getFoldingGalleryWindow = () => {
    const total = weddingGallery.length;
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => {
      const idx = (activeWeddingGallery + offset + total) % total;
      return {
        item: weddingGallery[idx],
        index: idx,
        offset,
        isCenter: offset === 0,
      };
    });
  };

  return (
    <main>
      {/* HEADER */}
      <header
        className={`site-header ${
          scrolled || menuOpen || activePage === "stay" || activePage === "room-category"
            ? "is-solid"
            : ""
        }`}
      >
        <div className="header-left-group">
          <button
            className="menu-trigger"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
          {activePage !== "home" && (
            <button
              type="button"
              className="header-back-btn"
              onClick={() => {
                if (activePage === "room-detail") {
                  openRoomCategoryPage(activeCategorySlug);
                } else {
                  navigateToHomeSection("top");
                }
              }}
            >
              <Arrow reverse rtl={isRtl} />{" "}
              {activePage === "room-detail"
                ? language === "ar"
                  ? `العودة إلى ${roomCategoriesPageData[language][activeCategorySlug].shortTitle}`
                  : `Back to ${roomCategoriesPageData[language][activeCategorySlug].shortTitle}`
                : t.backToHome}
            </button>
          )}
        </div>

        <a
          href="#top"
          className="wordmark"
          aria-label="OZ Park Hotel"
          onClick={(e) => {
            e.preventDefault();
            navigateToHomeSection("top");
          }}
        >
          <span>OZ</span> PARK
        </a>

        <div className="header-actions">
          <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={t.switchLanguage}>
            {t.languageButton}
          </button>
          <a
            className="book-link"
            href="#stay"
            onClick={(e) => {
              e.preventDefault();
              if (activePage === "wedding") {
                document.getElementById("wedding-packages-section")?.scrollIntoView({ behavior: "smooth" });
              } else if (activePage === "offer2") {
                document.getElementById("offer2-details")?.scrollIntoView({ behavior: "smooth" });
              } else {
                navigateToHomeSection("stay");
              }
            }}
          >
            {t.bookYourStay}
          </a>
        </div>
      </header>

      {/* FULL-SCREEN MENU PANEL */}
      <div className={`menu-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label={t.openMenu}>
          {t.nav.map(([label, target], index) => (
            <a
              key={`${target}-${index}`}
              href={`#${target}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToHomeSection(target);
              }}
            >
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="menu-meta">
          <p>{t.tagline}</p>
          <p>{t.addressText}</p>
          <a href="tel:+966500955877">+966 50 095 5877</a>
          <a href="mailto:info@ozpark.sa">info@ozpark.sa</a>
          <a href="mailto:reservations@ozpark.sa">reservations@ozpark.sa</a>
        </div>
      </div>

      {activePage === "home" ? (
        <>
          {/* SECTION 1 — HERO / MAIN BANNER (Centered Heading & Subtitle + Full-Screen Video) */}
          <section className="hero" id="top" aria-label="OZ Park Hotel">
            <video
              ref={heroVideoRef}
              className="hero-video"
              src="/images/ozpark/hero-video.mp4"
              poster="/images/ozpark/hero-poster.jpg"
              autoPlay
              loop
              muted={!soundOn}
              playsInline
              preload="auto"
              aria-label={t.heroAlt}
            />
            <div className="hero-shade" />
            <div className="hero-copy hero-copy-centered reveal">
              <p className="eyebrow light">{t.heroEyebrow}</p>
              <h1>{t.heroTitle}</h1>
              <p className="hero-subtitle">{t.heroSubtitle}</p>
              <div className="hero-cta-row">
                <a href="#stay" className="hero-book-btn">
                  {t.bookYourStay}
                </a>
              </div>
            </div>
            <button className="sound-control" type="button" onClick={() => setSoundOn((on) => !on)}>
              <span className={`sound-bars ${soundOn ? "is-active" : ""}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {soundOn ? t.soundOn : t.soundOff}
            </button>
          </section>

          {/* SECTION 2 — HAPPENING NOW (Directly Below Hero — Card 1 Opens Full Wedding Packages Page) */}
          <section className="happening-now section-pad" id="offers">
            <div className="happening-intro">
              <p className="eyebrow">{t.happeningEyebrow}</p>
              <h2>{t.happeningTitle}</h2>
              <p>{t.happeningCopy}</p>
              <div className="offer-controls">
                <button type="button" onClick={() => moveOffers(-1)} aria-label={t.previousOffer}>
                  <Arrow reverse rtl={isRtl} />
                </button>
                <span>
                  0{activeOffer + 1} / 0{offers.length}
                </span>
                <button type="button" onClick={() => moveOffers(1)} aria-label={t.nextOffer}>
                  <Arrow rtl={isRtl} />
                </button>
              </div>
            </div>
            <div className="offers-viewport">
              <div className="offers-track" ref={offersRef}>
                {offers.map((offer, index) => (
                  <article
                    className="offer-card"
                    key={`${language}-${offer.id}`}
                    onMouseEnter={() => setActiveOffer(index)}
                  >
                    <div
                      className="offer-image-wrap"
                      onClick={() => handleOfferClick(offer)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={offer.image} alt={offer.title} />
                    </div>
                    <div className="offer-card-copy">
                      <p className="eyebrow">{offer.category}</p>
                      <h3>{offer.title}</h3>
                      <p>{offer.copy}</p>
                      <button type="button" className="link-btn" onClick={() => handleOfferClick(offer)}>
                        {offer.cta} <Arrow rtl={isRtl} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3 — DISCOVER OZ PARK / EXPERIENCE SLIDER (5 Full-Width Slides) */}
          <section className="discover-section" id="signature">
            <div className="signature-carousel" ref={signatureRef} aria-label={t.signatureLabel}>
              <div className="signature-stage">
                {slides.map((slide, index) => {
                  const state = index === signatureSlide ? "is-active" : index < signatureSlide ? "is-past" : "is-next";
                  return (
                    <article
                      className={`signature-slide ${state}`}
                      key={`${language}-${slide.id}`}
                      aria-hidden={index !== signatureSlide}
                    >
                      <img src={slide.image} alt={slide.title} />
                      <div className="signature-shade" />
                      <div className="signature-copy">
                        <p>{slide.category}</p>
                        <h2>{slide.title}</h2>
                        <span>{slide.copy}</span>
                        {slide.comingSoon ? (
                          <div className="coming-soon-pill">{slide.ctaLabel}</div>
                        ) : (
                          <button
                            type="button"
                            className="signature-cta-btn"
                            tabIndex={index === signatureSlide ? 0 : -1}
                            onClick={() => {
                              if (slide.id === "oz-park-hotel") {
                                openStayPage();
                              } else if (slide.id === "diwan-mada-restaurant") {
                                openDiningPage();
                              } else if (slide.id === "oz-park-cafe") {
                                openCafePage();
                              } else if (slide.id === "meeting-room") {
                                openMeetingPage();
                              } else {
                                setSelectedSlideModal(slide);
                              }
                            }}
                          >
                            {slide.ctaLabel}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
                <div className="signature-progress" aria-label={t.signatureLabel}>
                  <span className="signature-count">0{signatureSlide + 1}</span>
                  <div className="signature-rail">
                    {slides.map((slide, index) => (
                      <button
                        type="button"
                        className={index === signatureSlide ? "is-active" : ""}
                        key={`${language}-${slide.id}`}
                        onClick={() => jumpToSignature(index)}
                        aria-label={`${slide.category}: ${slide.title}`}
                        aria-current={index === signatureSlide ? "true" : undefined}
                      />
                    ))}
                  </div>
                  <span className="signature-total">0{slides.length}</span>
                </div>
                <p className="signature-scroll-note">{t.scrollToExplore}</p>
              </div>
            </div>
          </section>

          {/* SECTION 4 — STAY / ACCOMMODATION (3 Large Cards: Rooms, Studios, Suites — No Room Prices on Homepage) */}
          <section className="stay-section section-pad" id="stay">
            <div className="stay-header">
              <p className="eyebrow">{t.stayEyebrow}</p>
              <h2>{t.stayTitle}</h2>
              <p className="stay-intro-copy">{t.stayCopy}</p>
            </div>

            <div className="stay-cards-grid">
              {categories.map((cat) => {
                const catSlug = (cat.id === "rooms" || cat.id === "studios" || cat.id === "suites"
                  ? cat.id
                  : "rooms") as RoomCategorySlug;
                return (
                  <article className="stay-card" key={`${language}-${cat.id}`}>
                    <div
                      className="stay-card-image"
                      onClick={() => openRoomCategoryPage(catSlug)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={cat.image} alt={cat.title} />
                    </div>
                    <div className="stay-card-body">
                      <p className="eyebrow">{cat.category}</p>
                      <h3>{cat.title}</h3>
                      <p>{cat.description}</p>
                      <div className="as-package-card-actions" style={{ marginTop: "20px" }}>
                        <button
                          type="button"
                          className="as-package-book-btn"
                          onClick={() => openWhatsAppBooking(cat.title)}
                        >
                          {language === "ar" ? "احجز" : "Book"}
                        </button>
                        <button
                          type="button"
                          className="as-package-explore-link"
                          onClick={() => openRoomCategoryPage(catSlug)}
                        >
                          {language === "ar" ? "استكشف" : "Explore"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : activePage === "wedding" ? (
        /* ============================================================================
           DEDICATED WEDDING & HONEYMOON PACKAGES PAGE
           Modeled 1:1 on Atlantis Celebration Page + Official 7-Section PDF
           ============================================================================ */
        <div className="atlantis-wedding-page" id="wedding-top">
          {/* SECTION 1 — HERO BANNER (Full-width wedding-room photo, ONLY small heading & main title) */}
          <section className="aw-hero" aria-label={t.weddingHeroMain}>
            <img
              src="/images/ozpark/wedding-img-0330.jpg"
              alt={t.weddingHeroMain}
              className="aw-hero-img"
            />
            <div className="aw-hero-shade" />
            <div className="aw-hero-center">
              <span className="aw-overline aw-overline-light">{t.weddingHeroSmall}</span>
              <h1 className="aw-hero-title">{t.weddingHeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — INTRODUCTION & EXPERIENCE
              Atlantis feature-cards-widget 3-Column Staggered Layout:
              Left: 405x540 (3:4) Video | Middle: 294x392 (3:4) Photo aligned bottom | Right: Text */}
          <section className="aw-feature-split" id="wedding-experience">
            <div className="aw-feature-container">
              <div className="aw-feature-media-pair">
                <div className="aw-feature-primary-media">
                  <video
                    ref={weddingVideoRef}
                    src="/images/ozpark/wedding-video.mp4"
                    poster="/images/ozpark/wedding-video-poster.jpg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
                <div className="aw-feature-secondary-media">
                  <img
                    src="/images/ozpark/wedding-img-0328.jpg"
                    alt={t.weddingIntroMain}
                  />
                </div>
              </div>

              <div className="aw-feature-text-col">
                <span className="aw-overline">{t.weddingIntroSmall}</span>
                <h2 className="aw-section-h3">{t.weddingIntroMain}</h2>
                <p className="aw-body-copy">{t.weddingIntroDesc1}</p>
                <p className="aw-body-copy">{t.weddingIntroDesc2}</p>
              </div>
            </div>
          </section>

          {/* SECTION 3 — WEDDING NIGHT PACKAGES
              Atlantis card-carousel Layout: Centered Heading + 4 Portrait (4:5) Package Cards */}
          <section className="aw-packages-section" id="wedding-packages-section">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.weddingPackagesSmall}</span>
              <h2 className="aw-section-h3">{t.weddingPackagesMain}</h2>
              <p className="aw-centered-lead">{t.weddingPackagesIntro}</p>
            </div>

            <div className="aw-packages-grid" ref={weddingPackagesTrackRef}>
              {weddingPackages.map((pkg) => (
                <article className="aw-package-card" key={`${language}-${pkg.id}`}>
                  <div className="aw-package-img-wrap">
                    <img src={pkg.image} alt={pkg.name} />
                    <span className="aw-package-num">{pkg.numberLabel}</span>
                    {pkg.badge && <span className="aw-popular-badge">{pkg.badge}</span>}
                  </div>

                  <div className="aw-package-body">
                    <p className="aw-package-tier">{pkg.tier}</p>
                    <h3 className="aw-package-title">{pkg.name}</h3>
                    <p className="aw-package-desc">{pkg.description}</p>

                    <div className="aw-package-inclusions">
                      <h4>{pkg.includedTitle}</h4>
                      <ul>
                        {pkg.included.map((inc) => (
                          <li key={inc}>{inc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="aw-package-pricing">
                      <span className="aw-price-label">{pkg.priceLabel}</span>
                      <strong className="aw-price-value">{pkg.price}</strong>
                      <p className="aw-price-note">{pkg.priceNote}</p>
                    </div>

                    <button
                      type="button"
                      className="aw-whatsapp-btn"
                      onClick={() => openWhatsAppBooking(pkg.whatsappSubject)}
                    >
                      {pkg.cta}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SECTION 4 — WHATSAPP INQUIRY
              Atlantis feature-cards-widget ("Stay at Atlantis / The night starts here") Split Layout:
              Large wedding-room photo alongside heading, description & WhatsApp button (No form) */}
          <section className="aw-inquiry-section" id="wedding-inquiry">
            <div className="aw-feature-container">
              <div className="aw-feature-media-pair">
                <div className="aw-feature-primary-media">
                  <img
                    src="/images/ozpark/wedding-romantic-hotel-room-with-red-accents.jpg"
                    alt={t.weddingInquiryMain}
                  />
                </div>
                <div className="aw-feature-secondary-media">
                  <img
                    src="/images/ozpark/wedding-img-0237.jpg"
                    alt={t.weddingHeroMain}
                  />
                </div>
              </div>

              <div className="aw-feature-text-col">
                <span className="aw-overline">{t.weddingInquirySmall}</span>
                <h2 className="aw-section-h3">{t.weddingInquiryMain}</h2>
                <p className="aw-body-copy">{t.weddingInquiryDesc}</p>
                <div className="aw-inquiry-actions">
                  <button
                    type="button"
                    className="aw-whatsapp-btn aw-whatsapp-btn-inline"
                    onClick={() => openWhatsAppBooking(t.weddingInquirySubject)}
                  >
                    {t.weddingInquiryBtn}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 — WEDDING ROOM GALLERY
              Atlantis folding-carousel-widget on warm cream rgb(254, 250, 245) background
              with 2:3 portrait cards, scaled center active card, and full-screen lightbox */}
          <section className="aw-folding-gallery" id="wedding-gallery">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.weddingGallerySmall}</span>
              <h2 className="aw-section-h3">{t.weddingGalleryMain}</h2>
              <p className="aw-centered-lead">{t.weddingGalleryDesc}</p>
            </div>

            <div className="aw-folding-stage">
              <button
                type="button"
                className="aw-folding-nav aw-folding-prev"
                onClick={() => moveWeddingGallery(-1)}
                aria-label={t.weddingGalleryPrev}
              >
                <Arrow reverse rtl={isRtl} />
              </button>

              <div className="aw-folding-track">
                {getFoldingGalleryWindow().map(({ item, index, offset, isCenter }) => (
                  <article
                    key={`${item.src}-${offset}`}
                    className={`aw-folding-card ${isCenter ? "is-center" : ""} offset-${offset}`}
                    onClick={() => {
                      if (isCenter) {
                        setFullscreenPhotoIndex(index);
                      } else {
                        setActiveWeddingGallery(index);
                      }
                    }}
                  >
                    <div className="aw-folding-img-box">
                      <img src={item.src} alt={item.title} />
                      <button
                        type="button"
                        className="aw-fullscreen-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenPhotoIndex(index);
                        }}
                      >
                        {t.weddingGalleryFullscreenBtn}
                      </button>
                    </div>
                    <div className="aw-folding-caption">
                      <h4>{item.title}</h4>
                      <p>{item.caption}</p>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="aw-folding-nav aw-folding-next"
                onClick={() => moveWeddingGallery(1)}
                aria-label={t.weddingGalleryNext}
              >
                <Arrow rtl={isRtl} />
              </button>
            </div>

            <div className="aw-folding-dots">
              {weddingGallery.map((g, idx) => (
                <button
                  key={g.src}
                  type="button"
                  className={idx === activeWeddingGallery ? "is-active" : ""}
                  onClick={() => setActiveWeddingGallery(idx)}
                  aria-label={g.title}
                />
              ))}
            </div>
          </section>

          {/* SECTION 6 — SIGNATURE RESTAURANT EXPERIENCE
              Atlantis section-banner (1350 x 579 inset panoramic restaurant frame) */}
          <section className="aw-restaurant-banner-section" id="wedding-dining">
            <div className="aw-restaurant-banner-frame">
              <img
                src="/images/ozpark/slider-restaurant.jpg"
                alt={t.weddingDiningMain}
                className="aw-restaurant-banner-img"
              />
              <div className="aw-restaurant-banner-shade" />
              <div className="aw-restaurant-banner-copy">
                <span className="aw-overline aw-overline-light">{t.weddingDiningSmall}</span>
                <h2 className="aw-restaurant-title">{t.weddingDiningMain}</h2>
                <p>{t.weddingDiningDesc1}</p>
                <p>{t.weddingDiningDesc2}</p>
                <a
                  href="https://diwanmada.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aw-banner-cta"
                >
                  {t.weddingDiningBtn}
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "offer2" ? (
        /* ============================================================================
           DEDICATED OFFER 2 PAGE — UP TO 25% OFF GROUND-FLOOR ROOMS
           Modeled 1:1 on Atlantis Offer Page + Official 7-Section PDF
           ============================================================================ */
        <div className="atlantis-offer-page" id="offer2-top">
          {/* SECTION 1 — HERO BANNER (Full-width 4K ground-floor room photo, ONLY small heading & main title) */}
          <section className="ao-hero" aria-label={t.offer2HeroMain}>
            <img
              src="/images/ozpark/offer2-hero-4k.jpg"
              alt={t.offer2HeroMain}
              className="ao-hero-img"
            />
            <div className="ao-hero-shade" />
            <div className="ao-hero-center">
              <span className="ao-overline ao-overline-light">{t.offer2HeroSmall}</span>
              <h1 className="ao-hero-title">{t.offer2HeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — OFFER DETAILS (Two-column layout separated by a thin vertical line) */}
          <section className="ao-details-section" id="offer2-details">
            <div className="ao-container">
              <div className="ao-details-grid">
                <div className="ao-details-left">
                  <h2 className="ao-h4">{t.offer2DetailsTitle}</h2>
                  <p className="ao-lead-copy">{t.offer2DetailsDesc}</p>
                  <p className="ao-weekday-note">{t.offer2WeekdayNote}</p>
                  <div className="ao-cta-wrap">
                    <button
                      type="button"
                      className="ao-whatsapp-btn"
                      onClick={() => openWhatsAppBooking(t.offer2WhatsappSubject)}
                    >
                      {t.offer2BookBtn}
                    </button>
                  </div>
                </div>

                <div className="ao-details-divider" aria-hidden="true" />

                <div className="ao-details-right">
                  <div className="ao-date-block">
                    <h3 className="ao-h4">{t.offer2BookingDatesTitle}</h3>
                    <p>{t.offer2BookingDatesText}</p>
                  </div>
                  <div className="ao-date-block">
                    <h3 className="ao-h4">{t.offer2StayDatesTitle}</h3>
                    <p>{t.offer2StayDatesText}</p>
                  </div>
                </div>
              </div>

              {/* 4-CARD HIGH-RESOLUTION GROUND-FLOOR ROOMS & SEA-VIEW SHOWCASE */}
              <div className="ao-showcase-grid">
                {offer2Showcase.map((card) => (
                  <article
                    key={card.src}
                    className="ao-showcase-card"
                    onClick={() =>
                      setOffer2Lightbox({
                        src: card.src,
                        title: card.title,
                        caption: card.caption,
                      })
                    }
                  >
                    <div className="ao-showcase-img-wrap">
                      <img src={card.src} alt={card.title} />
                      <span className="ao-showcase-badge">{card.badge}</span>
                    </div>
                    <div className="ao-showcase-body">
                      <h4>{card.title}</h4>
                      <p>{card.caption}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* SECTIONS 3 TO 6 — FOUR COLLAPSIBLE ACCORDIONS (With thin top/bottom divider lines, small bullets & high-res visuals) */}
          <section className="ao-accordions-section" id="offer2-accordions">
            <div className="ao-container">
              <div className="ao-accordion-list">
                {offer2Accordions.map((acc, index) => {
                  const isOpen = Boolean(offer2OpenAccordions[index]);
                  return (
                    <div
                      key={acc.id}
                      className={`ao-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="ao-accordion-trigger"
                        onClick={() => toggleOffer2Accordion(index)}
                        aria-expanded={isOpen}
                      >
                        <span className="ao-accordion-title">{acc.title}</span>
                        <span className="ao-accordion-chevron" aria-hidden="true">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>

                      <div
                        className="ao-accordion-panel"
                        hidden={!isOpen}
                      >
                        <ul className="ao-bullet-list">
                          {acc.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>

                        {acc.images && acc.images.length > 0 && (
                          <div className="ao-accordion-gallery">
                            {acc.images.map((img) => (
                              <figure
                                key={img.src}
                                className="ao-accordion-figure"
                                onClick={() =>
                                  setOffer2Lightbox({
                                    src: img.src,
                                    title: acc.title,
                                    caption: img.caption,
                                  })
                                }
                              >
                                <div className="ao-accordion-img-box">
                                  <img src={img.src} alt={img.caption} />
                                </div>
                                <figcaption>{img.caption}</figcaption>
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "offer3" ? (
        /* ============================================================================
           DEDICATED OFFER 3 PAGE — UP TO 35% OFF EXTENDED STAYS
           Modeled 1:1 on Atlantis Offer Page + Official 7-Section PDF
           ============================================================================ */
        <div className="atlantis-offer-page" id="offer3-top">
          {/* SECTION 1 — HERO BANNER (Full-width 4K sea-view suite/extended-stay photo, ONLY small heading & main title) */}
          <section className="ao-hero" aria-label={t.offer3HeroMain}>
            <img
              src="/images/ozpark/offer2-room-seaview-4k.jpg"
              alt={t.offer3HeroMain}
              className="ao-hero-img"
            />
            <div className="ao-hero-shade" />
            <div className="ao-hero-center">
              <span className="ao-overline ao-overline-light">{t.offer3HeroSmall}</span>
              <h1 className="ao-hero-title">{t.offer3HeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — OFFER DETAILS (Two-column layout separated by a thin vertical line) */}
          <section className="ao-details-section" id="offer3-details">
            <div className="ao-container">
              <div className="ao-details-grid">
                <div className="ao-details-left">
                  <h2 className="ao-h4">{t.offer3DetailsTitle}</h2>
                  <p className="ao-lead-copy">{t.offer3DetailsDesc}</p>
                  <p className="ao-weekday-note">{t.offer3WeekdayNote}</p>
                  <div className="ao-cta-wrap">
                    <button
                      type="button"
                      className="ao-whatsapp-btn"
                      onClick={() => navigateToHomeSection("stay")}
                    >
                      {t.offer3BookBtn}
                    </button>
                  </div>
                </div>

                <div className="ao-details-divider" aria-hidden="true" />

                <div className="ao-details-right">
                  <div className="ao-date-block">
                    <h3 className="ao-h4">{t.offer3BookingDatesTitle}</h3>
                    <p>{t.offer3BookingDatesText}</p>
                  </div>
                  <div className="ao-date-block">
                    <h3 className="ao-h4">{t.offer3StayDatesTitle}</h3>
                    <p>{t.offer3StayDatesText}</p>
                  </div>
                </div>
              </div>

              {/* 4-CARD HIGH-RESOLUTION EXTENDED-STAY SHOWCASE (SUITES, STUDIOS, ROOMS & WATERFRONT) */}
              <div className="ao-showcase-grid">
                {offer3Showcase.map((card) => (
                  <article
                    key={card.src}
                    className="ao-showcase-card"
                    onClick={() =>
                      setOffer2Lightbox({
                        src: card.src,
                        title: card.title,
                        caption: card.caption,
                      })
                    }
                  >
                    <div className="ao-showcase-img-wrap">
                      <img src={card.src} alt={card.title} />
                      <span className="ao-showcase-badge">{card.badge}</span>
                    </div>
                    <div className="ao-showcase-body">
                      <h4>{card.title}</h4>
                      <p>{card.caption}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* SECTIONS 3 TO 6 — FOUR COLLAPSIBLE ACCORDIONS (With thin top/bottom divider lines, small bullets & high-res visuals) */}
          <section className="ao-accordions-section" id="offer3-accordions">
            <div className="ao-container">
              <div className="ao-accordion-list">
                {offer3Accordions.map((acc, index) => {
                  const isOpen = Boolean(offer3OpenAccordions[index]);
                  return (
                    <div
                      key={acc.id}
                      className={`ao-accordion-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="ao-accordion-trigger"
                        onClick={() => toggleOffer3Accordion(index)}
                        aria-expanded={isOpen}
                      >
                        <span className="ao-accordion-title">{acc.title}</span>
                        <span className="ao-accordion-chevron" aria-hidden="true">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>

                      <div
                        className="ao-accordion-panel"
                        hidden={!isOpen}
                      >
                        <ul className="ao-bullet-list">
                          {acc.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>

                        {acc.images && acc.images.length > 0 && (
                          <div className="ao-accordion-gallery">
                            {acc.images.map((img) => (
                              <figure
                                key={img.src}
                                className="ao-accordion-figure"
                                onClick={() =>
                                  setOffer2Lightbox({
                                    src: img.src,
                                    title: acc.title,
                                    caption: img.caption,
                                  })
                                }
                              >
                                <div className="ao-accordion-img-box">
                                  <img src={img.src} alt={img.caption} />
                                </div>
                                <figcaption>{img.caption}</figcaption>
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "offer4" ? (
        /* ============================================================================
           DEDICATED OFFER 4 PAGE — 10% OFF DINING & CAFÉ EXPERIENCES
           Modeled 1:1 on Atlantis Reference + Official 6-Section PDF
           ============================================================================ */
        <div className="atlantis-offer4-page" id="offer4-top">
          {/* SECTION 1 — HERO BANNER (Full-width Diwan Mada Restaurant panoramic Red Sea view, ONLY small heading & main title) */}
          <section className="ao-hero" aria-label={t.offer4HeroMain}>
            <img
              src="/images/ozpark/offer4-hero-diwan-4k.jpg"
              alt={t.offer4HeroMain}
              className="ao-hero-img"
            />
            <div className="ao-hero-shade" />
            <div className="ao-hero-center">
              <span className="ao-overline ao-overline-light">{t.offer4HeroSmall}</span>
              <h1 className="ao-hero-title">{t.offer4HeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — INTRODUCTION (Warm beige background, centered paragraph, no heading or button) */}
          <section className="ao4-intro-section" id="offer4-intro">
            <div className="ao4-intro-inner">
              <p className="ao4-intro-copy">{t.offer4IntroP1}</p>
              <p className="ao4-intro-copy">
                {t.offer4IntroP2Prefix}
                <strong>{t.offer4IntroP2Bold}</strong>
                {t.offer4IntroP2Suffix}
              </p>
            </div>
          </section>

          {/* SECTION 3 — DINING EXPERIENCES (Two large portrait image cards side by side on desktop) */}
          <section className="ao4-dining-section" id="offer4-dining">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.offer4DiningSmall}</span>
              <h2 className="aw-section-h3">{t.offer4DiningMain}</h2>
              <p className="aw-centered-lead">{t.offer4DiningSubtitle}</p>
            </div>

            <div className="ao4-dining-grid">
              {/* CARD 01 — DIWAN MADA RESTAURANT */}
              <article className="ao4-venue-card">
                <div
                  className="ao4-venue-img-wrap"
                  onClick={() =>
                    setOffer2Lightbox({
                      src: "/images/ozpark/offer4-diwan-day-4k.jpg",
                      title: t.offer4Card1Title,
                      caption: t.offer4Card1Desc,
                    })
                  }
                >
                  <img
                    src="/images/ozpark/offer4-diwan-day-4k.jpg"
                    alt={t.offer4Card1Title}
                  />
                  <span className="ao4-discount-pill">{t.offer4Card1Benefit}</span>
                </div>
                <div className="ao4-venue-body">
                  <span className="ao4-venue-category">{t.offer4Card1Category}</span>
                  <h3 className="ao4-venue-title">{t.offer4Card1Title}</h3>
                  <p className="ao4-venue-desc">{t.offer4Card1Desc}</p>
                  <p className="ao4-venue-benefit">{t.offer4Card1Benefit}</p>
                  <a
                    href="https://diwanmada.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ao4-venue-btn"
                  >
                    {t.offer4Card1Btn}
                  </a>
                </div>
              </article>

              {/* CARD 02 — OZ PARK CAFÉ */}
              <article className="ao4-venue-card">
                <div
                  className="ao4-venue-img-wrap"
                  onClick={() =>
                    setOffer2Lightbox({
                      src: "/images/ozpark/offer4-cafe-4k.jpg",
                      title: t.offer4Card2Title,
                      caption: t.offer4Card2Desc,
                    })
                  }
                >
                  <img
                    src="/images/ozpark/offer4-cafe-4k.jpg"
                    alt={t.offer4Card2Title}
                  />
                  <span className="ao4-discount-pill">{t.offer4Card2Benefit}</span>
                </div>
                <div className="ao4-venue-body">
                  <span className="ao4-venue-category">{t.offer4Card2Category}</span>
                  <h3 className="ao4-venue-title">{t.offer4Card2Title}</h3>
                  <p className="ao4-venue-desc">{t.offer4Card2Desc}</p>
                  <p className="ao4-venue-benefit">{t.offer4Card2Benefit}</p>
                  <button
                    type="button"
                    className="ao4-venue-btn"
                    onClick={openCafePage}
                  >
                    {t.offer4Card2Btn}
                  </button>
                </div>
              </article>
            </div>
          </section>

          {/* SECTION 4 — STAY AT OZ PARK HOTEL (Atlantis "The Night Starts Here" Staggered Dual-Photo Layout) */}
          <section className="aw-feature-split ao4-stay-section" id="offer4-stay">
            <div className="aw-feature-container">
              <div className="aw-feature-media-pair">
                <div
                  className="aw-feature-primary-media"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOffer2Lightbox({
                      src: "/images/ozpark/offer4-diwan-portrait-hd.jpg",
                      title: t.offer4Card1Title,
                      caption: t.offer4Card1Desc,
                    })
                  }
                >
                  <img
                    src="/images/ozpark/offer4-diwan-portrait-hd.jpg"
                    alt={t.offer4Card1Title}
                  />
                </div>
                <div
                  className="aw-feature-secondary-media"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOffer2Lightbox({
                      src: "/images/ozpark/offer2-hero-4k.jpg",
                      title: t.offer4StayMain,
                      caption: t.offer4StayDesc,
                    })
                  }
                >
                  <img
                    src="/images/ozpark/offer2-hero-4k.jpg"
                    alt={t.offer4StayMain}
                  />
                </div>
              </div>

              <div className="aw-feature-text-col">
                <span className="aw-overline">{t.offer4StaySmall}</span>
                <h2 className="aw-section-h3">{t.offer4StayMain}</h2>
                <p className="aw-body-copy">{t.offer4StayDesc}</p>
                <div className="aw-inquiry-actions">
                  <button
                    type="button"
                    className="ao-whatsapp-btn"
                    onClick={() => navigateToHomeSection("stay")}
                  >
                    {t.offer4StayBtn}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 — FEATURED STAY OFFER (Full-width sea-view suite banner with bottom-left copy & outlined Explore button) */}
          <section className="ao4-promo-banner-section" id="offer4-promo">
            <div className="ao4-promo-banner-frame">
              <img
                src="/images/ozpark/offer2-room-seaview-4k.jpg"
                alt={t.offer4PromoMain}
                className="ao4-promo-banner-img"
              />
              <div className="ao4-promo-banner-shade" />
              <div className="ao4-promo-banner-copy">
                <span className="ao-overline ao-overline-light">{t.offer4PromoSmall}</span>
                <h2 className="ao4-promo-title">{t.offer4PromoMain}</h2>
                <p className="ao4-promo-desc">{t.offer4PromoDesc}</p>
                <button
                  type="button"
                  className="ao4-promo-outline-btn"
                  onClick={openOffer3Page}
                >
                  {t.offer4PromoBtn}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "dining" ? (
        /* ============================================================================
           DEDICATED DIWAN MADA RESTAURANT PAGE (#diwan-mada-dining)
           Modeled 1:1 on Atlantis Dining Page + Official 6-Section PDF + User Screenshots
           ============================================================================ */
        <div className="atlantis-dining-page" id="dining-top">
          {/* SECTION 1 — HERO BANNER (Full-screen cinematic video of Diwan Mada Restaurant, ONLY small heading & main title in white) */}
          <section className="ad-hero" aria-label={t.diningHeroMain}>
            <video
              ref={diningVideoRef}
              className="ad-hero-video"
              src="/images/ozpark/dining-hero-video.mp4"
              poster="/images/ozpark/dining-hero-poster-4k.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            <div className="ad-hero-shade" />
            <div className="ad-hero-center">
              <span className="aw-overline aw-overline-light">{t.diningHeroSmall}</span>
              <h1 className="ad-hero-title">{t.diningHeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — RESTAURANT INTRODUCTION (Warm cream background, centered heading, description, and button to diwanmada.com) */}
          <section className="ad-intro-section" id="dining-intro">
            <div className="ad-intro-inner">
              <span className="aw-overline">{t.diningIntroSmall}</span>
              <h2 className="aw-section-h3 ad-intro-title">{t.diningIntroMain}</h2>
              <p className="ad-intro-copy">{t.diningIntroP1}</p>
              <p className="ad-intro-copy">{t.diningIntroP2}</p>
              <div className="ad-intro-actions">
                <a
                  href="https://diwanmada.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-primary-btn"
                >
                  {t.diningIntroBtn}
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 3 — EXPLORE OUR MENU (7 Food-Category Cards: 4 in Row 1 + 3 in Row 2 on wide desktop) */}
          <section className="ad-menu-section" id="dining-menu">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.diningMenuSmall}</span>
              <h2 className="aw-section-h3">{t.diningMenuMain}</h2>
              <p className="aw-centered-lead">{t.diningMenuDesc1}</p>
              <p className="aw-centered-lead ad-lead-secondary">{t.diningMenuDesc2}</p>
            </div>

            <div className="ad-menu-grid">
              {diningMenuCategories.map((cat) => (
                <article className="ad-menu-card" key={`${language}-${cat.id}`}>
                  <div
                    className="ad-menu-img-wrap"
                    onClick={() =>
                      setOffer2Lightbox({
                        src: cat.image,
                        title: cat.title,
                        caption: cat.description,
                      })
                    }
                  >
                    <img src={cat.image} alt={cat.title} />
                    <span className="ad-menu-num">{cat.numberLabel}</span>
                  </div>
                  <div className="ad-menu-body">
                    <span className="ad-menu-category">{cat.category}</span>
                    <h3 className="ad-menu-title">{cat.title}</h3>
                    <p className="ad-menu-desc">{cat.description}</p>
                    <div className="ad-menu-dishes">
                      <span className="ad-dishes-label">{t.diningFeaturedDishesLabel}</span>
                      <ul>
                        {cat.featuredDishes.map((dish) => (
                          <li key={dish}>{dish}</li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={cat.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ad-menu-link"
                    >
                      {cat.buttonLabel} <Arrow rtl={isRtl} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SECTION 4 — OUR DINING EXPERIENCES INTRO ("Dine Your Way") + ATLANTIS CENTER-PEEKING VISUAL GALLERY (Per Screenshot 3: NO under-image text/buttons) */}
          <section className="ad-experiences-intro-section" id="dining-experiences-intro">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.diningExpIntroSmall}</span>
              <h2 className="aw-section-h3">{t.diningExpIntroMain}</h2>
              <p className="aw-centered-lead">{t.diningExpIntroDesc1}</p>
              <p className="aw-centered-lead ad-lead-secondary">{t.diningExpIntroDesc2}</p>
            </div>

            <div className="ad-peeking-gallery">
              <button
                type="button"
                className="ad-peeking-nav ad-peeking-prev"
                onClick={() => moveDiningGallery(-1)}
                aria-label={t.weddingGalleryPrev}
              >
                <Arrow reverse rtl={isRtl} />
              </button>

              <div className="ad-peeking-track">
                {getDiningGalleryWindow().map(({ item, index, offset, isCenter }) => (
                  <div
                    key={`${item.src}-${offset}`}
                    className={`ad-peeking-slide ${isCenter ? "is-center" : ""} offset-${offset}`}
                    onClick={() => {
                      if (isCenter) {
                        setOffer2Lightbox({
                          src: item.src,
                          title: isRtl ? item.altAr : item.altEn,
                        });
                      } else {
                        setActiveDiningGallery(index);
                      }
                    }}
                  >
                    <img src={item.src} alt={isRtl ? item.altAr : item.altEn} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="ad-peeking-nav ad-peeking-next"
                onClick={() => moveDiningGallery(1)}
                aria-label={t.weddingGalleryNext}
              >
                <Arrow rtl={isRtl} />
              </button>
            </div>

            <div className="ad-peeking-dots">
              {diningVisualGalleryImages.map((img, idx) => (
                <button
                  key={img.src}
                  type="button"
                  className={idx === activeDiningGallery ? "is-active" : ""}
                  onClick={() => setActiveDiningGallery(idx)}
                  aria-label={isRtl ? img.altAr : img.altEn}
                />
              ))}
            </div>
          </section>

          {/* SECTION 5 — DINING EXPERIENCES SPLIT-SCREEN SLIDER (3 Interactive Tabs: BREAKFAST BUFFET, DINNER BUFFET, À LA CARTE) */}
          <section className="ad-split-slider-section" id="dining-experiences-slider">
            {(() => {
              const currentSlide = diningExperiencesSlides[activeDiningExpTab];
              const activeImgSrc =
                currentSlide.secondaryImage && activeAlacarteView === "room"
                  ? currentSlide.secondaryImage
                  : currentSlide.image;
              return (
                <div className="ad-split-container">
                  <div className="ad-split-main">
                    <div className="ad-split-copy">
                      <span className="aw-overline">{currentSlide.smallHeading}</span>
                      <h2 className="ad-split-title">{currentSlide.mainHeading}</h2>
                      {currentSlide.description.map((para, idx) => (
                        <p key={idx} className="ad-split-desc">
                          {para}
                        </p>
                      ))}

                      {currentSlide.secondaryImage && (
                        <div className="ad-alacarte-switcher">
                          <button
                            type="button"
                            className={`ad-switch-pill ${activeAlacarteView === "restaurant" ? "is-active" : ""}`}
                            onClick={() => setActiveAlacarteView("restaurant")}
                          >
                            {currentSlide.primaryBadge}
                          </button>
                          <button
                            type="button"
                            className={`ad-switch-pill ${activeAlacarteView === "room" ? "is-active" : ""}`}
                            onClick={() => setActiveAlacarteView("room")}
                          >
                            {currentSlide.secondaryBadge}
                          </button>
                        </div>
                      )}

                      <div className="ad-split-cta-wrap">
                        <a
                          href={currentSlide.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ad-primary-btn"
                        >
                          {currentSlide.buttonLabel}
                        </a>
                      </div>
                    </div>

                    <div
                      className="ad-split-media"
                      onClick={() =>
                        setOffer2Lightbox({
                          src: activeImgSrc,
                          title: currentSlide.mainHeading,
                          caption: currentSlide.description[0],
                        })
                      }
                    >
                      <img src={activeImgSrc} alt={currentSlide.mainHeading} key={activeImgSrc} />
                    </div>
                  </div>

                  <div className="ad-split-tabs" role="tablist">
                    {diningExperiencesSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === activeDiningExpTab}
                        className={`ad-split-tab ${idx === activeDiningExpTab ? "is-active" : ""}`}
                        onClick={() => setActiveDiningExpTab(idx)}
                      >
                        <span className="ad-tab-num">0{idx + 1}</span>
                        <span className="ad-tab-label">{slide.tabLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>
        </div>
      ) : activePage === "cafe" ? (
        /* ============================================================================
           DEDICATED OZ PARK CAFÉ PAGE (#oz-park-cafe)
           Modeled 1:1 on Atlantis Lost World Reference + Official 5-Section PDF
           ============================================================================ */
        <div className="atlantis-cafe-page" id="cafe-top">
          {/* SECTION 1 — HERO BANNER (Full-screen cinematic photograph of OZ Park Café, ONLY small heading & main title in white) */}
          <section className="ac-hero" aria-label={t.cafeHeroMain}>
            <img
              src="/images/ozpark/cafe-hero-4k.jpg"
              alt={t.cafeHeroMain}
              className="ac-hero-img"
            />
            <div className="ac-hero-shade" />
            <div className="ac-hero-center">
              <span className="aw-overline aw-overline-light">{t.cafeHeroSmall}</span>
              <h1 className="ad-hero-title">{t.cafeHeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — CAFÉ INTRODUCTION & INFORMATION (Two-column Atlantis list-banner layout separated by a subtle vertical line) */}
          <section className="ac-intro-info-section" id="cafe-intro">
            <div className="ao-container">
              <div className="ac-intro-info-grid">
                {/* LEFT SIDE — INTRODUCTION */}
                <div className="ac-intro-left">
                  <span className="aw-overline">{t.cafeIntroSmall}</span>
                  <h2 className="aw-section-h3 ac-intro-heading">{t.cafeIntroMain}</h2>
                  <p className="ac-intro-copy">{t.cafeIntroP1}</p>
                  <p className="ac-intro-copy">{t.cafeIntroP2}</p>
                </div>

                {/* VERTICAL DIVIDER */}
                <div className="ac-intro-divider" aria-hidden="true" />

                {/* RIGHT SIDE — CAFÉ INFORMATION (With Atlantis thin-stroke SVG icons) */}
                <div className="ac-info-right">
                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.cafeInfoHoursLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <polyline
                            points="16.85 12.47 12 12.47 12 7.62"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="7.76"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">{t.cafeInfoHoursValue}</p>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.cafeInfoLocationLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12,4.18c-2.98,0-5.39,2.41-5.39,5.39v.09c0,.77.16,1.51.46,2.18l4.23,7.57c.31.55,1.1.55,1.41,0l4.23-7.57c.29-.67.46-1.4.46-2.18v-.09c0-2.98-2.41-5.39-5.39-5.39Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <circle
                            cx="12"
                            cy="9.62"
                            r="2.06"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="ac-info-value">{t.cafeInfoLocationLine1}</p>
                        <p className="ac-info-subvalue">{t.cafeInfoLocationLine2}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.cafeInfoContactLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M18.82,4.7c-1.84-1.84-6.49-.17-10.39,3.73s-5.57,8.55-3.73,10.39l.15.15c1.75,1.75,2.79,1.06,3.85,0l1.07-1.07c.67-.67.67-1.75,0-2.42l-1.01-1.01c-.2-.2-.2-.54,0-.74l.4-.4,4.17-4.17.4-.4c.2-.2.54-.2.74,0l1.01,1.01c.67.67,1.75.67,2.42,0l1.07-1.07c1.06-1.06,1.75-2.1,0-3.85l-.15-.15Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">
                        <a href="tel:+966500955877" dir="ltr">
                          {t.cafeInfoContactValue}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.cafeInfoEmailLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="3.72"
                            y="6.53"
                            width="16.56"
                            height="10.94"
                            rx="0.6"
                            ry="0.6"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <path
                            d="M20.28,6.53l-7.86,7.56c-.23.22-.6.22-.83,0L3.72,6.53"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">
                        <a href="mailto:info@ozpark.sa" dir="ltr">
                          {t.cafeInfoEmailValue}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 — FULL-SCREEN IMMERSIVE VERTICAL WIPE CAROUSEL (1:1 Atlantis Lost World vertical-carousel-widget) */}
          {(() => {
            const totalSlides = cafeMenuSlides.length;
            const maxTransIdx = Math.max(0, totalSlides - 2);
            const baseIdx = Math.min(maxTransIdx, Math.max(0, Math.floor(cafeVerticalProgress)));
            const localPct = Math.min(100, Math.max(0, (cafeVerticalProgress - baseIdx) * 100));
            const activeSegmentIdx = Math.min(
              totalSlides - 1,
              Math.max(0, Math.round(cafeVerticalProgress))
            );
            const thumbPercent =
              totalSlides > 1
                ? Math.min(100, Math.max(0, (cafeVerticalProgress / (totalSlides - 1)) * 100))
                : 0;

            return (
              <section
                ref={cafeVerticalRef}
                className="ac-vcarousel-section"
                style={{ height: `${totalSlides * 100}vh` }}
                aria-label={t.cafeMenuMain}
              >
                <div className="ac-vcarousel-static">
                  {/* Right-hand Vertical Navigation Rail (Up chevron + segmented progress bar + sliding circular thumb + Down chevron) */}
                  <div className="ac-vcarousel-nav">
                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === 0}
                      onClick={() => scrollToCafeVerticalSlide(activeSegmentIdx - 1)}
                      aria-label={t.previousOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6.354 15.354a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L12 9.707l-5.646 5.647z"
                        />
                      </svg>
                    </button>

                    <div className="ac-vcarousel-progress-wrapper">
                      <div className="ac-vcarousel-progress-track">
                        <div className="ac-vcarousel-progress-bars">
                          {cafeMenuSlides.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              className={`ac-vcarousel-progress-segment ${
                                idx === activeSegmentIdx ? "is-active" : ""
                              }`}
                              onClick={() => scrollToCafeVerticalSlide(idx)}
                              aria-label={s.tabLabel}
                            />
                          ))}
                        </div>
                        <div
                          className="ac-vcarousel-thumb"
                          style={{
                            top: `${thumbPercent.toFixed(2)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === totalSlides - 1}
                      onClick={() => scrollToCafeVerticalSlide(activeSegmentIdx + 1)}
                      aria-label={t.nextOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M17.646 8.646a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 .708-.708L12 14.293l5.646-5.647z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Full-Screen Stacked Slides with Exact Atlantis Clip-Path Wipe & Parallax */}
                  {cafeMenuSlides.map((slide, idx) => {
                    let clipPath = "inset(100% 0% 0% 0%)";
                    let zIndex = 1;
                    let display: "block" | "none" = "none";
                    let bgTransform = "translateY(30px)";

                    if (idx === baseIdx) {
                      clipPath = `inset(0% 0% ${localPct.toFixed(2)}% 0%)`;
                      zIndex = 20;
                      display = "block";
                      bgTransform = `translateY(${(-0.3 * localPct).toFixed(2)}px)`;
                    } else if (idx === baseIdx + 1) {
                      clipPath = `inset(${(100 - localPct).toFixed(2)}% 0% 0% 0%)`;
                      zIndex = 10;
                      display = "block";
                      bgTransform = `translateY(${(30 - 0.3 * localPct).toFixed(2)}px)`;
                    }

                    return (
                      <div
                        key={slide.id}
                        className="ac-vcarousel-slide"
                        style={{ clipPath, zIndex, display }}
                      >
                        <div className="ac-vcarousel-slide-bg" style={{ transform: bgTransform }}>
                          <img
                            src={slide.image}
                            alt={slide.mainHeading}
                            className="ac-vcarousel-bg-img"
                          />
                          <div className="ac-vcarousel-bg-overlay" />
                        </div>

                        <div className="ac-vcarousel-text-container">
                          <div className="ac-vcarousel-text-inner">
                            <span className="ac-vcarousel-overline">{slide.smallHeading}</span>
                            <h3 className="ac-vcarousel-heading">{slide.mainHeading}</h3>
                            <p className="ac-vcarousel-desc">{slide.description}</p>
                            <div className="ac-vcarousel-cta-wrap">
                              <button
                                type="button"
                                className="ac-vcarousel-cta"
                                onClick={() => {
                                  setActiveCafeSlide(idx);
                                  cafeMenuRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }}
                              >
                                {slide.buttonLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* SECTION 4 — EXPLORE OUR CAFÉ MENU + ATLANTIS LANDSCAPE FOLDING CAROUSEL (1:1 Atlantis folding-carousel-widget) */}
          <section ref={cafeMenuRef} className="ac-menu-slider-section" id="cafe-menu">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.cafeMenuSmall}</span>
              <h2 className="aw-section-h3">{t.cafeMenuMain}</h2>
              <p className="aw-centered-lead">{t.cafeMenuDesc}</p>
            </div>

            {/* Category Quick-Selector Tabs */}
            <div className="ac-folding-tabs" role="tablist">
              {cafeMenuSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeCafeSlide}
                  className={`ac-folding-tab ${idx === activeCafeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveCafeSlide(idx)}
                >
                  <span className="ac-folding-tab-num">0{idx + 1}</span>
                  <span>{slide.tabLabel}</span>
                </button>
              ))}
            </div>

            {/* Atlantis Landscape Folding Carousel (Center active card 1074x604 at Y=0, adjacent cards 880x495 folded down at Y=48px) */}
            <div className="ac-folding-carousel">
              <div className="ac-folding-stage">
                {cafeMenuSlides.map((slide, idx) => {
                  const total = cafeMenuSlides.length;
                  let diff = idx - activeCafeSlide;
                  if (diff > total / 2) diff -= total;
                  if (diff < -total / 2) diff += total;
                  const dirSign = isRtl ? -1 : 1;
                  const signedDiff = diff * dirSign;

                  const slideState =
                    diff === 0 ? "active" : Math.abs(diff) === 1 ? "adjacent" : "rest";

                  return (
                    <div
                      key={slide.id}
                      className={`ac-folding-slide is-${slideState}`}
                      data-slide-state={slideState}
                      data-diff={signedDiff}
                      onClick={() => {
                        if (diff !== 0) {
                          setActiveCafeSlide(idx);
                        }
                      }}
                    >
                      <div
                        className="ac-folding-card-motion"
                        onClick={() => {
                          if (diff === 0) {
                            setOffer2Lightbox({
                              src: slide.image,
                              title: slide.mainHeading,
                              caption: slide.description,
                            });
                          }
                        }}
                      >
                        <div className="ac-folding-media-wrapper">
                          <img
                            src={slide.image}
                            alt={slide.mainHeading}
                            className="ac-folding-media-img"
                          />
                        </div>
                      </div>

                      <div className="ac-folding-upper-subtitle" data-slide-state={slideState}>
                        <div className="ac-folding-upper-subtitle-content">
                          <span className="ac-folding-overline">{slide.smallHeading}</span>
                          <h4 className="ac-folding-title">{slide.mainHeading}</h4>
                          <div className="ac-folding-copy-reveal">
                            <p className="ac-folding-desc">{slide.description}</p>
                            <button
                              type="button"
                              className="ad-primary-btn ac-folding-explore-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsAppBooking(slide.whatsappSubject);
                              }}
                            >
                              {slide.buttonLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Atlantis Custom Carousel Navigation (Prev Chevron + Scrollbar Track/Thumb + Next Chevron) */}
              <div className="ac-folding-nav">
                <button
                  type="button"
                  className="ac-folding-nav-btn"
                  onClick={() =>
                    setActiveCafeSlide(
                      (curr) => (curr - 1 + cafeMenuSlides.length) % cafeMenuSlides.length
                    )
                  }
                  aria-label={t.previousOffer}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M14.647 5.647a.5.5 0 1 1 .707.707L9.707 12l5.647 5.647a.5.5 0 1 1-.707.707l-6-6a.5.5 0 0 1 0-.707z"
                    />
                  </svg>
                </button>

                <div className="ac-folding-scrollbar">
                  <span
                    className="ac-folding-scrollbar-drag"
                    style={{
                      width: `${100 / cafeMenuSlides.length}%`,
                      insetInlineStart: `${(activeCafeSlide * 100) / cafeMenuSlides.length}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="ac-folding-nav-btn"
                  onClick={() =>
                    setActiveCafeSlide((curr) => (curr + 1) % cafeMenuSlides.length)
                  }
                  aria-label={t.nextOffer}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8.646 5.647a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .707l-6 6a.5.5 0 1 1-.708-.707L14.293 12 8.646 6.354a.5.5 0 0 1 0-.707"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "meeting" ? (
        /* ============================================================================
           DEDICATED MEETING ROOM PAGE (#meeting-room)
           Modeled 1:1 on Atlantis Lost World Reference (Same Design as Café) + Official PDF
           ============================================================================ */
        <div className="atlantis-cafe-page atlantis-meeting-page" id="meeting-top">
          {/* SECTION 1 — HERO BANNER (Full-screen photograph of actual OZ Park Hotel meeting room, ONLY small heading & main title in white) */}
          <section className="ac-hero" aria-label={t.meetingHeroMain}>
            <img
              src="/images/ozpark/meeting-hero-4k.jpg"
              alt={t.meetingHeroMain}
              className="ac-hero-img"
            />
            <div className="ac-hero-shade" />
            <div className="ac-hero-center">
              <span className="aw-overline aw-overline-light">{t.meetingHeroSmall}</span>
              <h1 className="ad-hero-title">{t.meetingHeroMain}</h1>
            </div>
          </section>

          {/* SECTION 2 — MEETING ROOM INTRODUCTION & INFORMATION (Two-column Atlantis list-banner layout separated by a thin vertical line) */}
          <section className="ac-intro-info-section" id="meeting-intro">
            <div className="ao-container">
              <div className="ac-intro-info-grid">
                {/* LEFT SIDE — INTRODUCTION */}
                <div className="ac-intro-left">
                  <span className="aw-overline">{t.meetingIntroSmall}</span>
                  <h2 className="aw-section-h3 ac-intro-heading">{t.meetingIntroMain}</h2>
                  <p className="ac-intro-copy">{t.meetingIntroP1}</p>
                  <p className="ac-intro-copy">{t.meetingIntroP2}</p>
                  <p className="ac-intro-copy">{t.meetingIntroP3}</p>
                </div>

                {/* VERTICAL DIVIDER */}
                <div className="ac-intro-divider" aria-hidden="true" />

                {/* RIGHT SIDE — MEETING ROOM INFORMATION (Availability, Location, Contact, Email & WhatsApp Inquiry Button) */}
                <div className="ac-info-right">
                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.meetingInfoAvailLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <polyline
                            points="16.85 12.47 12 12.47 12 7.62"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="7.76"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">{t.meetingInfoAvailValue}</p>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.meetingInfoLocationLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12,4.18c-2.98,0-5.39,2.41-5.39,5.39v.09c0,.77.16,1.51.46,2.18l4.23,7.57c.31.55,1.1.55,1.41,0l4.23-7.57c.29-.67.46-1.4.46-2.18v-.09c0-2.98-2.41-5.39-5.39-5.39Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <circle
                            cx="12"
                            cy="9.62"
                            r="2.06"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="ac-info-value">{t.meetingInfoLocationLine1}</p>
                        <p className="ac-info-subvalue">{t.meetingInfoLocationLine2}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.meetingInfoContactLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M18.82,4.7c-1.84-1.84-6.49-.17-10.39,3.73s-5.57,8.55-3.73,10.39l.15.15c1.75,1.75,2.79,1.06,3.85,0l1.07-1.07c.67-.67.67-1.75,0-2.42l-1.01-1.01c-.2-.2-.2-.54,0-.74l.4-.4,4.17-4.17.4-.4c.2-.2.54-.2.74,0l1.01,1.01c.67.67,1.75.67,2.42,0l1.07-1.07c1.06-1.06,1.75-2.1,0-3.85l-.15-.15Z"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">
                        <a href="tel:+966500955877" dir="ltr">
                          {t.meetingInfoContactValue}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="ac-info-block">
                    <h3 className="ac-info-label">{t.meetingInfoEmailLabel}</h3>
                    <div className="ac-info-row">
                      <span className="ac-info-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <rect
                            x="3.72"
                            y="6.53"
                            width="16.56"
                            height="10.94"
                            rx="0.6"
                            ry="0.6"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                          <path
                            d="M20.28,6.53l-7.86,7.56c-.23.22-.6.22-.83,0L3.72,6.53"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeMiterlimit="10"
                          />
                        </svg>
                      </span>
                      <p className="ac-info-value">
                        <a href="mailto:info@ozpark.sa" dir="ltr">
                          {t.meetingInfoEmailValue}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="am-info-cta-block">
                    <p className="am-info-note">{t.meetingInfoNote}</p>
                    <button
                      type="button"
                      className="ad-primary-btn"
                      onClick={() => openWhatsAppBooking(t.meetingInfoWhatsappSubject)}
                    >
                      {t.meetingInfoBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 — FULL-SCREEN IMMERSIVE VERTICAL WIPE CAROUSEL (1:1 Atlantis vertical-carousel-widget for Standard & Special Coffee Break Packages) */}
          {(() => {
            const totalSlides = meetingPackageSlides.length;
            const maxTransIdx = Math.max(0, totalSlides - 2);
            const baseIdx = Math.min(maxTransIdx, Math.max(0, Math.floor(meetingVerticalProgress)));
            const localPct = Math.min(100, Math.max(0, (meetingVerticalProgress - baseIdx) * 100));
            const activeSegmentIdx = Math.min(
              totalSlides - 1,
              Math.max(0, Math.round(meetingVerticalProgress))
            );
            const thumbPercent =
              totalSlides > 1
                ? Math.min(100, Math.max(0, (meetingVerticalProgress / (totalSlides - 1)) * 100))
                : 0;

            return (
              <section
                ref={meetingVerticalRef}
                className="ac-vcarousel-section"
                style={{ height: `${totalSlides * 100}vh` }}
                aria-label={t.meetingBreakMain}
              >
                <div className="ac-vcarousel-static">
                  {/* Right-hand Vertical Navigation Rail */}
                  <div className="ac-vcarousel-nav">
                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === 0}
                      onClick={() => scrollToMeetingVerticalSlide(activeSegmentIdx - 1)}
                      aria-label={t.previousOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6.354 15.354a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L12 9.707l-5.646 5.647z"
                        />
                      </svg>
                    </button>

                    <div className="ac-vcarousel-progress-wrapper">
                      <div className="ac-vcarousel-progress-track">
                        <div className="ac-vcarousel-progress-bars">
                          {meetingPackageSlides.map((s, idx) => (
                            <button
                              key={s.id}
                              type="button"
                              className={`ac-vcarousel-progress-segment ${
                                idx === activeSegmentIdx ? "is-active" : ""
                              }`}
                              onClick={() => scrollToMeetingVerticalSlide(idx)}
                              aria-label={s.tabLabel}
                            />
                          ))}
                        </div>
                        <div
                          className="ac-vcarousel-thumb"
                          style={{
                            top: `${thumbPercent.toFixed(2)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === totalSlides - 1}
                      onClick={() => scrollToMeetingVerticalSlide(activeSegmentIdx + 1)}
                      aria-label={t.nextOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M17.646 8.646a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 .708-.708L12 14.293l5.646-5.647z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Full-Screen Stacked Slides with Exact Atlantis Clip-Path Wipe & Parallax */}
                  {meetingPackageSlides.map((slide, idx) => {
                    let clipPath = "inset(100% 0% 0% 0%)";
                    let zIndex = 1;
                    let display: "block" | "none" = "none";
                    let bgTransform = "translateY(30px)";

                    if (idx === baseIdx) {
                      clipPath = `inset(0% 0% ${localPct.toFixed(2)}% 0%)`;
                      zIndex = 20;
                      display = "block";
                      bgTransform = `translateY(${(-0.3 * localPct).toFixed(2)}px)`;
                    } else if (idx === baseIdx + 1) {
                      clipPath = `inset(${(100 - localPct).toFixed(2)}% 0% 0% 0%)`;
                      zIndex = 10;
                      display = "block";
                      bgTransform = `translateY(${(30 - 0.3 * localPct).toFixed(2)}px)`;
                    }

                    return (
                      <div
                        key={slide.id}
                        className="ac-vcarousel-slide"
                        style={{ clipPath, zIndex, display }}
                      >
                        <div className="ac-vcarousel-slide-bg" style={{ transform: bgTransform }}>
                          <img
                            src={slide.image}
                            alt={slide.mainHeading}
                            className="ac-vcarousel-bg-img"
                          />
                          <div className="ac-vcarousel-bg-overlay" />
                        </div>

                        <div className="ac-vcarousel-text-container">
                          <div className="ac-vcarousel-text-inner">
                            <span className="ac-vcarousel-overline">{slide.smallHeading}</span>
                            <h3 className="ac-vcarousel-heading">{slide.mainHeading}</h3>
                            <span className="am-vcarousel-price-pill">{slide.price}</span>
                            <p className="ac-vcarousel-desc">{slide.description}</p>
                            <div className="ac-vcarousel-cta-wrap am-vcarousel-cta-group">
                              <button
                                type="button"
                                className="ac-vcarousel-cta"
                                onClick={() => openWhatsAppBooking(slide.whatsappSubject)}
                              >
                                {slide.buttonLabel}
                              </button>
                              <button
                                type="button"
                                className="ac-vcarousel-cta am-vcarousel-cta-secondary"
                                onClick={() => {
                                  setActiveMeetingSlide(idx);
                                  meetingPackagesRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }}
                              >
                                {slide.viewInclusionsLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* SECTION 4 — COFFEE BREAK EXPERIENCES + ATLANTIS LANDSCAPE FOLDING CAROUSEL + FULL PACKAGE INCLUSIONS */}
          <section ref={meetingPackagesRef} className="ac-menu-slider-section" id="meeting-packages">
            <div className="aw-centered-header">
              <span className="aw-overline">{t.meetingBreakSmall}</span>
              <h2 className="aw-section-h3">{t.meetingBreakMain}</h2>
              <p className="aw-centered-lead">{t.meetingBreakP1}</p>
              <p className="aw-centered-lead" style={{ marginTop: "10px" }}>
                {t.meetingBreakP2}
              </p>
            </div>

            {/* Package Selector Tabs */}
            <div className="ac-folding-tabs" role="tablist">
              {meetingPackageSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeMeetingSlide}
                  className={`ac-folding-tab ${idx === activeMeetingSlide ? "is-active" : ""}`}
                  onClick={() => setActiveMeetingSlide(idx)}
                >
                  <span className="ac-folding-tab-num">0{idx + 1}</span>
                  <span>{slide.tabLabel}</span>
                  <span className="am-tab-price-chip">{slide.price}</span>
                </button>
              ))}
            </div>

            {/* Atlantis Landscape Folding Carousel (Center active package 1074x604 at Y=0, adjacent package 880x495 folded down at Y=48px) */}
            <div className="ac-folding-carousel am-folding-carousel">
              <div className="ac-folding-stage am-folding-stage">
                {meetingPackageSlides.map((slide, idx) => {
                  const diff = idx - activeMeetingSlide;
                  const dirSign = isRtl ? -1 : 1;
                  const signedDiff = diff * dirSign;
                  const slideState = diff === 0 ? "active" : "adjacent";

                  return (
                    <div
                      key={slide.id}
                      className={`ac-folding-slide is-${slideState}`}
                      data-slide-state={slideState}
                      data-diff={signedDiff}
                      onClick={() => {
                        if (diff !== 0) {
                          setActiveMeetingSlide(idx);
                        }
                      }}
                    >
                      <div
                        className="ac-folding-card-motion"
                        onClick={() => {
                          if (diff === 0) {
                            setOffer2Lightbox({
                              src: slide.image,
                              title: `${slide.smallHeading} — ${slide.mainHeading} (${slide.price})`,
                              caption: slide.description,
                            });
                          }
                        }}
                      >
                        <div className="ac-folding-media-wrapper">
                          <img
                            src={slide.image}
                            alt={slide.mainHeading}
                            className="ac-folding-media-img"
                          />
                        </div>
                      </div>

                      <div className="ac-folding-upper-subtitle" data-slide-state={slideState}>
                        <div className="ac-folding-upper-subtitle-content am-folding-subtitle-content">
                          <span className="ac-folding-overline">{slide.smallHeading}</span>
                          <h4 className="ac-folding-title">{slide.mainHeading}</h4>
                          <div className="am-package-price-badge">{slide.price}</div>

                          <div className="ac-folding-copy-reveal">
                            <p className="ac-folding-desc">{slide.description}</p>

                            {/* 4-Category Package Inclusions Breakdown */}
                            <div className="am-inclusions-wrap">
                              <h5 className="am-inclusions-heading">{slide.inclusionsLabel}</h5>
                              <div className="am-inclusions-grid">
                                {slide.inclusions.map((cat) => (
                                  <div key={cat.categoryTitle} className="am-inclusion-card">
                                    <h6 className="am-inclusion-cat-title">{cat.categoryTitle}</h6>
                                    <ul className="am-inclusion-list">
                                      {cat.items.map((itemText) => (
                                        <li key={itemText}>{itemText}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <p className="am-package-rental-note">{t.meetingInfoNote}</p>

                            <button
                              type="button"
                              className="ad-primary-btn ac-folding-explore-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsAppBooking(slide.whatsappSubject);
                              }}
                            >
                              {slide.buttonLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Atlantis Custom Carousel Navigation (Prev Chevron + Scrollbar Track/Thumb + Next Chevron) */}
              <div className="ac-folding-nav">
                <button
                  type="button"
                  className="ac-folding-nav-btn"
                  onClick={() =>
                    setActiveMeetingSlide(
                      (curr) =>
                        (curr - 1 + meetingPackageSlides.length) % meetingPackageSlides.length
                    )
                  }
                  aria-label={t.previousOffer}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M14.647 5.647a.5.5 0 1 1 .707.707L9.707 12l5.647 5.647a.5.5 0 1 1-.707.707l-6-6a.5.5 0 0 1 0-.707z"
                    />
                  </svg>
                </button>

                <div className="ac-folding-scrollbar">
                  <span
                    className="ac-folding-scrollbar-drag"
                    style={{
                      width: `${100 / meetingPackageSlides.length}%`,
                      insetInlineStart: `${(activeMeetingSlide * 100) / meetingPackageSlides.length}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="ac-folding-nav-btn"
                  onClick={() =>
                    setActiveMeetingSlide((curr) => (curr + 1) % meetingPackageSlides.length)
                  }
                  aria-label={t.nextOffer}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M8.646 5.647a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .707l-6 6a.5.5 0 1 1-.708-.707L14.293 12 8.646 6.354a.5.5 0 0 1 0-.707"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : activePage === "stay" ? (
        /* ============================================================================
           DEDICATED STAY AT OUR HOTEL PAGE (ATLANTIS STAY 1:1 SCROLL ANIMATIONS + 6-SECTION PDF)
           ============================================================================ */
        <div className="as-page-wrapper" id="stay-at-oz-park">
          {/* SECTION 1 — ANIMATED SCROLL-EXPANDING HERO BANNER (1:1 Atlantis inspirational-hero--animated___RAQcbG) */}
          {(() => {
            const p = stayHeroProgress;
            const mediaTopPx = Math.round((1 - p) * 196);
            const mediaSidePx = Math.round((1 - p) * 72);
            const mediaBottomPx = Math.round((1 - p) * 56);
            const mediaRadiusPx = ((1 - p) * 8).toFixed(1);
            const shadeOpacity = (0.1 + p * 0.28).toFixed(3);
            const topTaglineOpacity = Math.max(0, 1 - p * 1.85);
            const centerTaglineOpacity = Math.min(1, Math.max(0, (p - 0.5) / 0.35));
            // At p=0, heading center sits at top=196px (straddling the top edge of the inset video: top 50% black, bottom 50% white).
            // As p->1, heading glides to top=50% of sticky stage and becomes 100% white.
            const splitPct = Math.max(0, Math.min(100, 50 * (1 - p * 4.2)));

            return (
              <section
                ref={stayHeroSectionRef}
                className="as-hero-scroll-section"
                aria-label={t.stayPageHeroMain}
              >
                <div className="as-hero-sticky">
                  <button
                    type="button"
                    className="as-back-btn"
                    onClick={() => navigateToHomeSection("signature", 0)}
                  >
                    <Arrow reverse rtl={isRtl} /> {t.backToHome}
                  </button>

                  {/* Top Overline on Light Background (visible at scrollY=0, fades out as video expands) */}
                  <div
                    className="as-hero-top-tagline"
                    style={{
                      opacity: topTaglineOpacity,
                      transform: `translateY(${(-p * 20).toFixed(1)}px)`,
                    }}
                  >
                    <span>{t.stayPageHeroSmall}</span>
                  </div>

                  {/* Dual-Layer Clipped H1 Heading (Black above video top edge, White overlapping video) */}
                  <div
                    className="as-hero-heading-box"
                    style={{
                      top: `calc(${((1 - p) * 196).toFixed(1)}px + ${(p * 50).toFixed(2)}%)`,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div
                      className="as-hero-center-overline"
                      style={{ opacity: centerTaglineOpacity }}
                      aria-hidden="true"
                    >
                      {t.stayPageHeroSmall}
                    </div>

                    <div className="as-hero-title-stack">
                      {/* Dark/Black Layer (visible above the inset video's top edge at p=0) */}
                      <div
                        className="as-hero-title-layer is-dark"
                        style={{
                          clipPath: `inset(0% 0% ${(100 - splitPct).toFixed(2)}% 0%)`,
                        }}
                        aria-hidden="true"
                      >
                        <h1 className="as-hero-title">{t.stayPageHeroMain}</h1>
                      </div>

                      {/* Light/White Layer (visible over the video from p=0 through p=1) */}
                      <div
                        className="as-hero-title-layer is-light"
                        style={{
                          clipPath: `inset(${splitPct.toFixed(2)}% 0% 0% 0%)`,
                        }}
                      >
                        <h1 className="as-hero-title">{t.stayPageHeroMain}</h1>
                      </div>
                    </div>
                  </div>

                  {/* Inset-to-Fullscreen Expanding Video Container */}
                  <div
                    className="as-hero-media"
                    style={{
                      top: `${mediaTopPx}px`,
                      left: `${mediaSidePx}px`,
                      right: `${mediaSidePx}px`,
                      bottom: `${mediaBottomPx}px`,
                      borderRadius: `${mediaRadiusPx}px`,
                    }}
                  >
                    <video
                      ref={stayVideoRef}
                      className="as-hero-video"
                      src="/images/ozpark/hero-video.mp4"
                      poster="/images/ozpark/hero-poster.jpg"
                      autoPlay
                      loop
                      muted={!soundOn}
                      playsInline
                      preload="auto"
                      aria-label={t.heroAlt}
                    />
                    <div
                      className="as-hero-shade"
                      style={{ opacity: shadeOpacity }}
                    />

                    {/* Atlantis Scroll Indicator at bottom center */}
                    <div
                      className="as-scroll-indicator"
                      style={{ opacity: Math.max(0.25, 1 - p * 0.7) }}
                      aria-hidden="true"
                    >
                      <div className="as-scroll-indicator-track">
                        <span className="as-scroll-indicator-thumb" />
                      </div>
                    </div>

                    <button
                      className="sound-control"
                      type="button"
                      onClick={() => setSoundOn((on) => !on)}
                    >
                      <span
                        className={`sound-bars ${soundOn ? "is-active" : ""}`}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                        <i />
                      </span>
                      {soundOn ? t.soundOn : t.soundOff}
                    </button>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* SECTION 2 — ACCOMMODATION INTRODUCTION (Atlantis page-breakers-widget--variant-align-center--h3) */}
          <section className="as-breaker-section" id="stay-accommodation-intro">
            <div className="as-breaker-container">
              <span className="as-breaker-overline">{t.stayPageIntroSmall}</span>
              <h2 className="as-breaker-h3">{t.stayPageIntroMain}</h2>
              <p className="as-breaker-body">{t.stayPageIntroDesc}</p>
              <div className="as-breaker-actions">
                <button
                  type="button"
                  className="as-breaker-btn"
                  onClick={() =>
                    stayAccomSliderRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span>{t.stayPageIntroBtn}</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3 — ACCOMMODATION SLIDER (Atlantis immersive-carousel-widget-animated 1:1 Split-Screen Slider + Scroll-Shrinking Intro Curtain) */}
          <section
            className="as-immersive-carousel"
            id="stay-accommodation-slider"
            ref={stayAccomSliderRef}
            aria-label={t.stayPageIntroMain}
          >
            {(() => {
              const accomShrink = Math.min(1, stayAccomIntroProgress / 0.78);
              const accomIntroOpacity =
                stayAccomIntroProgress <= 0.78
                  ? 1
                  : Math.max(0, 1 - (stayAccomIntroProgress - 0.78) / 0.22);

              return (
                <div className="as-immersive-dsk-layout">
                  {/* Atlantis Scroll-Shrinking Intro Screen Curtain (100% width -> 589px left column width -> fade out) */}
                  <div
                    className="as-immersive-intro-screen"
                    aria-hidden="true"
                    style={{
                      width: `calc(${((1 - accomShrink) * 100).toFixed(2)}% + ${accomShrink.toFixed(
                        3
                      )} * var(--as-left-col-width))`,
                      opacity: accomIntroOpacity,
                      display: accomIntroOpacity <= 0.01 ? "none" : "flex",
                    }}
                  >
                    <img
                      src="/images/ozpark/stay-rooms.jpg"
                      alt=""
                      className="as-immersive-intro-img"
                    />
                    <div className="as-immersive-intro-scrim" />
                    <div
                      className="as-immersive-intro-copy"
                      style={{ opacity: Math.max(0, 1 - accomShrink * 1.35) }}
                    >
                      <span className="as-immersive-overline">{t.stayPageIntroSmall}</span>
                      <h3 className="as-immersive-title">{t.stayPageIntroMain}</h3>
                    </div>
                  </div>

                  {/* LEFT COLUMN: Atmospheric cover background + Centered Text Swiper + Bottom Navigation Bar */}
                  <div className="as-immersive-left-col">
                    <div className="as-immersive-left-bg">
                      {[
                        "/images/ozpark/stay-rooms.jpg",
                        "/images/ozpark/stay-studios.jpg",
                        "/images/ozpark/stay-suites.jpg",
                      ].map((bgSrc, idx) => (
                        <div
                          key={`accom-left-bg-${idx}`}
                          className={`as-immersive-left-bg-slide ${
                            idx === activeStayAccomSlide ? "is-active" : ""
                          }`}
                        >
                          <img src={bgSrc} alt="" aria-hidden="true" />
                          <div className="as-immersive-left-scrim" />
                        </div>
                      ))}
                    </div>

                    <div className="as-immersive-text-area">
                      <div className="as-immersive-text-stage">
                        {categories.map((cat, idx) => {
                          const stateClass =
                            idx === activeStayAccomSlide
                              ? "is-active"
                              : idx < activeStayAccomSlide
                              ? "is-prev"
                              : "is-next";
                          return (
                            <div
                              key={`accom-text-${cat.id}`}
                              className={`as-immersive-text-slide ${stateClass}`}
                              aria-hidden={idx !== activeStayAccomSlide}
                            >
                              <span className="as-immersive-overline">{cat.category}</span>
                              <h3 className="as-immersive-title">{cat.title}</h3>
                              <p className="as-immersive-desc">{cat.description}</p>
                              <div className="as-immersive-cta-wrap">
                                <button
                                  type="button"
                                  className="as-immersive-tertiary-btn"
                                  onClick={() =>
                                    openRoomCategoryPage(
                                      (cat.id === "rooms" ||
                                      cat.id === "studios" ||
                                      cat.id === "suites"
                                        ? cat.id
                                        : "rooms") as RoomCategorySlug
                                    )
                                  }
                                >
                                  <span>{t.stayPageAccomExploreBtns[idx]}</span>
                                  <Arrow rtl={isRtl} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Navigation Tabs inside Left Column (Atlantis immersive-carousel-animated-navigation) */}
                    <div className="as-immersive-nav-wrap">
                      <nav
                        className="as-immersive-nav"
                        aria-label={language === "ar" ? "فئات الإقامة" : "Accommodation categories"}
                      >
                        <div className="as-immersive-tabs-list">
                          {t.stayPageAccomTabs.map((tabLabel, idx) => {
                            const isActive = idx === activeStayAccomSlide;
                            return (
                              <button
                                key={`accom-tab-${tabLabel}`}
                                type="button"
                                className={`as-immersive-tab ${isActive ? "is-active" : ""}`}
                                aria-current={isActive ? "true" : undefined}
                                onClick={() => setActiveStayAccomSlide(idx)}
                              >
                                <span>{tabLabel}</span>
                              </button>
                            );
                          })}
                          <span
                            className="as-immersive-ink-bar"
                            aria-hidden="true"
                            style={{
                              width: `${100 / t.stayPageAccomTabs.length}%`,
                              insetInlineStart: `${
                                (activeStayAccomSlide * 100) / t.stayPageAccomTabs.length
                              }%`,
                            }}
                          />
                        </div>
                      </nav>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Large Accommodation Photograph with Smooth Curtain/Fade Transition */}
                  <div className="as-immersive-right-col">
                    <div className="as-immersive-media-stage">
                      {[
                        {
                          src: "/images/ozpark/offer2-room-king-4k.jpg",
                          alt: categories[0]?.title ?? "Rooms",
                        },
                        {
                          src: "/images/ozpark/room-superior-studio-2.png",
                          alt: categories[1]?.title ?? "Studios",
                        },
                        {
                          src: "/images/ozpark/room-twin-junior-suite-1.png",
                          alt: categories[2]?.title ?? "Suites",
                        },
                      ].map((media, idx) => {
                        const stateClass =
                          idx === activeStayAccomSlide
                            ? "is-active"
                            : idx < activeStayAccomSlide
                            ? "is-prev"
                            : "is-next";
                        return (
                          <div
                            key={`accom-media-${idx}`}
                            className={`as-immersive-media-slide ${stateClass}`}
                            aria-hidden={idx !== activeStayAccomSlide}
                          >
                            <img src={media.src} alt={media.alt} />
                          </div>
                        );
                      })}

                      {/* Subtle Prev/Next Arrows on Right Visual Stage */}
                      <div className="as-immersive-media-arrows">
                        <button
                          type="button"
                          className="as-immersive-arrow-btn"
                          onClick={() =>
                            setActiveStayAccomSlide(
                              (curr) => (curr - 1 + categories.length) % categories.length
                            )
                          }
                          aria-label={t.previousOffer}
                        >
                          <Arrow reverse rtl={isRtl} />
                        </button>
                        <span className="as-immersive-counter">
                          0{activeStayAccomSlide + 1} / 0{categories.length}
                        </span>
                        <button
                          type="button"
                          className="as-immersive-arrow-btn"
                          onClick={() =>
                            setActiveStayAccomSlide((curr) => (curr + 1) % categories.length)
                          }
                          aria-label={t.nextOffer}
                        >
                          <Arrow rtl={isRtl} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* SECTION 4 — BEYOND YOUR STAY INTRODUCTION (Atlantis page-breakers-widget--variant-align-center--h3) */}
          <section className="as-breaker-section" id="stay-beyond-intro">
            <div className="as-breaker-container">
              <span className="as-breaker-overline">{t.stayPageBeyondSmall}</span>
              <h2 className="as-breaker-h3">{t.stayPageBeyondMain}</h2>
              <p className="as-breaker-body">{t.stayPageBeyondDesc}</p>
              <div className="as-breaker-actions">
                <button
                  type="button"
                  className="as-breaker-btn"
                  onClick={() =>
                    stayVerticalRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span>{t.stayPageBeyondBtn}</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 5A — FULL-SCREEN STICKY VERTICAL CURTAIN-WIPE CAROUSEL (1:1 Atlantis Stay vertical-carousel-widget___y_LexG) */}
          {(() => {
            const stayVerticalSlides = [
              {
                slide: slides[1], // Diwan Mada Restaurant
                tabLabel: t.stayPageExpTabs[0],
                bgImage: "/images/ozpark/offer4-hero-diwan-4k.jpg",
                onExplore: openDiningPage,
              },
              {
                slide: slides[2], // OZ Park Café
                tabLabel: t.stayPageExpTabs[1],
                bgImage: "/images/ozpark/cafe-hero-4k.jpg",
                onExplore: openCafePage,
              },
              {
                slide: slides[3], // Meeting Room
                tabLabel: t.stayPageExpTabs[2],
                bgImage: "/images/ozpark/meeting-hero-4k.jpg",
                onExplore: openMeetingPage,
              },
            ];
            const totalSlides = stayVerticalSlides.length;
            const maxTransIdx = Math.max(0, totalSlides - 2);
            const baseIdx = Math.min(maxTransIdx, Math.max(0, Math.floor(stayVerticalProgress)));
            const localPct = Math.min(100, Math.max(0, (stayVerticalProgress - baseIdx) * 100));
            const activeSegmentIdx = Math.min(
              totalSlides - 1,
              Math.max(0, Math.round(stayVerticalProgress))
            );
            const thumbPercent =
              totalSlides > 1
                ? Math.min(100, Math.max(0, (stayVerticalProgress / (totalSlides - 1)) * 100))
                : 0;

            return (
              <section
                ref={stayVerticalRef}
                className="ac-vcarousel-section as-vcarousel-section"
                style={{ height: `${totalSlides * 100}vh` }}
                aria-label={t.stayPageBeyondMain}
              >
                <div className="ac-vcarousel-static">
                  {/* Right-hand Vertical Navigation Rail (Up chevron + 3 progress segments + circular thumb + Down chevron) */}
                  <div className="ac-vcarousel-nav">
                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === 0}
                      onClick={() => scrollToStayVerticalSlide(activeSegmentIdx - 1)}
                      aria-label={t.previousOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6.354 15.354a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L12 9.707l-5.646 5.647z"
                        />
                      </svg>
                    </button>

                    <div className="ac-vcarousel-progress-wrapper">
                      <div className="ac-vcarousel-progress-track">
                        <div className="ac-vcarousel-progress-bars">
                          {stayVerticalSlides.map((item, idx) => (
                            <button
                              key={`stay-vseg-${item.slide.id}`}
                              type="button"
                              className={`ac-vcarousel-progress-segment ${
                                idx === activeSegmentIdx ? "is-active" : ""
                              }`}
                              onClick={() => scrollToStayVerticalSlide(idx)}
                              aria-label={item.tabLabel}
                            />
                          ))}
                        </div>
                        <div
                          className="ac-vcarousel-thumb"
                          style={{
                            top: `${thumbPercent.toFixed(2)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ac-vcarousel-nav-btn"
                      disabled={activeSegmentIdx === totalSlides - 1}
                      onClick={() => scrollToStayVerticalSlide(activeSegmentIdx + 1)}
                      aria-label={t.nextOffer}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M17.646 8.646a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 .708-.708L12 14.293l5.646-5.647z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Full-Screen Stacked Slides with Exact Atlantis Clip-Path Curtain Wipe & Parallax */}
                  {stayVerticalSlides.map((item, idx) => {
                    let clipPath = "inset(100% 0% 0% 0%)";
                    let zIndex = 1;
                    let display: "block" | "none" = "none";
                    let bgTransform = "translateY(30px)";

                    if (idx === baseIdx) {
                      clipPath = `inset(0% 0% ${localPct.toFixed(2)}% 0%)`;
                      zIndex = 20;
                      display = "block";
                      bgTransform = `translateY(${(-0.3 * localPct).toFixed(2)}px)`;
                    } else if (idx === baseIdx + 1) {
                      clipPath = `inset(${(100 - localPct).toFixed(2)}% 0% 0% 0%)`;
                      zIndex = 10;
                      display = "block";
                      bgTransform = `translateY(${(30 - 0.3 * localPct).toFixed(2)}px)`;
                    }

                    return (
                      <div
                        key={`stay-vslide-${item.slide.id}`}
                        className="ac-vcarousel-slide"
                        style={{ clipPath, zIndex, display }}
                      >
                        <div className="ac-vcarousel-slide-bg" style={{ transform: bgTransform }}>
                          <img
                            src={item.bgImage}
                            alt={item.slide.title}
                            className="ac-vcarousel-bg-img"
                          />
                          <div className="ac-vcarousel-bg-overlay" />
                        </div>

                        <div className="ac-vcarousel-text-container">
                          <div className="ac-vcarousel-text-inner">
                            <span className="ac-vcarousel-overline">{item.slide.category}</span>
                            <h3 className="ac-vcarousel-heading">{item.slide.title}</h3>
                            <p className="ac-vcarousel-desc">{item.slide.copy}</p>
                            <div className="ac-vcarousel-cta-wrap">
                              <button
                                type="button"
                                className="ac-vcarousel-cta"
                                onClick={item.onExplore}
                              >
                                {item.slide.ctaLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bottom 3-Tab Experience Selector Bar on the Vertical Carousel Stage */}
                  <div className="as-vcarousel-bottom-tabs">
                    <div className="as-vcarousel-bottom-tabs-inner">
                      {stayVerticalSlides.map((item, idx) => {
                        const isActive = idx === activeSegmentIdx;
                        return (
                          <button
                            key={`stay-vtab-${item.slide.id}`}
                            type="button"
                            className={`as-immersive-tab ${isActive ? "is-active" : ""}`}
                            onClick={() => scrollToStayVerticalSlide(idx)}
                          >
                            <span>{item.tabLabel}</span>
                          </button>
                        );
                      })}
                      <span
                        className="as-immersive-ink-bar"
                        aria-hidden="true"
                        style={{
                          width: `${100 / stayVerticalSlides.length}%`,
                          insetInlineStart: `${
                            (activeSegmentIdx * 100) / stayVerticalSlides.length
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* SECTION 6 — STAY PACKAGES 3-COLUMN PORTRAIT CARDS (1:1 Atlantis Stay card-carousel___DmDxBa) */}
          <section
            className="as-packages-section"
            id="stay-packages-cards"
            ref={stayExpSliderRef}
            aria-label={language === "ar" ? "باقات وعروض الإقامة" : "Stay Packages"}
          >
            <div className="as-packages-header">
              <span className="as-breaker-overline">
                {language === "ar" ? "باقات الإقامة" : "STAY PACKAGES"}
              </span>
              <h2 className="as-breaker-h3">
                {language === "ar" ? "المزيد لتستمتع به" : "More to Savour"}
              </h2>
              <p className="as-breaker-body">
                {language === "ar"
                  ? "استكشف عروضاً حصرية وباقات إقامة مرنة مصممة لتمنحك تجربة ساحلية متكاملة في فندق أوز بارك."
                  : "Explore a world of coastal comfort and exceptional dining with flexible packages for every kind of stay."}
              </p>
            </div>

            <div className="as-packages-grid">
              {[
                {
                  id: offers[0].id,
                  title: offers[0].title,
                  copy: offers[0].copy,
                  image: "/images/ozpark/wedding-pkg-royal-4k.jpg",
                  onBook: () => openWhatsAppBooking(offers[0].title),
                  onExplore: openWeddingPage,
                },
                {
                  id: offers[1].id,
                  title: offers[1].title,
                  copy: offers[1].copy,
                  image: "/images/ozpark/offer2-room-king-4k.jpg",
                  onBook: () => openWhatsAppBooking(offers[1].title),
                  onExplore: openOffer2Page,
                },
                {
                  id: offers[2].id,
                  title: offers[2].title,
                  copy: offers[2].copy,
                  image: "/images/ozpark/stay-suites.jpg",
                  onBook: () => openWhatsAppBooking(offers[2].title),
                  onExplore: openOffer3Page,
                },
              ].map((pkg) => (
                <article key={`stay-pkg-${pkg.id}`} className="as-package-card">
                  <div
                    className="as-package-card-media"
                    onClick={pkg.onExplore}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pkg.onExplore();
                      }
                    }}
                  >
                    <img src={pkg.image} alt={pkg.title} />
                  </div>
                  <div className="as-package-card-body">
                    <h3 className="as-package-card-title">{pkg.title}</h3>
                    <p className="as-package-card-desc">{pkg.copy}</p>
                    <div className="as-package-card-actions">
                      <button
                        type="button"
                        className="as-package-book-btn"
                        onClick={pkg.onBook}
                      >
                        {language === "ar" ? "احجز" : "Book"}
                      </button>
                      <button
                        type="button"
                        className="as-package-explore-link"
                        onClick={pkg.onExplore}
                      >
                        {language === "ar" ? "استكشف" : "Explore"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : activePage === "room-category" ? (
        /* ============================================================================
           LEVEL 2 — DEDICATED ROOM CATEGORY PAGE (Rooms / Studios / Suites)
           Modeled 1:1 on https://www.atlantis.com/dubai/atlantis-the-palm/stay/rooms-and-suites/deluxe-rooms
           ============================================================================ */
        (() => {
          const catData = roomCategoriesPageData[language][activeCategorySlug];
          const roomsMap = specificRoomsData[language];
          const catRooms = catData.roomSlugs.map((slug) => roomsMap[slug]);
          const privWindow = getPrivilegesCarouselWindow();
          const privTotal = roomPrivilegesCarouselData[language].length;
          const privAccordions = roomPrivilegesAccordionData[language];

          return (
            <div className="atlantis-room-category-page" id={`stay-category-${catData.slug}`}>
              {/* SECTION 1 — CATEGORY HEADER & FULL-WIDTH BANNER (Atlantis section-banner--no-paddings) */}
              <section className="arc-banner-section" aria-label={catData.title}>
                <div className="arc-banner-header">
                  <span className="as-breaker-overline">{catData.eyebrow}</span>
                  <h1 className="arc-banner-h1">{catData.title}</h1>
                  <p className="arc-banner-subtitle">{catData.heroSubtitle}</p>
                </div>
                <div className="arc-banner-media">
                  <img src={catData.heroImage} alt={catData.title} />
                  <div className="arc-banner-overlay" />
                </div>
              </section>

              {/* SECTION 2 — DISCOVER YOUR IDEAL ROOM PORTRAIT CARDS (Atlantis card-carousel___DmDxBa) */}
              <section className="arc-discover-section" id="category-rooms-list">
                <div className="arc-discover-header">
                  <span className="as-breaker-overline">{catData.discoverEyebrow}</span>
                  <h2 className="as-breaker-h3">{catData.discoverTitle}</h2>
                  <p className="as-breaker-body">{catData.discoverSubtitle}</p>
                </div>

                <div
                  className={`arc-rooms-grid arc-rooms-grid--count-${Math.min(
                    3,
                    catRooms.length
                  )}`}
                >
                  {catRooms.map((rm) => (
                    <article key={rm.slug} className="arc-room-card">
                      <div
                        className="arc-room-card-media"
                        onClick={() => openRoomDetailPage(rm.slug)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openRoomDetailPage(rm.slug);
                          }
                        }}
                      >
                        <img src={rm.cardImage} alt={rm.name} />
                      </div>
                      <div className="arc-room-card-body">
                        <h3 className="arc-room-card-title">{rm.name}</h3>
                        <p className="arc-room-card-desc">{rm.cardDescription}</p>

                        {/* 2 Exact Atlantis Spec Icons Row: Size (sqm) + Guests */}
                        <div className="arc-room-card-specs">
                          <span className="arc-room-spec-item">
                            <AtlantisRoomIcon name="size" stroke="#2559a8" size={16} />
                            <span>{rm.size}</span>
                          </span>
                          <span className="arc-room-spec-item">
                            <AtlantisRoomIcon name="guests" stroke="#2559a8" size={16} />
                            <span>{rm.occupancy}</span>
                          </span>
                        </div>

                        <div className="as-package-card-actions">
                          <button
                            type="button"
                            className="as-package-book-btn"
                            onClick={() => openWhatsAppBooking(`${rm.name} (${catData.title})`)}
                          >
                            {language === "ar" ? "احجز" : "Book"}
                          </button>
                          <button
                            type="button"
                            className="as-package-explore-link"
                            onClick={() => openRoomDetailPage(rm.slug)}
                          >
                            {language === "ar" ? "استكشف" : "Explore"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SECTION 3 — EXCLUSIVE PRIVILEGES FOLDING 5-CARD CAROUSEL (Atlantis folding-carousel-widget___9-S11q) */}
              <section className="arc-folding-section" aria-label={catData.privilegesTitle}>
                <div className="arc-discover-header">
                  <span className="as-breaker-overline">
                    {language === "ar" ? "مزايا حصرية" : "EXCLUSIVE PRIVILEGES"}
                  </span>
                  <h2 className="as-breaker-h3">{catData.privilegesTitle}</h2>
                  <p className="as-breaker-body">
                    {language === "ar"
                      ? "غرفتك هي البداية فقط. إقامتك تمنحك عالماً من مزايا الضيافة في فندق أوز بارك."
                      : "Your room is only the beginning. Your key unlocks a world of OZ Park Hotel benefits to explore."}
                  </p>
                </div>

                <div className="arc-folding-stage">
                  {privWindow.map(({ item, index, offset, isCenter }) => (
                    <div
                      key={`${item.id}-${offset}`}
                      className={`arc-folding-slide arc-folding-offset-${offset} ${
                        isCenter ? "is-center" : ""
                      }`}
                      onClick={() => setActivePrivilegeSlide(index)}
                    >
                      <div className="arc-folding-card-media">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="arc-folding-card-caption">
                        <h3 className="arc-folding-card-title">{item.title}</h3>
                        {isCenter && (
                          <p className="arc-folding-card-desc">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="arc-folding-controls">
                  <button
                    type="button"
                    className="arc-folding-arrow"
                    onClick={() => movePrivilegeCarousel(-1)}
                    aria-label={t.previousOffer}
                  >
                    <Arrow reverse rtl={isRtl} />
                  </button>
                  <div className="arc-folding-progress">
                    <div
                      className="arc-folding-progress-bar"
                      style={{
                        width: `${100 / privTotal}%`,
                        insetInlineStart: `${(activePrivilegeSlide * 100) / privTotal}%`,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="arc-folding-arrow"
                    onClick={() => movePrivilegeCarousel(1)}
                    aria-label={t.nextOffer}
                  >
                    <Arrow rtl={isRtl} />
                  </button>
                </div>
              </section>

              {/* SECTION 4 — EXCLUSIVE PRIVILEGES SPLIT 2-COLUMN ACCORDION (Atlantis card-with-accordion___s_Ttnq) */}
              <section className="arc-accordion-section">
                <div className="arc-accordion-container">
                  <div className="arc-accordion-left">
                    <span className="as-breaker-overline">
                      {language === "ar" ? "مزايا حصرية" : "EXCLUSIVE PRIVILEGES"}
                    </span>
                    <h2 className="as-breaker-h3">{catData.privilegesTitle}</h2>
                    <p className="as-breaker-body">
                      {language === "ar"
                        ? "غرفتك هي البداية فقط. إقامتك تمنحك عالماً من مزايا الضيافة في فندق أوز بارك."
                        : "Your room is only the beginning. Your key unlocks a world of OZ Park Hotel benefits to explore."}
                    </p>
                  </div>
                  <div className="arc-accordion-right">
                    {privAccordions.map((acc, idx) => {
                      const isOpen = Boolean(roomPrivilegeAccordions[idx]);
                      return (
                        <div
                          key={acc.id}
                          className={`arc-accordion-item ${isOpen ? "is-open" : ""}`}
                        >
                          <button
                            type="button"
                            className="arc-accordion-trigger"
                            onClick={() => toggleRoomPrivilegeAccordion(idx)}
                            aria-expanded={isOpen}
                          >
                            <span>{acc.title}</span>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="arc-accordion-chevron"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="arc-accordion-panel">
                              {acc.lines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SECTION 5 — UPGRADE YOUR STAY FULL-WIDTH INSET BANNER (Atlantis section-banner___yVaB6G) */}
              <section className="arc-upgrade-section">
                <div className="arc-upgrade-banner">
                  <img
                    src={catData.upgradeBanner.image}
                    alt={catData.upgradeBanner.title}
                    className="arc-upgrade-img"
                  />
                  <div className="arc-upgrade-scrim" />
                  <div className="arc-upgrade-content">
                    <span className="arc-upgrade-overline">
                      {catData.upgradeBanner.eyebrow}
                    </span>
                    <h2 className="arc-upgrade-title">{catData.upgradeBanner.title}</h2>
                    <p className="arc-upgrade-subtitle">{catData.upgradeBanner.subtitle}</p>
                    <button
                      type="button"
                      className="arc-upgrade-btn"
                      onClick={() => {
                        if (catData.upgradeBanner.targetRoomSlug) {
                          openRoomDetailPage(catData.upgradeBanner.targetRoomSlug);
                        } else if (catData.upgradeBanner.targetCategorySlug) {
                          openRoomCategoryPage(catData.upgradeBanner.targetCategorySlug);
                        }
                      }}
                    >
                      {catData.upgradeBanner.buttonLabel}
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 6 — BOTTOM BREADCRUMBS */}
              <nav className="arc-breadcrumbs" aria-label="Breadcrumb">
                <button type="button" onClick={() => navigateToHomeSection("top")}>
                  {language === "ar" ? "الرئيسية" : "Home"}
                </button>
                <span>›</span>
                <button type="button" onClick={openStayPage}>
                  {language === "ar" ? "الإقامة" : "Stay"}
                </button>
                <span>›</span>
                <button type="button" onClick={() => navigateToHomeSection("stay")}>
                  {language === "ar" ? "الغرف والأجنحة" : "Rooms And Suites"}
                </button>
                <span>›</span>
                <span className="is-current">{catData.title}</span>
              </nav>
            </div>
          );
        })()
      ) : activePage === "room-detail" ? (
        /* ============================================================================
           LEVEL 3 — DEDICATED SPECIFIC ROOM DETAIL PAGE (All 7 Rooms & Suites)
           Modeled 1:1 on https://www.atlantis.com/dubai/atlantis-the-palm/stay/rooms-and-suites/deluxe-rooms/deluxe-king-room
           ============================================================================ */
        (() => {
          const room = specificRoomsData[language][activeRoomSlug];
          const parentCat = roomCategoriesPageData[language][room.categorySlug];
          const privWindow = getPrivilegesCarouselWindow();
          const privTotal = roomPrivilegesCarouselData[language].length;
          const privAccordions = roomPrivilegesAccordionData[language];

          return (
            <div className="atlantis-room-detail-page" id={`room-${room.slug}`}>
              {/* SECTION 1 — FULL-VIEWPORT 100VH PRODUCT HERO + 4 BOTTOM KEY-FACT ICONS (Atlantis product-hero___9ynMvW) */}
              <section className="ard-product-hero" aria-label={room.name}>
                <img src={room.heroImage} alt={room.name} className="ard-hero-bg" />
                <div className="ard-hero-scrim" />

                <div className="ard-hero-center">
                  <span className="ard-hero-overline">{room.categoryEyebrow}</span>
                  <h1 className="ard-hero-title">{room.name}</h1>
                  <button
                    type="button"
                    className="ard-hero-book-btn"
                    onClick={() => openWhatsAppBooking(`${room.name} (${parentCat.title})`)}
                  >
                    {language === "ar" ? "احجز" : "Book"}
                  </button>
                </div>

                {/* Bottom Key-Facts Strip with the Exact 4 White Atlantis SVG Icons */}
                <div className="ard-hero-facts-bar">
                  <div className="ard-hero-fact">
                    <AtlantisRoomIcon name="size" stroke="#ffffff" size={24} />
                    <span>{room.size}</span>
                  </div>
                  <div className="ard-hero-fact">
                    <AtlantisRoomIcon name="bed" stroke="#ffffff" size={24} />
                    <span>{room.bed}</span>
                  </div>
                  <div className="ard-hero-fact">
                    <AtlantisRoomIcon name="guests" stroke="#ffffff" size={24} />
                    <span>{room.occupancy}</span>
                  </div>
                  <div className="ard-hero-fact">
                    <AtlantisRoomIcon name="view" stroke="#ffffff" size={24} />
                    <span>{room.view}</span>
                  </div>
                </div>
              </section>

              {/* SECTION 2 — "WAKE UP TO FULL COLOUR" 5-PHOTO ASYMMETRICAL BENTO COLLAGE + VIEW GALLERY (Atlantis gallery___riaSya) */}
              <section className="ard-collage-section" id="room-gallery">
                <div className="ard-collage-header">
                  <h2 className="as-breaker-h3">{room.collageHeading}</h2>
                  <p className="as-breaker-body">{room.collageDescription}</p>
                </div>

                {/* Exact 1073px Asymmetrical 5-Photo Atlantis Bento Layout */}
                <div className="ard-bento-grid">
                  {/* Left Column (496px): Top (496x354) + Bottom (496x301) */}
                  <div className="ard-bento-left-col">
                    <div
                      className="ard-bento-item ard-bento-tl"
                      onClick={() => setRoomGalleryLightboxIndex(0)}
                      role="button"
                      tabIndex={0}
                    >
                      <img src={room.collageImages[0]} alt={`${room.name} 1`} />
                    </div>
                    <div
                      className="ard-bento-item ard-bento-bl"
                      onClick={() => setRoomGalleryLightboxIndex(3)}
                      role="button"
                      tabIndex={0}
                    >
                      <img src={room.collageImages[3]} alt={`${room.name} 4`} />
                    </div>
                  </div>

                  {/* Right Column (561px): Top Row [Middle (321x255) + Right (224x255)] + Bottom Large (561x401) */}
                  <div className="ard-bento-right-col">
                    <div className="ard-bento-top-pair">
                      <div
                        className="ard-bento-item ard-bento-tm"
                        onClick={() => setRoomGalleryLightboxIndex(1)}
                        role="button"
                        tabIndex={0}
                      >
                        <img src={room.collageImages[1]} alt={`${room.name} 2`} />
                      </div>
                      <div
                        className="ard-bento-item ard-bento-tr"
                        onClick={() => setRoomGalleryLightboxIndex(2)}
                        role="button"
                        tabIndex={0}
                      >
                        <img src={room.collageImages[2]} alt={`${room.name} 3`} />
                      </div>
                    </div>
                    <div
                      className="ard-bento-item ard-bento-br"
                      onClick={() => setRoomGalleryLightboxIndex(4)}
                      role="button"
                      tabIndex={0}
                    >
                      <img src={room.collageImages[4]} alt={`${room.name} 5`} />
                    </div>
                  </div>
                </div>

                <div className="ard-collage-actions">
                  <button
                    type="button"
                    className="ard-view-gallery-btn"
                    onClick={() => setRoomGalleryLightboxIndex(0)}
                  >
                    {language === "ar"
                      ? `عرض معرض الصور (${room.allGalleryImages.length})`
                      : "View Gallery"}
                  </button>
                </div>
              </section>

              {/* SECTION 3A — EXCLUSIVE PRIVILEGES FOLDING 5-CARD CAROUSEL */}
              <section className="arc-folding-section" aria-label={room.privilegesTitle}>
                <div className="arc-discover-header">
                  <span className="as-breaker-overline">
                    {language === "ar" ? "مزايا حصرية" : "EXCLUSIVE PRIVILEGES"}
                  </span>
                  <h2 className="as-breaker-h3">{room.privilegesTitle}</h2>
                  <p className="as-breaker-body">
                    {language === "ar"
                      ? "غرفتك هي البداية فقط. إقامتك تمنحك عالماً من مزايا الضيافة في فندق أوز بارك."
                      : "Your room is only the beginning. Your key unlocks a world of OZ Park Hotel benefits to explore."}
                  </p>
                </div>

                <div className="arc-folding-stage">
                  {privWindow.map(({ item, index, offset, isCenter }) => (
                    <div
                      key={`${item.id}-${offset}`}
                      className={`arc-folding-slide arc-folding-offset-${offset} ${
                        isCenter ? "is-center" : ""
                      }`}
                      onClick={() => setActivePrivilegeSlide(index)}
                    >
                      <div className="arc-folding-card-media">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="arc-folding-card-caption">
                        <h3 className="arc-folding-card-title">{item.title}</h3>
                        {isCenter && (
                          <p className="arc-folding-card-desc">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="arc-folding-controls">
                  <button
                    type="button"
                    className="arc-folding-arrow"
                    onClick={() => movePrivilegeCarousel(-1)}
                    aria-label={t.previousOffer}
                  >
                    <Arrow reverse rtl={isRtl} />
                  </button>
                  <div className="arc-folding-progress">
                    <div
                      className="arc-folding-progress-bar"
                      style={{
                        width: `${100 / privTotal}%`,
                        insetInlineStart: `${(activePrivilegeSlide * 100) / privTotal}%`,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="arc-folding-arrow"
                    onClick={() => movePrivilegeCarousel(1)}
                    aria-label={t.nextOffer}
                  >
                    <Arrow rtl={isRtl} />
                  </button>
                </div>
              </section>

              {/* SECTION 3B — EXCLUSIVE PRIVILEGES SPLIT 2-COLUMN ACCORDION (Atlantis card-with-accordion___s_Ttnq) */}
              <section className="arc-accordion-section">
                <div className="arc-accordion-container">
                  <div className="arc-accordion-left">
                    <span className="as-breaker-overline">
                      {language === "ar" ? "مزايا حصرية" : "EXCLUSIVE PRIVILEGES"}
                    </span>
                    <h2 className="as-breaker-h3">{room.privilegesTitle}</h2>
                    <p className="as-breaker-body">
                      {language === "ar"
                        ? "غرفتك هي البداية فقط. إقامتك تمنحك عالماً من مزايا الضيافة في فندق أوز بارك."
                        : "Your room is only the beginning. Your key unlocks a world of OZ Park Hotel benefits to explore."}
                    </p>
                  </div>
                  <div className="arc-accordion-right">
                    {privAccordions.map((acc, idx) => {
                      const isOpen = Boolean(roomPrivilegeAccordions[idx]);
                      return (
                        <div
                          key={acc.id}
                          className={`arc-accordion-item ${isOpen ? "is-open" : ""}`}
                        >
                          <button
                            type="button"
                            className="arc-accordion-trigger"
                            onClick={() => toggleRoomPrivilegeAccordion(idx)}
                            aria-expanded={isOpen}
                          >
                            <span>{acc.title}</span>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="arc-accordion-chevron"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="arc-accordion-panel">
                              {acc.lines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SECTION 4 — SERVICES & AMENITIES 5-ICON STRIP + "VIEW ALL" MODAL BUTTON (Atlantis service-icons-widget___KXjeNW) */}
              <section className="ard-amenities-section" id="room-amenities">
                <div className="ard-amenities-header">
                  <span className="as-breaker-overline">
                    {language === "ar" ? "الخدمات ووسائل الراحة" : "SERVICES & AMENITIES"}
                  </span>
                  <h2 className="as-breaker-h3">
                    {language === "ar" ? "كل ما تحتاجه وأكثر" : "Everything you need & more"}
                  </h2>
                </div>

                <div className="ard-amenities-strip">
                  <div className="ard-amenities-icons-row">
                    {room.featuredAmenities.map((am) => (
                      <div key={am.label} className="ard-amenity-icon-card">
                        <div className="ard-amenity-svg-wrap">
                          <AtlantisRoomIcon name={am.icon} stroke="#2559a8" size={40} />
                        </div>
                        <p className="ard-amenity-label">{am.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="ard-amenities-divider" aria-hidden="true" />

                  <button
                    type="button"
                    className="ard-view-all-btn"
                    onClick={() => setRoomAmenitiesModalOpen(true)}
                  >
                    <div className="ard-amenity-svg-wrap">
                      <AtlantisRoomIcon name="view-all" stroke="#2559a8" size={40} />
                    </div>
                    <span className="ard-view-all-text">
                      {language === "ar" ? "عرض الكل" : "View all"}
                    </span>
                  </button>
                </div>
              </section>

              {/* SECTION 5 — UPGRADE YOUR STAY FULL-WIDTH INSET BANNER */}
              <section className="arc-upgrade-section">
                <div className="arc-upgrade-banner">
                  <img
                    src={room.upgradeBanner.image}
                    alt={room.upgradeBanner.title}
                    className="arc-upgrade-img"
                  />
                  <div className="arc-upgrade-scrim" />
                  <div className="arc-upgrade-content">
                    <span className="arc-upgrade-overline">
                      {room.upgradeBanner.eyebrow}
                    </span>
                    <h2 className="arc-upgrade-title">{room.upgradeBanner.title}</h2>
                    <p className="arc-upgrade-subtitle">{room.upgradeBanner.subtitle}</p>
                    <button
                      type="button"
                      className="arc-upgrade-btn"
                      onClick={() => openRoomDetailPage(room.upgradeBanner.targetRoomSlug)}
                    >
                      {room.upgradeBanner.buttonLabel}
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 6 — "BOOK DIRECT" SPLIT PROMOTIONAL BANNER CARD (Atlantis promotional-banner___yyQQcq) */}
              <section className="ard-promo-section">
                <div className="ard-promo-card">
                  <div className="ard-promo-card-left">
                    <span className="as-breaker-overline">
                      {language === "ar" ? "مزايا حصرية" : "EXCLUSIVE PRIVILEGES"}
                    </span>
                    <h3 className="ard-promo-card-title">
                      {language === "ar" ? "احجز مباشرة" : "Book direct"}
                    </h3>
                    <p className="ard-promo-card-desc">
                      {language === "ar"
                        ? "احجز مباشرة مع فندق أوز بارك للاستمتاع بمزايا حصرية تشمل خصم 10% في مطعم ديوان مدى ومقهى أوز بارك، وأولوية اختيار الغرف، وخصم يصل إلى 35% على الإقامات الطويلة."
                        : "Book direct to enjoy exclusive privileges, including 10% off at Diwan Mada Restaurant and OZ Park Café, priority room selection, and up to 35% off extended stays."}
                    </p>
                    <div className="as-package-card-actions">
                      <button
                        type="button"
                        className="as-package-book-btn"
                        onClick={() => openWhatsAppBooking(`${room.name} — Direct Booking`)}
                      >
                        {language === "ar" ? "احجز" : "Book"}
                      </button>
                      <button
                        type="button"
                        className="as-package-explore-link"
                        onClick={openOffer3Page}
                      >
                        {language === "ar" ? "استكشف" : "Explore"}
                      </button>
                    </div>
                  </div>
                  <div className="ard-promo-card-right">
                    <img
                      src="/images/ozpark/tour-south-corniche-sunset.png"
                      alt="OZ Park Hotel Al Qunfudhah"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 7 — BOTTOM BREADCRUMBS */}
              <nav className="arc-breadcrumbs" aria-label="Breadcrumb">
                <button type="button" onClick={() => navigateToHomeSection("top")}>
                  {language === "ar" ? "الرئيسية" : "Home"}
                </button>
                <span>›</span>
                <button type="button" onClick={openStayPage}>
                  {language === "ar" ? "الإقامة" : "Stay"}
                </button>
                <span>›</span>
                <button type="button" onClick={() => navigateToHomeSection("stay")}>
                  {language === "ar" ? "الغرف والأجنحة" : "Rooms And Suites"}
                </button>
                <span>›</span>
                <button type="button" onClick={() => openRoomCategoryPage(room.categorySlug)}>
                  {parentCat.title}
                </button>
                <span>›</span>
                <span className="is-current">{room.name}</span>
              </nav>
            </div>
          );
        })()
      ) : null}

      {/* SECTION 7 (HOMEPAGE SECTION 5) — STANDARD OZ PARK HOTEL WEBSITE FOOTER */}
      <footer id="contact">
        <div className="footer-top">
          <div className="footer-brand-block">
            <a
              href="#top"
              className="wordmark light"
              onClick={(e) => {
                e.preventDefault();
                navigateToHomeSection("top");
              }}
            >
              <span>OZ</span> PARK
            </a>
            <p className="footer-brand-name">{t.footerBrand}</p>
          </div>
          <p className="footer-brand-desc">{t.footerBrandDesc}</p>
        </div>

        <div className="footer-grid footer-grid-4">
          <div>
            <span className="footer-label">{t.footerLocationLabel}</span>
            <p>{t.footerLocation}</p>
            <a
              href="https://maps.app.goo.gl/zRvuGZScjiddZ69y9"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "var(--gold-light)", display: "inline-block", marginTop: "8px" }}
            >
              Google Maps
            </a>
            <div style={{ marginTop: "14px" }}>
              <a href="tel:+966500955877">+966 50 095 5877</a>
              <a href="mailto:info@ozpark.sa">info@ozpark.sa</a>
              <a href="mailto:reservations@ozpark.sa">reservations@ozpark.sa</a>
            </div>
          </div>

          <div>
            <span className="footer-label">{t.footerNavLabel}</span>
            {t.footerNavLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if ("isWedding" in item && item.isWedding) {
                    openWeddingPage();
                  } else if ("slideIndex" in item && item.slideIndex === 0) {
                    openStayPage();
                  } else if ("slideIndex" in item && item.slideIndex === 1) {
                    openDiningPage();
                  } else if ("slideIndex" in item && item.slideIndex === 2) {
                    openCafePage();
                  } else if ("slideIndex" in item && item.slideIndex === 3) {
                    openMeetingPage();
                  } else if ("slideIndex" in item && typeof item.slideIndex === "number") {
                    navigateToHomeSection("signature", item.slideIndex);
                  } else {
                    navigateToHomeSection(item.href.replace(/^#/, ""));
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div>
            <span className="footer-label">{t.footerAdditionalLabel}</span>
            <a
              href="#stay"
              onClick={(e) => {
                e.preventDefault();
                navigateToHomeSection("stay");
              }}
            >
              {t.footerBookLink}
            </a>
            <button type="button" className="footer-link-btn" onClick={() => setLegalModal("privacy")}>
              {t.footerPrivacyLink}
            </button>
            <button type="button" className="footer-link-btn" onClick={() => setLegalModal("terms")}>
              {t.footerTermsLink}
            </button>
          </div>

          <div>
            <span className="footer-label">{t.footerSocialLabel}</span>
            <a href="https://www.instagram.com/ozpark.sa" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://www.tiktok.com/@ozpark.sa" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            <a href="https://www.snapchat.com/add/ozpark.sa" target="_blank" rel="noopener noreferrer">
              Snapchat
            </a>
            <a href="https://www.facebook.com/ozpark.sa" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://x.com/ozpark_sa" target="_blank" rel="noopener noreferrer">
              X
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.copyright}</span>
          <span>Al Qunfudhah, Red Sea — Saudi Arabia</span>
        </div>
      </footer>

      {/* FULL-SCREEN LIGHTBOX FOR WEDDING ROOM GALLERY */}
      {fullscreenPhotoIndex !== null && (
        <div
          className="aw-lightbox-backdrop"
          onClick={() => setFullscreenPhotoIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="aw-lightbox-close"
            onClick={() => setFullscreenPhotoIndex(null)}
          >
            {t.modalClose}
          </button>

          <button
            type="button"
            className="aw-lightbox-arrow aw-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              moveFullscreenPhoto(-1);
            }}
            aria-label={t.weddingGalleryPrev}
          >
            <Arrow reverse rtl={isRtl} />
          </button>

          <div className="aw-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={weddingGallery[fullscreenPhotoIndex].src}
              alt={weddingGallery[fullscreenPhotoIndex].title}
            />
            <div className="aw-lightbox-meta">
              <span>
                {fullscreenPhotoIndex + 1} / {weddingGallery.length}
              </span>
              <h3>{weddingGallery[fullscreenPhotoIndex].title}</h3>
              <p>{weddingGallery[fullscreenPhotoIndex].caption}</p>
            </div>
          </div>

          <button
            type="button"
            className="aw-lightbox-arrow aw-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              moveFullscreenPhoto(1);
            }}
            aria-label={t.weddingGalleryNext}
          >
            <Arrow rtl={isRtl} />
          </button>
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX FOR OFFER 2 HIGH-RESOLUTION PHOTOS */}
      {offer2Lightbox && (
        <div
          className="aw-lightbox-backdrop"
          onClick={() => setOffer2Lightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="aw-lightbox-close"
            onClick={() => setOffer2Lightbox(null)}
          >
            {t.modalClose}
          </button>

          <div className="aw-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={offer2Lightbox.src} alt={offer2Lightbox.title} />
            <div className="aw-lightbox-meta">
              <h3>{offer2Lightbox.title}</h3>
              {offer2Lightbox.caption && <p>{offer2Lightbox.caption}</p>}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED OFFER DETAILS & CONDITIONS MODAL (Offers 2, 3, 4) */}
      {selectedOfferModal && (
        <div className="modal-backdrop" onClick={() => setSelectedOfferModal(null)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedOfferModal(null)}>
              {t.modalClose}
            </button>
            <p className="eyebrow">{selectedOfferModal.subtitle}</p>
            <h2>{selectedOfferModal.title}</h2>
            <div className="modal-gallery">
              {selectedOfferModal.gallery.map((img, i) => (
                <img key={img} src={img} alt={`${selectedOfferModal.title} ${i + 1}`} />
              ))}
            </div>
            {selectedOfferModal.details.map((paragraph, index) => (
              <p key={index} className="modal-desc">
                {paragraph}
              </p>
            ))}
            <div className="modal-columns">
              <div>
                <h4>{selectedOfferModal.highlightsTitle}</h4>
                <ul>
                  {selectedOfferModal.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{selectedOfferModal.conditionsTitle}</h4>
                <ul>
                  {selectedOfferModal.conditions.map((cond) => (
                    <li key={cond}>{cond}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              className="modal-book-btn"
              onClick={() => openWhatsAppBooking(`${selectedOfferModal.title} (${selectedOfferModal.subtitle})`)}
            >
              {t.modalBookCta} <Arrow rtl={isRtl} />
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED EXPERIENCE SLIDE MODAL */}
      {selectedSlideModal && (
        <div className="modal-backdrop" onClick={() => setSelectedSlideModal(null)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedSlideModal(null)}>
              {t.modalClose}
            </button>
            <p className="eyebrow">{selectedSlideModal.modalSubtitle ?? selectedSlideModal.category}</p>
            <h2>{selectedSlideModal.title}</h2>
            {selectedSlideModal.gallery && (
              <div className="modal-gallery">
                {selectedSlideModal.gallery.map((img, i) => (
                  <img key={img} src={img} alt={`${selectedSlideModal.title} ${i + 1}`} />
                ))}
              </div>
            )}
            {(selectedSlideModal.modalDetails ?? [selectedSlideModal.copy]).map((paragraph, index) => (
              <p key={index} className="modal-desc">
                {paragraph}
              </p>
            ))}
            {selectedSlideModal.modalHighlights && (
              <div className="modal-columns" style={{ gridTemplateColumns: "1fr" }}>
                <div>
                  <h4>{t.modalAmenitiesTitle}</h4>
                  <ul>
                    {selectedSlideModal.modalHighlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <button
              type="button"
              className="modal-book-btn"
              onClick={() => openWhatsAppBooking(selectedSlideModal.modalSubtitle ?? selectedSlideModal.title)}
            >
              {t.modalBookCta} <Arrow rtl={isRtl} />
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED ACCOMMODATION CATEGORY MODAL (Rooms / Studios / Suites) */}
      {selectedCategoryModal && (
        <div className="modal-backdrop" onClick={() => setSelectedCategoryModal(null)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedCategoryModal(null)}>
              {t.modalClose}
            </button>
            <p className="eyebrow">{selectedCategoryModal.subtitle}</p>
            <h2>{selectedCategoryModal.title}</h2>
            <p className="modal-desc">{selectedCategoryModal.overview}</p>

            <div className="modal-gallery">
              {selectedCategoryModal.gallery.map((img, i) => (
                <img key={img} src={img} alt={`${selectedCategoryModal.title} ${i + 1}`} />
              ))}
            </div>

            <div className="modal-subrooms">
              <h4>{t.modalIncludedRoomsTitle}</h4>
              <div className="modal-subrooms-grid">
                {selectedCategoryModal.subRooms.map((sr) => (
                  <div className="modal-subroom-card" key={sr.name}>
                    <img src={sr.image} alt={sr.name} />
                    <div>
                      <h5>{sr.name}</h5>
                      <p className="modal-subroom-meta">
                        {sr.size} • {sr.occupancy} • {sr.bed} • {sr.view}
                      </p>
                      <p>{sr.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-columns" style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <h4>{t.modalAmenitiesTitle}</h4>
                <ul>
                  {selectedCategoryModal.amenities.map((am) => (
                    <li key={am}>{am}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              className="modal-book-btn"
              onClick={() => openWhatsAppBooking(selectedCategoryModal.title)}
            >
              {t.modalBookCta} <Arrow rtl={isRtl} />
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY / TERMS MODAL */}
      {legalModal && (
        <div className="modal-backdrop" onClick={() => setLegalModal(null)} role="dialog" aria-modal="true">
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setLegalModal(null)}>
              {t.modalClose}
            </button>
            <p className="eyebrow">OZ PARK HOTEL</p>
            <h2>{legalModal === "privacy" ? t.privacyTitle : t.termsTitle}</h2>
            <p className="modal-desc">{legalModal === "privacy" ? t.privacyBody : t.termsBody}</p>
          </div>
        </div>
      )}

      {/* ROOM SERVICES & AMENITIES "VIEW ALL" 2-COLUMN MODAL (Atlantis list-modal___H6CaxG) */}
      {roomAmenitiesModalOpen && (
        <div
          className="ard-list-modal-backdrop"
          onClick={() => setRoomAmenitiesModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="ard-list-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ard-list-modal-close"
              onClick={() => setRoomAmenitiesModalOpen(false)}
              aria-label={t.modalClose}
            >
              ✕
            </button>
            <span className="as-breaker-overline">
              {language === "ar" ? "الخدمات ووسائل الراحة" : "SERVICES & AMENITIES"}
            </span>
            <h3 className="ard-list-modal-title">
              {language === "ar" ? "كل ما تحتاجه وأكثر" : "Everything you need & more"}
            </h3>

            <div className="ard-list-modal-grid">
              {specificRoomsData[language][activeRoomSlug].allAmenities.map((am) => (
                <div key={am.label} className="ard-list-modal-item">
                  <AtlantisRoomIcon name={am.icon} stroke="#2559a8" size={24} />
                  <span>{am.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX FOR SPECIFIC ROOM PHOTO GALLERY */}
      {roomGalleryLightboxIndex !== null &&
        (() => {
          const room = specificRoomsData[language][activeRoomSlug];
          const imgs = room.allGalleryImages;
          const safeIdx = ((roomGalleryLightboxIndex % imgs.length) + imgs.length) % imgs.length;
          return (
            <div
              className="aw-lightbox-backdrop"
              onClick={() => setRoomGalleryLightboxIndex(null)}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="aw-lightbox-close"
                onClick={() => setRoomGalleryLightboxIndex(null)}
              >
                {t.modalClose}
              </button>

              <button
                type="button"
                className="aw-lightbox-arrow aw-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setRoomGalleryLightboxIndex((safeIdx - 1 + imgs.length) % imgs.length);
                }}
                aria-label={t.weddingGalleryPrev}
              >
                <Arrow reverse rtl={isRtl} />
              </button>

              <div className="aw-lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={imgs[safeIdx]} alt={`${room.name} ${safeIdx + 1}`} />
                <div className="aw-lightbox-meta">
                  <span>
                    {safeIdx + 1} / {imgs.length}
                  </span>
                  <h3>{room.name}</h3>
                  <p>
                    {room.size} • {room.bed} • {room.occupancy} • {room.view}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="aw-lightbox-arrow aw-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setRoomGalleryLightboxIndex((safeIdx + 1) % imgs.length);
                }}
                aria-label={t.weddingGalleryNext}
              >
                <Arrow rtl={isRtl} />
              </button>
            </div>
          );
        })()}
    </main>
  );
}
