import type {ArticleText} from './types';
export const medicine:ArticleText={
  title:'GLP-1 obesity drugs reach a first WHO guideline: the clinical evidence and the questions that remain',
  dek:'Semaglutide and tirzepatide have shown weight loss and fewer cardiovascular events in large trials, and in December 2025 the WHO issued its first guideline on GLP-1 drugs for obesity. We look at how strong the evidence is and the problem of access, including what it means in Korea.',
  glossary:[
    {term:'GLP-1',meaning:'A hormone released by the gut after meals that helps the body release insulin and reduces appetite. GLP-1 drugs mimic it.'},
    {term:'MACE (major adverse cardiovascular events)',meaning:'A trial endpoint that bundles cardiovascular death, heart attack and stroke.'},
    {term:'Hazard ratio (HR)',meaning:'How many times the treatment group’s risk of an event is compared with the control group’s; 0.80 means about 20% lower risk.'},
    {term:'Conditional recommendation',meaning:'A guideline grade meaning benefits probably outweigh harms but uncertainty in the evidence or circumstances means it should be applied case by case.'}
  ],
  pages:[
    {
      heading:'What happened: the clinical evidence and the WHO guideline',
      easy:'Injectable drugs that help people lose weight proved their effect in large clinical trials. At the end of 2025 the World Health Organization (WHO) also issued its first guideline saying they can be used to treat obesity.',
      paragraphs:[
        'On December 1, 2025, the WHO released its first international guideline on using GLP-1 drugs to treat obesity[1]. It conditionally recommends liraglutide, semaglutide and tirzepatide for long-term obesity treatment in adults, excluding pregnant women, and adds that intensive behavioral interventions such as diet and physical activity can be offered alongside them[1].',
        'The WHO said more than one billion people worldwide live with obesity and that obesity-related deaths reached 3.7 million in 2024[1]. Earlier, in September 2025, the WHO had added GLP-1 drugs to its Essential Medicines List for treating type 2 diabetes in high-risk patients[1].',
        'The core of the evidence is large clinical trials. In the SELECT trial, which followed 17,604 people with overweight or obesity and cardiovascular disease but no diabetes for an average of 40 months, major adverse cardiovascular events occurred in 6.5% of the semaglutide group versus 8.0% of the placebo group, a hazard ratio of 0.80[2][3]. The results were published in NEJM in 2023[2].',
        'In the SURMOUNT-1 trial of tirzepatide (2,539 participants), weight loss after 72 weeks was 15%, 19.5% and 20.9% depending on dose, far above the 3.1% in the placebo group[5]. The results were published in NEJM in 2022[4].'
      ]
    },
    {
      heading:'Why conditional: benefits, side effects and cost',
      easy:'The drugs clearly work, but it is not yet certain whether they are safe over many years or affordable. That is why the WHO recommended using them “after weighing the conditions.”',
      paragraphs:[
        'Weight loss confirmed in trials was 9.4% at 104 weeks for semaglutide in SELECT (0.9% for placebo)[3] and 20.9% at 72 weeks for the highest tirzepatide dose in SURMOUNT-1[5]. The two trials differ in participants and duration, so the numbers should not be compared directly.',
        'Side effects and discontinuation also matter. In SELECT, 16.6% of the semaglutide group stopped treatment because of adverse events, about twice the 8.2% in the placebo group[3]. The WHO cited the lack of long-term data, cost, health-system readiness and equity as reasons for making the recommendation conditional[1].',
        'Access is a bigger problem. The WHO projects that by 2030 GLP-1 drugs will reach fewer than 10% of the people who could benefit, and proposed measures such as pooled procurement, tiered pricing and voluntary licensing[1]. The global economic cost of obesity is projected to reach $3 trillion a year by 2030[1].',
        'The WHO also made clear that drugs alone cannot solve obesity. It called for healthier environments, early intervention for high-risk groups and lifelong, patient-centered care, and warned about falsified and substandard GLP-1 products[1]. It said it would develop a prioritization framework in 2026 so that those who need treatment most get it first[1].'
      ]
    },
    {
      heading:'What it means for readers and practitioners',
      easy:'More than one in three Korean adults counts as obese. Who should get these drugs first, and at what cost, is the big task ahead, there and elsewhere.',
      paragraphs:[
        'According to the Korea Disease Control and Prevention Agency’s national health and nutrition survey, the age-standardized obesity rate (BMI 25 or higher) among Korean adults 19 and older was 37.2% in 2023: 45.6% for men and 27.8% for women[6]. That men’s obesity rate is much higher than women’s is an important starting point for designing domestic demand and care strategies.',
        'Wegovy, the semaglutide obesity drug, launched in Korea on October 15, 2024[7]. At launch it was not covered by national health insurance, so clinics and pharmacies set prices freely; wholesale prices were reported in the high 300,000s to low 400,000s won depending on the distributor[7]. Because the drug is meant to be taken long term, the cost to patients bears directly on whether they keep up treatment.',
        'For clinicians and policymakers, the remaining task is setting priorities. SELECT’s reduction in cardiovascular events was shown in patients who already had cardiovascular disease[2][3], so use purely for weight loss cannot rest on the same evidence as treatment for high-risk patients. The falsified products the WHO warned about[1] also call for caution where online sales are common. Weight change after stopping treatment and safety over many years remain areas needing more evidence as of 2026[1].'
      ]
    }
  ],
  deepDive:{
    heading:'Cautions when carrying obesity definitions and trial evidence across borders',
    paragraphs:[
      'Korean statistics define obesity as a BMI of 25 or higher[6]. That differs from the threshold of 30 commonly used in Western trials and international statistics, so comparing Korea’s 37.2% directly with other countries’ obesity rates is misleading. Conversely, applying results from trials centered on Western populations to Korean patients requires accounting for differences in body size and risk distribution.',
      'SELECT enrolled patients without diabetes who already had cardiovascular disease[2][3]. The hazard ratio of 0.80 is therefore a secondary-prevention result and cannot be extended straight to primary prevention in the general population with obesity but no cardiovascular disease. That discontinuation due to adverse events was about twice the placebo rate[3] also suggests the effect could be diluted in real-world practice.',
      'The WHO rated the certainty of evidence for pairing drugs with behavioral interventions as “low”[1]. It is important to read the recommendation grade and the level of evidence separately; a conditional recommendation does not mean “give it to every adult with obesity” but “judge according to circumstances and resources”[1].'
    ]
  },
  keyFacts:[
    {label:'WHO GLP-1 obesity guideline released',value:'December 1, 2025',source:1},
    {label:'SELECT hazard ratio for major cardiovascular events',value:'0.80 (6.5% vs 8.0%)',source:3},
    {label:'SURMOUNT-1 weight loss, top dose, 72 weeks',value:'20.9%',source:5},
    {label:'Korean adult obesity rate (2023, BMI 25+)',value:'37.2%',source:6}
  ],
  questions:[
    'Why did the WHO make its recommendation on GLP-1 drugs “conditional”?',
    'Who took part in the SELECT trial, and what should we watch for when applying its results to the general population with obesity?',
    'How does Korea’s definition of obesity differ from the international one, and what problems arise when comparing them?',
    'With limited health insurance budgets, who should get coverage for GLP-1 drugs first?'
  ],
  thoughts:[
    'What changes would treating obesity as a chronic disease managed with lifelong medication bring for individuals and society?',
    'If drug prices fell sharply, how should the focus of obesity prevention policy shift?'
  ],
  sourceTitles:{6:'Obesity prevalence (e-Narajipyo, Korea National Health and Nutrition Examination Survey)',7:'Wegovy inquiries flood in on launch day; pharmacy stock expected on the 17th'}
};
