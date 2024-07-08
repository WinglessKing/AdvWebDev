 $(document).ready(function() {
                const userId = '112484254300932813469'; // User ID
                const bookshelfId = '1001'; // Bookshelf ID
                const url = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}/volumes`;
                console.log('Fetching bookshelf books from:', url); // Debug
    
                $.getJSON(url, function(data) {
                    console.log('Bookshelf API Response:', data);
                    displayBookshelf(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('API Request Failed:', textStatus, errorThrown); 
                });
    
            function displayBookshelf(data) {
                const bookshelfContainer = $('#bookshelfContainer');
                bookshelfContainer.empty();
    
                if (!data.items || data.items.length === 0) {
                    bookshelfContainer.append('<p>No books found in this bookshelf.</p>'); 
                return;
                }
    
                    data.items.forEach(item => {
                        const book = item.volumeInfo;
                        const bookElement = `
                        <div class="bookCard">
                            <h3><a href="bookdetails.html?id=${item.id}">${book.title}</a></h3>
                            <img src="${book.imageLinks?.thumbnail}" alt="${book.title}">
                        </div>
                        `;
                    bookshelfContainer.append(bookElement);
                    });
                }
            });
