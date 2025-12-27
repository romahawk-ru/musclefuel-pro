/**
 * MuscleFuel Pro - Калькулятор питания для спортсменов
 * Основной файл с логикой расчета и генерации плана питания
 */

// ============================================================================
// КОНСТАНТЫ И КОНФИГУРАЦИЯ
// ============================================================================

const PRODUCTS_DATABASE = [
    { name: "Куриные яйца С0", protein: 13, fat: 11, carbs: 1, calories: 155, category: "eggs" },
    { name: "Сыр легкий (до 30% жирности)", protein: 24, fat: 15, carbs: 3, calories: 240, category: "dairy" },
    { name: "Греческий йогурт", protein: 10, fat: 3, carbs: 4, calories: 83, category: "dairy" },
    { name: "Творог обезжиренный", protein: 18, fat: 0.5, carbs: 3, calories: 88, category: "dairy" },
    { name: "Филе куриное", protein: 23, fat: 1.5, carbs: 0, calories: 110, category: "meat" },
    { name: "Филе индейки", protein: 22, fat: 3, carbs: 0, calories: 135, category: "meat" },
    { name: "Тосты (цельнозерновой хлеб)", protein: 10, fat: 2, carbs: 45, calories: 240, category: "grains" },
    { name: "Хлопья овсяные", protein: 12, fat: 6, carbs: 60, calories: 342, category: "grains" },
    { name: "Хлопья рисовые", protein: 7, fat: 1, carbs: 80, calories: 357, category: "grains" },
    { name: "Рисовая манка", protein: 7, fat: 1, carbs: 78, calories: 360, category: "grains" },
    { name: "Рис (сухой)", protein: 7, fat: 1, carbs: 79, calories: 365, category: "grains" },
    { name: "Гранола", protein: 10, fat: 12, carbs: 65, calories: 400, category: "grains" },
    { name: "Банан", protein: 1, fat: 0.3, carbs: 23, calories: 96, category: "fruits" },
    { name: "Ягоды замороженные", protein: 0.8, fat: 0.4, carbs: 12, calories: 52, category: "fruits" },
    { name: "Изюм", protein: 3, fat: 0.5, carbs: 79, calories: 299, category: "fruits" },
    { name: "Фрукт (средний)", protein: 0.5, fat: 0.2, carbs: 15, calories: 60, category: "fruits" },
    { name: "Томаты", protein: 1, fat: 0.2, carbs: 4, calories: 18, category: "vegetables" },
    { name: "Салат айсберг", protein: 0.9, fat: 0.1, carbs: 3, calories: 14, category: "vegetables" },
    { name: "Шпинат", protein: 3, fat: 0.4, carbs: 3, calories: 23, category: "vegetables" },
    { name: "Сельдерей", protein: 0.7, fat: 0.2, carbs: 3, calories: 16, category: "vegetables" },
    { name: "Протеин (сывороточный)", protein: 80, fat: 9, carbs: 7, calories: 387, category: "sports" },
    { name: "Паста арахисовая", protein: 25, fat: 50, carbs: 20, calories: 588, category: "nuts" },
    { name: "Джем / мед", protein: 0.3, fat: 0, carbs: 82, calories: 304, category: "sweets" },
];

const TRAINING_DAY_MEALS = {
    breakfast: [
        { product: "Куриные яйца С0", amount: 200 },
        { product: "Сыр легкий (до 30% жирности)", amount: 50 },
        { product: "Тосты (цельнозерновой хлеб)", amount: 160 },
        { product: "Томаты", amount: 100 },
        { product: "Салат айсберг", amount: 50 }
    ],
    lunch: [
        { product: "Хлопья овсяные", amount: 120 },
        { product: "Банан", amount: 120 },
        { product: "Ягоды замороженные", amount: 100 },
        { product: "Протеин (сывороточный)", amount: 60 },
        { product: "Паста арахисовая", amount: 20 },
        { product: "Джем / мед", amount: 30 }
    ],
    dinner: [
        { product: "Филе куриное", amount: 300 },
        { product: "Рис (сухой)", amount: 120 },
        { product: "Изюм", amount: 30 },
        { product: "Шпинат", amount: 100 },
        { product: "Сельдерей", amount: 50 }
    ],
    eveningSnack: [
        { product: "Греческий йогурт", amount: 250 },
        { product: "Творог обезжиренный", amount: 100 },
        { product: "Джем / мед", amount: 30 },
        { product: "Гранола", amount: 60 },
        { product: "Фрукт (средний)", amount: 200 }
    ]
};

