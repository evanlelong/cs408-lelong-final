export function formatRecipeCard(recipe) {
    const difficultyClass = `badge badge-${recipe.difficulty}`;
    return `
        <div class="recipe-card">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <div class="recipe-meta">
                <span class="${difficultyClass}">${recipe.difficulty.toUpperCase()}</span>
                <span class="badge">${recipe.category}</span>
                <br>
                <strong>Prep:</strong> ${recipe.prepTime} min | 
                <strong>Cook:</strong> ${recipe.cookTime} min | 
                <strong>Total:</strong> ${recipe.prepTime + recipe.cookTime} min
            </div>
            <a href="recipe-detail.html?id=${recipe.id}">View Details →</a>
        </div>
    `;
}

export function calculateTotalTime(prepTime, cookTime) {
    return prepTime + cookTime;
}

export function validateRecipe(recipe) {
    if (!recipe.name || recipe.name.trim() === '') {
        return { valid: false, error: 'Recipe name is required' };
    }
    if (!recipe.description || recipe.description.trim() === '') {
        return { valid: false, error: 'Description is required' };
    }
    if (!recipe.category) {
        return { valid: false, error: 'Category is required' };
    }
    if (!recipe.difficulty) {
        return { valid: false, error: 'Difficulty is required' };
    }
    if (recipe.prepTime < 0) {
        return { valid: false, error: 'Prep time must be positive' };
    }
    if (recipe.cookTime < 0) {
        return { valid: false, error: 'Cook time must be positive' };
    }
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return { valid: false, error: 'At least one ingredient is required' };
    }
    if (!recipe.instructions || recipe.instructions.length === 0) {
        return { valid: false, error: 'At least one instruction is required' };
    }
    return { valid: true };
}

export function filterRecipesBySearchTerm(recipes, searchTerm) {
    const term = searchTerm.toLowerCase();
    return recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        recipe.category.toLowerCase().includes(term)
    );
}

export function getDifficultyBadgeClass(difficulty) {
    return `badge badge-${difficulty}`;
}

export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

export function getRecipeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}