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

var GLOBALTABS =["quick-reports","my-folders","my-team-folders","public-folders"];

var GLOBALFRAMES =["dynurl","my-folders-frame","dynurlteam","frame-public-folders"];

var GLOBALELEMEXPAND = true;

var GLOBALOPTIONQR;

var GLOBALOPTIONFT;

/***************************************************
	EVENTS section
****************************************************/

UTILS.addEvent(window,"DOMContentLoaded",init)

UTILS.addEvent(getElem("report-setting"),"click",function(){
	tab = getHash();
	if (tab == "quick-reports"){
		if (getElem("forms-quick").style.visibility == "hidden")
			getElem("forms-quick").style.visibility = "visible";
		else
			getElem("forms-quick").style.visibility = "hidden";
	}
	else{
		if (getElem("forms-team").style.visibility == "hidden")
			getElem("forms-team").style.visibility = "visible";
		else
			getElem("forms-team").style.visibility = "hidden";
	}
});

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
	tab = getHash();
	if (tab == "quick-reports" || tab == "my-team-folders"){
		if (getElem("dropdown").value != ""){
			window.open(getElem("dropdown").value);
		}
	}
	else{
		window.open(getElem(getTabFrame(tab)).src);
	}
})

UTILS.addEvent(getElem("report-save"),"click",storeAction)

UTILS.addEvent(getElem("folder-save"),"click",storeAction)

UTILS.addEvent(getElem("report-cancel"),"click",function(){
	getElem("forms-quick").style.visibility = "hidden";
})
UTILS.addEvent(getElem("folder-cancel"),"click",function(){
	getElem("forms-team").style.visibility = "hidden";
})


/***************************************************
	UTILS functions section
****************************************************/

function getElem(elem){
	return document.getElementById(elem);
}

function resetSelectElems(){
	tag = getElem("dropdown");
	length = tag.options.length;
	for (i = 0; i < length; i++) {
		tag.remove(tag.length-1);	
	}
}

function getHash() {
	str = window.location.hash;
    str = str.substr(1);
	return str;
}

function resetAllFormsBorders(temp,tab){
	if (temp){
		if (tab == "quick-reports"){
			for (i=0; i<GLOBALQRINPUTS.length; i++){
				getElem(GLOBALQRINPUTS[i]).className = "border";
			}
		}
		else{
			for (i=0; i<GLOBALTFINPUTS.length; i++){
				getElem(GLOBALTFINPUTS[i]).className = "border";
			}
		}
	}
}

function firstToUpperCase(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
}

function dropdownWrapperVis(vis){
	elem_1 = getElem("report-setting");
	elem_2 = getElem("dropdown");
	if (vis){
		elem_1.style.visibility= "visible";
		elem_2.style.visibility= "visible";
	}
	else{
		elem_1.style.visibility= "hidden";
		elem_2.style.visibility= "hidden";
	}
}

function getTabFrame(tab){
	if (tab == "" || tab == null)
		tab = getHash();
	if (tab == "quick-reports")
		return("dynurl");
	else if (tab == "my-folders")
		return("my-folders-frame");
	else if (tab == "my-team-folders")
		return("dynurlteam");
	else if (tab == "public-folders")
		return("public-folders-frame");
	else
		return false;
}

function showFrame(id){
	document.getElementById(id).style.visibility = "visible";
}

function handleFrameVisability(first){
	if (!first){
		fram = getTabFrame(getHash());
		if (fram != false)
			showFrame(fram);
	}
}

function isUrl(reportnum) {
	tempurl = getElem(reportnum).value.toLowerCase();
	if ( -1 == tempurl.indexOf("https://"))
		if ( -1 == tempurl.indexOf("http://")){
			tempurl = "http://"+tempurl;
			getElem(reportnum).value = tempurl;
		}
	urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
		if (urlRegex.test(tempurl) == false) {
			return false;
		}
	return true;
}

/***************************************************
	INIT section
****************************************************/

function init(){
	getElem("expand").style.visibility = "hidden";
	showRelevantTab();
	inputsAddKeyEvent();
	if(checkLocalData())
		GLOBALDATA = loadUserData();
	getNote();
	resetSelectElems();
	hash = getHash();
	if (hash == "quick-reports" || hash == "my-team-folders")
		handleFormsVisability();
	handleFrameVisability(true);
}

