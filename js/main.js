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
		]/*,
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
		]*/
};

function init(){
	showRelevantTab();
	if(checkLocalData())
		GLOBALDATA = loadUserData();
	getNote();
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

function hideForms() {//ToDo: other set of forms
    if (document.getElementById("forms-qr").style.visibility == "hidden"){
		document.getElementById("forms-qr").style.visibility = "visible";
		document.getElementById("reportname01").focus();
	}
	else{
		document.getElementById("forms-qr").style.visibility = "hidden";
	}
}

function showRelevantTab() {
    document.getElementById("quick-reports").style.visibility = "hidden";
	document.getElementById("fmy-folders").style.visibility = "hidden";
	document.getElementById("my-team-folders").style.visibility = "hidden";
	document.getElementById("public-folders").style.visibility = "hidden";
	document.getElementById(getHash()).style.visibility = "visible";
}

function getHash() {
	str =window.location.hash;
    str = str.substr(1);	
	if (str.length == 0)
		return "quick-reports";
	return str;
}

UTILS.addEvent(window,"DOMContentLoaded",init)

function getNote(){
UTILS.ajax('https://raw.githubusercontent.com/giladlesh/webapp/gh-pages/data/config.json',
	{
		method: 'GET',
		done: {
			call: function (data, res) {
				console.log(JSON.parse(res).notification);
				document.getElementById("note").innerHTML = JSON.parse(res).notification;
			}
		}
	});
}

UTILS.addEvent(document.getElementById("report-setting"),"click",hideForms)

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

function storeAction(){
	storeUserData();
	if (document.getElementById("reportname01").value != null
		&& !isUrl()){
			document.getElementById("reporturl02").focus();
		}
	else{
		storeUserData();
		document.getElementById('dynurl').src = document.getElementById("reporturl01").value;
		document.getElementById("reporturl03").focus();
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
		]/*,
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
		]*/
	}
	localStorage.setItem("User_storage", JSON.stringify(data));
	GLOBALDATA = loadUserData();
}	

function loadUserData(){
	item=JSON.parse(localStorage.getItem("User_storage"));
	console.log(item);
	return item;
}	

king=2;

function counter() {
	king = king*king;
	return king;}

function displayDate() {
    document.getElementById("demo").innerHTML = "Ronnie is the king!!!" + counter();
}

function isUrl() {//ToDo automaticly add http and pass as param.
	var tempurl = document.getElementById("reporturl01").value;
	var urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
		if (urlRegex.test(tempurl) == false && tempurl!="") {
			return false;
		}
	return true;
}
