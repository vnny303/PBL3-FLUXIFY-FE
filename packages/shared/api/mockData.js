const tenant = {
  id: 'tenant-studyhub-demo',
  tenantId: 'tenant-studyhub-demo',
  storeName: 'StudyHub Supplies',
  subdomain: 'study-hub',
  themeConfig: {
    colors: {
      primary: '#0f766e',
      background: '#f7fbfa',
      text: '#10201d',
    },
    layout: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: 'Inter',
    },
  },
  contentConfig: {
    home: {
      title: 'StudyHub Supplies',
      subtitle: 'Premium notebooks, pens, desk tools, and study kits for students who want a tidy, focused workspace.',
      featuredTitle: 'Back To School Picks',
      featuredSubtitle: 'Reliable supplies selected for study, projects, and exams',
      heroImageUrl: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1800&q=85',
      heroOverlayOpacity: 0.42,
    },
    general: {
      siteName: 'StudyHub Supplies',
    },
    about: {
      story:
        'StudyHub Supplies curates reliable stationery, desk tools, and class kits for students who want a cleaner study routine.\n\nWe focus on useful details: paper that feels good to write on, tools that survive a busy backpack, and bundles that make school preparation easier.',
    },
    contact: {
      email: 'support@studyhub.test',
      phone: '0901 234 567',
      address: 'Da Nang, Vietnam',
      hours: 'Mon - Sat, 8:00 - 18:00',
    },
  },
};

const demoTenants = [
  tenant,
  {
    id: 'tenant-techgear-demo',
    tenantId: 'tenant-techgear-demo',
    storeName: 'TechGear Da Nang',
    subdomain: 'techgear-dn',
    isActive: true,
    themeConfig: {
      colors: {
        primary: '#2563eb',
        background: '#f8fafc',
        text: '#0f172a',
      },
      layout: {
        borderRadius: 10,
      },
      typography: {
        fontFamily: 'Inter',
      },
    },
    contentConfig: {
      home: {
        title: 'TechGear Da Nang',
        subtitle: 'Laptops, accessories, and desk devices for students, creators, and small teams.',
        featuredTitle: 'Workspace Essentials',
        featuredSubtitle: 'Reliable gear selected for daily study and work',
        heroImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1800&q=85',
        heroOverlayOpacity: 0.4,
      },
      general: {
        siteName: 'TechGear Da Nang',
      },
      about: {
        story: 'TechGear Da Nang helps students and small teams find practical devices, accessories, and setup tools for daily work.',
      },
      contact: {
        email: 'support@techgear.test',
        phone: '0902 345 678',
        address: 'Hai Chau, Da Nang',
        hours: 'Mon - Sun, 9:00 - 20:00',
      },
    },
  },
  {
    id: 'tenant-bloom-demo',
    tenantId: 'tenant-bloom-demo',
    storeName: 'Bloom & Gift Studio',
    subdomain: 'bloom-gift',
    isActive: true,
    themeConfig: {
      colors: {
        primary: '#be123c',
        background: '#fff7f8',
        text: '#2b1118',
      },
      layout: {
        borderRadius: 14,
      },
      typography: {
        fontFamily: 'Inter',
      },
    },
    contentConfig: {
      home: {
        title: 'Bloom & Gift Studio',
        subtitle: 'Fresh bouquets, gift boxes, and occasion bundles prepared for meaningful deliveries.',
        featuredTitle: 'Occasion Gifts',
        featuredSubtitle: 'Thoughtful picks for birthdays, openings, and celebrations',
        heroImageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1800&q=85',
        heroOverlayOpacity: 0.38,
      },
      general: {
        siteName: 'Bloom & Gift Studio',
      },
      about: {
        story: 'Bloom & Gift Studio prepares fresh flowers and curated gifts for personal moments and local events.',
      },
      contact: {
        email: 'hello@bloomgift.test',
        phone: '0903 456 789',
        address: 'Thanh Khe, Da Nang',
        hours: 'Daily, 7:30 - 19:30',
      },
    },
  },
  {
    id: 'tenant-fit-demo',
    tenantId: 'tenant-fit-demo',
    storeName: 'FitDaily Activewear',
    subdomain: 'fitdaily',
    isActive: false,
    themeConfig: {
      colors: {
        primary: '#15803d',
        background: '#f7fbf6',
        text: '#102015',
      },
      layout: {
        borderRadius: 12,
      },
      typography: {
        fontFamily: 'Inter',
      },
    },
    contentConfig: {
      home: {
        title: 'FitDaily Activewear',
        subtitle: 'Training clothes, gym bags, and everyday active essentials for steady routines.',
        featuredTitle: 'Training Staples',
        featuredSubtitle: 'Comfortable pieces for workout days and active commutes',
        heroImageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1800&q=85',
        heroOverlayOpacity: 0.42,
      },
      general: {
        siteName: 'FitDaily Activewear',
      },
      about: {
        story: 'FitDaily Activewear focuses on comfortable training staples and simple fitness accessories for everyday movement.',
      },
      contact: {
        email: 'care@fitdaily.test',
        phone: '0904 567 890',
        address: 'Son Tra, Da Nang',
        hours: 'Mon - Sat, 8:30 - 21:00',
      },
    },
  },
];

