// Sample seat data
const seatData = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    cols: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    premiumRows: ['A', 'B'],
    occupiedSeats: [
        'A5', 'A6', 'A7', 'B5', 'B6', 'B7', 
        'C8', 'C9', 'D8', 'D9', 'E10', 'F10',
        'G4', 'G5', 'H4', 'H5', 'I12', 'I13', 'J12', 'J13'
    ],
    prices: {
        standard: 350,
        premium: 800
    }
};

// Generate seat map
const seatMap = document.querySelector('.seat-map');
const sectorView = document.querySelector('.sector-view');
const viewToggle = document.querySelector('.view-toggle');
const selectedCount = document.getElementById('selected-count');
const totalPrice = document.getElementById('total-price');
const confirmBtn = document.getElementById('confirm-btn');

let selectedSeats = [];

function generateSeatMap(rows = seatData.rows, cols = seatData.cols) {
    seatMap.innerHTML = '';
    seatMap.style.gridTemplateColumns = `repeat(${cols.length}, auto)`;
    
    // Add column headers
    seatMap.appendChild(document.createElement('div')); // empty corner
    cols.forEach(col => {
        const colHeader = document.createElement('div');
        colHeader.textContent = col;
        colHeader.style.textAlign = 'center';
        seatMap.appendChild(colHeader);
    });
    
    // Add rows with seats
    rows.forEach(row => {
        const rowHeader = document.createElement('div');
        rowHeader.textContent = row;
        rowHeader.style.textAlign = 'right';
        rowHeader.style.paddingRight = '8px';
        seatMap.appendChild(rowHeader);
        
        cols.forEach(col => {
            const seatId = `${row}${col}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.id = seatId;
            
            if (seatData.premiumRows.includes(row)) {
                seat.classList.add('premium');
            }
            
            if (seatData.occupiedSeats.includes(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.classList.add('available');
            }
            
            seat.addEventListener('click', toggleSeatSelection);
            seatMap.appendChild(seat);
        });
    });
}

function toggleSeatSelection(e) {
    const seat = e.target;
    const seatId = seat.dataset.id;
    
    if (seat.classList.contains('occupied')) return;
    
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        seat.classList.add('available');
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        seat.classList.remove('available');
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateBookingSummary();
}

function updateBookingSummary() {
    const premiumCount = selectedSeats.filter(id => 
        seatData.premiumRows.includes(id.charAt(0))
    ).length;
    const standardCount = selectedSeats.length - premiumCount;
    
    const total = (premiumCount * seatData.prices.premium) + 
                 (standardCount * seatData.prices.standard);
    
    selectedCount.textContent = selectedSeats.length;
    totalPrice.textContent = total.toFixed(2);
    
    confirmBtn.disabled = selectedSeats.length === 0;
}

function showSector(sector) {
    // In a real app, this would show only seats from the selected sector
    // For this demo, we'll just generate all seats but could filter
    generateSeatMap();
    
    // Show seat map and hide sector view
    seatMap.style.display = 'grid';
    sectorView.style.display = 'none';
    viewToggle.textContent = 'Back to Sector View';
}

// Event listeners
document.querySelectorAll('.sector').forEach(sector => {
    sector.addEventListener('click', () => showSector(sector.dataset.sector));
});

viewToggle.addEventListener('click', () => {
    if (seatMap.style.display === 'grid') {
        seatMap.style.display = 'none';
        sectorView.style.display = 'grid';
        viewToggle.textContent = 'Show Full Seat Map';
    } else {
        showSector();
    }
});

confirmBtn.addEventListener('click', () => {
    alert(`Success! You've booked ${selectedSeats.length} seats.`);
    // In a real app, this would submit to a server
});

// Initialize
generateSeatMap();

// Responsive check - hide sector view on larger screens
if (window.innerWidth >= 768) {
    seatMap.style.display = 'grid';
    sectorView.style.display = 'none';
    viewToggle.style.display = 'none';
}
