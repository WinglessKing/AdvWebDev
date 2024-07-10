    $(document).on('click', '.bookCard', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelfContainer').length > 0;
        var containerId = isBookshelfItem ? '#bookshelfDetailsContainer' : '#bookDetailsContainer';
        fetchBookDetails(bookId, containerId);

    function fetchBookDetails(bookId, containerId) {
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes/' + bookId,
            type: 'GET',
            success: function(response) {
                $(containerId).empty();
                var bookDetails = response.volumeInfo;
                var details = `
                    <div class="bookDetails">
                        <h1>${bookDetails.title}</h1>
                        <h2>${bookDetails.subtitle ? bookDetails.subtitle : ''}</h2>
                        <p>By ${bookDetails.authors ? bookDetails.authors.join(', ') : ''} - ${bookDetails.publishedDate}</p>
                        <p>${bookDetails.description ? bookDetails.description : ''}</p>
                    </div>
                    <div class="bookImage">
                        ${bookDetails.imageLinks ? '<img src="' + bookDetails.imageLinks.thumbnail + '" alt="Book cover">' : ''}
                    </div>
                `;
                $(containerId).append(details);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }
