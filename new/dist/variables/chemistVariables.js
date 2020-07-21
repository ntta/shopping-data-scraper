"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoryList = exports.chemistWarehouseCategoriesPath = exports.chemistWarehouseProductsPath = exports.categoryApi = void 0;
var categoryApi = 'https://www.chemistwarehouse.com.au/searchapi/webapi/search/category?'; //category=542&index=0&sort='

exports.categoryApi = categoryApi;
var chemistWarehouseProductsPath = './data/products/chemist-warehouse-special-products.json';
exports.chemistWarehouseProductsPath = chemistWarehouseProductsPath;
var chemistWarehouseCategoriesPath = './data/products/chemist-warehouse-special-categories.json';
exports.chemistWarehouseCategoriesPath = chemistWarehouseCategoriesPath;
var categoryList = [{
  categoryId: 'health',
  categoryName: 'Health',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/256/health',
  subCategories: [{
    categoryNumber: '81',
    subCategoryId: 'vitamins',
    categoryName: 'Vitamins',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/81/vitamins'
  }, {
    categoryNumber: '82',
    subCategoryId: 'tonics',
    categoryName: 'Tonics',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/82/tonics'
  }, {
    categoryNumber: '517',
    subCategoryId: 'weight-loss',
    categoryName: 'Weight Loss',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/517/weight-loss'
  }, {
    categoryNumber: '523',
    subCategoryId: 'natural-hormone-replacement',
    categoryName: 'Natural Hormone Replacement',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/523/natural-hormone-replacement'
  }, {
    categoryNumber: '527',
    subCategoryId: 'aromatherapy',
    categoryName: 'Aromatherapy',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/527/aromatherapy'
  }, {
    categoryNumber: '608',
    subCategoryId: 'arthritis-relief',
    categoryName: 'Arthritis Relief',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/608/arthritis-relief'
  }, {
    categoryNumber: '1255',
    subCategoryId: 'sports-nutrition',
    categoryName: 'Sports Nutrition',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1255/sports-nutrition'
  }, {
    categoryNumber: '3248',
    subCategoryId: 'milk-supplements',
    categoryName: 'Milk Supplements',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3248/milk-supplements'
  }, {
    categoryNumber: '539',
    subCategoryId: 'brauer-natural-medicine',
    categoryName: 'Brauer Natural Medicine',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/539/brauer-natural-medicine'
  }, {
    categoryNumber: '4379',
    subCategoryId: 'miscellaneous',
    categoryName: 'Miscellaneous',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/4379/miscellaneous'
  }]
}, {
  categoryId: 'beauty',
  categoryName: 'Beauty',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/257/beauty',
  subCategories: [{
    categoryNumber: '230',
    subCategoryId: 'acne',
    categoryName: 'Acne',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/230/acne'
  }, {
    categoryNumber: '232',
    subCategoryId: 'hair-removal',
    categoryName: 'Hair Removal',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/232/hair-removal'
  }, {
    categoryNumber: '233',
    subCategoryId: 'anti-itch',
    categoryName: 'Anti-Itch',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/233/anti-itch'
  }, {
    categoryNumber: '236',
    subCategoryId: 'cleansers',
    categoryName: 'Cleansers',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/236/cleansers'
  }, {
    categoryNumber: '542',
    subCategoryId: 'fragrances',
    categoryName: 'Fragrances',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/542/fragrances'
  }, {
    categoryNumber: '648',
    subCategoryId: 'cosmetics',
    categoryName: 'Cosmetics',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/648/cosmetics'
  }, {
    categoryNumber: '665',
    subCategoryId: 'skin-care',
    categoryName: 'Skin Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/665/skin-care'
  }, {
    categoryNumber: '770',
    subCategoryId: 'scar-treatment',
    categoryName: 'Scar Treatment',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/770/scar-treatment'
  }, {
    categoryNumber: '1023',
    subCategoryId: 'swisspers',
    categoryName: 'Swisspers',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1023/swisspers'
  }, {
    categoryNumber: '3621',
    subCategoryId: 'beauty-accessories',
    categoryName: 'Beauty Accessories',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3621/beauty-accessories'
  }, {
    categoryNumber: '3722',
    subCategoryId: 'beauty-miscellaneous',
    categoryName: 'Beauty Miscellaneous',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3722/beauty-miscellaneous'
  }]
}, {
  categoryId: 'medicines',
  categoryName: 'Medicines',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/258/medicines',
  subCategories: [{
    categoryNumber: '55',
    subCategoryId: 'pharmaceutical-preparations',
    categoryName: 'Pharmaceutical Preparations',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/55/pharmaceutical-preparations'
  }, {
    categoryNumber: '99',
    subCategoryId: 'first-aid',
    categoryName: 'First Aid',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/99/first-aid'
  }, {
    categoryNumber: '174',
    subCategoryId: 'anti-inflammatory-and-heat-rubs',
    categoryName: 'Anti-Inflammatory and Heat Rubs',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/174/anti-inflammatory-and-heat-rubs'
  }, {
    categoryNumber: '175',
    subCategoryId: 'stomach-and-anti-diarrhoea',
    categoryName: 'Stomach and Anti-Diarrhoea',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/175/stomach-and-anti-diarrhoea'
  }, {
    categoryNumber: '176',
    subCategoryId: 'anti-nauseants',
    categoryName: 'Anti-Nauseants',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/176/anti-nauseants'
  }, {
    categoryNumber: '178',
    subCategoryId: 'haemorrhoids',
    categoryName: 'Haemorrhoids',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/178/haemorrhoids'
  }, {
    categoryNumber: '181',
    subCategoryId: 'laxatives',
    categoryName: 'Laxatives',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/181/laxatives'
  }, {
    categoryNumber: '182',
    subCategoryId: 'eye-care-and-treatments',
    categoryName: 'Eye Care and Treatments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/182/eye-care-and-treatments'
  }, {
    categoryNumber: '184',
    subCategoryId: 'ear-care-and-treatments',
    categoryName: 'Ear Care and Treatments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/184/ear-care-and-treatments'
  }, {
    categoryNumber: '185',
    subCategoryId: 'worming-treatments',
    categoryName: 'Worming Treatments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/185/worming-treatments'
  }, {
    categoryNumber: '186',
    subCategoryId: 'sedatives',
    categoryName: 'Sedatives',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/186/sedatives'
  }, {
    categoryNumber: '188',
    subCategoryId: 'stimulants',
    categoryName: 'Stimulants',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/188/stimulants'
  }, {
    categoryNumber: '191',
    subCategoryId: 'electrolyte-replacements',
    categoryName: 'Electrolyte Replacements',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/191/electrolyte-replacements'
  }, {
    categoryNumber: '192',
    subCategoryId: 'miscellaneous-medicines',
    categoryName: 'Miscellaneous Medicines',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/192/miscellaneous-medicines'
  }, {
    categoryNumber: '196',
    subCategoryId: 'analgesics',
    categoryName: 'Analgesics',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/196/analgesics'
  }, {
    categoryNumber: '198',
    subCategoryId: 'smoking-deterrents',
    categoryName: 'Smoking Deterrents',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/198/smoking-deterrents'
  }, {
    categoryNumber: '238',
    subCategoryId: 'anti-fungal-warts',
    categoryName: 'Anti-fungal & Warts',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/238/anti-fungal-warts'
  }, {
    categoryNumber: '553',
    subCategoryId: 'hair-loss-treatments',
    categoryName: 'Hair Loss Treatments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/553/hair-loss-treatments'
  }, {
    categoryNumber: '607',
    subCategoryId: 'hangover-preparations',
    categoryName: 'Hangover Preparations',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/607/hangover-preparations'
  }, {
    categoryNumber: '609',
    subCategoryId: 'topical-ointments',
    categoryName: 'Topical Ointments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/609/topical-ointments'
  }, {
    categoryNumber: '664',
    subCategoryId: 'travel',
    categoryName: 'Travel',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/664/travel'
  }, {
    categoryNumber: '723',
    subCategoryId: 'low-dose-aspirin',
    categoryName: 'Low Dose Aspirin',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/723/low-dose-aspirin'
  }, {
    categoryNumber: '783',
    subCategoryId: 'fibre-supplements',
    categoryName: 'Fibre Supplements',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/783/fibre-supplements'
  }, {
    categoryNumber: '1092',
    subCategoryId: 'allergy,-hayfever-anti-histamines',
    categoryName: 'Allergy, Hayfever & Anti-Histamines',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1092/allergy,-hayfever-anti-histamines'
  }, {
    categoryNumber: '1093',
    subCategoryId: 'cold-flu',
    categoryName: 'Cold & Flu',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1093/cold-flu'
  }, {
    categoryNumber: '1094',
    subCategoryId: 'coughs',
    categoryName: 'Coughs',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1094/coughs'
  }, {
    categoryNumber: '1450',
    subCategoryId: 'cold-sore-treatments',
    categoryName: 'Cold Sore Treatments',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1450/cold-sore-treatments'
  }, {
    categoryNumber: '2596',
    subCategoryId: 'essential-oils',
    categoryName: 'Essential Oils',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/2596/essential-oils'
  }, {
    categoryNumber: '3084',
    subCategoryId: 'irritable-bowel-syndrome-ibs',
    categoryName: 'Irritable Bowel Syndrome - IBS',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3084/irritable-bowel-syndrome-ibs'
  }, {
    categoryNumber: '3409',
    subCategoryId: 'urinary-tract-infections-uti',
    categoryName: 'Urinary Tract Infections UTI',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3409/urinary-tract-infections-uti'
  }]
}, {
  categoryId: 'personal-care',
  categoryName: 'Personal Care',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/259/personal-care',
  subCategories: [{
    categoryNumber: '20',
    subCategoryId: 'baby-care',
    categoryName: 'Baby Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/20/baby-care'
  }, {
    categoryNumber: '2011',
    subCategoryId: 'pantyhose',
    categoryName: 'Pantyhose',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/2011/pantyhose'
  }, {
    categoryNumber: '89',
    subCategoryId: 'sexual-health',
    categoryName: 'Sexual Health',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/89/sexual-health'
  }, {
    categoryNumber: '90',
    subCategoryId: 'feminine-hygiene',
    categoryName: 'Feminine Hygiene',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/90/feminine-hygiene'
  }, {
    categoryNumber: '109',
    subCategoryId: 'foot-care',
    categoryName: 'Foot Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/109/foot-care'
  }, {
    categoryNumber: '129',
    subCategoryId: 'hair-care',
    categoryName: 'Hair Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/129/hair-care'
  }, {
    categoryNumber: '149',
    subCategoryId: 'men-s-toiletries',
    categoryName: "Men's Toiletries",
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/149/men-s-toiletries'
  }, {
    categoryNumber: '159',
    subCategoryId: 'oral-hygiene-and-dental-care',
    categoryName: 'Oral Hygiene and Dental Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/159/oral-hygiene-and-dental-care'
  }, {
    categoryNumber: '209',
    subCategoryId: 'sun-care',
    categoryName: 'Sun Care',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/209/sun-care'
  }, {
    categoryNumber: '229',
    subCategoryId: 'batteries',
    categoryName: 'Batteries',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/229/batteries'
  }, {
    categoryNumber: '234',
    subCategoryId: 'hand-and-body',
    categoryName: 'Hand and Body',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/234/hand-and-body'
  }, {
    categoryNumber: '514',
    subCategoryId: 'insect-repellents',
    categoryName: 'Insect Repellents',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/514/insect-repellents'
  }, {
    categoryNumber: '564',
    subCategoryId: 'women-s-toiletries',
    categoryName: "Women's Toiletries",
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/564/women-s-toiletries'
  }, {
    categoryNumber: '617',
    subCategoryId: 'men-s-and-women-s-incontinence',
    categoryName: "Men's and Women's Incontinence",
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/617/men-s-and-women-s-incontinence'
  }, {
    categoryNumber: '792',
    subCategoryId: 'household',
    categoryName: 'Household',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/792/household'
  }, {
    categoryNumber: '1111',
    subCategoryId: 'tissues-cotton-wool',
    categoryName: 'Tissues & Cotton Wool',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1111/tissues-cotton-wool'
  }, {
    categoryNumber: '1183',
    subCategoryId: 'deodorants',
    categoryName: 'Deodorants',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/1183/deodorants'
  }, {
    categoryNumber: '4493',
    subCategoryId: 'natio-bath-body',
    categoryName: 'Natio Bath & Body',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/4493/natio-bath-body'
  }]
}, {
  categoryId: 'medical-aids',
  categoryName: 'Medical Aids',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/260/medical-aids',
  subCategories: [{
    categoryNumber: '224',
    subCategoryId: 'medical-equipment',
    categoryName: 'Medical Equipment',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/224/medical-equipment'
  }, {
    categoryNumber: '226',
    subCategoryId: 'sport-braces-therapy',
    categoryName: 'Sport Braces & Therapy',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/226/sport-braces-therapy'
  }, {
    categoryNumber: '724',
    subCategoryId: 'blood-pressure-monitors',
    categoryName: 'Blood Pressure Monitors',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/724/blood-pressure-monitors'
  }, {
    categoryNumber: '725',
    subCategoryId: 'blood-glucose-monitors',
    categoryName: 'Blood Glucose Monitors',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/725/blood-glucose-monitors'
  }, {
    categoryNumber: '726',
    subCategoryId: 'tens-and-massage-therapy',
    categoryName: 'TENS and Massage Therapy',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/726/tens-and-massage-therapy'
  }, {
    categoryNumber: '727',
    subCategoryId: 'snoring',
    categoryName: 'Snoring',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/727/snoring'
  }, {
    categoryNumber: '803',
    subCategoryId: 'asthma-relief',
    categoryName: 'Asthma Relief',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/803/asthma-relief'
  }, {
    categoryNumber: '814',
    subCategoryId: 'thermometers',
    categoryName: 'Thermometers',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/814/thermometers'
  }, {
    categoryNumber: '3216',
    subCategoryId: 'mobility-aids',
    categoryName: 'Mobility Aids',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3216/mobility-aids'
  }]
}, {
  categoryId: 'veterinary-and-pet-care',
  categoryName: 'Veterinary and Pet Care',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/651/veterinary-and-pet-care',
  subCategories: [{
    categoryNumber: '653',
    subCategoryId: 'heartworm-control-products',
    categoryName: 'Heartworm Control Products',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/653/heartworm-control-products'
  }, {
    categoryNumber: '654',
    subCategoryId: 'combined-flea-heartworm-products',
    categoryName: 'Combined Flea & Heartworm Products',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/654/combined-flea-heartworm-products'
  }, {
    categoryNumber: '656',
    subCategoryId: 'worming-products',
    categoryName: 'Worming Products',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/656/worming-products'
  }, {
    categoryNumber: '659',
    subCategoryId: 'combined-flea-tick-products',
    categoryName: 'Combined Flea & Tick Products',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/659/combined-flea-tick-products'
  }, {
    categoryNumber: '652',
    subCategoryId: 'flea-control-products',
    categoryName: 'Flea Control Products',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/652/flea-control-products'
  }, {
    categoryNumber: '3127',
    subCategoryId: 'paw-pure-animal-wellbeing-by-blackmores',
    categoryName: 'PAW Pure Animal Wellbeing by Blackmores',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/3127/paw-pure-animal-wellbeing-by-blackmores'
  }, {
    categoryNumber: '4343',
    subCategoryId: 'daily-dog',
    categoryName: 'Daily Dog',
    subCategoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/4343/daily-dog'
  }]
}, {
  categoryNumber: '694',
  categoryId: 'confectionery',
  categoryName: 'Confectionery',
  categoryUrl: 'https://www.chemistwarehouse.com.au/shop-online/694/confectionery',
  subCategories: []
}];
exports.categoryList = categoryList;