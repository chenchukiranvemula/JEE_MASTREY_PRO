/* =========================================================
   JEE MASTREY PRO
   PHASE 2 — COMPLETE STUDY ENGINE
   Version: P2.0

   CONNECTS WITH:
   - Main index.html
   - script.js
   - phase2.css
   - phase3.js

   FEATURES:
   ✓ JEE
      Physics + Chemistry + Mathematics

   ✓ NEET
      Physics + Chemistry + Biology

   ✓ CA
      Foundation subjects

   ✓ Syllabus
   ✓ Theory
   ✓ Formulas
   ✓ Tricks
   ✓ Important Topics
   ✓ Subject navigation
   ✓ Chapter navigation
   ✓ Progress tracking
   ✓ LocalStorage
   ✓ Exam switching
   ✓ Phase 1 ↔ Phase 2 connection
   ✓ Phase 2 ↔ Phase 3 data connection

   PYQ ENGINE IS INTENTIONALLY NOT INCLUDED.
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       GLOBAL STATE
    ===================================================== */

    const P2 = {

        exam: "jee",

        subject: "physics",

        mode: "syllabus",

        selectedChapter: null,

        progress: {},

        initialized: false

    };


    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY =
        "JEE_MASTREY_PRO_PHASE2_PROGRESS";

    const EXAM_KEY =
        "JEE_MASTREY_PRO_CURRENT_EXAM";


    function loadStorage() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (saved) {

                P2.progress =
                    JSON.parse(saved) || {};

            }

        } catch (error) {

            console.warn(
                "Phase 2 storage load failed:",
                error
            );

            P2.progress = {};

        }


        try {

            const savedExam =
                localStorage.getItem(EXAM_KEY);

            if (
                savedExam === "jee" ||
                savedExam === "neet" ||
                savedExam === "ca"
            ) {

                P2.exam = savedExam;

            }

        } catch (error) {

            console.warn(
                "Exam storage unavailable."
            );

        }

    }


    function saveStorage() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(P2.progress)
            );

        } catch (error) {

            console.warn(
                "Phase 2 progress could not be saved."
            );

        }

    }


    /* =====================================================
       DATA HELPERS
    ===================================================== */

    function topicList(text) {

        if (!text) return [];

        return text
            .split("|")
            .map(item => item.trim())
            .filter(Boolean);

    }


    function chapter(
        name,
        topics,
        priority = "normal",
        formulas = []
    ) {

        return {

            name,

            topics:
                Array.isArray(topics)
                    ? topics
                    : topicList(topics),

            priority,

            formulas

        };

    }


    /* =====================================================
       JEE DATA
    ===================================================== */

    const JEE_DATA = {

        physics: {

            icon: "⚛️",

            description:
                "Mechanics, electricity, magnetism, optics, modern physics and more.",

            chapters: [

                chapter(
                    "Units and Measurements",
                    "Units and systems of units|Dimensions|Dimensional analysis|Significant figures|Errors in measurement",
                    "important"
                ),

                chapter(
                    "Kinematics",
                    "Motion in one dimension|Motion in two dimensions|Position and displacement|Velocity|Acceleration|Projectile motion|Relative velocity",
                    "important"
                ),

                chapter(
                    "Laws of Motion",
                    "Newton's laws|Free body diagrams|Friction|Circular motion|Pseudo force|Connected bodies",
                    "important"
                ),

                chapter(
                    "Work, Energy and Power",
                    "Work done by constant force|Variable force|Kinetic energy|Potential energy|Work-energy theorem|Power|Conservation of energy",
                    "important"
                ),

                chapter(
                    "Centre of Mass and System of Particles",
                    "Centre of mass|Motion of centre of mass|Momentum|Impulse|Collisions|Conservation of momentum",
                    "normal"
                ),

                chapter(
                    "Rotational Motion",
                    "Angular displacement|Angular velocity|Angular acceleration|Torque|Moment of inertia|Angular momentum|Rolling motion",
                    "important"
                ),

                chapter(
                    "Gravitation",
                    "Newton's law of gravitation|Acceleration due to gravity|Potential|Potential energy|Escape velocity|Satellites|Kepler's laws",
                    "normal"
                ),

                chapter(
                    "Properties of Solids and Liquids",
                    "Elasticity|Stress and strain|Fluid pressure|Viscosity|Surface tension|Bernoulli theorem|Capillarity",
                    "normal"
                ),

                chapter(
                    "Thermal Properties of Matter",
                    "Temperature|Thermal expansion|Heat|Calorimetry|Heat transfer|Newton's law of cooling",
                    "normal"
                ),

                chapter(
                    "Thermodynamics",
                    "Thermal equilibrium|Zeroth law|First law|Second law|Internal energy|Heat engines|Refrigerators",
                    "important"
                ),

                chapter(
                    "Kinetic Theory of Gases",
                    "Ideal gas|Pressure of gas|Kinetic interpretation of temperature|RMS speed|Degrees of freedom|Mean free path",
                    "normal"
                ),

                chapter(
                    "Oscillations",
                    "Simple harmonic motion|Spring system|Energy in SHM|Pendulum|Time period|Phase",
                    "important"
                ),

                chapter(
                    "Waves",
                    "Wave motion|Progressive waves|Standing waves|String waves|Sound waves|Beats|Doppler effect",
                    "important"
                ),

                chapter(
                    "Electrostatics",
                    "Electric charge|Coulomb law|Electric field|Electric potential|Dipole|Gauss law|Capacitance",
                    "important"
                ),

                chapter(
                    "Current Electricity",
                    "Electric current|Drift velocity|Ohm law|Resistance|Series and parallel circuits|Kirchhoff laws|Wheatstone bridge|Potentiometer",
                    "important"
                ),

                chapter(
                    "Moving Charges and Magnetism",
                    "Lorentz force|Motion of charge in magnetic field|Biot-Savart law|Ampere law|Cyclotron|Force on current carrying conductor",
                    "important"
                ),

                chapter(
                    "Magnetism and Matter",
                    "Magnetic dipole|Earth magnetism|Magnetic materials|Magnetic field lines|Hysteresis",
                    "normal"
                ),

                chapter(
                    "Electromagnetic Induction",
                    "Faraday law|Lenz law|Motional emf|Self induction|Mutual induction|Eddy currents",
                    "important"
                ),

                chapter(
                    "Alternating Current",
                    "AC voltage|RMS values|Reactance|Impedance|LCR circuit|Resonance|Transformer",
                    "important"
                ),

                chapter(
                    "Electromagnetic Waves",
                    "Displacement current|Electromagnetic spectrum|Properties of EM waves|Applications",
                    "normal"
                ),

                chapter(
                    "Optics",
                    "Reflection|Refraction|Mirrors|Lenses|Prism|Optical instruments|Wave optics|Interference|Diffraction|Polarisation",
                    "important"
                ),

                chapter(
                    "Dual Nature of Matter and Radiation",
                    "Photoelectric effect|Einstein equation|Matter waves|de Broglie wavelength",
                    "important"
                ),

                chapter(
                    "Atoms and Nuclei",
                    "Bohr model|Hydrogen spectrum|Nuclear size|Binding energy|Radioactivity|Nuclear reactions",
                    "important"
                ),

                chapter(
                    "Electronic Devices",
                    "Semiconductors|Intrinsic and extrinsic semiconductors|Diodes|Rectifiers|Zener diode|Transistor|Logic gates",
                    "important"
                )

            ]

        },


        chemistry: {

            icon: "🧪",

            description:
                "Physical, organic and inorganic chemistry with concepts, reactions and formulas.",

            chapters: [

                chapter(
                    "Some Basic Concepts of Chemistry",
                    "Mole concept|Atomic mass|Molecular mass|Stoichiometry|Limiting reagent|Percentage composition",
                    "important"
                ),

                chapter(
                    "Atomic Structure",
                    "Bohr model|Quantum numbers|Orbitals|Electronic configuration|Photoelectric effect|Hydrogen spectrum",
                    "important"
                ),

                chapter(
                    "Chemical Bonding",
                    "Ionic bonding|Covalent bonding|Lewis structures|VSEPR|Hybridisation|Molecular orbital theory|Hydrogen bonding",
                    "important"
                ),

                chapter(
                    "Chemical Thermodynamics",
                    "System and surroundings|Enthalpy|Entropy|Gibbs energy|Hess law|First law|Second law",
                    "important"
                ),

                chapter(
                    "Solutions",
                    "Concentration terms|Raoult law|Colligative properties|Osmotic pressure|Abnormal molar mass",
                    "important"
                ),

                chapter(
                    "Equilibrium",
                    "Chemical equilibrium|Equilibrium constant|Le Chatelier principle|Ionic equilibrium|pH|Buffer|Solubility product",
                    "important"
                ),

                chapter(
                    "Redox Reactions",
                    "Oxidation number|Balancing redox reactions|Oxidising agents|Reducing agents|Disproportionation",
                    "normal"
                ),

                chapter(
                    "Electrochemistry",
                    "Electrochemical cells|EMF|Nernst equation|Conductance|Kohlrausch law|Electrolysis",
                    "important"
                ),

                chapter(
                    "Chemical Kinetics",
                    "Rate law|Order of reaction|Molecularity|Integrated rate equations|Half life|Arrhenius equation",
                    "important"
                ),

                chapter(
                    "Periodic Classification",
                    "Periodic law|Atomic radius|Ionisation enthalpy|Electron gain enthalpy|Electronegativity|Periodic trends",
                    "normal"
                ),

                chapter(
                    "p-Block Elements",
                    "Group 13|Group 14|Group 15|Group 16|Group 17|Group 18|Important compounds",
                    "important"
                ),

                chapter(
                    "d and f Block Elements",
                    "Transition elements|Electronic configuration|Oxidation states|Colour|Magnetic properties|Lanthanides|Actinides",
                    "important"
                ),

                chapter(
                    "Coordination Compounds",
                    "Ligands|Coordination number|Nomenclature|Isomerism|VBT|CFT|Magnetic properties",
                    "important"
                ),

                chapter(
                    "Organic Chemistry Basics",
                    "Nomenclature|Isomerism|Electronic effects|Reaction intermediates|Acidity and basicity|General mechanisms",
                    "important"
                ),

                chapter(
                    "Hydrocarbons",
                    "Alkanes|Alkenes|Alkynes|Aromatic hydrocarbons|Electrophilic substitution|Addition reactions",
                    "important"
                ),

                chapter(
                    "Haloalkanes and Haloarenes",
                    "C-X bond|SN1|SN2|E1|E2|Grignard reagent|Important reactions",
                    "important"
                ),

                chapter(
                    "Alcohols Phenols and Ethers",
                    "Preparation|Properties|Acidity|Reactions of alcohols|Phenols|Ethers",
                    "important"
                ),

                chapter(
                    "Aldehydes Ketones and Carboxylic Acids",
                    "Carbonyl chemistry|Nucleophilic addition|Aldol reaction|Cannizzaro reaction|Oxidation|Reduction|Carboxylic acids",
                    "important"
                ),

                chapter(
                    "Amines",
                    "Classification|Preparation|Basicity|Reactions|Diazonium salts|Aromatic amines",
                    "important"
                ),

                chapter(
                    "Biomolecules",
                    "Carbohydrates|Proteins|Amino acids|Vitamins|Nucleic acids|Enzymes",
                    "normal"
                ),

                chapter(
                    "Practical Chemistry",
                    "Qualitative analysis|Organic tests|Inorganic tests|Salt analysis|Laboratory principles",
                    "normal"
                )

            ]

        },


        mathematics: {

            icon: "∑",

            description:
                "Algebra, calculus, coordinate geometry, vectors, probability and statistics.",

            chapters: [

                chapter(
                    "Sets Relations and Functions",
                    "Sets|Relations|Functions|Domain|Range|Composite functions|Inverse functions",
                    "important"
                ),

                chapter(
                    "Complex Numbers",
                    "Argand plane|Modulus|Argument|Polar form|Algebra of complex numbers|Quadratic equations",
                    "important"
                ),

                chapter(
                    "Quadratic Equations",
                    "Roots|Nature of roots|Relations between roots|Maximum and minimum|Equations involving parameters",
                    "important"
                ),

                chapter(
                    "Sequences and Series",
                    "AP|GP|HP|Arithmetic mean|Geometric mean|Special series|Sigma notation",
                    "important"
                ),

                chapter(
                    "Permutations and Combinations",
                    "Fundamental principle|Permutations|Combinations|Circular arrangements|Distribution",
                    "important"
                ),

                chapter(
                    "Binomial Theorem",
                    "Expansion|General term|Middle term|Binomial coefficients|Properties",
                    "normal"
                ),

                chapter(
                    "Matrices and Determinants",
                    "Matrix operations|Types of matrices|Determinants|Inverse matrix|Linear equations|Properties",
                    "important"
                ),

                chapter(
                    "Mathematical Reasoning",
                    "Statements|Logical connectives|Implication|Contrapositive|Quantifiers",
                    "normal"
                ),

                chapter(
                    "Statistics",
                    "Mean|Median|Mode|Variance|Standard deviation|Data interpretation",
                    "normal"
                ),

                chapter(
                    "Probability",
                    "Events|Conditional probability|Bayes theorem|Independent events|Random variables",
                    "important"
                ),

                chapter(
                    "Trigonometry",
                    "Trigonometric ratios|Identities|Equations|Inverse trigonometry|Properties of triangles",
                    "important"
                ),

                chapter(
                    "Straight Lines",
                    "Slope|Distance|Section formula|Line equations|Angle between lines|Distance from point to line",
                    "important"
                ),

                chapter(
                    "Circle",
                    "Standard equation|General equation|Tangent|Normal|Chord|Intersection",
                    "important"
                ),

                chapter(
                    "Conic Sections",
                    "Parabola|Ellipse|Hyperbola|Tangents|Normals|Parametric coordinates",
                    "important"
                ),

                chapter(
                    "Vector Algebra",
                    "Vectors|Dot product|Cross product|Scalar triple product|Vector equations",
                    "important"
                ),

                chapter(
                    "Three Dimensional Geometry",
                    "Direction cosines|Direction ratios|Lines|Planes|Angles|Distances",
                    "important"
                ),

                chapter(
                    "Limits Continuity and Differentiability",
                    "Limits|Continuity|Differentiability|Standard limits|Derivatives|Chain rule",
                    "important"
                ),

                chapter(
                    "Application of Derivatives",
                    "Increasing and decreasing functions|Maxima|Minima|Tangents|Normals|Rate of change",
                    "important"
                ),

                chapter(
                    "Integral Calculus",
                    "Indefinite integration|Standard integrals|Substitution|By parts|Definite integrals",
                    "important"
                ),

                chapter(
                    "Area Under Curves",
                    "Area between curves|Area bounded by lines|Integration applications",
                    "normal"
                ),

                chapter(
                    "Differential Equations",
                    "Order|Degree|Variable separable equations|Linear differential equations",
                    "important"
                )

            ]

        }

    };


    /* =====================================================
       NEET DATA
    ===================================================== */

    const NEET_DATA = {

        physics: JEE_DATA.physics,

        chemistry: JEE_DATA.chemistry,

        biology: {

            icon: "🧬",

            description:
                "Complete Biology preparation covering Botany, Zoology, genetics, ecology, human physiology and more.",

            chapters: [

                chapter(
                    "The Living World",
                    "Characteristics of living organisms|Taxonomy|Systematics|Species concept|Binomial nomenclature|Taxonomic hierarchy",
                    "normal"
                ),

                chapter(
                    "Biological Classification",
                    "Kingdom Monera|Protista|Fungi|Plantae|Animalia|Viruses|Viroids|Lichens",
                    "important"
                ),

                chapter(
                    "Plant Kingdom",
                    "Algae|Bryophytes|Pteridophytes|Gymnosperms|Angiosperms|Plant life cycles",
                    "important"
                ),

                chapter(
                    "Animal Kingdom",
                    "Animal classification|Non-chordates|Chordates|Major phyla|Classes of vertebrates",
                    "important"
                ),

                chapter(
                    "Morphology of Flowering Plants",
                    "Root|Stem|Leaf|Inflorescence|Flower|Fruit|Seed|Families",
                    "important"
                ),

                chapter(
                    "Anatomy of Flowering Plants",
                    "Plant tissues|Meristematic tissue|Permanent tissue|Xylem|Phloem|Root anatomy|Stem anatomy|Leaf anatomy",
                    "important"
                ),

                chapter(
                    "Structural Organisation in Animals",
                    "Animal tissues|Epithelial tissue|Connective tissue|Muscular tissue|Nervous tissue|Earthworm|Cockroach|Frog",
                    "normal"
                ),

                chapter(
                    "Cell Structure and Function",
                    "Cell theory|Prokaryotic cells|Eukaryotic cells|Cell organelles|Plasma membrane|Cell wall",
                    "important"
                ),

                chapter(
                    "Biomolecules",
                    "Carbohydrates|Proteins|Lipids|Nucleic acids|Enzymes|Metabolism",
                    "important"
                ),

                chapter(
                    "Cell Cycle and Cell Division",
                    "Cell cycle|Mitosis|Meiosis|Chromosome behaviour|Significance of cell division",
                    "important"
                ),

                chapter(
                    "Transport in Plants",
                    "Diffusion|Osmosis|Water potential|Transpiration|Xylem transport|Phloem transport",
                    "important"
                ),

                chapter(
                    "Mineral Nutrition",
                    "Essential elements|Macronutrients|Micronutrients|Deficiency symptoms|Nitrogen metabolism",
                    "normal"
                ),

                chapter(
                    "Photosynthesis in Plants",
                    "Light reaction|Photosystems|Electron transport|Photophosphorylation|Calvin cycle|Photorespiration|C4 pathway",
                    "important"
                ),

                chapter(
                    "Respiration in Plants",
                    "Glycolysis|Fermentation|Krebs cycle|Electron transport chain|Oxidative phosphorylation|Respiratory quotient",
                    "important"
                ),

                chapter(
                    "Plant Growth and Development",
                    "Growth phases|Plant hormones|Auxin|Gibberellin|Cytokinin|ABA|Ethylene|Photoperiodism|Vernalisation",
                    "important"
                ),

                chapter(
                    "Digestion and Absorption",
                    "Digestive system|Digestive enzymes|Digestion of carbohydrates|Proteins|Fats|Absorption|Assimilation",
                    "important"
                ),

                chapter(
                    "Breathing and Exchange of Gases",
                    "Respiratory system|Mechanism of breathing|Gas exchange|Transport of gases|Respiratory volumes|Disorders",
                    "important"
                ),

                chapter(
                    "Body Fluids and Circulation",
                    "Blood|Blood groups|Coagulation|Heart|Cardiac cycle|ECG|Double circulation|Lymph",
                    "important"
                ),

                chapter(
                    "Excretory Products and Elimination",
                    "Human excretory system|Nephron|Urine formation|Osmoregulation|Renin angiotensin system|Dialysis",
                    "important"
                ),

                chapter(
                    "Locomotion and Movement",
                    "Skeletal system|Muscles|Muscle contraction|Sliding filament theory|Joints|Movement disorders",
                    "normal"
                ),

                chapter(
                    "Neural Control and Coordination",
                    "Neuron|Nerve impulse|Synapse|Central nervous system|Peripheral nervous system|Reflex action|Brain",
                    "important"
                ),

                chapter(
                    "Chemical Coordination and Integration",
                    "Endocrine glands|Hormones|Pituitary|Thyroid|Adrenal|Pancreas|Gonads|Hormonal disorders",
                    "important"
                ),

                chapter(
                    "Reproduction in Organisms",
                    "Asexual reproduction|Sexual reproduction|Life span|Reproductive phases",
                    "normal"
                ),

                chapter(
                    "Sexual Reproduction in Flowering Plants",
                    "Flower structure|Microsporogenesis|Megasporogenesis|Pollination|Fertilisation|Seed formation|Fruit development",
                    "important"
                ),

                chapter(
                    "Human Reproduction",
                    "Male reproductive system|Female reproductive system|Gametogenesis|Menstrual cycle|Fertilisation|Pregnancy|Parturition",
                    "important"
                ),

                chapter(
                    "Reproductive Health",
                    "Contraception|STIs|Infertility|Assisted reproductive technologies|Population control",
                    "important"
                ),

                chapter(
                    "Principles of Inheritance and Variation",
                    "Mendelian genetics|Monohybrid cross|Dihybrid cross|Chromosomal theory|Linkage|Crossing over|Sex determination|Mutations",
                    "important"
                ),

                chapter(
                    "Molecular Basis of Inheritance",
                    "DNA|RNA|Replication|Transcription|Translation|Genetic code|Gene regulation|Lac operon",
                    "important"
                ),

                chapter(
                    "Evolution",
                    "Origin of life|Evolution theories|Natural selection|Hardy Weinberg principle|Human evolution",
                    "important"
                ),

                chapter(
                    "Human Health and Disease",
                    "Pathogens|Common diseases|Immunity|Vaccination|AIDS|Cancer|Drug and alcohol abuse",
                    "important"
                ),

                chapter(
                    "Microbes in Human Welfare",
                    "Food production|Industrial products|Antibiotics|Sewage treatment|Biogas|Biofertilisers|Biocontrol",
                    "normal"
                ),

                chapter(
                    "Biotechnology Principles and Processes",
                    "Recombinant DNA|Restriction enzymes|Vectors|PCR|Gel electrophoresis|DNA cloning|Bioreactors",
                    "important"
                ),

                chapter(
                    "Biotechnology and its Applications",
                    "Insulin|Gene therapy|GM crops|Vaccines|DNA fingerprinting|Transgenic organisms|Biosafety",
                    "important"
                ),

                chapter(
                    "Organisms and Populations",
                    "Population attributes|Growth|Interactions|Adaptations|Population ecology",
                    "normal"
                ),

                chapter(
                    "Ecosystem",
                    "Food chains|Food webs|Energy flow|Ecological pyramids|Productivity|Decomposition|Nutrient cycles",
                    "important"
                ),

                chapter(
                    "Biodiversity and Conservation",
                    "Biodiversity|Species richness|Threats|Extinction|Conservation|Hotspots|Protected areas",
                    "important"
                ),

                chapter(
                    "Environmental Issues",
                    "Pollution|Air pollution|Water pollution|Solid waste|Greenhouse effect|Global warming|Ozone depletion|Environmental laws",
                    "important"
                )

            ]

        }

    };


    /* =====================================================
       CA FOUNDATION DATA
    ===================================================== */

    const CA_DATA = {

        accounting: {

            icon: "📒",

            description:
                "Accounting concepts, journal entries, financial statements and core accounting principles.",

            chapters: [

                chapter(
                    "Theoretical Framework",
                    "Accounting meaning|Objectives|Concepts|Conventions|Accounting standards|Capital and revenue",
                    "important"
                ),

                chapter(
                    "Accounting Process",
                    "Journal|Ledger|Trial balance|Cash book|Subsidiary books|Rectification",
                    "important"
                ),

                chapter(
                    "Bank Reconciliation Statement",
                    "Bank balance|Cash book balance|Timing differences|Adjusted cash book",
                    "important"
                ),

                chapter(
                    "Inventories",
                    "Inventory valuation|FIFO|Weighted average|Cost determination|NRV",
                    "important"
                ),

                chapter(
                    "Depreciation",
                    "Straight line method|Written down value|Change in method|Disposal of assets",
                    "important"
                ),

                chapter(
                    "Bills of Exchange",
                    "Bills|Promissory notes|Discounting|Endorsement|Dishonour|Renewal",
                    "normal"
                ),

                chapter(
                    "Final Accounts",
                    "Trading account|Profit and loss account|Balance sheet|Adjustments|Closing entries",
                    "important"
                ),

                chapter(
                    "Partnership Accounts",
                    "Admission|Retirement|Death|Goodwill|Revaluation|Capital accounts",
                    "important"
                )

            ]

        },


        business_law: {

            icon: "⚖️",

            description:
                "Core legal concepts and business laws required for CA Foundation.",

            chapters: [

                chapter(
                    "Indian Contract Act",
                    "Contract meaning|Offer|Acceptance|Consideration|Capacity|Free consent|Legality|Performance",
                    "important"
                ),

                chapter(
                    "Special Contracts",
                    "Indemnity|Guarantee|Bailment|Pledge|Agency",
                    "important"
                ),

                chapter(
                    "Sale of Goods Act",
                    "Contract of sale|Conditions|Warranties|Transfer of ownership|Unpaid seller",
                    "important"
                ),

                chapter(
                    "Partnership Act",
                    "Partnership meaning|Rights|Duties|Registration|Dissolution",
                    "important"
                ),

                chapter(
                    "Companies and LLP Framework",
                    "Company concepts|LLP|Corporate structure|Basic legal provisions",
                    "normal"
                )

            ]

        },


        quantitative_aptitude: {

            icon: "📊",

            description:
                "Mathematics, logical reasoning and statistics for CA Foundation.",

            chapters: [

                chapter(
                    "Ratio and Proportion",
                    "Ratios|Proportions|Variation|Applications",
                    "important"
                ),

                chapter(
                    "Indices and Logarithms",
                    "Laws of indices|Logarithms|Equations|Applications",
                    "normal"
                ),

                chapter(
                    "Equations",
                    "Linear equations|Quadratic equations|Simultaneous equations",
                    "important"
                ),

                chapter(
                    "Sequence and Series",
                    "AP|GP|Series|Applications",
                    "normal"
                ),

                chapter(
                    "Time Value of Money",
                    "Simple interest|Compound interest|Present value|Future value|Annuities",
                    "important"
                ),

                chapter(
                    "Permutations and Combinations",
                    "Counting principle|Permutations|Combinations|Applications",
                    "important"
                ),

                chapter(
                    "Probability",
                    "Events|Probability rules|Conditional probability|Bayes theorem",
                    "important"
                ),

                chapter(
                    "Statistics",
                    "Mean|Median|Mode|Dispersion|Correlation|Regression|Index numbers",
                    "important"
                ),

                chapter(
                    "Logical Reasoning",
                    "Statements|Series|Coding decoding|Blood relations|Direction tests|Analogy|Classification",
                    "normal"
                )

            ]

        },


        business_economics: {

            icon: "📈",

            description:
                "Economic concepts, markets, demand, supply and Indian economy.",

            chapters: [

                chapter(
                    "Introduction to Business Economics",
                    "Meaning|Scope|Microeconomics|Macroeconomics|Economic problems",
                    "normal"
                ),

                chapter(
                    "Theory of Demand and Supply",
                    "Demand|Demand curve|Elasticity|Supply|Market equilibrium",
                    "important"
                ),

                chapter(
                    "Theory of Production and Cost",
                    "Production function|Factors of production|Cost concepts|Revenue|Profit",
                    "important"
                ),

                chapter(
                    "Price Determination",
                    "Perfect competition|Monopoly|Monopolistic competition|Oligopoly",
                    "important"
                ),

                chapter(
                    "Indian Economy",
                    "Economic growth|Development|Inflation|Unemployment|Fiscal policy|Monetary policy",
                    "important"
                )

            ]

        }

    };


    /* =====================================================
       EXAM CONFIGURATION
    ===================================================== */

    const EXAM_CONFIG = {

        jee: {

            name: "JEE",

            subjects: [
                "physics",
                "chemistry",
                "mathematics"
            ],

            labels: {

                physics: "Physics",

                chemistry: "Chemistry",

                mathematics: "Mathematics"

            },

            data: JEE_DATA

        },


        neet: {

            name: "NEET",

            subjects: [
                "physics",
                "chemistry",
                "biology"
            ],

            labels: {

                physics: "Physics",

                chemistry: "Chemistry",

                biology: "Biology"

            },

            data: NEET_DATA

        },


        ca: {

            name: "CA",

            subjects: [
                "accounting",
                "business_law",
                "quantitative_aptitude",
                "business_economics"
            ],

            labels: {

                accounting: "Accounting",

                business_law: "Business Law",

                quantitative_aptitude:
                    "Quantitative Aptitude",

                business_economics:
                    "Business Economics"

            },

            data: CA_DATA

        }

    };


    /* =====================================================
       ELEMENT HELPERS
    ===================================================== */

    const $ = selector =>
        document.querySelector(selector);


    const $$ = selector =>
        document.querySelectorAll(selector);


    function showElement(element) {

        if (!element) return;

        element.classList.remove("hidden");

    }


    function hideElement(element) {

        if (!element) return;

        element.classList.add("hidden");

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function toast(message) {

        const element =
            $("#p2Toast") ||
            $("#toast");

        if (!element) {

            console.log(message);

            return;

        }

        element.textContent =
            message;

        element.classList.add("show");

        clearTimeout(
            element._p2Timer
        );

        element._p2Timer =
            setTimeout(() => {

                element.classList.remove("show");

            }, 2200);

    }


    /* =====================================================
       CURRENT EXAM DATA
    ===================================================== */

    function getExamConfig() {

        return (
            EXAM_CONFIG[P2.exam] ||
            EXAM_CONFIG.jee
        );

    }


    function getSubjectData(
        subject = P2.subject
    ) {

        const config =
            getExamConfig();

        return (
            config.data[subject] ||
            null
        );

    }


    function getChapters(
        subject = P2.subject
    ) {

        const data =
            getSubjectData(subject);

        return data
            ? data.chapters
            : [];

    }


    /* =====================================================
       VALIDATE SUBJECT AFTER EXAM SWITCH
    ===================================================== */

    function normalizeSubject() {

        const config =
            getExamConfig();

        if (
            !config.subjects.includes(
                P2.subject
            )
        ) {

            P2.subject =
                config.subjects[0];

        }

    }


    /* =====================================================
       SUBJECT GRID
    ===================================================== */

    function renderSubjectGrid() {

        const grid =
            $("#subjectGrid");

        if (!grid) return;

        const config =
            getExamConfig();

        grid.innerHTML = "";

        config.subjects.forEach(
            subject => {

                const data =
                    config.data[subject];

                if (!data) return;

                const card =
                    document.createElement("button");

                card.type = "button";

                card.className =
                    "subject-card";

                card.dataset.subject =
                    subject;

                const progress =
                    getSubjectProgress(
                        subject
                    );

                card.innerHTML = `

                    <div class="subject-icon">
                        ${data.icon}
                    </div>

                    <div class="subject-info">

                        <strong>
                            ${escapeHTML(
                                config.labels[subject]
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                data.description
                            )}
                        </small>

                        <div class="subject-progress">

                            <span
                                style="width:${progress}%"
                            ></span>

                        </div>

                    </div>

                    <div class="subject-arrow">
                        ›
                    </div>

                `;

                card.addEventListener(
                    "click",
                    () => {

                        P2.subject =
                            subject;

                        openStudyDetail(
                            "syllabus",
                            subject
                        );

                    }
                );

                grid.appendChild(card);

            }
        );

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function getProgressKey(
        subject,
        chapterName
    ) {

        return [
            P2.exam,
            subject,
            chapterName
        ].join("::");

    }


    function isChapterCompleted(
        subject,
        chapterName
    ) {

        return Boolean(
            P2.progress[
                getProgressKey(
                    subject,
                    chapterName
                )
            ]
        );

    }


    function setChapterCompleted(
        subject,
        chapterName,
        value
    ) {

        const key =
            getProgressKey(
                subject,
                chapterName
            );

        if (value) {

            P2.progress[key] =
                true;

        } else {

            delete P2.progress[key];

        }

        saveStorage();

        updateAllProgress();

    }


    function getSubjectProgress(
        subject
    ) {

        const chapters =
            getChapters(subject);

        if (!chapters.length)
            return 0;

        const completed =
            chapters.filter(
                c =>
                    isChapterCompleted(
                        subject,
                        c.name
                    )
            ).length;

        return Math.round(
            completed /
            chapters.length *
            100
        );

    }


    function getOverallProgress() {

        const config =
            getExamConfig();

        let total = 0;

        let completed = 0;

        config.subjects.forEach(
            subject => {

                const chapters =
                    getChapters(subject);

                total +=
                    chapters.length;

                completed +=
                    chapters.filter(
                        chapter =>
                            isChapterCompleted(
                                subject,
                                chapter.name
                            )
                    ).length;

            }
        );

        if (!total)
            return 0;

        return Math.round(
            completed /
            total *
            100
        );

    }


    function updateAllProgress() {

        const overall =
            getOverallProgress();

        const learnProgress =
            $("#learnProgress");

        if (learnProgress) {

            learnProgress.textContent =
                `${overall}%`;

        }


        const config =
            getExamConfig();

        const totalChapters =
            config.subjects.reduce(
                (
                    total,
                    subject
                ) =>
                    total +
                    getChapters(subject).length,
                0
            );

        const syllabusCount =
            $("#syllabusCount");

        if (syllabusCount) {

            syllabusCount.textContent =
                totalChapters;

        }


        const topicCount =
            $("#topicCount");

        if (topicCount) {

            topicCount.textContent =
                config.subjects.reduce(
                    (
                        total,
                        subject
                    ) =>
                        total +
                        getChapters(subject)
                            .reduce(
                                (
                                    count,
                                    chapter
                                ) =>
                                    count +
                                    chapter.topics.length,
                                0
                            ),
                    0
                );

        }


        const formulaCount =
            $("#formulaCount");

        if (formulaCount) {

            formulaCount.textContent =
                config.subjects.reduce(
                    (
                        total,
                        subject
                    ) =>
                        total +
                        getChapters(subject)
                            .reduce(
                                (
                                    count,
                                    chapter
                                ) =>
                                    count +
                                    chapter.formulas.length,
                                0
                            ),
                    0
                );

        }


        $$(".subject-card")
            .forEach(card => {

                const subject =
                    card.dataset.subject;

                const bar =
                    card.querySelector(
                        ".subject-progress span"
                    );

                if (
                    bar &&
                    subject
                ) {

                    bar.style.width =
                        `${getSubjectProgress(subject)}%`;

                }

            });

    }


    /* =====================================================
       STUDY DETAIL
    ===================================================== */

    function openStudyDetail(
        mode,
        subject = P2.subject
    ) {

        P2.mode =
            mode;

        P2.subject =
            subject;

        P2.selectedChapter =
            null;

        const page =
            $("#studyDetailPage");

        const learnPage =
            $("#learnPage");

        if (learnPage) {

            learnPage.classList.remove(
                "active"
            );

        }

        if (page) {

            $$(".page").forEach(
                p => p.classList.remove(
                    "active"
                )
            );

            page.classList.add(
                "active"
            );

        }

        renderStudyDetail();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       STUDY DETAIL HEADER
    ===================================================== */

    function renderStudyDetail() {

        const config =
            getExamConfig();

        const data =
            getSubjectData();

        if (!data)
            return;

        const title =
            $("#detailTitle");

        const subtitle =
            $("#detailSubtitle");

        const type =
            $("#detailType");

        const icon =
            $("#detailSubjectIcon");

        if (title) {

            title.textContent =
                config.labels[P2.subject];

        }

        if (subtitle) {

            subtitle.textContent =
                data.description;

        }

        if (type) {

            type.textContent =
                modeLabel(P2.mode);

        }

        if (icon) {

            icon.textContent =
                data.icon;

        }

        renderChapterList();

    }


    /* =====================================================
       MODE LABEL
    ===================================================== */

    function modeLabel(mode) {

        const labels = {

            syllabus: "SYLLABUS",

            theory: "THEORY",

            formulas: "FORMULAS",

            tricks: "SMART TRICKS",

            important: "HIGH PRIORITY"

        };

        return (
            labels[mode] ||
            "STUDY"
        );

    }


    /* =====================================================
       CHAPTER LIST
    ===================================================== */

    function renderChapterList() {

        const container =
            $("#studyDetailContent");

        if (!container)
            return;

        const chapters =
            getChapters();

        if (!chapters.length) {

            container.innerHTML = `

                <div class="p3-empty-state">

                    <h3>
                        Content coming soon
                    </h3>

                    <p>
                        Study material for this subject
                        will be added in the next content update.
                    </p>

                </div>

            `;

            return;

        }


        let filtered =
            chapters;


        if (
            P2.mode === "important"
        ) {

            filtered =
                chapters.filter(
                    chapter =>
                        chapter.priority ===
                        "important"
                );

        }


        container.innerHTML = "";

        filtered.forEach(
            (
                item,
                index
            ) => {

                const completed =
                    isChapterCompleted(
                        P2.subject,
                        item.name
                    );

                const card =
                    document.createElement("div");

                card.className =
                    "p2-chapter-card";

                card.innerHTML = `

                    <div class="chapter-number">
                        ${String(
                            index + 1
                        ).padStart(2, "0")}
                    </div>

                    <div class="chapter-main">

                        <div class="chapter-top">

                            <h3>
                                ${escapeHTML(
                                    item.name
                                )}
                            </h3>

                            ${
                                item.priority ===
                                "important"
                                    ? `
                                        <span class="chapter-badge">
                                            HIGH PRIORITY
                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                        <p>
                            ${escapeHTML(
                                item.topics
                                    .slice(0, 3)
                                    .join(" • ")
                            )}
                        </p>

                        <div class="chapter-meta">

                            <span>
                                ${item.topics.length}
                                Topics
                            </span>

                            ${
                                item.formulas.length
                                    ? `
                                    <span>
                                        ${item.formulas.length}
                                        Formulas
                                    </span>
                                    `
                                    : ""
                            }

                        </div>

                    </div>

                    <div class="chapter-status">

                        ${
                            completed
                                ? "✓"
                                : "›"
                        }

                    </div>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        openChapter(
                            item
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }
        );


        if (!filtered.length) {

            container.innerHTML = `

                <div class="p3-empty-state">

                    <h3>
                        No high-priority chapters
                    </h3>

                    <p>
                        More priority content will be
                        added as the study database grows.
                    </p>

                </div>

            `;

        }

    }


    /* =====================================================
       CHAPTER DETAIL
    ===================================================== */

    function openChapter(
        chapterData
    ) {

        P2.selectedChapter =
            chapterData.name;

        const container =
            $("#studyDetailContent");

        if (!container)
            return;


        const completed =
            isChapterCompleted(
                P2.subject,
                chapterData.name
            );


        const topicsHTML =
            chapterData.topics
                .map(
                    (
                        topic,
                        index
                    ) => `

                        <div class="p2-topic-row">

                            <span>
                                ${index + 1}
                            </span>

                            <strong>
                                ${escapeHTML(topic)}
                            </strong>

                        </div>

                    `
                )
                .join("");


        const formulasHTML =
            chapterData.formulas.length
                ? `

                    <div class="p2-content-block">

                        <span class="p2-content-label">
                            FORMULAS
                        </span>

                        <div class="p2-formula-list">

                            ${
                                chapterData.formulas
                                    .map(
                                        formula =>
                                            `
                                            <div>
                                                ${escapeHTML(
                                                    formula
                                                )}
                                            </div>
                                            `
                                    )
                                    .join("")
                            }

                        </div>

                    </div>

                  `
                : "";


        container.innerHTML = `

            <div class="p2-chapter-detail">

                <button
                    id="chapterBackInternal"
                    class="internal-back"
                    type="button"
                >
                    ← Back to ${escapeHTML(
                        modeLabel(P2.mode)
                    )}
                </button>


                <div class="p2-detail-hero">

                    <span>
                        ${escapeHTML(
                            modeLabel(P2.mode)
                        )}
                    </span>

                    <h2>
                        ${escapeHTML(
                            chapterData.name
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            getExamConfig()
                                .labels[P2.subject]
                        )}
                    </p>

                </div>


                <div class="p2-content-block">

                    <span class="p2-content-label">
                        TOPICS
                    </span>

                    <div class="p2-topic-list">

                        ${topicsHTML}

                    </div>

                </div>


                ${
                    P2.mode === "theory"
                        ? `
                            <div class="p2-content-block">

                                <span class="p2-content-label">
                                    THEORY
                                </span>

                                <p class="p2-theory-text">

                                    Master the concepts of
                                    <strong>
                                        ${escapeHTML(
                                            chapterData.name
                                        )}
                                    </strong>
                                    by studying each topic
                                    systematically.

                                    Start with definitions,
                                    understand the core principle,
                                    learn the standard equations,
                                    and then solve application-based
                                    problems.

                                </p>

                            </div>
                          `
                        : ""
                }


                ${
                    P2.mode === "formulas"
                        ? formulasHTML ||
                          `
                            <div class="p2-content-block">

                                <span class="p2-content-label">
                                    FORMULA SHEET
                                </span>

                                <p class="p2-theory-text">
                                    Formula collection for this
                                    chapter will be expanded
                                    in the content update.
                                </p>

                            </div>
                          `
                        : ""
                }


                ${
                    P2.mode === "tricks"
                        ? `
                            <div class="p2-content-block">

                                <span class="p2-content-label">
                                    SMART APPROACH
                                </span>

                                <div class="p2-trick-list">

                                    <div>
                                        Identify the chapter
                                        concept before calculating.
                                    </div>

                                    <div>
                                        Write the known quantities
                                        before selecting a formula.
                                    </div>

                                    <div>
                                        Check units and signs
                                        before finalising the answer.
                                    </div>

                                    <div>
                                        For numerical questions,
                                        estimate the answer first.
                                    </div>

                                </div>

                            </div>
                          `
                        : ""
                }


                <button
                    id="chapterCompleteBtn"
                    class="primary-btn"
                    type="button"
                >

                    ${
                        completed
                            ? "✓ Chapter Completed"
                            : "Mark Chapter Complete"
                    }

                </button>

            </div>

        `;


        const backButton =
            $("#chapterBackInternal");

        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    renderStudyDetail();

                }
            );

        }


        const completeButton =
            $("#chapterCompleteBtn");

        if (completeButton) {

            completeButton.addEventListener(
                "click",
                () => {

                    const newValue =
                        !isChapterCompleted(
                            P2.subject,
                            chapterData.name
                        );

                    setChapterCompleted(
                        P2.subject,
                        chapterData.name,
                        newValue
                    );

                    toast(
                        newValue
                            ? "Chapter completed ✓"
                            : "Chapter marked incomplete"
                    );

                    openChapter(
                        chapterData
                    );

                }
            );

        }

    }


    /* =====================================================
       RESOURCE BUTTONS
    ===================================================== */

    function setupResourceButtons() {

        const resources = [

            [
                "#openSyllabus",
                "syllabus"
            ],

            [
                "#openTheory",
                "theory"
            ],

            [
                "#openFormulas",
                "formulas"
            ],

            [
                "#openTricks",
                "tricks"
            ]

        ];


        resources.forEach(
            ([selector, mode]) => {

                const button =
                    $(selector);

                if (!button)
                    return;

                button.addEventListener(
                    "click",
                    () => {

                        openStudyDetail(
                            mode,
                            P2.subject
                        );

                    }
                );

            }
        );


        const important =
            $("#importantTopicsBtn");

        if (important) {

            important.addEventListener(
                "click",
                () => {

                    openStudyDetail(
                        "important",
                        P2.subject
                    );

                }
            );

        }

    }


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    function setupBackButton() {

        const button =
            $("#studyBackBtn");

        if (!button)
            return;

        button.addEventListener(
            "click",
            () => {

                const detail =
                    $("#studyDetailPage");

                const learn =
                    $("#learnPage");

                if (detail) {

                    detail.classList.remove(
                        "active"
                    );

                }

                if (learn) {

                    learn.classList.add(
                        "active"
                    );

                }

                renderSubjectGrid();

                updateAllProgress();

            }
        );

    }


    /* =====================================================
       EXAM SWITCHER
    ===================================================== */

    function setupExamSwitcher() {

        const switchButton =
            $("#examSwitchBtn");

        const modal =
            $("#examModal");

        const close =
            $("#closeModal");


        if (switchButton) {

            switchButton.addEventListener(
                "click",
                () => {

                    showElement(modal);

                }
            );

        }


        if (close) {

            close.addEventListener(
                "click",
                () => {

                    hideElement(modal);

                }
            );

        }


        $$(".switch-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const exam =
                            card.dataset.switch;

                        if (
                            !EXAM_CONFIG[exam]
                        ) return;


                        changeExam(
                            exam
                        );

                        hideElement(
                            modal
                        );

                    }
                );

            });

    }


    /* =====================================================
       CHANGE EXAM
    ===================================================== */

    function changeExam(
        exam
    ) {

        if (
            !EXAM_CONFIG[exam]
        ) return;


        P2.exam =
            exam;

        normalizeSubject();

        try {

            localStorage.setItem(
                EXAM_KEY,
                exam
            );

        } catch (_) {}


        updateExamHeader();

        renderSubjectGrid();

        updateAllProgress();

        renderStudyDetail();


        /*
         * Inform the main JS and Phase 3
         * that the exam changed.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mastery:examChanged",
                {
                    detail: {
                        exam,
                        subject:
                            P2.subject
                    }
                }
            )
        );


        toast(
            `${getExamConfig().name} preparation selected`
        );

    }


    /* =====================================================
       EXAM HEADER
    ===================================================== */

    function updateExamHeader() {

        const currentExam =
            $("#currentExam");

        if (currentExam) {

            currentExam.textContent =
                getExamConfig().name;

        }

    }


    /* =====================================================
       PHASE 3 DATA BRIDGE
    ===================================================== */

    /*
     * Phase 3 can request the same syllabus
     * without duplicating all the data.
     */

    window.MASTREY_PHASE2 = {

        getExam: () =>
            P2.exam,

        getSubject: () =>
            P2.subject,

        getExamConfig: () =>
            getExamConfig(),

        getSubjects: () =>
            getExamConfig().subjects.slice(),

        getSubjectData: subject =>
            getSubjectData(subject),

        getChapters: subject =>
            getChapters(subject),

        getProgress: subject =>
            getSubjectProgress(subject),

        setChapterCompleted: (
            subject,
            chapterName,
            value
        ) =>
            setChapterCompleted(
                subject,
                chapterName,
                value
            ),

        changeExam: exam =>
            changeExam(exam)

    };


    /* =====================================================
       EXTERNAL EXAM CHANGE SUPPORT
    ===================================================== */

    window.addEventListener(
        "mastery:setExam",
        event => {

            const exam =
                event.detail?.exam;

            if (
                exam &&
                EXAM_CONFIG[exam]
            ) {

                changeExam(
                    exam
                );

            }

        }
    );


    /* =====================================================
       DASHBOARD STATS
    ===================================================== */

    function updateDashboardStats() {

        const config =
            getExamConfig();

        let chapters = 0;

        let topics = 0;

        let formulas = 0;


        config.subjects.forEach(
            subject => {

                const list =
                    getChapters(subject);

                chapters +=
                    list.length;

                list.forEach(
                    chapter => {

                        topics +=
                            chapter.topics.length;

                        formulas +=
                            chapter.formulas.length;

                    }
                );

            }
        );


        const syllabus =
            $("#syllabusCount");

        const formula =
            $("#formulaCount");

        const topic =
            $("#topicCount");


        if (syllabus)
            syllabus.textContent =
                chapters;

        if (formula)
            formula.textContent =
                formulas;

        if (topic)
            topic.textContent =
                topics;

    }


    /* =====================================================
       SUBJECT AUTO SELECTION
    ===================================================== */

    function selectDefaultSubject() {

        normalizeSubject();

        const config =
            getExamConfig();

        if (
            !config.subjects.includes(
                P2.subject
            )
        ) {

            P2.subject =
                config.subjects[0];

        }

    }


    /* =====================================================
       EVENT: MAIN NAVIGATION
    ===================================================== */

    function setupNavigationIntegration() {

        $$(".nav-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const page =
                            button.dataset.page;

                        if (
                            page ===
                            "learnPage"
                        ) {

                            setTimeout(
                                () => {

                                    renderSubjectGrid();

                                    updateAllProgress();

                                },
                                50
                            );

                        }

                    }
                );

            });

    }


    /* =====================================================
       EVENT: PHASE 1 EXAM EVENT
    ===================================================== */

    window.addEventListener(
        "examChanged",
        event => {

            const exam =
                event.detail?.exam;

            if (
                exam &&
                EXAM_CONFIG[exam]
            ) {

                changeExam(
                    exam
                );

            }

        }
    );


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.MASTREY = {

        phase2: {

            state:
                P2,

            exams:
                EXAM_CONFIG,

            openStudy:
                openStudyDetail,

            openChapter,

            changeExam,

            getProgress:
                getOverallProgress,

            getSubjectProgress,

            getChapters

        }

    };


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function initPhase2() {

        if (P2.initialized)
            return;

        P2.initialized =
            true;


        loadStorage();

        selectDefaultSubject();

        updateExamHeader();

        renderSubjectGrid();

        updateDashboardStats();

        updateAllProgress();

        setupResourceButtons();

        setupBackButton();

        setupExamSwitcher();

        setupNavigationIntegration();


        /*
         * Keep phase 2 synchronized when
         * phase 1 changes the exam.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mastery:phase2Ready",
                {
                    detail: {
                        exam:
                            P2.exam,

                        subject:
                            P2.subject
                    }
                }
            )
        );


        console.log(
            "✓ MASTREY PRO Phase 2 initialized"
        );

        console.log(
            "✓ Current exam:",
            P2.exam
        );

        console.log(
            "✓ Current subject:",
            P2.subject
        );

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initPhase2
        );

    } else {

        initPhase2();

    }


})();