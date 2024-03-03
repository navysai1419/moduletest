const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";


let cryptoData = []; 
let filteredData = []; 


async function fetchDataAndRender() {
  try {
    const response = await fetch(apiUrl);
    cryptoData = await response.json();
    renderTable(cryptoData);
  } catch (error) {
    console.error('Error fetching data with async/await:', error);
  }
}

// Render data in tabley
function renderTable(data) {
  const tableBody = document.getElementById('cryptoBody');
  tableBody.innerHTML = '';

  data.forEach(crypto => {
    const row = tableBody.insertRow();

    
    const nameCell = row.insertCell();
    const image = document.createElement('img');
    image.src = crypto.image;
    image.alt = crypto.name;
    image.width = 20; 
    nameCell.appendChild(image);
    const nameSpan = document.createElement('span');
    nameSpan.textContent = crypto.name;
    nameCell.appendChild(nameSpan);

    const symbolCell = row.insertCell();
    symbolCell.textContent = crypto.symbol.toUpperCase();

    const priceCell = row.insertCell();
    priceCell.textContent = `$${crypto.current_price}`;

    const volumeCell = row.insertCell();
    volumeCell.textContent = `$${crypto.total_volume}`;

    const percentChangeCell = row.insertCell();
    percentChangeCell.textContent = `${crypto.price_change_percentage_24h}%`;
    percentChangeCell.textContent = `${crypto.price_change_percentage_24h}%`;
    const percentChange = parseFloat(crypto.price_change_percentage_24h);
    if (percentChange > 0) {
      percentChangeCell.style.color = 'green';
    } else if (percentChange < 0) {
      percentChangeCell.style.color = 'red';
    }

    const marketCapCell = row.insertCell();
    marketCapCell.textContent = `Mkt Cap: $${crypto.market_cap}`;

    
  });
}


// Function to filter data
function filterData() {
  const marketCapFilter = document.getElementById('marketCapFilter').value.trim();
  const percentChangeFilter = document.getElementById('percentChangeFilter').value.trim();

  const filteredData = cryptoData.filter(crypto => {
    const isMarketCapMatch = marketCapFilter === '' || crypto.market_cap.toString().toLowerCase().includes(marketCapFilter.toLowerCase());
    const isPercentChangeMatch = percentChangeFilter === '' || crypto.price_change_percentage_24h.toString().toLowerCase().includes(percentChangeFilter.toLowerCase());

    return isMarketCapMatch && isPercentChangeMatch;
  });

  renderTable(filteredData);
}

// Function to search for name or symbol
function searchByNameOrSymbol() {
  const searchFilter = document.getElementById('searchFilter').value.trim().toLowerCase();

  const filteredData = cryptoData.filter(crypto => {
    const nameMatch = crypto.name.toLowerCase().includes(searchFilter);
    const symbolMatch = crypto.symbol.toLowerCase().includes(searchFilter);

    return nameMatch || symbolMatch;
  });

  renderTable(filteredData);
}

// Function to debounce search
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Event listeners for filters with debounce
document.getElementById('marketCapFilter').addEventListener('input', debounce(filterData, 300));
document.getElementById('percentChangeFilter').addEventListener('input', debounce(filterData, 300));
document.getElementById('searchFilter').addEventListener('input', debounce(searchByNameOrSymbol, 300));

// Initial data fetch and render
fetchDataAndRender();
