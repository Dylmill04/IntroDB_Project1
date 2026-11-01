/*
    File description:  

*/

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5050/getAll')
        .then(response => response.json())
        .then(data => renderTable(data.data));
});

// Render users into the table
function renderTable(users) {
    const tbody = document.querySelector('#user-table-body');
    tbody.innerHTML = "";

    if (!users || users.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No matching users found</td></tr>";
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.userid}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.salary ?? ''}</td>
            <td>${user.age ?? ''}</td>
            <td>${user.registerday ? user.registerday.substring(0, 10) : ''}</td>
            <td>${user.signintime ? new Date(user.signintime).toLocaleString() : 'Never'}</td>
        `;
        tbody.appendChild(row);
    });
}

// 1. Register Button
document.querySelector('#btn-register').addEventListener('click', () => {
    const user = {
        userid: document.querySelector('#reg-userid').value,
        password: document.querySelector('#reg-password').value,
        firstname: document.querySelector('#reg-firstname').value,
        lastname: document.querySelector('#reg-lastname').value,
        salary: parseFloat(document.querySelector('#reg-salary').value) || 0,
        age: parseInt(document.querySelector('#reg-age').value, 10) || 0
    };

    fetch('http://localhost:5050/register', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('User successfully registered!');
        } else {
            alert('Registration failed (userid might already exist).');
        }
    });
});

// 2. Sign-In Button
document.querySelector('#btn-signin').addEventListener('click', () => {
    const credentials = {
        userid: document.querySelector('#login-userid').value,
        password: document.querySelector('#login-password').value
    };

    fetch('http://localhost:5050/signin', {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(credentials)
    })
    .then(res => res.json())
    .then(data => {
        const statusEl = document.querySelector('#signin-status');
        if (data.success) {
            statusEl.style.color = "green";
            statusEl.textContent = `Signed in successfully as ${data.user.userid}!`;
        } else {
            statusEl.style.color = "red";
            statusEl.textContent = data.message || "Sign in failed.";
        }
    });
});

// 3. Search by First / Last Name
document.querySelector('#btn-search-name').addEventListener('click', () => {
    const first = document.querySelector('#search-firstname').value;
    const last = document.querySelector('#search-lastname').value;

    fetch(`http://localhost:5050/searchByName?firstname=${encodeURIComponent(first)}&lastname=${encodeURIComponent(last)}`)
    .then(res => res.json())
    .then(json => renderTable(json.data));
});

// 4. Search by User ID
document.querySelector('#btn-search-userid').addEventListener('click', () => {
    const userid = document.querySelector('#search-userid').value;

    fetch(`http://localhost:5050/searchByUserId/${encodeURIComponent(userid)}`)
    .then(res => res.json())
    .then(json => renderTable(json.data));
});

 // 5. Search by Salary Range
document.querySelector('#btn-search-salary').addEventListener('click', () => {
    const minInput = document.querySelector('#salary-min').value;
    const maxInput = document.querySelector('#salary-max').value;

    if (minInput === '' || maxInput === '') {
        alert('Please enter both a minimum and maximum salary.');
        return;
    }

    const minSalary = Number(minInput);
    const maxSalary = Number(maxInput);

    if (
        !Number.isFinite(minSalary) ||
        !Number.isFinite(maxSalary) ||
        minSalary < 0 ||
        maxSalary < minSalary
    ) {
        alert('Please enter a valid salary range.');
        return;
    }

    const params = new URLSearchParams({
        min: minSalary,
        max: maxSalary
    });

    fetch(`http://localhost:5050/searchBySalary?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Salary search failed.');
            }
            return response.json();
        })
        .then(json => {
            renderTable(json.data);
        })
        .catch(error => {
            console.error('Error searching by salary:', error);
            alert('Could not search by salary. Please try again.');
        });
});


 // 6. Search by Age Range
document.querySelector('#btn-search-age').addEventListener('click', () => {
    const minInput = document.querySelector('#age-min').value;
    const maxInput = document.querySelector('#age-max').value;

    if (minInput === '' || maxInput === '') {
        alert('Please enter both a minimum and maximum age.');
        return;
    }

    const minAge = Number(minInput);
    const maxAge = Number(maxInput);

    if (
        !Number.isInteger(minAge) ||
        !Number.isInteger(maxAge) ||
        minAge < 0 ||
        maxAge < minAge
    ) {
        alert('Please enter a valid age range using whole numbers.');
        return;
    }

    const params = new URLSearchParams({
        min: minAge,
        max: maxAge
    });

    fetch(`http://localhost:5050/searchByAge?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Age search failed.');
            }
            return response.json();
        })
        .then(json => renderTable(json.data))
        .catch(error => {
            console.error('Error searching by age:', error);
            alert('Could not search by age. Please try again.');
        });
});


 // 7. Search Users Registered After a Specified Person
