'use strict'

const WebScraper = require('./WebScraper')

/**
 * Represents a CinemaScraper.
 *
 * @class CinemaScraper
 * @augments {WebScraper}
 */
class CinemaScraper extends WebScraper {
  /**
   * Creates an instance of CinemaScraper.
   *
   * @param {string} url The url for the cinema website.
   * @param {Array} possibleDays An array with possible days.
   * @memberof CinemaScraper
   */
  constructor (url, possibleDays) {
    super(url)
    this._possibleDays = possibleDays
    this._message = 'showtimes'
  }

  /**
   * Scrapes the available movies and
   * emits the possible movies.
   *
   * @memberof CinemaScraper
   */
  async scrapeCinema () {
    try {
      const html = await this.fetchHTML(this._url)
      const days = await this._getDays(html, this._possibleDays)
      const movies = await this._getMovies(html)

      const movieInfo = await Promise.all(days.map(async (day, i) => {
        const availableMovies = await Promise.all(movies.map(movie => {
          return this.fetchJSON(`${this._url}/check?day=${day.id}&movie=${movie.id}`)
        }))
        return availableMovies
      }))

      const possibleMovies = await movieInfo.flat(days.length + movies.length).filter(movie => movie.status === 1)
      const movieObject = this._createMovieObjects(possibleMovies, days, movies)

      if (movieObject.length > 0) {
        this.emit('moviesfound', movieObject, this._message)
      } else {
        this.emit('moviesnotfound', this._message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Creates an Array with objects containing
   * the possible movies information.
   *
   * @param {Array} possibleMovies An array with possible movies.
   * @param {Array} days An array with possible days.
   * @param {Array} movies All movies.
   * @returns {Array} An array with objects containing movieinformation.
   * @memberof CinemaScraper
   */
  _createMovieObjects (possibleMovies, days, movies) {
    possibleMovies.forEach(movie => {
      const title = movies.find(m => m.id === movie.movie)
      const day = days.find(d => d.id === movie.day)
      movie.movie = title.title
      movie.day = day.day
    })
    return possibleMovies.map(movie => {
      return {
        day: movie.day,
        movie: movie.movie,
        time: movie.time
      }
    })
  }

  /**
   * Scrapes all movies from the CinemaSite.
   *
   * @param {string} html A string with html.
   * @returns {Array} An array with objects that contains every movies title and id.
   * @memberof CinemaScraper
   */
  _getMovies (html) {
    return new Promise((resolve, reject) => {
      try {
        const movieNumbers = []
        const dom = new this._jsdom(html)
        const movies = Array.from(dom.window.document.querySelector('#movie'))
        movies.forEach(movie => {
          if (!movie.textContent.startsWith('-')) {
            movieNumbers.push({
              title: movie.textContent,
              id: movie.value
            })
          }
        })
        resolve(movieNumbers)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Scrapes the cinema for the numbers associated
   * with the days of the movies.
   * Only scrapes after the days included in possibleDays.
   *
   * @param {string} html A string with html.
   * @param {Array} possibleDays An array with possible days.
   * @returns {Array} An array with objects with the day and the day id.
   * @memberof CinemaScraper
   */
  _getDays (html, possibleDays) {
    return new Promise((resolve, reject) => {
      try {
        const dom = new this._jsdom(html)
        const days = Array.from(dom.window.document.querySelector('#day'))
        const dayArray = []
        days.forEach(day => {
          if (possibleDays.includes(day.textContent.toLowerCase())) {
            dayArray.push({
              day: day.textContent,
              id: day.value
            })
          }
        })
        resolve(dayArray)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = CinemaScraper
