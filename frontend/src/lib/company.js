export const COMPANY = {
    name: "NilayNarayan Polychem LLP",
    shortName: "NN Polychem",
    tagline: "Integrated Hazardous Waste Management & Environmental Solutions",
    phone: "+91-98XXX-XXXXX",
    phoneRaw: "+919800000000",
    whatsapp: "919800000000",
    email: "info@nilaynarayan.com",
    address: {
        line1: "Plot No. XX, GIDC Industrial Estate",
        line2: "Ankleshwar, Gujarat 393002, India",
    },
    cin: "AAA-0000",
    gst: "24AAAAA0000A1Z5",
};

export const whatsappHref = (msg = "Hello, I would like to enquire about your services.") =>
    `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`;
