//npm install firebase-admin
//npm install firebase
//npm install firebase@8.9.1 



// const firebase = require('firebase/app').default;
// require('firebase/database'); 

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const firebaseConfig = {
//     apiKey: "AIzaSyAm2Du9ovRq_cVU_2jTzSQs_SsTXoHikG8",
//     authDomain: "ltnc-25ea6.firebaseapp.com",
//     databaseURL: "https://ltnc-25ea6-default-rtdb.firebaseio.com",
//     projectId: "ltnc-25ea6",
//     storageBucket: "ltnc-25ea6.appspot.com",
//     messagingSenderId: "83914455666",
//     appId: "1:83914455666:web:5bcacf284fca1e352620eb",
//     measurementId: "G-SGSYMX429F"
// };

// // Khởi tạo Firebase Admin SDK với cấu hình của bạn
// firebase.initializeApp(firebaseConfig);

// const db = firebase.database();
// const elistRef = db.ref("/Employees");

function checkDuplicate(name) {
  return new Promise((resolve, reject) => {
    const deviceRef = elistRef.child(name);

    deviceRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(true); // The device exists
      } else {
        resolve(false); // The device does not exist
      }
    }, (error) => {
      reject(error); // Handle the error if there is one
    });
  });
}

class Employee {

  static idCounter = 0;

  constructor(ID, name, position, degree, specialization, email, phone) {
    this.name = name;
    this.position = position;
    this.degree = degree;
    this.specialization = specialization;
    this.email = email;
    this.phone = phone;
  }

  static async updateIdCounter() {
    const snapshot = await firebase.database().ref('Employees').once('value');
    let maxId = 0;
    snapshot.forEach(childSnapshot => {
      const id = childSnapshot.val().id;
      if (id > maxId) {
        maxId = id;
      }
    });
    Employee.idCounter = maxId;
  }



  static async createEmployee(name, position, degree, specialization, email, phone) {
    await this.updateIdCounter();
    const Employee = {
      ID: ++this.idCounter,
      name: name,
      position: position,
      degree: degree,
      specialization: specialization,
      email: email,
      phone: phone
    };

    if (!name || !position || !degree || !email || !phone) {
      //console.log("Các thông tin không được bỏ trống!");
      alert("Các thông tin không được bỏ trống!");
      return;
    }

    if (phone.length === 10) {
      checkDuplicate(name).then((exists) => {
        if (exists) {
          //console.log("Nhân viên đã tồn tại trong cơ sở dữ liệu.");
          alert("Nhân viên đã tồn tại trong cơ sở dữ liệu.");
          // Xử lý khi thiết bị đã tồn tại
        } else {
          try {
            switch (position) {
              case 'Bác sĩ':
                let doctor = new Doctor();
                doctor.id = Employee.ID,
                  doctor.name = Employee.name;
                doctor.position = Employee.position;
                doctor.degree = Employee.degree;
                doctor.specialization = Employee.specialization;
                doctor.email = Employee.email;
                doctor.phone = Employee.phone;
                doctor.addEmployee(doctor);
                break;
              case 'Y tá':
                let nurse = new Nurse();
                nurse.id = Employee.ID,
                  nurse.name = Employee.name;
                nurse.position = Employee.position;
                nurse.degree = Employee.degree;
                nurse.specialization = Employee.specialization;
                nurse.email = Employee.email;
                nurse.phone = Employee.phone;
                nurse.addEmployee(nurse);
                break;
              case 'Điều dưỡng':
                let nurseAsistant = new NurseAssistant();
                nurseAsistant.id = Employee.ID,
                  nurseAsistant.name = Employee.name;
                nurseAsistant.position = Employee.position;
                nurseAsistant.degree = Employee.degree;
                nurseAsistant.specialization = Employee.specialization;
                nurseAsistant.email = Employee.email;
                nurseAsistant.phone = Employee.phone;
                nurseAsistant.addEmployee(nurseAsistant);
                break;
              case 'Trợ lí điều dưỡng':
                let nurseAide = new NurseAide();
                nurseAide.id = Employee.ID,
                  nurseAide.name = Employee.name;
                nurseAide.position = Employee.position;
                nurseAide.degree = Employee.degree;
                nurseAide.specialization = Employee.specialization;
                nurseAide.email = Employee.email;
                nurseAide.phone = Employee.phone;
                nurseAide.addEmployee(nurseAide);
                break;
              default:
                //console.log("Vị trí không tồn tại");
                alert("Vị trí không tồn tại");
                break;
            }
            //console.log("Thông tin nhân viên đã được khởi tạo thành công.");
            alert("Thông tin nhân viên đã được khởi tạo thành công.");
          }
          catch (error) {
            console.error("Lỗi khi khởi tạo thông tin nhân viên:", error);
            alert("Lỗi khi khởi tạo thông tin nhân viên");
          }
        }
      })
        .catch((error) => {
          console.error("Lỗi khi kiểm tra trùng lặp:", error);
          alert("Lỗi khi kiểm tra trùng lặp");
        });

    }

    else; //console.log("Số điện thoại phải có đủ 10 số");

  }
}

