$(document).ready(function() {
    let currentPage = 1;
    let itemsPerPage = 10;
    let searchResults = [];
    const maxResultsPerRequest = 40;
    let isGridView = true;

    // Initialize search history
    loadSearchHistory();

    // Book search functionality
    $("#searchButton").click(function() {
        performSearch();
    });

    // Trigger search on Enter key press
    $("#keyTerm").keypress(function(event) {
        if (event.which == 13) { // 13 is the Enter key code
            performSearch();
        }
    });

    // Toggle view layout
    $("#toggle-view").click(function() {
        isGridView = !isGridView;
        displaySearchResults();
    });

    // Perform search
    function performSearch() {
        var searchTerm = $("#keyTerm").val();
        if (searchTerm) {
            addSearchHistory(searchTerm);
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
        let resultsContainer = $("#resultsContainer");
        resultsContainer.empty();
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let paginatedResults = searchResults.slice(startIndex, endIndex);
        console.log('Displaying results for page', currentPage, ':', paginatedResults);  // Debug log

        const template = $("#search-result-template").html();
        paginatedResults.forEach(function(book) {
            const rendered = Mustache.render(template, {
                id: book.id,
                thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
                publishedDate: book.volumeInfo.publishedDate
            });
            resultsContainer.append(rendered);
        });

        if (!isGridView) {
            resultsContainer.removeClass("grid-view").addClass("list-view");
        } else {
            resultsContainer.removeClass("list-view").addClass("grid-view");
        }
    }

    function setupPagination() {
        let paginationContainer = $("#paginationContainer");
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

        $(document).off('click', '.page-link'); // Remove any previous event handlers
        $(document).on('click', '.page-link', function() {
            currentPage = $(this).data('page');
            displaySearchResults();
            setupPagination(); // Update pagination to reflect the current active page
        });
    }

    $(document).on('click', '#resultsContainer .book-item, #bookshelfContainer .book-item', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelfContainer').length > 0;
        var containerId = isBookshelfItem ? '#bookshelf-details-container' : '#book-details-container';
        fetchBookDetails(bookId, containerId, function() {
            // Smooth scroll to the book details container
            $('html, body').animate({
                scrollTop: $(containerId).offset().top - 100 // Adjust this value for the desired space
            }, 1000); // 1000 milliseconds for a smooth scroll effect
        });
    });

    function fetchBookDetails(bookId, containerId, callback) {
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes/' + bookId,
            type: 'GET',
            success: function(response) {
                $(containerId).empty();
                const template = $("#book-details-template").html();
                const rendered = Mustache.render(template, {
                    title: response.volumeInfo.title,
                    subtitle: response.volumeInfo.subtitle,
                    authors: response.volumeInfo.authors ? response.volumeInfo.authors.join(', ') : '',
                    publishedDate: response.volumeInfo.publishedDate,
                    description: response.volumeInfo.description,
                    thumbnail: response.volumeInfo.imageLinks ? response.volumeInfo.imageLinks.thumbnail : ''
                });
                $(containerId).append(rendered);
                if (callback) callback();
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }

    // Search history functions
    function addSearchHistory(searchTerm) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistory = searchHistory.filter(term => term !== searchTerm); // Remove if already exists
        searchHistory.unshift(searchTerm); // Add to the beginning
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }

    function loadSearchHistory() {
        displaySearchHistory();
    }

    function displaySearchHistory() {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let searchHistoryList = $("#search-history-list");
        searchHistoryList.empty();
        searchHistory.forEach(function(term) {
            searchHistoryList.append('<li>' + term + '</li>');
        });
    }

    $(document).on('click', '#search-history-list li', function() {
        $("#search-term").val($(this).text());
        performSearch();
    });
});
