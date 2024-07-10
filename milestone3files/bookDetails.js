$(document).ready(function() {
                console.log('Document is ready');
                const urlParams = new URLSearchParams(window.location.search);
                const bookId = urlParams.get('id');
                const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
                console.log('Fetching book details from:', URL);
                
                $.getJSON(url, function(data) {
                    console.log('Book API Response:', data); // Debug 
                    displayBookDetails(data);
                    initializeBookViewer(bookId); 
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('API Request Failed:', textStatus, errorThrown); // Debug
                });

                function displayBookDetails(data) {
                console.log('Displaying book details'); // Debug
                const book = data.volumeInfo;
                const bookDetailsContainer = $('#bookDetailsContainer');
    
                const bookDetails = `
                    <h1>${book.title}</h1>
                    <img src="${book.imageLinks?.thumbnail}" alt="${book.title}">
                    <p><strong>Authors:</strong> ${book.authors.join(', ')}</p>
                    <p><strong>Publisher:</strong> ${book.publisher}</p>
                    <p><strong>Published Date:</strong> ${book.publishedDate}</p>
                    <p><strong>Description:</strong> ${book.description}</p>
                    <p><strong>Price:</strong> ${book.saleInfo?.listPrice?.amount || 'Not available'}</p>
                `;
                bookDetailsContainer.append(bookDetails);
                }
    
                    function initializeBookViewer(volumeId) {
                        console.log('Initializing book viewer with volume ID:', volumeId); // Debug
                        google.books.load();
        
                    function initialize() {
                        var viewer = new google.books.DefaultViewer(document.getElementById('viewer'));
                        viewer.load(volumeId, alertNotFound);
                    }
        
                    google.books.setOnLoadCallback(initialize);
        
                    function alertNotFound() {
                        alert("Could not embed the book!"); // Alert the user if the book cannot be embedded
                    }
                }
            });
