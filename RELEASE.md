# Release

In this file you indicate the status of your assignment by checking the checkboxes below. No unchecked chackboxes are allowed in the document when your hand in for assessment.

## Release status

_To make a release that will be assessed by the examiner you need to make sure all checkboxes below are checked. You check a checkbox by adding a "x" within the brackets._

- [x] I have started working on the assignment.
- [x] `npm install` is being used to install all dependencies.
- [x] `npm start` is being used to start the application.
- [x] All functional requirements are fulfilled.
- [x] All non-functional requirements are fulfilled.
- [x] I have completed the assignment report (see below).

---

- [x] I intend to submit the assignment and at the same time I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

_In the assignment report you reflect on your assignment. You can write in English or Swedish._

### Reflection

This assignment was tough in the beginning, trying to figure out what external modules to use for requesting and working with html outside the DOM. 

Another challenge was trying make all the code asynchronous. It was hard to figure out if the code was asynchronous or synchronous. 

Another challenge was to fetch with a cookie on the login for the restaurant. I found a solution on how to be able to do this with node-fetch and fetch-cookie on a old post on ”1dv023-serverutv”.

### Further improvments

I was thinking about adding ”Workers”. I would have tried to use workers too see if I was able to maybe fetch all the calendars on different threads or something similar. I not sure if this would have increased the speed of execution, but that would be the reason for doing that.

Another thing I would like to add, is the ability to book tables. The reason I didn’t was that I got the same response from the server, no matter what day that I chose.

### Extras

I used the [chalk module](https://www.npmjs.com/package/chalk) to add colors on the text when I log the results.

### Feedback

Maybe to add some feedback from the server when booking a table, on what table you booked at what time.