const REST_DAY_MEALS = {
    breakfast: [
        { product: "Куриные яйца С0", amount: 160 },
        { product: "Сыр легкий (до 30% жирности)", amount: 40 },
        { product: "Тосты (цельнозерновой хлеб)", amount: 120 },
        { product: "Томаты", amount: 80 },
        { product: "Салат айсберг", amount: 40 }
    ],
    lunch: [
        { product: "Хлопья овсяные", amount: 100 },
        { product: "Банан", amount: 100 },
        { product: "Ягоды замороженные", amount: 80 },
        { product: "Протеин (сывороточный)", amount: 30 },
        { product: "Паста арахисовая", amount: 15 }
    ],
    dinner: [
        { product: "Филе индейки", amount: 250 },
        { product: "Рис (сухой)", amount: 100 },
        { product: "Шпинат", amount: 100 },
        { product: "Сельдерей", amount: 50 }
    ],
    eveningSnack: [
        { product: "Греческий йогурт", amount: 200 },
        { product: "Творог обезжиренный", amount: 80 },
        { product: "Гранола", amount: 50 },
        { product: "Фрукт (средний)", amount: 150 }
    ]
};

const MEAL_NAMES = {
    breakfast: "Завтрак",
    lunch: "Обед (предтренировочный)",
    dinner: "Ужин (посттренировочный)",
    eveningSnack: "Прием пищи на ночь"
};

const DAY_NAMES = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

let meatRotation = 0;

// ============================================================================
// ОСНОВНЫЕ ФУНКЦИИ РАСЧЕТА
// ============================================================================

function calculateNutrition() {
    try {
        showLoading(true);
        
        const formData = collectFormData();
        
        if (!validateFormData(formData)) {
            showLoading(false);
            return;
        }
        
        const targetCalories = calculateTargetCalories(formData.weight, formData.goal);
        
        const { proteinGrams, fatGrams, carbsGrams, macrosPercent } = calculateMacronutrients(
            formData.weight, 
            targetCalories, 
            formData.goal
        );
        
        displayResults(targetCalories, proteinGrams, fatGrams, carbsGrams, macrosPercent);
        
        generateWeeklyPlan(
            targetCalories,
            formData.weight,
            formData.trainingDays,
            formData.goal,
            proteinGrams,
            fatGrams,
            carbsGrams
        );
        
        saveUserData(formData);
        
        setTimeout(() => {
            scrollToResults();
            showLoading(false);
        }, 300);
        
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте снова.");
        showLoading(false);
    }
}

function showLoading(isLoading) {
    const calculateBtn = document.getElementById('calculate-btn');
    const btnText = calculateBtn.querySelector('.btn-text');
    const spinner = calculateBtn.querySelector('.loading-spinner');
    
    if (isLoading) {
        calculateBtn.classList.add('calculating');
        btnText.textContent = 'Расчет...';
        spinner.style.display = 'block';
        calculateBtn.disabled = true;
    } else {
        calculateBtn.classList.remove('calculating');
        btnText.textContent = 'Рассчитать мой план питания';
        spinner.style.display = 'none';
        calculateBtn.disabled = false;
    }
}

