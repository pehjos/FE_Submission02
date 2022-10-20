/**
 * This script contains helper functions that are used accoss the app.
 * It is used in login, dashboard and orders page
 */

// urls to fetch data from
const loginURL = 'https://freddy.codesubmit.io/login';
const dashboardURL = 'https://freddy.codesubmit.io/dashboard';
const refreshTokenURL = 'https://freddy.codesubmit.io/refresh';

function searchTerm(search_term, page = 1)
{
    return `https://freddy.codesubmit.io/orders?page=${page}&q=${search_term}`;
}

function setCookie(cookie_name, cookie_value, duration = 30, period = 'days')
{
    const date = new Date();
    if (period == 'days')
    {
        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
    }
    else
    {
        date.setTime(date.getTime() + 15 * 60 * 1000);
    }
    let expires = 'expires=' + date.toUTCString();
    document.cookie =
        cookie_name + '=' + cookie_value + ';' + expires + ';path=/';
}

function getCookie(cookie_name)
{
    let name = cookie_name + '=';
    let cookie_array = document.cookie.split(';');
    for (let i = 0; i < cookie_array.length; i++)
    {
        let cookie = cookie_array[i];
        while (cookie.charAt(0) == ' ')
        {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0)
        {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
}

async function refreshToken(refresh_token)
{
    fetchData(refreshTokenURL, refresh_token, 'POST')
        .then((data) =>
            setCookie('access_token', data.access_token, 15, 'mins')
        )
        .catch((error) =>
            console.log('Error while trying to refresh token', error)
        );
}

async function fetchData(url, token, method = 'GET', payload = null)
{
    try
    {
        let response = await fetch(url,
        {
            method: method,
            headers: new Headers(
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            }),
            body: method === 'POST' ? JSON.stringify(payload) :
                null,
        });
        return await response.json();
    }
    catch (error)
    {
        console.log('Error while fetching data', error);
    }
}

function capitializeFirstLetter(word)
{
    return word.charAt(0)
        .toUpperCase() + word.slice(1);
}

function appendToTable(table_row, content)
{
    const td = document.createElement('TD');
    td.appendChild(document.createTextNode(content));
    table_row.appendChild(td);
    return table_row;
}
