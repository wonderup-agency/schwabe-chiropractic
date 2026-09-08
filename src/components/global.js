/*
Runs on every page, before any component loads.

Right now its only job is to pull in the site-wide stylesheets so Rollup
extracts them into dist/styles.css. CSS imported here applies to every page
regardless of which components are present.
*/

import '../styles/button.css'

export default function () {}
