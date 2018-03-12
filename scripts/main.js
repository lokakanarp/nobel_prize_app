const input = document.getElementById("input");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");
const yearp = document.getElementById("yearp");
const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const bookTitles = document.getElementById("bookTitles");
const motivation = document.getElementById("motivation");



/*A function to display laureates at the webpage and 
handing the laureate name to getLibrisBooks function*/
function displayLaureates(laureatesData) {
	let laureatesHtml = "";
	let motivationHtml = "";
	if (laureatesData.prizes.length > 0) {
		for (laureate of laureatesData.prizes[0].laureates) {
			let laureateSurName = `${laureate.surname}`;
			let laureateFirstName = `${laureate.firstname}`;
			console.log(laureateFirstName, laureateSurName);
			getLibrisBooks(laureateFirstName, laureateSurName);
			laureatesHtml +=
				`<p>${laureate.firstname}
				${laureate.surname}</p>`;
			motivationHtml += `<p>${laureate.motivation}</p>`;
		}
	} else {
		yearp.innerHTML = `00<br>00`;;
		nobelPrizeLaureates.innerHTML = "";
		motivation.innerHTML = "";
		bookTitles.innerHTML = "";
		errorMessage.innerHTML = 
			`<p class="errormessage">No one was 
			awarded this year. Please try again.</p>`;
	}
	nobelPrizeLaureates.innerHTML = laureatesHtml;
	motivation.innerHTML = motivationHtml;
} //End of displayLauretes function

//A function to get Laureates from Nobel prize API
function getLaureates(searchValue) {
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
	if (searchValue >= 1901 && searchValue <= year - 1) {
		getLaureates(searchValue);
		errorMessage.innerHTML = "";
	} else {
		yearp.innerHTML = `00<br>00`;
		nobelPrizeLaureates.innerHTML = "";
		motivation.innerHTML = "";
		bookTitles.innerHTML = "";
		errorMessage.innerHTML = 
			`<p class="errormessage">We could not find a laureate for 
				this year. Please try again.</p>`;
	}
} //End of checkInputNumber function

//Functions concerning Libris API

//A function to display booktitles at the webpage.
function displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName) {
	let booksHtml = "";
	let booksArray = [];
	let filteredArray = [];
	/* Display heading of the titles first */
	bookTitles.insertAdjacentHTML('beforeend', `<h2>Titles: ${laureateFirstName} ${laureateSurName}</h2>`);
	/* Select only titles in English */
	for (book of librisBooksData.xsearch.list) {
		if (book.language == "eng" && book.type == "book") {
			booksArray.push(book.title.toUpperCase());
			}
		}
	/* If there is no titles in English select any titles */
	if (booksArray.length == 0){
		for (book of librisBooksData.xsearch.list) {
		if (book.type == "book") {
			booksArray.push(book.title.toUpperCase());
			}
		}
	}	
	console.log(booksArray);
	/*Filter array to remove duplicates*/
	booksArray.forEach(function (item) {
		if (filteredArray.indexOf(item) < 0) {
			filteredArray.push(item);
			}
		});
	/* Choose only the first six titles to display */
	if (filteredArray.length > 6){
		for (let i = 0; i < 6; i++) {
			booksHtml += `<p>${filteredArray[i]}</p>`;
		}
	} else {
		for (item of filteredArray){
			booksHtml += `<p>${item}</p>`;
		}
	}
	/* Display the titles at the webpage */
	bookTitles.insertAdjacentHTML('beforeend', booksHtml);
} //End of displayLibrisBooks function

//A function to get books from Libris API
function getLibrisBooks(laureateFirstName, laureateSurName) {
	/* Search Libris API using the firstname and surname from Nobel prize API result. */
	fetch(`http://libris.kb.se/xsearch?query=f%C3%B6rf:(${laureateSurName} ${laureateFirstName})&format=json&n=200`)
		.then(function (response) {
			return response.json();
		})
		.then(function (librisBooksData) {
		/* If the result is zero, make new fetch using only the surname of the laureate. */
			if (librisBooksData.xsearch.list.length == 0) {
				fetch(`http://libris.kb.se/xsearch?query=f%C3%B6rf:(${laureateSurName})&format=json&n=200`)
					.then(function (response) {
						return response.json();
					})
					.then(function (librisBooksData) {
						displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName);
						console.log("ny sökning");
					})
					.catch(function (error) {
						console.log(error);
					})
			} else {
				displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName);
				console.log("lyckad sökning");
			}
		})
		.catch(function (error) {
			console.log(error);
		})
} //End of getLibrisBooks function

//Function to display year
function displayYear(searchValue) {
	var dividedYear = `${searchValue.substring(0, 2)}<br>${searchValue.substring(2, 4)}`;
	yearp.innerHTML = dividedYear;
}

searchButton.addEventListener('click', function () {
	const searchValue = input.value;
		bookTitles.innerHTML = "";
	displayYear(searchValue);
	checkInputNumber(searchValue);
	input.value = "";
})
