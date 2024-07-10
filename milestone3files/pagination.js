$(document).ready(function() {
    let currentPage = 1;
    let itemsPerPage = 10;
    let searchResults = [];
    const maxResultsPerRequest = 40; // Google Books API limit

    // Book search functionality
    $("#search-button").click(function() {
        performSearch();
    });

    // Trigger search on Enter key press
    $("#search-term").keypress(function(event) {
        if (event.which == 13) { //enter
            performSearch();
        }
    });

    function performSearch() {
        var searchTerm = $("#search-term").val();
        console.log('Search term:', searchTerm);  // Debug log
        if (searchTerm) {
            searchResults = [];
            currentPage = 1;
            fetchResults(searchTerm, 0, maxResultsPerRequest, function() {
                if (searchResults.length < 50) {
                    fetchResults(searchTerm, 40, 10, function() {
                        displaySearchResults();
                        setupPagination();
                    });
                } else {
                    displaySearchResults();
                    setupPagination();
                }
            });
        }
    }
    function fetchResults(searchTerm, startIndex, maxResults, callback) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${maxResults}`,
            method: 'GET',
            success: function(data) {
                console.log('Fetched results:', data.items);  // Debug log
                searchResults = searchResults.concat(data.items || []);
                callback();
            },
            error: function(xhr, status, error) {
                console.error('Search request failed:', status, error);
                callback();
            }
        });
    }

    function displaySearchResults() {
        let resultsContainer = $("#results-container");
        resultsContainer.empty();
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let paginatedResults = searchResults.slice(startIndex, endIndex);
        console.log('Displaying results:', paginatedResults);  // Debug log

        paginatedResults.forEach(function(book) {
            var bookItem = $('<div class="book-item" data-id="' + book.id + '"></div>');
            if (book.volumeInfo.imageLinks) {
                bookItem.append('<img src="' + book.volumeInfo.imageLinks.thumbnail + '" alt="' + book.volumeInfo.title + '">');
            }
            bookItem.append('<h3>' + book.volumeInfo.title + '</h3>');
            resultsContainer.append(bookItem);
        });
    }

    function setupPagination() {
        let paginationContainer = $("#pagination-container");
        paginationContainer.empty();
        let totalPages = Math.ceil(searchResults.length / itemsPerPage);
        console.log('Total pages:', totalPages);  // Debug log

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                let pageLink = $('<span class="page-link">' + i + '</span>');
                pageLink.data('page', i);
                if (i === currentPage) {
                    pageLink.addClass('active');
                }
                paginationContainer.append(pageLink);
            }
        } else {
            paginationContainer.append('<span class="page-link active">1</span>');
        }
    }

    $(document).on('click', '.page-link', function() {
        currentPage = $(this).data('page');
        console.log('Navigating to page:', currentPage);  // Debug log
        displaySearchResults();
        setupPagination();

        
    $('html, body').animate({
        scrollTop: $(containerId).offset().top
    }, 1000); 
    });

    $(document).on('click', '.book-item', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelf-container').length > 0;
        var containerId = isBookshelfItem ? '#bookshelf-details-container' : '#book-details-container';
        fetchBookDetails(bookId, containerId);
        
        
    $('html, body').animate({
        scrollTop: $(containerId).offset().top
    }, 1000); 
    });

    function fetchBookDetails(bookId, containerId) {
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes/' + bookId,
            type: 'GET',
            success: function(response) {
                $(containerId).empty();
                var bookInfo = response.volumeInfo;
                var detailsHtml = `
                    <div class="book-info">
                        <h1>${bookInfo.title}</h1>
                        <h2>${bookInfo.subtitle ? bookInfo.subtitle : ''}</h2>
                        <p>By ${bookInfo.authors ? bookInfo.authors.join(', ') : ''} - ${bookInfo.publishedDate}</p>
                        <p>${bookInfo.description ? bookInfo.description : ''}</p>
                    </div>
                    <div class="book-cover">
                        ${bookInfo.imageLinks ? '<img src="' + bookInfo.imageLinks.thumbnail + '" alt="Book cover">' : ''}
                    </div>
                `;
                $(containerId).append(detailsHtml);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }
});
