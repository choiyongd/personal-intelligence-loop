import type {ArticleText} from './types';
export const cloud:ArticleText={
  title:'Big Tech’s four plan $700 billion in 2026 capex, and electricity is the bottleneck in the AI data center race',
  dek:'Alphabet, Amazon, Microsoft and Meta have signaled more than $700 billion in capital spending in 2026 alone. The International Energy Agency (IEA) expects data center electricity use to more than double by 2030. Korea has joined the race with data centers in Ulsan and the southwest and with memory chip supply.',
  glossary:[
    {term:'Hyperscaler',meaning:'A giant cloud provider such as Amazon (AWS), Microsoft (Azure) or Google, which builds and runs hundreds of thousands of servers itself.'},
    {term:'Capital expenditure (capex)',meaning:'Spending on assets used over many years, such as buildings, servers and chips. In the AI race, data centers and GPU purchases make up most of it.'},
    {term:'TWh (terawatt-hour)',meaning:'A unit of electrical energy; 1 TWh is one billion kWh. It is typically used for a country’s annual electricity use.'},
    {term:'Stargate',meaning:'A US AI infrastructure joint venture announced by OpenAI with SoftBank, Oracle and others in January 2025, targeting $500 billion and 10 GW over four years.'},
    {term:'AI gigafactory',meaning:'A very large EU-backed compute facility for training AI: a public–private data center packed with the latest AI processors.'}
  ],
  pages:[
    {
      heading:'How much is pouring in: $700 billion and 10 GW',
      easy:'Four big US tech companies say they will spend about $700 billion this year on data centers and AI chips. OpenAI is also building huge data centers across the US with partners, and Europe is catching up with public money.',
      paragraphs:[
        'At their late-April 2026 earnings, Alphabet raised its capex outlook for the year from $175–185 billion to $180–190 billion, and Meta from $115–135 billion to $125–145 billion[3]. Microsoft kept its outlook of $190 billion for 2026 and Amazon its $200 billion[3]. Combined, the four companies’ 2026 capex plans top $700 billion, about $100 billion more than expected a quarter earlier[3].',
        'On September 23, 2025, OpenAI, Oracle and SoftBank announced five new Stargate sites: Shackelford County, Texas; Doña Ana County, New Mexico; Lordstown, Ohio; Milam County, Texas; and a site in the Midwest (later confirmed as Wisconsin)[4]. That brought Stargate’s planned capacity, including its flagship in Abilene, Texas, to about 7 GW, with more than $400 billion in investment over the next three years[4]. The three companies said they were ahead of schedule to secure the full $500 billion, 10 GW commitment announced at the White House in January 2025 by the end of 2025[4].',
        'The Abilene campus is already running on Oracle Cloud Infrastructure, and Oracle began delivering Nvidia GB200 racks in June 2025[4]. A separate OpenAI–Oracle agreement is worth more than $300 billion over five years and covers up to 4.5 GW of additional capacity[4].',
        'Europe chose to make the public sector the anchor customer. On July 30, 2026, the EuroHPC Joint Undertaking issued a call to build up to seven AI gigafactories in at least seven member states, expecting to draw more than €20 billion in private investment across the EU[7]. Proposals are due November 12, 2026, selections are planned for early 2027, and the facilities must start operating within 18 months of selection[7].'
      ]
    },
    {
      heading:'Power as the bottleneck: the IEA’s view of 2030',
      easy:'Data centers use enormous amounts of electricity. The International Energy Agency expects the world’s data centers to use a bit more electricity by 2030 than all of Japan uses today.',
      paragraphs:[
        'In its special report “Energy and AI,” released April 10, 2025, the IEA projected that global data center electricity use would more than double to about 945 TWh by 2030[2]. That is slightly more than Japan’s entire annual electricity consumption today[2]. Over the same period, it expects electricity demand from AI-optimized data centers to more than quadruple[2].',
        'The starting point was 415 TWh in 2024, about 1.5% of world electricity use[1]. In 2024 the US accounted for 45% of that use, China 25% and Europe 15%, and data center consumption has grown about 12% a year since 2017, more than four times the growth of total electricity use[1]. Global data center investment in 2024 was about $500 billion, nearly double the 2022 level[1].',
        'The impact is larger in some places. The IEA expects data centers to account for almost half of US electricity demand growth through 2030, more than half of Japan’s, and up to a fifth of Malaysia’s[2]. It expects renewables and natural gas to meet most of the added demand[2].',
        'In the IEA’s base case, data center electricity use reaches about 1,200 TWh in 2035, but scenarios range widely from 700 to 1,700 TWh[1]. Renewables are estimated to cover about half of the added demand through 2035 (over 450 TWh), with natural gas and nuclear each adding about 175 TWh[1]. Emissions tied to data center electricity could rise from about 180 million tonnes today to 300 million tonnes in 2035, and to 500 million tonnes in a high-growth scenario[1].'
      ]
    },
    {
      heading:'Where Korea fits: Ulsan, the southwest, and memory',
      easy:'Korea is joining the race both by building large data centers at home and by supplying the memory chips AI servers can’t do without. The key question is how quickly it can secure electricity and transmission lines.',
      paragraphs:[
        'SK Group and Amazon Web Services (AWS) signed a 15-year partnership on June 20, 2025 to build an AI data center in Ulsan, targeting operation in 2027[5]. Separately, AWS committed $5.88 billion (about 7.85 trillion won) in long-term investment in Korea through 2027[5].',
        'On October 1, 2025, after a meeting in Seoul between President Lee Jae-myung, OpenAI CEO Sam Altman and the chairmen of Samsung Electronics and SK Hynix, Samsung and SK Hynix signed letters of intent to supply memory to Stargate[6]. The announcement put Stargate’s memory demand at 900,000 DRAM wafers a month[6]. SK Telecom signed a memorandum of understanding with OpenAI to develop an AI data center in Korea’s southwest, and Samsung C&T and Samsung Heavy Industries agreed to cooperate on projects including floating offshore data centers[6].',
        'For Korean companies, this trend works in two directions. The more hyperscaler capex climbs past $700 billion[3], the broader the demand base for suppliers of high-bandwidth memory (HBM) and DRAM; but attracting data centers to Korea runs into the same power bottleneck the IEA describes[1][2]. Cases like Malaysia, where data centers take a large share of electricity demand growth[2], are a useful reference for Korea, whose capital-region grid has little slack.'
      ]
    }
  ],
  deepDive:{
    heading:'What to watch for when reading capex numbers and power forecasts',
    paragraphs:[
      'Big Tech’s “$700 billion” adds together numbers with different fiscal years and disclosure scopes. Microsoft’s $190 billion was reported as a calendar-2026 figure, while Alphabet and Meta gave ranges[3]. The total also mixes in general cloud and logistics facilities unrelated to AI, so reading all of it as AI data center investment overstates it.',
      'The IEA outlook is not one number but a set of scenarios. The 2035 range spreading more than twofold, from 700 to 1,700 TWh, reflects very different assumptions about how fast AI spreads, how much chip efficiency improves and how quickly grids expand[1]. In the high-efficiency scenario, 2035 demand is 20% lower than in the base case[1].',
      'Stargate’s gigawatts and dollar amounts are planned capacity as stated by the companies; power connections and financing are not confirmed for every site[4]. The EU gigafactories are likewise still at the call stage as of October 2026, and actual sites and sizes will only be known after the 2027 selections[7].'
    ]
  },
  keyFacts:[
    {label:'Big Tech four, 2026 capex plans',value:'$700 billion+',source:3},
    {label:'Data center electricity use, 2030 outlook',value:'~945 TWh (415 TWh in 2024)',source:1},
    {label:'Stargate planned capacity',value:'~7 GW, $400 billion+ over 3 years',source:4},
    {label:'EU AI gigafactory call deadline',value:'November 12, 2026',source:7}
  ],
  questions:[
    'Which companies raised their capex outlook at the April 2026 earnings, and to how much?',
    'What share of world electricity did the IEA estimate data centers used in 2024?',
    'Why did the IEA give its 2035 data center power outlook as a 700–1,700 TWh range rather than a single number?',
    'How does rising Big Tech capex affect Korean memory chipmakers differently from data center operators in Korea?',
    'What are the strengths and weaknesses of the US approach (privately led Stargate) and the EU approach (gigafactories with the public sector as anchor customer)?',
    'If your organization sharply increased its use of cloud AI, what new cost, power and carbon metrics should it track?'
  ],
  thoughts:[
    'Is giving AI data centers priority on the grid a rational choice for industrial competitiveness, or a privilege that raises power bills for households and manufacturers?',
    'If $700 billion in capex is not recouped as revenue within a few years, who bears the biggest burden: Big Tech, the chip supply chain, or utilities?',
    'For a country like Korea, is attracting big AI data centers or focusing on supplying memory and power equipment the more sustainable strategy?'
  ]
};
