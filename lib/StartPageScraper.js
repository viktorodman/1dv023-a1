'use strict'

const WebScraper = require('./WebScraper')

/**
 * Represents a StartPageScraper.
 *
 * @class StartPageScraper
 * @augments {WebScraper}
 */
class StartPageScraper extends WebScraper {
  /**
   * Creates an instance of StartPageScraper.
   *
   * @param {string} url An URL.
   * @memberof StartPageScraper
   */
  constructor (url) {
    super(url)
    this._message = 'links'
  }

  /**
   * Scrapes the startpage and emits
   * an "linksfound" event if any links where found
   * otherwise it emits a "linknotfound" event.
   *
   * @memberof StartPageScraper
   */
  async scrapeStartPage () {
    try {
      const startPage = await this.fetchHTML(this._url)
      const links = await this.getLinks(startPage)
      if (links.length > 0) {
        this.emit('linksfound', links, this._message)
      } else {
        this.emit('linknotfound', this._message)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = StartPageScraper
