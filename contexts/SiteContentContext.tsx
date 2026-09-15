"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface PrivacyContent {
    title_en: string;
    title_ar: string;
    last_updated: string;
    content_en: string;
    content_ar: string;
}

export interface TermsContent {
    title_en: string;
    title_ar: string;
    last_updated: string;
    content_en: string;
    content_ar: string;
}

export interface ContactContent {
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    email: string;
    phone: string;
    whatsapp: string;
    address_en: string;
    address_ar: string;
    working_hours_en: string;
    working_hours_ar: string;
}

export interface SiteContent {
    privacy: PrivacyContent;
    terms: TermsContent;
    contact: ContactContent;
}

const DEFAULT_SITE_CONTENT: SiteContent = {
    privacy: {
        title_en: "Privacy Policy",
        title_ar: "سياسة الخصوصية",
        last_updated: "September 2026",
        content_en: `At CLOUDS, we respect your privacy and are committed to protecting your personal information.

1. Information We Collect
We collect personal information necessary to fulfill your orders, including your name, delivery address, phone number, and email address.

2. Age Verification (21+)
Because we sell vape hardware and adult lifestyle products, we may collect and verify date of birth or age confirmation in compliance with regulations.

3. How We Use Your Data
Your information is used strictly for processing, delivering, and tracking your orders, providing customer care, and sending order confirmation updates via SMS, email, or WhatsApp.

4. Data Security
We employ industry-standard encryption and strict administrative safeguards to protect your personal information against unauthorized access, loss, or misuse.

5. Cookies & Analytics
We use essential cookies to maintain your shopping cart, language settings, and theme preferences.`,
        content_ar: `نحن في كلودز (CLOUDS) نولي أهمية قصوى لخصوصيتك ونلتزم بحماية بياناتك الشخصية.

١. المعلومات التي نجمعها
نقوم بجمع المعلومات اللازمة فقط لإتمام طلباتك وشحنها إليك، مثل الاسم، عنوان التوصيل، رقم الهاتف، والبريد الإلكتروني.

٢. التحقق من السن القانوني (٢١ عاماً فأكثر)
نظراً لطبيعة منتجات الفيب المخصصة للبالغين، نقوم بتأكيد السن القانوني للعميل بما يتوافق مع القوانين واللوائح المعمول بها.

٣. كيفية استخدام بياناتك
تُستخدم بياناتك فقط في تجهيز الطلبات، شحنها، تتبع الشحنة، والتواصل معك عبر الواتساب أو البريد الإلكتروني لتأكيد التسليم.

٤. أمان وحماية البيانات
نستخدم أعلى معايير التشفير التقنية لحماية معلوماتك ومنع أي وصول غير مصرح به إليها.

٥. ملفات تعريف الارتباط
نستخدم ملفات تعريف الارتباط الأساسية لحفظ محتويات سلة التسوق واختيارات اللغة والمظهر.`
    },
    terms: {
        title_en: "Terms of Service",
        title_ar: "الشروط والأحكام",
        last_updated: "September 2026",
        content_en: `Welcome to CLOUDS Store. By accessing or using our website, you agree to comply with and be bound by the following terms.

1. Age Requirement (Strictly 21+)
You must be at least 21 years of age to purchase products on this platform. Vaping products contain nicotine, an addictive chemical. We strictly prohibit sales to minors.

2. Product Authenticity & Warranty
All devices, tanks, and e-liquids sold on CLOUDS are 100% genuine and sourced directly from certified manufacturers. Hardware includes an original manufacturer defect warranty valid for 14 days from delivery.

3. Orders & Payment
Orders placed on our website are confirmed via SMS/WhatsApp. We accept Cash on Delivery (COD), Instapay, and secure debit/credit card payments.

4. Delivery & Inspection
Shipments are dispatched within 24 to 48 hours. Customers are encouraged to inspect the exterior seal upon receiving the delivery from our courier.

5. Returns & Exchange Policy
Due to health and hygiene standards, opened e-liquids and used coils cannot be returned. Faulty or damaged sealed items may be exchanged within 14 days of delivery.`,
        content_ar: `أهلاً بك في متجر كلودز (CLOUDS). يرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام المتجر أو إتمام أي طلب.

١. شرط السن القانوني (٢١ عاماً فأكثر فقط)
يُشترط أن لا يقل عمر العميل عن ٢١ عاماً لشراء أي منتج من منتجاتنا. منتجات الفيب تحتوي على النيكوتين وهي مخصصة للبالغين فقط.

٢. أصالة المنتجات والضمان
جميع الأجهزة والنكهات والملحقات المعروضة في كلودز أصلية ١٠٠٪ ومضمونة من الشركات المصنعة مع ضمان استبدال ضد عيوب الصناعة لمدة ١٤ يوماً.

٣. الطلبات والدفع
يتم تأكيد الطلبات فور إتمامها عبر الواتساب أو البريد الإلكتروني. نوفر خدمة الدفع عند الاستلام، إنستاباي، والبطاقات البنكية.

٤. مدة الشحن والتوصيل
يتم توصيل الطلبات خلال ٢٤ إلى ٤٨ ساعة لجميع المحافظات مع إمكانية معاينة الطرد والتأكد من بيانات الشحنة عند الاستلام.

٥. سياسة الاستبدال والاسترجاع
وفقاً للمعايير الصحية، لا يمكن إرجاع أو استبدال السوائل المفتوحة أو الكويلات المستعملة. يُقبل الاستبدال للأجهزة المعيبة أو المغلقة بحالتها الأصلية خلال ١٤ يوماً.`
    },
    contact: {
        title_en: "Contact Us",
        title_ar: "تواصل معنا",
        subtitle_en: "Have questions about our devices, juices, or an existing order? We are here to help.",
        subtitle_ar: "هل لديك أي استفسار حول أجهزتنا، النكهات، أو حالة طلبك؟ فريقنا يسعد بخدمتك دائماً.",
        email: "support@clouds.com",
        phone: "+20 109 000 0000",
        whatsapp: "+20 109 000 0000",
        address_en: "Nasr City, Cairo, Egypt",
        address_ar: "مدينة نصر، القاهرة، مصر",
        working_hours_en: "Everyday 10:00 AM - 12:00 AM",
        working_hours_ar: "يومياً من 10:00 صباحاً حتى 12:00 منتصف الليل"
    }
};

