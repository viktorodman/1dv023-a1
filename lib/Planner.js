'use strict'

const StartPageScraper = require('./StartPageScraper')
const CalendarScraper = require('./CalendarScraper')
const CinemaScraper = require('./CinemaScraper')
const RestaurantScraper = require('./RestaurantScraper')
const Display = require('./Display')

/**
 * Represents a planner.
 *
 * @class Planner
 */
class Planner {
  /**
   * Creates an instance of Planner.
   *
   * @memberof Planner
   * @param {string} startUrl The start url for the application.
   */
  constructor (startUrl) {
    this._startUrl = startUrl
    this._display = new Display()
    this._links = undefined
  }

  /**
   * Initiates the planning.
   *
   * @memberof Planner
   */
  startPlanning () {
    try {
      const startPageScraper = new StartPageScraper(this._startUrl)
      startPageScraper.on('linksfound', (links, message) => {
        this._links = links
        this._display.logSuccessfulScrape(message)
        this._scrapeCalendars(this._links[0])
      })
      startPageScraper.on('linknotfound', (message) => {
        this._display.logOnNotFound(message)
      })
      startPageScraper.scrapeStartPage()
    } catch (error) {
      console.log(error, 'error in planning')
    }
  }

  /**
   * Creates a CalendarScraper that will find
   * the possible days that all the friends can meet.
   *
   * @param {string} url - The URL for the calendar.
   * @memberof Planner
   */
  _scrapeCalendars (url) {
    try {
      const calendarScraper = new CalendarScraper(url)

      calendarScraper.on('daysfound', (days, message) => {
        this._display.logSuccessfulScrape(message)
        this._scrapeCinema(this._links[1], days)
      })
      calendarScraper.on('nodayfound', (message) => {
        this._display.logOnNotFound(message)
      })
      calendarScraper.scrapeCalendars()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Checks what movies that are available at the days
   * that the three friends can meet.
   *
   * @param {string} url The url for the cinema.
   * @param {Array} days The possible days.
   * @memberof Planner
   */
  _scrapeCinema (url, days) {
    try {
      const cinemaScraper = new CinemaScraper(url, days)
      cinemaScraper.on('moviesfound', (movies, message) => {
        this._display.logSuccessfulScrape(message)
        this._scrapeRestaurant(this._links[2], movies)
      })
      cinemaScraper.on('moviesnotfound', (message) => {
        this._display.logOnNotFound(message)
      })
      cinemaScraper.scrapeCinema()
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Checks if there are any tables available after the friends
   * finished the movie.
   *
   * @param {string} url The url for the rest.
   * @param {Array} movies The possible movies.
   * @memberof Planner
   */
  _scrapeRestaurant (url, movies) {
    try {
      const restaurantScraper = new RestaurantScraper(url, movies)

      restaurantScraper.on('tablesfound', (dayinfo, message) => {
        this._display.logSuccessfulScrape(message)
        this._display.logRecommendations(dayinfo)
      })
      restaurantScraper.on('notablesfound', (message) => {
        this._display.logOnNotFound(message)
      })
      restaurantScraper.scrapeResturant()
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Planner
