import type {ArticleText} from './types';
import {autonomous} from './autonomous';
import {battery} from './battery';
import {cloud} from './cloud';
import {creative} from './creative';
import {fintech} from './fintech';
import {foodtech} from './foodtech';
import {games} from './games';
import {higherEd} from './higher-ed';
import {international} from './international';
import {medicine} from './medicine';
import {megaEvents} from './mega-events';
import {neuroscience} from './neuroscience';
import {ocean} from './ocean';
import {remoteWork} from './remote-work';
import {supplyChain} from './supply-chain';
import {wellness} from './wellness';
export type {ArticleText} from './types';

// English editions of the Korean explainers, keyed by article id.
// One per field for the beta; untranslated articles stay Korean-only.
export const english:Record<string,ArticleText>={
  'autonomous-explainer':autonomous,
  'battery-explainer':battery,
  'cloud-explainer':cloud,
  'creative-explainer':creative,
  'fintech-explainer':fintech,
  'foodtech-explainer':foodtech,
  'games-explainer':games,
  'higher-ed-explainer':higherEd,
  'international-explainer':international,
  'medicine-explainer':medicine,
  'mega-events-explainer':megaEvents,
  'neuroscience-explainer':neuroscience,
  'ocean-explainer':ocean,
  'remote-work-explainer':remoteWork,
  'supply-chain-explainer':supplyChain,
  'wellness-explainer':wellness,
};