class Doctor extends Employee {
  constructor(ID, name, degree, specialization, email, phone) {
    super(ID, name, degree, specialization, email, phone);
  }

  addEmployee(employee) {
    if (employee.specialization.trim() === '') {
      //console.log("Thiếu chuyên môn của Bác sĩ!");
      alert("Thiếu chuyên môn của Bác sĩ!");
      return;
    }
    let employeeCopy = Object.assign({}, employee);

    firebase.database().ref('Employees/' + employee.name).set(employeeCopy);
    firebase.database().ref('Employees/' + employee.name + '/name').remove();

  }
}

class Nurse extends Employee {
  constructor(ID, name, degree, specialization, email, phone) {
    super(ID, name, degree, specialization, email, phone);
  }
  addEmployee(employee) {
    let employeeCopy = Object.assign({}, employee);

    firebase.database().ref('Employees/' + employee.name).set(employeeCopy);
    firebase.database().ref('Employees/' + employee.name + '/name').remove();

  }
}

class NurseAssistant extends Employee {
  constructor(ID, name, degree, specialization, email, phone) {
    super(ID, name, degree, specialization, email, phone);
  }
  addEmployee(employee) {
    let employeeCopy = Object.assign({}, employee);

    firebase.database().ref('Employees/' + employee.name).set(employeeCopy);
    firebase.database().ref('Employees/' + employee.name + '/name').remove();

  }
}

class NurseAide extends Employee {
  constructor(ID, name, degree, specialization, email, phone) {
    super(ID, name, degree, specialization, email, phone);
  }
  addEmployee(employee) {
    let employeeCopy = Object.assign({}, employee);

    firebase.database().ref('Employees/' + employee.name).set(employeeCopy);
    firebase.database().ref('Employees/' + employee.name + '/name').remove();

  }
}

