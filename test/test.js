import { 
    calculateTotalTime, 
    validateRecipe, 
    filterRecipesBySearchTerm,
    getDifficultyBadgeClass,
    sanitizeInput,
    formatRecipeCard
} from '../js/utils.js';

QUnit.module('Recipe Utilities', function() {

    QUnit.test('calculateTotalTime adds prep and cook time', function(assert) {
        var result = calculateTotalTime(10, 20);
        assert.equal(result, 30, 'Should return 30 minutes');
        
        var result2 = calculateTotalTime(0, 15);
        assert.equal(result2, 15, 'Should handle zero prep time');
    });

    QUnit.test('getDifficultyBadgeClass returns correct class', function(assert) {
        assert.equal(getDifficultyBadgeClass('easy'), 'badge badge-easy');
        assert.equal(getDifficultyBadgeClass('medium'), 'badge badge-medium');
        assert.equal(getDifficultyBadgeClass('hard'), 'badge badge-hard');
    });

    QUnit.test('sanitizeInput escapes HTML', function(assert) {
        var result = sanitizeInput('<script>alert("xss")</script>');
        assert.equal(result, '&lt;script&gt;alert("xss")&lt;/script&gt;', 'Should escape HTML tags');
        
        var result2 = sanitizeInput('Normal text');
        assert.equal(result2, 'Normal text', 'Should leave normal text unchanged');
    });

});

QUnit.module('Recipe Validation', function() {

    QUnit.test('validateRecipe requires name', function(assert) {
        var recipe = {
            name: '',
            description: 'Test',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: 10,
            cookTime: 20,
            ingredients: [{amount: '1', unit: 'cup', name: 'flour'}],
            instructions: ['Step 1']
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, false, 'Should be invalid');
        assert.equal(result.error, 'Recipe name is required');
    });

    QUnit.test('validateRecipe requires description', function(assert) {
        var recipe = {
            name: 'Test Recipe',
            description: '',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: 10,
            cookTime: 20,
            ingredients: [{amount: '1', unit: 'cup', name: 'flour'}],
            instructions: ['Step 1']
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, false, 'Should be invalid');
        assert.equal(result.error, 'Description is required');
    });

    QUnit.test('validateRecipe accepts valid recipe', function(assert) {
        var recipe = {
            name: 'Test Recipe',
            description: 'A test recipe',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: 10,
            cookTime: 20,
            ingredients: [{amount: '1', unit: 'cup', name: 'flour'}],
            instructions: ['Step 1']
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, true, 'Should be valid');
    });

    QUnit.test('validateRecipe rejects negative times', function(assert) {
        var recipe = {
            name: 'Test Recipe',
            description: 'A test recipe',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: -5,
            cookTime: 20,
            ingredients: [{amount: '1', unit: 'cup', name: 'flour'}],
            instructions: ['Step 1']
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, false, 'Should be invalid');
        assert.equal(result.error, 'Prep time must be positive');
    });

    QUnit.test('validateRecipe requires ingredients', function(assert) {
        var recipe = {
            name: 'Test Recipe',
            description: 'A test recipe',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: 10,
            cookTime: 20,
            ingredients: [],
            instructions: ['Step 1']
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, false, 'Should be invalid');
        assert.equal(result.error, 'At least one ingredient is required');
    });

    QUnit.test('validateRecipe requires instructions', function(assert) {
        var recipe = {
            name: 'Test Recipe',
            description: 'A test recipe',
            category: 'dinner',
            difficulty: 'easy',
            prepTime: 10,
            cookTime: 20,
            ingredients: [{amount: '1', unit: 'cup', name: 'flour'}],
            instructions: []
        };
        
        var result = validateRecipe(recipe);
        assert.equal(result.valid, false, 'Should be invalid');
        assert.equal(result.error, 'At least one instruction is required');
    });

});

