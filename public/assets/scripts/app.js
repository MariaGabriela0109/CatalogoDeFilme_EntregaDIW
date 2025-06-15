

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
    
    } else if (currentPage === 'detalhe.html') {
        loadMovieDetail();
    }
});


async function fetchMovies() {
    try {
       
        const response = await fetch('http://localhost:3000/filmes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        return [];
    }
}


function formatGenres(generos) {
    return generos.split(',').map(g => `<span class="badge bg-primary me-1">${g.trim()}</span>`).join(' ');
}


async function loadMovies() {
    const movies = await fetchMovies();
    const movieListContainer = document.getElementById('lista-filmes');

    if (!movieListContainer) {
        console.error('Elemento com ID "lista-filmes" não encontrado. Isso é esperado em páginas que não são o catálogo principal.');
        return;
    }

    if (movies.length === 0) {
        movieListContainer.innerHTML = '<p class="text-center col-12 text-muted">Nenhum filme encontrado.</p>';
        return;
    }

    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col';
        movieCard.innerHTML = `
            <a href="detalhe.html?id=${movie.id}" class="movie-card d-block">
                <img src="${movie.imagem}" onerror="this.src='https://placehold.co/400x550/000000/FFFFFF?text=Sem+Imagem'" class="card-img-top" alt="${movie.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${movie.titulo}</h5>
                    <p class="card-text mb-1">${formatGenres(movie.genero)} <span class="badge bg-info">${movie.ano}</span></p>
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

    const movieDetailContainer = document.getElementById('detalhe-filme');

    if (isNaN(movieId)) {
        if (movieDetailContainer) {
            movieDetailContainer.innerHTML = `
                <div class="alert alert-warning text-center" role="alert">
                    Filme não encontrado. ID inválido ou ausente na URL.
                </div>
                <div class="text-center mt-4">
                    <a href="index.html" class="btn btn-primary">Voltar ao Catálogo</a>
                </div>
            `;
        }
        return;
    }

    const movies = await fetchMovies();
    const movie = movies.find(m => m.id === movieId);

    if (movieDetailContainer) {
        if (movie) {
            movieDetailContainer.innerHTML = `
                <div class="row g-4 align-items-start">
                    <div class="col-md-4 text-center">
                        <img src="${movie.imagem}" onerror="this.src='https://placehold.co/400x550/000000/FFFFFF?text=Sem+Imagem'" class="img-fluid rounded shadow-lg" alt="${movie.titulo}">
                    </div>
                    <div class="col-md-8 detail-content">
                        <h2 class="display-4 mb-4">${movie.titulo}</h2>
                        <p class="fs-5 mb-2"><span class="detail-label">Ano:</span> ${movie.ano}</p>
                        <p class="fs-5 mb-2"><span class="detail-label">Gênero:</span> ${formatGenres(movie.genero)}</p>
                        <p class="fs-5 mb-2"><span class="detail-label">Nota:</span> <span class="badge bg-success rating-badge">${movie.nota}</span></p>
                        <p class="fs-5 mb-2"><span class="detail-label">País:</span> ${movie.pais}</p>
                        <p class="fs-5 mb-4"><span class="detail-label">Elenco:</span> ${movie.elenco}</p>
                        <h4 class="mt-4 mb-3">Sinopse:</h4>
                        <p class="lead">${movie.sinopse}</p>
                    </div>
                </div>
            `;
        } else {
            movieDetailContainer.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    Filme não encontrado no catálogo.
                </div>
                <div class="text-center mt-4">
                    <a href="index.html" class="btn btn-primary">Voltar ao Catálogo</a>
                </div>
            `;
        }
    }
}