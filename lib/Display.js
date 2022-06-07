'use strict'

const chalk = require('chalk')

/**
 * Represents A Display.
 *
 * @class Display
 */
class Display {
  /**
   * Creates an instance of Display.
   *
   * @memberof Display
   */
  constructor () {
    this._recommendationString = `${'\n'}Recommendations${'\n'}===============`
  }

  /**
   * Logs a successfull scrape with the passed message.
   *
   * @param {string} message The scraped site.
   * @memberof Display
   */
  logSuccessfulScrape (message) {
    console.log(`Scraping ${message}...${chalk.green('OK')}`)
  }

  /**
   * Logs an unsuccessfull scrape with the passed message.
   *
   * @param {string} message The scraped site.
   * @memberof Display
   */
  logOnNotFound (message) {
    console.log(`${chalk.red('No')} ${message} where found!`)
  }

  /**
   * Logs the recommended days.
   *
   * @param {Array} dayInfo Information about the recommended days.
   * @memberof Display
   */
  logRecommendations (dayInfo) {
    console.log(`${this._recommendationString}${this._getRecommendationString(dayInfo)}`)
  }

  /**
   * Creates a string with all the recommended days.
   *
   * @param {Array} dayInfo Information about the recommended days.
   * @returns {string} A string with the representing the recommended days.
   * @memberof Display
   */
  _getRecommendationString (dayInfo) {
    let recommendation = ''
    dayInfo.forEach(day => {
      recommendation += `${'\n'}* On ${chalk.magenta(day.day)} the movie "${chalk.cyanBright(day.movie)}" starts at ${chalk.yellowBright(day.movieTime)} and there is a free table between ${chalk.yellowBright(day.tableStart + '-' + day.tableEnd)}.`
    })
    return recommendation
  }
}

module.exports = Display
