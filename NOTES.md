# Get an angular service

var svc = angular.element( document.querySelector('[myApp]') ).injector().get( 'svc' );

# Important reminder

What's easier to fix?
Bad application performance?
Bad API?

For me bad application performance.
Retraining people how to use your code is harder than rewriting slow code or adding hardware.

#2015-12-29

Today I'm exploring the unit and e2e tests.
And specifically I'm working through this issue...

	adamtavares@ASPERSATAVARES ~/angular-seed $ npm test
	
	> angular-seed@0.0.0 pretest /Users/adamtavares/angular-seed
	> npm install
	
	
	> angular-seed@0.0.0 postinstall /Users/adamtavares/angular-seed
	> bower install
	
	
	> angular-seed@0.0.0 test /Users/adamtavares/angular-seed
	> karma start karma.conf.js
	
	INFO [karma]: Karma v0.12.37 server started at http://localhost:9876/
	INFO [launcher]: Starting browser Chrome
	INFO [Chrome 47.0.2526 (Mac OS X 10.9.5)]: Connected on socket Ilq1pC427lOg2J5kcHRI with id 37319691
	Chrome 47.0.2526 (Mac OS X 10.9.5) ERROR
	  Uncaught ReferenceError: define is not defined
	  at /Users/adamtavares/angular-seed/app/components/version/interpolate-filter.js:3

What could be going on?