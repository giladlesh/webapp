/***************************************************
	GLOBAL VARS section
****************************************************/
function initGlobals(){
	GLOBALDATA = {
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

	GLOBALTFINPUTS =["foldername01","foldername02","foldername03","folderurl01", "folderurl02","folderurl03"];

	GLOBALQRINPUTS =["reportname01", "reportname02","reportname03","reporturl01", "reporturl02","reporturl03"];

	GLOBALTABS =["quick-reports","my-folders","my-team-folders","public-folders"];

	GLOBALFRAMES =["dynurl","my-folders-frame","dynurlteam","frame-public-folders"];

	GLOBALELEMEXPAND = true;
	
	GLOBALOPTIONQR = localStorage.getItem("User_opt_qr_storage") != null ? localStorage.getItem("User_opt_qr_storage") : null;

	GLOBALOPTIONFT = localStorage.getItem("User_opt_ft_storage") != null ? localStorage.getItem("User_opt_ft_storage") : null;

	GLOBALLASTTAB = oneOfTabs(localStorage.getItem("User_tab_storage")) == true ? localStorage.getItem("User_tab_storage"): oneOfTabs(getHash())==true ? getHash() : null;
	
	var index = localStorage.getItem("User_last_opt");
	if (index != null){
		GLOBALINDEXQR = JSON.parse(index).QR;
		GLOBALINDEXTF = JSON.parse(index).TF;
	}
	else{
		GLOBALINDEXQR = -1;
		GLOBALINDEXTF = -1;		
	}
	
	GLOBALFORMSSEARCH = false;
}
/***************************************************
	EVENTS section
****************************************************/

UTILS.addEvent(window,"DOMContentLoaded",init)

UTILS.addEvent(getElem("report-setting"),"click",function(){
	removeGoogleEvent(false);
	var tab = getHash();
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
	var tab = getHash();
	if (tab == "quick-reports" || tab == "my-team-folders"){
		if (getElem("dropdown").value != ""){
			window.open(getElem("dropdown").value);
		}
	}
	else{
		window.open(getElem(getTabFrame(tab)).src);
	}
})

function removeGoogleEvent(search){
	UTILS.removeEvent(getElem("note"),"click",searchGoogle);
	getElem("note").style.cursor = "";
	if (!search)
		getElem("search").value = "";
}

UTILS.addEvent(getElem("search"),"keyup",function(e){
	if (e.keyCode == 13)
		searchBox();
	else if (e.keyCode == 27){
		removeGoogleEvent(false);
	}
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
	if (tab == null)
		return false;
	for (i=0; i<GLOBALTABS.length;i++)
		if (tab == GLOBALTABS[i])
			return true;
	return false;
}

function resetDropDownElems(){
	while (getElem("dropdown").options.length){
		getElem("dropdown").remove(0);
	}
}

function getHash() {
	var str = window.location.hash;
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
	if (elem == "forms-quick" || elem == "forms-team"){
		if (mode == "visible")
			getElem("report-setting").style.backgroundColor = "whitesmoke";
		else
			getElem("report-setting").style.backgroundColor = "";
	}
}

function dropdownWrapperVis(vis){
	if (vis){
		setElemStyleVis("report-setting","visible");
		getElem("expand").style.marginLeft = "90%"
		getElem("expand").style.marginTop = "-1.6em"
		setElemStyleVis("dropdown","visible");
	}
	else{
		setElemStyleVis("report-setting","hidden");
		getElem("expand").style.marginLeft = "94.2%"
		getElem("expand").style.marginTop = "-1.8em"
		setElemStyleVis("dropdown","hidden");
	}
}

function addInputEvents(arr,save,cancel){
	for (i=0; i<arr.length; i++){
		UTILS.addEvent(getElem(arr[i]),"keyup",function(e) {
			if (e.keyCode == 13)
				getElem(save).click();
			else if (e.keyCode == 27)
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

function handleFrameVisability(){
	var fram = getTabFrame(getHash());
	if (fram != false)
		showFrame(fram);
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

function searchReport(field,json){
	var found = false;
	var ret = "";
	for (i=0 ; i < json.length && json[i]["Name"] != null && !found; i++){
		var name = (json[i]["Name"]).toLowerCase();
		if (name.indexOf(field) != -1){
			found = true;
			ret = json[i]["Name"];
		}
	}
	return ([found,i-1,"",ret]);
}

/***************************************************
	INIT section
****************************************************/

function init(){
	initGlobals();
	resetDropDownElems();
	setElemStyleVis("expand","hidden");
	showRelevantTab();
	inputsAddKeyEvent();
	if(checkLocalData()){
		GLOBALDATA = loadUserData();
		setDataForForms();
	}
	getNote();
	var hash = getHash();
	if (hash == "quick-reports" || hash == "my-team-folders")
		handleFormsVisability();
	handleFrameVisability();
	if (oneOfTabs(GLOBALLASTTAB)){
		getElem(GLOBALLASTTAB+"-ref").click();
		if (GLOBALLASTTAB == "quick-reports"){
			choosenOptAction(GLOBALOPTIONQR,"dynurl","forms-quick",GLOBALINDEXQR);
		}
		else if (GLOBALLASTTAB == "my-team-folders"){
			choosenOptAction(GLOBALOPTIONFT,"dynurlteam","forms-team",GLOBALINDEXTF);
		}
	}
}

function locationHashChanged() {
	removeGoogleEvent(false);
 	showRelevantTab();
	if (!GLOBALFORMSSEARCH){
		GLOBALFORMSSEARCH = false;
		handleFormsVisability();
	}
	handleFrameVisability();
	var hash = getHash();
	GLOBALLASTTAB = hash;
	localStorage.setItem("User_tab_storage", GLOBALLASTTAB);
 }
 window.onhashchange = locationHashChanged;

/***************************************************
	CORE functions section
****************************************************/

function searchBox() {
	removeGoogleEvent(true);
	var field = (getElem("search").value).toLowerCase();
	if (field == ""){
		getNote();
		return;
	}
	var ret = [false,-1,-1,""];
	var retA = searchReport(field,GLOBALDATA.quick_reports);
	var retB = searchReport(field,GLOBALDATA.my_folders);
	if (retA[0] == true){
		ret = retA;
		ret[2] = "quick-reports";
		GLOBALINDEXQR = ret[1];
	}
	else if (retB[0] == true){
		ret = retB;
		GLOBALINDEXTF = ret[1];
		ret[2] = "my-team-folders";
	}
	if (ret[0]){
		GLOBALFORMSSEARCH = true;
		getElem("note").innerHTML  = "Report name "+"<em><strong><ins>"+firstToUpperCase(ret[3])+"</em></strong></ins>"+" has been found";
		if (ret[2]=="quick-reports"){
			if (getHash() == "quick-reports"){
				choosenOptAction(GLOBALOPTIONQR,"dynurl","forms-quick",GLOBALINDEXQR);
			}
			else
				getElem("quick-reports-ref").click();
		}
		else{
			if (getHash() == "my-team-folders"){
				choosenOptAction(GLOBALOPTIONFT,"dynurlteam","forms-team",GLOBALINDEXTF);
			}
			else
				getElem("my-team-folders-ref").click();
		}
	}
	else{
		getElem("note").innerHTML  = "Report name "+"<em><strong><ins>"+firstToUpperCase(field)+"</em></strong></ins>"+" has not been found in forms, Click to search in Google";
		UTILS.addEvent(getElem("note"),"click",searchGoogle);
		getElem("note").style.cursor = "pointer";
	}
}

function searchGoogle(){
	window.open("https://www.google.com/search?q="+(getElem("search").value).toLowerCase());
}

function changeTabClass(tab){
	if (oneOfTabs(GLOBALLASTTAB) && GLOBALLASTTAB != tab)
		getElem(GLOBALLASTTAB+"-label").classList.remove("selected");
	getElem(tab+"-label").className = ("selected");
}

function handleFormsVisability() {
	var hash = getHash();
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
	
function choosenOptAction(opts,fram,forminput,index){
	var dropdown = getElem("dropdown");
	dropdown.innerHTML = opts;
	if (index != -1){
		dropdown.selectedIndex = index;
		getElem(fram).src = dropdown.options[index]["value"];
		setElemStyleVis(forminput,"hidden");
	}
}

function showRelevantTab() {
	resetDropDownElems();
	setElemStyleVis("forms-quick","hidden");
	setElemStyleVis("forms-team","hidden");
	for (i=0; i<GLOBALTABS.length; i++){
		var elem = document.getElementById(GLOBALTABS[i]);
		if (elem && elem.id != undefined && elem.id != null && elem.id != ""){
			elem.style.visibility = "hidden";
		}
	}
	dropdownWrapperVis(false);
	var hash = getHash();
	if (oneOfTabs(hash)){
		changeTabClass(hash);
		setElemStyleVis(hash,"visible");
		getElem("keytab").style.height = "37em";
		getElem("dashboard").style.background = "lightgray";
		if (GLOBALELEMEXPAND == true || getElem("expand").style.visibility == "hidden"){
			setElemStyleVis("expand","visible");
			GLOBALELEMEXPAND = false;
		}
		if (getElem(hash).id == "quick-reports" || getElem(hash).id == "my-team-folders"){
			dropdownWrapperVis(true);
			if (getElem(hash).id == "quick-reports")
				choosenOptAction(GLOBALOPTIONQR,"dynurl","forms-quick",GLOBALINDEXQR);
			else
				choosenOptAction(GLOBALOPTIONFT,"dynurlteam","forms-team",GLOBALINDEXTF);
		}
	}
	else{
		getElem("keytab").style.height = "0";
		getElem("dashboard").style.background = "transparent";
		setElemStyleVis("expand","hidden");
		if (oneOfTabs(GLOBALLASTTAB))
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

function dropDownSrcVis(store){
	var url = "";
	var tabforms = "";
	setElemStyleVis("dynurlteam","hidden");
	setElemStyleVis("dynurl","hidden");
	var hash = getHash();
	if (hash == "quick-reports"){
		url = "dynurl";
		tabforms = "forms-quick";
		if (store)
			GLOBALINDEXQR = getElem("dropdown").selectedIndex;
	}
	else if(hash == "my-team-folders"){
		url = "dynurlteam";
		tabforms = "forms-team";
		if (store)
			GLOBALINDEXTF = getElem("dropdown").selectedIndex;
	}
	if (url.length){
		getElem(url).src = getElem("dropdown").value;
		setElemStyleVis(url,"visible");
		setElemStyleVis(tabforms,"hidden")
	}
	localStorage.setItem("User_last_opt", JSON.stringify({"QR":GLOBALINDEXQR,"TF":GLOBALINDEXTF}));
}

function checkLocalData(){
	var str = loadUserData();
	if (str == null)
		return false;
	else if ((str.quick_reports[0].Name == null || str.quick_reports[0].Name == "") &&
			(str.my_folders[0].Name == null || str.my_folders[0].Name == ""))
		return false;
	return true;
}

function checkForms(name,url){
	var flag = "init";
	if (getElem(name).value != ""
		&& isUrl(url)){
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

function createElemDropdown(data,rep_name,rep_url){
	for (i = 0; i < data.length; i++){
		name = data[i].Name;
		url = data[i].URL;
		if (name != null && name != "null" && name != undefined && name != ""){
			z = document.createElement("option");
			z.setAttribute("value", url);
			t = document.createTextNode(firstToUpperCase(name));
			z.appendChild(t);
			getElem("dropdown").appendChild(z);
			j = i+1
			getElem(rep_name+j).value = null;
			getElem(rep_url+j).value = null;
		}
	}
}

function storeToData(data,i,name,url){
	data[i]["Name"] = getElem(name).value;
	data[i]["URL"] = getElem(url).value;
}

function activateFormFrame(fram,global,storage,frms,index){
	setElemStyleVis(fram,"visible");
	global = document.getElementById("dropdown").innerHTML;
	localStorage.setItem(storage,global);
	choosenOptAction(global,fram,frms,index);
}
function storeAction(){
	resetDropDownElems();
	var tab = getHash();
	var index = 0;
	if (tab == "quick-reports"){
		for (i = 1; i <= GLOBALDATA.quick_reports.length; i++){
			var flag = checkForms("reportname0"+i,"reporturl0"+i);
			if (flag == "succeded")
				storeToData(GLOBALDATA.quick_reports,index++,"reportname0"+i,"reporturl0"+i);
			else if (flag != "init" && flag != "succeded")
				return
			GLOBALINDEXQR = index-1;
		}
		createElemDropdown(GLOBALDATA.quick_reports,"reportname0","reporturl0");
		GLOBALOPTIONQR = getElem("dropdown").innerHTML;
	}
	else {
		for (i = 1; i <= GLOBALDATA.my_folders.length; i++){
			var flag = checkForms("foldername0"+i,"folderurl0"+i);
			if (flag == "succeded")
				storeToData(GLOBALDATA.my_folders,index++,"foldername0"+i,"folderurl0"+i);
			else if (flag != "init" && flag != "succeded")
				return
			GLOBALINDEXTF = index-1;
		}
		createElemDropdown(GLOBALDATA.my_folders,"foldername0","folderurl0");
		GLOBALOPTIONFT = getElem("dropdown").innerHTML;
	}
	localStorage.setItem("User_forms_storage", JSON.stringify(GLOBALDATA));
	localStorage.setItem("User_last_opt", JSON.stringify({"QR":GLOBALINDEXQR,"TF":GLOBALINDEXTF}));
	GLOBALDATA = loadUserData();
	setDataForForms();
	if (index >= 0){
		dropDownSrcVis(false);
		resetAllFormsBorders(tab);
		if (tab == "quick-reports")
			activateFormFrame("dynurl",GLOBALOPTIONQR,"User_opt_qr_storage","forms-quick",GLOBALINDEXQR);
		else if (tab == "my-team-folders")
			activateFormFrame("dynurlteam",GLOBALOPTIONFT,"User_opt_ft_storage","forms-team",GLOBALINDEXTF);
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
