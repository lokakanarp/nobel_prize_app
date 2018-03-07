const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const addButton = document.getElementById("addButton");
const input = document.getElementById("input");
const errorMessage = document.getElementById("errorMessage");
var date = new Date();
var year = date.getFullYear();

//A function to display Laureates at the webpage
function displayLaureates(laureatesArray) {
	let lauretesHtml = "";
	lauretesHtml =
		`<p>${laureatesArray.prizes[0].laureates[0].firstname}</p>
			<p>${laureatesArray.prizes[0].laureates[0].surname}</p>`;
	nobelPrizeLaureates.innerHTML = lauretesHtml;
} //End of displayLauretes function

//A function to get Laureates from API
function getLaureates(searchValue) {
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

//A function to get libris from API
function getLibrisBooks() {
	fetch(`http://libris.kb.se/xsearch?query=W.V.+Quine&format=json`)
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



function checkInputNumber(searchValue) {
	if(searchValue >= 1901 && searchValue <= year - 1){
		getLaureates(searchValue);
		errorMessage.innerHTML = "";
	} else {
		nobelPrizeLaureates.innerHTML = "";
		errorMessage.innerHTML = `<p>We could not find a laureate for this year. Please try again.</p>`;
	}
}

addButton.addEventListener('click', function () {
	const searchValue = input.value;
	checkInputNumber(searchValue);
	input.value = "";
})