document.querySelector('#btn-registered-after').addEventListener('click', () => {
    const firstname = document.querySelector('#after-firstname').value.trim();
    const lastname = document.querySelector('#after-lastname').value.trim();

    if (!firstname || !lastname) {
        alert("Please enter the person's first and last name.");
        return;
    }

    const params = new URLSearchParams({ firstname, lastname });

    fetch(`http://localhost:5050/registeredAfterPerson?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration-date search failed.');
            }
            return response.json();
        })
        .then(json => {
            if (json.success === false) {
                alert(json.message || 'Could not find the specified person.');
                return;
            }

            renderTable(json.data);
        })
        .catch(error => {
            console.error('Error searching by registration date:', error);
            alert('Could not complete the search. Please try again.');
        });
});


 // 8. Search Users Who Never Signed In
document.querySelector('#btn-never-signed-in').addEventListener('click', () => {
    fetch('http://localhost:5050/neverSignedIn')
        .then(response => {
            if (!response.ok) {
                throw new Error('Never-signed-in search failed.');
            }
            return response.json();
        })
        .then(json => renderTable(json.data))
        .catch(error => {
            console.error('Error searching for users who never signed in:', error);
            alert('Could not retrieve users who have never signed in.');
        });
});


 // 9. Search Users Registered on the Same Day as a Specified Person
document.querySelector('#btn-same-day').addEventListener('click', () => {
    const firstname = document.querySelector('#same-day-firstname').value.trim();
    const lastname = document.querySelector('#same-day-lastname').value.trim();

    if (!firstname || !lastname) {
        alert("Please enter the person's first and last name.");
        return;
    }

    const params = new URLSearchParams({ firstname, lastname });

    fetch(`http://localhost:5050/registeredSameDay?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Same-day search failed.');
            }
            return response.json();
        })
        .then(json => {
            if (json.success === false) {
                alert(json.message || 'Could not find the specified person.');
                return;
            }

            renderTable(json.data);
        })
        .catch(error => {
            console.error('Error searching for users registered on the same day:', error);
            alert('Could not complete the search. Please try again.');
        });
});


// 10. Registered Today
document.querySelector('#btn-registered-today').addEventListener('click', () => {
    fetch('http://localhost:5050/registeredToday')
    .then(res => res.json())
    .then(json => renderTable(json.data));
});


// when the addBtn is clicked
const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function (){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

// when the searchBtn is clicked
const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowById(event.target.dataset.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id); // display the edit row interface
        }
      }
);

function deleteRowById(id){
    // debug(id);
    fetch('http://localhost:5050/delete/' + id,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

let idToUpdate = 0;

function showEditRowInterface(id){
    debug("id clicked: ");
    debug(id);
    document.querySelector('#update-name-input').value = ""; // clear this field
    const updateSetction = document.querySelector("#update-row");  
    updateSetction.hidden = false;
    // we assign the id to the update button as its id attribute value
    idToUpdate = id;
    debug("id set!");
    debug(idToUpdate+"");
}


// when the update button on the update interface is clicked
const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function(){
    debug("update clicked");
    debug("got the id: ");
    debug(updateBtn.value);
    
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update',
          {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(
                  {
                    id: idToUpdate,
                    name: updatedNameInput.value
                  }
            )
          }
    ) 
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
        else 
           debug("no update occurs");
    })
}


// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

function insertRowIntoTable(data){

   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

  // debug(isTableData);

   let tableHtml = "<tr>";
   
   for(var key in data){ // iterating over the each property key of an object data
      if(data.hasOwnProperty(key)){   // key is a direct property for data
            if(key === 'dateAdded'){  // the property is 'dataAdded'
                data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
            }
            tableHtml += `<td>${data[key]}</td>`;
      }
   }

   tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
   tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

   tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        // debug(tableHtml);

        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}