/***************************************************
	GLOBAL VARS section
****************************************************/

var GLOBALDATA = {
		"quick_reports":[
			{
				"Name":null,"URL":null
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

var GLOBALTFINPUTS =["foldername01","foldername02","foldername03","folderurl01", "folderurl02","folderurl03"];

var GLOBALQRINPUTS =["reportname01", "reportname02","reportname03","reporturl01", "reporturl02","reporturl03"];

var GLOBALTABS = ["quick-reports","my-folders","my-team-folders","public-folders"]



/***************************************************
	EVENTS section
****************************************************/

UTILS.addEvent(window,"DOMContentLoaded",init)

UTILS.addEvent(getElem("report-setting"),"click",handleFormsVisability)

function inputsAddKeyEvent(){
	for (i=0; i<GLOBALQRINPUTS.length; i++){
		UTILS.addEvent(getElem(GLOBALQRINPUTS[i]),"keypress",function() {
			if (event.keyCode == 13)
				getElem("report-save").click();
			else if (event.keyCode == 27)
				getElem("report-cancel").click();
		});
	}
	for (i=0; i<GLOBALTFINPUTS.length; i++){
		UTILS.addEvent(getElem(GLOBALTFINPUTS[i]),"keypress",function() {
			if (event.keyCode == 13)
				getElem("folder-save").click();
			else if (event.keyCode == 27)
				getElem("folder-cancel").click();
		});
	}
}

UTILS.addEvent(getElem("dropdown"),"change",dropDownSrcVis);

UTILS.addEvent(getElem("expand"),"click",function(){
	url = getElem("dropdown").value;
	window.open(url);
})

UTILS.addEvent(getElem("report-save"),"click",storeAction)

UTILS.addEvent(getElem("report-cancel"),"click",function(){
	getElem("forms-qr").style.visibility = "hidden";
})


/***************************************************
	UTILS functions section
****************************************************/

function getElem(elem){
	return document.getElementById(elem);
}

function resetSelectElems(){
	var tag = getElem("dropdown");
	var length = tag.options.length;
	for (i = 0; i < length; i++) {
		tag.remove(tag.length-1);	
	}
}
/*
function locationHashChanged() {
	console.log("Hello")
	showRelevantTab();
}*/
window.onhashchange = locationHashChanged();

function dropdownVisibility(vis) {
	if (vis == true)
		getElem("dropdown").style.visibility = "visible";
	else
		getElem("dropdown").style.visibility = "hidden";
}

function getHash() {
	str = window.location.hash;
    str = str.substr(1);
	return str;
}

function resetAllFormsBorders(temp){
	if (temp){
		for (i=0; i<GLOBALQRINPUTS.length; i++)
			getElem(GLOBALQRINPUTS[i]).className = "border";
	}
}

function resetAllTabsVis(tab){
	for (i=0; i<.length; i++)
		getElem(GLOBALTABS[i]).className = "z-index-low";
	}
	if (tabs != null)
		getElem(tab).className = "z-index-high";
}

function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function dropdownWrapperVis(vis){
	elem = getElem("dropdown-wrapper");
	if (vis)
		elem.style.visibility= "visible";
	else
		elem.style.visibility= "hidden";
}

/***************************************************
	INIT section
****************************************************/


function init(){
	showRelevantTab();
	inputsAddKeyEvent();
	if(checkLocalData())
		GLOBALDATA = loadUserData();
	getNote();
	resetSelectElems();
	getElem("dynurl").style.visibility = "hidden";
	getElem("dynurlteam").style.visibility = "hidden";
	
}

/***************************************************
	CORE functions section
****************************************************/

function handleFormsVisability() {
	curr_form = getHash();
	if (curr_form == "quick-reports"){
		var elem = getElem("forms-qr");
		if (elem.style.visibility == "hidden"){
			elem.style.visibility = "visible";
			getElem("reportname01").focus();
		}
		else{
			elem.style.visibility = "hidden";
		}
	}
	else if (curr_form == "my-team-folders"){
		var elem = getElem("forms-tf");
		if (elem.style.visibility == "hidden"){
			elem.style.visibility = "visible";
			getElem("foldername01").focus();
		}
		else{
			elem.style.visibility = "hidden";
		}
	}
}

function showRelevantTab() {
	for (i=0; i<GLOBALTABS.length; i++)
		getElem(GLOBALTABS[i]).style.visibility = "hidden";
	dropdownWrapperVis(false);
	
	if (getHash() != "" || getHash() != null){
		var elem = getElem(getHash());
		if (elem == "quick-reports" || elem == "my-team-folders"){
			elem.style.visibility = "visible";
			dropdownWrapperVis(true);
			handleFormsVisability();
		}
	}
}

function getNote(){
UTILS.ajax('https://raw.githubusercontent.com/giladlesh/webapp/gh-pages/data/config.json',
	{
		method: 'GET',
		done: {
			call: function (data, res) {
				getElem("note").innerHTML = JSON.parse(res).notification;
			}
		}
	});
}

function dropDownSrcVis(){
	url = "";
	if (getHash() == "quick-reports"){
		getElem("dynurlteam").style.visibility = "hidden";
		url = "dynurl";
	}
	else if(getHash() == "my-team-folders"){
		getElem("dynurl").style.visibility = "hidden";
		url = "dynurlteam";
	}
	if (url.length){
		getElem(url).src = getElem("dropdown").value;
		getElem(url).style.visibility = "visible";
	}
}

function checkLocalData(){
	str = loadUserData(); // need to change load
	if (str === null)
		return false;
	return true;
}

function checkForms(name,url){
	flag = "init";
	if (getElem(name).value != ""
		&& isUrl(url)){
			createElemDropdown(getElem(name).value,getElem(url).value);
			flag = "succeded";
		}
	else if (getElem(name).value != ""
		&& !isUrl(url)){
			getElem(url).focus();
			getElem(url).className = "borderlight";
			flag = url;
		}
	else if (getElem(name).value == ""
		&& getElem(url).value != ""){
			getElem(name).focus();
			getElem(name).className = "borderlight";
			flag = name;
		}
	return flag
}

function createElemDropdown(name,url){
	var z = document.createElement("option");
    z.setAttribute("value", url);
	var t = document.createTextNode(firstToUpperCase(name));
    z.appendChild(t);
    getElem("dropdown").appendChild(z);
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
		getElem("forms-qr").style.visibility = "hidden";
		dropDownSrcVis();
		resetAllFormsBorders(true);
	}
}

function storeUserData(){
	data = {
		"quick_reports":[
			{
				"Name":getElem("reportname01").value,
				"URL":getElem("reporturl01").value
			},
			{
				"Name":getElem("reportname02").value,
				"URL":getElem("reporturl02").value
			}, 
			{
				"Name":getElem("reportname03").value,
				"URL":getElem("reporturl03").value
			}
		],
		"my_folders":[
			{
				"Name":getElem("foldername01").value,
				"URL":getElem("folderurl01").value
			},
			{
				"Name":getElem("foldername02").value,
				"URL":getElem("folderurl02").value
			}, 
			{
				"Name":getElem("foldername03").value,
				"URL":getElem("folderurl03").value
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

function isUrl(reportnum) {
	var tempurl = getElem(reportnum).value.toLowerCase();
	if ( -1 == tempurl.indexOf("https://"))
		if ( -1 == tempurl.indexOf("http://")){
			tempurl = "http://"+tempurl;
			getElem(reportnum).value = tempurl;
		}
	var urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
		if (urlRegex.test(tempurl) == false) {
			return false;
		}
	return true;
}
