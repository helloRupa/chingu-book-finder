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

const bookData = {
    url: 'https://www.googleapis.com/books/v1/volumes?q=',
    options: '&fields=items(volumeInfo)&projection=lite',
    // success: success,
    // failure: failure,
    timeout: 1
};

const fetchData = (function(options_obj, searchTxt){
    let url = options_obj.url + searchTxt + options_obj.options;
    // let options = options_obj;

    fetch(url)
	.then(response => {
		if (!response.ok) throw Error (response.statusText);
		return response.json();
	}).then((data) => {
		console.log(data);
	}).catch(error => {
        console.log(error);
    });
});


document.getElementById('submit-search').onclick = function(e) {
    e.preventDefault();
    // console.log(searchBar('search-bar').format());
    let searchTxt = searchBar('search-bar').format();
    fetchData(bookData, searchTxt);
};

    
    