let search_term = '';

function setTableData(search_term, page = 1)
{
    const search_url = searchTerm(search_term, page);
    
    fetchData(search_url, getCookie('access_token'))
        .then(({ page, total, orders }) =>
        {
            const el_current_page = document.querySelector('.current-page');
            const el_total_pages = document.querySelector('.total-pages');
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            
            const total_pages = Math.ceil(total / orders.length);
            
            el_current_page.innerHTML = page;
            el_total_pages.innerHTML = total_pages ? total_pages : 1;
            
            for (let rows of orders)
            {
                let tr = document.createElement('TR');
                
                const name = appendToTable(tr, rows.product.name);
                const date = appendToTable(
                    tr,
                    new Date(rows.created_at)
                    .toLocaleDateString()
                );
                const price = appendToTable(
                    tr,
                    `${rows.currency}${rows.total}`
                );
                const status = appendToTable(
                    tr,
                    capitializeFirstLetter(rows.status)
                );
                if (rows.status === 'processing')
                {
                    status.lastChild.classList.add('processing');
                }
                else if (rows.status === 'delivered')
                {
                    status.lastChild.classList.add('delivered');
                }
                
                tbody.appendChild(name);
                tbody.appendChild(date);
                tbody.appendChild(price);
                tbody.appendChild(status);
            }
        })
        .catch((error) => console.log('Error fetching order data', error));
}

setTableData(search_term);

function handlePageChange(direction)
{
    let el_current_page = document.querySelector('.current-page');
    let current_page = parseInt(el_current_page.innerHTML);
    const total_pages = +document.querySelector('.total-pages')
        .innerHTML;
    const right_pointer = document.querySelector('.right-pointer');
    const left_pointer = document.querySelector('.left-pointer');
    
    if (direction === 'forward')
    {
        if (current_page < total_pages)
        {
            current_page = current_page + 1;
            el_current_page.innerHTML = current_page;
            setTableData(search_term, current_page);
        }
        if (current_page === 20)
        {
            right_pointer.classList.add('hide');
        }
    }
    
    if (direction === 'back')
    {
        if (current_page > 1)
        {
            current_page = current_page - 1;
            el_current_page.innerHTML = current_page;
            setTableData(search_term, current_page);
        }
        if (current_page === 1)
        {
            left_pointer.classList.add('hide');
        }
    }
    
    if (current_page > 1)
    {
        left_pointer.classList.remove('hide');
    }
    
    if (current_page < 20)
    {
        right_pointer.classList.remove('hide');
    }
}

document.querySelector('.search')
    .addEventListener('submit', handleSubmit);

function handleSubmit(_event)
{
    _event.preventDefault();
    
    search_term = document.getElementsByName('search')[0].value.trim();
    
    setTableData(search_term);
}
