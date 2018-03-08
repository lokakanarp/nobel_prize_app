const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const bookTitles = document.getElementById("bookTitles");
const addButton = document.getElementById("addButton");
const input = document.getElementById("input");
const errorMessage = document.getElementById("errorMessage");


//A function to display Laureates at the webpage and handing the name to getLibrisBooks function
function displayLaureates(laureatesData) {
	let laureatesHtml = "";
	if(laureatesData.prizes.length > 0){
		let laureateName = `${laureatesData.prizes[0].laureates[0].surname},  ${laureatesData.prizes[0].laureates[0].firstname}`;
			console.log(laureateName);
		getLibrisBooks(laureateName);
		for(laureate of laureatesData.prizes[0].laureates){
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
		.then(function (laureatesData) {
			displayLaureates(laureatesData);
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

//A function to display booktitles at the webpage.
function displayLibrisBooks(librisBooksData) {
	let booksHtml = "";
	let booksArray = [];
	for(book of librisBooksData.xsearch.list){
		if(book.language == "eng" && book.type == "book"){
		booksArray.push(book.title);
		}
		//`<p>${laureate.firstname}
			//${laureate.surname}</p>`;
	}
	console.log(booksArray);
	//nobelPrizeLaureates.innerHTML = booksHtml;
} //End of displayLauretes function


//A function to get books from Libris API
function getLibrisBooks(laureateName) {
	//fetch(`http://libris.kb.se/xsearch?query=${laureateName}&format=json`)
	fetch(`http://libris.kb.se/xsearch?query=f%C3%B6rf:(${laureateName})&format=json&n=200`)
		.then(function (response) {
			return response.json();
		})
		.then(function (librisBooksData) {
			if(librisBooksData.xsearch.list.length == 0) {
				console.log("ett problem")
			} else {
			displayLibrisBooks(librisBooksData);
			console.log(librisBooksData);
			}
		})
		.catch(function (error) {
			console.log(error);
		})
} //End of getLibrisBooks function

function checkLaureateName(laureateName) {
	
}




addButton.addEventListener('click', function () {
	const searchValue = input.value;
	checkInputNumber(searchValue);
	input.value = "";
})
