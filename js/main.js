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

var GLOBALLASTTAB = oneOfTabs(getHash()) == true ? getHash(): "quick-reports";

var GLOBALINDEX = -1;

/***************************************************
	EVENTS section
****************************************************/

UTILS.addEvent(window,"DOMContentLoaded",init)

UTILS.addEvent(getElem("report-setting"),"click",function(){
	tab = getHash();
	if (tab == "quick-reports"){
		if (getElem("forms-quick").style.visibility == "hidden")
			setElemStyleVis("forms-quick","visible");
		else
			setElemStyleVis("forms-quick","hidden");
	}
	else{
		if (getElem("forms-team").style.visibility == "hidden")
			setElemStyleVis("forms-team","visible");
		else
			setElemStyleVis("forms-team","hidden");
	}
});

function inputsAddKeyEvent(){
	addInputEvents(GLOBALQRINPUTS,"report-save","report-cancel");
	addInputEvents(GLOBALTFINPUTS,"folder-save","folder-cancel");
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

UTILS.addEvent(getElem("search"),"keypress",function(){
	if (event.keyCode == 13)
		searchBox();
})

UTILS.addEvent(getElem("report-save"),"click",storeAction)

UTILS.addEvent(getElem("folder-save"),"click",storeAction)

UTILS.addEvent(getElem("report-cancel"),"click",function(){
	setElemStyleVis("forms-quick","hidden");
})
UTILS.addEvent(getElem("folder-cancel"),"click",function(){
	setElemStyleVis("forms-team","hidden");
})


/***************************************************
	UTILS functions section
****************************************************/

function getElem(elem){
	return document.getElementById(elem);
}

function oneOfTabs(tab){
	for (i=0; i<GLOBALTABS.length;i++)
		if (tab == GLOBALTABS[i])
			return true;
	return false;
}

function resetDropDownElems(){
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

function setInputsClass(arr,classn){
	for (i=0; i<arr.length; i++)
		getElem(arr[i]).className = classn;
}

function resetAllFormsBorders(tab){
	if (tab == "quick-reports")
		setInputsClass(GLOBALQRINPUTS,"border");
	else
		setInputsClass(GLOBALTFINPUTS,"border");
}

function firstToUpperCase(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
}

function setElemStyleVis(elem,mode){
	getElem(elem).style.visibility = mode;
}

function dropdownWrapperVis(vis){
	if (vis){
		setElemStyleVis("report-setting","visible");
		setElemStyleVis("dropdown","visible");
	}
	else{
		setElemStyleVis("report-setting","hidden");
		setElemStyleVis("dropdown","hidden");
	}
}

function addInputEvents(arr,save,cancel){
	for (i=0; i<arr.length; i++){
		UTILS.addEvent(getElem(arr[i]),"keypress",function() {
			if (event.keyCode == 13)
				getElem(save).click();
			else if (event.keyCode == 27)
				getElem(cancel).click();
		});
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
	setElemStyleVis(id,"visible");
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

function searchReport(field,json){
	found = false;
	ret = "";
	for (i=0 ; i < json.length && !found; i++){
		name = (json[i]["Name"]).toLowerCase();
		if (name.indexOf(field) != -1){
			found = true;
			ret = json[i]["Name"];
		}
	}
	return [found,i-1,0,ret];
}

/***************************************************
	INIT section
****************************************************/

function init(){
	setElemStyleVis("expand","hidden");
	showRelevantTab();
	inputsAddKeyEvent();
	if(checkLocalData()){
		GLOBALDATA = loadUserData();
		setDataForForms();
		GLOBALOPTIONFT = localStorage.getItem("User_opt_ft_storage");
		GLOBALOPTIONQR = localStorage.getItem("User_opt_qr_storage");
	}
	getNote();
	resetDropDownElems();
	hash = getHash();
	if (hash == "quick-reports" || hash == "my-team-folders")
		handleFormsVisability();
	handleFrameVisability(true);
	if (oneOfTabs(localStorage.getItem("User_tab_storage"))){//check by data!!!!
		GLOBALLASTTAB = localStorage.getItem("User_tab_storage");
		getElem(GLOBALLASTTAB+"-ref").click();
		GLOBALINDEX = 0;
		if (GLOBALLASTTAB == "quick-reports"){
			choosenOptAction(GLOBALOPTIONQR,"dynurl","forms-quick");
		}
		else if (GLOBALLASTTAB == "my-team-folders"){
			choosenOptAction(GLOBALOPTIONFT,"dynurlteam","forms-team");
		}
	}
}

function locationHashChanged() {
 	showRelevantTab();
	handleFormsVisability();
	handleFrameVisability(false);
	hash = getHash();
	if (oneOfTabs(hash)){
		GLOBALLASTTAB = hash;
		localStorage.setItem("User_tab_storage", GLOBALLASTTAB);
	}
 }
 window.onhashchange = locationHashChanged;

/***************************************************
	CORE functions section
****************************************************/

function searchBox() {
	UTILS.removeEvent(getElem("note"),"click",searchGoogle);
	field = (getElem("search").value).toLowerCase();
	if (field == ""){
		getNote();
		return;
	}
	var ret;
	retA = searchReport(field,GLOBALDATA.quick_reports);
	retB = searchReport(field,GLOBALDATA.my_folders);
	if (retA[0] == true){
		ret = retA;
		ret[2] = 1;
	}
	else{
		ret = retB;
	}
	if (ret[0]){
		getElem("note").innerHTML  = "Report name "+"<em><strong><ins>"+firstToUpperCase(ret[3])+"</em></strong></ins>"+" has been found";
		GLOBALINDEX = ret[1];
		if (ret[2]==1)
			getElem("quick-reports-ref").click(); // case when we are in same tab!!!
		else
			getElem("my-team-folders-ref").click();
	}
	else{
		getElem("note").innerHTML  = "Report name "+"<em><strong><ins>"+firstToUpperCase(field)+"</em></strong></ins>"+" has not been found in DB, Click to search Google";
		UTILS.addEvent(getElem("note"),"click",searchGoogle);
	}
}

function searchGoogle(){
	window.open("https://www.google.com/search?q="+field);
}

function changeTabClass(tab){
	if (GLOBALLASTTAB != "")
		getElem(GLOBALLASTTAB+"-label").classList.remove("selected");
	getElem(tab+"-label").className = ("selected");
}

function handleFormsVisability() {
	hash = getHash();
	if (hash == "quick-reports"){
		if (getElem("forms-quick").style.visibility == "hidden"){
			setElemStyleVis("forms-quick","visible");
			getElem("reportname01").focus();
		}
	}
	else if (hash == "my-team-folders"){
		if (getElem("forms-team").style.visibility == "hidden"){
			setElemStyleVis("forms-team","visible");
			getElem("foldername01").focus();
		}
	}
}
	
function choosenOptAction(opts,fram,forminput){
	dropdown = getElem("dropdown");
	dropdown.innerHTML = opts;
	if (GLOBALINDEX != -1){
		dropdown.selectedIndex = GLOBALINDEX;
		getElem(fram).src = dropdown.options[GLOBALINDEX].value;
		setElemStyleVis(forminput,"hidden");
	}
}

function showRelevantTab() {
	resetDropDownElems();
	setElemStyleVis("forms-quick","hidden");
	setElemStyleVis("forms-team","hidden");
	
	for (i=0; i<GLOBALTABS.length; i++){
		elem = document.getElementById(GLOBALTABS[i]);
		if (elem && elem.id != undefined && elem.id != null && elem.id != ""){
			elem.style.visibility = "hidden";
		}
	}
	dropdownWrapperVis(false);
	hash = getHash();
	if (oneOfTabs(hash)){
		changeTabClass(hash);
		setElemStyleVis(hash,"visible");
		getElem("keytab").style.height = "37em";
		getElem("ribbon-wrapper").style.background = "lightgray";
		if (GLOBALELEMEXPAND == true || getElem("expand").style.visibility == "hidden"){
			setElemStyleVis("expand","visible");
			GLOBALELEMEXPAND = false;
		}
		if (getElem(hash).id == "quick-reports" || getElem(hash).id == "my-team-folders"){
			dropdownWrapperVis(true);
			if (getElem(hash).id == "quick-reports")
				choosenOptAction(GLOBALOPTIONQR,"dynurl","forms-quick");
			else
				choosenOptAction(GLOBALOPTIONFT,"dynurlteam","forms-team");
		}
	}
	else{
		getElem("keytab").style.height = "0";
		getElem("ribbon-wrapper").style.background = "transparent";
		setElemStyleVis("expand","hidden");
		getElem(GLOBALLASTTAB+"-label").classList.remove("selected");
	}
}

function getNote(){
UTILS.ajax('https://raw.githubusercontent.com/giladlesh/webapp/gh-pages/data/config.json',
	{
		method: 'GET',
		done: {call: function (data, res) {getElem("note").innerHTML = JSON.parse(res).notification;}}
	});
}

function dropDownSrcVis(){
	url = "";
	tabforms = "";
	setElemStyleVis("dynurlteam","hidden");
	setElemStyleVis("dynurl","hidden");
	hash = getHash();
	if (hash == "quick-reports"){
		url = "dynurl";
		tabforms = "forms-quick";
	}
	else if(hash == "my-team-folders"){
		url = "dynurlteam";
		tabforms = "forms-team";
	}
	if (url.length){
		getElem(url).src = getElem("dropdown").value;
		setElemStyleVis(url,"visible");
		setElemStyleVis(tabforms,"hidden")
	}
}

function checkLocalData(){
	str = loadUserData();
	if ((str.quick_reports[0].Name == null || str.quick_reports[0].Name == "") &&
			(str.my_folders[0].Name == null || str.my_folders[0].Name == ""))
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

function storeToData(data,i,name,url){
	data[i]["Name"] = getElem(name).value;
	data[i]["URL"] = getElem(url).value;
	getElem(name).value = null;
	getElem(url).value = null;
}

function activateFormFrame(fram,global,storage,frms){
	elem = document.getElementById("dropdown");
	setElemStyleVis(fram,"visible");
	global = elem.innerHTML;
	localStorage.setItem(storage,global);
	choosenOptAction(global,fram,frms);
}
function storeAction(){
	resetDropDownElems();
	tab = getHash();
	index = 0;
	if (tab == "quick-reports"){
		for (i=1; i<=GLOBALDATA.quick_reports.length; i++){
			flag = checkForms("reportname0"+i,"reporturl0"+i);
			if (flag == "succeded")
				storeToData(GLOBALDATA.quick_reports,index++,"reportname0"+i,"reporturl0"+i);
		}
	}
	else {
		for (i=1; i<=GLOBALDATA.my_folders.length; i++){
			flag = checkForms("foldername0"+i,"folderurl0"+i);
			if (flag == "succeded")
				storeToData(GLOBALDATA.my_folders,index++,"foldername0"+i,"folderurl0"+i);
		}
	}
	localStorage.setItem("User_forms_storage", JSON.stringify(GLOBALDATA));
	GLOBALDATA = loadUserData();
	setDataForForms();
	GLOBALINDEX = --index;
	if (index >= 0){
		dropDownSrcVis();
		resetAllFormsBorders(tab);
		if (tab == "quick-reports")
			activateFormFrame("dynurl",GLOBALOPTIONQR,"User_opt_qr_storage","forms-quick");
		else if (tab == "my-team-folders")
			activateFormFrame("dynurlteam",GLOBALOPTIONFT,"User_opt_ft_storage","forms-team");
	}
}

function setDataForForms(){
	for (i = 1; i <= GLOBALDATA.quick_reports.length; i++){
		getElem("reportname0"+i).value = GLOBALDATA.quick_reports[i-1].Name;
		getElem("reporturl0"+i).value = GLOBALDATA.quick_reports[i-1].URL;
		getElem("foldername0"+i).value = GLOBALDATA.my_folders[i-1].Name;
		getElem("folderurl0"+i).value = GLOBALDATA.my_folders[i-1].URL;
	}
}	

function loadUserData(){
	return JSON.parse(localStorage.getItem("User_forms_storage"));
}