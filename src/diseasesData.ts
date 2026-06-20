export interface Disease {
  id: string;
  name: string;
  arabicName: string;
  category: 'Viral' | 'Bacterial' | 'Parasitic' | 'Fungal' | 'Nutritional';
  pathogen: string;
  impactedProjects: ('Breeder' | 'Fattening')[];
  affectedAges: string;
  mortalityRate: string;
  transmissionMode: string;
  clinicalSymptoms: string[];
  necropsyFindings: string[];
  differentialDiagnosis: string[];
  treatmentAndControl: string[];
  biosecurityPrevention: string[];
  referenceImagesPlaceholder: {
    flock: string;
    necropsy: string;
  };
}

export const POULTRY_DISEASES: Disease[] = [
  {
    id: "newcastle-disease",
    name: "Newcastle Disease (ND)",
    arabicName: "مرض النيوكاسل",
    category: "Viral",
    pathogen: "Avian Paramyxovirus-1 (APMV-1)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "All ages (highly severe in chicks)",
    mortalityRate: "Up to 50% - 100% in velogenic strains",
    transmissionMode: "Aerosols, contaminated dust, feed, water, equipment, or wild birds.",
    clinicalSymptoms: [
      "Sudden onset of high morbidity and mortality.",
      "Severe respiratory distress: coughing, gasping, sneezing, and rales.",
      "Greenish-yellow watery diarrhea.",
      "Nervous signs (later stage): twisting of head and neck (torticollis), paralysis of wings or legs, tremors.",
      "Drop in egg production in breeders, with soft-shelled/deformed eggs."
    ],
    necropsyFindings: [
      "Pinpoint hemorrhages (petechiae) on the tips of the proventricular glands.",
      "Hemorrhagic ulcers or necrosis in the intestine and cecal tonsils.",
      "Congestion and mucus in the trachea with air sacculitis.",
      "Cloudy or thickened air sacs."
    ],
    differentialDiagnosis: [
      "Avian Influenza (distinguished by swifter mortality & different lesion pattern)",
      "Infectious Bronchitis (no nervous signs, lower mortality)",
      "Fowl Cholera (bacterial, adults more prone)"
    ],
    treatmentAndControl: [
      "No specific antiviral treatment is available for clinical cases.",
      "Supportive therapy: Electrolytes, vitamins, and broad-spectrum antibiotics to control secondary bacterial infections (e.g., E. coli).",
      "Strictest quarantine of the facility and prompt carcass disposal (incineration or deep burial)."
    ],
    biosecurityPrevention: [
      "Live vaccination schedules (HB1, Lasota strains) administered via drinking water, spray, or eye drops.",
      "Inactivated oil-emulsion vaccines at transfer or pre-lay in breeding stocks.",
      "Thorough disinfection cycles between batches using glutaraldehyde or virucidal compounds.",
      "Restricted personnel entry and strictly managed bird-proof mesh on flock houses."
    ],
    referenceImagesPlaceholder: {
      flock: "Huddled broiler birds, greenish-watery droppings, torticollis (necked twisted backwards or sideways).",
      necropsy: "Clear hemorrhage spots on the glands of the proventriculus (stomach area) and ulcerated, blood-filled mucosa."
    }
  },
  {
    id: "avian-influenza",
    name: "Highly Pathogenic Avian Influenza (HPAI)",
    arabicName: "أنفلونزا الطيور عالية الضراوة",
    category: "Viral",
    pathogen: "Influenza A virus (H5 or H7 subtypes)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "All ages",
    mortalityRate: "50% to 100% (often sudden deaths within 48h)",
    transmissionMode: "Migratory wild waterfowls, direct contact, fecal contamination, airborne over short distances.",
    clinicalSymptoms: [
      "Extremely abrupt death with few premonitory signs.",
      "Severe facial, head, and comb swelling (edema) with deep cyanosis (blue/purple discoloration of comb and wattles).",
      "Significant conjunctivitis, nasal discharge, and severe dyspnea.",
      "Hemorrhages on non-feathered skin, especially the shanks/feet.",
      "Complete cessation of feed and water intake."
    ],
    necropsyFindings: [
      "Generalized edema, congestion, and widespread hemorrhages throughout internal organs.",
      "Severe petechial hemorrhages in epicardial fat, proventriculus, and serosal surfaces.",
      "Severe hemorrhagic tracheitis and heavy pulmonary congestion.",
      "Ruptured yolk follicles and peritonitis (in breeder flocks)."
    ],
    differentialDiagnosis: [
      "Velogenic Newcastle Disease (shares similar severe necropsy, requires lab PCR tracing)",
      "Acute Fowl Cholera (bacterial, bipolar rods in blood smears)"
    ],
    treatmentAndControl: [
      "No treatment permitted. It is a highly regulated, reportable zoonotic disease.",
      "Immediate reporting to government veterinary offices.",
      "Depopulation/stamping out of the entire farm, quarantine, and sanitary burial."
    ],
    biosecurityPrevention: [
      "Absolute bird-proofing of houses (preventing wild birds from entering or contacting water tanks).",
      "Sanitizing well-water source (chlorination up to 3-5 ppm).",
      "Compulsory wheel baths, vehicle disinfectants, and complete boot/apparel exchange for farm supervisors."
    ],
    referenceImagesPlaceholder: {
      flock: "Cyanotic purple swollen comb and wattles, sub-cutaneous bleeding on operational broiler legs.",
      necropsy: "Diffuse bleeding spots on heart fat (epicardium), fluid-filled abdominal cavity, heavily congested dark lungs."
    }
  },
  {
    id: "gumboro-disease",
    name: "Infectious Bursal Disease (IBD / Gumboro)",
    arabicName: "مرض الجمبورو",
    category: "Viral",
    pathogen: "Birnavirus (IBD Virus)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "2 to 6 weeks of age (when Bursa of Fabricius is highly active)",
    mortalityRate: "5% to 30% (subclinical forms cause severe immunosuppression)",
    transmissionMode: "Highly contagious; very stable in the litter. Feces, equipment, fomites, and litter beetles (Alphitobius).",
    clinicalSymptoms: [
      "Birds are depressed, ruffled feathers, sleepy, and huddle together in corners.",
      "Watery, whitish, or yellowish diarrhea, leading to soiled vent feathers.",
      "Self-pecking at the vent region due to inflammation of the bursa.",
      "Dehydration, leading to rapid weight loss and sudden drop in feed conversion."
    ],
    necropsyFindings: [
      "Enlarged, edematous, yellow, or heavily hemorrhagic Bursa of Fabricius (found above the cloaca).",
      "In late stages (5+ days post-infection), the bursa becomes highly atrophic (shrunken) and grey.",
      "Severe hemorrhages in the breast and thigh muscles.",
      "Pale, swollen kidneys with urate deposits."
    ],
    differentialDiagnosis: [
      "Coccidiosis (causes dehydration but shows enteric blood, not bursal lesions)",
      "Mycotoxicosis (can cause muscle hemorrhages but Bursa is normal size/not inflamed)"
    ],
    treatmentAndControl: [
      "No specific antiviral treatment exists.",
      "Administer rehydration salts, vitamins, and liver tonics in drinking water.",
      "Lower litter humidity and maintain warm temperature to support sick birds."
    ],
    biosecurityPrevention: [
      "Strict vaccination protocol: Intermediate plus live vaccines via drinking water adjusted precisely to maternal antibody decay (usually days 10-18).",
      "Deep sanitation of breeder houses: IBD is highly resistant to heat and pH; requires phenolic or double-strength iodine disinfectants."
    ],
    referenceImagesPlaceholder: {
      flock: "Huddled broilers with closed eyes, wet vent feathers with white feces, extreme lethargy.",
      necropsy: "Bursa of Fabricius swollen like a dark red cherry (filled with blood) or surrounded by a yellow jelly-like substance."
    }
  },
  {
    id: "infectious-bronchitis",
    name: "Infectious Bronchitis (IB)",
    arabicName: "مرض التهاب الشعب الهوائية المعدي",
    category: "Viral",
    pathogen: "Avian Coronavirus (Infectious Bronchitis Virus)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "All ages (severe in young chicks; causes respiratory-renal synergy)",
    mortalityRate: "Low (1% to 5%), but jumps up to 30% if complicated by E. coli or if nephropathogenic strains strike.",
    transmissionMode: "Inhalation of airborne virus, contaminated equipment, dust, high air currents.",
    clinicalSymptoms: [
      "Gasping, sneezing, coughing, sniffing, and distinctive wet tracheal rales.",
      "Severe wet eyes, mucus nasal discharge.",
      "In nephropathogenic strains: high water consumption, wet litter, and severe shivering.",
      "Breeders: drastic drop in egg production, wrinkled, thin-walled, or watery egg whites (loss of internal quality)."
    ],
    necropsyFindings: [
      "Serous, catarrhal, or caseous exudate in the lower trachea and bronchi.",
      "Yellow plug of cheese-like exudate (caseous core) at the bifurcation of the trachea in young chicks.",
      "Cloudy air sacs containing foam or mild yellow discharge.",
      "Swollen, pale kidneys with tubules and ureters distended with chalky white urates (renal form)."
    ],
    differentialDiagnosis: [
      "Infectious Coryza (distinguished by severe facial/infraorbital sinus swelling and foul smell)",
      "Newcastle Disease (IB lacks nervous signs and proventriculus hemorrhages)"
    ],
    treatmentAndControl: [
      "No viral treatment.",
      "Flush flock with kidney flushers (such as potassium citrate or ammonium chloride) in case of renal forms.",
      "Broad-spectrum antibiotics (such as doxycycline or tilmicosin) to battle secondary CRD/colibacillosis."
    ],
    biosecurityPrevention: [
      "Routine live vaccinations (H120, Ma5 strains) at day 1 or via coarse spray at hatchery.",
      "Variant booster vaccinations tailored to local strains (e.g., QX or 4/91 strains) via drinking water.",
      "Optimize air quality: control ammonia levels (<15 ppm) to protect respiratory tract linings."
    ],
    referenceImagesPlaceholder: {
      flock: "Chicks gasping with open beaks, neck extended, mild nasal discharge, damp litter environment.",
      necropsy: "Pale, enlarged speckled kidneys (with white chalky appearance) and mucus plugs inside the bottom of the windpipe."
    }
  },
  {
    id: "coccidiosis",
    name: "Coccidiosis",
    arabicName: "مرض الكوكسيديا (الاسهال الدموي)",
    category: "Parasitic",
    pathogen: "Eimeria protozoa (E. tenella, E. necatrix, E. acervulina, E. maxima)",
    impactedProjects: ["Fattening", "Breeder"],
    affectedAges: "3 to 6 weeks of age (when litter moisture rises)",
    mortalityRate: "Moderate to high if untreated (5% to 25%)",
    transmissionMode: "Ingestion of sporulated oocysts from wet litter, soil, dirty footwear, or equipment.",
    clinicalSymptoms: [
      "Severe pale combs, thin carcasses, and ruffled feathers.",
      "Bloody or chocolate-colored droppings; wet, foul-smelling litter.",
      "Sudden, massive drop in feed intake but increased water demand.",
      "Crowding together near heat sources due to chills."
    ],
    necropsyFindings: [
      "E. tenella: Severely distended, blood-filled ceca (blind pouches) with dark blood clots or cheese-like cores.",
      "E. maxima / necatrix: Ballooned mid-intestine with orange mucus and pinpoint hemorrhages along the bowel wall.",
      "White ladder-like transverse lesions in the upper duodenum (E. acervulina)."
    ],
    differentialDiagnosis: [
      "Necrotic Enteritis (bacterial disease caused by Clostridium perfringens, often develops secondary to Coccidiosis)",
      "Salmonellosis (causes diarrhea but lacks the specific localized bloody lesions)"
    ],
    treatmentAndControl: [
      "Water-soluble Anticoccidials: Amprolium, Toltrazuril (Baycox), or Sulfa-quinoxaline.",
      "Immediate administration of Vitamin K to support clotting and heal gut lining, and Vitamin A.",
      "Dry up the wet spots by removing damp litter and adding hydrated lime."
    ],
    biosecurityPrevention: [
      "Use of coccidiostats in starter and grower feeds (shuttle programs alternating Ionophores and Chemicals).",
      "Live coccidiosis vaccines sprayed on day-old chicks at hatchery.",
      "Control litter condition: Maintain litter moisture between 20-30%. Keep drinkers from leaking.",
      "Regular scrubbing and disinfection of house walls using oocyst-destroying chemicals (based on cresols)."
    ],
    referenceImagesPlaceholder: {
      flock: "Broilers standing hunched with drooped wings, extremely pale beak and skin, red/bloody spots on wood shavings.",
      necropsy: "Two enlarged, dark sausage-shaped blind guts (ceca) bulging with fresh blood or coagulated greyish fibrin."
    }
  },
  {
    id: "crd-mycoplasmosis",
    name: "Chronic Respiratory Disease (CRD / Airsacculitis)",
    arabicName: "مرض التنفس المزمن (الميكوبلازما)",
    category: "Bacterial",
    pathogen: "Mycoplasma gallisepticum (MG)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "All ages (frequent during rapid growth peaks at 4-6 weeks)",
    mortalityRate: "Low if single infection, but rises heavily (10% to 30%) when joined by E. coli or tracheal viruses.",
    transmissionMode: "Transovarian (vertical transmission from infected breeder hen to egg), aerosols, water.",
    clinicalSymptoms: [
      "Characteristic persistent snick, gurgling sound in the house at night.",
      "Swollen faces, runny noses, and foam at the corners of the eyes.",
      "Marked reduce in weight gain and increased number of low-grade runts."
    ],
    necropsyFindings: [
      "Severe Airsacculitis: cloudy, thickened, or heavily pus-filled (yellow cheese-like flakes) air sacs.",
      "Fibrinous pericarditis (milky layer covering the heart) and perihepatitis (yellowish crust covering the liver) when paired with E. coli."
    ],
    differentialDiagnosis: [
      "Infectious Coryza (shows worse facial swelling and has a distinct putrid nasal odor)",
      "Avian Influenza (exhibits massive bleeding, much higher mortality)"
    ],
    treatmentAndControl: [
      "Ailment-specific antibiotics: Tylosin, Tiamulin, Tilmicosin, Doxycycline, or Enrofloxacin.",
      "Expectorants and bronchial dilators in water to clear mucus.",
      "Improve ventilation to clear dust particles which aggravate respiratory cells."
    ],
    biosecurityPrevention: [
      "Purchase chicks strictly from certified MG-free breeder flocks.",
      "Vaccinate breeder pullets with live F-strain or water-administered TS-11 vaccines.",
      "Maintain biosecurity protocols regarding multi-age farms (never mix different age groups in one project area)."
    ],
    referenceImagesPlaceholder: {
      flock: "Broilers with bubbly foam surrounding the eye, crusty nostrils, dirt-stained shoulders from rubbing beak.",
      necropsy: "Air sacs that look like opaque sheets filled with crumbly yellow cheese material rather than normal crystal-clear sacs."
    }
  },
  {
    id: "colibacillosis",
    name: "Colibacillosis (E. coli Infection)",
    arabicName: "مرض الكولاي (التهاب الأكياس الهوائية والمفاصل)",
    category: "Bacterial",
    pathogen: "Escherichia coli (Avian Pathogenic E. coli - APEC strains)",
    impactedProjects: ["Breeder", "Fattening"],
    affectedAges: "All ages (severe in brooding first-week or post-vaccinal strain reactions)",
    mortalityRate: "5% to 20%; causes heavy condemnation of carcasses at slaughter.",
    transmissionMode: "Fecal contamination of hatching eggs, dirty litter, rodent/insect vectors, poor air filters.",
    clinicalSymptoms: [
      "High early chick mortality (mushy chick disease / omphalitis) in week 1.",
      "Lethargy, diarrhea, respiratory sounds.",
      "Slow growth, lame birds with swollen hock joints (E. coli arthritis)."
    ],
    necropsyFindings: [
      "Yellowish-white fibro-purulent film covering the liver (perihepatitis) and heart (pericarditis).",
      "Inflamed, egg-yolk-filled abdomen (peritonitis) in adult breeders.",
      "Unabsorbed, foul-smelling yolk sacs and inflamed navels in day-old chicks."
    ],
    differentialDiagnosis: [
      "Salmonellosis (causes similar systemic chick deaths, requires diagnostic culturing)",
      "Aspergillosis (causes yellow nodules in lungs, but no fibrinous coatings over liver)"
    ],
    treatmentAndControl: [
      "Antibiotics based on sensitivity test (antibiogram): Florfenicol, Fosfomycin, or Enrofloxacin.",
      "Intestinal acidifiers (organic acids) in water to hamper E. coli growth in the gut."
    ],
    biosecurityPrevention: [
      "Excellent hatchery sanitation: fumigation and disinfection of eggs within 2 hours of laying.",
      "Strict rodent and fly control program (since they carry pathogen strains).",
      "Chlorination of drinking water (2-3 ppm free chlorine at drinker level)."
    ],
    referenceImagesPlaceholder: {
      flock: "Flabby navels in brooding boxes, damp vents, lame broilers refusing to stand with swollen knees.",
      necropsy: "The classic 'three-layered plaque': heart covered in white sheets, liver enveloped in thick yellow butter-like crust, cloudy gut."
    }
  },
  {
    id: "necrotic-enteritis",
    name: "Necrotic Enteritis (NE)",
    arabicName: "مرض التهاب الأمعاء التنخري",
    category: "Bacterial",
    pathogen: "Clostridium perfringens (Type A and C)",
    impactedProjects: ["Fattening"],
    affectedAges: "2 to 5 weeks of age (frequently triggered by coccidial gut injury)",
    mortalityRate: "2% to 15% (huge subclinical impact on flock feed conversion)",
    transmissionMode: "Spore ingestion from soil, litter, animal by-product feeds, or normal gut flora overgrowth.",
    clinicalSymptoms: [
      "Sudden death of healthy-looking, heavy broilers.",
      "Extreme depression, reluctance to move, ruffled feathers.",
      "Dark, blood-tinged or greasy diarrhea with foul smell."
    ],
    necropsyFindings: [
      "Intestines (mostly jejunum/ileum) are ballooned and friable (tear easily).",
      "Internal mucosal lining of the intestine has a thick, yellow-brown crust or 'Turkish towel' appearance.",
      "Gas bubbles in the intestinal lumen."
    ],
    differentialDiagnosis: [
      "Intestinal Coccidiosis (often co-exists; check for white ladder plaques or deep focal dots)",
      "Ulcerative Enteritis (shows distinct button ulcers in liver and bowel)"
    ],
    treatmentAndControl: [
      "Antibiotics targeting anaerobes: Amoxicillin, Bacitracin (BMD), Tylosin, or Lincomycin in drinking water.",
      "Lower high-protein feeds (especially fishmeal or wheat) which stimulate Clostridium.",
      "Immediately treat underlying Coccidiosis if present."
    ],
    biosecurityPrevention: [
      "Use of feed probiotics, prebiotics, and essential oils to keep stable gut balance.",
      "Avoid sudden adjustments in broiler feed formulations.",
      "Ensure litter stays dry; wet wood shavings foster Clostridia spore germination."
    ],
    referenceImagesPlaceholder: {
      flock: "Rapid bloating of birds post-mortem, dark feces on floor, broilers sitting crouched and dying fast.",
      necropsy: "Intestinal wall looks like dry velvet towel with greyish-yellow dead skin easily peeled off, releasing a putrid smell."
    }
  }
];

export interface DiagnosisCriteria {
  ageGroup: 'Brooding (Week 1)' | 'Growing (Week 2-4)' | 'Finishing (Week 5+)';
  predominantSign: 'Respiratory' | 'Enteric/Diarrhea' | 'Nervous' | 'Locomotor/Skeletal' | 'Acute/Sudden Deaths';
  necropsyHint: 'Yes' | 'No';
}
