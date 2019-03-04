const searchBar = (function(input_id) {
    let searchTxt = document.getElementById(input_id).value.trim();
    
    let formatText = function() {
        const regex = /[^a-zA-Z0-9 ]/gi;
        const spaces = /\s/gi;
        return searchTxt.replace(regex, '').replace(spaces, '%20');
    };

    return {
        format: formatText
    };
});

const fetchData = (function(options_obj, searchTxt){
    if (searchTxt == '') return;
    let url = options_obj.url + searchTxt + options_obj.options;
    // let options = options_obj;

    fetch(url)
	.then(response => {
		if (!response.ok) throw Error (response.statusText);
		return response.json();
	}).then((data) => {
        options_obj.success(data, options_obj);
		console.log(data);
	}).catch(error => {
        options_obj.failure(error);
        console.log(error);
    });
});

const makeResultEls = (function() {
    let title = document.createElement('h2');
    let author = document.createElement('p');
    let publisher = document.createElement('p');
    let img = document.createElement('img');
    let link = document.createElement('a');
    return {
        titleCont: title,
        authorCont: author,
        pubCont: publisher,
        imgCont: img,
        linkCont: link
    };
});

const handleData = (function(data) {
    let bookData = data;
    
    let generic = function(prop) {
        if(bookData.hasOwnProperty(prop))
            return bookData[prop];
        return 'N/A';
    };

    let img = function() {
        if(bookData.hasOwnProperty('imageLinks') && bookData.imageLinks.hasOwnProperty('thumbnail'))
            return bookData.imageLinks.thumbnail;
        return './images/image_placeholder.png';
    };

    let fillLink = function(element) {
        element.setAttribute('href', bookData.infoLink);
        element.setAttribute('target', '_blank');
        element.textContent = 'More info';
        // return element;
    };

    return {
        generic: generic,
        img: img,
        fillLink: fillLink
    };
});

const success = (function(jData, options_obj){
    let bookDiv = document.getElementById(options_obj.successDiv);

    jData.items.forEach((book) => {
        let dataHandler = handleData(book.volumeInfo);
        let div = document.createElement('div');
        div.classList.add('book');

        const {titleCont, authorCont, pubCont, imgCont, linkCont} = makeResultEls();

        imgCont.src = dataHandler.img();
        titleCont.textContent = dataHandler.generic('title');
        pubCont.textContent = dataHandler.generic('publisher');

        let author = dataHandler.generic('authors');
        authorCont.textContent = author == 'N/A' ? author : author.join(', ');

        let infoLink = dataHandler.generic('infoLink');
        if(infoLink != 'N/A') dataHandler.fillLink(linkCont);

        [imgCont, titleCont, authorCont, pubCont, linkCont].forEach((el) => div.appendChild(el));
        bookDiv.appendChild(div);
    });
});

const failure = (function(error){

});


const bookData = {
    url: 'https://www.googleapis.com/books/v1/volumes?q=',
    options: '&fields=items(volumeInfo)&projection=lite',
    success: success,
    successDiv: 'results',
    failure: failure,
    timeout: 1
};

document.getElementById('submit-search').onclick = function(e) {
    e.preventDefault();
    let searchTxt = searchBar('search-bar').format();
    fetchData(bookData, searchTxt);
};

document.getElementById('submit-search').onkeydown = function(e){
    if(e.keyCode == 13){
        let searchTxt = searchBar('search-bar').format();
        fetchData(bookData, searchTxt);
    }
 };
    
    