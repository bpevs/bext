/**
 * BigDaddy script: https://github.com/ivebencrazy/BigDaddy
 * Replaces all instances of the word "data" with "daddy".
 */

/// <reference lib="dom" />

globalThis.alert('Running Sample Browser Extension')

Array.prototype.forEach.call(
  document.getElementsByTagName('*'),
  replaceNode,
)

function replaceNode(element: Element) {
  const stack: Node[] = [element]
  const textNodes: Node[] = []
  let el = stack.pop()
  while (el) {
    Array.prototype.forEach.call(el.childNodes, (n: Node) => {
      const { nodeName, nodeType } = n

      if (n.nodeName === 'input' || nodeName === 'textarea') return
      else if (nodeType === 1) stack.push(n) // is element node
      else if (nodeType === 3) textNodes.push(n) // is text node
    })
    el = stack.pop()
  }

  textNodes.forEach((textNode: Node) => {
    if (textNode?.parentNode && textNode?.nodeValue) {
      textNode.parentNode.replaceChild(
        document.createTextNode(
          textNode.nodeValue
            .replace(/data/g, 'daddy')
            .replace(/Data/g, 'Daddy'),
        ),
        textNode,
      )
    }
  })
}