function collectFormData() {
    const weight = parseInt(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const height = parseInt(document.getElementById('height').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const goal = document.querySelector('input[name="goal"]:checked').value;
    
    const trainingDays = [];
    document.querySelectorAll('input[name="training-days"]:checked').forEach(checkbox => {
        trainingDays.push(parseInt(checkbox.value));
    });
    
    return { weight, age, height, gender, goal, trainingDays };
}

function calculateTargetCalories(weight, goal) {
    const baseCalories = weight * 30;
    
    let targetCalories;
    switch (goal) {
        case 'loss':
            targetCalories = Math.round(baseCalories * 0.9);
            break;
        case 'gain':
            targetCalories = Math.round(baseCalories * 1.1);
            break;
        default:
            targetCalories = Math.round(baseCalories);
    }
    
    return targetCalories;
}

function calculateMacronutrients(weight, targetCalories, goal) {
    let proteinPerKg;
    if (goal === 'gain') {
        proteinPerKg = 2.75;
    } else {
        proteinPerKg = 2.5;
    }
    
    const proteinGrams = Math.round(weight * proteinPerKg);
    const proteinCalories = proteinGrams * 4;
    
    const fatPerKg = 0.65;
    const fatGrams = Math.round(weight * fatPerKg);
    const fatCalories = fatGrams * 9;
    
    const carbsCalories = targetCalories - proteinCalories - fatCalories;
    const carbsGrams = Math.max(0, Math.round(carbsCalories / 4));
    
    const proteinPercent = Math.round((proteinCalories / targetCalories) * 100);
    const fatPercent = Math.round((fatCalories / targetCalories) * 100);
    const carbsPercent = Math.round((carbsCalories / targetCalories) * 100);
    
    return {
        proteinGrams,
        fatGrams,
        carbsGrams,
        macrosPercent: {
            protein: proteinPercent,
            fat: fatPercent,
            carbs: carbsPercent
        }
    };
}

function displayResults(calories, protein, fat, carbs, percentages) {
    document.getElementById('calories-result').textContent = calories;
    document.getElementById('protein-result').textContent = protein;
    document.getElementById('fat-result').textContent = fat;
    document.getElementById('carbs-result').textContent = carbs;
    
    document.getElementById('protein-percent').textContent = percentages.protein + "%";
    document.getElementById('fat-percent').textContent = percentages.fat + "%";
    document.getElementById('carbs-percent').textContent = percentages.carbs + "%";
    
    document.getElementById('results-section').style.display = 'block';
}

function generateWeeklyPlan(targetCalories, weight, trainingDays, goal, proteinGrams, fatGrams, carbsGrams) {
    meatRotation = 0;
    
    let weekPlanHTML = '';
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayName = DAY_NAMES[dayIndex];
        const isTrainingDay = trainingDays.includes(dayIndex);
        
        const mealTemplate = isTrainingDay ? TRAINING_DAY_MEALS : REST_DAY_MEALS;
        
        let dayCalories = adjustDayCalories(targetCalories, isTrainingDay, goal);
        
        const { dayProtein, dayFat, dayCarbs } = calculateDayMacros(
            proteinGrams, fatGrams, carbsGrams, dayCalories, targetCalories
        );
        
        const dayHTML = generateDayHTML(
            dayName,
            isTrainingDay,
            mealTemplate,
            weight,
            goal,
            dayCalories,
            dayProtein,
            dayFat,
            dayCarbs
        );
        
        weekPlanHTML += dayHTML;
        meatRotation++;
    }
    
    document.getElementById('week-plan').innerHTML = weekPlanHTML;
    document.getElementById('week-plan-section').style.display = 'block';
}

function adjustDayCalories(targetCalories, isTrainingDay, goal) {
    let dayCalories = targetCalories;
    
    if (isTrainingDay && goal === 'gain') {
        dayCalories = Math.round(targetCalories * 1.05);
    } else if (!isTrainingDay && goal === 'loss') {
        dayCalories = Math.round(targetCalories * 0.95);
    }
    
    return dayCalories;
}

function calculateDayMacros(proteinGrams, fatGrams, carbsGrams, dayCalories, targetCalories) {
    const dayProtein = Math.round(proteinGrams * (dayCalories / targetCalories));
    const dayFat = Math.round(fatGrams * (dayCalories / targetCalories));
    const dayCarbs = Math.round(carbsGrams * (dayCalories / targetCalories));
    
    return { dayProtein, dayFat, dayCarbs };
}

function generateDayHTML(dayName, isTrainingDay, mealTemplate, weight, goal, dayCalories, dayProtein, dayFat, dayCarbs) {
    let totalDayCalories = 0;
    let totalDayProtein = 0;
    let totalDayFat = 0;
    let totalDayCarbs = 0;
    let dayMealsHTML = '';
    
    for (const mealKey in mealTemplate) {
        const mealName = MEAL_NAMES[mealKey];
        const mealItems = mealTemplate[mealKey];
        
        let mealCalories = 0;
        let mealProtein = 0;
        let mealFat = 0;
        let mealCarbs = 0;
        let mealProductsHTML = '';
        
        for (const item of mealItems) {
            let productName = item.product;
            
            if (mealKey === 'dinner' && (productName === 'Филе куриное' || productName === 'Филе индейки')) {
                productName = getAlternatedMeat();
            }
            
            const productInfo = PRODUCTS_DATABASE.find(p => p.name === productName);
            
            if (productInfo) {
                let adaptedAmount = calculateAdaptedAmount(item.amount, weight, isTrainingDay, goal);
                
                const itemNutrition = calculateItemNutrition(productInfo, adaptedAmount);
                
                mealCalories += itemNutrition.calories;
                mealProtein += itemNutrition.protein;
                mealFat += itemNutrition.fat;
                mealCarbs += itemNutrition.carbs;
                
                mealProductsHTML += `
                    <div class="product-item">
                        <div class="product-name">${productName}</div>
                        <div class="product-amount">${adaptedAmount} г</div>
                    </div>
                `;
            }
        }
        
        totalDayCalories += mealCalories;
        totalDayProtein += mealProtein;
        totalDayFat += mealFat;
        totalDayCarbs += mealCarbs;
        
        dayMealsHTML += `
            <div class="meal-item">
                <div class="meal-title">
                    <span>${mealName}</span>
                    <span class="meal-calories">${mealCalories} ккал</span>
                </div>
                <div class="product-list">
                    ${mealProductsHTML}
                </div>
            </div>
        `;
    }
    
    return `
        <div class="day-card ${isTrainingDay ? 'training' : 'rest'}">
            <div class="day-header ${isTrainingDay ? 'training' : 'rest'}">
                <span>${dayName} ${isTrainingDay ? '🏋️' : '🧘'}</span>
                <span class="day-calories">${totalDayCalories} ккал</span>
            </div>
            <div class="day-meals">
                ${dayMealsHTML}
                <div class="product-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ddd;">
                    <div class="product-name"><strong>Итого за день:</strong></div>
                    <div class="product-amount">Б: ${totalDayProtein}г, Ж: ${totalDayFat}г, У: ${totalDayCarbs}г</div>
                </div>
                <div class="product-item" style="color: #666; font-size: 0.85rem;">
                    <div class="product-name">Рекомендуемая цель:</div>
                    <div class="product-amount">Б: ${dayProtein}г, Ж: ${dayFat}г, У: ${dayCarbs}г</div>
                </div>
                ${generateDayNotes(isTrainingDay, weight)}
            </div>
        </div>
    `;
}

function getAlternatedMeat() {
    const meats = ['Филе куриное', 'Филе индейки'];
    return meats[meatRotation % meats.length];
}

function generateDayNotes(isTrainingDay, weight) {
    if (isTrainingDay) {
        return `
            <div class="day-note" style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="display: flex; align-items: center; gap: 8px; color: #1e40af;">
                    <i class="fas fa-dumbbell"></i>
                    <strong>Особенности тренировочного дня:</strong>
                </div>
                <div style="margin-top: 5px; font-size: 0.9rem; color: #374151;">
                    • Обед за 1.5-2 часа до тренировки<br>
                    • Ужин в течение часа после тренировки<br>
                    • Больше углеводов для энергии и восстановления<br>
                    • 60г протеина в предтренировочном приеме
                </div>
            </div>
        `;
    } else {
        return `
            <div class="day-note" style="margin-top: 15px; padding: 10px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                <div style="display: flex; align-items: center; gap: 8px; color: #047857;">
                    <i class="fas fa-couch"></i>
                    <strong>Особенности дня отдыха:</strong>
                </div>
                <div style="margin-top: 5px; font-size: 0.9rem; color: #374151;">
                    • Уменьшены порции круп и протеина<br>
                    • Больше овощей для насыщения<br>
                    • Сохранен баланс БЖУ<br>
                    • Чередуем мясо для разнообразия
                </div>
            </div>
        `;
    }
}

function calculateAdaptedAmount(baseAmount, weight, isTrainingDay, goal) {
    const baseWeight = 100;
    let adaptedAmount = Math.round(baseAmount * (weight / baseWeight));
    
    if (isTrainingDay && goal === 'gain') {
        adaptedAmount = Math.round(adaptedAmount * 1.05);
    } else if (!isTrainingDay && goal === 'loss') {
        adaptedAmount = Math.round(adaptedAmount * 0.95);
    }
    
    return adaptedAmount;
}

function calculateItemNutrition(productInfo, amount) {
    const factor = amount / 100;
    
    return {
        calories: Math.round(productInfo.calories * factor),
        protein: Math.round(productInfo.protein * factor),
        fat: Math.round(productInfo.fat * factor),
        carbs: Math.round(productInfo.carbs * factor)
    };
}

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

function scrollToResults() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 100);
    }
}

