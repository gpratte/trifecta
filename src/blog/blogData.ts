export type BlogData = {
  header: string;
  body: string;
  createdAt: string;
}

export const blogEntries: Array<BlogData> = [
  {
    header: "Upgrade Client and Server",
    body: `<p>December 26th 2023 deployed server and client upgrades for the <a href="http://www.texastoc.com">http://www.texastoc.com</a>  website.</p>
      <p>Server upgrade old <a href="https://github.com/gpratte/texastoc-v4-integration-testing">https://github.com/gpratte/texastoc-v4-integration-testing</a> to new <a href="https://github.com/gpratte/texastoc-server-v5">https://github.com/gpratte/texastoc-server-v5</a> </p>
      <p/>
      <ul>
        <li>upgrade from Java 11 to Java 17</li>
        <li>upgrade from SpringBoot 2.4.4 to 3.1.2</li>
        <li>renamed some database columns to avoid H2 reserved words</li>
      </ul>
      <p>Client upgrades old <a href="https://github.com/gpratte/texastoc-v4-client">https://github.com/gpratte/texastoc-v4-client</a>  to new <a href="https://github.com/gpratte/texastoc-client-v6">https://github.com/gpratte/texastoc-client-v6</a> </p>
      <p/>
      <ul>
        <li>upgrade from React 16.12.0 to 18.2.0</li>
        <li>moved from react classes to react functional components/hooks</li>
        <li>TypeScript</li>
        <li>using react state more so less dependent on redux</li>
        <li>show spinner when component loading</li>
        <li>vastly improved notification components</li>
        <li>persist access token in browser local storage to survive website reload</li>
        <li>using axios request interceptor to check expired token and set auth header</li>
        <li>fix linter problems</li>
      </ul>`,
    createdAt: "December 27, 2023"
  },
  {
    header: "Observability: Correlation Id, Logging and Exceptions",
    body: `<p>Now that there is chaos in the application (server side) the New Relic synthetic monitors are raising alerts. Also, the server is logging all the APIs requests/responses and all the module methods requests/responses. But what is missing is an identifier for each API call that can be used to find the associated log entries.</p>
      <p>A way to tie all the operations (and hence logging) for a request can be achieved using a correlation Id as describe in Rapid7’s blog The Value of Correlation IDs.</p>
      <p>For the API calls this is achieved using the Correlation-Id header and a server filter. The LoggingFilter class does this by looking for the correlation Id in the Correlation-Id header and, if missing, generating it and setting the header.</p>
      <p>Next LoggingAspect class finds the correlation Id and puts it in the Mapped Diagnostic Context (MDC)
"Mapped Diagnostic Contexts shine brightest within client server architectures. Typically, multiple clients will be served by multiple threads on the server. Although the methods in the MDC class are static, the diagnostic context is managed on a per thread basis, allowing each server thread to bear a distinct MDC stamp. MDC operations such as put() and get() affect only the MDC of the current thread, and the children of the current thread."</p>
      <p>Hence the correlation Id can be logged for all the operations that are used to fulfill the API request (and any errors that may occur).</p>
      <p>The server code was refactored to use an uber BLException. The salient fields are</p>
      <pre>public class BLException extends RuntimeException {
  private UUID correlationId;
  private String code;
  private String message;
  private ErrorDetails details;
  ...
}</pre>
      <p>Some examples of the code field are INVALID DATA and UNAUTHORIZED which are mapped to HTTP status HttpStatus.BAD_REQUEST and HttpStatus.FORBIDDEN.</p>`,
    createdAt: "December 27, 2021"
  },
  {
    header: "Observability: Chaos",
    body: `<p>In the previous blog I talked about setting up New Relic synthetics to monitor the application. Now it is time to introduce some chaos into the application which will allow me to check the monitors as the alerts are raised.</p>
      <p>I used <a href="https://en.wikipedia.org/wiki/Aspect-oriented_programming">Aspect-oriented Programming</a> (AOP) to implement the chaos. In the following class the @Before annotation allows the chaos code to run before all the public methods in the service package of each module. In truth the actual <a href="https://github.com/gpratte/texastoc-v4-integration-testing/blob/master/application/src/main/java/com/texastoc/common/ChaosAspect.java">ChaosAspect</a>  class is more complicated than the one that follows because the New Relic synthetic monitors try three times before raising an incident. Hence the ChaosAspect actually has some code to throw an exception thrice if so configured.</p>
      <pre>@Aspect
@Component
public class ChaosAspect {

  enum ExceptionType {
    RUNTIME_EXCEPTION,
    DENIED_EXCEPTION
  }

  private static final Random RANDOM = new Random();
  private final IntegrationTestingConfig integrationTestingConfig;

  public ChaosAspect(IntegrationTestingConfig integrationTestingConfig) {
    this.integrationTestingConfig = integrationTestingConfig;
  }

  @Before("execution(public * com.texastoc.module.*.service..*(..))")
  public void chaos(JoinPoint joinPoint) {
    if (!integrationTestingConfig.isAllowChaos()) {
      return;
    }
    if (RANDOM.nextInt(integrationTestingConfig.getChaosFrequency()) == 0) {
      // Time to cause some chaos. Randomly choose an exception type.
      ExceptionType exceptionType = ExceptionType.values()[RANDOM.nextInt(ExceptionType.values().length)];
      switch (exceptionType) {
        case RUNTIME_EXCEPTION:
          throw new RuntimeException("chaos");
        case DENIED_EXCEPTION:
          throw new BLException(BLType.DENIED);
        default:
          throw new RuntimeException("should never happen");
      }
    }
  }
}</pre>`,
    createdAt: "December 27, 2021"
  },
  {
    header: "Observability: Synthetic Monitoring",
    body: `<p>Since I have done the work to hook up New Relic to monitor my application it is time to flesh out the monitoring using synthetics.</p>
      <p>"New Relic’s synthetic monitoring simulates user traffic around the world so you can detect and resolve poor performance and outages before your customers notice. Use our suite of automated, scriptable tools to monitor your external and internal websites, critical business transactions, and API endpoints."</p>
      <p>I configured</p>
      <p/>
      <ul>
        <li>a Simple Browser monitor that checks if the web home page loads.</li>
        <li>a Ping monitor that calls an API that does not require authentication.</li>
        <li>a Scripted Browser monitor that logs into the application and navigates to the page that shows the current seasons.</li>
      </ul>
      <p>I then configure alerts for the synthetic monitors so that New Relic will create an incident when a monitor fails. Viewing an incident is very helpful in determining what went wrong in my application (e.g. what API call failed).</p>
      <p>At this point the only way I could cause the monitors to fail is to bring down the server. In the next blog I will talk about how I introduced chaos into the application.</p>
      <p>Here is the synthetic script for the Scripted Browser monitor…</p>
      <pre>$browser.get("https://test.texastoc.com").then(function(){
  return $browser.findElement($driver.By.id("emailId")).sendKeys($secure.GUEST_USERNAME);
}).then(function(){
  return $browser.findElement($driver.By.id("passwordId")).sendKeys($secure.GUEST_PASSWORD);
}).then(function(){
  return $browser.findElement($driver.By.id("loginSubmitId")).click();
});

$browser.wait(function() {
  return $browser.getCurrentUrl().then(function(url) {
    return url.indexOf("home") > 0;
  });
}, 1000);

$browser.findElement($driver.By.id("currentSeasonId")).click();

$browser.wait(function() {
  return $browser.getCurrentUrl().then(function(url) {
    return url.indexOf("season") > 0;
  });
}, 1000);</pre>`,
    createdAt: "December 27, 2021"
  },
  {
    header: "Observability: New Relic Server Integration",
    body: `<p>Application Performance Monitoring (APM) is fundamental not only to understanding the health of an application but also provides visibility to application problems. New Relic provides an APM platform (and it’s free for one application).</p>
      <p>I followed the Install New Relic Java agent for Docker instructions.</p>
      <p>Downloaded the newrelic-java.zip to the source code in a /third-party directory and unzipped it. When building the docker image copy the third-party/newrelic-java directory. Start the server application with the -javaagent argument.</p>
      <pre>FROM adoptopenjdk/openjdk11:latest
EXPOSE 8080
COPY application/target/texastoc-v4-application-1.0.0.jar /application/
ADD third-party/newrelic-java /application/
ENTRYPOINT ["java"]
CMD [ \\
    "-javaagent:/application/newrelic/newrelic.jar", \\
    "-jar", \\
    "/application/texastoc-v4-application-1.0.0.jar" \\
]</pre>
      <p>Bring up the docker container with the New Relic environment variables. Also mount the directories to expose the New Relic logs and the application (i.e. texastoc) logs. Here’s a snippet of the docker-compose file</p>
      <pre>server:
  ...
  environment:
    NEW_RELIC_LICENSE_KEY: <key>
    NEW_RELIC_APP_NAME: "test.texastoc.com"
    ...
  ports:
    - 8080:8080
  volumes:
    - '/home/administrator/logs/newrelic:/application/newrelic/logs'
    - '/home/administrator/logs/texastoc:/logs/texastoc'
  ...</pre>
      <p>I followed the <a href="https://docs.newrelic.com/docs/infrastructure/install-infrastructure-agent/linux-installation/install-infrastructure-monitoring-agent-linux/">Quick Start</a> guided install from in Install the infrastructure monitoring agent for Linux.</p>`,
    createdAt: "October 24, 2021"
  },
  {
    header: "NGINX Fronting the texastoc Application",
    body: `<p>In the not too distance past</p>
      <p/>
      <ul>
        <li>the backend was being deployed to a Tomcat webserver as a war</li>
        <li>the database was running in a MySQL server</li>
        <li>the React frontend was also being deployed to Tomcat as a war (oh the shame)</li>
        <li>Tomcat was configured to set the cache headers for index.html</li>
        <li>Tomcat was configured for SSL termination</li>
      </ul>
      <p>In this post I shine a light on how I used NGINX on the test server (test.texastoc.com) to</p>
      <p/>
      <ul>
        <li>serve up the frontend as a file server</li>
        <li>reverse proxy to the backend</li>
        <li>set the cache headers on index.html</li>
        <li>SSL termination</li>
        <li>redirect HTTP to HTTPS</li>
      </ul>
      <p>The rest of this post assumes you have done the following on your linux server</p>
      <p/>
      <ul>
        <li>installed docker and docker-compose</li>
        <li>have the Spring Boot backend and MySQL running in docker (see last blog)</li>
        <li>installed NGINX</li>
      </ul>
      <p>This is the NGINX config file to the texastoc application</p>
      <pre>worker_processes  1;
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;
events {
  worker_connections  1024;
}
http {
  include       mime.types;
  default_type  application/octet-stream;
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  '$status $body_bytes_sent "$http_referer" '
  '"$http_user_agent" "$http_x_forwarded_for"';
  access_log  logs/access.log  main;
  sendfile        on;
  keepalive_timeout  65;

# HTTP server
  server {
    listen 80;
    server_name test.texastoc.com www.test.texastoc.com;
    location /api {
      default_type application/json;
      return 403 '{"error": "Cannot access apis via http"}';
    }
    location / {
      return 301 https://test.texastoc.com$request_uri;
    }
  }
# HTTPS server
  server {
    listen       443 ssl;
    server_name  test.texastoc.com www.test.texastoc.com;
    ssl_certificate      cert.pem;
    ssl_certificate_key  privkey.pem;
    ssl_protocols        TLSv1 TLSv1.1 TLSv1.2;
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;
    location /api {
      proxy_pass http://localhost:8080;
    }
    location / {
      root   /home/administrator/build;
      index  index.html index.htm;
      if ( $uri = '/index.html' ) {
        add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";
      }
      try_files $uri $uri/ /index.html;
    }
  }
  include servers/*;
}</pre>
      <p>Let’s start with the HTTPS server.</p>
      <p>The domain names accepted are: <b>test.texastoc.com</b> and <b>www.test.texastoc.com</b> as you can see by the following:
        <br><pre>server_name  test.texastoc.com www.test.texastoc.com;</pre></p>
      <p>The certificates were generated using <a href="https://letsencrypt.org/">Let’s Ecrypt</a> and configured with the lines beginning with <pre>ssl_</pre></p>
      <p>The reverse proxy to the backend is configured as follows since all requests to the backend endpoints start with /api</p>
      <pre>location /api {
    proxy_pass http://localhost:8080;
}</pre>
      <p>The react app can be found <a href="https://github.com/gpratte/texastoc-v4-client">here</a>. It was built for the test server using the follwing command and copied to /home/administrator/build.
      <br>npm run build:testtexastoc
      <p>NGINX serves up the React front as follows</p>
      <pre>location / {
    root   /home/administrator/build;
    index  index.html index.htm;
    if ( $uri = '/index.html' ) {
      add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0";
    }
    try_files $uri $uri/ /index.html;
}</pre>
      <p>The <b>if</b> statement sets the cache headers for index.html. We do not want index.html to be cached so any future deployment will pick up the new javascript files that are
defined in index.html.</p>
      <p>The <b>try_files</b> helps avoid 404 Not Found HTTP errors when using react router. Just google "nginx react router" and you will see why.</p>
      <p>The HTTP server redirects all the requests to HTTPS except the calls to end backend endpoints which start with /api. The backend calls return a 403 HTTP error.</p>`,
    createdAt: "August 26, 2021"
  },
  {
    header: "Spring Boot Docker Container with MySQL",
    body: `<p>The last blog showed how to run MySQL in a docker container and initialize the database (root user password, create an application user with a password and create the application database.)</p>
      <p>The blog before that showed how to run the Spring Boot application in a docker container with an in-memory H2 database.</p>
      <p>Time to marry the two and run the Spring Boot application in one container and have that access MySQL in another container. Hence this blog will assume you have read (and hopefully played along) with the previous two blogs.</p>
      <p>This post will assume that you are in a terminal in the /Users/<yourname>/texastoc-v4-integration-testing-master directory. Of course substitute the correct value for <yourname>. If running on Windows adjust the path accordingly.</p>
      <p>Much of what follows can be found in the README for the texastoc application.</p>
      <p>At the root of the project you will see a docker-compose-server-mysql.yml file. To use this docker compose file you need to ...</p>
      <p>1. Build the texastoc application so that is will use the MySQL database.
            <br>mvn -P mysql -pl application clean package</p>
      <p>2. Build the docker image
            <br>docker build -t texastoc-v4-mysql-image .</p>
      <p>Before starting the docker containers there are a few things to point out. Have a look at the environment variables that are set in the docker-compose-server-mysql.yml file</p>
      <pre>"db": {
  "h2": false,
  "mysql": true,
  "schema": true,
  "seed": true,
  "populate": true
}</pre>
      <p>The runtime of texastoc application looks for these variables and acts accordingly. These are the environment variable we want the first time we bring up the application server because the schema, seed and populate variable will add a season, game and players to the database. The schema, seed and populate environment variable should be removed when bringing up the docker containers in the future.</p>
      <p>The MySQL database connection environment variables are</p>
      <pre>"mysql": {
  "url": "jdbc:mysql://db:3306/toc?allowPublicKeyRetrieval=true&useSSL=false",
  "password": "tocuserpw"
}</pre>
      <p>First I must say that it’s bad form to put passwords in configuration files. I’ll be moving these to some external "vault" like product.</p>
      <p>Next the "db" in "jdbc:mysql://<b>db</b>:3306/toc…" is an docker internal hostname to the MySQL container</p>
      <pre>services:
  db:
    ...
</pre>
      <p>Lastly the application container depends on the MySQL container. Hence MySQL will be up before starting the application server.</p>
      <pre>server:
  container_name: server
  ...
  depends_on:
    - db</pre>
      <p>3. Start the docker container
        <br>docker-compose -f docker-compose-server-mysql.yml up -d</p>
      <p>4. View the log of the texastoc application
         <br>docker logs -f server</p>
      <p>5. Stop tailing the docker logs by holding the control key and then pressing control c
        <br>&lt;cntrl&gt;c</p>
      <p>6. Test by hitting one of the APIs.
        <br>curl http://localhost:8080/api/v4/settings</p>
      <p>7. Stop the docker container
        <br>docker-compose -f docker-compose-server-h2.yml down</p>`,
    createdAt: "August 24, 2021"
  },
  {
    header: "MySQL Docker Container",
    body: `<p>The texastoc Spring Boot server uses a MySQL database in the production deployment. Let’s see how to set it up with an admin user, an application user and the application database.</p>
      <p>The vanilla MySQL docker container will write to its ephemeral filesystem which means when the container goes away so do the database files. Hence it is very important to mount the filesystem of the system running the docker container to store the database files. We’ll also have to set the root password and create the database for the texastoc application.</p>
      <p>Some of the steps from the last blog will be repeated in case you are reading this without reading that.</p>
      <p>Get the <a href="https://github.com/gpratte/texastoc-v4-integration-testing">https://github.com/gpratte/texastoc-v4-integration-testing</a>  Spring Boot application. Download the zip and unzip it. For the remainder of this article let’s assume you have the unzipped code in /Users/<yourname>/texastoc-v4-integration-testing-master directory and you are in a terminal in that directory. Of course substitute the correct value for <yourname>. If running on Windows adjust the path accordingly.</p>
      <p>In the root of the /Users/<yourname>/texastoc-v4-integration-testing-master directory you will see a docker-compose-mysql.yml file. Notice the
        <br><pre>volumes:
- './data:/var/lib/mysql'</pre>
        <br>When the MySQL docker container starts up it will mount ./data directory of the local filesystem. The database files that MySQL writes to /var/lib/mysql will, in actuality, be written to the ./data directory instead.
      </p>
      <p>In the terminal create a directory for the MySQL database files.
        <br>mkdir data</p>
      <p>When docker starts it looks to see if there is ANYTHING in the local volume
(./data). Only if the directory is empty, which it is at the moment, will it initialize the database files and set the root password to ‘secret’ (which we configured in docker-compose-mysql.yml). Subsequent instantiations of the MySQL docker container will see the database files and use them.</p>
      <p>Let’s run the docker-compose-mysql.yml file so that MySQL initializes the database.
        <br>docker-compose -f docker-compose-mysql.yml up -d</p>
      <p>View the log of the MySQL server
        <br>docker logs db</p>
      <p>The following assumes you have a MySQL client installed.</p>
      <pre>mysql -h 127.0.0.1 -P 3306 -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootpass';
CREATE USER 'tocuser'@'%' IDENTIFIED BY 'tocpass';
GRANT ALL PRIVILEGES ON * . * TO 'tocuser'@'%';
FLUSH PRIVILEGES;
quit;
mysql -h 127.0.0.1 -P 3306 -u tocuser -p
create database toc;
quit;</pre>
      <p>Stop the container
        <br>docker-compose -f docker-compose-mysql.yml down</p>`,
    createdAt: "August 24, 2021"
  },
  {
    header: "Spring Boot Docker Container (H2 in-memory database)",
    body: `<p>Go back to before April 2014 when Spring Boot was released. The way a Spring application was deployed was to build a WAR file and deploy that to a web server (e.g. Tomcat). That was how the texastoc backend was being deployed.</p>
      <p>It is time to move the texastoc Spring Boot application to a docker container. You can play along or just read the following instructions.</p>
      <p>The journey begins by installing Docker for Desktop (my development system is a mac book pro).</p>
      <p>Get the <a href="https://github.com/gpratte/texastoc-v4-integration-testing">https://github.com/gpratte/texastoc-v4-integration-testing</a>  Spring Boot application. Download the zip and unzip it. For the remainder of this article let’s assume you have the unzipped code in /Users/<yourname>/texastoc-v4-integration-testing-master directory and you are in a terminal in that directory. Of course substitute the correct value for <yourname>. If running on Windows adjust the path accordingly.</p>
      <p>Much of what follows can be found in the README for the texastoc application.</p>
      <p>The texastoc application has been developed so that it can use an in-memory H2 database. At the root of the project you will see a docker-compose-server-h2.yml file. To use this docker compose file you need to</p>
      <p>1. Build the texastoc application so that is will use the H2 database.
        <br>mvn -P h2 -pl application clean package</p>
      <p>2. Build the docker image from the Dockerfile that can be found in the root of the project. The Dockerfile is configured to use AdoptOpenJDK 11, exposes port 8080 and runs Spring Boot as a jar file.
        <br>docker build -t texastoc-v4-h2-image .</p>
      <p>3. Start the docker container
        <br>docker-compose -f docker-compose-server-h2.yml up -d</p>
      <p>Take note of the environment variables that are set in the docker-compose-server-h2.yml file</p>
      <pre>"h2": true,
"mysql": false,
"schema": true,
"seed": true,
"populate": true</pre>
      <p>The runtime of texastoc application looks for these variables and acts accordingly. In this case the runtime will use the H2 database connection, create the database schema, seed the database and run the population code that will create a season, players and games.</p>
      <p>4. View the log of the texastoc application
        <br>docker logs -f server</p>
      <p>5. Stop tailing the docker logs by holding the control key and then pressing control c
        <br>&lt;cntrl&gt;c</p>
      <p>6. Test by hitting one of the APIs.
        <br>curl http://localhost:8080/api/v4/settings</p>
      <p>7. Stop the docker container
        <br>docker-compose -f docker-compose-server-h2.yml down</p>`,
    createdAt: "August 22, 2021"
  },
  {
    header: "Version 4: Refactor Cucumber Integration Tests to JUnit",
    body: `<p>The integration tests are tests that exercise the server endpoints. The last version (v3) has these tests written as cucumber tests. The gherkin language for defining scenarios is very nice in that different stakeholder can understand and contribute to the tests.</p>
      <p>Here is an example of one of the scenarios for a player test</p>
      <pre>Scenario: Get players
  Given a new player
  Given another new player
  When the players are retrieved
  Then the players match</pre>
      <p>The problem I was having time and again was getting the cucumber tests to run individually. Time and time again I found myself digging through documentation to see why it stopped working.</p>
      <p>For version 4 of the texastoc server I am refactoring the cucumber tests to JUnit. Here is what the scenario above looks like as a JUnit test.</p>
      <pre>// Scenario Get players
@Test
public void createMultipleAndGet() throws Exception {
  // Given
  newPlayer();
  // Given
  anotherNewPlayer();
  // When
  getPlayers();
  // Then
  thePlayersMatch();
}</pre>
      <p>With comments it is close enough to the gherkin scenario that other stakeholder can understand it.</p>`,
    createdAt: "May 23, 2021"
  },
  {
    header: "Version 3 is Live So What’s Next",
    body: `<p>The modular monolith for texastoc.com version 3 is live! See <a href="https://texastoc.herokuapp.com/">https://texastoc.herokuapp.com/</a>. Note that, since it is deployed to Heroku, it may take a minute for Heroku to provision the frontend server you first hit the website. So the frontend web page can take a minute to load. Then when you log in the backend can take another minute. When the backend comes up it seeds a season and games which can also take a minute.</p>
      <p>Although the code base is a modular monolith it still suffers from having all the modules in a single code base. That means if, after a deployment, one module has to roll back all the modules will roll back.</p>
      <p>To remedy this I’ll be breaking the modules into their own code repositories. The server will continue to be a single war for deployment. Each repository will be able to build a deployable server to use for integration tests.</p>
      <p>The big win to moving to separate repositories is that the deployable server will be able to use different versions of the modules. This addresses the problem of being able to roll back a module.</p>
      <p>There will be a lot of devops work for configuring the builds for multiple repositories. I’ll do some investigation to see if moving from maven to gradle will help.</p>`,
    createdAt: "May 3, 2021"
  },
  {
    header: "Independent Chip Model: ICM Calculator",
    body: `<p></p>
      <p>Sometimes the players in a poker tournament will chop the pot instead of playing to end where one player takes first place. My current algorithm for chopping the money is home grown. I decided it is time to change to an official ICM algorithm.</p>
      <p>In this day and age of open source software I thought I would easily find one or more solutions. But alas this is not to be. I could not find a single solution written in any language. Not Java, Python, Javascript, ... .</p>
      <p>I am not going to explain how ICM works – do a Google search and you will get lots of hits. Since I could not find any code I figured I would code it myself. What I needed was a good mathematical explanation. Helps that I got my undergraduate degree in Math 🙂</p>
      <p>I found an article from the Journal of the Mathematical Society of the Philippines which has an equation for the Malmuth-Harville equation in section 2.2 that I used for my algorithm. See  <a href="http://mathsociety.ph/matimyas/images/vol43/MarfilMatimyas.pdf">http://mathsociety.ph/matimyas/images/vol43/MarfilMatimyas.pdf.</a></p>
      <p>As I mentioned, mine is an implementation of the Malmuth-Harville equation. I also used Heap’s algorithm for generating permutations of a list numbers. See <a href="https://en.wikipedia.org/wiki/Heap%27s_algorithm">https://en.wikipedia.org/wiki/Heap%27s_algorithm</a> .</p>
      <p>So for those of you that need an ICM implementation (mine is written in Java) you can find one at  <a href="https://github.com/gpratte/icm-calculator">https://github.com/gpratte/icm-calculator</a>. The code is documented with comments that I hope will explain who it works.</p>
`,
    createdAt: "February 2, 2021"
  },
  {
    header: "Spring Data JDBC Example",
    body: `<p>In a previous blog I stated that I refactored from using Spring JDBC to Spring Data JDBC. Spring Data JDBC is an Object-Relational Mapping (ORM) framework.</p>
      <p>To fully get my head around how to use Spring Data JDBC I created a small project that mapped the following fields</p>
      <pre>@Id
private int id;

private int count;

@MappedCollection(idColumn = "ID")
OneToOne oneToOne;

@MappedCollection
Set&lt;Day&gt; days;

@MappedCollection
Map&lt;String, Color&gt; colors;

@MappedCollection
List&lt;Car&gt; cars;

@MappedCollection
List&lt;Orderr&gt; orders;</pre>
      <p>You can find the code at <a href="https://github.com/gpratte/spring-data-jdbc-example">https://github.com/gpratte/spring-data-jdbc-example</a> .</p>
`,
    createdAt: "December 31, 2020"
  },
  {
    header: "Monolith to Modular Monolith: Cucumber Integration Testing",
    body: `<p></p>
      <p>I resurrected and enhanced the cucumber integration tests for the player module. I first uncommented the integration module in the top level pom.xml</p>
      <pre>&lt;modules&gt;
  &lt;module&gt;application&lt;/module&gt;
  &lt;module&gt;integration&lt;/module&gt;
&lt;/modules&gt;</pre>
      <p>Updated the cucumber version from 2.3.1 to 6.9.1.</p>
      <p>Here is an example of one of the test scenarios</p>
      <pre>Scenario: Update player as admin
  An admin updates another player
  Given a new player
  When the admin updates the player
  And the player is retrieved
  Then the updated player matches</pre>
      <p>Removed the @SpringBootTest annotation because that annotation was starting the Spring Boot application every time a test was run (which was slowing things down quite a bit). Instead I start the server from as a separate process and kept the server running.</p>`,
    createdAt: "December 29, 2020"
  },
  {
    header: "Monolith to Modular Monolith: ArchUnit",
    body: `<p>I added ArchUnit (<a href="https://www.archunit.org">https://www.archunit.org</a>) to be able to write unit tests to enforce module separation.</p>
      <p>In my previous blog I created the PlayerModule interface for the player module. The other modules should only use the PlayerFactory to get a concrete instance of the PlayerModule interface. The APIs in the PlayerModule reference classes in the player.model directory.</p>
      <p>Hence other modules should be able to access the top level package of the player module to get to the factory and interface and the player.model package. Put another way, other modules should not have access to the sub-packages of the player module except player.model.</p>
      <p>My unit test is</p>
      <pre>/**
 * Make sure the non-player modules (game, notification, season and supply) do not
 * access any classes in the player.exception, player.repository and player.service
 * packages.
 */
@Test
public void playerModuleInterfaceAndModel() {
  JavaClasses importedClasses = new ClassFileImporter().importPackages("com.texastoc.module");

  noClasses().that().resideInAnyPackage("..game..", "..notification..", "..season..", "..supply..")
    .should().dependOnClassesThat()
    .resideInAnyPackage("..player.exception..", "..player.repository..", "..player.service..")
    .check(importedClasses);
}</pre>
      <p>See branch 14-arch-unit <a href="https://github.com/gpratte/texastoc-v3-modulith/tree/14-arch-unit">https://github.com/gpratte/texastoc-v3-modulith/tree/14-arch-unit</a>.</p>`,
    createdAt: "December 26, 2020"
  },
  {
    header: "Monolith to Modular Monolith: Module Interface",
    body: `<p>I exposed an interface (PlayerModule) that defines all the APIs made available by the player module. I also exposed a factory (PlayerModuleFactory) that other modules can use to get a concrete implementation of the PlayerModule.</p>
      <p>There are two classes that implement the interface – PlayerService (which is the concrete class returned by the factory) and the PlayerRestController. That way all entries into the player module will use the same API.</p>
      <p>See branch 12-player-module-interface <a href="https://github.com/gpratte/texastoc-v3-modulith/tree/12-player-module-interface">https://github.com/gpratte/texastoc-v3-modulith/tree/12-player-module-interface</a> .</p>
      <p>I also resurrected and beefed up the unit tests. See branch 13-player-module-unit-tests <a href="https://github.com/gpratte/texastoc-v3-modulith/tree/13-player-module-unit-tests">https://github.com/gpratte/texastoc-v3-modulith/tree/13-player-module-unit-tests</a> .</p>`,
    createdAt: "December 26, 2020"
  },
  {
    header: "Monolith to Modular Monolith: Spring Data JDBC",
    body: `<p>Oh glorious day! I’ve refactored one of the repositories from using Spring’s JdbcTemplate to Spring Data JDBC <a href="https://spring.io/projects/spring-data-jdbc">https://spring.io/projects/spring-data-jdbc</a> .</p>
      <p>2004 saw the birth of this texastoc application. Because I abhor JPA (hibernate) I have been using the Spring’s JdbcTemplate for persisting to a relational database. By moving the PlayerRepository to Spring Data JDBC the lines of code count went from 156 to 12. I was also able to remove the RoleRepository.</p>
      <p>Spring Data JDBC is an opinionated ORM that works on an aggregate (<a href="https://martinfowler.com/bliki/DDD_Aggregate.html">https://martinfowler.com/bliki/DDD_Aggregate.html</a>).</p>
      <p>To bring Spring Data JDBC into the project I first updated the latest version, 2.4.1, of Spring Boot.</p>
      <pre><parent>
  ...
  &lt;version&gt;2.4.1&lt;/version&gt;
  ...
</parent></pre>
      <p>I refactored the player and role tables and Player and Role classes to be an aggregate. This entailed adding a foreign key field to the role table and an @Id to both classes. It also entailed moving the player’s role from a many-to-many relationship to a one-to-many. It was quite simple actually and the resulting player’s roles in the Player class now looks like the following ...</p>
      <pre>public class Player implements Comparable<Player> {
  ...
  @Id
  private int id;
  ...
  @MappedCollection
  private Set roles;
  ...
}</pre>
      <p>I also refactored the PlayerRepository to be a Spring Data interface as follows</p>
      <pre>public interface PlayerRepository extends CrudRepository</pre>
      <p>Have a look at the 11-spring-data-jdbc branch to see the result. You can always compare it to the previous branch, 10-notification-package, to see the before and after.</p>
      <p>Just be aware that you will also see some extraneous changes when comparing branches to the CORS configuration that was needed with the new version of Spring Boot which has nothing to do with migrating to Spring Data JDBC.</p>`,
    createdAt: "December 22, 2020"
  },
  {
    header: "Monolith to Modular Monolith: Packaging",
    body: `<p></p>
      <p>Ten branches later and I have refactored the package structure to support a modular monolith.</p>
      <pre>── com
     └── texastoc
         ├── config
         ├── exception
         ├── module
         │   ├── game
         │   ├── notification
         │   ├── player
         │   ├── season
         │   ├── settings
         │   └── supply
         └── security</pre>
      <b>config</b>, <b>exception</b>, and <b>security</b> are shared by all modules.</p>
      <p>If the modules were to be broken out into microservices then the config and exception packages would be duplicated for each microservice. Also security would need to be reworked. One of the pros of a monolith is that security is done once and shared by the entire application.</p>`,
    createdAt: "December 21, 2020"
  },
  {
    header: "Monolith to Modular Monolith: Exception Handling",
    body: `<p>My Spring Boot monolith had all the exceptions in a common package. It also has one class, RestControllerAdvise, with the @ControllerAdvice annotation to handle all the REST exceptions.</p>
      <p>I moved the module specific exceptions into the appropriate module (e.g. moved CannotDeletePlayerException) into the player module.</p>
      <p>I also moved the module specific exception handling (e.g. @ExceptionHandler(value = {CannotDeletePlayerException.class})) into the module controller.</p>
      <p>I still have some common exceptions and I still have the RestControllerAdvise to handle common exceptions (e.g. NullPointerException).</p>`,
    createdAt: "December 21, 2020"
  },
  {
    header: "Refactor to a Modular Monolith",
    body: `<p>The server I built for the texastoc poker league is a Spring Boot application. See
<a href="https://github.com/gpratte/texastoc-v2-spring-boot">https://github.com/gpratte/texastoc-v2-spring-boot</a></p>
      <p>It is monolith that employs a Layered Architecture:
         <br>Controller -> Service -> Repository</p>
      <p>The Controller layer receives REST requests which it passes on to the Service layer. The Service layer houses the business logic. The Repository layer houses the persistence.</p>
      <p>The Layered Architecture is the cause of many a <b>ball of mud</b>.</p>
      <p>It is time to refactor the code into a Modular Monolith (a.k.a. a Modulith). Here is a good series of articles on the subject <a href="https://www.kamilgrzybek.com/design/modular-monolith-primer/">https://www.kamilgrzybek.com/design/modular-monolith-primer/</a></p>
      <p>The new github repository for the Modulith can be found at <a href="https://github.com/gpratte/texastoc-v3-modulith">https://github.com/gpratte/texastoc-v3-modulith</a></p>
      <p>The modules will be <b>player</b>, <b>game</b>, <b>season</b>, <b>historical season</b>, <b>settings</b> and <b>notification</b>.</p>
      <p>The first branch of the modulith, 01-fork-texastoc-v2, is the fork of the monolith.</p>
      <p>The second branch, 02-game-package, moved the game related classes into the new com.texastoc.game package.</p>
      <p>Moving classes does not make a modular monolith. More on how that will be achieved in future blogs.</p>`,
    createdAt: "December 20, 2020"
  },
  {
    header: "Velocity Template for Game Summary Email Body",
    body: `<p>Before this blog I had some ugly code that would create the html for the game summary email body. Here’s a snippet ...</p>
      <pre>sb.append("&lt;td colspan=\\"2\\"&gt;Season games " + game.getSeasonGameNum() + "&lt;/td&gt;");</pre>
      <p>I moved to using velocity templates. See <a href="https://velocity.apache.org/">https://velocity.apache.org/</a>. Here’s a snippet ...</p>
      <pre>&lt;tr&gt;
  &lt;td&gt;Season game&lt;/td&gt;
  &lt;td&gt;$game.seasonGameNum&lt;/td&gt;
&lt;/tr&gt;</pre>
      <p>In my Spring Boot project I added this dependency ...</p>
      <pre><dependency>
  <groupId>org.apache.velocity</groupId>
  <artifactId>velocity</artifactId>
  <version>1.7</version>
</dependency></pre>
      <p>Note that I did NOT add the velocity-tools dependency which you may see in other write-ups.</p>
      <p>I configured the velocity engine in my code ...</p>
      <pre>private static final VelocityEngine VELOCITY_ENGINE = new VelocityEngine();
static {
  VELOCITY_ENGINE.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
  VELOCITY_ENGINE.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
  VELOCITY_ENGINE.init();
}</pre>
      <p>I added a game-summary.vm velocity template in the src/main/resources directory. I was able to load the template, add Java objects to the context and run the template engine to get my resulting html file like so ...</p>
      <pre>private String getGameSummaryFromTemplate(Game game) {
  Template t = VELOCITY_ENGINE.getTemplate("game-summary.vm");
  VelocityContext context = new VelocityContext();
  context.put("game", game);
  ...
  StringWriter writer = new StringWriter();
  t.merge(context, writer);
  return writer.toString();
}</pre>
      <p>You can see the code at <a href="https://github.com/gpratte/texastoc-v2-spring-boot/tree/81-better-template-context">https://github.com/gpratte/texastoc-v2-spring-boot/tree/81-better-template-context</a></p>`,
    createdAt: "November 27, 2020"
  },
  {
    header: "CICD",
    body: `<p>Earlier I blogged about using Travis for Continuous Integration (CI). See <a href="https://fullstacksoftwareblog.wordpress.com/2020/02/16/travis-ci/">https://fullstacksoftwareblog.wordpress.com/2020/02/16/travis-ci/</a></p>
      <p>But CI is only only half the story for Continuous Integration and Continuous Deployment (CICD). Time to deploy the back end server and front end servers to <a href="https://www.heroku.com/">Heroku</a>.</p>
      <p>For both the back end and front end I changed the pom.xml <b>default</b> profile to build a war that can be run stand alone when deployed to Heroku. For the back end that means it uses the embedded H2 database with seed data. For the front end that means the url for the UI and for the server point to the Heroku deployments</p>
      <p/>
      <ul>
        <li>Front end: <a href="https://texastoc.herokuapp.com">https://texastoc.herokuapp.com</a></li>
        <li>Back end: <a href="https://texastoc-server.herokuapp.com">https://texastoc-server.herokuapp.com</a></li>
      </ul>
      <p>I also update both pom.xml files to use the Heroku war plugin that runs with the webapp-runner which is a jar that has a tomcat server that a war can be deployed to. See <a href="https://devcenter.heroku.com/articles/java-webapp-runner">https://devcenter.heroku.com/articles/java-webapp-runner</a></p>
      <p>I updated the travis yaml config file (.travis.yml) to deploy to heroku. See <a href="https://docs.travis-ci.com/user/deployment/heroku/">https://docs.travis-ci.com/user/deployment/heroku/</a>. Here’s the UI configuration</p>
      <pre>deploy:
  provider: heroku
  api_key:
    secure: <encrypted key>
  app:
    master: texastoc
  skip_cleanup: true
  run:
    - restart</pre>
      <p>Now when code is push to master (either directly or from a pull request) the war will be built and deploy to Heroku (assuming no failed tests).</p>
`,
    createdAt: "June 21, 2020"
  },
  {
    header: "WebSocket",
    body: `<p>While developing V2.0 I attempted to wire up WebSockets to push the clock values from the server to the client. I got an older version of a JavaScript library to receive the clock data from the server. I was unable to get a more modern WebSockets connection (all browsers now support WebSockets and they all have a WebSocket object) to work.</p>
      <p>Because I had a deadline of May 1st for the new version to go live I abandoned the WebSocket and implements polling for the clock changes (and polling for the changes).</p>
      <p>Now that the code is live I resurrected the client WebSocket work. The library in my package.json is "stompjs": "^2.3.3"</p>
      <p>Coding the client to connect to the WebSocket and receive data is fairly straight forward. But I had to add code to check the health of the WebSocket and to attempt to reconnect if not healthy. The health check is on a 10 second timer. If the WebSocket is not healthy the client makes an API call to get the clock data as well as trying to reestablish the WebSocket connection.</p>
      <p>You can find the client code for the WebSocket for the clock at <a href="https://github.com/gpratte/texastoc-v2-react-redux/blob/master/src/current-game/components/ClockWebSocket.jsx">https://github.com/gpratte/texastoc-v2-react-redux/blob/master/src/current-game/components/ClockWebSocket.jsx</a></p>
      <p>The Spring support in the server was super easy – include a dependency, and annotation and a send the clock data using a SimpMessagingTemplate. The server code to configure the WebSocket can be found at <a href="https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/application/src/main/java/com/texastoc/config/WebSocketConfig.java">https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/application/src/main/java/com/texastoc/config/WebSocketConfig.java</a></p>
      <p>The server code to send the data on the WebSocket can found at <a href="https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/application/src/main/java/com/texastoc/connector/WebSocketConnector.java">https://github.com/gpratte/texastoc-v2-spring-boot/blob/master/application/src/main/java/com/texastoc/connector/WebSocketConnector.java</a></p>`,
    createdAt: "May 30, 2020"
  },
  {
    header: "Lesson Learned About Caching the UI",
    body: `<p>Here is the biggest lesson learned regarding a deploying a Single Page Application (<a href="https://en.wikipedia.org/wiki/Single-page_application">https://en.wikipedia.org/wiki/Single-page_application</a>) – make sure index.html is not cached!!!</p>
      <p>When I first deployed my React application I did not set the caching for index.html to none/zero/nada. Subsequent deployments of my application are ignored by the browser because it has already cached index.html and hence no need to get it again.</p>
      <p>This means the client has to either 1. force the browser to get the lastest (control R on Windows/Linux or Command R on Mac) or 2. clear the browser cache.</p>
      <p>About a week after going live I configured my Tomcat server so that index.html will not be cached. Unfortunately I don’t know how long until original index.html cache will time out.</p>
      <p>BIG lesson learned.</p>`,
    createdAt: "May 25, 2020"
  },
  {
    header: "Version 2.0 What’s Next",
    body: `<p>What’s next for texastoc version 2.0?</p>
      <p>As I mentioned in a previous blog today, 2.0 is a Minimal Viable Product (MVP). There are a lot of features to implement to get it up to parity with 1.0.</p>
      <p/>
      <ul>
        <li>show previous season results</li>
        <li>show the point system</li>
        <li>show how the payouts are calculated</li>
        <li>show the rounds</li>
        <li>add the ability to email certain group of players (board members, cash game players, this season’s tournament players, ...)</li>
        <li>Top ten lists</li>
        <li>FAQ</li>
      </ul>`,
    createdAt: "May 1, 2020"
  },
  {
    header: "Version 2.0 Live continued",
    body: `<p>Version 2.0 of the texastoc web site went live today – continued!</p>
      <p>And what a trip it has been to get to this point.</p>
      <p>The back end consisted of 59 branches. Here is a smattering</p>
      <p/>
      <ul>
        <li>02-create-season</li>
        <li>07-tdd-create-game</li>
        <li>16-payout-calculator</li>
        <li>18-add-player-to-game</li>
        <li>23-first-time-player</li>
        <li>29-seating</li>
        <li>36-continuous-integration</li>
        <li>37-jwt-auth</li>
        <li>41-update-model-for-frontend</li>
        <li>53-sms-notifications</li>
        <li>59-final-shake-down</li>
      </ul>
      <p>For the front end I learned how to code in React and Redux. The front end consisted of 30 branches. Here is a smattering</p>
      <p/>
      <ul>
        <li>step-01-create-development-environment</li>
        <li>step-02-bootstrap</li>
        <li>step-04-routing</li>
        <li>step-07-league-store</li>
        <li>step-08-react-router-bootstrap</li>
        <li>step-11-create-new-season</li>
        <li>step-12-create-new-game</li>
        <li>step-17-add-first-time-player</li>
        <li>step-22-seating</li>
        <li>step-27-forgot-password</li>
        <li>step-29-production-build</li>
        <li>step-30-final-shake-down</li>
      </ul>
      <p>And don’t forget devops because it is no good if it is not deployed. There are a lot of options for deployment (virtual machine, Heroku, Amazon Web Services, ...). The main devops requirement is to do whatever is the least expensive (which puts a bigger burden on me). I went the path of a virtual machine and free SSL certificate. I already have the domain name.</p>
      <p>Devops steps (believe me there is a lot of work for each step)</p>
      <p/>
      <ul>
        <li>Provision a virtual machine</li>
        <li>Install MySQL, create schema and seed data</li>
        <li>Install Java</li>
        <li>Install and configure apache tomcat</li>
        <li>Sign up for SMS with Twilio</li>
        <li>Sign up for sending emails with Postmarkapp</li>
        <li>Create a back end war file to deploy to a web server</li>
        <li>Create a front end war file to deploy to a web server</li>
        <li>Provision an SSL certificate using LetsEncrypt and config tomcat to use it</li>
        <li>Change the domain DNS to point to the new server</li>
      </ul>`,
    createdAt: "May 1, 2020"
  },
  {
    header: "Version 2.0 Live",
    body: `<p>Version 2.0 of the texastoc web site went live today! Two years (and three days) from my blog post regarding creating version 2.0.</p>
      <p><a href="https://fullstacksoftwareblog.wordpress.com/2018/04/28/welcome-to-my-blog/">https://fullstacksoftwareblog.wordpress.com/2018/04/28/welcome-to-my-blog/</a></p>
      <p>And what a trip it has been to get to this point. First and foremost I must say that working on a "real" application of this size takes a lot of time. Most weekends, vacation/holidays and many nights after my workday has ended.</p>
      <p>Back end size (excluding tests) is 83 files and 5072 lines of code. Front end size (excluding tests because there are none) for JavaScript is 37 files and 1917 lines of code and for JSX is 18 files and 1171 lines of code. This yields a total of <b>138 files</b> and <b>8160 lines of code</b> (excluding tests). My counting tool is cloc.</p>
      <p>By "real" I mean an application that is used by real people – my poker league. The following features made up the Minimal Viable Product (MVP)</p>
      <h4>TLDR;</h4>
      <p>login, logout and forgot password (which emails a code).</p>
      <p>Show the league players, obfuscate their phone/email, and allow their information to be edited by either an admin or self.</p>
      <p>Game in progress</p>
      <p/>
      <ul>
        <li>add existing league members to the game</li>
        <li>add a new person to the game/league</li>
        <li>track the player’s buy in, rebuy, yearly and quarterly side bets, finish (1 through 10), chop pot, and knocked out status</li>
        <li>table/seating configuration (allowing for a table preference), randomly seating players and texting them their seat</li>
        <li>a clock that show the round and time remaining that can be paused; the time remaining changed; which send a text message when a new round begins</li>
        <li>the payouts</li>
        <li>finalize the game (gamer over) which recalculates the season and quarterly season standings and payouts</li>
        <li>allow only admin users to unfinalize (reopen) a game</li>
      </ul>
      <p>Season</p>
      <p/>
      <ul>
        <li>season details (money collected being the most important)</li>
        <li>season standings</li>
        <li>four quarterly seasons with the details, payouts, standings</li>
        <li>each game with details, payouts, standing</li>
        <li>send a season summary email when a game is finalized</li>
      </ul>`,
    createdAt: "May 1, 2020"
  },
  {
    header: "Petal to the Metal on the Back end",
    body: `<p>When working on the front end it is inevitable that work has to be done on the back end. Here are the branches of the commits that were done in tandem with the front end:</p>
      <p/>
      <ul>
        <li>44-get-current-game</li>
        <li>45-get-players-api</li>
        <li>46-add-existing-player-to-game</li>
        <li>47-update-game-player</li>
        <li>48-add-first-time-player-to-game</li>
        <li>49-sort-players-and-game-players</li>
        <li>50-get-most-recent-game</li>
        <li>51-get-most-recent-game-for-a-season</li>
        <li>52-seating</li>
        <li>53-sms-notifications</li>
        <li>54-clock-web-socket</li>
        <li>55-clock-polling</li>
        <li>56-forgot-password</li>
      </ul>
      <p>Have a look at the README in the github repo to learn more about each branch. You will have to cycle through the branches to view the README for that branch. See <a href="https://github.com/gpratte/texastoc-v2-spring-boot">https://github.com/gpratte/texastoc-v2-spring-boot</a> </p>
      <p>Using <a href="https://www.twilio.com/">https://www.twilio.com/</a> API to send SMS text messages and using https://postmarkapp.com/ API to send emails.</p>`,
    createdAt: "April 14, 2020"
  },
  {
    header: "Petal to the Metal on the Front end",
    body: `<p></p>
      <p>It’s been about 5 weeks since my last blog. During that time I’ve been constantly coding the front end to make it ready to deploy at the end of April. Here are the branches of the commits:</p>
      <p/>
      <ul>
        <li>step-11-create-new-season</li>
        <li>step-12-create-new-game</li>
        <li>step-13-add-existing-player</li>
        <li>step-14-update-game-player</li>
        <li>step-15-delete-game-player</li>
        <li>step-15-knockout-game-player</li>
        <li>step-16-delete-game-player</li>
        <li>step-17-add-first-time-player</li>
        <li>step-18-move-files</li>
        <li>step-19-finalize-game</li>
        <li>step-20-get-season-when-game-finalized</li>
        <li>step-21-refresh-game-spinner</li>
        <li>step-22-seating</li>
        <li>step-23-league-players</li>
        <li>step-24-seating-notify</li>
        <li>step-25-clock</li>
        <li>step-25-clock-websocket</li>
        <li>step-26-clock-polling</li>
        <li>step-27-forgot-password</li>
      </ul>
      <p>Have a look at the README in the github repo to learn more about each branch. See <a href="https://github.com/gpratte/texastoc-v2-react-redux">https://github.com/gpratte/texastoc-v2-react-redux</a></p>`,
    createdAt: "April 14, 2020"
  },
  {
    header: "React/Redux API Error Handling",
    body: `<p>Handle an error when calling an api by</p>
      <p/>
      <ul>
        <li>dispatch an action in the api catch block</li>
        <li>set the error message in the league store</li>
        <li>show the error message in the Error component</li>
        <li>dismiss the error in the Error component by dispatching an action that clears the error message</li>
      </ul>
      <p>See branch step-10-api-error-handler in <a href="https://github.com/gpratte/texastoc-v2-react-redux">https://github.com/gpratte/texastoc-v2-react-redux</a>. Compare to the previous branch, step-09-must-be-logged-in, if you want to see how error handling was implemented.</p>
      <p>Next thing to do is to wire up having the frontend call the backend to Create, Retrieve, Update and Delete (CRUD) a season.</p>`,
    createdAt: "March 9, 2020"
  },
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
      <p/>
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
      <p/>
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
      <p/>
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
      <p/>
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
      <p/>
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
      <p/>
      <ul>
        <li>handing events</li>
        <li>state and properties</li>
      </ul>
      <p>I went back and reviewed these topics more than once in both the reactjs.org tutorial and the Wes Bos course.</p>
      <p>I also read some articles found from internet searching (e.g. How to Display a List in React).</p>
      <p>As is my modus operandi, when developing new code, I built up the tutorial on branches.</p>
      <p/>
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
      <p/>
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
      <p/>
      <ul>
        <li>An embedded ActiveMQ server (to mock JMS)</li>
        <li>Wiremock to mock the REST calls</li>
        <li>An embedded H2 in-memory database</li>
        <li>An embedded Qpid server (to mock RabbitMQ)</li>
      </ul>
      <h4>Listen to JMS message flow ...</h4>
      <p/>
      <ol>
        <li>Receive a Todo JMS message</li>
        <li>Make a REST call (for no good reason)</li>
        <li>Persist the Todo in a relational database</li>
      </ol>
      <p>The server is setup to</p>
      <p/>
      <ol>
        <li>Listen to the mailbox queue of an external JMS ActiveMQ server</li>
        <li>Makes a REST call to http://worldclockapi.com/api/json/utc/now</li>
        <li>Inserts into a Postgres database</li>
      </ol>
      <h4>REST POST to create a Todo flow ...</h4>
      <p/>
      <ol>
        <li>Expose a POST endpoint to create a Todo</li>
        <li>Persist the Todo in a relational database</li>
        <li>Send the Todo as JSON to RabbitMQ</li>
      </ol>
      <p>The server is setup to</p>
      <p/>
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
      <p/>
      <ol>
        <li>Receive a Todo message</li>
        <li>Make a REST call (for no good reason)</li>
        <li>Persist the Todo in a relational database</li>
      </ol>
      <p>The server is setup to</p>
      <p/>
      <ol>
        <li>Listen to the mailbox queue of an external JMS ActiveMQ server</li>
        <li>Makes a REST call to http://worldclockapi.com/api/json/utc/now</li>
        <li>Inserts into a Postgres database</li>
      </ol>
      <p>When running tests the server uses</p>
      <p/>
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
      <p/>
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
      <p/>
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
      <p>I followed the CircleCI directions to</p>
      <p/>
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
      <p/>
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
     <table class="blog-table">
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
     <table class="blog-table">
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
         <td>/user endpoint to return the principal</td>
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
      <p/>
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
      <p/>
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
       <p/>
       <ul>
       <li>Install the angular cli</li>
       <li>npm install -g @angular/cli</li>
       </ul>
       <p>Run the server</p>
       <p/>
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
      <p/>
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
      <p/>
      <ul> 
      <li>Install the angular cli</li> 
      <li>npm install -g @angular/cli</li> 
      </ul> 
      <p>Run the server</p> 
      <p/>
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
      <p/>
      <ul>
      <li>java -jar wiremock-standalone-2.18.0.jar –port 9999</li>
      </ul>
      <p>I then added a stub API</p>
      <p/>
      <ul>
      <li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request": { "method": "GET", "url": "/hello1" }, "response": { "body": "Hello world!" }}&apos;</li>
      </ul>
      <p>Exercise the stub</p>
      <p/>
      <ul>
      <li>curl http://localhost:9999/hello1</li>
      </ul>
      <p/>
      <p>Added a new stub to return a json body
      <ul>
      <li>curl -X POST http://localhost:9999/__admin/mappings -d &apos;{ "request": { "method": "GET", "url": "/hello2" }, "response": { "jsonBody": {"Hello": "world!" }}}&apos;
      </ul>
      <p>Exercise the stub",
      <p/>
      <ul>
      <li>curl http://localhost:9999/hello2</li>",
      </ul>
      <p>To see all stub mappings",
      <p/>
      <ul>
      <li>curl http://localhost:9999/__admin/</li>",
      </ul>
      <p>See <a href="http://wiremock.org/docs/stubbing/">http://wiremock.org/docs/stubbing/</a> for more ways to stub.</p>
      <p>Shutdown the local server
      <p/>
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
      <p/>
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
      <p/>
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
      <p/>
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
      <p/>
      <ul>
      <li>write frontend code from time to time</li>
      <li>have professionally developed in assembler (Intel x86 processors), C, python and node.js</li>
      <ul>
      <p>I am going to rewrite from scratch the backend and the frontend for my personal application. But there is so much more to creating an application than writing code. There are things like: user stories; software architecture; UI mockups; testing; deployment; ...</p>
      <p>This blog will be documenting the journey of my rewriting my personal application.<p>`,
    createdAt: "April 28, 2018"
  }
]