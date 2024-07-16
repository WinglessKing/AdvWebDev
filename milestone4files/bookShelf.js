$(document).ready(function() {
    let isBookshelfGridView = true;
    let bookshelfBooks = [];

    // Fetch and display books from bookshelf
    $.ajax({
        url: `https://www.googleapis.com/books/v1/users/112484254300932813469/bookshelves/1001/volumes`, // Correct URL syntax
        method: 'GET',
        success: function(data) {
            console.log('Bookshelf data:', data.items);  // Debug log
            bookshelfBooks = data.items;
            displayBookshelf(bookshelfBooks);
        },
        error: function(xhr, status, error) {
            console.error('Bookshelf request failed:', status, error);
        }
    });

    // Toggle view layout for bookshelf
    $("#toggle-bookshelf-view").click(function() {
        isBookshelfGridView = !isBookshelfGridView;
        displayBookshelf(bookshelfBooks);
    });

    function displayBookshelf(books) {
        var bookshelfContainer = $("#bookshelf-container");
        bookshelfContainer.empty(); // Clear previous items
        const template = $("#bookshelf-item-template").html();
        books.forEach(function(book) {
            const rendered = Mustache.render(template, {
                id: book.id,
                thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '',
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
                publishedDate: book.volumeInfo.publishedDate
            });
            bookshelfContainer.append(rendered);
        });

        if (!isBookshelfGridView) {
            bookshelfContainer.removeClass("grid-view").addClass("list-view");
        } else {
            bookshelfContainer.removeClass("list-view").addClass("grid-view");
        }
    }

    $(document).on('click', '#bookshelf-container .book-item', function() {
        var bookId = $(this).data('id');
        fetchBookDetails(bookId, '#bookshelf-details-container', function() {
            // Smooth scroll to the bookshelf details container
            $('html, body').animate({
                scrollTop: $('#bookshelf-details-container').offset().top - 100 // Adjust this value for the desired space
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
});
