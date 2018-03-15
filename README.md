Loka Kanarp
===========

link to github
 
This is a school assignment for Front end developer program at Medieinstitutet, Stockholm, 2018.

Who was awarded the Nobel Prize in Literature?
----------------------------------------------
This app presents facts about those who have been awarded the Nobel Prize in Literature.  
The user is asked to type in a year. The page then shows name, birth date and country, death date and country, motivation, and a few titles by the awarded. The user kan click on a link and an additional search is made, showing all the laureates from the same country. They can also choose to show all living laureates, and the numbers showing how many men and women who have been awarded. Each of these actions create a new fetch to an API.

For this project I have been using:
* Html
* CSS
* JavaScript
* Sass
* Git

This app uses the Nobel Prize API to present facts about the laureates. Learn more about the API at:
[https://www.nobelprize.org/nobel_organizations/nobelmedia/nobelprize_org/developer/]
It also uses the LIBRIS API to get book titles by the laureates. LIBRIS is the joint catalogue of the Swedish libraries. Learn more at:
[http://librishelp.libris.kb.se/help/xsearch_eng.jsp?open=tech]

My main idea was to mix two different API:s and use information from one to make a fetch in the other. The two API:s have been easy to work with. There was alot of information at the webpages describing how to use the API:s, and no keys were required. The main challange has been to sort the information. 
If I had more time I would try to use local storage to store result from searches. I would remove duplicate links which occurs when there are multiple laureates. It would be fun to add a third API from Goodreads and show reviews for some of the laureates books. 