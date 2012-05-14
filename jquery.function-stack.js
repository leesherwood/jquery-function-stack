/*
 * jQuery Function Stack Plugin v1.0.0
 * https://github.com/leesherwood/jquery-function-stack
 *
 * Copyright 2012, "leesherwood" Lee Sherwood
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * AKA: I couldn't care less what you do with it, 
 *      im just a nice guy and i want to share.
 *      But it would be nice if you left me a little credit :)
 *
 * If you use this plugin, then let me know at: i-played-with-your-git@secure4sure.org
 */
 
;(function($){
	"use strict";
	
	var stacks = {};
	var undef = "undefined";

	
	/**
	 * Constructors and Destructors
	 */
	$.functionStack = (function(){
		
		function create(ref, opts){
			
			/**
			 * If the stack reference name is an object, presume the options were passed before 
			 * the reference, or an anonymous reference has been asked for. Flip 'em!
			 */
			if(typeof ref == "object") {
				var ref_holder = opts;
				opts = ref;
				ref = ref_holder;
			}
			
			/**
			 * If the reference is empty then prepare for an anonymous stack
			 */
			if(typeof ref == undef || ( typeof ref == "string" && ref.length == 0)) {
			
				var uniqueRef=false;
				var newref="";
				do {
					
					newref = "Anon"+Math.floor( Math.random() * 100000001  );
					if(!(newref in stacks))
						uniqueRef = true;
				
				} while(!uniqueRef);
				
				ref = newref;
				
			}
			
			
			if(!(ref in stacks))
				stacks[ref] = new $.functionStack._manager(ref, opts);
				
			return stacks[ref];
		}
		
		function destroy(ref){
			
			if(ref in stacks) {
				stacks[ref].clear(true);
				delete stacks[ref];
			}

		}

		
		var publicFunctions = {
			create: create,
			destroy: destroy
		};
		
		return publicFunctions;
		
	})();
	
	
	/**
	 * The initialiser for individual function stacks
	 */
	$.functionStack._manager = function(ref, opts){
		this.reference = ref;
		this.stack = [];
		this.opts = $.extend({}, $.functionStack.defaults, opts);
	};
	
	/**
	 * Implements all the various methods for our function stacks
	 */
	$.functionStack._manager.prototype = {
	
		add: function(o) {
			
			/**
			 * Default the values 
			 */
			var autonext = this.opts.autonext;
			var func = false;
			
			/**
			 * If what we expect to be the function is an object, 
			 * Then maybe the function and autonext values were passed in there
			 */
			if(typeof o == "object") {
				if( "autonext" in o ) 
					autonext = o.autonext;
				
				if( "run" in o )
					func = o.run;
				
			}
			else if (typeof o == "function") {
				func = o;
			}
			
			
			/**
			 * If your func var is still not a function, then something went wrong and we dont want to add it too the stack
			 */
			if(typeof func != "function") 
				return false;
			
			/**
			 * Build the object that we will push onto the function stack
			 * This object could just be passed in full to the add function
			 * ( Maybe thats why i put that check up there ^ ) but im a control freak!
			 */
			var stackItem = {
				"run": func,
				"autonext": autonext
			};
			
			/**
			 * push it onto our stack	
			 */
			this._pushToStack(stackItem);
			
			/**
			 * If the stack is one (i.e. was empty before this), then run this immediately
			 * N.B: THERE MAY BE TIMES WHEN A FUNCTION NEEDS TO BE ADDED BUT NOT CALLED IMMEDIATELY
			 *      OR THERE MAY BE A FUNCTION FROM THIS STACK ALREADY RUNNING.
			 *		I'LL FIND A WAY TO RESOLVE THOSE SCENARIOS WHEN MY BRAIN ISN'T IN MY ARSE
			 */
			 if(this.count() == 1 && autonext)
				this.next();
						
		},
	
		/**
		 * Adds a stack item object to the stack
		 */
		_pushToStack: function(o) { 
			
			this.stack.push(o);
			
		},
		
		/**
		 * Run next function on the stack (Just a publicly accesible caller)
		 */
		next: function(){
			
			this._runNext();
			
		},
		
		/**
		 * The bit that actually runs the next function on the stack
		 */
		_runNext: function(){ 

			if(this.isEmpty())
				return;
				
				
			var item = this.stack.shift(); 
			
			/** 
			 * Run the function passing in the stack as "this". 
			 * This will help when manually firing the next stack cycle 
			 */
			item.run.apply(this); 
			
			/**
			 * If we have to automagically run the next one, then do so!
			 */
			if(item.autonext) {
				this.next();
			}
		
		},
		
		/**
		 * Returns the length of the stack
		 */
		count: function() {
			return this.stack.length;
		},
		
		/**
		 * Returns wether the stack is empty (can be used as a "has next" method)
		 */
		isEmpty: function() {
			return this.count() > 0 ? false : true;
		}
		
	
	};
	
	/**
	 * The defaults 
	 */
	$.functionStack.defaults = {
		autonext : true
	};
	
	/**
	 * Expose public stack methods to the parent object
	 */
	$.each($.functionStack._manager.prototype, function(n, fn){
		if(n.indexOf('_') === 0 || !$.isFunction(fn)){return;}
		$.functionStack[n] =  function(ref, o){
			if(!stacks[ref]){
				if(n === 'add'){
					$.functionStack.create(ref, o);
				} else {
					return;
				}
			}
			var args = Array.prototype.slice.call(arguments, 1);
			stacks[ref][n].apply(stacks[ref], args);
		};
	});

})(jQuery);