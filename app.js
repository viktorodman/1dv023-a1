/**
 * Starting point of the application.
 *
 * External modules used in this application
 * - JSDOM: - https://github.com/jsdom/jsdom.
 * - Node-Fetch: https://www.npmjs.com/package/node-fetch.
 * - Fetch-Cookie: https://www.npmjs.com/package/fetch-cookie.
 * - Chalk https://www.npmjs.com/package/chalk.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const Planner = require('./lib/Planner')

if (process.argv.length > 2) {
  const startUrl = process.argv[2]

  const planner = new Planner(startUrl)
  planner.startPlanning()
} else {
  console.log('Please enter an url')
}
