import "./App.css";
import React from "react";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-charts";

function App() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    age: ""
  });
  const [apiRes, setApiRes] = useState({
    message: "",
    status: ""
  });
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true
    }
  ];

  const chartData = React.useMemo(() => {
    const datamap = new Map();
    for (const i of data) {
      if (datamap.has(i.age)) {
        datamap.set(i.age, datamap.get(i.age) + 1);
      } else {
        datamap.set(i.age, 1);
      }
    }
    const agesdata = [];
    datamap.forEach((v, k) => {
      agesdata.push([k, v]);
    });
    let sortedAges = agesdata.sort((a, b) => {
      if (a[1] < b[1]) {
        return -1;
      }
      if (a[1] > b[1]) {
        return 1;
      }
      return 0;
    });

    console.log(sortedAges);

    return [
      {
        label: "Students",
        data: sortedAges
      }
    ];
  }, [data]);

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { type: "ordinal", position: "left" }
    ],
    []
  );

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [refresh]);

  async function fetchStudents() {
    try {
      const res = await axios.get("http://localhost:5000/api/data");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function postNewStudent() {
    try {
      await axios.post("http://localhost:5000/api/create", formData);
      setApiRes({
        message: "Submitted Successfully!",
        status: "success"
      });
    } catch (error) {
      console.log(error);
      setApiRes({
        message: "Something went wrong! Please check the console.",
        status: "error"
      });
    }
    setRefresh(!refresh);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>LifeByte Assignment</h1>
      </header>
      <main className="container mb-5 pb-5">
        <div className="container card mb-5 mt-5">
          <div
            className="mt-3"
            style={{ fontSize: "22px", paddingLeft: "10px" }}
          >
            Create New Student
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              postNewStudent();
            }}
            className="form"
          >
            <label className="input-label form-label">
              Id:
              <input
                className="input-field form-control"
                type="number"
                value={formData.id}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    id: event.target.value
                  });
                }}
              />
            </label>
            <label className="input-label form-label">
              Name:
              <input
                className="input-field form-control"
                type="text"
                value={formData.name}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    name: event.target.value
                  });
                }}
              />
            </label>
            <label className="input-label form-label">
              Age:
              <input
                className="input-field form-control"
                type="number"
                value={formData.age}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    age: event.target.value
                  });
                }}
              />
            </label>
            <button className="submit-btn btn btn-primary" type="submit">
              Submit
            </button>
          </form>
          <p
            className={
              apiRes.status === "success" ? "text-success" : "text-danger"
            }
          >
            {apiRes.message}
          </p>
        </div>
        <div className="container card mb-5">
          <DataTable
            title="Students Table"
            columns={columns}
            data={data}
            pagination
          />
        </div>
        <div
          style={{
            height: "100%"
          }}
        >
          <div
            style={{
              height: "400px",
              padding: "20px"
            }}
          >
            <div className="axis-y-label mb-3" style={{ fontSize: "22px" }}>
              Counts of Ages
            </div>
            <Chart data={chartData} axes={axes} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
