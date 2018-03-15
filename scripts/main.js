const input = document.getElementById("input");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");
const yearp = document.getElementById("yearp");
const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const bookTitles = document.getElementById("bookTitles");
const motivation = document.getElementById("motivation");
const linksToMoreInfo = document.getElementById("linksToMoreInfo")
const moreInfo = document.getElementById("moreInfo");
const spinnerDiv = document.getElementById("spinnerDiv");

/*Function to fetch and display list of laureates from the same country. */
function fetchAllByBornCountry(country) {
	let byCountryArray = [];
	displaySpinner ();
	fetch(`http://api.nobelprize.org/v1/laureate.json?bornCountry=${country}`)
	.then(function (response) {
		return response.json();
	})
	.then(function (allByCountryData) {
		stopSpinner();
		/* Select only the literature category. */
		for(person of allByCountryData.laureates) {
			if (person.prizes[0].category == "literature") {
				/* Make the result into html with id and class and put it in an array */
				byCountryArray.push(`<p id="${person.prizes[0].year}" class="moreNames">${person.firstname} ${person.surname}</p>`);
			}
		}
		let namesCountryHtml = "";
		/*Make all of the array items into a string. */
		for (name of byCountryArray){
			namesCountryHtml += name;
		}
		/* Display the result on the webpage. */
		moreInfo.innerHTML = namesCountryHtml;
		/* Empy the array */
		byCountryArray = [];
		/* Get all the names on the list and loop through. Put eventlisteners on each. Use the year from the id to make new search.*/
		let moreNames = document.getElementsByClassName("moreNames");
		for(oneName of moreNames) {
			oneName.addEventListener('click', function () {
				const yearFromId = this.id;
				emptyAllFields();
				displayYear(yearFromId);
				checkInputNumber(yearFromId);
			})
		}
	})
	.catch(function (error) {
			standardErrorMessage (error);
		})
}
/*Function to reate links to display all awarded from the same country. */
function createCountryLinks(laureateInfoData) {
	let country = laureateInfoData.laureates[0].bornCountry;
		countryLinkHtml = `<div id="countryLink" class="countryLink"><h3>
						List of all laureates born in ${country}</h3></div>`;
	linksToMoreInfo.insertAdjacentHTML('beforeend', countryLinkHtml);
		const countryLink = document.getElementsByClassName("countryLink");
		for(link of countryLink){
			link.addEventListener('click', function () {
				fetchAllByBornCountry(country);
			})
		}
}
/* Function to display name, birth date and death date. */
function displayLaureateInfo(laureateInfoData) {
	let infoHtml = "";
	if(laureateInfoData.laureates[0].died == "0000-00-00"){
		infoHtml = `<h2>${laureateInfoData.laureates[0].firstname} ${laureateInfoData.laureates[0].surname}</h2><p class="bornInfo">Born ${laureateInfoData.laureates[0].born} in ${laureateInfoData.laureates[0].bornCountry}.</p>`;	
	}
	else {
	infoHtml = `<h2>${laureateInfoData.laureates[0].firstname} ${laureateInfoData.laureates[0].surname}</h2><p class="bornInfo">Born ${laureateInfoData.laureates[0].born} in ${laureateInfoData.laureates[0].bornCountry}. Deceased ${laureateInfoData.laureates[0].died} in ${laureateInfoData.laureates[0].diedCountry}.<p>`;
	}
	nobelPrizeLaureates.insertAdjacentHTML('beforeend', infoHtml);
	createCountryLinks(laureateInfoData);
}
//Function to fetch more info from Nobel Prize API.
function fetchMoreInfoById(id){
		displaySpinner ();
		fetch(`http://api.nobelprize.org/v1/laureate.json?id=${id}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (laureateInfoData) {
			stopSpinner();
			displayLaureateInfo(laureateInfoData);
		})
		.catch(function (error) {
			standardErrorMessage (error);
		})
}
//A function to display booktitles at the webpage.
function displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName) {
	let booksHtml = "";
	let booksArray = [];
	let filteredArray = [];
	/* Display heading of the titles first. */
	bookTitles.insertAdjacentHTML('beforeend', `<h2>Titles by ${laureateFirstName} ${laureateSurName}</h2>`);
	/* Select only titles in English */
	for (book of librisBooksData.xsearch.list) {
		if (book.language == "eng" && book.type == "book") {
			booksArray.push(book.title.toUpperCase());
			}
		}
	/* If there is no titles in English select any titles. */
	if (booksArray.length == 0){
		for (book of librisBooksData.xsearch.list) {
		if (book.type == "book") {
			booksArray.push(book.title.toUpperCase());
			}
		}
	}	
	/* Filter array to remove duplicates. */
	booksArray.forEach(function (item) {
		if (filteredArray.indexOf(item) < 0) {
			filteredArray.push(item);
			}
		});
	/* Choose only the first six titles to display. */
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
	/* Search Libris API using the firstname and surname from Nobel prize API result data. */
	displaySpinner ();
	fetch(`http://libris.kb.se/xsearch?query=f%C3%B6rf:(${laureateSurName} ${laureateFirstName})&format=json&n=200`)
		.then(function (response) {
			return response.json();
		})
		.then(function (librisBooksData) {
		stopSpinner();
		/* If the result is zero, make new fetch using only the surname of the laureate. */
			if (librisBooksData.xsearch.list.length == 0) {
				fetch(`http://libris.kb.se/xsearch?query=f%C3%B6rf:(${laureateSurName})&format=json&n=200`)
					.then(function (response) {
						return response.json();
					})
					.then(function (librisBooksData) {
						displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName);
					})
					.catch(function (error) {
						standardErrorMessage (error);
					})
			} else {
				displayLibrisBooks(librisBooksData, laureateFirstName, laureateSurName);
			}
		})
		.catch(function (error) {
			standardErrorMessage (error);
		
		})
} //End of getLibrisBooks function

