import { PrismaClient, Role, OrderStatus, PaymentGateway, PaymentStatus, SettingMode, MovementType, POStatus, ServiceName, HealthStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding JBØ6 Mini ERP database...');

  // 1. Settings (Default Exchange Rate: 58.00 PHP per 1 USD)
  await prisma.setting.upsert({
    where: { key: 'EXCHANGE_RATE' },
    update: { value: '58.00', mode: SettingMode.MANUAL },
    create: { key: 'EXCHANGE_RATE', value: '58.00', mode: SettingMode.MANUAL },
  });

  // 2. Service Status (Health monitoring initial states)
  const services: { service: ServiceName; latency: number }[] = [
    { service: ServiceName.SUPABASE, latency: 18 },
    { service: ServiceName.REALTIME, latency: 22 },
    { service: ServiceName.PAYPAL, latency: 85 },
    { service: ServiceName.PAYMONGO, latency: 64 },
  ];

  for (const s of services) {
    await prisma.serviceStatus.upsert({
      where: { service: s.service },
      update: { status: HealthStatus.OPERATIONAL, latencyMs: s.latency },
      create: { service: s.service, status: HealthStatus.OPERATIONAL, latencyMs: s.latency },
    });
  }

  // 3. Profiles (Developer & Staff accounts)
  // These IDs can link to Supabase Auth users once created
  const devProfile = await prisma.profile.upsert({
    where: { email: 'devon.developer@jb06.com' },
    update: { fullName: 'Devon Developer', role: Role.DEVELOPER },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'devon.developer@jb06.com',
      fullName: 'Devon Developer',
      role: Role.DEVELOPER,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
    },
  });

  const staffProfile = await prisma.profile.upsert({
    where: { email: 'sarah.staff@jb06.com' },
    update: { fullName: 'Sarah Staff', role: Role.STAFF },
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'sarah.staff@jb06.com',
      fullName: 'Sarah Staff',
      role: Role.STAFF,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80',
    },
  });

  // 4. Categories & Subcategories
  const shoesCat = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: { name: 'Shoes' },
    create: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Engineered footwear with Japanese raw textiles and Vibram outsoles.',
    },
  });

  const clothesCat = await prisma.category.upsert({
    where: { slug: 'clothes' },
    update: { name: 'Clothes' },
    create: {
      name: 'Clothes',
      slug: 'clothes',
      description: 'Structured tailoring and heavyweight custom jersey engineered in Kyoto and Milan.',
    },
  });

  // Shoes Subcategories
  const shoesSub = {
    sneakers: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: shoesCat.id, slug: 'sneakers' } },
      update: { name: 'Sneakers' },
      create: { categoryId: shoesCat.id, name: 'Sneakers', slug: 'sneakers' },
    }),
    boots: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: shoesCat.id, slug: 'boots' } },
      update: { name: 'Boots' },
      create: { categoryId: shoesCat.id, name: 'Boots', slug: 'boots' },
    }),
    loafers: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: shoesCat.id, slug: 'loafers' } },
      update: { name: 'Loafers' },
      create: { categoryId: shoesCat.id, name: 'Loafers', slug: 'loafers' },
    }),
    derbies: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: shoesCat.id, slug: 'derbies' } },
      update: { name: 'Derbies' },
      create: { categoryId: shoesCat.id, name: 'Derbies', slug: 'derbies' },
    }),
    slides: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: shoesCat.id, slug: 'slides-mules' } },
      update: { name: 'Slides & Mules' },
      create: { categoryId: shoesCat.id, name: 'Slides & Mules', slug: 'slides-mules' },
    }),
  };

  // Clothes Subcategories
  const clothesSub = {
    tees: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'tees-tops' } },
      update: { name: 'Tees & Tops' },
      create: { categoryId: clothesCat.id, name: 'Tees & Tops', slug: 'tees-tops' },
    }),
    hoodies: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'hoodies-sweatshirts' } },
      update: { name: 'Hoodies & Sweatshirts' },
      create: { categoryId: clothesCat.id, name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
    }),
    jackets: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'jackets-outerwear' } },
      update: { name: 'Jackets & Outerwear' },
      create: { categoryId: clothesCat.id, name: 'Jackets & Outerwear', slug: 'jackets-outerwear' },
    }),
    shirts: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'shirts' } },
      update: { name: 'Shirts' },
      create: { categoryId: clothesCat.id, name: 'Shirts', slug: 'shirts' },
    }),
    pants: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'pants-cargos' } },
      update: { name: 'Pants & Cargos' },
      create: { categoryId: clothesCat.id, name: 'Pants & Cargos', slug: 'pants-cargos' },
    }),
    shorts: await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: clothesCat.id, slug: 'shorts' } },
      update: { name: 'Shorts' },
      create: { categoryId: clothesCat.id, name: 'Shorts', slug: 'shorts' },
    }),
  };

  // 5. Suppliers
  const kyotoSupplier = await prisma.supplier.upsert({
    where: { code: 'SUP-KYOTO' },
    update: {},
    create: {
      name: 'Kyoto Atelier Weaving Co.',
      code: 'SUP-KYOTO',
      contactName: 'Kenji Sato',
      email: 'kenji@kyoto-textiles.jp',
      country: 'JP',
      leadTimeDays: 14,
    },
  });

  const milanSupplier = await prisma.supplier.upsert({
    where: { code: 'SUP-MILAN' },
    update: {},
    create: {
      name: 'Milan Leatherworks S.r.l.',
      code: 'SUP-MILAN',
      contactName: 'Matteo Rossi',
      email: 'matteo@milan-leather.it',
      country: 'IT',
      leadTimeDays: 21,
    },
  });

  // 6. Products & Variants (12 Shoes + 12 Clothes = 24 Products)
  const productsData = [
    // --- SHOES (12 items) ---
    {
      title: 'Void Runner Sneaker',
      slug: 'void-runner-sneaker',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.sneakers.id,
      department: 'FOOTWEAR / RUNNER',
      description: 'Engineered for high-intensity urban transit with strict architectural presence. Sculpted Vibram Megagrip lug outsole with self-cleaning lugs.',
      materials: '1200D Ballistic Cordura with full-grain Italian leather overlays and welded film.',
      care: 'Spot clean with Atelier cold foam cleaner and horsehair brush. Do not machine wash.',
      isArchival: true,
      isFeatured: true,
      badge: 'NEW',
      images: [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      ],
      priceUSD: 14500, // $145.00
      pricePHP: 841000, // ₱8,410.00
      prefix: 'JB6-SNK-0142',
      sizes: ['US 7.0', 'US 7.5', 'US 8.0', 'US 8.5', 'US 9.0', 'US 9.5', 'US 10.0', 'US 10.5', 'US 11.0'],
      color: 'Obsidian / Gold',
      stockLevels: [5, 6, 8, 12, 18, 2, 8, 4, 0], // US 9.5 is low stock (2), US 11 is out (0)
    },
    {
      title: 'Aero Chunky Low',
      slug: 'aero-chunky-low',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.sneakers.id,
      department: 'FOOTWEAR / RUNNER',
      description: 'Sculpted multi-density midsole wrapped in Japanese technical mesh and supple nubuck.',
      materials: 'Japanese technical mesh, nubuck leather, EVA midsole.',
      care: 'Wipe clean with damp cloth.',
      isArchival: false,
      isFeatured: true,
      badge: 'RESTOCK',
      images: [
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
      ],
      priceUSD: 16000,
      pricePHP: 928000,
      prefix: 'JB6-SNK-0210',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0', 'US 11.0'],
      color: 'Chalk / Bone',
      stockLevels: [8, 14, 10, 5],
    },
    {
      title: 'Noir Chelsea Boot',
      slug: 'noir-chelsea-boot',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.boots.id,
      department: 'FOOTWEAR / ANKLE BOOT',
      description: 'Square-toe silhouette crafted from vegetable-tanned French calfskin with heavy lugged Vibram sole.',
      materials: 'French calfskin, elastic gore, Vibram Montagna block sole.',
      care: 'Condition monthly with beeswax balm.',
      isArchival: true,
      isFeatured: true,
      badge: 'LOW STOCK',
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80'],
      priceUSD: 21000,
      pricePHP: 1218000,
      prefix: 'JB6-BOT-0051',
      sizes: ['US 8.0', 'US 8.5', 'US 9.0', 'US 10.0'],
      color: 'Espresso / Noir',
      stockLevels: [3, 2, 4, 3],
    },
    {
      title: 'Derby Hybrid Sole',
      slug: 'derby-hybrid-sole',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.derbies.id,
      department: 'FOOTWEAR / FORMAL HYBRID',
      description: 'Classic open-lacing derby upper engineered atop an athletic sculpted compound outsole.',
      materials: 'Polished box calfskin, lightweight dual-density PU sole.',
      care: 'Polish with natural shoe wax.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80'],
      priceUSD: 18500,
      pricePHP: 1073000,
      prefix: 'JB6-DRB-0088',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Onyx Black',
      stockLevels: [6, 10, 5],
    },
    {
      title: 'Monolith Slide',
      slug: 'monolith-slide',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.slides.id,
      department: 'FOOTWEAR / SLIDE & MULE',
      description: 'Single-piece injection molded EVA recovery slide featuring ergonomic arch support.',
      materials: 'High-density closed cell EVA foam.',
      care: 'Wash with mild soap and warm water.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80'],
      priceUSD: 7500,
      pricePHP: 435000,
      prefix: 'JB6-SLD-0012',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0', 'US 11.0'],
      color: 'Matte Obsidian',
      stockLevels: [15, 20, 18, 12],
    },
    {
      title: 'Velo Trail Runner',
      slug: 'velo-trail-runner',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.sneakers.id,
      department: 'FOOTWEAR / TRAIL PERFORMANCE',
      description: 'Water-repellent ripstop upper with quick-lace cord lock system and aggressive multi-surface tread.',
      materials: 'Ripstop nylon, TPU overlays, rubber lug sole.',
      care: 'Air dry away from direct heat.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
      priceUSD: 17000,
      pricePHP: 986000,
      prefix: 'JB6-SNK-0315',
      sizes: ['US 8.5', 'US 9.0', 'US 9.5', 'US 10.0'],
      color: 'Stealth Grey',
      stockLevels: [7, 11, 6, 8],
    },
    {
      title: 'Kite Minimal Trainer',
      slug: 'kite-minimal-trainer',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.sneakers.id,
      department: 'FOOTWEAR / MINIMALIST LOW',
      description: 'Subtle low-profile court sneaker in monochrome chalk white Italian nappa leather.',
      materials: 'Full-grain Nappa leather, Margom rubber cupsole.',
      care: 'Clean with sneaker leather wipes.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80'],
      priceUSD: 13500,
      pricePHP: 783000,
      prefix: 'JB6-SNK-0094',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Chalk White',
      stockLevels: [10, 12, 9],
    },
    {
      title: 'Brutalist Combat Boot',
      slug: 'brutalist-combat-boot',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.boots.id,
      department: 'FOOTWEAR / HIGH ANKLE BOOT',
      description: 'Nine-eyelet high shaft combat boot equipped with interior medial side zipper for quick entry.',
      materials: 'Heavy oiled steerhide leather, gunmetal eyelets, commando sole.',
      care: 'Buff with horsehair brush after use in wet environments.',
      isArchival: true,
      isFeatured: false,
      badge: 'LIMITED',
      images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80'],
      priceUSD: 24000,
      pricePHP: 1392000,
      prefix: 'JB6-BOT-0099',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0', 'US 11.0'],
      color: 'Archival Black',
      stockLevels: [4, 5, 3, 2],
    },
    {
      title: 'Kumo Suede Mule',
      slug: 'kumo-suede-mule',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.slides.id,
      department: 'FOOTWEAR / SLIP-ON MULE',
      description: 'Relaxed slip-on mule shaped in tactile roughout cow suede with molded cork footbed.',
      materials: 'Roughout suede leather, cork-latex footbed, EVA sole.',
      care: 'Brush suede in one direction with crepe brush.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80'],
      priceUSD: 11000,
      pricePHP: 638000,
      prefix: 'JB6-MUK-0044',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Charcoal Suede',
      stockLevels: [8, 9, 7],
    },
    {
      title: 'Kuro Lugged Loafer',
      slug: 'kuro-lugged-loafer',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.loafers.id,
      department: 'FOOTWEAR / FORMAL STREET',
      description: 'Subversive penny loafer with deep serrated lug outsole and contrast white welt stitching.',
      materials: 'Polished corrected-grain leather, Goodyear welt construction.',
      care: 'Condition every 2 months.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80'],
      priceUSD: 24000,
      pricePHP: 1392000,
      prefix: 'JB6-LFR-0019',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Matte Black',
      stockLevels: [12, 24, 15],
    },
    {
      title: 'Arc Tactical Platform Boot',
      slug: 'arc-tactical-platform-boot',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.boots.id,
      department: 'FOOTWEAR / TACTICAL BOOT',
      description: 'Exaggerated 55mm platform chassis with Cordura padded collar and Kevlar speed lacing.',
      materials: 'Cordura ballistic nylon, Kevlar laces, sculpted EVA platform.',
      care: 'Clean with water and nylon brush.',
      isArchival: true,
      isFeatured: false,
      badge: 'LOW STOCK',
      images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'],
      priceUSD: 28000,
      pricePHP: 1624000,
      prefix: 'JB6-BOT-0112',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Obsidian Arc',
      stockLevels: [2, 1, 3], // US 9 is critical (1 left)
    },
    {
      title: 'Zenith Canvas Low',
      slug: 'zenith-canvas-low',
      categoryId: shoesCat.id,
      subcategoryId: shoesSub.sneakers.id,
      department: 'FOOTWEAR / HERITAGE LOW',
      description: 'Vulcanized Kurashiki heavy canvas deck shoe kiln-fired using traditional ka-ryu processing.',
      materials: '100% Japanese Kurashiki cotton canvas, natural gum rubber.',
      care: 'Hand wash with mild detergent.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80'],
      priceUSD: 9500,
      pricePHP: 551000,
      prefix: 'JB6-SNK-0040',
      sizes: ['US 8.0', 'US 9.0', 'US 10.0'],
      color: 'Natural Ecru',
      stockLevels: [14, 18, 12],
    },

    // --- CLOTHES (12 items) ---
    {
      title: 'Oversized Heavy Tee',
      slug: 'oversized-heavy-tee',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.tees.id,
      department: 'APPAREL / HEAVYWEIGHT JERSEY',
      description: '320 GSM combed organic cotton knitted on circular loopwheel looms in Wakayama. Generous boxy drop-shoulder cut.',
      materials: '100% GOTS certified organic combed cotton (320 GSM).',
      care: 'Machine wash cold with like colors. Line dry inside out to preserve pigment.',
      isArchival: false,
      isFeatured: true,
      badge: 'ATELIER',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      ],
      priceUSD: 6500, // $65.00
      pricePHP: 377000, // ₱3,770.00
      prefix: 'JB6-TEE-0014',
      sizes: ['S (Bespoke Boxy)', 'M (Bespoke Boxy)', 'L (Bespoke Boxy)', 'XL (Bespoke Boxy)'],
      color: 'Chalk White',
      stockLevels: [12, 22, 16, 8],
    },
    {
      title: 'Raw Boxy Heavyweight Tee',
      slug: 'raw-boxy-heavyweight-tee',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.tees.id,
      department: 'APPAREL / HEAVYWEIGHT JERSEY',
      description: 'Garment dyed in Kyoto with sumi ink pigments. Reinforced binded collar prevents stretching.',
      materials: '360 GSM raw open-end cotton.',
      care: 'Cold wash only. Hang dry in shade.',
      isArchival: true,
      isFeatured: true,
      badge: null,
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
      priceUSD: 7000,
      pricePHP: 406000,
      prefix: 'JB6-TEE-0022',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Washed Carbon',
      stockLevels: [6, 14, 4, 8], // L is low stock (4)
    },
    {
      title: 'Architect Heavy Tee',
      slug: 'architect-heavy-tee',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.tees.id,
      department: 'APPAREL / TEES & CUT-SEWN',
      description: 'Elongated short sleeve proportion with blind-stitched hem and side ventilation slits.',
      materials: '280 GSM long-staple pima cotton.',
      care: 'Machine wash warm.',
      isArchival: false,
      isFeatured: false,
      badge: 'LOW STOCK',
      images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],
      priceUSD: 6800,
      pricePHP: 394400,
      prefix: 'JB6-TEE-0089',
      sizes: ['S', 'M', 'L'],
      color: 'Bone Ecru',
      stockLevels: [5, 4, 3],
    },
    {
      title: 'Structured Raw Hoodie',
      slug: 'structured-raw-hoodie',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.hoodies.id,
      department: 'APPAREL / HEAVYWEIGHT FLEECE',
      description: '500 GSM French terry with double-layered crossover hood and articulated raglan sleeves.',
      materials: '500 GSM Japanese organic cotton terry.',
      care: 'Gentle cycle cold. Do not tumble dry.',
      isArchival: true,
      isFeatured: false,
      badge: 'RESTOCK',
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'],
      priceUSD: 14000,
      pricePHP: 812000,
      prefix: 'JB6-HOD-0031',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Deep Slate',
      stockLevels: [8, 12, 10, 6],
    },
    {
      title: 'Heavy Fleece Zip Hoodie',
      slug: 'heavy-fleece-zip-hoodie',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.hoodies.id,
      department: 'APPAREL / FLEECE & LAYERING',
      description: 'Full-zip front featuring dual matte titanium Excella two-way zippers and ribbed side gussets.',
      materials: '480 GSM brushed fleece with Excella hardware.',
      care: 'Zip closed before washing.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80'],
      priceUSD: 15500,
      pricePHP: 899000,
      prefix: 'JB6-HOD-0045',
      sizes: ['M', 'L', 'XL'],
      color: 'Onyx Black',
      stockLevels: [10, 15, 8],
    },
    {
      title: 'Tailored Cargo Pant',
      slug: 'tailored-cargo-pant',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.pants.id,
      department: 'APPAREL / TROUSERS',
      description: 'Double pleated front flowing into deep architectural gusseted cargo pockets with magnetic flap closure.',
      materials: 'High-density cotton twill with water-resistant resin finish.',
      care: 'Dry clean recommended or gentle cold wash.',
      isArchival: false,
      isFeatured: true,
      badge: 'RESTOCK',
      images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80'],
      priceUSD: 12000,
      pricePHP: 696000,
      prefix: 'JB6-CRG-0024',
      sizes: ['Size 30 (S)', 'Size 32 (M)', 'Size 34 (L)', 'Size 36 (XL)'],
      color: 'Washed Charcoal Twill',
      stockLevels: [8, 14, 12, 6],
    },
    {
      title: 'Pleated Structured Pant',
      slug: 'pleated-structured-pant',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.pants.id,
      department: 'APPAREL / BOTTOMS',
      description: 'Wide-leg trouser with deep double reverse pleats cut from dry Italian tropical virgin wool.',
      materials: '100% Virgin tropical wool from Biella, Italy.',
      care: 'Dry clean only.',
      isArchival: true,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80'],
      priceUSD: 18000,
      pricePHP: 1044000,
      prefix: 'JB6-PNT-0072',
      sizes: ['Size 30', 'Size 32', 'Size 34'],
      color: 'Tokyo Sand',
      stockLevels: [9, 11, 7],
    },
    {
      title: 'Modular Tactical Cargo',
      slug: 'modular-tactical-cargo',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.pants.id,
      department: 'APPAREL / BOTTOMS',
      description: 'Technical trousers with detachable lower utility pockets that convert into a standalone sling pouch.',
      materials: 'Mil-spec ripstop nylon blend with Teflon coating.',
      care: 'Machine wash gentle cold.',
      isArchival: false,
      isFeatured: false,
      badge: 'MANUAL OVERRIDE',
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],
      priceUSD: 19000,
      pricePHP: 1102000, // Manual override example
      prefix: 'JB6-CRG-0113',
      sizes: ['Size 30 (S)', 'Size 32 (M)', 'Size 34 (L)'],
      color: 'Charcoal',
      stockLevels: [4, 0, 5], // Size 32 is out of stock (0)
    },
    {
      title: 'Raw Wash Trucker Jacket',
      slug: 'raw-wash-trucker-jacket',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.jackets.id,
      department: 'APPAREL / OUTERWEAR',
      description: '14.5 oz red-line selvedge denim woven in Okayama on antique shuttle looms. Raw unwashed finish.',
      materials: '100% Okayama selvedge cotton denim (14.5 oz).',
      care: 'Soak in cold water inside out. Air dry rigid.',
      isArchival: true,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80'],
      priceUSD: 19000,
      pricePHP: 1102000,
      prefix: 'JB6-JKT-0044',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Indigo Raw',
      stockLevels: [6, 10, 8, 4],
    },
    {
      title: 'Sculpted Wool Trench',
      slug: 'sculpted-wool-trench',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.jackets.id,
      department: 'APPAREL / ARCHIVAL COAT',
      description: 'Longline tailored overcoat featuring dramatic storm flap, horn buttons, and unstructured shoulders.',
      materials: 'Double-face Melton wool from Kyoto mills (680 GSM).',
      care: 'Specialist dry clean only.',
      isArchival: true,
      isFeatured: true,
      badge: 'LIMITED DROP',
      images: ['https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80'],
      priceUSD: 34000,
      pricePHP: 1972000,
      prefix: 'JB6-COT-0006',
      sizes: ['S', 'M', 'L'],
      color: 'Carbon Heather',
      stockLevels: [3, 5, 2],
    },
    {
      title: 'Minimal Poplin Atelier Shirt',
      slug: 'minimal-poplin-atelier-shirt',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.shirts.id,
      department: 'APPAREL / SHIRTING',
      description: 'Concealed button placket with architect stand collar. 120s two-ply Giza cotton poplin.',
      materials: '100% Egyptian Giza extra-long staple cotton.',
      care: 'Warm iron or steam.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80'],
      priceUSD: 11500,
      pricePHP: 667000,
      prefix: 'JB6-SHT-0028',
      sizes: ['S', 'M', 'L'],
      color: 'Optic White',
      stockLevels: [8, 12, 9],
    },
    {
      title: 'Technical Utility Short',
      slug: 'technical-utility-short',
      categoryId: clothesCat.id,
      subcategoryId: clothesSub.shorts.id,
      department: 'APPAREL / SHORTS & SWIM',
      description: 'Quick-dry four-way stretch nylon short with integrated nylon webbing belt and zippered gear pockets.',
      materials: '88% Recycled nylon, 12% Spandex with DWR treatment.',
      care: 'Machine wash cold.',
      isArchival: false,
      isFeatured: false,
      badge: null,
      images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80'],
      priceUSD: 8500,
      pricePHP: 493000,
      prefix: 'JB6-SHT-0081',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Obsidian Black',
      stockLevels: [10, 16, 12, 7],
    },
  ];

  const createdVariants: any[] = [];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        department: p.department,
        materials: p.materials,
        care: p.care,
        isArchival: p.isArchival,
        isFeatured: p.isFeatured,
        badge: p.badge,
        images: p.images,
      },
      create: {
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        title: p.title,
        slug: p.slug,
        description: p.description,
        department: p.department,
        materials: p.materials,
        care: p.care,
        isArchival: p.isArchival,
        isFeatured: p.isFeatured,
        badge: p.badge,
        images: p.images,
      },
    });

    for (let i = 0; i < p.sizes.length; i++) {
      const sizeStr = p.sizes[i];
      const stock = p.stockLevels[i] ?? 10;
      const cleanSize = sizeStr.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
      const sku = `${p.prefix}-${cleanSize}-${p.color.slice(0, 3).toUpperCase()}`;

      const variant = await prisma.variant.upsert({
        where: { sku },
        update: {
          stock,
          priceUSD: p.priceUSD,
          pricePHP: p.pricePHP,
        },
        create: {
          productId: product.id,
          sku,
          size: sizeStr,
          color: p.color,
          stock,
          reserved: 0,
          reorderLevel: 5,
          priceUSD: p.priceUSD,
          pricePHP: p.pricePHP,
        },
      });

      createdVariants.push({ ...variant, productTitle: product.title });
    }
  }

  console.log(`Created 24 products and ${createdVariants.length} variants.`);

  // 7. Customers (Realistic international and PH customers)
  const customersData = [
    { name: 'Marco Valenzuela', email: 'marco.v@atelier-kyoto.ph', phone: '+63 917 555 0192', city: 'Makati City', address: 'Unit 14B, Salcedo Village, Metro Manila', country: 'PH', tier: 'Tier 1 Collector' },
    { name: 'Soren K. Lind', email: 'soren.lind@cph-design.dk', phone: '+45 20 12 34 56', city: 'Copenhagen', address: 'Gothersgade 42', country: 'DK', tier: 'Standard Collector' },
    { name: 'Aria Chen', email: 'aria.chen@studio-zen.ph', phone: '+63 918 888 1234', city: 'Quezon City', address: '88 Katipunan Ave, Loyola Heights', country: 'PH', tier: 'Tier 1 Collector' },
    { name: 'Kenzo Takahashi', email: 'kenzo.t@shibuya-style.jp', phone: '+81 90 1234 5678', city: 'Tokyo', address: '2-14-1 Shibuya-ku', country: 'JP', tier: 'Archival Member' },
    { name: 'Gabriel Santos', email: 'gabriel.santos@bgc-lead.ph', phone: '+63 917 222 9988', city: 'Taguig City', address: 'Forbes Town Center, BGC', country: 'PH', tier: 'Standard Collector' },
    { name: 'Mia Alcantara', email: 'mia.alcantara@cebu-creative.ph', phone: '+63 920 333 4455', city: 'Cebu City', address: 'IT Park, Lahug', country: 'PH', tier: 'Standard Collector' },
    { name: 'David Mercer', email: 'd.mercer@nyc-gallery.com', phone: '+1 212 555 0188', city: 'New York', address: '445 W 23rd St, Chelsea, NY 10011', country: 'US', tier: 'Tier 1 Collector' },
    { name: 'Leila Farrokh', email: 'leila.f@london-arch.co.uk', phone: '+44 7700 900077', city: 'London', address: '12 Redchurch St, Shoreditch', country: 'GB', tier: 'Standard Collector' },
    { name: 'Carlos Mendoza', email: 'carlos.m@manila-finearts.ph', phone: '+63 917 444 7711', city: 'Pasig City', address: 'Capitol Commons, Meralco Ave', country: 'PH', tier: 'Standard Collector' },
    { name: 'Yuki Moriyama', email: 'yuki.m@kyoto-craft.jp', phone: '+81 75 987 6543', city: 'Kyoto', address: 'Nakagyo Ward, Kawaramachi', country: 'JP', tier: 'Archival Member' },
  ];

  const createdCustomers: any[] = [];
  for (const c of customersData) {
    const cust = await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
    createdCustomers.push(cust);
  }

  // 8. Orders (30 realistic sample orders spanning past 14 days)
  const orderCount = await prisma.order.count();
  if (orderCount < 30) {
    console.log('Generating 30 sample orders with GCash & PayPal splits...');
    const statuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.DELIVERED,
      OrderStatus.DELIVERED,
      OrderStatus.SHIPPED,
      OrderStatus.SHIPPED,
      OrderStatus.PACKED,
      OrderStatus.PAID,
      OrderStatus.PENDING,
      OrderStatus.REFUNDED,
    ];

    const gateways: PaymentGateway[] = [
      PaymentGateway.GCASH,
      PaymentGateway.GCASH, // GCash has higher volume in design (approx 60%)
      PaymentGateway.PAYPAL,
    ];

    for (let i = 1; i <= 30; i++) {
      const cust = createdCustomers[i % createdCustomers.length];
      const status = statuses[i % statuses.length];
      const gateway = cust.country === 'PH' ? PaymentGateway.GCASH : PaymentGateway.PAYPAL;
      const chargedCurrency = gateway === PaymentGateway.GCASH ? 'PHP' : 'USD';
      const daysAgo = Math.floor((30 - i) / 2);

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);
      orderDate.setHours(orderDate.getHours() - (i % 24));

      const v1 = createdVariants[(i * 3) % createdVariants.length];
      const v2 = createdVariants[(i * 5 + 1) % createdVariants.length];

      const item1Qty = 1;
      const item2Qty = i % 3 === 0 ? 1 : 0;

      const subtotalUSD = v1.priceUSD * item1Qty + (item2Qty ? v2.priceUSD * item2Qty : 0);
      const discountUSD = i % 5 === 0 ? Math.round(subtotalUSD * 0.1) : 0;
      const shippingUSD = subtotalUSD > 10000 ? 0 : 1800; // Free shipping over $100
      const taxUSD = Math.round((subtotalUSD - discountUSD) * 0.08); // 8% VAT
      const totalUSD = subtotalUSD - discountUSD + shippingUSD + taxUSD;

      const subtotalPHP = Math.round(subtotalUSD * 58);
      const discountPHP = Math.round(discountUSD * 58);
      const shippingPHP = Math.round(shippingUSD * 58);
      const taxPHP = Math.round(taxUSD * 58);
      const totalPHP = subtotalPHP - discountPHP + shippingPHP + taxPHP;

      const order = await prisma.order.create({
        data: {
          orderNumber: 1000 + i,
          customerId: cust.id,
          status,
          paymentMethod: gateway,
          chargedCurrency,
          exchangeRateSnapshot: 58.0000,
          subtotalUSD,
          discountUSD,
          shippingUSD,
          taxUSD,
          totalUSD,
          subtotalPHP,
          discountPHP,
          shippingPHP,
          taxPHP,
          totalPHP,
          promoCode: discountUSD > 0 ? 'ATELIER10' : null,
          paidAt: status !== OrderStatus.PENDING ? orderDate : null,
          createdAt: orderDate,
          updatedAt: orderDate,
          items: {
            create: [
              {
                productId: v1.productId,
                variantId: v1.id,
                quantity: item1Qty,
                unitPriceUSD: v1.priceUSD,
                unitPricePHP: v1.pricePHP ?? Math.round(v1.priceUSD * 58),
                totalUSD: v1.priceUSD * item1Qty,
                totalPHP: (v1.pricePHP ?? Math.round(v1.priceUSD * 58)) * item1Qty,
              },
              ...(item2Qty
                ? [
                    {
                      productId: v2.productId,
                      variantId: v2.id,
                      quantity: item2Qty,
                      unitPriceUSD: v2.priceUSD,
                      unitPricePHP: v2.pricePHP ?? Math.round(v2.priceUSD * 58),
                      totalUSD: v2.priceUSD * item2Qty,
                      totalPHP: (v2.pricePHP ?? Math.round(v2.priceUSD * 58)) * item2Qty,
                    },
                  ]
                : []),
            ],
          },
          payments: {
            create: [
              {
                gateway,
                transactionId: gateway === PaymentGateway.GCASH ? `pay_gcash_${Date.now()}_${i}` : `PAYID-${Date.now()}-${i}`,
                amount: chargedCurrency === 'PHP' ? totalPHP : totalUSD,
                currency: chargedCurrency,
                status: status === OrderStatus.PENDING ? PaymentStatus.PENDING : (status === OrderStatus.REFUNDED ? PaymentStatus.REFUNDED : PaymentStatus.SUCCESS),
              },
            ],
          },
          statusHistory: {
            create: [
              {
                fromStatus: null,
                toStatus: OrderStatus.PENDING,
                note: 'Order initiated at checkout session',
                changedBy: 'SYSTEM',
                createdAt: new Date(orderDate.getTime() - 600000),
              },
              ...(status !== OrderStatus.PENDING
                ? [
                    {
                      fromStatus: OrderStatus.PENDING,
                      toStatus: OrderStatus.PAID,
                      note: `Payment verified via ${gateway === PaymentGateway.GCASH ? 'PayMongo GCash webhook' : 'PayPal Orders API capture'}`,
                      changedBy: gateway === PaymentGateway.GCASH ? 'PAYMONGO_WEBHOOK' : 'PAYPAL_API',
                      createdAt: orderDate,
                    },
                  ]
                : []),
              ...(status === OrderStatus.PACKED || status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED
                ? [
                    {
                      fromStatus: OrderStatus.PAID,
                      toStatus: OrderStatus.PACKED,
                      note: 'Packed at Kyoto Atelier fulfillment hub',
                      changedBy: 'staffProfile',
                      createdAt: new Date(orderDate.getTime() + 7200000),
                    },
                  ]
                : []),
            ],
          },
        },
      });
    }
  }

  // 9. Sample Purchase Orders
  const samplePO = await prisma.purchaseOrder.upsert({
    where: { poNumber: 'PO-804' },
    update: {},
    create: {
      poNumber: 'PO-804',
      supplierId: kyotoSupplier.id,
      status: POStatus.ORDERED,
      totalCostUSD: 1420000, // $14,200.00
      note: 'Restock arrival from Kyoto Atelier PO #804 via DHL Express air freight batch A-12.',
      orderedAt: new Date(Date.now() - 86400000 * 3),
      items: {
        create: [
          {
            variantId: createdVariants[0].id,
            quantityOrdered: 24,
            quantityReceived: 0,
            unitCostUSD: 4500, // $45.00
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

