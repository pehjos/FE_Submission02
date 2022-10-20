/**
 * This script handles the authentication
 * It is used only on the login page
 */
 document.querySelector('form')
 .addEventListener('submit', login);

document.querySelector('body')
 .onload = function ()
 {
     const refresh_token = getCookie('refresh_token');
     const access_token = getCookie('access_token');
     if (refresh_token !== '')
     {
         if (access_token === '')
         {
             refreshToken(refresh_token);
         }
         
         window.location.replace('../dashboard.html');
     }
 };

function login(e)
{
 e.preventDefault();
 
 const username = document.getElementsByName('username')[0].value.trim();
 const password = document.getElementsByName('password')[0].value.trim();
 
 const payload = {
     username,
     password,
 };
 
 if (username !== '' && password !== '')
     fetchData(loginURL, null, (method = 'POST'), payload)
     .then((data) =>
     {
       
         if (data.msg == 'Bad credentials')
         {
             const error = document.querySelector('.error');
             error.classList.remove('hidden');
             setTimeout(function ()
             {
                 notfication.classList.add('hidden');
             }, 3000);
         }
         else if (data.access_token)
         {
             setCookie('access_token', data.access_token, 15, 'mins');
             setCookie('refresh_token', data.refresh_token);
             window.location.replace('../dashboard.html');
         }
     });
}
