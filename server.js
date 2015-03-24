var http = require('http');
var url = require('url');

http.createServer(function(request, response) {
  var sessionCookie = null;
  var cookies = request.headers.cookie;
  if (cookies) {
    var match = cookies.match(/session=([^;,]*)/);
    if (match) {
      sessionCookie = match[1];
    }
  }
  console.log('Request to %s with cookie %s', request.url, sessionCookie);
  switch(request.url) {
    case '/':
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      if (!sessionCookie) {
        response.setHeader("Set-Cookie", "session=home; expires=Wed, 1-Jan-2020 00:00:01 GMT; path=/");
      }
      response.write("\
        <form action='/reset-cookie-redirect' method='POST'>\
          <input type='submit' value='Reset Cookie with Redirect'/>\
        </form>\
        <form action='/reset-cookie-success-page' method='POST'>\
          <input type='submit' value='Reset Cookie with Success Page'/>\
        </form>\
        <p>Current Cookie: <script>document.write(document.cookie)</script></p>\
      ");
      break;
    case '/reset-cookie-redirect':
      response.statusCode = 302;
      response.setHeader("Location", "/");
      response.setHeader("Set-Cookie", [
        "session=" + sessionCookie + "; expires=Wed, 1-Jan-2020 00:00:01 GMT; path=/",
        "session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/",
        "session=reset-cookie-redirect; expires=Wed, 1-Jan-2020 00:00:01 GMT; path=/"
      ]);
      break;
    case '/reset-cookie-success-page':
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.setHeader("Set-Cookie", [
        "session=" + sessionCookie + "; expires=Wed, 1-Jan-2020 00:00:01 GMT; path=/",
        "session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/",
        "session=reset-cookie-success-page; expires=Wed, 1-Jan-2020 00:00:01 GMT; path=/"
      ]);
      response.write('<p>Success! <a href="/">Back to Home</a></p><p>Current Cookie: <script>document.write(document.cookie)</script></p>');
      break;
    default:
      response.statusCode = 302;
      response.setHeader("Location", "/");
      break;
  }
  response.end();
}).listen(8080);
