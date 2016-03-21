var GLOBALDATA = {
		"quick_reports":[
			{
				"Name":"ron","URL":null
			},
			{
				"Name":null,"URL":null
			}, 
			{
				"Name":null,"URL":null
			}
		],
		"my_folders":[
			{
				"Name":null,"URL":null
			},
			{
				"Name":null,"URL":null
			}, 
			{
				"Name":null,"URL":null
			}
		]
};

function init(){
	showRelevantTab();
	if(checkLocalData())
		GLOBALDATA = loadUserData();
	getNote();
	resetSelectElems();
	document.getElementById("dynurl").style.visibility = "hidden";
	document.getElementById("dynurlfolder").style.visibility = "hidden";
	inputsAddKeyEvent();
}

function resetSelectElems(){
	var tag = document.getElementById("dropdown");
	var length = tag.options.length;
	for (i = 0; i < length; i++) {
		tag.remove(tag.length-1);	
	}
}

function locationHashChanged() {
	getHash();
	showRelevantTab();
	hideDropdown(false);
}
window.onhashchange = locationHashChanged;

function hideDropdown(vis) {
	if (vis == true)
		document.getElementById("dropdown").style.visibility = "visible";
	else
		document.getElementById("dropdown").style.visibility = "hidden";
}

function hideForms() {
	curr_form = getHash();
	console.log(curr_form);
	if (curr_form == "quick-reports"){
		if (document.getElementById("forms-qr").style.visibility == "hidden"){
			document.getElementById("forms-qr").style.visibility = "visible";
			document.getElementById("reportname01").focus();
		}
		else{
			document.getElementById("forms-qr").style.visibility = "hidden";
		}
	}
	else if (curr_form == "my-team-folders"){
		if (document.getElementById("forms-tf").style.visibility == "hidden"){
			document.getElementById("forms-tf").style.visibility = "visible";
			document.getElementById("foldername01").focus();
		}
		else{
			document.getElementById("forms-tf").style.visibility = "hidden";
		}
	}
}

function showRelevantTab() {
    document.getElementById("quick-reports").style.visibility = "hidden";
	document.getElementById("fmy-folders").style.visibility = "hidden";
	document.getElementById("my-team-folders").style.visibility = "hidden";
	document.getElementById("public-folders").style.visibility = "hidden";
	if (getHash() != "" || getHash() != null)
		document.getElementById(getHash()).style.visibility = "visible";
}

function getHash() {
	str = window.location.hash;
    str = str.substr(1);
	return str;
}

UTILS.addEvent(window,"DOMContentLoaded",init)

function getNote(){
UTILS.ajax('https://raw.githubusercontent.com/giladlesh/webapp/gh-pages/data/config.json',
	{
		method: 'GET',
		done: {
			call: function (data, res) {
				document.getElementById("note").innerHTML = JSON.parse(res).notification;
			}
		}
	});
}

UTILS.addEvent(document.getElementById("report-setting"),"click",hideForms)

var GLOBALTFINPUTS =["foldername01", "foldername02","foldername03","folderurl01", "folderurl02","folderurl03"];
var GLOBALQRINPUTS =["reportname01", "reportname02","reportname03","reporturl01", "reporturl02","reporturl03"];
function inputsAddKeyEvent(){
	for (i=0; i<GLOBALQRINPUTS.length; i++){
		UTILS.addEvent(document.getElementById(GLOBALQRINPUTS[i]),"keypress",function() {
			if (event.keyCode == 13)
				document.getElementById("report-save").click();
			else if (event.keyCode == 27)
				document.getElementById("report-cancel").click();
		});
	}
	for (i=0; i<GLOBALTFINPUTS.length; i++){
		UTILS.addEvent(document.getElementById(GLOBALTFINPUTS[i]),"keypress",function() {
			if (event.keyCode == 13)
				document.getElementById("folder-save").click();
			else if (event.keyCode == 27)
				document.getElementById("folder-cancel").click();
		});
	}
}

UTILS.addEvent(document.getElementById("dropdown"),"change",dropDownSrcVis);

