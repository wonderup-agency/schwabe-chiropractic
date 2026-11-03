/*
Pastel 978216 #48: the footer copyright year updates itself.
The year is typed as plain text in the Footer component ("© 2026 …"), so this
rewrites the 4-digit year that follows the © in any text node of the footer.
*/
export default function footerYear() {
  try {
    const year = String(new Date().getFullYear())
    document.querySelectorAll('footer, .cc-footer').forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node
      while ((node = walker.nextNode())) {
        if (/©\s*\d{4}/.test(node.nodeValue)) {
          node.nodeValue = node.nodeValue.replace(/(©\s*)\d{4}/, `$1${year}`)
        }
      }
    })
  } catch (error) {
    console.error('[footer-year] failed', error)
  }
}
