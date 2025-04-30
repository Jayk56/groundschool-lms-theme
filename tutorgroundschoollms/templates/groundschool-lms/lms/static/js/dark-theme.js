$(document).ready(function() {
    'use strict';

    const themeCookie = 'groundschool-lms-toggle-dark';

    function applyThemeOnPage(){
      const theme = $.cookie(themeCookie);
      {% if GROUNDSCHOOL_LMS_ENABLE_DARK_TOGGLE %}
      $('body').toggleClass("groundschool-lms-dark-theme", theme === 'dark');       // append or remove dark-class based on cookie-value
      // update expiry
      $.cookie(themeCookie, theme, { domain: window.location.hostname, expires: 90, path: '/' });
      {% endif %}
    }

    function setThemeToggleBtnState(){
      const theme = $.cookie(themeCookie);
      $("#toggle-switch-input").prop("checked", theme === 'dark');
    }
    
    function toggleTheme(){
      const themeValue = $.cookie(themeCookie) === 'dark' ? 'light' : 'dark';
      $.cookie(themeCookie, themeValue, { domain: window.location.hostname, expires: 90, path: '/' });
        
      applyThemeOnPage();
    }

    // Listener for updating the theme inside an iframe
    window.addEventListener("message", function(e){
      if (e.data && e.data["groundschool-lms-toggle-dark"]){
        applyThemeOnPage();
      }
    });

    applyThemeOnPage();  // loading theme on page load
    setThemeToggleBtnState(); // check/uncheck toggle btn based on theme

    $('#toggle-switch').on('change', toggleTheme);
});
