(function(w){
	w['Bureau'] = function () {
		var slice = Array.prototype.slice,
            mods = {};
		
		return function (config) {
			var dependencies = {},
                globals = [],
                name = config.name,
                module = config.module,
                returns = {};
			
			// >> Return existing module
			
			if (typeof config === 'string') {

				config = config.split(' ');

				for (var i = 0, len = config.length; i < len; i++){
					if(mods[config[i]]){
						returns[config[i]] = mods[config[i]]();
					}else{
						throw "Module " + config[i] + " has not been defined";
					}	
				}

                return returns;
			}
			
			if(!config.module || typeof config.module !== 'function'){
				throw "Please define a module";
			}
			
			// >> Define module
			
			if(config.globals && typeof config.globals === 'string'){
				
				globals = config.globals.split(' ');
				for(var i = 0, len = globals.length; i < len; i++){
					if(window[globals[i]]){
						globals[i] = window[globals[i]];
					} else {
						throw 'The ' + globals[i] + ' global dependency for ' + name + ' cannot be resolved';
					}
				}
			}
			
			// >> Assign module

			mods[name] = function(){
				var itself = {},
                    val,
                    args = [],
                    arr;
				
                if(!mods[name].resolved){
                  	
                  	// resolve dependences
                    if(config.dependencies && typeof config.dependencies === 'string'){
                        arr = config.dependencies.split(' ');
                        
                        for(var i=0, len = arr.length; i < len; i++){
                        	if(mods[arr[i]]){
                                dependencies[arr[i]] = mods[arr[i]].resolved || mods[arr[i]]();
                            } else {
                                throw "A dependency for " + name + " is unresolved (" + arr[i] + ")";
                            }
                        }
                    }

                    args = args.concat(globals);
                    args.unshift(dependencies);

                    val = module.apply(itself, args);
                    
                    mods[name].resolved = val || itself;
                    
                    mods[name].resolved['resolve'] = function(){
                        mods[name].resolved = null;
                        return mods[name]();
                    };
                }

				return mods[name].resolved;
			};
			
			return mods[name];
		};
};
}(window));

// Create file app container - move later
var FilesApp = Bureau();