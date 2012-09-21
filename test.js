require('my').load('./tabish', function(tabish){

	var tests = ['\
	header line\
		body line 1\
		body line 2\
		body line 3\
	', '\
	header line\
			body line 1\
			body line 2\
			body line 3\
	']

	for (var i = 0; i < tests.length; i++) {
		tabish.parse(tests[i])
	}

})