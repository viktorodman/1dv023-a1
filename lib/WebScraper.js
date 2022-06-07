'use strict'

const EvenEmitter = require('events')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const fetch = require('fetch-cookie/node-fetch')(require('node-fetch'))

/**
 * Represents a WebScraper.
 *
 *
 * @class WebScraper
 * @augments {EvenEmitter}
 */
class WebScraper extends EvenEmitter {
  /**
   * Creates an instance of WebScraper.
   *
   * @memberof WebScraper
   * @param {string} url An URL to a webpage.
   */
  constructor (url) {
    super()
    this._url = url
    this._jsdom = JSDOM
  }

  /**
   * Gets the passed urls HTML.
   *
   * @param {string} url - An URL.
   * @returns {string} The HTML of the passed string.
   * @memberof WebScraper
   */
  async fetchHTML (url) {
    let response = await fetch(url)
    response = await response.text()

    return response
  }

  /**
   * Fetches the passed url and translates the
   * response from json to object.
   *
   * @param {string} url An url.
   * @returns {object} The response.
   * @memberof WebScraper
   */
  async fetchJSON (url) {
    const response = await fetch(url)

    return response.json()
  }

  /**
   * Sends a post request with fetch.
   *
   *
   * @param {string} url An url.
   * @param {object} credential The login credentials.
   * @returns {string} A string with html.
   * @memberof WebScraper
   */
  async fetchPost (url, credential) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `username=${credential.username}&password=${credential.password}`
    })

    return response.text()
  }

  /**
   * Gets all the links from the website.
   *
   * @param {string} startPage A string of HTML.
   * @returns {Array} An array with links.
   * @memberof WebScraper
   */
  async getLinks (startPage) {
    return new Promise((resolve, reject) => {
      try {
        const dom = new this._jsdom(startPage)
        const atags = Array.from(dom.window.document.querySelectorAll('a'))
        const links = atags.map(atag => {
          return atag.href
        })
        resolve(links)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = WebScraper
