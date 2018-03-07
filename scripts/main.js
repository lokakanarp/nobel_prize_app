const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const addButton = document.getElementById("addButton");
const input = document.getElementById("input");
const errorMessage = document.getElementById("errorMessage");


//A function to display Laureates at the webpage and handing the name to getLibrisBooks function
function displayLaureates(laureatesArray) {
	let laureatesHtml = "";
	if(laureatesArray.prizes.length > 0){
	let laureateName = `${laureatesArray.prizes[0].laureates[0].firstname} ${laureatesArray.prizes[0].laureates[0].surname}`;
		console.log(laureateName);
	getLibrisBooks(laureateName);
	for(laureate of laureatesArray.prizes[0].laureates){
		laureatesHtml +=
		`<p>${laureate.firstname}
			${laureate.surname}</p>`;
	}
	}else {
		nobelPrizeLaureates.innerHTML = "";
		errorMessage.innerHTML = `<p>No one was awarded this year. Please try again.</p>`;
	}
	nobelPrizeLaureates.innerHTML = laureatesHtml;
} //End of displayLauretes function

//A function to get Laureates from Nobel prize API
function getLaureates(searchValue) {
	//var idOfLaureate = 0;
	fetch(`http://api.nobelprize.org/v1/prize.json?year=${searchValue}&category=literature`)
		.then(function (response) {
			return response.json();
		})
		.then(function (laureatesArray) {
			displayLaureates(laureatesArray);
		})
		.catch(function (error) {
			console.log(error);
		})
} //End of getLaureates function

//A function that checks the input value before the fetch is made.
function checkInputNumber(searchValue) {
	var date = new Date();
	var year = date.getFullYear();
	if(searchValue >= 1901 && searchValue <= year - 1){
		getLaureates(searchValue);
		errorMessage.innerHTML = "";
	} else {
		nobelPrizeLaureates.innerHTML = "";
		errorMessage.innerHTML = `<p>We could not find a laureate for this year. Please try again.</p>`;
	}
} //End of checkInputNumber function


//Functions concerning Libris API




//A function to get books from Libris API
function getLibrisBooks(laureateName) {
	fetch(`http://libris.kb.se/xsearch?query=${laureateName}&format=json`)
		.then(function (response) {
			return response.json();
		})
		.then(function (librisBooksArray) {
			//displayLibrisBooks(librisBooksArray);
			console.log(librisBooksArray);
		})
		.catch(function (error) {
			console.log(error);
		})
} //End of getLibrisBooks function
getLibrisBooks();




addButton.addEventListener('click', function () {
	const searchValue = input.value;
	checkInputNumber(searchValue);
	input.value = "";
})
