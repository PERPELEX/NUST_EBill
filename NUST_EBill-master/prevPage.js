document.getElementById("prevPage").addEventListener("click", function(event) {
    event.preventDefault(); // Prevents the default behavior of the anchor tag
    
    goBack();
  });
  
  function goBack() {
    window.history.back();
  }

// Get the target element
var targetElement = document.querySelector('.dropdown-content');
var previousSibling = targetElement.previousElementSibling;

// Add event listeners to target element
targetElement.addEventListener('mouseover', function() {
    // Apply styles to the previous sibling element
    if (previousSibling !== null) {
        previousSibling.style.color = 'rgb(0, 225, 255)';
    }
});

targetElement.addEventListener('mouseout', function() {
    // Revert styles of the previous sibling element
    if (previousSibling !== null) {
        previousSibling.style.color = '';
    }
});

var checkElement = document.querySelector('.optContainer2');
var targetElement = document.querySelector('.optContainer');
if(checkElement !== null) {
    targetElement.style.top='40%';
}

var checkElement = document.querySelector('#addCustomer');
var mainElement = document.querySelector('main');
var loginElement = document.querySelector('.loginForm');
var footerElement = document.querySelector('footer');
var inputElement = document.querySelectorAll('.input');
if(checkElement !== null) {
    mainElement.style.height='125vh';
    loginElement.style.top='47%';
    footerElement.style.top='130%';
    for(let i=0;i<inputElement.length;i++){
        inputElement[i].style.marginBottom='1rem';
    }
}