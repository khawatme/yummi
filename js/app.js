strApiLink = 'https://www.themealdb.com/api/json/v1/1/';
strPreviewPage = '';

async function getMeals() {
  let apiResponse = await fetch(`${strApiLink}search.php?s=`);
  let jsonApiResponse = await apiResponse.json();
  jsonApiResponse.meals !== null ? displayMeals(jsonApiResponse.meals.slice(0,20)) : '';
}

async function getMealsCategories() {
  let apiResponse = await fetch(`${strApiLink}categories.php`);
  let jsonApiResponse = await apiResponse.json();
  jsonApiResponse.meals !== null ? displayMeals(jsonApiResponse.categories.slice(0,20),'c') : '';  
}

/**
 * 
 * @param {array} arr 
 * @param {string} type , m to display meals, c to display categories, a to display areas, i to display ingredients
 */
function displayMeals(arr,type = 'm') {
  let strHTML = ``;

  if (type == 'm') {
    for (let i = 0; i < arr.length; i++) {
      strHTML += `
      
      <div class="col-lg-3 col-md-4">
        <div class="meal position-relative overflow-hidden rounded-3" data-id=${arr[i].idMeal}>
          <img src=${arr[i].strMealThumb} class="img-fluid rounded-3" alt="">
          <div class="meal-layer h-100 w-100 position-absolute d-flex align-items-center p-3">
            <h4>${arr[i].strMeal}</h4>
          </div>
        </div>
      </div>
      `;
    }
  } else if (type == 'c') {
    for (let i = 0; i < arr.length; i++) {
      strHTML += `
      <div class="col-lg-3 col-md-4">
        <div class="meal position-relative overflow-hidden rounded-3" data-id=${arr[i].strCategory}>
          <img src=${arr[i].strCategoryThumb} class="img-fluid rounded-3" alt="">
          <div class="meal-layer h-100 w-100 position-absolute p-3">
            <h4 class="text-center">${arr[i].strCategory}</h4>
            <p>${arr[i].strCategoryDescription.split(' ').slice(0,10).join(' ') + ' ...'}</p>
          </div>
        </div>
      </div>
      `;
    }
  } else if (type == 'a') {
    for (let i = 0; i < arr.length; i++) {
      strHTML += `
      <div class="col-lg-3 col-md-4 text-white text-center">
        <div class="meal position-relative overflow-hidden rounded-3" data-id=${arr[i].strArea}>
          <i class="fa-solid fa-globe fa-3x"></i>
          <h3>${arr[i].strArea}</h3>
        </div>
      </div>
      `;
    }
  } else if (type == 'i') {
    for (let i = 0; i < arr.length; i++) {
      strHTML += `
      <div class="col-lg-3 col-md-4 text-white text-center">
        <div class="meal position-relative overflow-hidden rounded-3" data-id=${arr[i].strIngredient}>
        <i class="fa-solid fa-utensils fa-3x"></i>
          <h3>${arr[i].strIngredient}</h3>
          <p>${arr[i].strDescription.split(' ').slice(0,30).join(' ') + ' ...'}</p>
        </div>
      </div>
      `;
    }
  }
  
  $('.meals').html(strHTML);
  $('.meal').mouseenter(function () {
    $(this).find('.meal-layer').animate({top: '0px'},300);
  });
  $('.meal').mouseleave(function () {
    $(this).find('.meal-layer').animate({top: '100%'},300);
  });

  // Back button
  // strPreviewPage = $('body').html();

  if (type == 'm') {
    $('.meal').click(function () {
      getMeal($(this).attr('data-id'));
    });
  } else if (type == 'c') {
    $('.meal').click(function () {
      getMealsByFilter($(this).attr('data-id'));
    });
  } else if (type == 'a') {
    $('.meal').click(function () {
      getMealsByFilter($(this).attr('data-id'),'a');
    });
  } else if (type == 'i') {
    $('.meal').click(function () {
      getMealsByFilter($(this).attr('data-id'),'i');
    });
  }
}

