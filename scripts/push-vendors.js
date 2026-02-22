const admin = require('firebase-admin');
const serviceAccount = require('../visual-africazero-firebase-adminsdk-fbsvc-82022786aa.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const vendors = [
    {
        name: "Estare Haven Ushers",
        slug: "estare-haven-ushers",
        location: "Osogbo, Osun State",
        categories: ["Experiences", "Event Planners"],
        description: "A specialized ushering company providing professional ushers for weddings, burials, corporate events, and birthday parties.",
        shortDescription: "Professional ushering services for all event types.",
        rating: 4.8,
        price: "₦50,000+",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
        featured: true,
        eventThemes: ["Wedding", "Corporate Event", "Social Gathering"],
        gallery: [],
        whatsIncluded: ["Professional Ushers", "Event Coordination Assistance", "Guest Management"],
        services: ["Ushering", "Guest Protocol", "Event Support"],
        stats: {
            eventsPlanned: "150+",
            satisfiedClients: "200+",
            corporateEvents: "40+",
            yearsExperience: "5",
            uniqueLocations: "10"
        },
        phone: "+2348000000001",
        areaServed: ["Osun", "Oyo", "Lagos"],
        yearEstablished: 2019,
        responseTime: "within 2 hours",
        vendor: {
            name: "Estare Haven",
            logo: "https://api.dicebear.com/7.x/initials/svg?seed=EH",
            since: "2019"
        }
    },
    {
        name: "ACE-Olivia Hall",
        slug: "ace-olivia-hall",
        location: "Onikan, Lagos State",
        categories: ["Venues", "Event Planners"],
        description: "An event center offering consultancy, management, planning, and ushering solution services in the heart of Lagos.",
        shortDescription: "Premium event venue and management in Onikan.",
        rating: 4.9,
        price: "₦1,500,000+",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2048&auto=format&fit=crop",
        featured: true,
        eventThemes: ["Wedding", "Corporate Event", "Anniversary"],
        gallery: [],
        whatsIncluded: ["Main Hall Access", "AC & Lighting", "Security", "Backup Power"],
        services: ["Venue Rental", "Event Planning", "Consultancy"],
        stats: {
            eventsPlanned: "500+",
            satisfiedClients: "450+",
            corporateEvents: "120+",
            yearsExperience: "12",
            uniqueLocations: "1"
        },
        phone: "+2348000000002",
        areaServed: ["Lagos"],
        yearEstablished: 2012,
        responseTime: "within 1 hour",
        vendor: {
            name: "ACE-Olivia",
            logo: "https://api.dicebear.com/7.x/initials/svg?seed=AO",
            since: "2012"
        }
    },
    {
        name: "Ace55 Events",
        slug: "ace55-events",
        location: "Isolo, Lagos State",
        categories: ["Event Planners"],
        description: "Offers a complete package in event management including planning, budgeting, guest proposals, and vendor deployment.",
        shortDescription: "Full-service event management and budgeting.",
        rating: 4.7,
        price: "₦200,000+",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Social Gathering", "Bachelor", "Bachelorette"],
        gallery: [],
        whatsIncluded: ["Budget Planning", "Vendor Coordination", "On-site Logistics"],
        services: ["Event Management", "Budgeting", "Vendor Sourcing"],
        stats: {
            eventsPlanned: "85",
            satisfiedClients: "80",
            corporateEvents: "15",
            yearsExperience: "4",
            uniqueLocations: "5"
        },
        phone: "+2348000000003",
        areaServed: ["Lagos", "Ogun"],
        yearEstablished: 2020,
        responseTime: "within 4 hours",
        vendor: {
            name: "Ace55",
            since: "2020"
        }
    },
    {
        name: "Ava Events and Decorators Ltd",
        slug: "ava-events-decorators",
        location: "Lekki, Lagos State",
        categories: ["Decorations", "Event Planners"],
        description: "Provides professional event planning, luxury decorations, and comprehensive event management services.",
        shortDescription: "Luxury event decor and planning in Lekki.",
        rating: 4.9,
        price: "₦500,000+",
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2070&auto=format&fit=crop",
        featured: true,
        eventThemes: ["Wedding", "Proposals", "Bridal"],
        gallery: [],
        whatsIncluded: ["Themed Decor", "Floral Arrangements", "Lighting Setup"],
        services: ["Decoration", "Event Planning", "Luxury Rentals"],
        stats: {
            eventsPlanned: "120",
            satisfiedClients: "115",
            corporateEvents: "30",
            yearsExperience: "7",
            uniqueLocations: "12"
        },
        phone: "+2348000000004",
        areaServed: ["Lagos (Island)"],
        yearEstablished: 2017,
        responseTime: "within 2 hours",
        vendor: {
            name: "Ava Events",
            since: "2017"
        }
    },
    {
        name: "Bluetooth Catering",
        slug: "bluetooth-catering",
        location: "Ibadan, Oyo State",
        categories: ["Catering", "Event Planners"],
        description: "Specializes in event planning and catering services for weddings, burials, and formal dinners with a focus on local delicacies.",
        shortDescription: "Top-tier catering and planning in Ibadan.",
        rating: 4.6,
        price: "₦150,000+",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Social Gathering", "Wedding", "Anniversary"],
        gallery: [],
        whatsIncluded: ["Menu Customization", "Buffet Service", "Professional Servers"],
        services: ["Catering", "Event Coordination"],
        stats: {
            eventsPlanned: "200+",
            satisfiedClients: "190+",
            corporateEvents: "25",
            yearsExperience: "10",
            uniqueLocations: "8"
        },
        phone: "+2348000000005",
        areaServed: ["Oyo", "Osun"],
        yearEstablished: 2014,
        responseTime: "within 3 hours",
        vendor: {
            name: "Bluetooth",
            since: "2014"
        }
    },
    {
        name: "CedarWood Events",
        slug: "cedarwood-events",
        location: "Wuse II, Abuja",
        categories: ["Event Planners"],
        description: "A dedicated event planning and management company based in Nigeria's capital, Abuja.",
        shortDescription: "Premium event management in the FCT.",
        rating: 4.8,
        price: "₦350,000+",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
        featured: true,
        eventThemes: ["Corporate Event", "Wedding", "Social Gathering"],
        gallery: [],
        whatsIncluded: ["Full Coordination", "Vendor Management", "Protocol Services"],
        services: ["Planning", "Management", "Consultancy"],
        stats: {
            eventsPlanned: "280",
            satisfiedClients: "270",
            corporateEvents: "150",
            yearsExperience: "9",
            uniqueLocations: "5"
        },
        phone: "+2348000000006",
        areaServed: ["Abuja", "Kaduna"],
        yearEstablished: 2015,
        responseTime: "within 1 hour",
        vendor: {
            name: "CedarWood",
            since: "2015"
        }
    },
    {
        name: "Childsplay Event & Party Planners",
        slug: "childsplay-events",
        location: "Lagos State",
        categories: ["Event Planners", "Entertainment"],
        description: "Specializes in the organization, planning, and management of specialized solutions for children's events.",
        shortDescription: "Experts in kids' parties and entertainment.",
        rating: 4.7,
        price: "₦100,000+",
        image: "https://images.unsplash.com/photo-1533294160022-41766f8bca1c?q=80&w=2070&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Kids Birthday"],
        gallery: [],
        whatsIncluded: ["Party Decor", "Games & Activities", "Snack Corners"],
        services: ["Kids Party Planning", "Entertainment"],
        stats: {
            eventsPlanned: "350+",
            satisfiedClients: "340+",
            corporateEvents: "10",
            yearsExperience: "6",
            uniqueLocations: "20"
        },
        phone: "+2348000000007",
        areaServed: ["Lagos"],
        yearEstablished: 2018,
        responseTime: "within 2 hours",
        vendor: {
            name: "Childsplay",
            since: "2018"
        }
    },
    {
        name: "Dore Concept",
        slug: "dore-concept",
        location: "Egbeda, Lagos State",
        categories: ["Decorations", "Catering"],
        description: "A one-stop shop for event needs including decoration, catering, cocktail services, and rentals.",
        shortDescription: "Complete event solutions in Egbeda.",
        rating: 4.5,
        price: "₦120,000+",
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Anniversary", "Social Gathering"],
        gallery: [],
        whatsIncluded: ["Basic Decor", "Standard Menu", "Equipment Rental"],
        services: ["Decoration", "Catering", "Rentals"],
        stats: {
            eventsPlanned: "110",
            satisfiedClients: "100",
            corporateEvents: "5",
            yearsExperience: "5",
            uniqueLocations: "3"
        },
        phone: "+2348000000008",
        areaServed: ["Lagos"],
        yearEstablished: 2019,
        responseTime: "within 5 hours",
        vendor: {
            name: "Dore Concept",
            since: "2019"
        }
    },
    {
        name: "DRM Colours & Ocassions",
        slug: "drm-colours-occasions",
        location: "Alimosho, Lagos State",
        categories: ["Event Planners"],
        description: "An event consultancy and management company focused on innovative social and corporate events.",
        shortDescription: "Innovative event consultancy in Alimosho.",
        rating: 4.6,
        price: "₦200,000+",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Corporate Event", "Social Gathering"],
        gallery: [],
        whatsIncluded: ["Strategic Planning", "Project Management", "Vendor Coordination"],
        services: ["Consultancy", "Event Management"],
        stats: {
            eventsPlanned: "90",
            satisfiedClients: "85",
            corporateEvents: "40",
            yearsExperience: "4",
            uniqueLocations: "4"
        },
        phone: "+2348000000009",
        areaServed: ["Lagos", "Ogun"],
        yearEstablished: 2020,
        responseTime: "within 3 hours",
        vendor: {
            name: "DRM Colours",
            since: "2020"
        }
    },
    {
        name: "Elegant Concepts and Events",
        slug: "elegant-concepts-events",
        location: "Satellite Town, Lagos State",
        categories: ["Event Planners"],
        description: "Specializes in consultation, planning, and coordination for both social and corporate event management.",
        shortDescription: "Elegant event coordination and planning.",
        rating: 4.7,
        price: "₦250,000+",
        image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=2069&auto=format&fit=crop",
        featured: false,
        eventThemes: ["Wedding", "Corporate Event"],
        gallery: [],
        whatsIncluded: ["Design Concept", "Planning Timeline", "Day-of Coordination"],
        services: ["Planning", "Consultation", "Coordination"],
        stats: {
            eventsPlanned: "130",
            satisfiedClients: "125",
            corporateEvents: "35",
            yearsExperience: "8",
            uniqueLocations: "6"
        },
        phone: "+2348000000010",
        areaServed: ["Lagos"],
        yearEstablished: 2016,
        responseTime: "within 2 hours",
        vendor: {
            name: "Elegant Concepts",
            since: "2016"
        }
    }
];

async function pushVendors() {
    console.log('Starting vendor data push...');

    for (const vendor of vendors) {
        try {
            // Use slug as document ID if possible, otherwise let Firestore generate
            const docId = vendor.slug;
            const vendorData = {
                ...vendor,
                ownerId: "system_generated",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('vendors').doc(docId).set(vendorData);
            console.log(`Successfully pushed: ${vendor.name}`);
        } catch (error) {
            console.error(`Error pushing ${vendor.name}:`, error);
        }
    }

    console.log('Data push complete!');
    process.exit(0);
}

pushVendors().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
