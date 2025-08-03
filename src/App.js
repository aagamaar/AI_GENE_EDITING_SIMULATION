import React, { useState, useEffect } from 'react';
import { AlertTriangle, Target, Zap, CheckCircle, XCircle, Info, Microscope, Dna, Play, FileText, BarChart3, BookOpen, Award, Sun, Moon } from 'lucide-react';

const CRISPRSimulator = () => {
  const [selectedTrait, setSelectedTrait] = useState('');
  const [editingStage, setEditingStage] = useState('select'); // select, analyze, mechanism, edit, result, quiz
  const [successProbability, setSuccessProbability] = useState(0);
  const [offTargetRisk, setOffTargetRisk] = useState(0);
  const [mutationRate, setMutationRate] = useState(0);
  const [editingProgress, setEditingProgress] = useState(0);
  const [showBioethics, setShowBioethics] = useState(false);
  const [showAddons, setShowAddons] = useState('');
  const [mechanismStep, setMechanismStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true); // Changed to true for dark mode by default

  // NEW STATES FOR ENHANCEMENTS
  const [dnaAnimationStep, setDnaAnimationStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [animatingNucleotides, setAnimatingNucleotides] = useState([]);

  // YouTube video links for new sections
  const aboutCrVideos = [
    { title: 'CRISPR: A Revolution in Gene Editing', id: '4YKFw2KZA5o' },
    { title: 'What is CRISPR?', id: 'SXkAYabMRAk' },
    { title: 'CRISPR Gene Editing Explained', id: 'KKFoHXedP4g' },
    { title: 'The Future of CRISPR', id: 'XMnETBJpehA' },
  ];
  const riskVideos = [
    { title: 'The Risks of CRISPR Technology', id: 'qlqUaVcstu8' },
  ];

  // Risks from the uploaded PDF
  const pdfRisks = [
    { risk: 'Off-Target Effects', description: 'CRISPR might accidentally edit the wrong gene, leading to unwanted traits, poor growth, or toxic compounds.' },
    { risk: 'Ecological Impact', description: 'Edited plants may harm biodiversity, affecting insects, soil, and surrounding wildlife.' },
    { risk: 'Gene Flow', description: 'Edited traits might spread to wild plants, creating superweeds or invasive species.' },
    { risk: 'Incomplete Knowledge', description: 'One small gene change can affect many others, leading to harmful side effects.' },
    { risk: 'Ethical/Regulatory Issues', description: 'Public concerns over safety, fairness, and nature; some countries ban or restrict its use.' },
  ];

  // Microbial and plant-focused traits
  const traits = {
    'bacterial-resistance': {
      name: 'Bacterial Disease Resistance (Rice)',
      organism: 'Oryza sativa (Rice)',
      description: 'Add Xa21 gene for bacterial blight resistance',
      targetGene: 'Xa21 receptor gene',
      mechanism: 'Pattern recognition receptor insertion',
      difficulty: 'Medium',
      successRate: 87,
      offTarget: 12,
      mutationRate: 8,
      phenotype: 'Enhanced pathogen detection and immune response',
      benefits: ['Reduced crop loss', 'Less pesticide use', 'Food security'],
      risks: ['Potential allergen creation', 'Resistance evolution', 'Ecosystem disruption'],
      dnaOriginal: 'ATCGATCGAAGCTTACGTTAGCGGATCCAATGC',
      dnaEdited: 'ATCGATCG[Xa21-INSERTION]TACGTTAGCGGATCCAATGC',
      functionChange: 'Pathogen detection → Immune response activation'
    },
    'protein-production': {
      name: 'Enhanced Insulin Production (E. coli)',
      organism: 'Escherichia coli',
      description: 'Optimize insulin gene expression with stronger promoter',
      targetGene: 'Human insulin gene + T7 promoter',
      mechanism: 'Promoter replacement and codon optimization',
      difficulty: 'Easy',
      successRate: 94,
      offTarget: 6,
      mutationRate: 4,
      phenotype: '300% increased insulin protein yield',
      benefits: ['Medical insulin supply', 'Cost reduction', 'Scalable production'],
      risks: ['Protein misfolding', 'Bacterial contamination', 'Uncontrolled expression'],
      dnaOriginal: 'TTGACAATTAATCATCGGCTCGTATAATGTGTG',
      dnaEdited: 'TTGACA[T7-PROMOTER]ATCATCGGCTCGTATAATGTGTG',
      functionChange: 'Low expression → High-yield insulin production'
    },
    'drought-tolerance': {
      name: 'Drought Tolerance (Wheat)',
      organism: 'Triticum aestivum (Wheat)',
      description: 'Insert DREB1A transcription factor for water stress tolerance',
      targetGene: 'DREB1A transcription factor',
      mechanism: 'Stress response pathway enhancement',
      difficulty: 'Hard',
      successRate: 76,
      offTarget: 22,
      mutationRate: 18,
      phenotype: 'Enhanced water retention and stress signaling',
      benefits: ['Climate resilience', 'Reduced irrigation needs', 'Stable yields'],
      risks: ['Growth rate changes', 'Nutritional alterations', 'Gene flow to wild relatives'],
      dnaOriginal: 'GCTAGCTAGCAATGCCGGAATTCGAGCTCGGTAC',
      dnaEdited: 'GCTAGCTAG[DREB1A-CASSETTE]GAATTCGAGCTCGGTAC',
      functionChange: 'Normal water response → Enhanced drought survival'
    },
    'nitrogen-fixation': {
      name: 'Nitrogen Fixation (Rice)',
      organism: 'Oryza sativa + Rhizobium',
      description: 'Engineer symbiotic nitrogen fixation pathway',
      targetGene: 'nifH, nifD, nifK gene cluster',
      mechanism: 'Multi-gene pathway insertion',
      difficulty: 'Expert',
      successRate: 58,
      offTarget: 35,
      mutationRate: 28,
      phenotype: 'Bacterial symbiosis for atmospheric nitrogen conversion',
      benefits: ['Reduced fertilizer use', 'Environmental protection', 'Self-sustaining crops'],
      risks: ['Complex pathway disruption', 'Metabolic burden', 'Horizontal gene transfer'],
      dnaOriginal: 'AATTCCGGAATTCGATATCAAGCTTATCGATACCG',
      dnaEdited: 'AATTCCGG[NIF-GENE-CLUSTER]TATCAAGCTTATCGATACCG',
      functionChange: 'Fertilizer dependent → Self-sustaining nitrogen supply'
    }
  };

  // ENHANCED MECHANISM STEPS WITH MORE MOLECULAR DETAIL
  const crispMechanisms = [
    {
      step: 'crRNA Processing and maturation',
      title: 'CRISPR RNA Maturation',
      description: 'Bacterial CRISPR array is transcribed and processed by Cas6 endonuclease into individual crRNAs',
      aiRole: 'AI predicts optimal crRNA sequences and secondary structure stability',
      visual: '🧬 CRISPR Array → Cas6 → 📋 Mature crRNA',
      molecularDetail: 'Pre-crRNA (typically 60-70 nt) contains repeat sequences that are cleaved by Cas6, leaving mature crRNA with 5\' handle and 3\' targeting region',
      timeline: '~2-5 minutes in bacterial cells',
      keyMolecules: ['Cas6 endonuclease', 'CRISPR repeat sequences', 'Mature crRNA (~40 nt)']
    },
    {
      step: 'Guide RNA Design and Validation',
      title: 'Synthetic gRNA Engineering',
      description: 'AI designs chimeric guide RNA combining crRNA and tracrRNA functions for enhanced Cas9 activity',
      aiRole: 'Machine learning analyzes 20-nt targeting sequence for specificity, GC content (40-60% optimal), and seed region strength',
      visual: '🔬 AI Analysis → 📐 gRNA Design: 5\'-GCUUACGUUAGCGGAUCCAA-3\'',
      molecularDetail: 'Single guide RNA (sgRNA) contains 20-nt spacer sequence + 80-nt scaffold region with stem-loops that interact with Cas9',
      timeline: 'Computational design: seconds; Synthesis: 24-48 hours',
      keyMolecules: ['20-nt spacer sequence', 'Stem-loop scaffold', 'Cas9 binding sites']
    },
    {
      step: 'Ribonucleoprotein Assembly',
      title: 'Cas9-gRNA Complex Formation',
      description: 'Guide RNA binds to Cas9 protein, inducing conformational changes that activate the nuclease domains',
      aiRole: 'Structural modeling predicts binding affinity and complex stability (Kd ~0.1-1 nM for strong gRNAs)',
      visual: '🧪 Cas9 + gRNA → 🔧 Active RNP Complex',
      molecularDetail: 'gRNA binding causes Cas9 to shift from inactive to active conformation, exposing RuvC and HNH nuclease domains',
      timeline: '~10-30 seconds for complex formation',
      keyMolecules: ['Cas9 protein (160 kDa)', 'HNH nuclease domain', 'RuvC nuclease domain', 'PAM-interacting domain']
    },
    {
      step: 'DNA Target Search and PAM Recognition',
      title: 'Genomic Scanning and PAM Validation',
      description: 'Cas9-gRNA complex scans chromatin via 3D diffusion, testing ~10⁶ sites/second for PAM sequences (5\'-NGG-3\')',
      aiRole: 'AI maps all potential PAM sites genome-wide and scores accessibility based on chromatin state',
      visual: '🔍 Genome Scan → 🎯 PAM Found: ...GCTTACGTTAGCGGATCCAA[TGG]',
      molecularDetail: 'PAM-interacting domain contacts major groove, inducing DNA melting. Only 1 in ~8 random sites contains NGG PAM',
      timeline: '~6 hours to sample entire human genome; ~1 second for prokaryotic genomes',
      keyMolecules: ['PAM sequence (NGG)', 'Major groove contacts', 'DNA melting proteins']
    },
    {
      step: 'R-loop Formation and Proofreading',
      title: 'DNA Unwinding and Sequence Validation',
      description: 'PAM recognition triggers DNA unwinding, allowing gRNA-DNA base pairing. Mismatches in seed region (positions 1-12) prevent cutting',
      aiRole: 'Thermodynamic modeling predicts R-loop stability and mismatch tolerance (ΔG calculations)',
      visual: '🌀 DNA Unwind → 🧬 R-loop: gRNA•••DNA hybridization',
      molecularDetail: 'R-loop displaces non-target strand. Perfect complementarity in seed region required; 1-2 mismatches in positions 13-20 often tolerated',
      timeline: '~0.1-1 second for R-loop formation and proofreading',
      keyMolecules: ['R-loop structure', 'Seed region (nt 1-12)', 'Non-target DNA strand']
    },
    {
      step: 'Double-Strand Break Formation',
      title: 'Coordinated Nuclease Activity',
      description: 'HNH domain cuts target strand 3 bp upstream of PAM; RuvC domain cuts non-target strand, creating blunt-ended DSB',
      aiRole: 'Kinetic modeling predicts cutting efficiency and timing coordination between nuclease domains',
      visual: '✂️ HNH cuts target → ✂️ RuvC cuts non-target → 💥 DSB',
      molecularDetail: 'Two-step cutting: HNH cuts first (target strand), then RuvC cuts (non-target strand). Creates 5\' phosphate and 3\' hydroxyl ends',
      timeline: '~1-10 seconds for both cuts to complete',
      keyMolecules: ['HNH nuclease (target strand)', 'RuvC nuclease (non-target)', 'Mg²⁺ cofactors']
    },
    {
      step: 'DNA Damage Response',
      title: 'Cellular Repair Pathway Activation',
      description: 'DSB triggers ATM/ATR kinases, recruiting repair factors like 53BP1, BRCA1, and CtIP to the break site',
      aiRole: 'Pathway modeling predicts NHEJ vs HDR choice based on cell cycle phase and chromatin context',
      visual: '🚨 DSB Detection → 🔧 Repair Machinery Recruitment',
      molecularDetail: 'γH2AX phosphorylation spreads ~1 Mb from break. 53BP1 promotes NHEJ; BRCA1/CtIP promote HDR resection',
      timeline: '~30 seconds for initial detection; ~2-5 minutes for full repair complex assembly',
      keyMolecules: ['ATM/ATR kinases', 'γH2AX histone', '53BP1', 'BRCA1', 'CtIP nuclease']
    },
    {
      step: 'NHEJ vs HDR Pathway Resolution',
      title: 'NHEJ vs HDR Pathway Resolution',
      description: 'NHEJ ligates broken ends (often with indels); HDR uses donor template for precise integration',
      aiRole: 'Machine learning predicts repair outcomes and integration efficiency based on template design',
      visual: '🔧 NHEJ: Quick ligation OR 🎯 HDR: Template-guided repair',
      molecularDetail: 'NHEJ: DNA-PKcs + Ku70/80 + ligase IV. HDR: RAD51 + donor DNA template with 500-1000 bp homology arms',
      timeline: 'NHEJ: ~2-10 minutes; HDR: ~2-6 hours',
      keyMolecules: ['Ku70/80 proteins', 'DNA-PKcs', 'Ligase IV', 'RAD51', 'Donor template DNA']
    }
  ];

  // QUIZ QUESTIONS
  const quizQuestions = [
    {
      id: 1,
      question: "What is the optimal GC content for CRISPR guide RNAs?",
      options: ["20-30%", "40-60%", "70-80%", "90-100%"],
      correct: 1,
      explanation: "40-60% GC content provides optimal binding stability and specificity. Too low GC content reduces binding strength, while too high GC content can cause off-target effects."
    },
    {
      id: 2,
      question: "Which nuclease domain in Cas9 cuts the target DNA strand?",
      options: ["RuvC domain", "HNH domain", "PAM domain", "Bridge helix"],
      correct: 1,
      explanation: "The HNH domain cuts the target strand (complementary to gRNA), while RuvC cuts the non-target strand. Both cuts are required for double-strand break formation."
    },
    {
      id: 3,
      question: "What triggers the cellular DNA damage response after CRISPR cutting?",
      options: ["PAM recognition", "gRNA binding", "Double-strand break", "Protein folding"],
      correct: 2,
      explanation: "Double-strand breaks activate ATM/ATR kinases, which phosphorylate H2AX histones and recruit repair machinery like 53BP1 and BRCA1 to the damage site."
    },
    {
      id: 4,
      question: "Why is the seed region (positions 1-12) most critical for CRISPR specificity?",
      options: ["It binds to PAM", "It activates Cas9", "Mismatches here prevent cutting", "It contains the promoter"],
      correct: 2,
      explanation: "Even single mismatches in the seed region (positions 1-12 near the PAM) can prevent Cas9 cutting, while 1-2 mismatches in positions 13-20 are often tolerated."
    },
    {
      id: 5,
      question: "What determines whether a cell uses NHEJ or HDR for DNA repair?",
      options: ["Temperature", "Cell cycle phase", "pH level", "Oxygen concentration"],
      correct: 1,
      explanation: "HDR is most active during S/G2 phases when sister chromatids are available as templates. NHEJ occurs throughout the cell cycle but dominates in G1 phase."
    }
  ];

  // DNA ANIMATION STEPS
  const dnaAnimationSteps = [
    { phase: 'Targeting', description: 'Cas9-gRNA complex approaches DNA', color: 'blue' },
    { phase: 'PAM Recognition', description: 'Scanning for NGG sequence', color: 'purple' },
    { phase: 'DNA Unwinding', description: 'R-loop formation begins', color: 'orange' },
    { phase: 'Binding', description: 'gRNA hybridizes with target', color: 'green' },
    { phase: 'Cutting', description: 'Nuclease domains activate', color: 'red' },
    { phase: 'Repair', description: 'Cellular repair machinery', color: 'cyan' }
  ];

  // ANIMATION EFFECTS
  useEffect(() => {
    if (editingStage === 'edit') {
      const timer = setInterval(() => {
        setEditingProgress(prev => {
          if (prev >= 100) {
            setEditingStage('result');
            return 100;
          }
          return prev + 1.5;
        });

        // Update DNA animation step
        setDnaAnimationStep(prev => {
          const newStep = Math.floor((editingProgress / 100) * 6);
          return Math.min(newStep, 5);
        });

        // Add random nucleotide animations
        if (Math.random() < 0.3) {
          setAnimatingNucleotides(prev => [...prev, Math.random()]);
          setTimeout(() => {
            setAnimatingNucleotides(prev => prev.slice(1));
          }, 2000);
        }
      }, 80);
      return () => clearInterval(timer);
    }
  }, [editingStage, editingProgress]);

  const handleTraitSelect = (traitKey) => {
    setSelectedTrait(traitKey);
    const trait = traits[traitKey];
    setSuccessProbability(trait.successRate);
    setOffTargetRisk(trait.offTarget);
    setMutationRate(trait.mutationRate);
    setEditingStage('analyze');
    setEditingProgress(0);
    setMechanismStep(0);
    setDnaAnimationStep(0);
  };

  const showMechanism = () => {
    setEditingStage('mechanism');
  };

  const startEditing = () => {
    if (offTargetRisk > 20 || mutationRate > 15) {
      setShowBioethics(true);
      return;
    }
    setEditingStage('edit');
  };

  const proceedWithEdit = () => {
    setShowBioethics(false);
    setEditingStage('edit');
  };

  const resetSimulation = () => {
    setSelectedTrait('');
    setEditingStage('select');
    setEditingProgress(0);
    setShowBioethics(false);
    setMechanismStep(0);
    setDnaAnimationStep(0);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizScore(null);
  };

  // QUIZ FUNCTIONS
  const startQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    setQuizScore({ correct, total: quizQuestions.length });
  };

  const currentTrait = selectedTrait ? traits[selectedTrait] : null;

  // ANIMATED DNA COMPONENT
  const AnimatedDNA = ({ sequence, isEditing, animationStep }) => {
    const nucleotides = sequence.split('');

    return (
      <div className="font-mono text-sm flex flex-wrap gap-1">
        {nucleotides.map((nt, idx) => {
          let bgColor = darkMode ? 'bg-gray-800' : 'bg-gray-100';
          let textColor = darkMode ? 'text-gray-300' : 'text-gray-800';
          let animation = '';

          if (nt === 'A') { bgColor = darkMode ? 'bg-red-900' : 'bg-red-100'; textColor = darkMode ? 'text-red-300' : 'text-red-800'; }
          else if (nt === 'T') { bgColor = darkMode ? 'bg-blue-900' : 'bg-blue-100'; textColor = darkMode ? 'text-blue-300' : 'text-blue-800'; }
          else if (nt === 'G') { bgColor = darkMode ? 'bg-green-900' : 'bg-green-100'; textColor = darkMode ? 'text-green-300' : 'text-green-800'; }
          else if (nt === 'C') { bgColor = darkMode ? 'bg-yellow-900' : 'bg-yellow-100'; textColor = darkMode ? 'text-yellow-300' : 'text-yellow-800'; }

          if (isEditing && animationStep >= 0) {
            const stepColor = dnaAnimationSteps[Math.min(animationStep, 5)].color;
            if (stepColor === 'blue') bgColor = 'bg-blue-200';
            else if (stepColor === 'purple') bgColor = 'bg-purple-200';
            else if (stepColor === 'orange') bgColor = 'bg-orange-200';
            else if (stepColor === 'green') bgColor = 'bg-green-200';
            else if (stepColor === 'red') bgColor = 'bg-red-200';
            else if (stepColor === 'cyan') bgColor = 'bg-cyan-200';

            animation = 'animate-pulse';
          }

          return (
            <span
              key={idx}
              className={`px-1 py-0.5 rounded ${bgColor} ${textColor} ${animation} transition-all duration-300`}
            >
              {nt}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto p-4 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-gray-800'}`}>
      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Dna className="w-10 h-10 text-green-600 animate-pulse" />
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-green-400 to-blue-400' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}>
            AI-Assisted CRISPR Gene Editing Lab
          </h1>
          <Microscope className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <p className="text-xl">Precision Genome Engineering for Microbes & Plants</p>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-0 right-0 p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* Enhanced buttons with quiz */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={() => setShowAddons('poster')}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            AI Optimization Poster
          </button>
          <button
            onClick={() => setShowAddons('infographic')}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Trait to Transcription
          </button>
          <button
            onClick={() => setShowAddons('about-crispr')}
            className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            About CRISPR
          </button>
          <button
            onClick={() => setShowAddons('video')}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            CRISPR Risks Video
          </button>
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Award className="w-4 h-4" />
            Knowledge Quiz
          </button>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full transition-colors duration-500 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  CRISPR Knowledge Quiz
                </h2>
                <button
                  onClick={() => setShowQuiz(false)}
                  className={`text-2xl transition-colors duration-500 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>

              {quizScore === null ? (
                <div className="space-y-6">
                  {quizQuestions.map((q, idx) => (
                    <div key={q.id} className={`p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className="font-semibold mb-3">
                        {idx + 1}. {q.question}
                      </h3>
                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded border transition-colors ${quizAnswers[q.id] === optIdx
                              ? darkMode ? 'bg-blue-800 border-blue-600 text-white' : 'bg-blue-100 border-blue-300'
                              : darkMode ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' : 'bg-white border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {String.fromCharCode(65 + optIdx)}. {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {quizScore.correct === quizScore.total ? '🏆' :
                      quizScore.correct >= quizScore.total * 0.8 ? '🥇' :
                        quizScore.correct >= quizScore.total * 0.6 ? '🥈' : '📚'}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    Quiz Complete!
                  </h3>
                  <p className="text-xl mb-6">
                    You scored {quizScore.correct} out of {quizScore.total}
                    ({Math.round((quizScore.correct / quizScore.total) * 100)}%)
                  </p>

                  <div className="space-y-4 text-left max-w-2xl mx-auto">
                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} className={`p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h4 className="font-semibold mb-2">
                          {idx + 1}. {q.question}
                        </h4>
                        <p className={`mb-2 ${quizAnswers[q.id] === q.correct ? 'text-green-400' : 'text-red-400'}`}>
                          Your answer: {q.options[quizAnswers[q.id]]}
                          {quizAnswers[q.id] === q.correct ? ' ✓' : ' ✗'}
                        </p>
                        {quizAnswers[q.id] !== q.correct && (
                          <p className="text-green-400 mb-2">
                            Correct answer: {q.options[q.correct]}
                          </p>
                        )}
                        <p className="text-sm text-gray-400">
                          {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizScore(null);
                    }}
                    className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 mr-4"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="mt-6 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add-ons Display */}
      {showAddons && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full transition-colors duration-500 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {showAddons === 'poster' && 'How AI Optimizes Gene Editing'}
                  {showAddons === 'infographic' && 'From Trait to Transcription'}
                  {showAddons === 'about-crispr' && 'About CRISPR Gene Editing and beyond'}
                  {showAddons === 'video' && 'What Happens When CRISPR Goes Wrong?'}
                </h2>
                <button
                  onClick={() => setShowAddons('')}
                  className={`text-2xl transition-colors duration-500 ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>

              {/* Existing Poster Content */}
              {showAddons === 'poster' && (
                <div className="space-y-6 text-left">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-2">🤖 How AI Optimizes Gene Editing</h3>
                    <p className="text-blue-100">Revolutionary machine learning transforms CRISPR precision</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border-l-4 border-blue-500 transition-colors duration-500 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-blue-50 text-gray-800'}`}>
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        🎯 Target Prediction
                      </h4>
                      <ul className={`space-y-2 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                        <li>• <strong>Guide RNA Design:</strong> AI selects optimal 20-nucleotide sequences</li>
                        <li>• <strong>PAM Site Analysis:</strong> Identifies NGG sequences for Cas9 binding</li>
                        <li>• <strong>Specificity Scoring:</strong> Ranks targets by uniqueness in genome</li>
                        <li>• <strong>Accessibility Prediction:</strong> Models chromatin structure barriers</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-green-500 transition-colors duration-500 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-green-50 text-gray-800'}`}>
                      <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        ⚡ Success Optimization
                      </h4>
                      <ul className={`space-y-2 text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                        <li>• <strong>Cutting Efficiency:</strong> Predicts Cas9 activity at target site</li>
                        <li>• <strong>Repair Pathway:</strong> Models NHEJ vs HDR outcomes</li>
                        <li>• <strong>Insert Design:</strong> Optimizes donor DNA for integration</li>
                        <li>• <strong>Timing Prediction:</strong> Estimates edit completion time</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-orange-500 transition-colors duration-500 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-orange-50 text-gray-800'}`}>
                      <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                        🛡️ Risk Mitigation
                      </h4>
                      <ul className={`space-y-2 text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                        <li>• <strong>Off-Target Detection:</strong> Scans entire genome for similar sequences</li>
                        <li>• <strong>Toxicity Assessment:</strong> Predicts cellular stress responses</li>
                        <li>• <strong>Mutation Profiling:</strong> Forecasts unintended DNA changes</li>
                        <li>• <strong>Safety Scoring:</strong> Calculates overall risk probability</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 border-purple-500 transition-colors duration-500 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-purple-50 text-gray-800'}`}>
                      <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                        📈 Machine Learning Models
                      </h4>
                      <ul className={`space-y-2 text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                        <li>• <strong>Deep Neural Networks:</strong> 100,000+ experimental datasets</li>
                        <li>• <strong>Ensemble Methods:</strong> Multiple AI models for consensus</li>
                        <li>• <strong>Transfer Learning:</strong> Species-specific optimization</li>
                        <li>• <strong>Real-time Updates:</strong> Continuous learning from new data</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border border-yellow-300 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-yellow-50 to-orange-50'}`}>
                    <h4 className={`font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>🔬 AI Impact on CRISPR Success</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">15%</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Traditional Success Rate</div>
                      </div>
                      <div className="text-4xl text-gray-400">→</div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI-Optimized Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Infographic Content */}
              {showAddons === 'infographic' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-2">📊 From Trait to Transcription</h3>
                    <p className="text-purple-100">The complete journey from DNA to observable characteristics</p>
                  </div>

                  <div className={`p-6 rounded-lg border-2 transition-colors duration-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto shadow-lg">
                          DNA
                        </div>
                        <p className={`font-bold ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Genomic Sequence</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ATCG nucleotides</p>
                      </div>
                      <div className="text-5xl text-blue-400 animate-pulse">→</div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto shadow-lg">
                          mRNA
                        </div>
                        <p className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Transcription</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>RNA polymerase</p>
                      </div>
                      <div className="text-5xl text-green-400 animate-pulse">→</div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto shadow-lg">
                          Protein
                        </div>
                        <p className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Translation</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ribosome assembly</p>
                      </div>
                      <div className="text-5xl text-orange-400 animate-pulse">→</div>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto shadow-lg">
                          Trait
                        </div>
                        <p className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>Phenotype</p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Observable feature</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* New About CRISPR Videos Section */}
              {showAddons === 'about-crispr' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-6 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-2">📚 About CRISPR Gene Editing and Beyond</h3>
                    <p className="text-orange-100">Educational videos to deepen your understanding</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutCrVideos.map((video, index) => (
                      <div key={index} className={`p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{video.title}</h4>
                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Updated CRISPR Risks Videos & PDF section */}
              {showAddons === 'video' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-2">⚠️ What Happens When CRISPR Goes Wrong?</h3>
                    <p className="text-red-100">Understanding failures and potential risks</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Video Section */}
                    {riskVideos.map((video, index) => (
                      <div key={`video-${index}`} className={`p-4 rounded-lg transition-colors duration-500 ${darkMode ? 'bg-red-800' : 'bg-red-50'}`}>
                        <h4 className="font-semibold text-red-800 mb-2">{video.title}</h4>
                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ))}
                    {/* PDF Content Section */}
                    <div className={`p-4 rounded-lg border-l-4 border-red-500 transition-colors duration-500 ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                      <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risks of CRISPR in Plants
                      </h4>
                      <ul className={`space-y-3 text-sm ${darkMode ? 'text-red-100' : 'text-red-700'}`}>
                        {pdfRisks.map((risk, index) => (
                          <li key={`pdf-risk-${index}`}>
                            <strong>{risk.risk}:</strong> {risk.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bioethics Warning Modal */}
      {showBioethics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-lg max-w-lg mx-4 transition-colors duration-500 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Bioethics Warning</h3>
            </div>
            <div className="mb-6 space-y-3">
              <p className="font-semibold">Should we edit this gene?</p>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-800'}`}>
                <p><strong>High Risk Detected:</strong></p>
                <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>• Off-target effects: {offTargetRisk}%</p>
                <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>• Mutation rate: {mutationRate}%</p>
              </div>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                <p><strong>Ethical Considerations:</strong></p>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>• Environmental impact on ecosystems</p>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>• Long-term consequences unknown</p>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>• Regulatory approval required</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={proceedWithEdit}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Proceed (Research Only)
              </button>
              <button
                onClick={() => setShowBioethics(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Redesign Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel - Trait Selection & Analysis */}
        <div className="space-y-6">
          {editingStage === 'select' && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Select Target Organism & Trait
              </h2>
              <div className="space-y-3">
                {Object.entries(traits).map(([key, trait]) => (
                  <button
                    key={key}
                    onClick={() => handleTraitSelect(key)}
                    className={`w-full p-4 text-left border rounded-lg transition-colors duration-500 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'}`}
                  >
                    <div className={`font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>{trait.name}</div>
                    <div className={`text-sm mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{trait.organism}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{trait.description}</div>
                    <div className={`text-xs mt-2 flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>Difficulty: {trait.difficulty}</span>
                      <span>Success: {trait.successRate}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {editingStage === 'analyze' && currentTrait && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                AI Analysis: {currentTrait.organism}
              </h2>

              <div className="space-y-4">
                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800'}`}>
                  <h3 className="font-semibold">Target: {currentTrait.targetGene}</h3>
                  <p className="text-sm">{currentTrait.mechanism}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-3 rounded text-center transition-colors duration-500 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                    <div className="font-semibold text-sm">Success</div>
                    <div className="text-xl font-bold text-blue-600">{successProbability}%</div>
                  </div>
                  <div className={`p-3 rounded text-center transition-colors duration-500 ${darkMode ? 'bg-orange-900 text-orange-100' : 'bg-orange-50 text-orange-800'}`}>
                    <div className="font-semibold text-sm">Off-Target</div>
                    <div className="text-xl font-bold text-orange-600">{offTargetRisk}%</div>
                  </div>
                  <div className={`p-3 rounded text-center transition-colors duration-500 ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-800'}`}>
                    <div className="font-semibold text-sm">Mutations</div>
                    <div className="text-xl font-bold text-red-600">{mutationRate}%</div>
                  </div>
                </div>

                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-50 text-purple-800'}`}>
                  <h4 className="font-semibold mb-2">Predicted Phenotype</h4>
                  <p className="text-sm">{currentTrait.phenotype}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={showMechanism}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Learn CRISPR-Cas
                  </button>
                  <button
                    onClick={startEditing}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Execute Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingStage === 'mechanism' && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Microscope className="w-5 h-5" />
                CRISPR-Cas9 Mechanism (Enhanced)
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between mb-4">
                  {crispMechanisms.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMechanismStep(idx)}
                      className={`w-8 h-8 rounded-full ${mechanismStep === idx ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                  <h3 className="font-semibold mb-2">
                    Step {mechanismStep + 1}: {crispMechanisms[mechanismStep].title}
                  </h3>
                  <p className="text-sm mb-2">{crispMechanisms[mechanismStep].description}</p>
                  <div className={`p-2 rounded font-mono text-sm mb-2 transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    {crispMechanisms[mechanismStep].visual}
                  </div>

                  {/* NEW: Enhanced molecular details */}
                  <div className={`p-3 rounded mb-2 transition-colors duration-500 ${darkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
                    <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-purple-100' : 'text-purple-800'}`}>Molecular Detail:</h4>
                    <p className={`text-xs ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>{crispMechanisms[mechanismStep].molecularDetail}</p>
                  </div>

                  <div className={`p-3 rounded mb-2 transition-colors duration-500 ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                    <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-green-100' : 'text-green-800'}`}>Timeline:</h4>
                    <p className={`text-xs ${darkMode ? 'text-green-200' : 'text-green-700'}`}>{crispMechanisms[mechanismStep].timeline}</p>
                  </div>

                  <div className={`p-3 rounded mb-2 transition-colors duration-500 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'}`}>
                    <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>Key Molecules:</h4>
                    <p className={`text-xs ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>{crispMechanisms[mechanismStep].keyMolecules.join(', ')}</p>
                  </div>

                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>AI Role:</strong> {crispMechanisms[mechanismStep].aiRole}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setMechanismStep(Math.max(0, mechanismStep - 1))}
                    disabled={mechanismStep === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setMechanismStep(Math.min(7, mechanismStep + 1))}
                    disabled={mechanismStep === 7}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={startEditing}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Start Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {editingStage === 'edit' && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                CRISPR Editing in Progress...
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${editingProgress}%` }}
                  ></div>
                </div>
                <p className={`text-center transition-colors duration-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{Math.round(editingProgress)}% Complete</p>

                {/* NEW: Animation phase indicator */}
                <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-50 to-blue-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>Current Phase:</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${dnaAnimationStep >= 0 ? 'bg-' + dnaAnimationSteps[Math.min(dnaAnimationStep, 5)].color + '-500' : 'bg-gray-300'
                      }`}></div>
                    <span className="text-sm font-medium">
                      {dnaAnimationStep < 6 ? dnaAnimationSteps[dnaAnimationStep].phase : 'Complete'}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {dnaAnimationStep < 6 ? dnaAnimationSteps[dnaAnimationStep].description : 'Editing completed successfully'}
                  </p>
                </div>

                <div className={`text-sm space-y-1 transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className={dnaAnimationStep >= 0 ? 'text-blue-400 font-medium' : ''}>• Guide RNA targeting sequence...</p>
                  <p className={dnaAnimationStep >= 1 ? 'text-purple-400 font-medium' : ''}>• PAM recognition and validation...</p>
                  <p className={dnaAnimationStep >= 2 ? 'text-orange-400 font-medium' : ''}>• DNA unwinding and R-loop formation...</p>
                  <p className={dnaAnimationStep >= 3 ? 'text-green-400 font-medium' : ''}>• gRNA-DNA hybridization...</p>
                  <p className={dnaAnimationStep >= 4 ? 'text-red-400 font-medium' : ''}>• Cas9 cutting DNA at target site...</p>
                  <p className={dnaAnimationStep >= 5 ? 'text-cyan-400 font-medium' : ''}>• Cellular repair machinery activation...</p>
                </div>
              </div>
            </div>
          )}

          {editingStage === 'result' && currentTrait && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {successProbability > 80 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Editing Results
              </h2>

              {successProbability > 80 ? (
                <div className={`p-4 rounded mb-4 transition-colors duration-500 ${darkMode ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800'}`}>
                  <h3 className="font-semibold mb-2">✅ Successful Edit!</h3>
                  <p className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>The {currentTrait.name.toLowerCase()} has been successfully implemented with minimal off-target effects.</p>
                </div>
              ) : (
                <div className={`p-4 rounded mb-4 transition-colors duration-500 ${darkMode ? 'bg-orange-900 text-orange-100' : 'bg-orange-50 text-orange-800'}`}>
                  <h3 className="font-semibold mb-2">⚠️ Partial Success</h3>
                  <p className={`${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>Edit completed but with some off-target effects detected. Further optimization recommended.</p>
                </div>
              )}

              <div className="space-y-3">
                <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>Phenotype Change</h4>
                  <p className={`${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>{currentTrait.phenotype}</p>
                </div>

                <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Next Steps</h4>
                  <ul className={`text-sm mt-1 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>• Conduct extensive safety testing</li>
                    <li>• Monitor for unintended effects</li>
                    <li>• Ethical review and regulatory approval</li>
                    <li>• Controlled field trials</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startQuiz}
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Test Knowledge
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Try Another Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Panel - Enhanced DNA Visualization */}
        <div className="space-y-6">
          <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">Enhanced Genome Editing Visualization</h2>

            {currentTrait && (
              <>
                <div className="mb-4">
                  <h3 className={`font-semibold mb-2 transition-colors duration-500 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Original Gene Sequence</h3>
                  <div className={`p-3 rounded border transition-colors duration-500 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                    <AnimatedDNA
                      sequence={currentTrait.dnaOriginal}
                      isEditing={false}
                      animationStep={-1}
                    />
                  </div>
                </div>

                {editingStage !== 'select' && (
                  <div className="mb-4">
                    <h3 className={`font-semibold mb-2 transition-colors duration-500 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {editingStage === 'result' ? 'Edited Gene Sequence' : 'Target Edit Sequence'}
                    </h3>
                    <div className={`p-3 rounded border border-green-300 transition-colors duration-500 ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                      <AnimatedDNA
                        sequence={currentTrait.dnaEdited}
                        isEditing={editingStage === 'edit'}
                        animationStep={dnaAnimationStep}
                      />
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-blue-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-purple-100' : 'text-purple-800'}`}>Function Change</h4>
                  <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>{currentTrait.functionChange}</p>
                </div>

                {editingStage === 'edit' && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Editing Progress</span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(editingProgress)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${editingProgress}%` }}
                      ></div>
                    </div>

                    {/* NEW: Real-time animation indicators */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {dnaAnimationSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded text-xs transition-colors duration-500 ${dnaAnimationStep >= idx
                            ? darkMode ? `bg-${step.color}-800 text-${step.color}-100 border border-${step.color}-400` : `bg-${step.color}-100 text-${step.color}-800 border border-${step.color}-300`
                            : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                          <div className="font-semibold">{step.phase}</div>
                          <div>{step.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* AI Prediction Panel */}
          {currentTrait && editingStage !== 'select' && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                AI Predictions
              </h2>

              <div className="space-y-3">
                <div className={`flex justify-between items-center p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                  <span className={`font-medium ${darkMode ? 'text-green-100' : 'text-green-800'}`}>Edit Success Rate</span>
                  <span className="text-2xl font-bold text-green-600">{successProbability}%</span>
                </div>

                <div className={`flex justify-between items-center p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                  <span className={`font-medium ${darkMode ? 'text-orange-100' : 'text-orange-800'}`}>Off-Target Risk</span>
                  <span className="text-2xl font-bold text-orange-600">{offTargetRisk}%</span>
                </div>

                <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                  <h4 className={`font-semibold mb-1 ${darkMode ? 'text-blue-100' : 'text-blue-800'}`}>AI Analysis</h4>
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Based on sequence similarity, chromatin accessibility, and 50,000+ experimental outcomes,
                    this edit has {successProbability > 80 ? 'high' : successProbability > 60 ? 'medium' : 'low'} confidence for success.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Educational Content */}
        <div className="space-y-6">
          {/* Benefits & Risks */}
          {currentTrait && editingStage !== 'select' && (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Impact Assessment</h2>

              <div className="space-y-4">
                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-green-100' : 'text-green-800'}`}>Potential Benefits</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    {currentTrait.benefits.map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded transition-colors duration-500 ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-100' : 'text-red-800'}`}>Potential Risks</h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                    {currentTrait.risks.map((risk, idx) => (
                      <li key={idx}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CRISPR Education */}
          <div className={`p-6 rounded-lg shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">CRISPR-Cas9 System</h2>
            <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <strong>Guide RNA (gRNA)</strong> designed to match target DNA sequence
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <strong>Cas9 nuclease</strong> cuts both DNA strands at precise location
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <strong>Cellular repair</strong> fixes break, optionally inserting new DNA
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">AI</div>
                <div>
                  <strong>Machine learning</strong> optimizes targeting and predicts outcomes
                </div>
              </div>
            </div>
          </div>

          {/* Bioethics Panel */}
          <div className={`p-6 rounded-lg shadow-lg border-l-4 border-orange-400 transition-colors duration-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 transition-colors duration-500 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>Bioethics Questions</h2>
            <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <p><strong>Safety:</strong> How do we ensure no harmful side effects?</p>
              </div>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <p><strong>Environment:</strong> What are the ecological impacts?</p>
              </div>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <p><strong>Equity:</strong> Who has access to genetic improvements?</p>
              </div>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <p><strong>Consent:</strong> Who decides what traits to modify?</p>
              </div>
              <div className={`p-3 rounded transition-colors duration-500 ${darkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
                <p><strong>Future:</strong> How might this affect ecosystems long-term?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRISPRSimulator;
