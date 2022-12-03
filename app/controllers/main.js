getTeachers();

//Tạo mảng validateTaiKhoans để dùng cho validate trường hợp không dc đặt trùng tài khoản trước khi add user
//Tạo mảng validateTaiKhoanEdits để dùng cho validate trường hợp không dc đặt trùng tài khoản trước khi edit user
let validateTaiKhoans = [];
let validateTaiKhoanEdits = [];

// Tạo hàm getTeacher,addTeacher,deleteTeacher,updateTeacher sử dụng request API
function getTeachers(searchTerm) {
  //Tạo mảng taiKhoans chỉ chứa các tài khoản rồi gán cho mảng validateTaiKhoans để kiểm tra trường hợp validate có trùng tài khoản ko
  apiGetTeacher(searchTerm)
    .then((response) => {
      let taiKhoans = response.data.map((teacher) => {
        return teacher.taiKhoan;
      });
      validateTaiKhoans = [...taiKhoans];

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
  let isValid = validateForm();
  if (!isValid) {
    return;
  }

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
  let isValid = validateFormEdit();
  if (!isValid) {
    return;
  }

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

// function Reset form
function resetForm() {
  dom("#TaiKhoan").value = "";
  dom("#HoTen").value = "";
  dom("#MatKhau").value = "";
  dom("#Email").value = "";
  dom("#HinhAnh").value = "";
  dom("#loaiNguoiDung").value = "";
  dom("#loaiNgonNgu").value = "";
  dom("#MoTa").value = "";
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
    //Sửa lại input Tài khoản để thay đổi thuộc tính oninput thành validateTaiKhoanEdit()
    dom("#divTaiKhoan").innerHTML = `
    <label>Tài khoản</label>
    <input
      id="TaiKhoan"
      class="form-control"
      placeholder="Nhập vào tài khoản"
      oninput="validateTaiKhoanEdit()"
    />
    <span id="spanTaiKhoan"></span>
    `;

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

      //Gán mảng validateTaiKhoanEdits bằng mảng validateTaiKhoans bỏ đi tài khoản của user dc nhấn nút "sửa" (edit)
      validateTaiKhoanEdits = validateTaiKhoans.filter((taiKhoan) => {
        return taiKhoan !== teacher.taiKhoan;
      });
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

// ========== Validation ==========

//Hàm kiểm tra Tài khoản có hợp lệ hay ko
function validateTaiKhoan() {
  //DOM
  let taiKhoan = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTaiKhoan");

  //Xét trường hợp tài khoản có để trống hay ko
  if (!taiKhoan) {
    spanEl.innerHTML = "Tài khoản không được để trống";
    return false;
  }
  //
  for (let i = 0; i < validateTaiKhoans.length; i++) {
    if (taiKhoan === validateTaiKhoans[i]) {
      spanEl.innerHTML = "Tài khoản không được trùng nhau";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Tài khoản có hợp lệ hay ko
function validateTaiKhoanEdit() {
  //DOM
  let taiKhoan = dom("#TaiKhoan").value;
  let spanEl = dom("#spanTaiKhoan");
  //Xét trường hợp tài khoản có để trống hay ko
  if (!taiKhoan) {
    spanEl.innerHTML = "Tài khoản không được để trống";
    return false;
  }
  //
  for (let i = 0; i < validateTaiKhoanEdits.length; i++) {
    if (taiKhoan === validateTaiKhoanEdits[i]) {
      spanEl.innerHTML = "Tài khoản không được trùng nhau";
      return false;
    }
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Họ tên có hợp lệ hay ko
function validateHoTen() {
  //DOM
  let hoTen = dom("#HoTen").value;
  let spanEl = dom("#spanHoTen");
  //Kiểm tra xem Họ tên có để trống hay ko
  if (!hoTen) {
    spanEl.innerHTML = "Họ tên không được để trống";
    return false;
  }

  //Kiểm tra trường hợp Họ tên chỉ bao gồm chữ ko chứa số và ký tự đặc biệt
  let regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/;
  if (!regex.test(hoTen)) {
    spanEl.innerHTML = "Họ tên chỉ bao gồm chữ cái";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Mật khẩu có hợp lệ hay ko
function validateMatKhau() {
  //DOM
  let matKhau = dom("#MatKhau").value;
  let spanEl = dom("#spanMatKhau");

  //Kiểm tra xem Mật khẩu có để trống hay ko
  if (!matKhau) {
    spanEl.innerHTML = "Mật khẩu không được để trống";
    return false;
  }

  //Kiểm tra Mật khẩu phải có từ 6 đến 8 ký tự
  if (matKhau.length < 6 || matKhau.length > 8) {
    spanEl.innerHTML = "Mật khẩu phải có từ 6 đến 8 ký tự";
    return false;
  }

  //Kiểm tra Mật khẩu phải có ít nhất 1 kí tự in hoa, 1 kí tự đặc biệt, 1 kí số
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;
  if (!regex.test(matKhau)) {
    spanEl.innerHTML =
      "Mật khẩu phải có ít nhất 1 kí tự hoa, 1 kí tự đặc biệt và 1 kí số";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra Email có hợp lệ hay ko
function validateEmail() {
  //DOM
  let email = dom("#Email").value;
  let spanEl = dom("#spanEmail");

  //Kiểm tra xem Email có bỏ trống hay ko
  if (!email) {
    spanEl.innerHTML = "Email không được để trống";
    return false;
  }

  //Kiểm tra xem email có đúng format hay ko
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = "Email không đúng định dạng";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Hình ảnh có hợp lệ hay ko
function validateHinhAnh() {
  //DOM
  let hinhAnh = dom("#HinhAnh").value;
  let spanEl = dom("#spanHinhAnh");

  //Kiểm tra xem Hình ảnh có để trống hay ko
  if (!hinhAnh) {
    spanEl.innerHTML = "Hình ảnh không được để trống";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Loại người dùng đã chọn hay chưa
function validateLoaiND() {
  //DOM
  let loaiND = dom("#loaiNguoiDung").value;
  let spanEl = dom("#spanLoaiND");

  //Kiểm tra xem loại người dùng đã chọn chưa
  if (!loaiND) {
    spanEl.innerHTML = "Hãy chọn loại người dùng";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Loại ngôn ngữ đã chọn hay chưa
function validateLoaiNN() {
  //DOM
  let loaiNN = dom("#loaiNgonNgu").value;
  let spanEl = dom("#spanLoaiNN");

  //Kiểm tra xem Loại ngôn ngữ đã chọn chưa
  if (!loaiNN) {
    spanEl.innerHTML = "Hãy chọn loại ngôn ngữ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra xem Mô tả có hợp lệ hay ko
function validateMoTa() {
  //DOM
  let moTa = dom("#MoTa").value;
  let spanEl = dom("#spanMoTa");

  //Kiểm tra xem Mô tả có để trống hay ko
  if (!moTa) {
    spanEl.innerHTML = "Mô tả không được để trống";
    return false;
  }

  //Kiểm tra xem Mô tả có vượt quá 60 kí tự hay ko
  if (moTa.length > 60) {
    spanEl.innerHTML = "Mô tả không được quá 60 kí tự";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi add user
function validateForm() {
  let form = true;
  form =
    validateTaiKhoan() &
    validateHoTen() &
    validateMatKhau() &
    validateEmail() &
    validateHinhAnh() &
    validateLoaiND() &
    validateLoaiNN() &
    validateMoTa();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}

//Hàm kiểm tra form input có hợp lệ hay ko trước khi edit user
function validateFormEdit() {
  let form = true;
  form =
    validateTaiKhoanEdit() &
    validateHoTen() &
    validateMatKhau() &
    validateEmail() &
    validateHinhAnh() &
    validateLoaiND() &
    validateLoaiNN() &
    validateMoTa();

  if (!form) {
    alert("Thông tin không hợp lệ");
    return false;
  }

  return true;
}
