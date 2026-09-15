/*
Runs on every page, before any component loads.

Two jobs:

1. Pull in the site-wide stylesheets so Rollup extracts them into
   dist/styles.css. CSS imported here applies to every page regardless of
   which components are present. theme.css goes first: it pins the whole
   token palette to light, so everything imported after it resolves against
   the colours the site was actually designed in.

2. Arm the anti-FOUC failsafe. Components that animate from a hidden state
   ship that hidden state in CSS, because dist/styles.css is a blocking
   stylesheet and therefore lands before the first paint while GSAP arrives
   several frames later. The cost of that is a real failure mode: if GSAP
   never loads, or a selector has a typo, the content stays invisible
   forever. armFoucFailsafe() stamps a class on <html> after 3s that
   unhides the orphans, while elements GSAP did bind keep their state —
   GSAP writes opacity inline, and inline beats a class rule.
*/

import '../styles/theme.css'
import '../styles/button.css'
import '../styles/accordion.css'
import { armFoucFailsafe } from '../utils/motion.js'

export default function () {
  armFoucFailsafe()
}
