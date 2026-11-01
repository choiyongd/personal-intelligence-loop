import type {ArticleText} from './types';
export const fintech:ArticleText={
  title:'The US enforces its stablecoin law while Korea argues over who may issue: the issues behind digital dollars and won coins',
  dek:'In July 2025 the US set rules for dollar stablecoins with the GENIUS Act, while Korea has argued for more than a year over a bank-led issuance model. We lay out why central banks are wary and what has not been decided yet.',
  glossary:[
    {term:'Stablecoin',meaning:'A digital token designed to hold a one-to-one value with a government currency such as the dollar or the won.'},
    {term:'Reserve assets',meaning:'Cash, deposits, short-term government bonds and similar assets an issuer holds to pay people who want to redeem their stablecoins.'},
    {term:'Singleness (holding par)',meaning:'The property that money is always accepted at face value no matter who issued it. Central banks call it the first condition of sound money.'},
    {term:'Bank run',meaning:'When users, worried they won’t get their money back, demand redemption all at once.'},
    {term:'Consortium',meaning:'A business jointly set up by several companies sharing ownership. In Korea, issuance consortia in which banks hold a majority stake are under discussion.'}
  ],
  pages:[
    {
      heading:'What happened in the US and Korea',
      easy:'In summer 2025 the US passed a law setting how stablecoins are issued and managed. The core rule is that issuers must hold safe assets equal to what they issue. Korea is also preparing a won stablecoin law but has not decided who may issue.',
      paragraphs:[
        'On July 18, 2025, the US President signed S.1582, the Guiding and Establishing National Innovation for U.S. Stablecoins Act (GENIUS Act)[1]. It became Public Law 119-27[2].',
        'According to a Congressional Research Service (CRS) summary, issuers must hold at least $1 of permitted reserve assets for every $1 of stablecoins issued; permitted assets include cash, insured deposits, short-dated US Treasuries, certain repurchase agreements and government money market funds[2]. Issuers may not pay interest to holders, but because the law does not define “holder” separately and does not restrict exchanges from paying interest to customers, this remains a point of contention[2].',
        'Both subsidiaries of banks and credit unions and non-bank companies may issue, and non-bank issuers with less than $10 billion outstanding may opt for state regulation that is “substantially similar” to the federal framework[2]. Above $10 billion they must move to federal supervision[2].',
        'In Korea, on July 15, 2026, the Financial Services Commission said it would prepare within the year a Digital Asset Basic Act (the second-phase virtual asset law) governing stablecoin issuance and circulation[6]. More than 10 related bills have been submitted to the National Assembly, but agreement on core issues such as who may issue and limits on exchange ownership has been slow[6].'
      ]
    },
    {
      heading:'Why central banks are wary of stablecoins',
      easy:'Stablecoins are used like bank deposits but are often not regulated as strictly as banks. So problems can arise if many people ask for their money back at once. Central banks are cautious because of this risk.',
      paragraphs:[
        'In a special chapter of its Annual Economic Report on June 24, 2025, the Bank for International Settlements (BIS) concluded that stablecoins fail three tests of sound money[3]. When used for payments, they do not reliably hold face value (singleness), cannot supply liquidity elastically so payments settle on time (elasticity), and fall short on preventing financial crime (integrity)[3].',
        'The BIS said stablecoins could play a limited supporting role in the financial system if properly regulated, but warned that without regulation they pose risks to financial stability and monetary sovereignty[3]. As an alternative it proposed a “unified ledger” built on tokenized central bank money and deposits[3].',
        'A leading academic critique is Gary Gorton and Jeffery Zhang’s 2023 paper. In “Taming Wildcat Stablecoins,” published in the University of Chicago Law Review, they argued that stablecoins revive “private money that circulates,” like 19th-century private banknotes, and that issuers are effectively unregulated banks[4]. Such money is not always accepted at par and its issuers are exposed to runs, they argued, making it unsuitable as a medium of exchange[4].',
        'Gorton and Zhang considered three responses: requiring issuance through banks, one-to-one backing with safe assets, and introducing a public digital currency to compete with private ones[4]. The GENIUS Act’s one-to-one reserve requirement is close to the second approach[2], while the bank-led model the Bank of Korea favors is close to the first[5].'
      ]
    },
    {
      heading:'What it means for finance and fintech professionals',
      easy:'Who can create a won stablecoin in Korea is still undecided. The key question is whether banks will lead or tech companies can take part from the start. Business plans can only be made once the law is set.',
      paragraphs:[
        'As reported in January 2026, the government plan would first give issuance rights to consortia in which banks hold 50% plus one share, with tech companies allowed in gradually later[5]. The Bank of Korea insisted on bank majority ownership, while the Financial Services Commission and some lawmakers argued tech and blockchain companies should be able to issue from the start[5].',
        'A minimum capital of about 5 billion won was floated, as in most bills, and some proposed 25 billion won, the level required of internet-only banks[5]. Because Korea’s Banking Act in principle lets a bank hold only up to 15% of another company, adding stablecoin issuance to the business of bank subsidiaries was also considered[5].',
        'Limits on exchange ownership are another flashpoint. The government proposed capping the largest shareholder’s stake in an exchange at 15–20%, but the National Assembly Research Service pointed out this could infringe property rights and freedom of occupation and raise constitutional disputes[6]. Industry has pushed back, saying a bank-led structure could block ordinary companies and slow innovation[6].',
        'For fintech companies, the biggest uncertainty is timing. The Financial Services Commission aims to legislate within the year, but core issues remain unresolved after more than a year of discussion[6]. Gray areas such as exchanges paying interest remain in the US as well[2], so how Korea’s bill handles them will directly shape business model design[2][6].'
      ]
    }
  ],
  deepDive:{
    heading:'Going deeper: are “safe reserve assets” enough?',
    paragraphs:[
      'A one-to-one reserve requirement strengthens an issuer’s ability to pay, but it does not fully solve the core problem Gorton and Zhang identified: acceptance at par[4]. Even with ample reserves, the secondary-market price can fall below $1 the moment users doubt the issuer’s ability to redeem, because unlike bank deposits there is no deposit insurance or central bank lender-of-last-resort support[4].',
      'Of the BIS’s three tests, elasticity is hard to address with reserve rules[3]. Bank deposits expand as needed through lending, but a fully backed stablecoin is issued only to the extent money comes in, so it cannot supply liquidity elastically when payment demand surges; that is the BIS’s concern[3].',
      'There is an opposing view. A stablecoin with an interest ban and reserve rules could become a safe payment instrument close to a money market fund, and the GENIUS Act took this approach[2]. Still, its real effect on market stability can only be judged once implementing rules are written and experience builds up[2].'
    ]
  },
  keyFacts:[
    {label:'GENIUS Act signed',value:'July 18, 2025',source:1},
    {label:'GENIUS Act reserve requirement',value:'At least $1 of permitted reserves per $1 issued',source:2},
    {label:'Ceiling for opting into state regulation',value:'Non-bank issuers under $10 billion outstanding',source:2},
    {label:'Korean government plan for issuance consortia (reported January 2026)',value:'Banks hold 50% plus one share',source:5}
  ],
  questions:[
    'What are the BIS’s three tests of sound money, and why does it think stablecoins fail them?',
    'Under the GENIUS Act, under what condition can a non-bank issuer opt for state regulation?',
    'Explain why Gorton and Zhang compared stablecoins to 19th-century private banknotes.',
    'If you led strategy at a fintech company, what partnership model would you propose if a bank-led issuance structure is confirmed?'
  ],
  thoughts:[
    'As privately issued digital money grows, can protecting monetary sovereignty and encouraging payment innovation coexist?',
    'What would keep people using stablecoins that cannot pay interest?',
    'If a won stablecoin is created, who would use it first, and for what?'
  ],
  sourceTitles:{
    5:'Reports on the government plan for won stablecoin issuance structure and capital',
    6:'Digital asset law due this year: all eyes on who may issue and how exchanges are regulated'
  }
};