function updateEmail(id) {
  let newEmail;
  do {
    newEmail = prompt("Vui lòng nhập thông tin email mới:");
    if (newEmail != null && !newEmail.endsWith("@gmail.com")) {
      alert("Email phải kết thúc bằng @gmail.com. Vui lòng nhập lại.");
    }
  } while (newEmail != null && !newEmail.endsWith("@gmail.com"));

  if (newEmail != null) {
    const employeesRef = firebase.database().ref('Employees');
    employeesRef.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const employeeId = childSnapshot.child('id').val();
          if (employeeId.toString() === id.toString()) {
            const employeeKey = childSnapshot.key;
            const updates = {};
            updates['Employees/' + employeeKey + '/email'] = newEmail; // Cập nhật email của nhân viên

            firebase.database().ref().update(updates)
              .then(() => {
                updateTable();
                //console.log("Cập nhật email thành công.");
                alert("Cập nhật email thành công.");
              })
              .catch(error => {
                console.error("Lỗi khi cập nhật email:", error);
                alert("Lỗi khi cập nhật email:");
              });

            // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
            return true;
          }
        });
      })
      .catch(error => {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        alert("Lỗi khi truy vấn dữ liệu");
      });
  }
}
function updatePhone(id) {
  let newPhone;
  do {
    newPhone = prompt("Vui lòng nhập thông tin số điện thoại mới:");
    if (newPhone != null && newPhone.length !== 10) {
      alert("Số điện thoại phải có 10 chữ số. Vui lòng nhập lại.");
    }
  } while (newPhone != null && newPhone.length !== 10);
  if (newPhone != null) {
    const employeesRef = firebase.database().ref('Employees');

    employeesRef.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const employeeId = childSnapshot.child('id').val();
          if (employeeId.toString() === id.toString()) {
            const employeeKey = childSnapshot.key;
            const updates = {};
            updates['Employees/' + employeeKey + '/phone'] = newPhone; // Cập nhật số điện thoại của nhân viên

            firebase.database().ref().update(updates)
              .then(() => {
                updateTable();
                //console.log("Cập nhật số điện thoại thành công.");
                alert("Cập nhật số điện thoại thành công.");
              })
              .catch(error => {
                console.error("Lỗi khi cập nhật số điện thoại:", error);
                alert("Lỗi khi cập nhật số điện thoại");
              });

            // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
            return true;
          }
        });
      })
      .catch(error => {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        alert("Lỗi khi truy vấn dữ liệu");
      });
  }
}
function updatePosition(id) {
  const newPosition = prompt("Vui lòng nhập thông tin vị trí mới:");
  if (newPosition != null) {
    const employeesRef = firebase.database().ref('Employees');

    employeesRef.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const employeeId = childSnapshot.child('id').val();
          if (employeeId.toString() === id.toString()) {
            const employeeKey = childSnapshot.key;
            const updates = {};
            updates['Employees/' + employeeKey + '/position'] = newPosition; // Cập nhật vị trí của nhân viên

            firebase.database().ref().update(updates)
              .then(() => {
                updateTable();
                //console.log("Cập nhật vị trí thành công.");
                alert("Cập nhật vị trí thành công.");
              })
              .catch(error => {
                console.error("Lỗi khi cập nhật vị trí:", error);
                alert("Lỗi khi cập nhật vị trí")
              });

            // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
            return true;
          }
        });
      })
      .catch(error => {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        alert("Lỗi khi truy vấn dữ liệu");

      });
  }
}
function updateDegree(id) {
  const newDegree = prompt("Vui lòng nhập thông tin bằng cấp mới:");
  if (newDegree != null) {
    const employeesRef = firebase.database().ref('Employees');

    employeesRef.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const employeeId = childSnapshot.child('id').val();
          if (employeeId.toString() === id.toString()) {
            const employeeKey = childSnapshot.key;
            const updates = {};
            updates['Employees/' + employeeKey + '/degree'] = newDegree; // Cập nhật bậc học của nhân viên

            firebase.database().ref().update(updates)
              .then(() => {
                updateTable();
                //console.log("Cập nhật bậc học thành công.");
                alert("Cập nhật bậc học thành công.");
              })
              .catch(error => {
                console.error("Lỗi khi cập nhật bậc học:", error);
                alert("Lỗi khi cập nhật bậc học")
              });

            // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
            return true;
          }
        });
      })
      .catch(error => {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        alert("Lỗi khi truy vấn dữ liệu");
      });
  }
}
function updateSpecialization(id) {
  const newSpecialization = prompt("Vui lòng nhập thông tin chuyên ngành mới:");
  if (newSpecialization != null) {
    const employeesRef = firebase.database().ref('Employees');

    employeesRef.once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const employeeId = childSnapshot.child('id').val();
          if (employeeId.toString() === id.toString()) {
            const employeeKey = childSnapshot.key;
            const updates = {};
            updates['Employees/' + employeeKey + '/specialization'] = newSpecialization; // Cập nhật chuyên ngành của nhân viên

            firebase.database().ref().update(updates)
              .then(() => {
                updateTable();
                //console.log("Cập nhật chuyên ngành thành công.");
                alert("Cập nhật chuyên ngành thành công.");
              })
              .catch(error => {
                console.error("Lỗi khi cập nhật chuyên ngành:", error);
                alert("Lỗi khi cập nhật chuyên ngành");
              });

            // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
            return true;
          }
        });
      })
      .catch(error => {
        console.error("Lỗi khi truy vấn dữ liệu:", error);
        alert("Lỗi khi truy vấn dữ liệu");
      });
  }
}

function deleteEmployee(id) {

  const employeesRef = firebase.database().ref('Employees');

  employeesRef.once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
        const employeeId = childSnapshot.child('id').val();
        if (employeeId.toString() === id.toString()) {
          const employeeKey = childSnapshot.key;

          firebase.database().ref('Employees/' + employeeKey).remove()
            .then(() => {
              //console.log("Xóa nhân viên thành công.");
              alert("Xóa nhân viên thành công.");
              updateTable();
            })
            .catch(error => {
              console.error("Lỗi khi xóa nhân viên:", error);
              alert("Lỗi khi xóa nhân viên");
            });

          // Dừng vòng lặp sau khi tìm thấy nhân viên có ID tương ứng
          return true;
        }
      });
    })
    .catch(error => {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      alert("Lỗi khi truy vấn dữ liệu");
    });
}

function getEmployeeById(id) {
  const employeesRef = firebase.database().ref('Employees');

  return employeesRef.once('value')
    .then(snapshot => {
      let employeeInfo = null;
      snapshot.forEach(childSnapshot => {
        const employeeId = childSnapshot.child('id').val();
        if (employeeId === id) {
          const employeeKey = childSnapshot.key;
          //console.log("Thông tin của :", employeeKey);
          employeeInfo = childSnapshot.val();
          return true; // Dừng vòng lặp khi tìm thấy nhân viên có ID tương ứng
        }
      });
      //console.log(employeeInfo); // Trả về thông tin của nhân viên
    })
    .catch(error => {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      alert("Lỗi khi truy vấn dữ liệu");
      return null; // Trả về null nếu có lỗi xảy ra
    });
}

