'use strict'

const WebScraper = require('./WebScraper')

/**
 * Represents a CalendarScraper.
 *
 * @class CalendarScraper
 * @augments {WebScraper}
 */
class CalendarScraper extends WebScraper {
  /**
   *Creates an instance of CalendarScraper.
   *
   * @param {string} calenderURL The url for the calendar.
   * @memberof CalendarScraper
   */
  constructor (calenderURL) {
    super(calenderURL)
    this._days = {
      friday: 0,
      saturday: 0,
      sunday: 0
    }
    this._message = 'available days'
  }

  /**
   * Scrapes all friends callenders and
   * emits the possible days when all friends can meet.
   *
   * @memberof CalendarScraper
   */
  async scrapeCalendars () {
    try {
      const html = await this.fetchHTML(this._url)
      const calendars = await this.getLinks(html)

      const personCalendars = await Promise.all(calendars.map(async calendar => {
        const html = await this.fetchHTML(this._url + calendar)
        const dom = new this._jsdom(html)

        const tdElements = Array.from(dom.window.document.querySelectorAll('td'))
        const thElements = Array.from(dom.window.document.querySelectorAll('th'))

        return this._getDays(thElements, tdElements)
      }))

      const plannedDay = this._selectDay(personCalendars)

      if (plannedDay.length > 0) {
        this.emit('daysfound', plannedDay, this._message)
      } else {
        this.emit('nodayfound', this._message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Gets the day/days when all friends are available.
   *
   * @param {Array} calendars - The possible days.
   * @returns {Array} The day/days when the friends can meet.
   * @memberof CalendarScraper
   */
  _selectDay (calendars) {
    const dayKeys = Object.keys(this._days)

    dayKeys.forEach(dayKey => {
      this._days[dayKey] = calendars.reduce((acc, day) => acc + day[dayKey], 0)
    })

    return dayKeys.filter(dayKey => this._days[dayKey] === Math.max(...Object.values(this._days)))
  }

  /**
   * Gets the days when a friend is available.
   *
   * @param {Array} thElements The possible days.
   * @param {Array} tdElements Presents if a friends is available that day.
   * @returns {Promise} A promise with an object if it is resolved.
   * @memberof CalendarScraper
   */
  _getDays (thElements, tdElements) {
    return new Promise((resolve, reject) => {
      try {
        const dayObject = {
          friday: 0,
          saturday: 0,
          sunday: 0
        }
        tdElements.forEach((td, i) => {
          if (td.textContent.toUpperCase() === 'OK') {
            const day = thElements[i].textContent.toLowerCase()
            dayObject[day] += 1
          }
        })

        resolve(dayObject)
      } catch (error) {
        reject(error)
        console.log(error, 'Error in get days')
      }
    })
  }
}

module.exports = CalendarScraper
