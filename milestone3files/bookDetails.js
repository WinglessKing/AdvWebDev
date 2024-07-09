$('html, body').animate({
        scrollTop: $(containerId).offset().top
    }, 1000); 
    });

    $(document).on('click', '.bookCard', function() {
        var bookId = $(this).data('id');
        var isBookshelfItem = $(this).closest('#bookshelfContainer').length > 0;
        var containerId = isBookshelfItem ? '#bookshelfDetailsContainer' : '#bookDetailsContainer';
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
                var details = `
                    <div class="bookDetails">
                        <h1>${bookInfo.title}</h1>
                        <h2>${bookInfo.subtitle ? bookInfo.subtitle : ''}</h2>
                        <p>By ${bookInfo.authors ? bookInfo.authors.join(', ') : ''} - ${bookInfo.publishedDate}</p>
                        <p>${bookInfo.description ? bookInfo.description : ''}</p>
                    </div>
                    <div class="bookImage">
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