const categories = [
  { id: 'cat-notebooks', name: 'Notebooks', description: 'Journals, planners, and paper goods', isActive: true },
  { id: 'cat-writing', name: 'Writing Tools', description: 'Pens, pencils, and markers', isActive: true },
  { id: 'cat-desk', name: 'Desk Setup', description: 'Organizers and study desk tools', isActive: true },
  { id: 'cat-bags', name: 'School Bags', description: 'Backpacks and pencil cases', isActive: true },
  { id: 'cat-kits', name: 'Study Kits', description: 'Ready-made bundles for class and exams', isActive: true },
];

const productSeed = [
  ['p-001', 'Campus A5 Grid Notebook Set', 'cat-notebooks', 89000, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80', 4.8, 126, ['Sage', 'Blue'], ['A5', 'B5']],
  ['p-002', 'Weekly Study Planner', 'cat-notebooks', 129000, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80', 4.7, 82, ['Cream', 'Mint'], ['Undated']],
  ['p-003', 'Premium Gel Pen Pack', 'cat-writing', 69000, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80', 4.9, 164, ['Black', 'Assorted'], ['0.5mm', '0.7mm']],
  ['p-004', 'Dual Tip Highlighter Set', 'cat-writing', 79000, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=80', 4.6, 91, ['Pastel', 'Vivid'], ['6 colors', '12 colors']],
  ['p-005', 'Mechanical Pencil Bundle', 'cat-writing', 99000, 'https://images.unsplash.com/photo-1616627451515-cbc80eec0842?auto=format&fit=crop&w=900&q=80', 4.8, 104, ['Graphite', 'White'], ['0.5mm', '0.7mm']],
  ['p-006', 'Modular Desk Organizer', 'cat-desk', 249000, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80', 4.5, 57, ['Oak', 'White'], ['Compact', 'Wide']],
  ['p-007', 'Foldable Book Stand', 'cat-desk', 189000, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80', 4.7, 76, ['Natural', 'Walnut'], ['Standard']],
  ['p-008', 'Exam Revision Flashcards', 'cat-kits', 59000, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', 4.6, 118, ['White', 'Color'], ['100 cards', '200 cards']],
  ['p-009', 'Math Geometry Tool Kit', 'cat-kits', 119000, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80', 4.4, 43, ['Clear', 'Blue'], ['Basic', 'Pro']],
  ['p-010', 'Waterproof Student Backpack', 'cat-bags', 459000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 4.9, 135, ['Navy', 'Black'], ['18L', '24L']],
  ['p-011', 'Transparent Pencil Case', 'cat-bags', 49000, 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=900&q=80', 4.7, 73, ['Clear', 'Smoke'], ['Small', 'Large']],
  ['p-012', 'Back To School Starter Kit', 'cat-kits', 329000, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80', 4.8, 149, ['Primary', 'College'], ['Standard', 'Plus']],
];

const productImageSets = {
  'p-001': [
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
  ],
  'p-002': [
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80',
  ],
  'p-003': [
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=900&q=80',
  ],
  'p-004': [
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529119513315-c7c361862fc7?auto=format&fit=crop&w=900&q=80',
  ],
  'p-005': [
    'https://images.unsplash.com/photo-1616627451515-cbc80eec0842?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
  ],
  'p-006': [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=900&q=80',
  ],
  'p-007': [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=80',
  ],
  'p-008': [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80',
  ],
  'p-009': [
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1596496181848-3091d4878b24?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  ],
  'p-010': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=900&q=80',
  ],
  'p-011': [
    'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  ],
  'p-012': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80',
  ],
};

const productDetailCopy = {
  'p-009': {
    description: 'A complete geometry kit for math classes, exam practice, and project work. Includes the core measuring tools students need to draw clean diagrams, mark angles, and keep assignments tidy.',
    overview: 'Built for daily classroom use, the Math Geometry Tool Kit keeps rulers, triangles, compass work, and angle measurement in one compact bundle. The Basic version covers essential classwork, while Pro adds more precise tools for revision and project sheets.',
    specifications: [
      { name: 'Use case', value: 'Geometry class bundle' },
      { name: 'Grade level', value: 'Middle school to high school' },
      { name: 'Kit format', value: 'Basic / Pro' },
      { name: 'Material', value: 'Transparent plastic and metal compass' },
      { name: 'Storage', value: 'Reusable pouch' },
      { name: 'Origin', value: 'Vietnam' },
    ],
    detailSections: [
      {
        title: 'Classroom-ready tools',
        content: 'The kit gathers the measuring and drawing tools students usually need during geometry lessons. It reduces forgotten supplies and keeps desk setup simple before class starts.',
      },
      {
        title: 'Basic vs Pro',
        content: 'Basic is suitable for everyday homework and standard geometry lessons. Pro is better for students who want a fuller kit for exam revision, project diagrams, and more precise construction work.',
      },
      {
        title: 'How students use it',
        content: 'Use the ruler for clean line work, set squares for perpendicular and parallel construction, the protractor for angle measurement, and the compass for circles and arcs.',
      },
      {
        title: 'Care',
        content: 'Keep the compass tip covered when not in use. Wipe transparent tools with a dry cloth so markings stay readable, and store all pieces in the pouch after class.',
      },
    ],
  },
};

const products = productSeed.map(([id, name, categoryId, price, image, rating, reviewCount, colors, sizes], index) => {
  const customCopy = productDetailCopy[id] || {};
  const productSpecificImages = productImageSets[id] || [image];
  const skus = colors.flatMap((color, colorIndex) =>
    sizes.map((size, sizeIndex) => {
      const skuImage = productSpecificImages[(colorIndex * sizes.length + sizeIndex) % productSpecificImages.length];
      return {
        id: `${id}-sku-${colorIndex + 1}-${sizeIndex + 1}`,
        productSkuId: `${id}-sku-${colorIndex + 1}-${sizeIndex + 1}`,
        skuCode: `${id.toUpperCase()}-${color.slice(0, 3).toUpperCase()}-${String(size).replace(/\s+/g, '')}`,
        price: price + colorIndex * 30000,
        stock: 8 + index + sizeIndex * 3,
        stockQuantity: 8 + index + sizeIndex * 3,
        imgUrl: skuImage,
        image: skuImage,
        imageUrl: skuImage,
        attributes: { color, size },
      };
    })
  );
  const productImages = Array.from(new Set([image, ...productSpecificImages, ...skus.map((sku) => sku.imgUrl)])).slice(0, 5);

  return {
    id,
    productId: id,
    name,
    categoryId,
    categoryName: categories.find((category) => category.id === categoryId)?.name,
    description: customCopy.description || `${name} made for focused study sessions, organized classrooms, and everyday school routines.`,
    overview: customCopy.overview || `${name} helps students keep notes, supplies, and projects tidy from class to revision time.`,
    basePrice: price,
    price,
    imgUrls: productImages,
    images: productImages,
    image: productImages[0],
    attributes: { colors, sizes },
    productSkus: skus,
    skus,
    rating,
    averageRating: rating,
    reviewCount,
    soldCount: 24 + index * 9,
    isActive: true,
    isNew: index < 3,
    isSale: index % 4 === 1,
    isBestSeller: index % 3 === 0,
    discountLabel: index % 4 === 1 ? '15% OFF' : null,
    specifications: customCopy.specifications || [
      { name: 'Use case', value: categoryId === 'cat-kits' ? 'Class bundle' : 'Daily study' },
      { name: 'Grade level', value: categoryId === 'cat-writing' ? 'Middle school to university' : 'All students' },
      { name: 'Variant options', value: `${colors.join(' / ')} - ${sizes.join(' / ')}` },
      { name: 'Origin', value: 'Vietnam' },
    ],
    detailSections: customCopy.detailSections || [
      { title: 'Highlights', content: 'Durable, cleanly designed, and easy to combine with other school supplies. Suitable for repeat use across classwork, homework, and revision sessions.' },
      { title: 'Study routine', content: 'Keep it ready in a backpack, desk drawer, or class kit so students can start tasks quickly without searching for missing supplies.' },
      { title: 'Care', content: 'Store in a dry place and keep paper products away from water.' },
    ],
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  };
});

const customerProfiles = [
  ['Nguyen Linh Chi', 'linhchi.nguyen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'],
  ['Tran Minh Anh', 'minhanh.tran', 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80'],
  ['Le Gia Bao', 'giabao.le', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'],
  ['Pham Khanh Vy', 'khanhvy.pham', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'],
  ['Vo Hoang Nam', 'hoangnam.vo', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&q=80'],
  ['Do Phuong Thao', 'phuongthao.do', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'],
  ['Hoang Quoc Huy', 'quochuy.hoang', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'],
  ['Bui Mai Linh', 'mailinh.bui', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80'],
  ['Dang Tuan Kiet', 'tuankiet.dang', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80'],
  ['Ngo Thanh Truc', 'thanhtruc.ngo', 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=200&q=80'],
  ['Phan Duc Manh', 'ducmanh.phan', 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=200&q=80'],
  ['Huynh Nhat Ha', 'nhatha.huynh', 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80'],
];

const customers = Array.from({ length: 24 }, (_, index) => {
  const [fullName, handle, avatarUrl] = customerProfiles[index % customerProfiles.length];
  const nameParts = fullName.split(' ');
  const email = `${handle}${index + 1}@example.com`;
  return {
    id: `cus-${String(index + 1).padStart(3, '0')}`,
    customerId: `cus-${String(index + 1).padStart(3, '0')}`,
    email,
    firstName: nameParts.slice(0, -1).join(' '),
    lastName: nameParts.at(-1),
    fullName,
    avatarUrl,
    isActive: index % 7 !== 0,
    createdAt: new Date(Date.now() - (index + 4) * 86400000).toISOString(),
    cart: { cartItems: index % 3 === 0 ? [{ id: `cart-${index}`, quantity: 1 }] : [] },
    orders: [],
  };
});

const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const paymentMethods = ['COD'];
const orders = Array.from({ length: 36 }, (_, index) => {
  const customer = customers[index % customers.length];
  const orderId = `ord-${String(index + 1).padStart(4, '0')}`;
  const itemCount = 3 + (index % 3);
  const cycleOffset = Math.floor(index / products.length);
  const picked = Array.from({ length: itemCount }, (_, itemIndex) =>
    products[(index * 5 + cycleOffset + itemIndex * 3) % products.length]
  );
  const items = picked.map((product, itemIndex) => {
    const sku = product.productSkus[(index + itemIndex) % product.productSkus.length];
    const quantity = 1 + ((index + itemIndex) % 3);
    const skuAttributes = sku.attributes || {};
    const variant = Object.values(skuAttributes).filter(Boolean).join(' / ') || sku.skuCode;
    return {
      id: `oi-${index + 1}-${itemIndex + 1}`,
      orderId,
      productSkuId: sku.id,
      selectedOptions: JSON.stringify(skuAttributes),
      productName: product.name,
      image: sku.imgUrl,
      quantity,
      unitPrice: sku.price,
    };
  });
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const status = index % customers.length === 0 || index % customers.length === 1
    ? 'Delivered'
    : orderStatuses[index % orderStatuses.length];

  return {
    id: orderId,
    tenantId: tenant.id,
    customerId: customer.id,
    addressId: `addr-${String((index % 2) + 1).padStart(3, '0')}`,
    orderCode: `SH-${String(index + 1).padStart(5, '0')}`,
    paymentReference: `PAY-${String(index + 1).padStart(5, '0')}`,
    paymentMethod: paymentMethods[index % paymentMethods.length],
    paymentStatus: status === 'Cancelled' ? 'Failed' : status === 'Refunded' ? 'Refunded' : index % 5 === 0 ? 'Pending' : 'Paid',
    bankName: null,
    bankCode: null,
    bankAccountNumber: null,
    bankAccountName: null,
    transferContent: null,
    totalAmount,
    paidAt: index % 5 === 0 ? null : new Date(Date.now() - index * 17 * 3600000).toISOString(),
    shippingMethod: index % 4 === 0 ? 'express' : 'standard',
    shippingFee: index % 4 === 0 ? 45000 : 25000,
    status,
    subtotal: totalAmount,
    taxAmount: 0,
    orderNote: index % 3 === 0 ? 'Please pack school supplies carefully.' : null,
    createdAt: new Date(Date.now() - index * 18 * 3600000).toISOString(),
    orderItems: items,
  };
});

customers.forEach((customer) => {
  customer.orders = orders.filter((order) => order.customerId === customer.id).slice(0, 5);
});

const reviewComments = [
  'I bought this for my weekly lecture notes. The paper feels smooth and the ink does not bleed through.',
  'Looks clean on my desk and the color is exactly like the product photo. Good for taking quick notes between classes.',
  'Packed carefully, no bent corners. I used it for two weeks and it still looks neat in my backpack.',
  'Very useful for exam revision. I wish there were one more divider, but the quality is solid for the price.',
  'My study group ordered a few sets and everyone liked them. Simple design, easy to label, and not too bulky.',
  'The size fits my school bag well. I took a photo after organizing my desk because it genuinely made the setup cleaner.',
  'Bought it as part of a back-to-school bundle. Nothing fancy, just reliable and nice enough to use every day.',
  'The finish feels better than the cheaper supplies I usually buy near campus. Delivery was faster than expected.',
  'I use this for math homework and project planning. The pages stay flat enough when writing for a long session.',
  'Good purchase overall. The packaging looked professional and it would be nice as a small gift for classmates.',
  'I like the muted color. It does not look childish, so I can use it for university notes and club meetings.',
  'This helped me keep my desk less messy during finals week. The material feels sturdy and easy to clean.',
];

const reviews = products.flatMap((product, productIndex) => {
  const reviewSkus = product.productSkus.slice(0, 4);
  return Array.from({ length: 12 }, (_, reviewIndex) => {
    const customer = customers[(productIndex * 3 + reviewIndex) % customers.length];
    const sku = reviewSkus[reviewIndex % reviewSkus.length];
    const ratingPattern = [5, 5, 4, 5, 4, 5, 3, 5, 4, 5, 4, 5];

    return {
      id: `rev-${product.id}-${reviewIndex}`,
      tenantId: tenant.id,
      productId: product.id,
      productSkuId: sku.id,
      rating: ratingPattern[(productIndex + reviewIndex) % ratingPattern.length],
      comment: reviewComments[(productIndex + reviewIndex) % reviewComments.length],
      customerId: customer.id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      avatarUrl: customer.avatarUrl,
      createdAt: new Date(Date.now() - (reviewIndex * 2 + productIndex + 1) * 86400000).toISOString(),
      updatedAt: null,
    };
  });
});

const addresses = [
  {
    id: 'addr-001',
    recipientName: 'Van Ngoc Nhu Y',
    receiverName: 'Van Ngoc Nhu Y',
    phone: '0987654321',
    addressLine: '12 Nguyen Van Linh',
    streetAddress: '12 Nguyen Van Linh',
    ward: 'Nam Duong',
    district: 'Hai Chau',
    city: 'Da Nang',
    province: 'Da Nang',
    country: 'Vietnam',
    isDefault: true,
  },
  {
    id: 'addr-002',
    recipientName: 'Van Ngoc Nhu Y',
    receiverName: 'Van Ngoc Nhu Y',
    phone: '0987654321',
    addressLine: '45 Le Duan',
    streetAddress: '45 Le Duan',
    ward: 'Thach Thang',
    district: 'Hai Chau',
    city: 'Da Nang',
    province: 'Da Nang',
    country: 'Vietnam',
    isDefault: false,
  },
  {
    id: 'addr-003',
    recipientName: 'Tran Minh Anh',
    receiverName: 'Tran Minh Anh',
    phone: '0912345678',
    addressLine: 'KTX Khu B, 99 To Hien Thanh',
    streetAddress: 'KTX Khu B, 99 To Hien Thanh',
    ward: 'Phuoc My',
    district: 'Son Tra',
    city: 'Da Nang',
    province: 'Da Nang',
    country: 'Vietnam',
    isDefault: false,
  },
  {
    id: 'addr-004',
    recipientName: 'Nguyen Gia Bao',
    receiverName: 'Nguyen Gia Bao',
    phone: '0934567890',
    addressLine: 'Tang 5, 255 Nguyen Van Linh',
    streetAddress: 'Tang 5, 255 Nguyen Van Linh',
    ward: 'Vinh Trung',
    district: 'Thanh Khe',
    city: 'Da Nang',
    province: 'Da Nang',
    country: 'Vietnam',
    isDefault: false,
  },
  {
    id: 'addr-005',
    recipientName: 'Le Phuong Thao',
    receiverName: 'Le Phuong Thao',
    phone: '0978123456',
    addressLine: '18 Bach Dang',
    streetAddress: '18 Bach Dang',
    ward: 'Thach Thang',
    district: 'Hai Chau',
    city: 'Da Nang',
    province: 'Da Nang',
    country: 'Vietnam',
    isDefault: false,
  },
];

const currentUser = {
  token: 'mock-token',
  userId: 'cus-001',
  email: 'nhuy.vanngoc@example.com',
  role: 'customer',
  tenantId: tenant.id,
  subdomain: tenant.subdomain,
  firstName: 'Nhu Y',
  lastName: 'Van Ngoc',
  fullName: 'Van Ngoc Nhu Y',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
};

const merchantUser = {
  token: 'mock-merchant-token',
  userId: 'merchant-001',
  email: 'merchant@studyhub.test',
  role: 'merchant',
  tenants: demoTenants,
};

const themes = [
  {
    id: 'theme-studyhub-clean',
    name: 'Study Clean',
    isCurrent: true,
    themeConfig: tenant.themeConfig,
  },
  {
    id: 'theme-campus-bright',
    name: 'Campus Bright',
    isCurrent: false,
    themeConfig: {
      colors: {
        primary: '#2563eb',
        background: '#f8fafc',
        text: '#0f172a',
      },
      layout: {
        borderRadius: 10,
      },
      typography: {
        fontFamily: 'Inter',
      },
    },
  },
];

const pages = [
  {
    id: 'page-home',
    title: 'Home',
    slug: 'home',
    isPublished: true,
    contentConfig: tenant.contentConfig.home,
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'page-about',
    title: 'About StudyHub',
    slug: 'about',
    isPublished: true,
    content: 'StudyHub Supplies curates reliable school supplies for students, teachers, and project teams.',
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'page-contact',
    title: 'Contact',
    slug: 'contact',
    isPublished: true,
    content: 'Need bulk class kits or school club bundles? Contact our support team.',
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

const normalizePath = (url = '') => {
  try {
    return new URL(url, 'http://mock.local').pathname;
  } catch {
    return String(url).split('?')[0];
  }
};

const getParams = (config) => {
  const params = new URLSearchParams(config?.url?.split('?')[1] || '');
  Object.entries(config?.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  return params;
};

const paginate = (items, params) => {
  const page = Number(params.get('page') || 1);
  const pageSize = Number(params.get('pageSize') || items.length || 20);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    totalCount: items.length,
    page,
    pageSize,
  };
};

const filterByParams = (items, params) => {
  let result = [...items];
  const search = (params.get('search') || '').toLowerCase();
  const categoryId = params.get('categoryId');
  const status = params.get('status');
  const paymentStatus = params.get('paymentStatus');
  const paymentMethod = params.get('paymentMethod');
  const customerId = params.get('customerId');

  if (search) {
    result = result.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  }
  if (categoryId) result = result.filter((item) => item.categoryId === categoryId);
  if (status) result = result.filter((item) => item.status === status);
  if (paymentStatus) result = result.filter((item) => item.paymentStatus === paymentStatus);
  if (paymentMethod) result = result.filter((item) => item.paymentMethod === paymentMethod);
  if (customerId) result = result.filter((item) => item.customerId === customerId);

  return result;
};

const analyticsDashboard = () => {
  const paidOrders = orders.filter((order) => order.paymentStatus === 'Paid');
  const grossRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    overview: {
      fromUtc: new Date(Date.now() - 30 * 86400000).toISOString(),
      toUtc: new Date().toISOString(),
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      grossRevenue,
      paidRevenue,
      averageOrderValue: Math.round(grossRevenue / orders.length),
      activeCustomers: customers.filter((customer) => customer.isActive).length,
      newCustomers: 9,
    },
    ratings: {
      averageRating: 4.7,
      totalReviews: reviews.length,
      oneStarCount: 1,
      twoStarCount: 2,
      threeStarCount: 7,
      fourStarCount: 34,
      fiveStarCount: reviews.length - 44,
    },
    topProducts: products.slice(0, 10).map((product, index) => ({
      productId: product.id,
      productName: product.name,
      quantitySold: 96 - index * 6,
      orderCount: 42 - index * 2,
      revenue: (96 - index * 6) * product.price,
      averageRating: product.rating,
      reviewCount: product.reviewCount,
    })),
  };
};

const response = (config, data, status = 200) =>
  Promise.resolve({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  });

export const seedMockBrowserSession = () => {
  if (typeof window === 'undefined') return;
  const storedCurrentTenant = (() => {
    try {
      return JSON.parse(window.localStorage.getItem('currentTenant') || 'null');
    } catch {
      return null;
    }
  })();
  const selectedTenant = demoTenants.some((item) => item.tenantId === storedCurrentTenant?.tenantId)
    ? storedCurrentTenant
    : tenant;

  window.localStorage.setItem('tenant_token', currentUser.token);
  window.localStorage.setItem('userId', currentUser.userId);
  window.localStorage.setItem('tenantId', selectedTenant.id);
  window.localStorage.setItem('tenant_subdomain', selectedTenant.subdomain);
  window.localStorage.setItem('auth_role', currentUser.role);
  window.localStorage.setItem('auth_email', currentUser.email);
  window.localStorage.setItem('user', JSON.stringify(merchantUser));
  window.localStorage.setItem('currentTenant', JSON.stringify(selectedTenant));
};

export const createMockAdapter = () => async (config) => {
  seedMockBrowserSession();

  const path = normalizePath(config.url);
  const lowerPath = path.toLowerCase();
  const method = (config.method || 'get').toLowerCase();
  const params = getParams(config);

  if (method === 'get' && (lowerPath === '/tenants/me' || lowerPath === '/api/tenants/me')) return response(config, demoTenants);
  if (method === 'get' && lowerPath.includes('/tenants/subdomain/')) {
    const subdomain = path.match(/\/tenants\/subdomain\/([^/]+)/i)?.[1];
    return response(config, demoTenants.find((item) => item.subdomain === subdomain) || tenant);
  }
  if (method === 'get' && /^\/(?:api\/)?tenants\/[^/]+$/.test(lowerPath)) {
    const tenantId = path.match(/\/tenants\/([^/]+)/i)?.[1];
    const selectedTenant = demoTenants.find((item) => item.id === tenantId || item.tenantId === tenantId);
    if (selectedTenant) return response(config, selectedTenant);
  }
  if (method === 'get' && lowerPath === '/auth/me') return response(config, merchantUser);

  if (method === 'get' && lowerPath.endsWith('/analytics/dashboard')) return response(config, analyticsDashboard());
  if (method === 'get' && lowerPath.endsWith('/analytics/overview')) return response(config, analyticsDashboard().overview);
  if (method === 'get' && lowerPath.endsWith('/analytics/top-products')) return response(config, analyticsDashboard().topProducts);
  if (method === 'get' && lowerPath.endsWith('/analytics/ratings')) return response(config, analyticsDashboard().ratings);

  if (method === 'get' && lowerPath.includes('/themes/current')) return response(config, themes[0]);
  if (method === 'get' && lowerPath.includes('/themes')) return response(config, themes);
  if (method === 'get' && lowerPath.includes('/pages/')) {
    const pageId = path.match(/\/pages\/([^/]+)/i)?.[1];
    return response(config, pages.find((page) => page.id === pageId || page.slug === pageId) || pages[0]);
  }
  if (method === 'get' && lowerPath.includes('/pages')) return response(config, pages);

  if (lowerPath.includes('/reviews')) {
    const productId = path.match(/\/products\/([^/]+)\/reviews/i)?.[1];
    const skuId = path.match(/\/product-skus\/([^/]+)\/reviews/i)?.[1];
    const list = reviews.filter((review) =>
      productId ? review.productId === productId : skuId ? review.productSkuId === skuId : true
    );
    if (lowerPath.endsWith('/summary')) {
      return response(config, {
        totalReviews: list.length,
        averageRating: list.length ? list.reduce((sum, item) => sum + item.rating, 0) / list.length : 0,
        oneStarCount: list.filter((item) => item.rating === 1).length,
        twoStarCount: list.filter((item) => item.rating === 2).length,
        threeStarCount: list.filter((item) => item.rating === 3).length,
        fourStarCount: list.filter((item) => item.rating === 4).length,
        fiveStarCount: list.filter((item) => item.rating === 5).length,
      });
    }
    return response(config, list);
  }

  if (method === 'get' && lowerPath.includes('/categories')) return response(config, categories);

  if (method === 'get' && lowerPath.includes('/products')) {
    const productId = path.match(/\/products\/([^/]+)/)?.[1];
    const product = products.find((item) => item.id === productId) || products[0];
    if (productId && lowerPath.endsWith('/skus')) {
      return response(config, product.productSkus);
    }
    if (productId && !lowerPath.endsWith('/reviews')) {
      return response(config, product);
    }
    return response(config, paginate(filterByParams(products, params), params));
  }

  if (method === 'get' && lowerPath.includes('/customers/')) {
    const customerId = path.match(/\/customers\/([^/]+)/i)?.[1];
    return response(config, customers.find((customer) => customer.id === customerId) || customers[0]);
  }
  if (method === 'get' && lowerPath.includes('/customers')) return response(config, paginate(filterByParams(customers, params), params));
  if (method === 'get' && lowerPath.includes('/orders')) {
    const orderId = path.match(/\/orders\/([^/]+)/i)?.[1];
    if (orderId) return response(config, orders.find((order) => order.id === orderId || order.orderId === orderId) || orders[0]);
    return response(config, paginate(filterByParams(orders, params), params));
  }

  if (method === 'get' && lowerPath === '/api/auth/me') return response(config, currentUser);
  if (method === 'post' && lowerPath.includes('/auth/merchant/login')) return response(config, merchantUser);
  if (method === 'post' && lowerPath.includes('/auth/merchant/register')) return response(config, merchantUser);
  if (method === 'post' && lowerPath.includes('/auth/customer/login')) return response(config, currentUser);
  if (method === 'post' && lowerPath.includes('/auth/customer/register')) return response(config, currentUser);
  if (method === 'post' && lowerPath.includes('/auth/logout')) return response(config, { ok: true });

  if (method === 'get' && lowerPath === '/api/customer/addresses') return response(config, addresses);
  if (method === 'get' && lowerPath === '/api/cart') {
    const cartItems = products.slice(0, 3).map((product, index) => ({
      id: `cart-item-${index + 1}`,
      productSkuId: product.productSkus[0].id,
      productName: product.name,
      product,
      image: product.image,
      quantity: index + 1,
      unitPrice: product.price,
      productSku: product.productSkus[0],
    }));

    return response(config, {
      id: 'cart-001',
      items: cartItems,
      cartItems,
    });
  }

  if (['post', 'put', 'patch', 'delete'].includes(method)) return response(config, { ok: true, id: `mock-${Date.now()}` });

  return response(config, { items: [] });
};
