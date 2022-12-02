getTeachers();

// Tạo hàm getTeacher,addTeacher,deleteTeacher,updateTeacher sử dụng request API
function getTeachers(searchTerm) {
  apiGetTeacher(searchTerm)
    .then((response) => {
      let teachers = response.data.map((teacher) => {
        return new Teacher(
          teacher.id,
          teacher.taiKhoan,
          teacher.hoTen,
          teacher.matKhau,
          teacher.email,
          teacher.hinhAnh,
          teacher.loaiND,
          teacher.ngonNgu,
          teacher.moTa
        );
      });

      display(teachers);
    })
    .catch((error) => {
      console.log(error);
    });
}

function addTeacher(teacher) {
  apiAddTeacher(teacher)
    .then(() => {
      getTeachers();
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteTeacher(teacherId) {
  apiDeleteTeacher(teacherId)
    .then(() => {
      getTeachers();
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateTeacher(teacherId, teacher) {
  apiUpdateTeacher(teacherId, teacher)
    .then(() => {
      getTeachers();
    })
    .catch((error) => {
      console.log(error);
    });
}
// ====================================================================

// Sử dụng phương thức reduce của chuỗi để hiển thị thông tin người dùng
function display(teachers) {
  let html = teachers.reduce((result, teacher) => {
    return (
      result +
      `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.taiKhoan}</td>
            <td>${teacher.matKhau}</td>
            <td>${teacher.hoTen}</td>
            <td>${teacher.email}</td>
            <td>${teacher.ngonNgu}</td>
            <td>${teacher.loaiND}</td>
            <td>
                <button 
                    class="btn btn-success"
                    data-id="${teacher.id}"
                    data-type="edit"
                    data-toggle="modal"
                    data-target="#myModal"
                    >Edit
                </button>
                <button 
                    class="btn btn-danger"
                    data-id="${teacher.id}"
                    data-type="delete"
                    >Delete
                </button>
            </td>
        </tr>
    `
    );
  }, "");

  dom("#tblDanhSachNguoiDung").innerHTML = html;
}

// Hàm dom giúp cho việc DOM tới input của user được gọn hơn
function dom(selector) {
  return document.querySelector(selector);
}

// =====================================================================

// Sử dụng thêm sự kiện thông qua việc click của button Thêm mới thay đổi header và footer của modal
dom("#btnThemNguoiDung").addEventListener("click", () => {
  dom(".modal-title").innerHTML = "Thêm Giáo Viên";
  dom(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss=modal>Hủy</button>
        <button class="btn btn-primary" data-type="add">Thêm</button>
    `;
});

// Thêm sự kiện click vào button Thêm để có thể thêm vào giáo viên
dom(".modal-footer").addEventListener("click", (evt) => {
  let dataType = evt.target.getAttribute("data-type");

  //   DOM các input để lấy dữ liệu
  let id = dom("#maGV").value;
  let taiKhoan = dom("#TaiKhoan").value;
  let hoTen = dom("#HoTen").value;
  let matKhau = dom("#MatKhau").value;
  let email = dom("#Email").value;
  let hinhAnh = dom("#HinhAnh").value;
  let loaiND = dom("#loaiNguoiDung").value;
  let ngonNgu = dom("#loaiNgonNgu").value;
  let moTa = dom("#MoTa").value;

  //   Tạo object teacher từ lớp đối tượng Teacher đã tạo
  let teacher = new Teacher(
    id,
    taiKhoan,
    hoTen,
    matKhau,
    email,
    hinhAnh,
    loaiND,
    ngonNgu,
    moTa
  );

  //  Xử lý điều kiện
  if (dataType === "add") {
    addTeacher(teacher);
  } else if (dataType === "update") {
    updateTeacher(id, teacher);
  }
});

// Thêm sự kiện click vào button Delete của tbody
dom("#tblDanhSachNguoiDung").addEventListener("click", (evt) => {
  let id = evt.target.getAttribute("data-id");
  let elType = evt.target.getAttribute("data-type");

  if (elType === "delete") {
    deleteTeacher(id);
  } else if (elType === "edit") {
    dom(".modal-title").innerHTML = "Cập Nhật Giáo Viên";
    dom(".modal-footer").innerHTML = `
          <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
          <button class="btn btn-primary" data-type="update">Cập nhật</button>
      `;
  }

  //   để có thể fill thông tin ngược lên modal ta cần lấy ra chi tiết 1 sản phẩn bằng Id thông qua API
  apiGetTeacherById(id)
    .then((response) => {
      let teacher = response.data;
      dom("#maGV").value = teacher.id; //input Ẩn (hidden)
      dom("#TaiKhoan").value = teacher.taiKhoan;
      dom("#HoTen").value = teacher.hoTen;
      dom("#MatKhau").value = teacher.matKhau;
      dom("#Email").value = teacher.email;
      dom("#HinhAnh").value = teacher.hinhAnh;
      dom("#loaiNguoiDung").value = teacher.loaiND;
      dom("#loaiNgonNgu").value = teacher.ngonNgu;
      dom("#MoTa").value = teacher.moTa;
    })
    .catch((error) => {
      console.log(error);
    });
});

// Sử dụng thêm sự kiên keydown để tìm kiếm
dom("#search").addEventListener("keydown", (evt) => {
  console.log(evt.key);
  //   kiểm tra không phải enter thì kết thúc hàm
  if (evt.key !== "Enter") return;

  getTeachers(evt.target.value);
});
