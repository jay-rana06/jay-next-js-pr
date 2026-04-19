"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [hobby, setHobby] = useState([]);
  const [error, setError] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const FirstIndex = (page - 1) * limit;
  const LastIndex = FirstIndex + limit;
  const TotalPage = Math.ceil(list.length / limit);

  const cities = [
    "Navsari","Surat","Gandhinagar","Ahmedabad",
    "Bhastan","Anand","kutch","Mehsana",
  ];

  const handleChange = (event) => {
    let { name, value, checked } = event.target;

    if (name == "hobby") {
      let newHobby = [...hobby];

      if (checked) newHobby.push(value);
      else newHobby = newHobby.filter((val) => val != value);

      value = newHobby;
      setHobby(newHobby);
    }

    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validation()) return;

    let newList = [...list];

    if (editId == null) {
      newList = [...list, { ...user, id: Date.now() }];
    } else {
      newList = newList.map((val) => (val.id == editId ? user : val));
      setEditId(null);
    }

    setList(newList);
    setFilteredData(newList);
    localStorage.setItem("users", JSON.stringify(newList));
    setUser({});
    setHobby([]);
  };

  const handleDelete = (id) => {
    const newList = list.filter((val) => val.id != id);
    setList(newList);
    setFilteredData(newList);
    localStorage.setItem("users", JSON.stringify(newList));
  };

  const handleEdit = (id) => {
    let data = list.find((val) => val.id == id);
    setUser(data);
    setEditId(id);
    setHobby(data.hobby);
  };

  const validation = () => {
    let error = {};

    if (!user.username) error.username = "Enter your Username";
    if (!user.email) error.email = "Enter your Email";
    if (!user.password) error.password = " Enter password";
    if (!user.phone) error.phone = "Enter your passwors";
    if (!user.gender) error.gender = "Enter gender";
    if (!user.city) error.city = "Choose city";
    if (!user.hobby || user.hobby.length == 0)
      error.hobby = "Select any one";

    setError(error);
    return Object.keys(error).length == 0;
  };

  const handleFilter = () => {
    let newList = list.filter((val) =>
      val.username.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredData(search ? newList : list);
  };

  const handleSorting = (sort) => {
    let newList = [...list];
    if (sort == "ascending") {
      newList = list.sort((a, b) => a.username.localeCompare(b.username));
    } else {
      newList = list.sort((a, b) => b.username.localeCompare(a.username));
    }
    setFilteredData([...newList]);
  };

  useEffect(() => {
    handleFilter();
  }, [search]);

  useEffect(() => {
    let oldData = JSON.parse(localStorage.getItem("users")) || [];
    setList(oldData);
    setFilteredData(oldData);
  }, []);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body">
              <h3 className="text-center mb-4 text-primary"> <span className="fs-1">u</span>ser Form</h3>

              <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username"
                  onChange={handleChange} value={user.username || ""}
                  className="form-control mb-2"/>
                <small className="text-danger">{error.username}</small>

                <input type="email" name="email" placeholder="Email"
                  onChange={handleChange} value={user.email || ""}
                  className="form-control mt-3 mb-2"/>
                <small className="text-danger">{error.email}</small>

                <input type="password" name="password" placeholder="Password"
                  onChange={handleChange} value={user.password || ""}
                  className="form-control mt-3 mb-2"/>
                <small className="text-danger">{error.password}</small>

                <input type="text" name="phone" placeholder="Phone"
                  onChange={handleChange} value={user.phone || ""}
                  className="form-control mt-3 mb-2"/>
                <small className="text-danger">{error.phone}</small>

                <div className="mt-3">
                  <label className="me-3">Gender:</label>
                  <input type="radio" name="gender" value="male"
                    onChange={handleChange} checked={user.gender == "male"} /> Male
                  <input type="radio" name="gender" value="female"
                    className="ms-3"
                    onChange={handleChange} checked={user.gender == "female"} /> Female
                </div>
                <small className="text-danger">{error.gender}</small>

                <select name="city" onChange={handleChange}
                  className="form-select mt-3">
                  <option>Select City</option>
                  {cities.map((city, i) => (
                    <option key={i} selected={user.city == city}>{city}</option>
                  ))}
                </select>
                <small className="text-danger">{error.city}</small>

                <div className="mt-3">
                  <label>Hobby:</label><br/>
                  <input type="checkbox" name="hobby" value="dance"
                    onChange={handleChange} checked={hobby.includes("dance")} /> Dance
                  <input type="checkbox" name="hobby" value="music"
                    className="ms-3"
                    onChange={handleChange} checked={hobby.includes("music")} /> Music
                </div>
                <small className="text-danger">{error.hobby}</small>

                <button className="btn btn-primary w-100 mt-4">
                  {editId ? "Update" : "Add"} User
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5 align-items-center">
        <div className="col-md-6">
          <input type="search" placeholder="Search Username..."
            className="form-control shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}/>
        </div>
        <div className="col-md-3">
          <select className="form-select shadow-sm"
            onChange={(e) => handleSorting(e.target.value)}>
            <option disabled>Sort</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      <div className="card mt-4 shadow border-0 rounded-4">
        <div className="card-body">
          <h4 className="text-center mb-3 text-secondary">User Data</h4>

          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th><th>Name</th><th>Email</th>
                  <th>Phone</th><th>Gender</th>
                  <th>City</th><th>Hobby</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(FirstIndex, LastIndex).map((val, i) => (
                  <tr key={val.id}>
                    <td>{FirstIndex + i + 1}</td>
                    <td>{val.username}</td>
                    <td>{val.email}</td>
                    <td>{val.phone}</td>
                    <td>{val.gender}</td>
                    <td>{val.city}</td>
                    <td>{val.hobby?.join(",")}</td>
                    <td>
                      <button className="btn btn-sm btn-danger me-2"
                        onClick={() => handleDelete(val.id)}>Delete</button>
                      <button className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(val.id)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-end">
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}>Prev</button>
              </li>

              {[...Array(TotalPage)].map((_, i) => (
                <li key={i} className="page-item">
                  <button
                    className={`page-link ${page === i + 1 ? "active" : ""}`}
                    onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className="page-item">
                <button className="page-link"
                  disabled={page === TotalPage}
                  onClick={() => setPage(page + 1)}>Next</button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default page;