function locationHashChanged() {
 	showRelevantTab();
	handleFormsVisability();
	handleFrameVisability(false);
 }
 window.onhashchange = locationHashChanged;


/***************************************************
	CORE functions section
****************************************************/

function handleFormsVisability() {
	hash = getHash();
	if (hash == "quick-reports"){
		if (getElem("forms-quick").style.visibility == "hidden"){
			getElem("forms-quick").style.visibility = "visible";
			getElem("reportname01").focus();
		}
	}
	else if (hash == "my-team-folders"){
		if (getElem("forms-team").style.visibility == "hidden"){
			getElem("forms-team").style.visibility = "visible";
			getElem("foldername01").focus();
		}
	}
}

function showRelevantTab() {
	resetSelectElems();
	getElem("forms-quick").style.visibility = "hidden";
	getElem("forms-team").style.visibility = "hidden";
	
	for (i=0; i<GLOBALTABS.length; i++){
		elem = document.getElementById(GLOBALTABS[i]);
		if (elem && elem.id != undefined && elem.id != null && elem.id != ""){
			elem.style.visibility = "hidden";
		}
	}
	dropdownWrapperVis(false);
	hash = getHash();
	if (hash != ""){
		getElem(hash).style.visibility = "visible";
		getElem("keytab").style.height = "37em";
		getElem("ribbon-wrapper").style.background = "lightgray";
		if (GLOBALELEMEXPAND == true || getElem("expand").style.visibility == "hidden"){
			getElem("expand").style.visibility = "visible";
			GLOBALELEMEXPAND = false;
		}
		if (getElem(hash).id == "quick-reports" || getElem(hash).id == "my-team-folders"){
			dropdownWrapperVis(true);
			elem = document.getElementById('dropdown');
			if (getElem(hash).id == "quick-reports")
				elem.innerHTML = GLOBALOPTIONQR;
			else
				elem.innerHTML = GLOBALOPTIONFT;
		}
	}
	else{
		getElem("keytab").style.height = "0";
		getElem("ribbon-wrapper").style.background = "transparent";
		getElem("expand").style.visibility = "hidden";
	}
	return hash;
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
	getElem("dynurlteam").style.visibility = "hidden";
	getElem("dynurl").style.visibility = "hidden";
	hash = getHash();
	if (hash == "quick-reports"){
		url = "dynurl";
	}
	else if(hash == "my-team-folders"){
		url = "dynurlteam";
	}
	if (url.length){
		getElem(url).src = getElem("dropdown").value;
		getElem(url).style.visibility = "visible";
	}
}

function checkLocalData(){
	str = loadUserData();
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
	z = document.createElement("option");
    z.setAttribute("value", url);
	t = document.createTextNode(firstToUpperCase(name));
    z.appendChild(t);
    getElem("dropdown").appendChild(z);
}


function storeAction(){
	resetSelectElems();
	flag = "";
	tab = getHash();
	if (tab == "quick-reports"){
		flag = checkForms("reportname01","reporturl01");
		if (flag == "succeded"){
			flag = checkForms("reportname02","reporturl02");
		}
		if (flag == "succeded"){
			flag = checkForms("reportname03","reporturl03");
		}
	}
	else{
		flag = checkForms("foldername01","folderurl01");
		if (flag == "succeded"){
			flag = checkForms("foldername02","folderurl02");
		}
		if (flag == "succeded"){
			flag = checkForms("foldername03","folderurl03");
		}
	}
	if (flag == "succeded" || flag == "init"){
		storeUserData();
		dropDownSrcVis();
		resetAllFormsBorders(true,tab);
		elem = document.getElementById("dropdown");
		if (tab == "quick-reports"){
			getElem("forms-quick").style.visibility = "hidden";
			getElem("dynurl").style.visibility = "visible";
			GLOBALOPTIONQR = elem.innerHTML;
		}
		if (tab == "my-team-folders"){
			getElem("forms-team").style.visibility = "hidden";
			getElem("dynurlteam").style.visibility = "visible";
			GLOBALOPTIONFT = elem.innerHTML;
		}
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
	return item;
}