jquery-function-stack
=====================
First iteration of a simple function stacking plugin. This allows you to create multiple named stacks of functions which you want to fire in sequence.

#In a nutshell
Basically, this plugin allows you to queue a load of functions on to a calling stack, then have each function run in sequence, either automatically or by calling a plugin method.

#why?
If your developing a JS heavy application. The chances are your going to need to call a lot of functions. While some of these can be executed in parallel, a lot of them will probably also do something visual or have to wait for user feedback. 

If a single action can fire between zero and ten functions, popup's, animations, additional content being added in, but your not sure which of those will be required (i.e. dependant on the results of an ajax request) how do provide a firing sequence? Now im sure people have came across this problem before, and im sure they have found ways to solve it. This is my solution to the problem that meets my programming style and specific need.

#What exactly does it solve
As i've already said, this plugin was created to meet a specific need. The problem that caused me to think of this issue was that an ajax request would return a bunch of 1's and 0's, each one telling the request callback whether to fire a specific action/function. A lot of these functions were adding in additional content or popup's. The original code had a bunch of IF's calling the functions and passing in the next function as a callback. However this created a whole load of mess in the code as the sequence could change.

This plugin allows me to simple push all the actions onto a stack without the need for callback functions, and they will fire in the sequence i add them. This makes my code neater, more legible and easier to maintain.

#Should i use it?
This is just the first iteration. I have tried to bare in mind that other people may want to use/add to it, and that i may also develop it futher when i get more time. In doing that i have seperated some things out more than i normally would for private use and added some additional helper methods that i wouldn't normally bother with. HOWEVER, this plugin if i develop it further will most likely change drastically through its first few revisions whilst i get a solid base for it, i doubt you will be able to "upgrade" to future revisions of this plugin without changing the code it itegrates with.

Having said that, if the plugin meets your needs already, then go ahead and use it, and of course you can always extend it yourselves privately, fork it, or contribute if it lacks something.



