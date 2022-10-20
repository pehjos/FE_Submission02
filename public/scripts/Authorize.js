document.querySelector('body')
    .onload = function ()
    {
        authenticate();
    };

function authenticate()
{
    const refresh_token = getCookie('refresh_token');
    const access_token = getCookie('access_token');
    if (refresh_token === '')
    {
        window.location.replace('../login.html');
    }
    else if (access_token === '')
    {
        refreshToken(refresh_token);
    }
}


// login

function logout()
{
    console.log('logout');
    setCookie('access_token', '');
    setCookie('refresh_token', '');
    window.location.replace('../login.html');
}
