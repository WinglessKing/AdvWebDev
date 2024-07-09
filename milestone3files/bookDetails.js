$(document).ready(function() {    
    $(document).on('click', '.book-item', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelfContainer').length > 0;
        var containerId = isBookshelfItem ? '#bookDetailsContainer' : '#bookDetailsContainer';
        getBookDetails(bookId, containerId);
    });

    function getBookDetails(bookId, containerId) {
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes/' + bookId,
            type: 'GET',
            success: function(response) {
                $(containerId).empty();
                var bookInfo = response.volumeInfo;
                var bookDetails = `
                    <div class="bookDetails">
                        <h1>${bookDetails.title}</h1>
                        <h2>${bookDetails.subtitle ? bookDetails.subtitle : ''}</h2>
                        <p>By ${bookDetails.authors ? bookDetails.authors.join(', ') : ''} - ${bookDetails.publishedDate}</p>
                        <p>${bookDetails.description ? bookDetails.description : ''}</p>
                    </div>
                    <div class="bookImage">
                        ${bookImage.imageLinks ? '<img src="' + bookImage.imageLinks.thumbnail + '" alt="Book cover">' : ''}
                    </div>
                `;
                $(containerId).append(bookDetails);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }
