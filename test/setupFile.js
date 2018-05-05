import jsdom from 'jsdom'
import 'babel-polyfill'

const { JSDOM } = jsdom
const documentHTML = '<!doctype html><html><body><div id="react-root"></div></body></html>'
const { document } = (new JSDOM(documentHTML)).window
global.document = document
global.window = document.defaultView

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
