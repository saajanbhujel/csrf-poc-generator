var generateFormValue = false;

$("#generate").click(function() {
	var request = $("#request").val();
	var headers = request.split("\n\n")[0].split("\n");
	var data = request.split("\n\n")[1];
	var requirements = {};
	var parameters = new Array();
	var parametersKey = new Array();
	var parametersValue = new Array();

	requirements.method = headers[0].split(" ")[0];

	for (var i = 0; i < headers.length; i++) {
		if(i==0) {
			var headerKey = headers[i].split(" ")[1];
			requirements.uri = headerKey;
		}
		else {
			var headerKey = headers[i].split(":")[0];
			if(headerKey == "Host") {
					if($('#httpradio')[0].checked) { 
						requirements.host = "http://" + headers[i].split(": ")[1];
					}
					else{
						requirements.host = "https://" + headers[i].split(": ")[1];
					}
				
					if($('#checkauto')[0].checked){
						generateFormValue = true;
					}
					else{
						generateFormValue = false;
					}

			}
		}
	}

	if(requirements.method == "POST") {
		parameters = data.split("&");
	}
	else if(requirements.method == "GET") {
		parameters = requirements.uri.split("?")[1].split("&");
	}
	for (var i = 0; i < parameters.length; i++) {
		parametersKey[i] = parameters[i].split("=")[0];
		parametersValue[i] = parameters[i].split("=")[1];
	}

/* Console Logs
	console.log(requirements);
	console.log(parameters);
	console.log(parametersKey);
	console.log(parametersValue);
*/

	$("#poc").val(generateForm(requirements, parameters, parametersKey, parametersValue));
});

function generateForm(requirements, parameters, parametersKey, parametersValue) {
	
	if(generateFormValue) {
		var form = "";
	
		form += "<html>\n";
		form += "\t<body>\n";
		form += "\t\t<form name='myForm' id='myForm' method=\"" + requirements.method + "\" action=\"" + requirements.host + requirements.uri + "\">\n"
		for (var i = 0; i < parameters.length; i++) {
			form += "\t\t\t<input type=\"hidden\" name=\"" + parametersKey[i] + "\" value=\"" + parametersValue[i] + "\"/>\n"	
		}
		form += "\t\t\t<input type=\"submit\" value=\"Submit\">\n";
		form += "\t\t</form>\n";
		form += "\t</body>\n";
		form += "<html>\n";
	
		return form;
	}
	else{
		var form = "";
		
		form += "<html>\n";
		form += "\t<body>\n";
		form += "\t\t<form name='myForm' id='myForm' method=\"" + requirements.method + "\" action=\"" + requirements.host + requirements.uri + "\">\n"
		for (var i = 0; i < parameters.length; i++) {
			form += "\t\t\t<input type=\"hidden\" name=\"" + parametersKey[i] + "\" value=\"" + parametersValue[i] + "\"/>\n"
		}
		form += "\t\t\t<input type=\"submit\" value=\"Submit\">\n";
		form += "\t\t</form>\n";
		form += "\t\t<script>\n";
		form += "\t\t\tdocument.addEventListener('DOMContentLoaded', function(event) {\n";
		form += "\t\t\t\tdocument.createElement('form').submit.call(document.getElementById('myForm'));\n";
		form += "\t\t\t\t});\n";
		form += "\t\t</script>\n";
		form += "\t</body>\n";
		form += "<html>\n";
		
		return form;
	}
	
}

$("#save").click(function(){
	var blob = new Blob([$("#poc").val()], {type: "text/plain;charset=utf-8"});
	var filename = "csrf-poc-" + $.now() + ".html";
	saveAs(blob, filename);
});