function dropDownSrcVis(){
	curr_form = getHash();
	if (curr_form == "quick-reports"){
		document.getElementById("dynurl").src = document.getElementById("dropdown").value;
		document.getElementById("dynurl").style.visibility = "visible";
	}
}

UTILS.addEvent(document.getElementById("expand"),"click",function(){
	url = document.getElementById("dropdown").value;
	window.open(url);
});

UTILS.addEvent(document.getElementById("report-save"),"click",storeAction)

UTILS.addEvent(document.getElementById("report-cancel"),"click",function(){
	document.getElementById("forms-qr").style.visibility = "hidden";
})

function checkLocalData(){
	str = loadUserData(); // need to change load
	if (str === null)
		return false;
	return true;
}

function checkForms(name,url){ // need to address "null" "null"
	flag = "init";
	if (document.getElementById(name).value != ""
		&& isUrl(url)){
			createElemDropdown(document.getElementById(name).value,document.getElementById(url).value);
			flag = "succeded";
		}
	else if (document.getElementById(name).value != ""
		&& !isUrl(url)){
			document.getElementById(url).focus();
			document.getElementById(url).className = "borderlight";
			flag = url;
		}
	else if (document.getElementById(name).value == ""
		&& document.getElementById(url).value != ""){
			document.getElementById(name).focus();
			document.getElementById(name).className = "borderlight";
			flag = name;
		}
	return flag
}

function resetAllFormsBorders(temp){
	if (true){
		for (i=0; i<GLOBALQRINPUTS.length; i++)
		document.getElementById(GLOBALQRINPUTS[i]).className = "border";
	}
}

function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function createElemDropdown(name,url){
	var z = document.createElement("option");
    z.setAttribute("value", url);
	var t = document.createTextNode(firstToUpperCase(name));
    z.appendChild(t);
    document.getElementById("dropdown").appendChild(z);
}


function storeAction(){
	resetSelectElems();
	flag = "";
	flag = checkForms("reportname01","reporturl01");
	if (flag == "succeded"){
		flag = checkForms("reportname02","reporturl02");
	}
	if (flag == "succeded"){
		flag = checkForms("reportname03","reporturl03");
	}
	if (flag == "succeded" || flag == "init"){
		storeUserData();
		document.getElementById("forms-qr").style.visibility = "hidden";
		dropDownSrcVis();
		resetAllFormsBorders(true);
	}
}

function storeUserData(){
	data = {
		"quick_reports":[
			{
				"Name":document.getElementById("reportname01").value,
				"URL":document.getElementById("reporturl01").value
			},
			{
				"Name":document.getElementById("reportname02").value,
				"URL":document.getElementById("reporturl02").value
			}, 
			{
				"Name":document.getElementById("reportname03").value,
				"URL":document.getElementById("reporturl03").value
			}
		],
		"my_folders":[
			{
				"Name":document.getElementById("foldername01").value,
				"URL":document.getElementById("folderurl01").value
			},
			{
				"Name":document.getElementById("foldername02").value,
				"URL":document.getElementById("folderurl02").value
			}, 
			{
				"Name":document.getElementById("foldername03").value,
				"URL":document.getElementById("folderurl03").value
			}
		]
	}
	localStorage.setItem("User_storage", JSON.stringify(data));
	GLOBALDATA = loadUserData();
}	

function loadUserData(){
	item=JSON.parse(localStorage.getItem("User_storage"));
	console.log(item);
	return item;
}	

function displayDate() {
    document.getElementById("demo").innerHTML = "Ronnie is the king!!!" + counter();
}

function isUrl(reportnum) {//ToDo automaticly add http and pass as param.
	var tempurl = document.getElementById(reportnum).value;
	var tempurl = tempurl.toLowerCase();
	if ( -1 == tempurl.indexOf("https://"))
		if ( -1 == tempurl.indexOf("http://")){
			tempurl = "http://"+tempurl;
			document.getElementById(reportnum).value = tempurl;
		}
	var urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
		if (urlRegex.test(tempurl) == false /*&& tempurl!=""*/) {
			return false;
		}
	return true;
}
