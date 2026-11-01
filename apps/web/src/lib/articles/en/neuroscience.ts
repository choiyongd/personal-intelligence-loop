import type {ArticleText} from './types';
export const neuroscience:ArticleText={
  title:'Reading the brain, mapping the brain: a 139,255-neuron fly atlas and brain-computer interfaces entering the clinic',
  dek:'A wiring diagram of an entire fly brain in 2024 and a map of 1 cubic millimeter of mouse visual cortex in 2025 have pushed brain mapping into a new phase. Over the same period, Neuralink and Synchron trials and a Chinese national roadmap are taking brain-computer interfaces (BCIs) out of the lab.',
  glossary:[
    {term:'Connectome',meaning:'A complete wiring diagram showing which synapses connect the nerve cells (neurons) in a brain.'},
    {term:'Synapse',meaning:'The contact point where one neuron passes signals to another. Connectome studies count the number and location of these contacts.'},
    {term:'Brain-computer interface (BCI)',meaning:'Technology that reads the brain’s electrical signals so a person can control a device such as a computer or a robotic arm.'},
    {term:'Early feasibility study',meaning:'An early clinical trial that tries a medical device in a small number of patients for the first time to check safety and basic function.'},
    {term:'Serial-section electron microscopy',meaning:'A method that slices brain tissue very thin, images each slice with an electron microscope and stitches them together to rebuild the 3D structure.'}
  ],
  pages:[
    {
      heading:'Brain maps: one fruit fly and 1 cubic millimeter of mouse brain',
      easy:'Scientists have mapped, for the first time, how all 130,000-plus nerve cells in a fruit fly’s brain connect to one another. They then mapped 200,000 cells and 500 million connections in a grain-of-sand-sized piece of mouse brain.',
      paragraphs:[
        'On October 2, 2024, Princeton’s Sven Dorkenwald and the FlyWire Consortium published in Nature a neural wiring diagram of an entire adult fruit fly brain[1]. The map holds 139,255 proofread neurons and about 54.5 million chemical synapses, and a companion paper classified more than 8,400 cell types[1].',
        'The map was built from previously released serial-section electron microscopy images, using automated segmentation and synapse detection followed by human error correction[1]. The researchers estimated the manual proofreading took about 33 person-years; fly labs around the world shared the early work, and teams at Princeton and Cambridge plus citizen scientists filled in the rest[1].',
        'On April 9, 2025, the US National Institutes of Health (NIH) announced that the MICrONS project had mapped more than 200,000 cells, more than 524 million synapses and about 4 km of axons in 1 cubic millimeter of mouse visual cortex[2]. The data, stitched together from about 28,000 electron microscope images, reach 1.6 petabytes, and more than 150 researchers jointly published 10 papers in Nature journals[2]. The work was supported by IARPA’s MICrONS program and the NIH BRAIN Initiative[2].'
      ]
    },
    {
      heading:'Devices that read the brain: trials in the US, UK and Australia',
      easy:'Devices that let patients paralyzed from the neck down move a computer just by thinking are being tested in several countries. Implants placed by opening the skull compete with ones inserted through blood vessels.',
      paragraphs:[
        'In June 2025 Neuralink raised $650 million, bringing its total funding to about $1.2 billion; at the time, five patients with severe paralysis had received implants[6]. Trials ran at the Barrow Neurological Institute and the University of Miami in the US, Toronto Western Hospital in Canada and Cleveland Clinic Abu Dhabi in the UAE, and the US Food and Drug Administration (FDA) granted breakthrough device designations for vision and speech impairment[6].',
        'In the UK, the National Hospital for Neurology and Neurosurgery at University College London Hospitals (UCLH) implanted Neuralink’s N1 in a patient with motor neurone disease for the first time in October 2025, and the patient controlled a computer by thought hours after surgery[7]. The N1 is a fully implanted device with more than 1,000 electrodes, and the GB-PRIME early feasibility study runs at two sites, UCLH and Newcastle[7]. On January 29, 2026, UCLH said it had completed seven implant surgeries between October and December 2025[8].',
        'On November 6, 2025, Synchron announced a $200 million Series D, bringing its total funding to $345 million[5]. Synchron’s Stentrode is threaded through blood vessels by catheter to sit near the motor cortex without opening the skull, and it has been implanted in 10 paralyzed patients in US and Australian trials[5]. The company said it would use the money for a pivotal trial and preparations for commercialization[5].'
      ]
    },
    {
      heading:'China’s national roadmap and questions for readers',
      easy:'China’s government has set a plan to be among the world leaders in brain-computer interfaces by 2030. Brain data is highly sensitive, so rules need to develop alongside the technology.',
      paragraphs:[
        'In August 2025 China’s Ministry of Industry and Information Technology and six other ministries issued guidelines for BCI industry innovation, saying they aim to achieve breakthroughs in core technologies by 2027 and speed up use in medical, industrial and consumer fields[3]. By 2030 the goal is a safe, reliable industry ecosystem with two or three globally influential companies, putting China among the world leaders[3].',
        'The guidelines also call for bringing electrode, chip and device performance up to international levels and building two or three industrial clusters by 2027[4]. Beinao-1, a semi-invasive, fully implanted wireless BCI developed by the Chinese Institute for Brain Research and NeuCyber, has entered clinical validation[4]. The same report noted views that more time is needed to go from proof of concept to large-scale clinical use[4].',
        'This trend matters because it sits where medical devices, semiconductors and data regulation overlap. Implants reading signals from more than 1,000 electrodes[7] and brain-map data reaching 1.6 petabytes[2] call for low-power chips, wireless communication and large-scale data processing together. At the same time, brain signals carry a person’s intentions and health status, so as trials grow, data protection standards become as important as the technology race.'
      ]
    }
  ],
  deepDive:{
    heading:'The limits of phrases like “complete map” and “control by thought”',
    paragraphs:[
      'The FlyWire map comes from the brain of a single female fly. The researchers acknowledged differences between sexes and between individuals, said electrical synapses cannot be identified from this data, and noted that neurotransmitter types are statistical predictions rather than direct measurements[1]. Because missed synapses are the main error, they recommended using only connections with five or more synapses in analyses[1].',
      'MICrONS’s cubic millimeter is a tiny fraction of a whole mouse brain[2]. Since a wiring diagram alone cannot explain how a brain works, the project recorded neuron firing patterns in mice watching videos and overlaid them on the wiring diagram of the same tissue to link structure and function[2].',
      'Most BCI trials are at the early feasibility stage, with participants numbering from single digits to a few dozen[5][6][8]. Company announcements and hospital press releases focus on successes, so long-term safety and any decline in signal quality can only be judged once peer-reviewed clinical results appear. In the official sources this article checked, we found no updated global implant count for Neuralink after the five reported in June 2025[6].'
    ]
  },
  keyFacts:[
    {label:'Neurons in the fly brain connectome',value:'139,255 (October 2024)',source:1},
    {label:'Synapses in MICrONS’s 1 mm³ of mouse cortex',value:'More than 524 million',source:2},
    {label:'Synchron Series D',value:'$200 million (November 2025)',source:5},
    {label:'UK GB-PRIME implants',value:'7 (October–December 2025)',source:8}
  ],
  questions:[
    'How many neurons and synapses does the FlyWire fly connectome contain, and how long did manual proofreading take?',
    'How does Synchron’s Stentrode differ from Neuralink’s N1 in how it is implanted?',
    'Why did connectome research have to rely on manual proofreading and citizen scientists?',
    'Why doesn’t a finished wiring diagram immediately tell us how the brain works, and how did MICrONS try to address this?',
    'What differences in trial speed and safety might come from the US approach (led by private startups) versus China’s (led by a government roadmap)?',
    'If you worked in medical devices, chips or data, what new requirements (power, security, certification) would the spread of BCIs create in your work?'
  ],
  thoughts:[
    'If BCIs for paralyzed patients one day become consumer products that boost healthy people’s memory or focus, who should draw the line, and by what standard?',
    'Should brain-signal data be protected more strongly than fingerprints or genomic data, or are existing medical data rules enough?',
    'Is today’s pace, where early trials of a few dozen people lead to hundreds of millions in investment and national goals, an opportunity for patients or overblown expectations?'
  ]
};
