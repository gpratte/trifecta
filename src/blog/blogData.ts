export type BlogData = {
  header: string;
  body: string;
  createdAt: string;
}

export const blogEntries: Array<BlogData> = [
  {
    header: "React/Redux client calling Spring Boot server",
    body: `<p>It’s been a long time coming but it happened today – the client made a call to the server.</p>
      <p>Woo hoo!!!</p>
      <p>I wrote version 1 of the poker league application back in 2014. Back end is Spring MVC 3.X and front end is JQuery mobile.</p>
      <p>I started working on version 2 in 2018. My first blog post was April 28, 2018 (see the first blog posting in this blog).</p>
      <p>As far as the client calling the server see the readme for branch 06 in the <a href="https://github.com/gpratte/texastoc-v2-react-redux/tree/step-06-login-api">https://github.com/gpratte/texastoc-v2-react-redux/tree/step-06-login-api</a> repository. Making an AJAX call using the Axiom library.</p>`,
    createdAt: "February 17, 2020"
  },
  {
    header: "Travis CI",
    body: `<p>In an earlier post I wrote about using CircleCI for continuous integration and deployment to Heroku. It was been months since it has run and when it did today it could not pull from GitHub. After more than an hour reading both CircleCI document and other results from my google search I still could not figure out what I needed to do to fix the problem. I must say I am not impressed with CircleCI’s documentation.</p>
     <p>So I switch to using Travis CI. I had it working in minutes (just to pull and run the tests, not to deploy). Here’s my .travis.yml</p>
     <pre>  language: java
  jdk: openjdk8
  sudo: false
  script: mvn clean install
  cache:
    directories:
      - $HOME/.m2

  install:
    - mvn -N io.takari:maven:wrapper
    - ./mvnw install -DskipTests=true -Dmaven.javadoc.skip=true -B -V</pre>`,
    createdAt: "February 16, 2020"
  },
  {
    header: "React Router",
    body: `<p>In previous blogs I built up the poker-league-current-game react/redux application. The main react component is the CurrentGame.</p>
      <p>I also built a poker-league-season react/redux application (I did not blog about this). The main react component is the Season.</p>
      <p>The poker league application will have a navigation header and a main page. The main page will "swap" these components. I implemented this in the texastoc-v2-react-redux application using react routing.</p>
      <p>A snippet of code for the navigation bar and main section</p>
      <pre>  &lt;Navbar>
  ...
  &lt;/Navbar&gt;
  &lt;Switch&gt;
  &lt;Route exact={true} path="/" component={Home}/&gt;
  &lt;Route path="/season" component={Season}/&gt;
  &lt;Route path="/current-game" component={CurrentGame}/&gt;
  &lt;/Switch&gt;</pre>
      <p>See the readme in the github repository for more details.</p>`,
    createdAt: "February 16, 2020"
  },
  {
    header: "Using React State Instead of Redux",
    body: `<p></p>
      <p>I thought making a copy of the seating in the redux store for the UI (see previous blog post) is a bit clunky. I talked to one of the expert react/redux developers at work and he said that using react state instead of the redux store is another possibility (along with a disclaimer that he has not looked at the code yet to know for sure what I am trying to achieve).</p>
      <p>I changed the SeatingConfig react component to create the seating state from the game.seating values in the constructor. Then the SeatingConfig and its two subcomponents, SeatingSeatsPerTable and SeatingPlayerAtTable, use the react state to save the fields that are set in the UI.</p>
      <p>When the SeatingConfig modal dialog is submitted the react state is used to get the values and then packaged to call the redux store to upsert the seating.</p>
      <p>I had to force the SeatingConfig modal dialog component to remount when it is shown so that the constructor can set the state. Did this by adding a key which changes when it is time for the modal dialog to appear.</p>
      <pre><SeatingConfig key={game.showConfigureSeatingKey} game={game}/></pre>
      <p>See branch step-13-react-state-instead-of-redux in the <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a> repository. As always compare the branch to the previous branch if you want to see the changes.</p>`,
    createdAt: "January 5, 2020"
  },
  {
    header: "Using Redux/React for Dynamically Showing UI Components",
    body: `<p>Coded up the poker UI for seating players. This has a lot of dynamically showing/hiding UI React components by using Redux Actions/Reducer/Store.</p>
      <p>The following quote is from step 12 seating section of the readme for <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a></p>
      <p>"The tricky thing was to make a copy of the seating for the UI to use. The UI changes the copy in the store. That way if the modal dialog is cancelled it does not affect the "real" seating values in the store."</p>
      <p>See branches step-12-seating in the <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a> repository. As always compare the branch to the previous branch if you want to see the changes.</p>`,
    createdAt: "December 29, 2019"
  },
  {
    header: "More React Bootstrap Modal",
    body: `<p>Since the last post I coded up the ability to update a player and add a new player (one that has never played in the poker league before). Updating and adding a new player are each done in their own react bootstrap modal dialog.</p>
      <p>See branches step-09-edit-player and step-10-add-new-player in the <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a> repository. As always compare the branch to the previous branch if you want to see the changes.</p>`,
    createdAt: "December 25, 2019"
  },
  {
    header: "React Bootstrap Modal",
    body: `<p>I am using a react bootstrap modal for a dialog to add an existing league player to a game. See <a href="https://react-bootstrap.github.io/components/modal/">https://react-bootstrap.github.io/components/modal/</a></p>
      <p>The modal dialog was a part of the react component that shows a list of the players in the game. At the bottom of the list there is a button to add a player which bring up the modal dialog. As per the bootstrap documentation I put the modal state to show/hide in the react component.</p>
      <p>I wanted to move the modal dialog into its own react component. This means the button to add a player is in one component and the modal itself is in another component. How to handle the show/hide state? Redux of course!</p>
      <p>To get this to work the following changes were made</p>
      <ul>
        <li>the redux store now has a showAddExistingPlayer boolean.</li>
        <li>a new TOGGLE_ADD_EXISTING_PLAYER_TO_GAME action</li>
        <li>the reducer changes the value of the showAddExistingPlayer in the store when it gets an TOGGLE_ADD_EXISTING_PLAYER_TO_GAME action</li>
        <li>when the add player button is clicked it dispatches the TOGGLE_ADD_EXISTING_PLAYER_TO_GAME action</li>
        <li>a new AddExistingPlayer component which is a modal dialog. It shows/hides whenever the showAddExistingPlayer store is changed by the reducer.</li>
      </ul>
      <p>See branch step-08-add-player-modal-component in the <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a> repository. Compare it to the previous step 07 branch if you want to see the changes.</p>`,
    createdAt: "December 23, 2019"
  },
  {
    header: "Redux",
    body: `<p>I have a lot of React components so it is time to add Redux to the mix. In an earlier post, Learn Redux, I worked through the redux.js.org tutorial. Adding redux to my poker league application front end was the goal.</p>
      <p>Wiring up redux in this application was difficult for two reasons</p>
      <ol>
        <li>learning redux for the first time</li>
        <li>I have a lot of react components</li>
      </ol>
      <p>I simplified the scope of wiring up redux by concentrating on being able to add an existing league player to the current game. But this was still too much to do in this application (e.g. getting the player information from a react bootstrap modal dialog). So to simplify things even more I created a very small repository where I got things working. See <a href="https://github.com/gpratte/redux-toy-poker-game">https://github.com/gpratte/redux-toy-poker-game</a></p>
      <p>There were two aha moments. The first was figuring out that the redux connector is used early in the application plumbing. The second was putting the store in its own file.</p>
      <p>See the code by looking at the step 07 redux branch of my poker league application at <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a></p>`,
    createdAt: "December 22, 2019"
  },
  {
    header: "React Bootstrap",
    body: `<p>Added React Bootstrap to the poker league game I’ve been working on (see previous post).</p>
      <p>It’s nice to add Bootstrap to the app for two reasons:</p>
      <ol>
        <li>It looks nice. Nice buttons, tables, rows and columns, ...</li>
        <li>Functionality – accordions, modal dialogs, ...</li>
      </ol>
      <p>Check out the modal dialogs for adding and updating players, nice 🙂</p>`,
    createdAt: "November 27, 2019"
  },
  {
    header: "React/Redux Poker League Game",
    body: `<p>Beginning coding React/Redux in earnest. For my poker league game I am going to rewrite the entire front end using React and Redux.</p>
      <p>I am beginning with the heart of the front end – the game in progress.</p>
      <p>See the readme for this application in my github at <a href="https://github.com/gpratte/poker-league-current-game">https://github.com/gpratte/poker-league-current-game</a></p>`,
    createdAt: "November 17, 2019"
  },
  {
    header: "Learn Redux",
    body: `<p>I worked through the <a href="https://redux.js.org/basics/basic-tutorial">basic redux tutorial</a>. I learned about</p>
      <ul>
        <li>actions</li>
        <li>reducers</li>
        <li>store</li>
        <li>data flow</li>
        <li>using redux with react</li>
      </ul>
      <p>As always I built up the tutorial in steps that are branches in the github react-redux-tutorial repository.</p>
      <p>Unfortunately the tutorial is a todo list which is what I created (see <a href="https://github.com/gpratte/react-todo-list">react-todo-list</a>) to learn react. It does not make sense to refactor my todo list to incorporate redux since I already know how to do it (what’s the challenge in that). The goal of learning react/redux is firstly to rewrite my front end for my poker league app and secondly for work. Hence I’ll leave the todo list behind and move on to writing the game piece of the poker league app.</p>`,
    createdAt: "November 16, 2019"
  },
  {
    header: "My First React App – Code Review Changes",
    body: `<p>Fortunately for me a couple of guys on my team at work are fluent in React. I asked them to do a code review and got a lot of good feedback. As a result of the feedback the  <a href="https://github.com/gpratte/react-todo-list/tree/step-10-code-review-refactor">step-10-code-review-refactor branch</a> has the following changes</p>
      <ul>
        <li>Use .jsx extension for components</li>
        <li>Use lodash for better performance for map, filter, etc.</li>
        <li>Consider using destructuring syntax to avoid constantly referencing state or props, e.g. const { foo, bar, baz } = this.state</li>
        <li>Consistently use arrow methods vs regular old functions</li>
        <li>Count should probably be in the component state</li>
        <li>Unless there are things like dashes/dots, quotes are unnecessary for object keys</li>
        <li>With ES2015 you could use template literal for text substitutionSpelled concatenate wrong</li>
        <li>Avoid creating new functions in render, this is bad for scalability as each render will create new functions that need to be garbage collected</li>
      </ul>`,
    createdAt: "September 14, 2019"
  },
  {
    header: "My First React App – a TODO List",
    body: `<p>I previously blogged about coding the reactjs.org’s tutorial.</p>
      <p>Since then I watched Wes Bos’ React For Beginners course.</p>
      <p>The next step was to write my own react app from scratch – a todo list which can be found at <a href="https://github.com/gpratte/react-todo-list">https://github.com/gpratte/react-todo-list</a>.</p>
      <p>The stumbling blocks were</p>
      <ul>
        <li>handing events</li>
        <li>state and properties</li>
      </ul>
      <p>I went back and reviewed these topics more than once in both the reactjs.org tutorial and the Wes Bos course.</p>
      <p>I also read some articles found from internet searching (e.g. How to Display a List in React).</p>
      <p>As is my modus operandi, when developing new code, I built up the tutorial on branches.</p>
      <ul>
        <li>step-01-create-development-environment</li>
        <li>step-02-ui-markup</li>
        <li>step-03-render-html</li>
        <li>step-04-add-todo</li>
        <li>step-05-remove-todo</li>
        <li>step-06-update-text</li>
        <li>step-07-concatinate-text</li>
        <li>step-08-mark-done</li>
        <li>step-09-hide-done</li>
      </ul>`,
    createdAt: "September 2, 2019"
  },
  {
    header: "Learning React https://reactjs.org/",
    body: `<p>As you can see from previous blogs I was learning Angular for my front end.I am starting at a new company and they use React for their front end. Hence I am pivoting to use React.</p>
      <p>I worked my way through the Tutorial: Intro to React.</p>
      <p>See my github repo for the code at <a href="https://github.com/gpratte/react-tic-tac-toe-tutorial-v16">https://github.com/gpratte/react-tic-tac-toe-tutorial-v16</a></p>
      <p>As is my modus operandi when developing new code I built up the tutorial on branches.</p>
      <ul>
        <li>step-1-setup-for-the-tutorial</li>
        <li>step-2-overview-making-an-interactive-component</li>
        <li>step-3-lifting-state-up</li>
        <li>step-4-function-components</li>
        <li>step-5-taking-turns</li>
        <li>step-6-declaring-a-winners</li>
        <li>step-7-lifting-state-up-again</li>
        <li>step-8-showing-the-past-moves</li>
        <li>step-9-implementing-time-travel</li>
      </ul>`,
    createdAt: "June 22, 2019"
  },
  {
    header: "Algorithm Performance",
    body: `<p>I am presenting at the inaugural meeting of the Austin Algorithms Meetup group. I’ve put together a presentation on algorithm performance and Big O.</p>
      <p>I used <a href="https://revealjs.com">https://revealjs.com</a> to create the presentation. I committed the code to GitHub and deployed it to Heroku.</p>
      <p>If you cannot come to the meeting then GitHub clone <a href="https://github.com/gpratte/algorithm-performance-presentation.git">https://github.com/gpratte/algorithm-performance-presentation.git</a> and then open index.html in a browser.</p>`,
    createdAt: "March 9, 2019"
  },
  {
    header: "More Embedding Dependencies when Testing in Spring Boot",
    body: `<p>In my last blog I wrote about mocking dependencies when running tests. Since then I’ve added Apache’s <a href="https://qpid.apache.org/">Qpid</a> to mock out RabbitMQ.</p>
      <p>The following is from the top of the readme in my github repository for the PoC (see <a href="https://github.com/gpratte/spring-boot-acceptance-test-mocks">https://github.com/gpratte/spring-boot-acceptance-test-mocks</a>)</p>
      <p>A Spring Boot project that connects to various resources (database, mongo, rest calls, JMS messaging, Rabbit messaging, legacy). Mock the connections for acceptance testing.</p>
      <p>When running tests the server uses</p>
      <ul>
        <li>An embedded ActiveMQ server (to mock JMS)</li>
        <li>Wiremock to mock the REST calls</li>
        <li>An embedded H2 in-memory database</li>
        <li>An embedded Qpid server (to mock RabbitMQ)</li>
      </ul>
      <h4>Listen to JMS message flow ...</h4>
      <ol>
        <li>Receive a Todo JMS message</li>
        <li>Make a REST call (for no good reason)</li>
        <li>Persist the Todo in a relational database</li>
      </ol>
      <p>The server is setup to</p>
      <ol>
        <li>Listen to the mailbox queue of an external JMS ActiveMQ server</li>
        <li>Makes a REST call to http://worldclockapi.com/api/json/utc/now</li>
        <li>Inserts into a Postgres database</li>
      </ol>
      <h4>REST POST to create a Todo flow ...</h4>
      <ol>
        <li>Expose a POST endpoint to create a Todo</li>
        <li>Persist the Todo in a relational database</li>
        <li>Send the Todo as JSON to RabbitMQ</li>
      </ol>
      <p>The server is setup to</p>
      <ol>
        <li>With a RestController with a PostMapping on /api/todos</li>
        <li>The controller calls a service which calls the repository to insert into a Postgres database</li>
        <li>The service also sends JSON to RabbitMQ</li>
      </ol>`,
    createdAt: "March 3, 2019"
  },
  {
    header: "Embedding Dependencies when Testing in Spring Boot",
    body: `<p>I am working on a proof of concept (POC) for embedding dependencies in a Spring Boot server.</p>
      <p>The following is from the top of the readme in my github repository for the POC.</p>
      <p>A Spring Boot project that connects to various resources (database, mongo, rest calls, JMS messaging, Rabbit messaging, legacy). Mock the connections for acceptance testing.</p>
      <p>The flow is ...</p>
      <ol>
        <li>Receive a Todo message</li>
        <li>Make a REST call (for no good reason)</li>
        <li>Persist the Todo in a relational database</li>
      </ol>
      <p>The server is setup to</p>
      <ol>
        <li>Listen to the mailbox queue of an external JMS ActiveMQ server</li>
        <li>Makes a REST call to http://worldclockapi.com/api/json/utc/now</li>
        <li>Inserts into a Postgres database</li>
      </ol>
      <p>When running tests the server uses</p>
      <ol>
        <li>An embedded ActiveMQ server</li>
        <li>Wiremock to mock the REST calls</li>
        <li>An embedded H2 in memory database</li>
      </ol>
      <p>If this interests you then check out the entire readme in my github repository at
<a href="https://github.com/gpratte/spring-boot-acceptance-test-mocks">https://github.com/gpratte/spring-boot-acceptance-test-mocks</a></p>`,
    createdAt: "February 20, 2019"
  },
  {
    header: "Java Functional Programming",
    body: `<p>I can make an analogy of my knowledge of Java functional programming to fluency in a foreign language – I can read it but have had little to no practice writing it.</p>
      <p>I spent the last couple of days getting hands on experience using lambdas and streams. Here is the reading I did.</p>
      <p>Java Tutorial Lambda Expressions at <a href="https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html">https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html</a></p>
      <p>Java Tutorial Aggregate Operations (Streams) at <a href="https://docs.oracle.com/javase/tutorial/collections/streams/index.html">https://docs.oracle.com/javase/tutorial/collections/streams/index.html</a></p>
      <p>Lambda Expressions and Functional Interfaces: Tips and Best Practices at <a href="https://www.baeldung.com/java-8-lambda-expressions-tips">https://www.baeldung.com/java-8-lambda-expressions-tips</a></p>
      <p>Functional Interfaces in Java 8 at <a href="https://www.baeldung.com/java-8-functional-interfaces">https://www.baeldung.com/java-8-functional-interfaces</a></p>
      <p>THE ULTIMATE 30-MINUTE CODING WORKOUT – STREAMS & LAMBDA EXPRESSIONS BY EXAMPLES at <a href="https://www.sw-engineering-candies.com/blog-1/Streams-Lambda-Expressions-by-Examples">https://www.sw-engineering-candies.com/blog-1/Streams-Lambda-Expressions-by-Examples</a></p>`,
    createdAt: "February 3, 2019"
  },
  {
    header: "CICD with CircleCI and Heroku",
    body: `<p>The final task to finishing off the server work is to wire up continuous integration and continuous deployment (CICD). I already have the CI piece of it working (see previous blog). Now to do the CD piece.</p>
      <h4>Step 1. Deploy Spring Boot application to Heroku</h4>
      <p>I followed the steps in the getting started on Heroku with Java tutorial. See <a href="https://devcenter.heroku.com/articles/getting-started-with-java">https://devcenter.heroku.com/articles/getting-started-with-java</a></p>
      <p>The only thing of interest is the Procfile</p>
      <em>web: java -jar application/target/texastoc-application-1.0.jar –server.port=$PORT –spring.profiles.active=test com.texastoc.Application</em>
      <p>As you can see the Spring Boot application is run as a jar.
        <br>Set the server port as instructed by Heroku.
        <br>Set the spring.profiles.active to test so the it would use the embedded H2 database (for now).
      </p>
      <h4>Step 2. Integrate CircleCI to deploy to Heroku</h4>
      <p>Next I followed the CircleCI instructions to integrate with Heroku. See <a href="https://circleci.com/integrations/heroku/">https://circleci.com/integrations/heroku/</a></p>
      <p>First I had to set a couple environment variables</p>
      <ul>
        <li>HEROKU_APP_NAME</li>
        <li>HEROKU_API_KEY</li>
      </ul>
      <p>The big change is in the .circleci/config.yml file to deploy after building. See <a href="https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/.circleci/config.yml">https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/.circleci/config.yml</a></p>
      <h4>Step 3. Spring Actuator</h4>
      <p>I needed to verify the deployment. What better way than to add a new endpoint (or two) to the server, push to github master and then curl the endpoint on the server deployed to Heroku.</p>
      <p>I added Spring Actuator and curled the health endpoint. See <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html">https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html</a> to know more about Spring Actuator.</p>`,
    createdAt: "January 27, 2019"
  },
  {
    header: "JWT Auth for Spring Boot",
    body: `<p>I took what I learned in my last blog about JWT Authentication and Authorization and applied it to my Spring Boot server application.</p>
      <p>Most of the time was spent updating the integration tests. Almost every endpoint now requires authentication. The test were enhanced to login a player which returns a token. The token is then passed in the HTTP Authorization header.</p>
      <p>Another departure from the proof of concept in my last blog is to</p>
      <ul>
        <li>use the player table instead of the user table</li>
        <li>use email instead of username</li>
      </ul>
      <p>See branch 37-jwt-auth at TexasTOC v2 Spring Boot at <a href="https://github.com/gpratte/texastoc-v2-spring-boot/tree/37-jwt-auth">https://github.com/gpratte/texastoc-v2-spring-boot/tree/37-jwt-auth</a></p>`,
    createdAt: "January 26, 2019"
  },
  {
    header: "JWT Authentication and Authorization with Spring Security",
    body: `<p>Worked through how to implement Authentication and Authorization (A&A) using JSON Web Token (JWT) with Spring Security.</p>
      <p>Instead of blogging about it here I put together a proof of concept (POC) in github. The readme tells all.</p>
      <p>See the <a href="https://github.com/gpratte/jwtauth">https://github.com/gpratte/jwtauth</a> repo.</p>`,
    createdAt: "January 21, 2019"
  },
  {
    header: "CircleCI for Continuous Integration",
    body: `<p>Using the free plan for CircleCI to build and run tests. Chose the CircleCI free plan and use my github credentials to log into CircleCI. Chose the texastoc-v2-spring-boot github repo for CircleCI to use. CircleCI added a key to this repo.</p>
      <p>Followed the CircleCI directions to</p>
      <ul>
        <li>add a .circleci directory to my project</li>
        <li>add a config.yml in the .circleci directory for a Java maven project</li>
      </ul>
      <p>Now when I push to any branch CircleCI it downloads dependencies, compiles and run the tests.</p>
      <p>Of course there were problems 🙂</p>

      <h4>Problem 1</h4>
      <p>My Java project is split into two modules: application and integration. That way I keep my integration tests separate from the application code. The integration module has a dependency on the application module.</p>
      <p>I did not have a problem running the tests locally either in IntelliJ or using maven on the command line. But CircleCI choked on the integration module having a dependency on the application module. CircleCI actually wanted the application module as a library for the integration module to use.</p>
      <p>I changed the config.yml so that the application module created a library.</p>

      <h4>Problem 2</h4>
      <p>When CircleCI attempted to run the test there was an <a href="https://stackoverflow.com/questions/50661648/spring-boot-fails-to-run-maven-surefire-plugin-classnotfoundexception-org-apache">obscure error</a>.</p>
      <p>I followed the instructions to add an ssh key to github which allowed me to run CircleCI in ssh mode. I was able to ssh into the build and look at the dump file. I googled the error and found a workaround that I added to my maven pom.xml.</p>
      <p>Of course I added a comment to the pom.xml to a link to the stackoverflow solution to the file.</p>`,
    createdAt: "January 13, 2019"
  },
  {
    header: "Start Coding the Server",
    body: `<p>Starting to code the server APIs.</p>
      <p>See <a href="https://github.com/gpratte/texastoc-v2-spring-boot">https://github.com/gpratte/texastoc-v2-spring-boot</a></p>
      <p>I am following Test Driven Development (TDD) writing the business logic. Mocking out the persistence.</p>
      <p>I am employing Cucumber tests for the endpoints. Persistence is provided by an embedded H2 in memory database.</p>
      <p>As usual I number the branches. Here are the branches (copied from the readme).</p>
      <ul>
        <li>01-security-basic-auth</li>
        <li>02-create-season</li>
        <li>03-create-season-repository</li>
        <li>04-cucumber-create-season</li>
        <li>05-tdd-get-season</li>
        <li>06-cucumber-get-season</li>
        <li>07-tdd-create-game</li>
        <li>08-cucumber-create-game</li>
        <li>09-better-mock-testing</li>
        <li>...</li>
      </ul>`,
    createdAt: "January 11, 2019"
  },
  {
    header: "TDD and BDD",
    body: `<p>I needed to get a better understanding of Test Driven Development (TDD) and Behavior Driven Development (BDD) testing.</p>
      <p>The short explanation is:</p>
      <p>Step 1. Both require a failing test to be written first in the form Arrange, Act and Assert (for BDD these verbs are Given, When and Then).</p>
      <p>Step 2. Both require that as little code as possible be written to pass the test.</p>
      <p>Step 3. Refactor the code if needed. The code that was written in step 2 may not be production worthy so make it so.</p>
      <p>I wrote a poker hand comparator. I got as far as comparing two "ahigh card wins" hands (i.e. no pairs, straights, ...).</p>
      <p>The testing and coding is all explained in the github readme at the <a href="https://github.com/gpratte/tdd-bdd-experiment">https://github.com/gpratte/tdd-bdd-experiment</a> github repository.</p>`,
    createdAt: "November 14, 2018"
  },
  {
    header: "Basic Authentication",
    body: `<p>Starting to implement login/authentication in the Texas TOC application.</p>
     <p>Use the Spring Security and Angular guide as a reference to implement basic authentication.</p>
     <p>Did not implement the reference application from the guide but instead applied the lessons to the existing Texas TOC angular front end (<a href="https://github.com/gpratte/texastoc-v2-angular">https://github.com/gpratte/texastoc-v2-angular</a>) and Texas TOC Java/Spring back end (<a href="https://github.com/gpratte/texastoc-v2-spring-boot">https://github.com/gpratte/texastoc-v2-spring-boot</a>).</p>
     <p>The Spring Security and Angular guide begins to show authentication using basic authentication at <a href="https://spring.io/guides/tutorials/spring-security-and-angular-js/#_the_login_page_angular_js_and_spring_security_part_ii">The Login Page</a></p>
     
     <h4>Angular Front End</h4>
     <p>Implemented the changes on the branch labelled <a href="https://github.com/gpratte/texastoc-v2-angular/tree/15-security-basic-auth">15-security-basic-auth</a></p>
     <table>
       <tr>
         <th>Module</th>
         <th>Function</th>
       </tr>
       <tr>
         <td>app.services.ts</td>
         <td>authenticate() – set basic auth header if credential have been entered in login page</td>
       </tr>
       <tr>
         <td>app.component.ts</td>
         <td>logout()</td>
       </tr>
       <tr>
         <td>login.component.ts</td>
         <td>login()</td>
       </tr>
       <tr>
         <td>xxx.component.ts</td>
         <td>ngInit() – route to login if not authenticated Java/Spring Back End</td>
       </tr>
     </table>
     <br>
     <h4>Java/Spring Back End</h4>
     <p>Implemented the changes on the branch labelled <a href="https://github.com/gpratte/texastoc-v2-spring-boot/tree/01-security-basic-auth">01-security-basic-auth</a></p>
     <table class="table">
       <tr>
         <th>Module</th>
         <th>Function</th>
       </tr>
       <tr>
         <td>TexastocApplication.java</td>
         <td>Added the security configuration to require basic authentication and allow CORS</td>
       </tr>
       <tr>
         <td>UserController.java</td>
         <td>\t/user endpoint to return the principal</td>
       </tr>
     </table>`,
    createdAt: "October 6, 2018"
  },
  {
    header: "Back after a lull",
    body: `<p>It has been a few months since my last blog. The reason for the lull is that I started a new job (Java/Spring Boot/Pivotal Cloud Foundry). As always starting a new job takes a lot out of a software developer – learning new tools, architecture, ... .</p>
     <p>I’ve come up to speed using gradle as a Java build tool. I’m also learning Pivotal Cloud Foundry (PCF) for the first time.</p>
     <p>Recently I’ve found time to get back to working on version 2 of the Texastoc application. I am currently working through the Spring Security and Angular tutorial in the Spring Guides.</p>
     <p>See Spring Security and Angular at <a href="https://spring.io/guides/tutorials/spring-security-and-angular-js/">https://spring.io/guides/tutorials/spring-security-and-angular-js/</a></p>
     <p>I’m not going through it from scratch but instead applying it to my Angular 6 and Spring Boot application. I’ll go into the gory details when I have it working in my next blog.</p>`,
    createdAt: "September 30, 2018"
  },
  {
    header: "Architecture – C4 model",
    body: `<p>Time for some architecture diagrams. There were two front runners that I wanted to explore for documenting the architecture</p>
      <ul>
        <li>C4 model (see <a href="https://c4model.com/">https://c4model.com/</a>)</li>
        <li>Arc42 (see <a href="https://arc42.org/">https://arc42.org/</a>)</li>
      </ul>
      <p>After a quick read of the two I chose the C4 model because it felt familiar to me. Systems, containers, components and code is the way I think about software.</p>
      <p>I chose to use <a href="https://www.draw.io/">https://www.draw.io/</a> with the C4 plugin. See the C4 model tooling section at <a href="https://c4model.com/#tooling">https://c4model.com/#tooling</a></p>
      <p>Here are the core diagrams (see <a href="https://c4model.com/#coreDiagrams">https://c4model.com/#coreDiagrams</a>) for the TexasToc application.</p>
      <p><img src="/img/c4-1.webp" alt="C4 model System Context"/></p>
      <p><img src="/img/c4-2.webp" alt="C4 model System Containers"/></p>
      <p><img src="/img/c4-3.webp" alt="C4 model Angular Components"/></p>
      <p><img src="/img/c4-4.webp" alt="C4 model API Server Components"/></p>`,
    createdAt: "June 17, 2018"
  },
  {
    header: "Angular front end (with mock data)",
    body: `<p>I’ve coded the Angular front end equivalent from the wireframe mockups that were done in bootstrap.</p>
       <p>The Angular pages use mock data that is hardcoded in the corresponding components. For example the current-game.compoent.ts has the mock data for the current-game.component.html.</p>
       <p>Also, there is no Authentication or Authorization (A&A) since there is no server (yet).</p>
       <p>See <a href="https://github.com/gpratte/texastoc-v2-angular">https://github.com/gpratte/texastoc-v2-angular</a></p>
       <p>As was the case in the last post I built up the front end in branches.</p>
       <p>Here are the branches of the repo</p>
       <ul>
       <li>01-login</li>
       <li>02-default-routing</li>
       <li>03-forgot-password</li>
       <li>04-reset-password</li>
       <li>05-navbar</li>
       <li>06-season</li>
       <li>07-season-models</li>
       <li>08-supplies</li>
       <li>09-new-game</li>
       <li>10-games-in-season</li>
       <li>11-current-game</li>
       <li>12-game-seating</li>
       <li>13-new-player</li>
       <li>14-existing-player</li>
       </ul>
       <p>To see the angular code in action do the following:</p>
       <ul>
       <li>Install the angular cli</li>
       <li>npm install -g @angular/cli</li>
       </ul>
       <p>Run the server</p>
       <ul>
       <li>ng serve</li>
       </ul>
       <p>Access the code at <a href="http://localhost:4200">http://localhost:4200</a></p>
      `,
    createdAt: "June 13, 2018"
  },
  {
    header: "Time to learn Angular",
    body: `<p>The front end will be written using Angular 6. Angular has a Tour of Heroes tutorial. I worked through it and pushed the code to github. As I worked through the tutorial I created branches – each branch building from the previous branch.</p>
      <p>The repository can be found at <a href="https://github.com/gpratte/angular-v6-tour-of-heroes">https://github.com/gpratte/angular-v6-tour-of-heroes</a></p> 
      <p>Here are the branches of the repo</p> 
      <ul> 
      <li>step-1-create-a-new-application</li> 
      <li>step-2-change-title-and-style</li> 
      <li>step-3-heroes-component</li> 
      <li>step-4-hero-class</li> 
      <li>step-5-uppercase-pipe</li> 
      <li>step-6-edit-the-hero</li> 
      <li>step-7-list-of-heroes</li> 
      <li>step-8-master-detail</li> 
      <li>step-9-hero-detail-component</li> 
      <li>step-10-hero-service</li> 
      <li>step-11-observable-hero-service</li> 
      <li>step-12-message-service</li> 
      <li>step-13-app-routing-heroes-url</li> 
      <li>step-14-app-routing-heroes-link</li> 
      <li>step-15-dashboard-component-and-route</li> 
      <li>step-16-routable-hero-detail</li> 
      <li>step-17-detail-go-back</li> 
      <li>step-18-http-client (get many works but not get one)</li> 
      <li>step-19-error-handling (get many works but not get one)</li> 
      <li>step-20-http-get-one</li> 
      <li>step-21-hero-update</li> 
      <li>step-22-hero-add</li> 
      <li>step-23-hero-delete</li> 
      <li>step-24-search</li> 
      </ul> 
      <p>To see the angular code in action do the following:</p> 
      <ul> 
      <li>Install the angular cli</li> 
      <li>npm install -g @angular/cli</li> 
      </ul> 
      <p>Run the server</p> 
      <ul> 
      <li>ng serve</li> 
      </ul> 
      <p>Access the code at <a href="http://localhost:4200">http://localhost:4200</a></p>`,
    createdAt: "June 8, 2018"
  },
  {
    header: "Exercise Swagger APIs against WireMock",
    body: `<p>I have all APIs that are defined in Swagger Hub mocked on the WireMock server running on Heroku.</p>
      <p>To populate the APIs in WireMock you’ll need to run bash script I created to curl WireMock to create the mock APIs. Clone this github repo (<a href="https://github.com/gpratte/texastoc-v2-swagger-hub">https://github.com/gpratte/texastoc-v2-swagger-hub </a>) and run the create-api.sh bash script. You will also see the yml files for the APIs defined in Swagger Hub in this repo.</p>
      <p>The WireMock server running on Heroku gets torn down if there is no activity for a 30 minute period. Hence the bash script to create the mock APIs will need to be run each time the server is created by Heroku. You can tell when a server is created because the first call to Heroku takes 20 seconds or more and then subsequent calls take a second or less.</p>
      <p>The mock APIs do not verify the request but do return a valid response for all the APIs defined in Swagger Hub. The request verification will come later when it is time to test.</p>' +
      <p>So after populating the mock APIs in WireMock you can run any of the APIs in Swagger Hub.</p>`,
    createdAt: "June 3, 2018"
  },
  {
    header: "WireMock to mock APIs",
    body: `<p>If you have a need to mock APIs then WireMock to the rescue.</p>
      <p>See <a href="http://wiremock.org/">http://wiremock.org/ </a></p>
      <p>In the last blog I have defined APIs in swagger hub. Now I need a way to exercise those APIs. I’m very glad to have found WireMock.</p>
      <p>I followed the getting started guide to run WireMock locally (<a href="http://wiremock.org/docs/getting-started/">http://wiremock.org/docs/getting-started/ </a>). It must be a Spring Boot jar 🙂 </p>
      <p>I downloaded the standalone jar and ran it on port 9999.</p>
      <ul>
      <li>java -jar wiremock-standalone-2.18.0.jar –port 9999</li>
      </ul>
      <p>I then added a stub API</p>
      <ul>
      <li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request": { "method": "GET", "url": "/hello1" }, "response": { "body": "Hello world!" }}&apos;</li>
      </ul>
      <p>Exercise the stub</p>
      <ul>
      <li>curl http://localhost:9999/hello1</li>
      </ul>
      <p>Added a new stub to return a json body
      <ul>
      <li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request": { "method": "GET", "url": "/hello2" }, "response": { "jsonBody": {"Hello": "world!" }}}&apos;
      </ul>
      <p>Exercise the stub",
      <ul>
      <li>curl http://localhost:9999/hello2</li>",
      </ul>
      <p>To see all stub mappings",
      <ul>
      <li>curl http://localhost:9999/__admin/</li>",
      </ul>
      <p>See <a href="http://wiremock.org/docs/stubbing/">http://wiremock.org/docs/stubbing/</a> for more ways to stub.</p>
      <p>Shutdown the local server
      <ul>
      <li>curl -X POST http://localhost:9999/__admin/shutdown</li>
      </ul>",
      <p>Next I deployed the WireMock server to Heroku. You can too. See my github repo <a href="https://github.com/gpratte/wiremock-deploy-heroku">https://github.com/gpratte/wiremock-deploy-heroku</a></p>`,
    createdAt: "May 29, 2018"
  },
  {
    header: "APIs defined",
    body: `<p>I’ve made a first pass for the API definitions using Open API.</p>
      <p>What I did was look at my UI mockups (see previous Mockup blog entry) to determine what APIs the client needed. It was very helpful to think through the behavior of the system from the client point of view.</p>
      <p>The API definitions can be found on swagger hub at <a href="https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC">https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC</a></p>
      <p>This tutorial was key to learning version 2.0 of the Open API <a href="https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/">https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/</a></p>`,
    createdAt: "May 26, 2018"
  },
  {
    header: "Open API (swagger)",
    body: `<p>I’ve begun defining the APIs on swagger hub.</p>
      <p>Have a look <a href="https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC">https://app.swaggerhub.com/search?type=API&owner=texastoc&sort=NAME&order=ASC</a></p>`,
    createdAt: "May 24, 2018"
  },
  {
    header: "Finished with mockups",
    body: `<p>Finished with the bootstrap mockups.</p>
      <p>Normally I would dive into coding the backend but I’m going to start from a different point of view – the front end.</p>
      <p>While working at a company that created many a mobile application for the past several years I would be asked the same question repeatedly by the front end developers which is "how can I know what the back end APIs are and if they are doing the right thing?"</p>
      <p>Next is API documentation and testing from the front end point of view.</p>`,
    createdAt: "May 18, 2018"
  },
  {
    header: "Mockups",
    body: `<p>I’ve begun creating mockups using bootstrap (bootstrap 4 and font awesome 5).</p>
      <p>The files can be found in github at <a href="https://github.com/gpratte/texastoc-v2-wireframes">https://github.com/gpratte/texastoc-v2-wireframes</a></p>
      <p>Clone the repo, open index.html in a browser and click on the links.</p>`,
    createdAt: "May 13, 2018"
  },
  {
    header: "Next User Interface (mockups)",
    body: `<p>The next thing to do is to come up with the mockups for the web pages.</p>
      <p>I am not a UX nor a UI designer. In fact, I’m terrible at it. My artistic skills do not go beyond drawing stick men. I can get away with poor user experience because</p>
      <ul>
      <li>I’m working for free</li>
      <li>Only about 100 people will ever use the application.</li>
      </ul>
      <p>Bootstrap will go a long way to making my web pages look nice and work properly. It has some decent UI components (buttons, icons, …) and it is responsive so it will look good on different sized devices (mobile, tablet and laptop).</p>
      <p>Time for me to take a deep dive into Bootstrap 4.</p>`,
    createdAt: "May 1, 2018"
  },
  {
    header: "Agile Personas And Stories",
    body: `<p>A few months back I brought together several players and we had an agile discovery for the next version (v2) of the application.</p>
      <p>The players represented a good cross section of the personas of the users of the application.</p>
      <p>Lots of post-its which resulted in epics, which resulted in stories.</p>
      <p>I’m using Trello for managing the stories. In the past I deployed Jira to Heroku but decided that was overkill – Trello should be sufficient.</p>
      <p>Here’s a link to the Trello board before any development ...</p>
      <p><a href="https://trello.com/b/j1CmXjB4/texas-toc-v2">https://trello.com/b/j1CmXjB4/texas-toc-v2</a></p>
      <p>When the time come to start the first sprint I’ll copy the board which will keep a history.</p>`,
    createdAt: "April 30, 2018"
  },
  {
    header: "Refactor My Poker League Application",
    body: `<p>I play in a poker league. We play a 52 week season. The group has not missed a game in over 12 years (I joined 11 years ago). Presently I have a Java/Spring/MySQL/JQueryMobile application that I wrote in 2014.</p>
      <p>Time to blow the dust off the app and refactor to use up-to-date software. I use this as my reference application when interviewing (and I’ll be interviewing in later this year).</p>
      <p>Will be refactoring from Spring 3.x/MySQL/Velocity/JQueryMobile to Spring Boot 2.x/Postgres/Angular</p>
      <p>To see the running application visit <a href="https://www.texastoc.com">https://www.texastoc.com></a><p>
      <p>To see the source code visit <a href="https://github.com/gpratte/texastoc">https://github.com/gpratte/texastoc</a></p>
      <p>The app does thing like:</p>
      <ul>
      <li>Allows guest to view the site and obfuscates names and dollar amounts</li>
      <li>Add players to a game</li>
      <li>Mark players that finish in the top 10 of a game</li>
      <li>Calculates payouts in a game</li>
      <li>Randomly seat the players before each game and text players their table/seat</li>
      <li>Game clock for the rounds and text those who have opted in then a round changes</li>
      <li>Tracks seasons (games, quarterly seasons, season results, top ten lists)</li>
      <li>Emails asking for the weekly host</li>
      <li>Emails asking who will transport the supplies</li>
      <li>FAQ</li>
      <li>...</li>
      </ul>
      <p>It is time to refactor to</p>
      <ul>
      <li>Spring Boot for the backend</li>
      <li>Progressive web app using Angular for the front end</li>
      <li>Bootstrap for a nice HTML look and feel</li>
      <li>Many new features</li>
      </ul>`,
    createdAt: "April 29, 2018"
  },
  {
    header: "Hello",
    body: `<p>I am a software developer. My wheelhouse is backend development in Java/Spring. That being said I also<p>
      <ul>
      <li>write frontend code from time to time</li>
      <li>have professionally developed in assembler (Intel x86 processors), C, python and node.js</li>
      <ul>
      <p>I am going to rewrite from scratch the backend and the frontend for my personal application. But there is so much more to creating an application than writing code. There are things like: user stories; software architecture; UI mockups; testing; deployment; ...</p>
      <p>This blog will be documenting the journey of my rewriting my personal application.<p>`,
    createdAt: "April 28, 2018"
  }
]