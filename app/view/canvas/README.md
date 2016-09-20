Here's where I'm going to do a little philosophizing.
My target audience is people a little bit younger than me on my same path.

# 3D Game Development

You have some big ideas.  
You love interacting with computers.  
You have some basic programming knowledge, but you don't know really know how to build a game.

I want to help you build some foundational skills you'll need to develop 3D games in a webbrowser.

# Why Javascript?

Everybody has a webbrowser and therefore a Javascript interpreter.
The barrier to entry is extremely low.
You're a beginning game developer.  
You want to promote yourself and break into the industry.  
Well you have to get people playing your games so others can see what you're capable of.  
You'll have to quickly figure out what people like and don't.
You need feedback.
That's the only way to really improve.

Clicking a hyperlink to a webpage and BOOM you're playing a game is the shortest click path between nobody knowing your game exists to them playing your game and having fun.
Remember people are lazy and you're competing with the rest of the world for their attention.
Remember, people vote with their attention.

In the future, when you've got foundational skills under your belt, and you have to worry about performance or you want to use a special piece of hardware, that's when you'll have to abandon the browser for some other development environment, and probably Javascript along with it.

But for now Javascript's ubiquity and ease of entry make it the best way to get started.

## Tools you'll be using

* Non Javascript
  * a terminal
  * a text editor
  * git -- for managing versions of your code and tracking your code changes.
  * npm ( Node Package Manager )-- for downloading software for running your development web server and test environment
  * bower -- for downloading 3rd party Javascript libraries
  * grunt -- for running tests and minifying your code
  
* Javascript -- all this stuff will be installed using bower
  * require -- for managing 3rd party dependencies and your own code modules
  * threejs -- for graphics
  * timbre -- for sound
  * jquery -- for mouse and keyboard controls
  * angular -- for non game UI

# Sorta Fresh Gameplay Ideas

Remember you're one person.
You probably have a day job or school to deal with.
You have friends and family and responsibilities.
You're not going to build the equivalent of a next-gen Zelda game all by yourself.
Games of that scale are a different beast entirely.
They are the product of a huge gang of artists, writers, and programmers.
They're also built on top of a huge foundation of proprietary code, and art which has evolved over decades.
Games like that are built by institutions not by individuals.

But games don't really need grand immersive worlds packed with detail, complex character arcs, and an elaborate battle system.
Fun can be simple.
Playing catch is still fun.

So as an individual game designer I think you're going to get the best bang for your time buck by putting your energy into coming up with new gameplay ideas.
Not totally new gameplay ideas either.
It can be a minor variation of an old classic.
Play some old games from the 80s.  
Designers of those games had to keep things simple because of hardware limitations.
Those limitations are what inspired the foundational genres we play today.

- space shooters
- tube racing
- top down racing
- platformers
- run and gun
- RPG
- turn based strategy

Like Space Invaders?
If you could change something in that games to up the fun what would you do?
Speed things up?
Expand the play area?
Add multiplayer?
Change the control scheme a bit?
Shoot down inside of up?
Add more realistic gravity?
Have enemies move in a circle around the player instead?

How would a little change affect other parts of the game?  
What would have to change with it?  
Some small changes cause big ripples.
Think of those little changes, and you might mutate an old classic into a new one.

# The Big 3... Reward, pace, and controls

What's the reward for playing?
A high score?
Bragging rights?
Increased difficulty and a feeling of mastery?
Forgetting your problems for a while because you're so caught up in the game?
Most likely it's a blend of all those, because they aren't mutually exclusive.
As you're developing your game, keep your eyes on the prize... player reward.

What's the pace and rhythm of the game?  
Is it slow and relaxing, or fast paced and stressful?
Being a game designer is a lot like being a musician in this regard.
Somebody who wants to feel relaxed isn't going to blast heavy metal.
Fast tempos will get people's hearts racing.
As a musician you're constantly changing people's emotional state by pumping vibrations into them.

As a game designer you're doing essentially the same thing.
Other people are always at the heart of your game.
Is your game making their heart race, or is it slowing it down?
Is it making their mind wander, or is it focusing it like a laser?

Keeping this in mind... how your game is controlled is going to play a huge role in determining the pace of your game.  Remember nothing ruins a game faster than bad controls.

This is where we're going to put our attention for now.

# Math you need to know

Hey! You're going to need to know some math.
If you know a little geometry, trigonometry and physics you should be okay.
Here are the kinds of problems you'll encounter.

Positioning objects in three dimensions
Rotating objects
Detecting collisions between objects
Changing an object's speed and direction
Calculating the distance between objects

If your brain started cooking up solutions to these problems as you read them you should find the math in this book really easy to wrap your head around.  If not, that's okay, you'll need to do some extra work building up your math skills. ( Read up on Euclidean Space, the pythagorean theorem, and how to use vectors to model velocity and acceleration to start ).

# Code clarity

Remember when you're writing code you're talking with a computer, and not a fancy schmancy AI "your wish is my command" type computer.
You're talking with a code interpreter that is pickier than a clerk at the DMV.  
All your t's must be crossed and i's dotted.
It doesn't understand nuance.  
It doesn't read between the lines.

But you also are talking to everyone who has to use and extend your code, which is most likely going to be you in the near future.  

So write comments.
Keep your code well-formatted.
Try to reduce complexity wherever possible.  
Design your APIs.
Keep your code dry ( Don't Repeat Yourself ).

The best code provides the foundation for other systems to be built around it.  And you want to make sure that your code can be optimized in the future without affecting systems which may depend on it.

# Getters and setters

# Functions > Properties for passing values around