/*A function to hand the laureate name to getLibrisBooks function and the id to fetchmoreInfoById function and to display the motivation at the webpage. */
function displayLaureates(laureatesData) {
	let laureatesHtml = "";
	let motivationHtml = "";
	if (laureatesData.prizes.length > 0) {
		for (laureate of laureatesData.prizes[0].laureates) {
			let laureateSurName = laureate.surname;
			let laureateFirstName = laureate.firstname;
			let id = laureate.id;
			getLibrisBooks(laureateFirstName, laureateSurName);
			fetchMoreInfoById(id);
			motivationHtml += `<p>${laureate.motivation}</p>`;
		}
	} else {
		yearp.innerHTML = `00<br>00`;;
		emptyAllFields();
		errorMessage.innerHTML = 
			`<p class="errormessage">No one was 
			awarded this year. Please try again.</p>`;
	}
	motivation.innerHTML = motivationHtml;
} //End of displayLauretes function



//A function to get Laureates from Nobel prize API
function getLaureates(searchValue) {
	displaySpinner ();
	fetch(`http://api.nobelprize.org/v1/prize.json?year=${searchValue}&category=literature`)
		.then(function (response) {
			return response.json();
		})
		.then(function (laureatesData) {
			stopSpinner();
			displayLaureates(laureatesData);
		})
		.catch(function (error) {
			standardErrorMessage (error);
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
		emptyAllFields();
		errorMessage.innerHTML = 
			`<p class="errormessage">We could not find a laureate for 
				this year. Please try again.</p>`;
	}
} //End of checkInputNumber function


function standardErrorMessage (error) {
	errorMessage.innerHTML = 
			`<p class="errormessage">Something went wrong. 
			Please try again.</p>`;
}

function displaySpinner () {
	spinnerDiv.innerHTML = `<div class="sk-fading-circle">
  <div class="sk-circle1 sk-circle"></div>
  <div class="sk-circle2 sk-circle"></div>
  <div class="sk-circle3 sk-circle"></div>
  <div class="sk-circle4 sk-circle"></div>
  <div class="sk-circle5 sk-circle"></div>
  <div class="sk-circle6 sk-circle"></div>
  <div class="sk-circle7 sk-circle"></div>
  <div class="sk-circle8 sk-circle"></div>
  <div class="sk-circle9 sk-circle"></div>
  <div class="sk-circle10 sk-circle"></div>
  <div class="sk-circle11 sk-circle"></div>
  <div class="sk-circle12 sk-circle"></div>
</div>`
}
function stopSpinner () {
	spinnerDiv.innerHTML = "";
}

//Function to display year
function displayYear(searchValue) {
	var dividedYear = `${searchValue.substring(0, 2)}<br>${searchValue.substring(2, 4)}`;
	yearp.innerHTML = dividedYear;
}
//Function to remove all data before new search is made.
function emptyAllFields(){
	bookTitles.innerHTML = "";
	nobelPrizeLaureates.innerHTML = "";
	motivation.innerHTML = "";
	moreInfo.innerHTML = "";	
	input.value = "";
	linksToMoreInfo.innerHTML = "";
}
//Search button
searchButton.addEventListener('click', function () {
	const value = input.value;
	emptyAllFields();
	displayYear(value);
	checkInputNumber(value);	
})
