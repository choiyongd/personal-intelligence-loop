import type {ArticleText} from './types';
export const battery:ArticleText={
  title:'The 1 TWh battery era: prices fall 20% as Korea’s battery makers shift their weight to the US',
  dek:'According to the International Energy Agency (IEA), battery demand in the energy sector reached 1 TWh for the first time in 2024. Plunging prices, the spread of Chinese LFP batteries and new EU battery rules are reshaping the landscape for Korea’s battery industry.',
  glossary:[
    {term:'GWh and TWh',meaning:'Units for the amount of energy a battery can store. 1 TWh is 1,000 GWh; they are mainly used to compare battery demand and production capacity.'},
    {term:'LFP battery',meaning:'A lithium-ion battery that uses lithium iron phosphate in its cathode. With no nickel or cobalt it is relatively cheap, and Chinese companies lead it.'},
    {term:'NMC battery',meaning:'A lithium-ion battery that uses nickel, manganese and cobalt in its cathode, a product line where Korean battery makers have long been strong.'},
    {term:'Learning rate',meaning:'How much prices fall, in percent, each time cumulative production doubles.'},
    {term:'Battery passport',meaning:'A digital record required under the EU Battery Regulation that gives each battery a unique identifier and a QR code linking to information such as origin, composition and carbon footprint.'}
  ],
  pages:[
    {
      heading:'What happened: battery demand passes 1 TWh',
      easy:'Demand for batteries in electric cars and power storage hit a record in 2024. Battery prices also dropped sharply in a single year. China is at the center of this change.',
      paragraphs:[
        'According to the IEA’s Global EV Outlook 2025, energy-sector battery demand, combining electric vehicles and power storage, reached about 1 TWh for the first time in 2024[1]. Of that, EV battery demand topped 950 GWh, up 25% from the year before[1]. Electric cars accounted for more than 85% of EV battery demand, and demand for electric trucks rose more than 75%[1].',
        'Behind the growth is rising EV sales. Global EV sales passed 17 million in 2024, more than 20% of new car sales; China alone sold more than 11 million, close to half of its new car sales[2]. The IEA expects EV sales to exceed 20 million in 2025, more than a quarter of new cars worldwide[2].',
        'Prices also dropped sharply. In BloombergNEF’s (BNEF) annual survey, the average lithium-ion battery pack price in 2024 was $115 per kWh, down about 20% from the year before and the biggest drop since 2017[3]. Regional gaps were clear: China’s average pack price was about $94 per kWh, while prices in the US and Europe were 31% and 48% higher[3]. The IEA likewise found that pack prices in China fell almost 30% in 2024, while Europe and the US saw drops of only 10–15%[1].',
        'Production capacity grew faster than demand. By the IEA’s count, global battery cell capacity rose about 30% in 2024 to more than 3 TWh, about 85% of it in China[1]. If only already-committed projects go ahead, capacity could reach about 6.5 TWh by 2030, while in the IEA’s Stated Policies Scenario (STEPS) battery demand in 2030 is projected at just over 3 TWh[1].'
      ]
    },
    {
      heading:'Why: the learning curve, the rise of LFP and overcapacity',
      easy:'Batteries are a classic product that gets cheaper the more you make. Lately, cheaper LFP batteries have spread fast. With more factories built than demand needs, price competition has also grown fiercer.',
      paragraphs:[
        'Falling battery prices are not a one-off but the continuation of a long-term trend. In a 2021 paper in Energy & Environmental Science, MIT’s Ziegler and Trancik estimated that the real price of lithium-ion cells per unit of energy capacity has fallen about 97% since commercialization in 1991[4]. They found prices fell about 13% a year on average from 1992 to 2016, and about 20% each time cumulative market size doubled[4].',
        'A shift in chemistry also drove the recent plunge. According to the IEA, LFP batteries made up nearly half of the global EV battery market in 2024 and close to three-quarters of China’s domestic demand[1]. In contrast, LFP’s share stayed below 10% in the US and just above 10% in the EU[1]. The IEA estimated LFP packs are nearly 30% cheaper per kWh than NMC packs[1].',
        'Overcapacity is another force pulling prices down. Cell capacity in 2024 (more than 3 TWh) was more than three times that year’s demand (about 1 TWh)[1]. BNEF expected pack prices to fall by about another $3 per kWh in 2025, which also means the pace of decline slows sharply compared with 2024’s plunge[3].',
        'Views on this trend are divided. Cheap batteries speed up the spread of EVs and energy storage systems (ESS), but the fact that 60% of 2024 demand and about 85% of production capacity sat in China is also read as a supply-chain concentration risk[1]. Opinions also differ on whether the learning curve will keep working or whether this is a temporary price adjustment driven by raw materials and overcapacity.'
      ]
    },
    {
      heading:'What it means: losing ground in Europe, growing in the US',
      easy:'Korean battery makers have more factories abroad than companies from any other country. But they are losing share to Chinese companies in Europe while gaining presence in the US. They also need to prepare early for Europe’s new battery rules.',
      paragraphs:[
        'According to the IEA, Korean battery makers hold more than 400 GWh of overseas production capacity, a larger overseas base than companies from any other country[1]. Yet Korean companies’ share of the EU battery market fell from nearly 80% in 2022 to about 60% in 2024, which the IEA attributes mainly to competition from Chinese companies and the spread of LFP[1].',
        'In the US, by contrast, Korean companies’ weight grew. Their share of the US battery market rose from about 20% in 2022 to more than 35% in 2024, and as of 2024 Korean companies held about 40% of US battery production capacity[1]. US capacity grew about 50% that year to more than 200 GWh[1]. Changes in US industrial and trade policy are therefore bound to matter more for Korean battery makers’ results.',
        'In Europe, the challenge is regulation. The EU adopted its Battery Regulation (Regulation (EU) 2023/1542) on July 12, 2023, and it entered into force on August 17, 2023[5]. From February 18, 2027, EV batteries, light means of transport (LMT) batteries and industrial batteries above 2 kWh must carry a digital battery passport linked by QR code, and the supply-chain due-diligence obligation, delayed by two years, applies from August 18, 2027[6]. Carbon-footprint and recycled-content requirements are due to be phased in by battery type from 2028 onward[6].',
        'Much remains uncertain. Projections that 2030 capacity could exceed twice demand point to restructuring pressure, but which projects will actually be canceled or delayed is not settled[1]. Whether Korean companies can become cost-competitive in mass-market products such as LFP, and how detailed carbon-footprint rules are finalized, are seen as the variables that will decide their future share in Europe[1][6].'
      ]
    }
  ],
  deepDive:{
    heading:'Pitfalls in reading the data: what average prices and learning rates hide',
    paragraphs:[
      'Reading the market from a single global average pack price makes it easy to miss regional gaps. In 2024 there was about a 48% gap between China’s average pack price (about $94 per kWh) and Europe’s, and the size of the price drop differed widely too: about 30% in China versus 10–15% in Europe and the US[3][1]. Because the global average depends heavily on China’s share of volume, it can be far from the prices in the markets where Korean companies actually compete.',
      'Learning-rate estimates depend on what is measured. Ziegler and Trancik reported that accounting for gains in energy density raises the average annual price decline from 13% to 17% and the learning rate from 20% to 27%[4]. Note too that a learning curve shows only a correlation between cumulative production and price; it does not separate whether economies of scale, R&D or raw-material prices drove the decline[4].',
      'Remember also that the IEA’s 2030 demand outlook is not a firm forecast but a scenario (STEPS) that assumes current policies[1]. If policies and EV prices change, the demand path and the degree of overcapacity change with them.'
    ]
  },
  keyFacts:[
    {label:'Energy-sector battery demand, 2024',value:'About 1 TWh (a first)',source:1},
    {label:'Average battery pack price, 2024',value:'$115 per kWh (down about 20%)',source:3},
    {label:'Korean companies’ overseas capacity',value:'More than 400 GWh (largest of any country)',source:1},
    {label:'Real lithium-ion cell price decline since 1991',value:'About 97%',source:4}
  ],
  questions:[
    'How large was the gap between battery cell capacity and demand in 2024, and how did it affect prices?',
    'How does LFP’s share differ in China, the US and the EU?',
    'What factors did the IEA cite for Korean companies’ falling share of the EU market?',
    'If you handled exports for a battery-materials company, what data would you prepare first for the EU battery passport in 2027?'
  ],
  thoughts:[
    'Between cheap batteries spreading quickly and supply chains concentrating in one country, which should policy weigh more heavily?',
    'Should Korea’s battery industry focus on high-performance products, or compete head-on in the mass-market LFP segment too?',
    'Under what conditions could price outlooks based on the learning curve go wrong?'
  ]
};
