export type CityData = {
    name: string;
    slug: string;
    address: string;
    phone: string;
    email: string;
};

export const defaultCity: CityData = {
    name: "Panchachuli",
    slug: "panchachuli",
    address: "Munsyari, Uttarakhand, India",
    phone: "+91 98979 19761",
    email: "info@flypanchachuli.com",
};

export const adventureCities: CityData[] = [
    {
        name: "Kotabagh",
        slug: "kotabagh",
        address: "Nainital district of Uttarakhand, India",
        phone: "+971 50 123 4567",
        email: "info@flydubai-adventure.com",
    },
    {
        name: "Bir Billing",
        slug: "bir-billing",
        address: "Himachal Pradesh, India",
        phone: "+971 50 123 4567",
        email: "info@flydubai-adventure.com",
    },
    {
        name: "Dubai",
        slug: "dubai",
        address: "Dubai Marina, Dubai, UAE",
        phone: "+971 50 123 4567",
        email: "info@flydubai-adventure.com",
    },
    {
        name: "Manali",
        slug: "manali",
        address: "Solang Valley, Manali, Himachal Pradesh, India",
        phone: "+91 98765 43211",
        email: "info@flymanali.com",
    },
    {
        name: "Rishikesh",
        slug: "rishikesh",
        address: "Tapovan, Rishikesh, Uttarakhand, India",
        phone: "+91 98765 43212",
        email: "info@flyrishikesh.com",
    },
    {
        name: "Leh",
        slug: "leh",
        address: "Main Bazaar, Leh, Ladakh, India",
        phone: "+91 98765 43213",
        email: "info@flyleh.com",
    },
    {
        name: "Goa",
        slug: "goa",
        address: "Arambol Beach, Goa, India",
        phone: "+91 98765 43214",
        email: "info@flygoa.com",
    },
];

export const getCityBySlug = (slug?: string): CityData => {
    if (!slug) return defaultCity;
    const found = adventureCities.find((c) => c.slug === slug);
    return found || {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        address: `Central, ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
        phone: defaultCity.phone,
        email: `info@fly${slug}.com`,
    };
};
