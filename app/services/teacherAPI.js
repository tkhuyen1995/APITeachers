function apiGetTeacher(searchTerm) {
  return axios({
    url: "https://6384b1203fa7acb14ffd8ae4.mockapi.io/teachers",
    method: "GET",
    params: {
      taiKhoan: searchTerm,
    },
  });
}

function apiAddTeacher(teacher) {
  return axios({
    url: "https://6384b1203fa7acb14ffd8ae4.mockapi.io/teachers",
    method: "POST",
    // method POST cần thêm key data
    data: teacher,
  });
}

function apiDeleteTeacher(teacherId) {
  return axios({
    url: `https://6384b1203fa7acb14ffd8ae4.mockapi.io/teachers/${teacherId}`,
    method: "DELETE",
  });
}

function apiGetTeacherById(teacherId) {
  return axios({
    url: `https://6384b1203fa7acb14ffd8ae4.mockapi.io/teachers/${teacherId}`,
    method: "GET",
  });
}

function apiUpdateTeacher(teacherId, teacher) {
  return axios({
    url: `https://6384b1203fa7acb14ffd8ae4.mockapi.io/teachers/${teacherId}`,
    method: "PUT",
    data: teacher,
  });
}
