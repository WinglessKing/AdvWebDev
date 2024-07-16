$(document).ready(function() {
    let currentPage = 1;
    let itemsPerPage = 10;
    let searchResults = [];
    const maxResultsPerRequest = 40; // Google Books API limit

    // Book search functionality
    $("#searchButton").click(function() {
        var keyTerm = $("#keyTerm").val();
        console.log('Key term:', keyTerm);  // Debug log
        if (keyTerm) {
            searchResults = [];
            currentPage = 1;
            fetchResults(keyTerm, 0, maxResultsPerRequest, function() {
                if (searchResults.length < 50) {
                    fetchResults(keyTerm, 40, 10, function() {
                        displaySearchResults();
                        setupPagination();
                    });
                } else {
                    displaySearchResults();
                    setupPagination();
                }
            });
        }
    });

    function fetchResults(keyTerm, startIndex, maxResults, callback) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${keyTerm}&startIndex=${startIndex}&maxResults=${maxResults}`,
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
    
//Search w/ pagniation
    function displaySearchResults() {
        let resultsContainer = $("#resultsContainer");
        resultsContainer.empty();
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let paginatedResults = searchResults.slice(startIndex, endIndex);
        console.log('Displaying results:', paginatedResults);  // Debug log

        paginatedResults.forEach(function(book) {
            const rendered = Mustache.render(template, {
                id: book.id,
                thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
                publishedDate: book.volumeInfo.publishedDate
            });
            resultsContainer.append(bookCard);
        });
        if (!isGridView) {
            resultsContainer.removeClass("grid-view").addClass("list-view");
        } else {
            resultsContainer.removeClass("list-view").addClass("grid-view");
        }
    }

    function setupPagination() {
        let paginationCard = $("#paginationCard");
        paginationCard.empty();
        let totalPages = Math.ceil(searchResults.length / itemsPerPage);
        console.log('Total pages:', totalPages);  // Debug log

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                let pageNum = $('<span class="pageNum">' + i + '</span>');
                pageNum.data('page', i);
                if (i === currentPage) {
                    pageNum.addClass('active');
                }
                paginationCard.append(pageNum);
            }
        } else {
            paginationCard.append('<span class="pageNum active">1</span>');
        }
    }

    $(document).on('click', '.pageNum', function() {
        currentPage = $(this).data('page');
        console.log('Navigating to page:', currentPage);  // Debug log
        displaySearchResults();
        setupPagination();
    });
});
