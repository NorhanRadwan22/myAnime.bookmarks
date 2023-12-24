var animeNameInput = document.querySelector('#animeName');
var animeURLInput = document.querySelector('#animeURL');
var tableRow = document.querySelector('#tableBody');
var btn = document.querySelector('.btn');
var add_btn = document.querySelector('#add_btn');
var update_btn = document.querySelector('#update_btn');
var rowsPerPageSelect = document.getElementById('rowsPerPage');

//regex
var animeRegixname = /^.{3,}$/;
var https = /^http(s)?:\/\//;
var animeRegixurl = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
/^(https?:\/\/)?([\w.]+\.\w+)(\/[\w\/]*)*$/

//input validate
function validateAnimeName() {
    var animeName = animeNameInput.value.trim();
    animeName = animeName.charAt(0).toUpperCase() + animeName.slice(1);
    console.log(animeName);
    if (animeRegixname.test(animeName)) {
        // Valid anime name
        animeNameInput.value = animeName;
        return true;
    } else {
        // Invalid anime name
        
        return false;
    }
}
var animeURL;
function validateAnimeURL() {
    var animeURL = animeURLInput.value.trim();
    animeURL = animeURL.replace(/^https?:\/\//, '');
    if (animeRegixurl.test(animeURL)) {
        animeURLInput.value = 'https://' + animeURL;
        console.log(animeURLInput.value);
        return true;
    } else {
        // Invalid URL
        
        return false;
    }
}
var animelist = [];
var currentPage = 1;
var rowsPerPage = parseInt(rowsPerPageSelect.value);

// Load anime list from local storage
if (localStorage.getItem('anime') != null) {
    animelist = JSON.parse(localStorage.getItem('anime'));
    display(animelist, currentPage, rowsPerPage);
}

add_btn.onclick = function () {
    addData();
    clearForm();
}

function addData() {
    if (animeNameInput.value.trim() === '' || animeURLInput.value.trim() === '') {
        alert("Anime name and URL cannot be empty.");
        return;
    }
    if (validateAnimeName(), validateAnimeURL())
    {
        anime = {
            animeName: animeNameInput.value,
            animeURL: animeURLInput.value
        }
        animelist.push(anime);
        localStorage.setItem('anime', JSON.stringify(animelist));
        display(animelist, currentPage, rowsPerPage);
    } else {
        if (!validateAnimeName())
        {
            alert("Anime name must be at least 3 characters long.");
        } if (!validateAnimeURL()) {
            alert("Invalid URL format.");
            }
        }
}
function truncateURL(url) {
    var maxLength = 20;
    //teranary operator
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;

}
function display(arr, page, rowsPerPage) {
    var startIndex = (page - 1) * rowsPerPage;
    var endIndex = startIndex + rowsPerPage;
    var paginatedArr = arr.slice(startIndex, endIndex);
    

    var box = "";
    for (var i = 0; i < paginatedArr.length; i++) {
        var truncatedURL = truncateURL(paginatedArr[i].animeURL);
        box +=
            `<tr scope="row">
                <td>${startIndex + i + 1}</td>
                <td>${paginatedArr[i].animeName}</td>
                <td>${truncatedURL}</td>
                <td><button type="button" class="btn btn-success" onclick="openAnimelink(${i})"><i class="fa-solid fa-link"></i></i></button></td>
                <td><button type="button" class="btn btn-warning" onclick="updateData(${i})"><i class="fa-solid fa-pen-to-square"></i></i></button></td>
                <td><button type="button" class="btn btn-danger" onclick="deleteAnime(${i})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
    }
    tableRow.innerHTML = box;

    // Update pagination controls
    updatePaginationControls();
}
function clearForm() {
    animeNameInput.value = '';
    animeURLInput.value = '';
}

function deleteAnime(index) {
    animelist.splice(index, 1);
    localStorage.setItem('anime', JSON.stringify(animelist));
    display(animelist, currentPage, rowsPerPage);
}

function searchFunc(term) {
    var searchArr = [];
    for (var i = 0; i < animelist.length; i++) {
        if (animelist[i].animeName.toLowerCase().includes(term.toLowerCase())) {
            searchArr.push(animelist[i]);
        }
    }
    display(searchArr, currentPage, rowsPerPage);
}
var Myindex;
function updateData(index) {
    Myindex = index;
    add_btn.classList.replace("d-block", "d-none");
    update_btn.classList.replace("d-none", "d-block");
    animeNameInput.value = animelist[index].animeName;
    animeURLInput.value = animelist[index].animeURL;
}
function lastUpdate() {
    var anime = {
        animeName: animeNameInput.value,
        animeURL: animeURLInput.value
    };
    animelist.splice(Myindex, 1, anime);
    localStorage.setItem('anime', JSON.stringify(animelist));
    console.log(animelist)
    display(animelist, currentPage, rowsPerPage);
    clearForm();
    add_btn.classList.replace("d-none", "d-block");
    update_btn.classList.replace("d-block", "d-none");
}
function openAnimelink(index) {
    var url = animelist[index].animeURL;
    window.open(url,'_blank')
}

function updatePaginationControls() {
    var totalPages = Math.ceil(animelist.length / rowsPerPage);

    // Display current page and total pages
    var pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    // Enable/disable Previous button based on current page
    var prevButton = document.getElementById('prevButton');
    prevButton.disabled = currentPage === 1;

    // Enable/disable Next button based on total pages
    var nextButton = document.getElementById('nextButton');
    nextButton.disabled = currentPage === totalPages;
}

// Event listener for changing rows per page
rowsPerPageSelect.addEventListener('change', function () {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 1; // Reset to the first page when changing rows per page
    display(animelist, currentPage, rowsPerPage);
});

// Event listener for Previous button
document.getElementById('prevButton').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        display(animelist, currentPage, rowsPerPage);
    }
});
// Event listener for Next button
document.getElementById('nextButton').addEventListener('click', function () {
    var totalPages = Math.ceil(animelist.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        display(animelist, currentPage, rowsPerPage);
    }
});
