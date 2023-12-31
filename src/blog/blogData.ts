export type BlogData = {
  header: string;
  body: Array<string>;
  createdAt: string;
}

export const blogEntries: Array<BlogData> = [
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
      "<p>It is time to refactor to</p>",
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