async function getMeal(mealId) {
  let apiResponse = await fetch(`${strApiLink}lookup.php?i=${mealId}`);
  let jsonApiResponse = await apiResponse.json();
  jsonApiResponse = await jsonApiResponse.meals[0];

  let strRecipes = ``;
  for(let i = 1; i <= 20; i++) {
    let strMeasure = jsonApiResponse['strMeasure'  + [i]];
    let strIngredient = jsonApiResponse['strIngredient'  + [i]];
    let strRecipe = strMeasure + ' ' + strIngredient;

    strRecipe.length > 2 ?
    strRecipes += `
    <div class="alert alert-info d-inline-block py-1 px-2" role="alert">${strMeasure + ' ' + strIngredient}</div>`
    : '';
  }

  let strTags = ``;
  if(jsonApiResponse.strTags) {
    strTags += `<h3>Tags :</h3>`;
    let arrTags = jsonApiResponse.strTags.split(",");
    arrTags.forEach(tagElement => {
      strTags += `
      <div class="alert alert-danger d-inline-block py-1 px-2" role="alert">${tagElement}</div>`
    })
  }

  let strHTML = `
  <div class="col-md-4 text-white">
    <div class="meal-info-img">
      <img src=${jsonApiResponse.strMealThumb} class="img-fluid rounded-3" alt="">
      <h3 class="my-2 fw-bold">${jsonApiResponse.strMeal}</h4>
    </div>
  </div>
  <div class="col-md-8 text-white">
    <div class="meal-info">
      <h3 class="fw-bold">Instructions</h3>
      <p>${jsonApiResponse.strInstructions}</p>
      <h3><span class="fw-bold">Area :</span> ${jsonApiResponse.strArea}</h3>
      <h3><span class="fw-bold">Category :</span> ${jsonApiResponse.strCategory}</h3>
      <h3>Recipes :</h3>
        ${strRecipes}
        ${strTags}
      <div class="btns my-2">
        <button type="button" class="btn btn-info"><a class="text-decoration-none text-white" href=${jsonApiResponse.strSource} target="_blank">Source</a></button>
        <button type="button" class="btn btn-danger"><a class="text-decoration-none text-white" href=${jsonApiResponse.strYoutube} target="_blank">Youtube</a></button>
      </div>
    </div>
  </div>
  `;

  $('.meals').html(strHTML);
  // $('.btn-back').show();
  // $('.btn-back').click(()=> {
  //   $('body').html(strPreviewPage);
  // })
}

/**
 * 
 * @param {string} type - a to get list of areas and i to get list of ingredients
 */
async function getList(type) {
  let apiResponse = await fetch(`${strApiLink}list.php?${type}=list`);
  let jsonApiResponse = await apiResponse.json();
  jsonApiResponse.meals !== null ? displayMeals(jsonApiResponse.meals.slice(0,20),type) : '';
}

/**
 * 
 * @param {string} strSearch 
 * @param {string} type - c filter by category, a filter by area
 */
async function getMealsByFilter(strSearch,type = 'c') {
  let apiResponse = await fetch(`${strApiLink}filter.php?${type}=${strSearch}`);
  let jsonApiResponse = await apiResponse.json();
  jsonApiResponse.meals !== null ? displayMeals(jsonApiResponse.meals.slice(0,20)) : '';
}

/**
 * 
 * @param {string} strSearch 
 * @param {string} strNameOrLetter - s to Search meal by name, f search by first letter
 */
async function searchMeal(strSearch,strNameOrLetter = 's') {
  if (strSearch.length > 0) {
    let apiResponse = await fetch(`${strApiLink}search.php?${strNameOrLetter}=${strSearch}`);
    let jsonApiResponse = await apiResponse.json();
    jsonApiResponse.meals !== null ? displayMeals(jsonApiResponse.meals.slice(0,20)) : '';
  }
}

function toggleNav() {
  $('.nav-btn, btn').click( ()=> {
    if($('.nav-out').css('left') == '250px') {
      $('.nav-out').animate({left: '0px',display: 'none'},500);
      $('.nav-in').animate({left: '-250px',display: 'none'},500);
      $('.nav-items-top').slideUp();
    } else {
      $('.nav-out').animate({left: '250px',display: 'none'},500);
      $('.nav-in').animate({left: '0px',display: 'none'},500);
      $('.nav-items-top').slideDown(1000);
    }
  })
}

(() => {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

getMeals();
toggleNav();

$('#categories').click(()=> {
  $('.search,.contact').addClass('d-none')
  getMealsCategories();
})

$('#area').click(()=> {
  $('.search,.contact').addClass('d-none');
  getList('a');
})

$('#ingredients').click(()=> {
  $('.search,.contact').addClass('d-none');
  getList('i');
})

$('#contact').click(()=> {
  $('.search').addClass('d-none');
  $('.meals').html('');
  $('.contact').removeClass('d-none');
})

$('#search').click(()=> {
  $('.search').removeClass('d-none');
  $('.contact').addClass('d-none');
  $('.meals').html('');

  if($('#s-name').length > 0) {
    $('#s-name').on('input',function () {
      searchMeal($('#s-name').val(),'s');
    })
  }

  if($('#s-letter').length > 0) {
    $('#s-letter').on('input',function () {
      searchMeal($('#s-letter').val(),'f');
    })
  }
})
