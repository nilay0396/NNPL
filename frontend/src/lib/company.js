export const COMPANY = {
    name: "NilayNarayan Polychem LLP",
    shortName: "NN Polychem",
    tagline: "Integrated Hazardous Waste Management & Environmental Solutions",
    logo: "/logo.jpg",
    phones: [
        { label: "Sales", number: "+91 91994 39902", raw: "+919199439902" },
        { label: "Operations", number: "+91 80843 71124", raw: "+918084371124" },
        { label: "Compliance", number: "+91 82925 84106", raw: "+918292584106" },
    ],
    // primary shortcuts (Sales = primary; WhatsApp bound to Sales line)
    phone: "+91 91994 39902",
    phoneRaw: "+919199439902",
    whatsapp: "919199439902",
    email: "nilaynarayanpolychem@gmail.com",
    address: {
        line1: "Plot No. D-167 (P), 4-5, Kandra Industrial Area",
        line2: "Govindpur, Dhanbad, Jharkhand – 828109, India",
        city: "Govindpur, Jharkhand",
        mapsQuery: "Nilaynarayan Polychem LLP, Plot no D-167 (P), 4-5, Kandra Industrial Area, Govindpur, Dhanbad, Jharkhand 828109, India",
    },
    pan: "AAMFN8830F",
    gst: "20AAMFN8830F1ZD",
    cin: "LLP · Regd. MCA",
};

export const whatsappHref = (msg = "Hello NN Polychem, I would like to enquire about your services.") =>
    `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;
