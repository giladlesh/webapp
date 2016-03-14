

function locationHashChanged() {
	getHash();
	showRelevantTab()
}
window.onhashchange = locationHashChanged;



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

UTILS.addEvent(document.getElementById("myBtn"),"click",displayDate)

UTILS.addEvent(window,"DOMContentLoaded",showRelevantTab)



UTILS.ajax('file:///C:/Users/eshkar/Desktop/webapp/webapp/data/config.json',
	{
		method: 'GET',
		done: {
			call: function (data, res) {
				console.log(data);
			}
		}
	});



//document.getElementById("myBtn").addEventListener("click", displayDate);

king=2;

function counter() {
	king = king*king;
	return king;}

function displayDate() {
    document.getElementById("demo").innerHTML = "Ronnie is the king!!!" + counter();
}