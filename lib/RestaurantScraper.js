'use strict'

const WebScraper = require('./WebScraper')

/**
 * Represents a RestaurantScraper.
 *
 * @class RestaurantScraper
 * @augments {WebScraper}
 */
class RestaurantScraper extends WebScraper {
  /**
   * Creates an instance of RestaurantScraper.
   *
   * @param {string} url The url to the restaurant.
   * @param {Array} movies Information about the movies.
   * @memberof RestaurantScraper
   */
  constructor (url, movies) {
    super(url)
    this._movieInformation = movies
    this._userCredentials = {
      username: 'zeke',
      password: 'coys'
    }
    this._message = 'possible reservations'
  }

  /**
   * Scrapes the restaurant for the possible table bookings.
   *
   */
  async scrapeResturant () {
    try {
      const html = await this.fetchHTML(this._url)
      const formURL = await this._getFormURL(html)
      const restaurantHTML = await this.fetchPost(formURL, this._userCredentials)
      const possibleBookings = await this._getPossibleBookings(restaurantHTML)
      if (possibleBookings.length > 0) {
        this.emit('tablesfound', possibleBookings, this._message)
      } else {
        this.emit('notablesfound', this._message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Gets the possible table bookings.
   *
   * @param {string} html The html for the site.
   * @returns {Promise} A promise with the possible tables.
   * @memberof RestaurantScraper
   */
  _getPossibleBookings (html) {
    return new Promise((resolve, reject) => {
      try {
        const dom = new this._jsdom(html)

        const bookings = Array.from(dom.window.document.querySelectorAll('p input'))
        const possibleBookings = []
        this._movieInformation.forEach(movie => {
          bookings.forEach((booking) => {
            const movieDay = movie.day.slice(0, 3).toLowerCase()
            const movieTime = Number(movie.time.slice(0, 2)) + 2
            const bookingDay = booking.value.slice(0, 3)
            const bookingTime = Number(booking.value.slice(3, 5))

            if (bookingDay === movieDay) {
              if (bookingTime >= movieTime) {
                possibleBookings.push({
                  movie: movie.movie,
                  movieTime: movie.time,
                  day: movie.day,
                  tableStart: booking.value.slice(3, 5) + ':00',
                  tableEnd: booking.value.slice(5) + ':00'
                })
              }
            }
          })
        })
        // console.log(possibleBookings)
        resolve(possibleBookings)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Gets the url from the login form.
   *
   * @param {string} html The url of the login site for the restaurant.
   * @returns {Promise} A promise with the url from the login form.
   * @memberof RestaurantScraper
   */
  _getFormURL (html) {
    return new Promise((resolve, reject) => {
      try {
        const url = this._url.slice(0, this._url.lastIndexOf('/'))

        const dom = new this._jsdom(html)
        const form = dom.window.document.querySelector('form')
        resolve(url + form.action)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = RestaurantScraper