function validateFormData(formData) {
    if (!formData.weight || formData.weight < 40 || formData.weight > 200) {
        alert('Пожалуйста, введите корректный вес (40-200 кг)');
        return false;
    }
    
    if (!formData.age || formData.age < 15 || formData.age > 80) {
        alert('Пожалуйста, введите корректный возраст (15-80 лет)');
        return false;
    }
    
    if (!formData.height || formData.height < 140 || formData.height > 220) {
        alert('Пожалуйста, введите корректный рост (140-220 см)');
        return false;
    }
    
    return true;
}

function saveUserData(formData) {
    try {
        localStorage.setItem('muscleFuelUserData', JSON.stringify(formData));
    } catch (error) {
        // Без вывода ошибки в консоль
    }
}

function loadUserData() {
    try {
        const savedData = localStorage.getItem('muscleFuelUserData');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        return null;
    }
}

function populateFormWithSavedData(userData) {
    if (!userData) return;
    
    document.getElementById('weight').value = userData.weight || 75;
    document.getElementById('age').value = userData.age || 25;
    document.getElementById('height').value = userData.height || 180;
    
    if (userData.gender) {
        const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }
    
    if (userData.goal) {
        const goalRadio = document.querySelector(`input[name="goal"][value="${userData.goal}"]`);
        if (goalRadio) goalRadio.checked = true;
    }
    
    if (userData.trainingDays && Array.isArray(userData.trainingDays)) {
        userData.trainingDays.forEach(dayIndex => {
            const checkbox = document.querySelector(`input[name="training-days"][value="${dayIndex}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

// ============================================================================
// ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================================

function initializeApp() {
    const savedData = loadUserData();
    if (savedData) {
        populateFormWithSavedData(savedData);
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateNutrition);
    }
    
    const inputs = ['weight', 'age', 'height'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', function() {
                const formData = collectFormData();
                saveUserData(formData);
            });
        }
    });
    
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            const formData = collectFormData();
            saveUserData(formData);
        });
    });
    
    const checkboxes = document.querySelectorAll('input[name="training-days"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const formData = collectFormData();
            saveUserData(formData);
        });
    });
}

// ============================================================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================================================

document.addEventListener('DOMContentLoaded', initializeApp);