var fs = require('fs');

var readTemp = function(callback){
    fs.readFile('/sys/bus/w1/devices/28-00000480aa5b/w1_slave', function(err, buffer)
    {
      if (err){
         console.error(err);
         process.exit(1);
      }

      // Read data from file (using fast node ASCII encoding).
      var data = buffer.toString('ascii').split(" "); // Split by space

      // Extract temperature from string and divide by 1000 to give celsius
      var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;

      // Round to one decimal place
      temp = Math.round(temp * 10) / 10;

      // Add date/time to temperature;

      // Execute call back with data
      callback(temp);
   });
};



var createThing = function(){
    
	var thing = {};


    thing.settings = { 
		"name": 'Temperature',
		"id": 3942879,
		"iconType": "Thermometeer",
		//"position": config.getPosition(),
		"information":[{
                        "header":"Temperature @ home"
					}]};
		

	var timeForUpdate = function() {
       var update = function(data){
           if(thing.socket){
		//console.log(data);
            thing.socket.emit('updateInfo', data +" °C");
            }
        };
        readTemp(update);
    };
    
    var intervalId = setInterval(timeForUpdate, 1000);
	return thing;
};

module.exports.thing = createThing();
