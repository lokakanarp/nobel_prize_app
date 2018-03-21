const input = document.getElementById("input");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");
const year = document.getElementById("year");
const nobelPrizeLaureates = document.getElementById("nobelPrizeLaureates");
const bookTitles = document.getElementById("bookTitles");
const motivation = document.getElementById("motivation");
const linksToMoreInfo = document.getElementById("linksToMoreInfo");
const genderLinkDiv = document.getElementById("genderLinkDiv");
const linkToAllLiving = document.getElementById("linkToAllLiving");
const moreInfo = document.getElementById("moreInfo");
const spinnerDiv = document.getElementById("spinnerDiv");

/* Function to display how many men and women who have been awarded. */
function displayGenderRatio(allData) {
	let allLiteratureArray = [];
	let sum = 0;
	for(lit of allData.laureates) {
		if (lit.prizes[0].category == "literature") {
			allLiteratureArray.push(lit);
			sum++
		}
	}
	let fem = 0;
	for (person of allLiteratureArray) {
		if (person.gender == "female") {
			fem++
		}
	}
	moreInfo.innerHTML = `<p>Out of<br><span class="bigger">${sum}</span> laureates there are<br><span class="bigger">${fem}</span> women and<br><span class="bigger">${sum - fem}</span> men.</p>`;
} /* End of genderRatio function */

/* Function to sort and display list of living laureates and make the names into links by adding eventlisteners. */
function displayAllLiving(allData) {
	let allLivingArray = [];
	let allLivingLiteratureArray = [];
		for(live of allData.laureates) {
			if(live.died == "0000-00-00")
				allLivingArray.push(live);
		}
		for(lit of allLivingArray) {
			if (lit.prizes[0].category == "literature") {
				allLivingLiteratureArray.push(`<p id="${lit.prizes[0].year}" class="livingNames">${lit.firstname} ${lit.surname}</p>`);
			}
		}
		let namesLivingHtml = "";
		for (nameLiving of allLivingLiteratureArray){
			namesLivingHtml += nameLiving;
		}
		moreInfo.innerHTML = namesLivingHtml;
		allLivingLiteratureArray = [];
		let livingNames = document.getElementsByClassName("livingNames");
		for(livingName of livingNames) {
			livingName.addEventListener('click', function () {
				const yearFromId = this.id;
				emptyAllFields();
				displayYear(yearFromId);
				checkInputNumber(yearFromId);
			})
		}
} /* End of displayAll function. */ 

/* Function to fetch list of all laureates and hand the data to genderRatio(). */
function getAllGender() {
	displaySpinner ();
	fetch("http://api.nobelprize.org/v1/laureate.json?")
	.then(function (response) {
		return response.json();
	})
	.then(function (allData) {
		stopSpinner();
		displayGenderRatio(allData);
	})
	.catch(function (error) {
			standardErrorMessage (error);
		})
} /* End of fetch function. */

/* Function to fetch list of all laureates and hand the data to displayAll(). */
function getAllLiving() {
	displaySpinner ();
	fetch("http://api.nobelprize.org/v1/laureate.json?")
	.then(function (response) {
		return response.json();
	})
	.then(function (allData) {
		stopSpinner();
		displayAllLiving(allData);
	})
	.catch(function (error) {
			standardErrorMessage (error);
		})
} /* End of fetch function. */

/* Function to create link to gender ratio. */
function createGenderLink() {
	genderLinkHtml = `<div id="genderLink" class="genderLink"><h3>
						Gender ratio</h3></div>`;
	genderLinkDiv.innerHTML = genderLinkHtml;
	const genderLink = document.getElementById("genderLink");
	genderLink.addEventListener('click', function () {
		getAllGender();
	})		
} /* End of createGender function. */

/* Function to create link to list of all living laureates. */
function createLivingLink() {
	livingLinkHtml = `<div id="livingLink" class="livingLink"><h3>
						List of all living laureates</h3></div>`;
	linkToAllLiving.innerHTML = livingLinkHtml;
	const livingLink = document.getElementById("livingLink");
	livingLink.addEventListener('click', function () {
		getAllLiving();
	})		
} /* End of createLivingLink function. */

/* Function to display list of laureates from the same country and make the names into links by adding eventlisteners. */
function displayAllByBornCountry(allByCountryData) {
/* Select only the literature category. */
	let byCountryArray = [];
		for(person of allByCountryData.laureates) {
			if (person.prizes[0].category == "literature") {
				/* Make the result into html with id and class and put it in an array */
				byCountryArray.push(`<p id="${person.prizes[0].year}" class="moreNames">${person.firstname} ${person.surname}</p>`);
			}
		}
		let namesCountryHtml = "";
		/* Make all of the array items into a string. */
		for (name of byCountryArray){
			namesCountryHtml += name;
		}
		/* Display the result on the webpage. */
		moreInfo.innerHTML = namesCountryHtml;
		/* Empy the array */
		byCountryArray = [];
		/* Get all the names on the list and loop through. Put eventlisteners on each. Use the year from the id to make new search.*/
		let moreNames = document.getElementsByClassName("moreNames");
		for(listName of moreNames) {
			listName.addEventListener('click', function () {
				const yearFromId = this.id;
				emptyAllFields();
				displayYear(yearFromId);
				checkInputNumber(yearFromId);
			})
		}
} /* End of displayAllByBornCountry function. */

