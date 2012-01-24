### Bureau.js

Born in the dark laboratories of [Huddle.com](http://www.huddle.com).  Bureau.js is a very simple library for building tightly scoped modular frameworks with explicit dependency management.

Bureau.js is not designed to be AMD compatible; And though it takes heavy inspiration from RequireJS it does not enable script loading.

##### Bureau.js attempts to solve the following

* The pollution of the global context
* Weak code encapsulation
* Implicit dependencies resolution via the scope chain

#### Bureau.js provides

* An easy way to define a code sandbox
* Module definition
* A mechanism for explicitly defining dependencies

### Example

	var myBureau = Bureau(),
		legacyHelper = {/*lots of properties*/};

	myBureau({
		name: 'moduleA',
		module: function(){

			// this method will be exported and thus is public to the modules that have access to this module
			this.exportMethod = function(){}

		};
	});

	myBureau({
		name: 'moduleB',
		module: function(){

			// another way to export methods
			return {
				exportMethod: function(){}
			};

		};
	});

	myBureau({
		name: 'moduleC',
		dependencies: 'moduleA moduleB',
		globals: 'jQuery legacyHelper',
		module: function(privateDependencies, jQuery, legacyHelper){
			
			var exportsFromModuleA = privateDependencies.moduleA,
				exportsFromModuleB = privateDependencies.moduleB;
			
			// do something awesome

		};
	})(); 

Note the parenthesis at the end of moduleC, this module will be evaluated immediately.  Dependent modules will also be resolved at this point.  If (in the real world) a dependent module has already been resolved, a reference to its exports will be passed through.

We can force evaluation of modules like this.  The same example also shows how we can gain access to modules from outside of the sandbox (*shock* and/or *horror*).

	var modules = myBureau('moduleA moduleB');

	modules.moduleA.exportMethod();

The above approach should be avoided, but it's available for convenience and useful for mocking in JS tests.

Another convenience method for use in JS tests is .resolve().  This method will force the module to re-resolve.

	myBureau('moduleA').moduleA.resolve();

### Why U NO?

Bureau was designed to support the building of a modular architecture where sophisticated build (merge/compression) systems were already in place.  Put simply, I didn't need to dynamically/asynchronously fetch and evaluate scripts, if I did I probably would have used requireJS.