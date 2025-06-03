document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') { 
        loadMovies();
    } else if (currentPage === 'detalhe.html') {
        loadMovieDetail();
    }
});

async function fetchMovies() {
    try {
        const response = await fetch('../db/db.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.filmes; 
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return []; 
    }
}


async function loadMovies() {
    const movies = await fetchMovies();
    const movieListContainer = document.getElementById('lista-filmes');

    if (movies.length === 0) {
        movieListContainer.innerHTML = '<p class="text-center col-12">Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col'; 
        movieCard.innerHTML = `
            <a href="detalhe.html?id=${movie.id}" class="movie-card d-block h-100">
                <img src="${movie.imagem}" class="card-img-top" alt="${movie.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${movie.titulo}</h5>
                    <p class="card-text mb-1"><span class="badge bg-primary">${movie.genero}</span> <span class="badge bg-info">${movie.ano}</span></p>
                    <p class="card-text">Nota: <span class="badge bg-success rating-badge">${movie.nota}</span></p>
                </div>
            </a>
        `;
        movieListContainer.appendChild(movieCard);
    });
}


async function loadMovieDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id')); 

    if (isNaN(movieId)) {
        document.getElementById('detalhe-filme').innerHTML = '<p class="text-center">Filme não encontrado. ID inválido.</p>';
        return;
    }

    const movies = await fetchMovies();
    const movie = movies.find(m => m.id === movieId); 
    const movieDetailContainer = document.getElementById('detalhe-filme');

    if (movie) {
        movieDetailContainer.innerHTML = `
            <div class="row movie-detail-container">
                <div class="col-md-4 mb-4 mb-md-0">
                    <img src="${movie.imagem}" class="img-fluid" alt="${movie.titulo}">
                </div>
                <div class="col-md-8">
                    <h2 class="mb-3">${movie.titulo}</h2>
                    <p><span class="detail-label">Ano:</span> ${movie.ano}</p>
                    <p><span class="detail-label">Gênero:</span> <span class="badge bg-primary">${movie.genero}</span></p>
                    <p><span class="detail-label">Nota:</span> <span class="badge bg-success rating-badge">${movie.nota}</span></p>
                    <p><span class="detail-label">País:</span> ${movie.pais}</p>
                    <p><span class="detail-label">Elenco:</span> ${movie.elenco}</p>
                    <h4 class="mt-4">Sinopse:</h4>
                    <p>${movie.sinopse}</p>
                </div>
            </div>
        `;
    } else {
        movieDetailContainer.innerHTML = '<p class="text-center">Filme não encontrado.</p>';
    }
}