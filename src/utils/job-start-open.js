/*
Pastel 978216 #85: "Start Open" switch for CMS job cards.

A Rich Text or Switch field can't add the `open` attribute to a <details>,
so each card carries a small marker element whose visibility is bound to the
Start Open switch. Webflow keeps conditionally hidden elements in the DOM
with `w-condition-invisible`, so we only open cards whose marker is visible.
*/

const LABEL = 'job-start-open'

export default function jobStartOpen(root = document) {
  try {
    root.querySelectorAll('details.job-card [data-job-start-open]').forEach((marker) => {
      if (marker.classList.contains('w-condition-invisible')) return
      const card = marker.closest('details.job-card')
      if (card) card.open = true
    })
  } catch (error) {
    console.error(`[${LABEL}] failed, cards keep their default state`, error)
  }
}
