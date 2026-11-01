import type {ArticleText} from './types';
export const creative:ArticleText={
  title:'Copyright in AI-made work: the lines drawn by US courts, the Copyright Office and Korea’s guidance',
  dek:'When the US Supreme Court declined in March 2026 to hear a copyright case over a work created by AI alone, the human-authorship principle stood. Korea has also set out in official guidance that only the parts reflecting a person’s creative contribution are protected.',
  glossary:[
    {term:'Human authorship requirement',meaning:'The principle that copyright covers only creative expression made by people. Both the US and Korea keep it.'},
    {term:'Prompt',meaning:'The instruction you type into a generative AI to get the result you want.'},
    {term:'Copyright registration',meaning:'Recording a work’s author, date of creation and other details in a public register, which helps prove them in a dispute.'},
    {term:'Certiorari',meaning:'The process by which the US Supreme Court decides whether to review a lower court’s ruling. If it is denied, the lower ruling stands.'}
  ],
  pages:[
    {
      heading:'What happened: human authorship reaffirmed',
      easy:'US courts ruled that a picture made by AI on its own cannot get copyright, and the Supreme Court left that ruling in place. The US Copyright Office concluded that output from prompts alone is hard to protect. The Korean government also issued guidance that only the parts a person creatively contributed are protected.',
      paragraphs:[
        'The case began with computer scientist Stephen Thaler’s 2019 application to register the image “A Recent Entrance to Paradise,” listing his AI system, the Creativity Machine, as its sole author[2]. When the US Copyright Office refused registration, Thaler sued, and on March 18, 2025 the US Court of Appeals for the D.C. Circuit unanimously upheld the refusal, holding that the Copyright Act presumes a human author[2]. On March 2, 2026, the Supreme Court denied the petition for certiorari in the case (No. 25-449)[3].',
        'Separately, on January 29, 2025, the US Copyright Office released Part 2 of its report “Copyright and Artificial Intelligence,” on copyrightability[1]. After reviewing more than 10,000 comments, it concluded that generative AI output can be protected only where a human has determined sufficient expressive elements, and that providing prompts alone is not enough[1]. It added that protection can still cover human-authored work that remains perceptible in the output, or a human’s creative selection, arrangement or modification of the output[1].',
        'In Korea, the Ministry of Culture, Sports and Tourism and the Korea Copyright Commission issued two guides in June 2025, one on registering works made with generative AI and one on preventing copyright disputes over generative AI output, and published English versions that November[4]. In an April 2026 interview, Korea Copyright Commission chair Kang Seok-won explained that something made by AI alone is treated as an output, not a work, and that where a person contributes creatively, copyright is recognized for that contribution[5].'
      ]
    },
    {
      heading:'Why they decide this way: a test of how much a person contributed',
      easy:'Copyright law exists to protect people’s creative expression. So courts and governments look less at how impressive the result is and more at how much of it a person decided. Using AI as a tool is not a problem in itself.',
      paragraphs:[
        'The D.C. Circuit reasoned that other provisions of the Copyright Act presume a human author, so counting a machine as an author would make many parts of the law nonsensical[2]. At the same time, the court said how much a human must contribute to AI output to become its author is a case-by-case question it did not decide here, and left any change to the human-authorship requirement to Congress[2].',
        'The Copyright Office’s test turns on who determined the expressive elements. Providing prompts alone, it said, does not show that a human sufficiently determined the expression in the output[1]. By contrast, using AI as an assistive tool or including AI-generated material in a larger human-authored work does not bar protection, and the Office concluded no change in the law is needed for that[1].',
        'This framework is worth reading alongside experiments from creative practice. In a study Doshi and Hauser published in Science Advances in 2024, 300 writers and 600 evaluators were recruited to write and rate short stories; stories from writers who received up to five AI ideas were rated 8.1% more novel and 9.0% more useful than those written without AI[6]. The gains were largest for writers with low prior creativity scores, at 10.7% for novelty and 11.5% for usefulness, but the AI-assisted stories became more similar to one another[6].',
        'In a 2023 Science piece, Epstein and colleagues summarized how generative AI raises questions across copyright and ownership, aesthetic standards, creative labor and the media ecosystem[7]. The law settling on protecting only human contributions can be seen as part of a social agreement on what counts as people’s share when technology lowers the barrier to creating.'
      ]
    },
    {
      heading:'What it means for creators, and what remains open',
      easy:'If you make things with AI, it now matters to keep a record of what you did yourself. That record is what lets you claim your share of the rights. How much hands-on work is enough is still being worked out case by case.',
      paragraphs:[
        'In practice, the biggest change is the burden of proof. Because both the US Copyright Office and Korea’s guidance protect the selection, arrangement and modification a person contributed[1][5], creators are better off keeping records that show their contribution, such as working files, revision histories and original sketches. That is also why Korea’s guide separately covers who may register, what registration does, and example registrations[4].',
        'The market is already changing. In his April 2026 interview, the Korea Copyright Commission chair said copyright registrations had risen more than 30%, and that so-called “one-click publishing,” where AI-generated text is lightly edited and published, was on the rise[5]. He said his biggest worry was quality falling under a flood of content, and predicted that human-made work could become a premium product[5].',
        'Many questions remain. The appeals court did not set a minimum threshold for human contribution[2], and the Supreme Court’s denial is a decision not to hear the case, not a ruling on the issue[3]. This story covers protection of AI output; whether using existing works to train AI is allowed is a separate issue still being debated in many countries. And results like Doshi and Hauser’s, showing AI can improve individual work while reducing overall diversity[6], point to the need for policy debate at the level of the whole creative ecosystem.'
      ]
    }
  ],
  deepDive:{
    heading:'Deep dive: the limits of generalizing from experiments and agency views',
    paragraphs:[
      'Doshi and Hauser’s experiment used a narrow task, an eight-sentence short story, and measured the effect of offering AI ideas or not in a single writing session[6]. Ratings rest on outside evaluators’ judgments of novelty and usefulness, so whether the same effect holds for real work with many rounds of revision, such as long-form writing or visual design, needs separate testing. The rise in similarity among stories is read as a social dilemma in which individual gains clash with collective losses, but its long-term effect on market diversity has not been measured[6].',
      'The Copyright Office report is an agency interpretation, not a ruling that binds courts[1]. The standard applies in actual registration reviews, but courts set the final law in litigation. The D.C. Circuit case was also one in which the applicant himself said no human was involved at all, so as precedent it is narrow for the typical case where a human takes part[2].',
      'In Korea, the guides are administrative guidance rather than law[4], and the chair’s interview remarks are not an official statistical release[5]. Pinning down the growth in registrations and the share involving AI requires the Commission’s official statistics, and until courts build up case law directly on the scope of protection for AI-assisted works, it is prudent to treat the standard as still in flux.'
    ]
  },
  keyFacts:[
    {label:'US Copyright Office AI report, Part 2',value:'January 29, 2025',source:1},
    {label:'D.C. Circuit ruling in Thaler',value:'March 18, 2025: refusal upheld',source:2},
    {label:'US Supreme Court denies certiorari',value:'March 2, 2026',source:3},
    {label:'Novelty rating gain with AI ideas (experiment)',value:'8.1%',source:6}
  ],
  questions:[
    'What was the D.C. Circuit’s core reasoning for holding that AI cannot be an author?',
    'The US Copyright Office said prompts alone are hard to protect. Why?',
    'If you were an illustrator who drafted with AI and then revised by hand, what records should you keep to claim your rights?',
    'In Doshi and Hauser’s experiment, how did results differ at the individual and the group level?'
  ],
  thoughts:[
    'How does a rule that protects only human contribution affect creators who use AI heavily versus those who do not?',
    'If AI makes individual works better but more alike, who should protect the diversity of the creative ecosystem?',
    'Will human-made work really become a premium product, or will consumers not care about the difference?'
  ],
  sourceTitles:{4:'Korea’s culture ministry publishes English editions of two generative AI copyright guides',5:'AI-made text, images and music: copyright for the parts humans contributed (interview with the Korea Copyright Commission chair)'}
};
