const API_KEY = 'bf24357cc71d2715cc9f5495b1c3d699';
const BASE_URL = 'https://api.themoviedb.org/3';
let currentPage = 1;
let currentQuery = '';
let currentGenre = '';

$(document).ready(function() {
    $('#search-button').click(function() {
        currentQuery = $('#search-input').val();
        currentPage = 1;
        searchMovies(currentQuery, currentPage, currentGenre);
    });

    $('#genre-filter').change(function() {
        currentGenre = $(this).val();
        currentPage = 1;
        searchMovies(currentQuery, currentPage, currentGenre);
    });

    loadTopPopular();
    loadGenres();

    function searchMovies(query, page = 1, genre = '') {
        $.ajax({
            url: `${BASE_URL}/search/multi`,
            data: {
                api_key: API_KEY,
                query: query,
                page: page,
                with_genres: genre
            },
            success: function(response) {
                displaySearchResults(response.results);
                setupPagination(response.page, response.total_pages);
            },
            error: function() {
                alert('Error fetching search results');
            }
        });
    }

    function loadTopPopular() {
        $.ajax({
            url: `${BASE_URL}/movie/popular`,
            data: {
                api_key: API_KEY
            },
            success: function(response) {
                displayTopPopular(response.results);
            },
            error: function() {
                alert('Error fetching top/popular movies');
            }
        });
    }

    function loadGenres() {
        $.ajax({
            url: `${BASE_URL}/genre/movie/list`,
            data: {
                api_key: API_KEY
            },
            success: function(response) {
                const genreFilter = $('#genre-filter');
                response.genres.forEach(genre => {
                    const option = $('<option>').attr('value', genre.id).text(genre.name);
                    genreFilter.append(option);
                });
            },
            error: function() {
                alert('Error fetching genres');
            }
        });
    }

    function displaySearchResults(results) {
        const searchResults = $('#search-results');
        searchResults.empty();
        results.forEach(result => {
            const card = $('<div>').addClass('movie-card');
            const title = result.title || result.name;
            const img = $('<img>').attr('src', `https://image.tmdb.org/t/p/w200${result.poster_path}`);
            const info = $('<div>');
            const titleElement = $('<h3>').text(title);
            const overview = $('<p>').text(result.overview);
            const detailsButton = $('<button>').text('Details').click(() => showDetails(result));
            info.append(titleElement, overview, detailsButton);
            card.append(img, info);
            searchResults.append(card);
        });
    }

    function displayTopPopular(results) {
        const topPopular = $('#top-popular');
        topPopular.empty();
        results.forEach(result => {
            const card = $('<div>').addClass('movie-card');
            const title = result.title || result.name;
            const img = $('<img>').attr('src', `https://image.tmdb.org/t/p/w200${result.poster_path}`);
            const info = $('<div>');
            const titleElement = $('<h3>').text(title);
            const overview = $('<p>').text(result.overview);
            const detailsButton = $('<button>').text('Details').click(() => showDetails(result));
            info.append(titleElement, overview, detailsButton);
            card.append(img, info);
            topPopular.append(card);
        });
    }

    function setupPagination(current, total) {
        const pagination = $('#pagination');
        pagination.empty();
        if (total > 1) {
            for (let i = 1; i <= total; i++) {
                const pageButton = $('<button>').text(i).click(() => {
                    currentPage = i;
                    searchMovies(currentQuery, currentPage, currentGenre);
                });
                if (i === current) {
                    pageButton.addClass('active');
                }
                pagination.append(pageButton);
            }
        }
    }

    function showDetails(movie) {
        const detailsView = $('#details-view');
        detailsView.empty();
        const title = movie.title || movie.name;
        const img = $('<img>').attr('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        const info = $('<div>');
        const titleElement = $('<h2>').text(title);
        const overview = $('<p>').text(movie.overview);
        const backButton = $('<button>').text('Back').click(() => detailsView.empty());
        info.append(titleElement, overview, backButton);
        detailsView.append(img, info);

        loadCast(movie.id);
    }

    function loadCast(movieId) {
        $.ajax({
            url: `${BASE_URL}/movie/${movieId}/credits`,
            data: {
                api_key: API_KEY
            },
            success: function(response) {
                displayCast(response.cast);
            },
            error: function() {
                alert('Error fetching cast details');
            }
        });
    }

    function displayCast(cast) {
        const detailsView = $('#details-view');
        const castSection = $('<section>').attr('id', 'cast-section');
        const castTitle = $('<h3>').text('Cast');
        castSection.append(castTitle);
        cast.forEach(member => {
            const castMember = $('<div>').addClass('cast-member');
            const name = $('<p>').text(member.name);
            const character = $('<p>').text(`as ${member.character}`);
            const detailsButton = $('<button>').text('Details').click(() => showPersonDetails(member.id));
            castMember.append(name, character, detailsButton);
            castSection.append(castMember);
        });
        detailsView.append(castSection);
    }

    function showPersonDetails(personId) {
        $.ajax({
            url: `${BASE_URL}/person/${personId}`,
            data: {
                api_key: API_KEY
            },
            success: function(response) {
                displayPersonDetails(response);
            },
            error: function() {
                alert('Error fetching person details');
            }
        });
    }

    function displayPersonDetails(person) {
        const detailsView = $('#details-view');
        detailsView.empty();
        const img = $('<img>').attr('src', `https://image.tmdb.org/t/p/w300${person.profile_path}`);
        const info = $('<div>');
        const name = $('<h2>').text(person.name);
        const biography = $('<p>').text(person.biography);
        const backButton = $('<button>').text('Back').click(() => detailsView.empty());
        info.append(name, biography, backButton);
        detailsView.append(img, info);
    }
});

});
