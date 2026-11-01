import type {ArticleText} from './types';
export const autonomous:ArticleText={
  title:'Waymo at 500,000 rides a week in 14 cities vs. about 20 Teslas in Austin: where the North American robotaxi race stands',
  dek:'As of September 2026, Waymo is running more than 500,000 paid driverless rides a week across 14 US markets. Tesla has launched robotaxis without safety staff in Austin, but at a small scale. We look at the US government’s deregulatory course, the safety data, and a comparison with China’s Baidu.',
  glossary:[
    {term:'Robotaxi',meaning:'A paid ride-hailing service in which an automated driving system, not a person, does the driving.'},
    {term:'Rider-only miles',meaning:'Distance driven autonomously with nobody in the driver’s seat and only passengers on board.'},
    {term:'Safety monitor',meaning:'A person who rides in or follows an automated vehicle and steps in during emergencies. Tesla initially seated one in the front passenger seat.'},
    {term:'SGO (Standing General Order)',meaning:'A standing order from the National Highway Traffic Safety Administration (NHTSA) requiring crashes involving automated and driver-assist vehicles to be reported.'},
    {term:'Geofence',meaning:'The geographic area in which an automated driving service is allowed to operate.'}
  ],
  pages:[
    {
      heading:'Waymo: ten times the rides in two years, 14 markets',
      easy:'Waymo, part of Google’s parent company, runs driverless taxis in several US cities and is growing fast. As of fall 2026 it carries more than 500,000 paying riders every week.',
      paragraphs:[
        'Waymo’s weekly paid rides grew tenfold in under two years, from about 50,000 in May 2024 to 500,000 at the end of March 2026[1]. As of March 2026 it operated in 10 cities: Phoenix, San Francisco and Los Angeles, plus Austin, Atlanta, Miami, Dallas, Houston, San Antonio and Orlando, added over the previous year[1].',
        'On September 1, 2026, Waymo began paid service in Denver, San Diego and Tampa, bringing its US markets to 14, and its fleet passed 4,000 vehicles[2]. The company set a goal of one million rides a week by the end of 2026[2]. According to a filing with NHTSA in December 2025, it had 3,067 vehicles running its fifth-generation system[1].',
        'Korean companies are tied into the next-generation fleet. Waymo’s sixth-generation system is set to debut on Zeekr’s Ojai minivan and on the Hyundai Ioniq 5[1]. Waymo reportedly has 577 vehicles registered in Texas, with about 300 operating in Austin[5].'
      ]
    },
    {
      heading:'Tesla: driverless in Austin, but small',
      easy:'Tesla started robotaxi rides in Austin, Texas in June 2025 and removed safety staff from some cars in 2026. But only a few dozen cars actually run, and its crash record is disputed.',
      paragraphs:[
        'Tesla launched its robotaxi service in Austin in June 2025 with a safety monitor in the front passenger seat[4]. Elon Musk said on January 22, 2026 that rides without a safety monitor were starting in Austin, and the company explained it would mix “a few unsupervised vehicles” into the fleet and raise their share over time[4]. Early driverless cars were spotted being followed by Tesla vehicles carrying safety monitors[4].',
        'The crash record is also at issue. Electrek found at least eight Tesla robotaxi crashes reported to NHTSA since June 2025; against roughly 250,000 miles driven through early November 2025, that works out to about one crash every 60,000 miles[4]. Tesla redacts the narrative sections of its crash reports[4].',
        'On June 3, 2026, Tesla more than doubled its Austin service area to include the I-35 highway and suburbs[5]. But independent tracking suggests its driverless fleet may have shrunk from about 25 cars in late April to around 20, and its 42 Texas-registered vehicles amount to only about 7% of Waymo’s Austin fleet[5]. Tesla’s Bay Area service runs under a charter-party carrier permit, and Tesla has not applied for the California DMV deployment permit needed for commercial driverless service[5].'
      ]
    },
    {
      heading:'Regulation, safety data, and China’s Baidu',
      easy:'The US government has decided to cut rules on self-driving cars and help them go commercial. Waymo has released data showing far fewer serious crashes than human drivers, and China’s Baidu is expanding quickly outside the US, including into Korea.',
      paragraphs:[
        'On April 24, 2025, the US Department of Transportation announced an automated vehicle framework built on three principles: prioritize safety in operation, remove unnecessary regulatory barriers, and enable commercial deployment[6]. Under it, NHTSA kept the SGO crash-reporting requirement but cut duplicative requirements, and expanded its automated vehicle exemption program, previously open only to imported vehicles, to US-built vehicles[6]. Transportation Secretary Sean Duffy said, “We are in a race with China to out-innovate.”[6]',
        'The National Strategy for Automated Vehicles that the department released in September 2026 covers fiscal years 2026–2030 and sets goals of safety first, regulatory certainty, promoting American innovation, and building interoperable corridors[7]. According to the document, NHTSA proposed revisions to several Federal Motor Vehicle Safety Standards (FMVSS) to fit vehicles without manual controls, and on July 31, 2026 granted Zoox exemptions from eight standards[7]. The strategy does not, however, set quantitative safety or deployment targets[7].',
        'Based on more than 220 million fully driverless miles through March 2026, Waymo said it had 94% fewer crashes with serious or worse injuries than human drivers on the same roads, and 82% fewer injury crashes and 82% fewer airbag-deployment crashes[3]. The comparison is a model estimate that uses NHTSA SGO crash reports against human-driving benchmarks for surface streets, excluding freeways[3].',
        'China’s Baidu Apollo Go logged 3.4 million fully driverless rides in the fourth quarter of 2025, up more than 200% from a year earlier, with weekly peaks above 300,000[8]. As of February 2026 it had more than 20 million cumulative rides worldwide in 26 cities, and it entered the Korean market by starting operations in the Seoul metropolitan area[8]. North American and Chinese companies competing in markets outside the US pose direct questions for Korea’s autonomous driving regulation and industrial strategy.'
      ]
    }
  ],
  deepDive:{
    heading:'Comparing “94% fewer serious crashes” with “one crash per 60,000 miles”: what to watch for',
    paragraphs:[
      'Waymo’s 94% reduction is not a controlled experiment under identical conditions; it compares Waymo’s crashes with a statistical estimate of how many crashes human drivers would have had on the roads Waymo drove[3]. Because many human crashes are never reported to police, Waymo uses a benchmark adjusted for underreporting, and results can shift with how that adjustment is made[3]. The benchmark is fitted to surface streets in Phoenix, San Francisco, Los Angeles and Austin, so it cannot simply be applied to new cities or freeways[3].',
      'Tesla’s “one per 60,000 miles” was calculated by an outside outlet by dividing publicly reported crash counts into the company’s stated cumulative mileage[4]; it does not reflect crash severity or fault. The small mileage sample, about 250,000 miles, and the redacted crash narratives[4] also limit interpretation.',
      'On the regulatory side, the 2025 SGO revision kept core safety information while cutting duplicative requirements[6], but fewer reporting fields can also mean less information that outsiders can verify. With no quantitative federal safety targets[7], it is worth remembering that data the companies publish themselves is effectively the main basis for judging safety.'
    ]
  },
  keyFacts:[
    {label:'Waymo weekly paid rides',value:'500,000+ (September 2026)',source:2},
    {label:'Waymo US markets',value:'14, with 4,000+ vehicles',source:2},
    {label:'Waymo serious-injury crashes',value:'94% fewer than humans (220M miles)',source:3},
    {label:'Baidu Apollo Go cumulative rides',value:'20M+ (February 2026)',source:8}
  ],
  questions:[
    'What allowed Waymo to grow its rides tenfold in two years?',
    'Why is Tesla’s robotaxi service still small even after removing safety monitors?',
    'What does it mean that Waymo’s safety data is a “model estimate”?',
    'If a company were preparing a robotaxi service in Korea, what should it learn first from the US and Chinese cases?'
  ],
  thoughts:[
    'How far should we rely on companies’ own data when judging self-driving safety?',
    'Which leads to safer adoption: the US approach of loosening rules first and managing afterward, or a cautious permitting approach?'
  ]
};
