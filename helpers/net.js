/////////////////
// Net Helpers //
/////////////////
var net = {};


// to send a response to the client
net.send = function(err, data, res) {
	if(err) {
		console.error(err.message);
		res.send(500, err.message);
	} else {
		res.send(data);
	}
};


// export
module.exports = net;