interface SiteContentContextType {
    content: SiteContent;
    updateSection: <K extends keyof SiteContent>(section: K, data: SiteContent[K]) => Promise<boolean>;
    isLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Load from localStorage if present
        try {
            const cached = localStorage.getItem("clouds-site-content");
            if (cached) {
                const parsed = JSON.parse(cached);
                setContent((prev) => ({
                    privacy: { ...prev.privacy, ...parsed.privacy },
                    terms: { ...prev.terms, ...parsed.terms },
                    contact: { ...prev.contact, ...parsed.contact },
                }));
            }
        } catch {
            // ignore
        }

        // 2. Fetch from Supabase site_pages table if it exists
        const fetchRemote = async () => {
            try {
                const { data, error } = await supabase.from("site_pages").select("*");
                if (!error && data && data.length > 0) {
                    const newContent: any = {};
                    data.forEach((row) => {
                        if (row.slug === "privacy" || row.slug === "terms") {
                            newContent[row.slug] = {
                                title_en: row.title_en,
                                title_ar: row.title_ar,
                                last_updated: row.metadata?.last_updated || "September 2026",
                                content_en: row.content_en,
                                content_ar: row.content_ar,
                            };
                        } else if (row.slug === "contact") {
                            newContent.contact = {
                                title_en: row.title_en,
                                title_ar: row.title_ar,
                                subtitle_en: row.metadata?.subtitle_en || "",
                                subtitle_ar: row.metadata?.subtitle_ar || "",
                                email: row.metadata?.email || "support@clouds.com",
                                phone: row.metadata?.phone || "+20 109 000 0000",
                                whatsapp: row.metadata?.whatsapp || "+20 109 000 0000",
                                address_en: row.metadata?.address_en || "Cairo, Egypt",
                                address_ar: row.metadata?.address_ar || "القاهرة، مصر",
                                working_hours_en: row.metadata?.working_hours_en || "Everyday 10:00 AM - 12:00 AM",
                                working_hours_ar: row.metadata?.working_hours_ar || "يومياً من 10:00 صباحاً حتى 12:00 منتصف الليل",
                            };
                        }
                    });

                    setContent((prev) => {
                        const merged = {
                            privacy: newContent.privacy ? { ...prev.privacy, ...newContent.privacy } : prev.privacy,
                            terms: newContent.terms ? { ...prev.terms, ...newContent.terms } : prev.terms,
                            contact: newContent.contact ? { ...prev.contact, ...newContent.contact } : prev.contact,
                        };
                        try {
                            localStorage.setItem("clouds-site-content", JSON.stringify(merged));
                        } catch {}
                        return merged;
                    });
                }
            } catch (err) {
                console.warn("Could not fetch remote site_pages, using local fallback", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRemote();
    }, []);

    const updateSection = async <K extends keyof SiteContent>(section: K, data: SiteContent[K]): Promise<boolean> => {
        try {
            const updated = { ...content, [section]: data };
            setContent(updated);
            try {
                localStorage.setItem("clouds-site-content", JSON.stringify(updated));
                // broadcast to other tabs/windows
                window.dispatchEvent(new CustomEvent("clouds-content-updated", { detail: { section, data } }));
            } catch {}

            // Try to persist to Supabase site_pages table
            try {
                let payload: any = {};
                if (section === "privacy" || section === "terms") {
                    const sec = data as PrivacyContent | TermsContent;
                    payload = {
                        slug: section,
                        title_en: sec.title_en,
                        title_ar: sec.title_ar,
                        content_en: sec.content_en,
                        content_ar: sec.content_ar,
                        metadata: { last_updated: sec.last_updated },
                        updated_at: new Date().toISOString(),
                    };
                } else if (section === "contact") {
                    const sec = data as ContactContent;
                    payload = {
                        slug: "contact",
                        title_en: sec.title_en,
                        title_ar: sec.title_ar,
                        content_en: sec.subtitle_en,
                        content_ar: sec.subtitle_ar,
                        metadata: {
                            subtitle_en: sec.subtitle_en,
                            subtitle_ar: sec.subtitle_ar,
                            email: sec.email,
                            phone: sec.phone,
                            whatsapp: sec.whatsapp,
                            address_en: sec.address_en,
                            address_ar: sec.address_ar,
                            working_hours_en: sec.working_hours_en,
                            working_hours_ar: sec.working_hours_ar,
                        },
                        updated_at: new Date().toISOString(),
                    };
                }

                await supabase.from("site_pages").upsert(payload, { onConflict: "slug" });
            } catch (err) {
                console.warn("Supabase upsert failed, stored in localStorage cache", err);
            }

            return true;
        } catch (error) {
            console.error("Failed to update section:", error);
            return false;
        }
    };

    return (
        <SiteContentContext.Provider value={{ content, updateSection, isLoading }}>
            {children}
        </SiteContentContext.Provider>
    );
}

export function useSiteContent() {
    const context = useContext(SiteContentContext);
    if (!context) {
        throw new Error("useSiteContent must be used within a SiteContentProvider");
    }
    return context;
}