/* Function to fetch list of laureates from the same country. */
function getAllByBornCountry(country) {
	displaySpinner ();
	fetch(`http://api.nobelprize.org/v1/laureate.json?bornCountry=${country}`)
	.then(function (response) {
		return response.json();
	})
	.then(function (allByCountryData) {
		stopSpinner();
		displayAllByBornCountry(allByCountryData);
	})
	.catch(function (error) {
			standardErrorMessage (error);
		})
} /* End of fetch function. */

/*Function to create links to display all awarded from the same country. */
function createCountryLinks(moreLaureateData) {
	let country = moreLaureateData.laureates[0].bornCountry;
		countryLinkHtml = `<div id="countryLink" class="countryLink"><h3>
						List of all laureates born in ${country}</h3></div>`;
	linksToMoreInfo.insertAdjacentHTML('beforeend', countryLinkHtml);
		const countryLink = document.getElementsByClassName("countryLink");
		for(link of countryLink){
			link.addEventListener('click', function () {
				getAllByBornCountry(country);
			})
		}
} /* End of createCountryLinks. */

/* Function to display name, birth date and death date. */
function displayMoreLaureateData(moreLaureateData) {
	let infoHtml = "";
	if(moreLaureateData.laureates[0].died == "0000-00-00"){
		infoHtml = `<h2>${moreLaureateData.laureates[0].firstname} ${moreLaureateData.laureates[0].surname}</h2><p class="bornInfo">Born ${moreLaureateData.laureates[0].born} in ${moreLaureateData.laureates[0].bornCountry}.</p>`	
	}
	else {
	infoHtml = `<h2>${moreLaureateData.laureates[0].firstname} ${moreLaureateData.laureates[0].surname}</h2><p class="bornInfo">Born ${moreLaureateData.laureates[0].born} in ${moreLaureateData.laureates[0].bornCountry}. Deceased ${moreLaureateData.laureates[0].died} in ${moreLaureateData.laureates[0].diedCountry}.<p>`;
	}
	nobelPrizeLaureates.insertAdjacentHTML('beforeend', infoHtml);
	createCountryLinks(moreLaureateData);
	createLivingLink();
	createGenderLink();
} /* End of displayLaureateInfo function. */

/* Function to fetch more info from Nobel Prize API. */
function getMoreLaureateDataById(id){
		displaySpinner ();
		fetch(`http://api.nobelprize.org/v1/laureate.json?id=${id}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (moreLaureateData) {
			stopSpinner();
			displayMoreLaureateData(moreLaureateData);
		})
		.catch(function (error) {
			standardErrorMessage (error);
		})
} /* End of fetch function. */

/* A function to display booktitles at the webpage. */
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
	/* Display the titles at the webpage. */
	bookTitles.insertAdjacentHTML('beforeend', booksHtml);
} /* End of displayLibrisBooks function. */

/* function to get books from Libris API. */
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
} /* End of getLibrisBooks function. */

/* Function to hand the laureate name to getLibrisBooks function and the id to fetchmoreInfoById function and to display the motivation at the webpage. */
function displayLaureates(laureatesData) {
	let laureatesHtml = "";
	let motivationHtml = "";
	if (laureatesData.prizes.length > 0) {
		for (laureate of laureatesData.prizes[0].laureates) {
			let laureateSurName = laureate.surname;
			let laureateFirstName = laureate.firstname;
			let id = laureate.id;
			getLibrisBooks(laureateFirstName, laureateSurName);
			getMoreLaureateDataById(id);
			motivationHtml += `<p>${laureate.motivation}</p>`;
		}
	} else {
		year.innerHTML = `00<br>00`;;
		emptyAllFields();
		errorMessage.innerHTML = 
			`<p class="errormessage">No one was 
			awarded this year. Please try again.</p>`;
	}
	motivation.innerHTML = motivationHtml;
} /* End of displayLauretes function. */

/* Function to get Laureates data from Nobel prize API. */
function getLaureateData(searchValue) {
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
} /* End of getLaureates function. */

/* Function that checks the input value before the fetch is made. */
function checkInputNumber(searchValue) {
	var date = new Date();
	var year = date.getFullYear();
	if (searchValue >= 1901 && searchValue <= year - 1) {
		getLaureateData(searchValue);
		errorMessage.innerHTML = "";
	} else {
		year.innerHTML = `00<br>00`;
		emptyAllFields();
		errorMessage.innerHTML = 
			`<p class="errormessage">We could not find a laureate for 
				this year. Please try again.</p>`;
	}
} /* End of checkInputNumber function. */

function standardErrorMessage(error) {
	errorMessage.innerHTML = 
			`<p class="errormessage">Something went wrong. 
			Please try again.</p>`;
}
function displaySpinner() {
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
function stopSpinner() {
	spinnerDiv.innerHTML = "";
}
/* Function to display year. */
function displayYear(searchValue) {
	year.innerHTML = `${searchValue.substring(0, 2)}<br>${searchValue.substring(2, 4)}`;	 
}
/* Function to remove all data before new search is made. */
function emptyAllFields() {
	bookTitles.innerHTML = "";
	nobelPrizeLaureates.innerHTML = "";
	motivation.innerHTML = "";
	moreInfo.innerHTML = "";	
	input.value = "";
	linksToMoreInfo.innerHTML = "";
}
/* Search button. */
searchButton.addEventListener('click', function() {
	const value = input.value;
	emptyAllFields();
	displayYear(value);
	checkInputNumber(value);	
})
