import "./style.css";

class SimpleCRUD {
  constructor() {
    this.userData = [];
    this.fetchDataFromAPI();
    this.addUser();
  }

  /**
   * Fetches data from the API 'https://jsonplaceholder.typicode.com/posts'
   */
  fetchDataFromAPI() {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(json => {
        this.userData = json;
        this.generateTable();
      });
  }

  generateTable() {
    if (document.body.contains(document.getElementById("pager"))) {
      var table = document.getElementById("pager");
      if (table) table.remove();
    }
    if (this.userData) {
      console.log("Inside generate");
      console.log(this.userData);
      let myTableDiv = document.getElementById("data");

      let table = document.createElement("TABLE");
      table.class = "table";
      table.id = "pager";
      let tableHead = document.createElement("TBODY");
      table.appendChild(tableHead);

      let headers = document.createElement("TR");

      let userId = document.createElement("TH");
      userId.innerText = "User ID";
      headers.appendChild(userId);
      let name = document.createElement("TH");
      name.innerText = "Name";
      headers.appendChild(name);
      let userName = document.createElement("TH");
      userName.innerText = "Username";
      headers.appendChild(userName);
      let emailId = document.createElement("TH");
      emailId.innerText = "Email ID";
      headers.appendChild(emailId);
      let action = document.createElement("TH");
      action.innerText = "Action";
      headers.appendChild(action);
      tableHead.appendChild(headers);

      let tableBody = document.createElement("TBODY");
      table.appendChild(tableBody);

      for (let i = 0; i < this.userData.length; i++) {
        let tr = document.createElement("TR");
        let company = this.userData[i];
        let keys = Object.keys(company);
        if (company.hasOwnProperty("id")) {
          let td = document.createElement("TD");
          td.appendChild(document.createTextNode(this.userData[i].id));
          tr.appendChild(td);
        }
        if (company.hasOwnProperty("name")) {
          let td = document.createElement("TD");
          td.appendChild(document.createTextNode(this.userData[i].name));
          tr.appendChild(td);
        }
        if (company.hasOwnProperty("username")) {
          let td = document.createElement("TD");
          td.appendChild(document.createTextNode(this.userData[i].username));
          tr.appendChild(td);
        }
        if (company.hasOwnProperty("email")) {
          let td = document.createElement("TD");
          td.appendChild(document.createTextNode(this.userData[i].email));
          tr.appendChild(td);
        }

        let checkUser = document.createElement("TD");
        let actionElement = document.createElement("input");
        actionElement.type = "checkbox";
        actionElement.id = company.id;
        actionElement.checked = false;
        actionElement.addEventListener("click", () => {
          document.getElementById("edit-user").disabled = false;
          document.getElementById("delete-user").disabled = false;
          this.editUser(this.userData[i]);
          this.deleteUser(company.id);
        });
        checkUser.appendChild(actionElement);
        tr.appendChild(checkUser);
        tableBody.appendChild(tr);
      }
      myTableDiv.appendChild(table);
    } else {
      let myTableDiv = document.getElementById("data");
      myTableDiv.innerHTML = "User data does not exists!";
    }
  }

  addUser() {
    document.getElementById("add-user").addEventListener("click", () => {
      document.getElementsByClassName("overlay")[0].style.display = "block";
      document
        .getElementsByClassName("close")[0]
        .addEventListener("click", () => {
          document.getElementsByClassName("overlay")[0].style.display = "none";
        });

      document.getElementById("submitUser").addEventListener("click", () => {
        let userId = document.getElementById("userId").value;
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let userName = document.getElementById("userName").value;

        fetch("https://jsonplaceholder.typicode.com/users", {
          method: "POST",
          body: JSON.stringify({
            id: userId,
            name: name,
            email: email,
            phone: phone,
            username: userName
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            this.userData.push(json);
            console.log(this.userData);
            this.generateTable();
            document.getElementsByClassName("overlay")[0].style.display =
              "none";
          });
      });
    });
  }

  editUser(user) {
    document.getElementById("edit-user").addEventListener("click", () => {
      document.getElementsByClassName("overlay")[0].style.display = "block";
      document
        .getElementsByClassName("close")[0]
        .addEventListener("click", () => {
          document.getElementsByClassName("overlay")[0].style.display = "none";
        });
      document.getElementById("userId").value = user.id;
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = user.phone;
      document.getElementById("userName").value = user.username;
      document.getElementById("userId").disabled = true;

      document.getElementById("submitUser").addEventListener("click", () => {
        let userId = document.getElementById("userId").value;
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let userName = document.getElementById("userName").value;

        fetch("https://jsonplaceholder.typicode.com/users/" + userId, {
          method: "PUT",
          body: JSON.stringify({
            id: userId,
            name: name,
            email: email,
            phone: phone,
            username: userName
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            for (let i in this.userData) {
              if (this.userData[i].id == json.id) {
                this.userData[i] = json;
              }
            }
            console.log(this.userData);
            this.generateTable();
            document.getElementsByClassName("overlay")[0].style.display =
              "none";
            document.getElementById("userId").disabled = false;
            document.getElementById("userId").value = "";
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("userName").value = "";
          });
      });
    });
  }

  deleteUser(user) {
    document.getElementById("delete-user").addEventListener("click", () => {
      console.log("deleting " + user);
      fetch("https://jsonplaceholder.typicode.com/users/" + user, {
        method: "DELETE"
      });
      for (let i in this.userData) {
        if (this.userData[i].id == user) {
          this.userData.splice(i, 1);
        }
      }
      this.generateTable();
      document.getElementById("delete-user").disabled = true;
    });
  }
}

let pager = new SimpleCRUD();