QUnit.module('Recipe Filtering', function() {

    QUnit.test('filterRecipesBySearchTerm finds matching recipes', function(assert) {
        var recipes = [
            { name: 'Chocolate Cake', description: 'Delicious', category: 'dessert' },
            { name: 'Vanilla Ice Cream', description: 'Sweet', category: 'dessert' },
            { name: 'Chicken Soup', description: 'Warm', category: 'dinner' }
        ];
        
        var result = filterRecipesBySearchTerm(recipes, 'chocolate');
        assert.equal(result.length, 1, 'Should find 1 recipe');
        assert.equal(result[0].name, 'Chocolate Cake');
    });

    QUnit.test('filterRecipesBySearchTerm is case insensitive', function(assert) {
        var recipes = [
            { name: 'Chocolate Cake', description: 'Delicious', category: 'dessert' }
        ];
        
        var result = filterRecipesBySearchTerm(recipes, 'CHOCOLATE');
        assert.equal(result.length, 1, 'Should find recipe regardless of case');
    });

    QUnit.test('filterRecipesBySearchTerm searches description', function(assert) {
        var recipes = [
            { name: 'Mystery Dish', description: 'Contains chocolate', category: 'dessert' }
        ];
        
        var result = filterRecipesBySearchTerm(recipes, 'chocolate');
        assert.equal(result.length, 1, 'Should search in description');
    });

    QUnit.test('filterRecipesBySearchTerm searches category', function(assert) {
        var recipes = [
            { name: 'Cake', description: 'Sweet', category: 'dessert' },
            { name: 'Soup', description: 'Warm', category: 'dinner' }
        ];
        
        var result = filterRecipesBySearchTerm(recipes, 'dessert');
        assert.equal(result.length, 1, 'Should search in category');
        assert.equal(result[0].name, 'Cake');
    });

    QUnit.test('filterRecipesBySearchTerm returns empty for no matches', function(assert) {
        var recipes = [
            { name: 'Cake', description: 'Sweet', category: 'dessert' }
        ];
        
        var result = filterRecipesBySearchTerm(recipes, 'pizza');
        assert.equal(result.length, 0, 'Should return empty array');
    });

});

QUnit.module('Recipe Formatting', function() {

    QUnit.test('formatRecipeCard includes recipe name', function(assert) {
        var recipe = {
            id: '123',
            name: 'Test Recipe',
            description: 'Test description',
            difficulty: 'easy',
            category: 'dinner',
            prepTime: 10,
            cookTime: 20
        };
        
        var result = formatRecipeCard(recipe);
        assert.ok(result.includes('Test Recipe'), 'Should include recipe name');
    });

    QUnit.test('formatRecipeCard includes difficulty badge', function(assert) {
        var recipe = {
            id: '123',
            name: 'Test Recipe',
            description: 'Test description',
            difficulty: 'medium',
            category: 'dinner',
            prepTime: 10,
            cookTime: 20
        };
        
        var result = formatRecipeCard(recipe);
        assert.ok(result.includes('badge badge-medium'), 'Should include difficulty badge class');
        assert.ok(result.includes('MEDIUM'), 'Should include uppercase difficulty');
    });

    QUnit.test('formatRecipeCard calculates total time', function(assert) {
        var recipe = {
            id: '123',
            name: 'Test Recipe',
            description: 'Test description',
            difficulty: 'easy',
            category: 'dinner',
            prepTime: 15,
            cookTime: 25
        };
        
        var result = formatRecipeCard(recipe);
        assert.ok(result.includes('40 min'), 'Should show total time of 40 minutes');
    });

    QUnit.test('formatRecipeCard includes detail link', function(assert) {
        var recipe = {
            id: 'abc123',
            name: 'Test Recipe',
            description: 'Test description',
            difficulty: 'easy',
            category: 'dinner',
            prepTime: 10,
            cookTime: 20
        };
        
        var result = formatRecipeCard(recipe);
        assert.ok(result.includes('recipe-detail.html?id=abc123'), 'Should include link with recipe ID');
    });

});