function getEmployeeByName(name) {
  const employeeRef = firebase.database().ref('Employees/' + name);

  employeeRef.once('value')
    .then(snapshot => {
      const employeeData = snapshot.val();
      if (employeeData) {
        //console.log("Thông tin của nhân viên có tên", name, ":", employeeData);
      } else {
        //console.log("Không tìm thấy nhân viên có tên", name);
      }
    })
    .catch(error => {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      alert("Lỗi khi truy vấn dữ liệu");
    });
}

function getEmployeeNameById(id) {
  const employeesRef = firebase.database().ref('Employees');

  return employeesRef.once('value')
    .then(snapshot => {
      let employeeKey = null;
      snapshot.forEach(childSnapshot => {
        const employeeId = childSnapshot.child('id').val();
        if (employeeId === id) {
          employeeKey = childSnapshot.key;
          return true; // Dừng vòng lặp khi tìm thấy nhân viên có ID tương ứng
        }
      });
      return employeeKey;
    })
    .catch(error => {
      console.error("Lỗi khi truy vấn dữ liệu:", error);
      alert("Lỗi khi truy vấn dữ liệu");
      return null; // Trả về null nếu có lỗi xảy ra
    });
}

const getDataFromFirebase = async (Type) => {
  try {
    const snapshot = await firebase.database().ref(Type).once("value");
    const data = [];
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      data.push(childData);
    });
    return data;
  } catch (error) {
    console.error("Error getting data from Firebase:", error);
    return null;
  }
};
async function createHTMLTable(data) {
  let html = '<table>';

  data.sort((a, b) => a.id - b.id);
  const employeeNames = await Promise.all(data.map(item => getEmployeeNameById(item.id)));

  html += '<tr><th>ID</th><th>Tên</th><th>Bằng cấp</th><th>Email</th><th>Số điện thoại</th><th>Chức vụ</th><th>Chuyên ngành</th><th>Thao tác</th></tr>';


  for (let i = 0; i < data.length; i++) {
    html += '<tr>';
    html += `<td>${i + 1}</td>`; // ID column
    html += `<td>${employeeNames[i]}</td>`; // Name column
    html += `<td>${data[i].degree}</td>`;
    html += `<td>${data[i].email}</td>`;
    html += `<td>${data[i].phone}</td>`;
    html += `<td>${data[i].position}</td>`;
    html += `<td>${data[i].specialization}</td>`;
    html += '<td>'
    html += '<div class="dropdown" style="margin-right: 5px;">';
    html += '<button class="dropbtn" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Sửa</button>';
    html += '<div class="dropdown-content">';
    html += '<a href="#" onclick="updateDegree(\'' + data[i].id + '\', \'degree\')">Bằng cấp</a>';
    html += '<a href="#" onclick="updateEmail(\'' + data[i].id + '\', \'email\')">Email</a>';
    html += '<a href="#" onclick="updatePhone(\'' + data[i].id + '\', \'phone\')">Số điện thoại</a>';
    html += '<a href="#" onclick="updatePosition(\'' + data[i].id + '\', \'position\')">Chức vụ</a>';
    html += '<a href="#" onclick="updateSpecialization(\'' + data[i].id + '\', \'specialization\')">Chuyên ngành</a>';
    html += '</div>';
    html += '</div>';

    // Button "Delete"
    html += '<button onclick="deleteEmployee(\'' + data[i].id + '\')" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Xóa</button>';

    html += '</td>';
    html += '</tr>';
  }

  html += '</table>';
  return html;
}
const getTableHTML = async () => {
  const result = await getDataFromFirebase("Employees");
  const tableHTML = await createHTMLTable(result);
  return tableHTML;
};


function createEmployee() {
  // Get the form
  const form = document.getElementById('employeeForm');

  // Get the form values
  const name = form.elements.name.value;
  //console.log("Name: " + name);

  const position = form.elements.position.value;
  //console.log("Position: " + position);

  const degree = form.elements.degree.value;
  //console.log("Degree: " + degree);

  const specialization = form.elements.specialization.value;
  //console.log("Specialization: " + specialization);

  const email = form.elements.email.value;
  //console.log("Email: " + email);

  const phone = form.elements.phone.value;
  //console.log("Phone: " + phone);

  // Call the createEmployee method
  Employee.createEmployee(name, position, degree, specialization, email, phone);

  // Clear the form
  form.reset();
}

async function updateTable() {
  // Find the tbody element to insert the table into
  var employeeTable = document.getElementById('employee-table');

  // Create the table and insert it into the tbody
  var tableHTML = await getTableHTML();
  employeeTable.innerHTML = tableHTML;
  //console.log(tableHTML);
}

function createAndRefresh() {
  createEmployee();
  setTimeout(updateTable, 1000); // Delay 1 seconds
}

