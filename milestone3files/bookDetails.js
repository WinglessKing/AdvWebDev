$(document).ready(function() {    
    $(document).on('click', '.book-item', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelf-container').length > 0;
        var containerId = isBookshelfItem ? '#bookshelf-details-container' : '#book-details-container';
        fetchBookDetails(bookId, containerId);
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
