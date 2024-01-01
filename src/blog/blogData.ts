export type BlogData = {
  header: string;
  body: Array<string>;
  createdAt: string;
}

export const blogEntries: Array<BlogData> = [
  {
    header: "WireMock to mock APIs",
    body: [
      "<p>If you have a need to mock APIs then WireMock to the rescue.</p>",
      '<p>See <a href="http://wiremock.org/">http://wiremock.org/ </a></p>',
      "<p>In the last blog I have defined APIs in swagger hub. Now I need a way to exercise those APIs. I’m very glad to have found WireMock.</p>",
      '<p>I followed the getting started guide to run WireMock locally (<a href="http://wiremock.org/docs/getting-started/">http://wiremock.org/docs/getting-started/ </a>). It must be a Spring Boot jar 🙂 </p>',
      "<p>I downloaded the standalone jar and ran it on port 9999.</p>",
      "<ul>",
      "<li>java -jar wiremock-standalone-2.18.0.jar –port 9999</li>",
      "</ul>",
      "<br><p>I then added a stub API</p>",
      "<ul>",
      '<li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request": { "method": "GET", "url": "/hello1" }, "response": { "body": "Hello world!" }}&apos;</li>',
      "</ul>",
      "<br><p>Exercise the stub</p>",
      "<ul>",
      "<li>curl http://localhost:9999/hello1</li>",
      "</ul>",
      '<br><p>Added a new stub to return a json body',
      "<ul>",
      '<li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request”: { "method”: "GET”, "url”: "/hello2” }, "response”: { "jsonBody”: {"Hello”: "world!” }}}&apos;',
      "</ul>",
      "<br><p>Exercise the stub",
      "<ul>",
      "<li>curl http://localhost:9999/hello2</li>",
      "</ul>",
      "<br><p>To see all stub mappings",
      "<ul>",
      "<li>curl http://localhost:9999/__admin/</li>",
      "</ul>",
      '<br><p>See <a href="http://wiremock.org/docs/stubbing/">http://wiremock.org/docs/stubbing/</a> for more ways to stub.</p>',
      "<p>Shutdown the local server",
      "<ul>",
      "<li>curl -X POST http://localhost:9999/__admin/shutdown</li>",
      "</ul>",
      '<br><p>Next I deployed the WireMock server to Heroku. You can too. See my github repo <a href="https://github.com/gpratte/wiremock-deploy-heroku">https://github.com/gpratte/wiremock-deploy-heroku</a></p>',
    ],
    createdAt: "May 29, 2018"
  },
  {
    header: "APIs defined",
    body: [
      "<p>I’ve made a first pass for the API definitions using Open API.</p>",
      "<p>What I did was look at my UI mockups (see previous Mockup blog entry) to determine what APIs the client needed. It was very helpful to think through the behavior of the system from the client point of view.</p>",
      '<p>The API definitions can be found on swagger hub at <a href="https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC">https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC</a></p>',
      '<p>This tutorial was key to learning version 2.0 of the Open API <a href="https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/">https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/</a></p>'
    ],
    createdAt: "May 26, 2018"
  },
  {
    header: "Open API (swagger)",
    body: [
      "<p>I’ve begun defining the APIs on swagger hub.</p>",
      '<p>Have a look <a href="https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC">https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC</a></p>'
    ],
    createdAt: "May 24, 2018"
  },
  {
    header: "Finished with mockups",
    body: [
      "<p>Finished with the bootstrap mockups.</p>",
      "<p>Normally I would dive into coding the backend but I’m going to start from a different point of view – the front end.</p>",
      '<p>While working at a company that created many a mobile application for the past several years I would be asked the same question repeatedly by the front end developers which is "how can I know what the back end APIs are and if they are doing the right thing?"</p>',
      "<p>Next is API documentation and testing from the front end point of view.</p>"
    ],
    createdAt: "May 18, 2018"
  },
  {
    header: "Mockups",
    body: [
      "<p>I’ve begun creating mockups using bootstrap (bootstrap 4 and font awesome 5).</p>",
      '<p>The files can be found in github at <a href="https://github.com/gpratte/texastoc-v2-wireframes">https://github.com/gpratte/texastoc-v2-wireframes</a></p>',
      "<p>Clone the repo, open index.html in a browser and click on the links.</p>"
    ],
    createdAt: "May 13, 2018"
  },
  {
    header: "Next User Interface (mockups)",
    body: [
      "<p>The next thing to do is to come up with the mockups for the web pages.</p>",
      "<p>I am not a UX nor a UI designer. In fact, I’m terrible at it. My artistic skills do not go beyond drawing stick men. I can get away with poor user experience because</p>",
      "<ul>",
      "<li>I’m working for free</li>",
      "<li>Only about 100 people will ever use the application.</li>",
      "</ul>",
      "<br><p>Bootstrap will go a long way to making my web pages look nice and work properly. It has some decent UI components (buttons, icons, …) and it is responsive so it will look good on different sized devices (mobile, tablet and laptop).</p>",
      "<p>Time for me to take a deep dive into Bootstrap 4.</p>"
    ],
    createdAt: "May 1, 2018"
  },
  {
    header: "Agile Personas And Stories",
    body: [
      "<p>A few months back I brought together several players and we had an agile discovery for the next version (v2) of the application.</p>",
      "<p>The players represented a good cross section of the personas of the users of the application.</p>",
      "<p>Lots of post-its which resulted in epics, which resulted in stories.</p>",
      "<p>I’m using Trello for managing the stories. In the past I deployed Jira to Heroku but decided that was overkill – Trello should be sufficient.</p>",
      "<p>Here’s a link to the Trello board before any development ...</p>",
      '<p><a href="https://trello.com/b/j1CmXjB4/texas-toc-v2">https://trello.com/b/j1CmXjB4/texas-toc-v2</a></p>',
      "<p>When the time come to start the first sprint I’ll copy the board which will keep a history.</p>"
    ],
    createdAt: "April 30, 2018"
  },
  {
    header: "Refactor My Poker League Application",
    body: [
      "<p>I play in a poker league. We play a 52 week season. The group has not missed a game in over 12 years (I joined 11 years ago). Presently I have a Java/Spring/MySQL/JQueryMobile application that I wrote in 2014.</p>",
      "<p>Time to blow the dust off the app and refactor to use up-to-date software. I use this as my reference application when interviewing (and I’ll be interviewing in later this year).</p>",
      "<p>Will be refactoring from Spring 3.x/MySQL/Velocity/JQueryMobile to Spring Boot 2.x/Postgres/Angular</p>",
      '<p>To see the running application visit <a href="https://www.texastoc.com">https://www.texastoc.com></a><p>',
      '<p>To see the source code visit <a href="https://github.com/gpratte/texastoc">https://github.com/gpratte/texastoc</a></p>',
      "<p>The app does thing like:</p>",
      "<ul>",
      "<li>Allows guest to view the site and obfuscates names and dollar amounts</li>",
      "<li>Add players to a game</li>",
      "<li>Mark players that finish in the top 10 of a game</li>",
      "<li>Calculates payouts in a game</li>",
      "<li>Randomly seat the players before each game and text players their table/seat</li>",
      "<li>Game clock for the rounds and text those who have opted in then a round changes</li>",
      "<li>Tracks seasons (games, quarterly seasons, season results, top ten lists)</li>",
      "<li>Emails asking for the weekly host</li>",
      "<li>Emails asking who will transport the supplies</li>",
      "<li>FAQ</li>",
      "<li>...</li>",
      "</ul>",
      "<br><p>It is time to refactor to</p>",
      "<ul>",
      "<li>Spring Boot for the backend</li>",
      "<li>Progressive web app using Angular for the front end</li>",
      "<li>Bootstrap for a nice HTML look and feel</li>",
      "<li>Many new features</li>",
      "</ul>"
    ],
    createdAt: "April 29, 2018"
  },
  {
    header: "Hello",
    body: [
      "<p>I am a software developer. My wheelhouse is backend development in Java/Spring. That being said I also<p>",
      "<ul>",
      "<li>write frontend code from time to time</li>",
      "<li>have professionally developed in assembler (Intel x86 processors), C, python and node.js</li>",
      "<ul>",
      "<p>I am going to rewrite from scratch the backend and the frontend for my personal application. But there is so much more to creating an application than writing code. There are things like: user stories; software architecture; UI mockups; testing; deployment; ...</p>",
      "<p>This blog will be documenting the journey of my rewriting my personal application.<p>"
    ],
    createdAt: "April 28, 2018"
  }
]