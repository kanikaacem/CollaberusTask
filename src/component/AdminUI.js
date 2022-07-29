import React from "react";
import { useState, useEffect } from "react";
// import toastr from 'reactjs-toastr';
// import 'reactjs-toastr/lib/toast.css';
const axios = require("axios");

function AdminUI() {
  const [peopleData, SetpeopleData] = useState([]);
  const [pageOffset, setpageOffset] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setpageNumber] = useState(0);

  const getPeople = () => {
    axios
      .get("http://localhost:3001/people")
      .then((res) => {
        setPageCount(Math.ceil(res.data.length / perPage));
        SetpeopleData(res.data.slice(pageOffset, pageOffset + perPage));
        // toastr.info('You clicked Success toast');

      })
      .catch((err) => console.log(err));
  };

  const deleteData = (id) => {
    axios
      .delete("http://localhost:3001/people/" + id + "/")
      .then((resp) => {
        // toastr.info('Person is deleted.', '', {displayDuration:3000});

        getPeople();
        toastr.info("Data is deleted");
        // alert('data is deleted');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function EditData(id) {
    let personrow = document.querySelector("#person-" + id).childNodes;
    let savebutton = document.querySelector("#save-" + id);
    personrow[1].contentEditable === "true"
      ? (personrow[1].contentEditable = "false")
      : (personrow[1].contentEditable = "true");
    personrow[1].focus();
    personrow[2].contentEditable === "true"
      ? (personrow[2].contentEditable = "false")
      : (personrow[2].contentEditable = "true");
    personrow[3].contentEditable === "true"
      ? (personrow[3].contentEditable = "false")
      : (personrow[3].contentEditable = "true");
    savebutton.style.display === "block"
      ? (savebutton.style.display = "none")
      : (savebutton.style.display = "block");
  }

  function storeData(id) {
    let personrow = document.querySelector("#person-" + id).childNodes;
    let savebutton = document.querySelector("#save-" + id);

    axios
      .put("http://localhost:3001/people/" + id + "/", {
        name: personrow[1].textContent,
        email: personrow[2].textContent,
        role: personrow[3].textContent,
      })
      .then((resp) => {
        getPeople();
        savebutton.style.display = "none";
        toastr.info('Data is updated');

      })
      .catch((error) => {
        console.log(error);
      });
  }

  function searchPeople(event) {
    let searchValue = document.querySelector(".searchBar").value;
    if (event.key === "Enter" && searchValue !== "") {
      axios
        .get("http://localhost:3001/people?q=" + searchValue + "")
        .then((res) => {
          let pageCount = Math.ceil(res.data.length/perPage);
          setPageCount(pageCount);
          let output = res.data.slice(0,perPage);
          SetpeopleData(output);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const resetData = () => {
    document.querySelector(".searchBar").value = "";
    getPeople();
  };
  const getPageData = (pageNumber) => {
    // setOffset(pageNumber * 10);
    // console.log(pageNumber * 10);
    // console.log(pageNumber * 10 + (perPage - 1));
    setpageNumber(pageNumber);
    let searchValue = document.querySelector(".searchBar");
    if(searchValue.value !== ''){

      axios
      .get("http://localhost:3001/people?q=" + searchValue.value + "")
      .then((res) => {
        let output = res.data.slice(pageNumber * 10, pageNumber * 10 + (perPage - 1));
        SetpeopleData(output);
      
        // SetpeopleData(res.data.slice(offset, offset * perPage));
        // SetpeopleData(res.data.slice(offset, offset * perPage));
      })
      .catch((err) => console.log(err));
    }else{
      axios
      .get("http://localhost:3001/people")
      .then((res) => {
        SetpeopleData(
          res.data.slice(pageNumber * 10, pageNumber * 10 + (perPage - 1))
        );
        // SetpeopleData(res.data.slice(offset, offset * perPage));
        // SetpeopleData(res.data.slice(offset, offset * perPage));
      })
      .catch((err) => console.log(err));
    }
    
  };
  const selectAll = () => {
    let checkboxes = document.querySelectorAll(".personcheckbox");
    let selectAll = document.querySelector(".selectAll");
    for (let i = 0; i < checkboxes.length; i++) {
      if (selectAll.checked) {
        checkboxes[i].checked = true;
      } else {
        checkboxes[i].checked = false;
      }
    }
  };

  const deleteAll = async () => {
    var markedCheckbox = document.querySelectorAll(
    'input[type="checkbox"]:checked'
    );
    for (let i = 0; i < markedCheckbox.length; i++) {
    // console.log(markedCheckbox[i].value);
    await deleteData(markedCheckbox[i].value);
    }

   };
   const selectRow = (id) =>{
    let selectedRow = document.querySelector("#person-"+id);
    if(selectedRow.firstChild.firstChild.checked){
      selectedRow.style.background = '#dbc0c0';
    }else{
      selectedRow.style.background = 'white';
    }
   }
  useEffect(() => {
    getPeople();

  }, []);

  return (
    <>
      <div className="mainDiv">
        <h1 className="appHeading"> Admin UI challenge</h1>
        <div className="personDataDiv">
          <span>
            <input
              className="searchBar"
              placeholder="Search by name,email and role"
              onKeyPress={searchPeople}
            ></input>
            <img
              className="resetImage"
              src="./reset.png"
              onClick={() => resetData()}
            ></img>
          </span>
          <table className="peopleTable">
            <tr className="peopleTableRow">
              <th className="tableData tableHeading ">
                <input
                  type="checkbox"
                  className="selectAll"
                  name="vehicle1"
                  value="all"
                  onClick={() => {
                    selectAll();
                  }}
                ></input>
              </th>
              <th className="tableData tableHeading">Name</th>
              <th className="tableData tableHeading">Email</th>
              <th className="tableData tableHeading">Role</th>
              <th className="tableData tableHeading">Action</th>
            </tr>
            {peopleData.map((val, id) => {
              return (
                <tr
                  className="peopleTableRow"
                  id={"person-" + val.id}
                  key={val.id}
                >
                  <td className="tableData">
                    <input
                      type="checkbox"
                      className="personcheckbox"
                      value={val.id}
                      onClick={()=>selectRow(val.id)}
                    ></input>
                  </td>
                  <td className="tableData" contentEditable="false">
                    {val.name}
                  </td>
                  <td className="tableData" contentEditable="false">
                    {val.email}
                  </td>
                  <td className="tableData" contentEditable="false">
                    {val.role}
                  </td>
                  <td className="tableData">
                    <span>
                      <img
                        className="rowImage save"
                        src="./save.png"
                        id={"save-" + val.id}
                        onClick={() => storeData(val.id)}
                      ></img>
                       <img
                        className="rowImage"
                        src="./edit.png"
                        onClick={() => EditData(val.id)}
                      ></img>
                      <img
                        className="rowImage"
                        src="./delete.png"
                        onClick={() => deleteData(val.id)}
                      ></img>
                     
                    </span>
                  </td>
                </tr>
              );
            })}
          </table>

          <div className="PaginationDiv">
          <button className="deleteAllButton " onClick={() => deleteAll()}> DeleteAll</button>

            {Array.from(Array(pageCount), (e, i) => {
              return (
                <button
                  className={i === pageNumber ? "active_button" : "button"}
                  id={i}
                  onClick={() => getPageData(i)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminUI;
