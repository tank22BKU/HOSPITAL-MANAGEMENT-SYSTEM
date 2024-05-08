 // //npm install firebase-admin
 // // //npm install firebase
 // // //npm install firebase@8.9.1

//  const { create } = require('domain');
//  const firebase = require('firebase/app');
//  require('firebase/database'); 

//  var firebaseConfig = {
//   apiKey: "AIzaSyAm2Du9ovRq_cVU_2jTzSQs_SsTXoHikG8",
//   authDomain: "ltnc-25ea6.firebaseapp.com",
//   databaseURL: "https://ltnc-25ea6-default-rtdb.firebaseio.com",
//   projectId: "ltnc-25ea6",
//   storageBucket: "ltnc-25ea6.appspot.com",
//   messagingSenderId: "83914455666",
//   appId: "1:83914455666:web:5bcacf284fca1e352620eb",
//   measurementId: "G-SGSYMX429F"
// };
// //  Khởi tạo Firebase
//  firebase.initializeApp(firebaseConfig);
//     const db = firebase.database();
//     const elistRef = db.ref("/Elist" );


    function checkDuplicate(deviceName) {
      return new Promise((resolve, reject) => {
          const deviceRef = elistRef.child(deviceName);
  
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

    class Device {
        
      static idCounter = 0;

      constructor(deviceName, initialStatus, initialAvailability, initialDate) {
          this.deviceName = deviceName;
          this.initialStatus = initialStatus;
          this.initialAvailability = initialAvailability;
          this.initialDate = initialDate;
      }

      static async updateIdCounter() {
        const snapshot = await firebase.database().ref('Elist').once('value');
        let maxId = 0;
        snapshot.forEach(childSnapshot => {
          const id = childSnapshot.val().ID;
          if (id > maxId) {
            maxId = id;
          }
        });
        Device.idCounter = maxId;
      }
      static async CreateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate) {
        await this.updateIdCounter();
        const Device = {
            ID: ++this.idCounter,
            deviceName: deviceName,
            initialStatus: initialStatus,
            initialAvailability: initialAvailability,
            initialDate: initialDate,
        };

          if (!deviceName || !initialStatus || !initialAvailability || !initialDate) {
              console.log("Các thông tin không được bỏ trống!");
              alert("Các thông tin không được bỏ trống!");
              return;
          }
          checkDuplicate(deviceName).then((exists) => {
              if (exists) {
                  console.log("Thiết bị đã tồn tại trong cơ sở dữ liệu.");
                  alert("Thiết bị đã tồn tại trong cơ sở dữ liệu.");
                  // Xử lý khi thiết bị đã tồn tại
              } else {
                  try {
                    let deviceCopy = Object.assign({}, Device);

                    firebase.database().ref('Elist/' + Device.deviceName).set(deviceCopy);
                    firebase.database().ref('Elist/' + Device.deviceName + '/deviceName').remove();
                      console.log("Thông tin thiết bị đã được khởi tạo thành công.");
                      alert("Thông tin thiết bị đã được khởi tạo thành công.");
                  } 
                  catch (error) {
                          console.error("Lỗi khi khởi tạo thông tin thiết bị:", error);
                          alert("Lỗi khi khởi tạo thông tin thiết bị:", error);
                      }
                  }
          })
          .catch((error) => {
              console.error("Lỗi khi kiểm tra trùng lặp:", error);
              alert("Lỗi khi kiểm tra trùng lặp");
          });
      }
    }
      // Device.CreateDeviceInfo("Máy in", "Online", "Available", "2022-01-01");
      // Device.CreateDeviceInfo("Bàn ủi", "Offline", "Unavailable", "2022-01-02");
      // Device.CreateDeviceInfo("Gì đó", "Online", "In Use", "2022-01-03");
      // Device.CreateDeviceInfo("Giường bệnh", "Offline", "Available", "2022-01-04");
      //  Device.CreateDeviceInfo("Máy tính", "Online", "Unavailable", "2022-01-05");


  
  
function getDeviceNameByID(id) {
    const DevicesRef = firebase.database().ref('Elist');
  
    return DevicesRef.once('value')
        .then(snapshot => {
            let DeviceKey = null;
            snapshot.forEach(childSnapshot => {
                const DeviceId = childSnapshot.child('ID').val();
                if (DeviceId === id) {
                    DeviceKey = childSnapshot.key;
                    return true; // Dừng vòng lặp khi tìm thấy thiết bị có ID tương ứng
                }
            });
            return DeviceKey;
        })
        .catch(error => {
            console.error("Lỗi khi truy vấn dữ liệu:", error);
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
  
    data.sort((a, b) => a.ID - b.ID);
    console.log(data);

    const DeviceNames = await Promise.all(data.map(item => getDeviceNameByID(item.ID)));
    html += '<tr><th>ID</th><th>Tên Thiết Bị</th><th>Trạng Thái</th><th>Số lượng</th><th>Ngày</th><th>Thao tác</th></tr>';
  
  
    for (let i = 0; i < data.length; i++) {
      html += '<tr>';
      html += `<td>${i + 1}</td>`; // ID column
      html += `<td>${DeviceNames[i]}</td>`; // Name column
      html += `<td>${data[i].initialStatus}</td>`;
      html += `<td>${data[i].initialAvailability}</td>`;
      html += `<td>${data[i].initialDate}</td>`;
      html += '<td>'
    
      html += '<button onclick="deleteDevice(\'' + data[i].ID + '\')" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Loại bỏ</button>';

      html += '</td>';
      html += '</tr>';
    }
  
    html += '</table>';
    return html;
  }
  const getTableHTML = async () => {
    const result = await getDataFromFirebase("Elist");
    const tableHTML = await createHTMLTable(result);
    return tableHTML;
  };

  async function CreateDeviceInfoByForm() {
    // Get the form
    const form = document.getElementById('adDevice');

    // Get the form values
    const deviceName = form.elements.deviceName.value;
    const initialStatus = form.elements.initialStatus.value;
    const initialAvailability = form.elements.initialAvailability.value;
    const initialDate = form.elements.initialDate.value;

    // Call the createDevice method and wait for it to complete
    await Device.CreateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate);

    // Clear the form
    form.reset();
}
  
  async function updateTable() {
    // Find the tbody element to insert the table into
    var DeviceTable = document.getElementById('device-table');
  
    // Create the table and insert it into the tbody
    var tableHTML = await getTableHTML();
    DeviceTable.innerHTML = tableHTML;
  }

  function deleteDevice(id) {

    const DevicesRef = firebase.database().ref('Elist');

    DevicesRef.once('value')
        .then(snapshot => {
            snapshot.forEach(childSnapshot => {
                const DeviceId = childSnapshot.child('ID').val();
                if (DeviceId.toString() === id.toString()) {
                    const DeviceKey = childSnapshot.key;

                    firebase.database().ref('Elist/' + DeviceKey).remove()
                        .then(() => {
                            console.log("Xóa thiết bị thành công.");
                            alert("Xóa thiết bị thành công.");
                            updateTable();
                        })
                        .catch(error => {
                            console.error("Lỗi khi xóa thiết bị:", error);
                            alert("Lỗi khi xóa thiết bị");
                        });

                    // Dừng vòng lặp sau khi tìm thấy thiết bị có ID tương ứng
                    return true;
                }
            });
        })
        .catch(error => {
            console.error("Lỗi khi truy vấn dữ liệu:", error);
            alert("Lỗi khi truy vấn dữ liệu");
        });
}


  
async function createAndRefresh(event) {
  event.preventDefault();
  await CreateDeviceInfoByForm();
  setTimeout(updateTable, 1000); // Delay 1 seconds
}
  

//   //------------------------------------------------------------------------------------------------------------//


//   const mlistRef = firebase.database().ref("Mlist");
//   function CreateMedicine(medicineName, initialQuantity, expirationDate) 
//   {
//     mlistRef.child(medicineName).once('value', (snapshot) => {
//         const medicineData = snapshot.val();
//         let count = 1; // Biến count để đánh dấu các batch từ 1 và tăng dần
//         if (medicineData) {
//             // Nếu đã có thông tin về loại thuốc này, tăng count lên
//             count = Object.keys(medicineData).length + 1;
//         }
//         const batchId = count.toString(); // Sử dụng count làm batchId
//         const medicineRef = mlistRef.child(`${medicineName}/${batchId}`);
//         medicineRef.set({
//             quantity: initialQuantity,
//             expirationDate: expirationDate
//         });
//     });
// }
  
//   // Hàm cập nhật số lượng thuốc khi nhập kho

//   function importMedicine(medicineName, importQuantity, expirationDate, transactionDate) {
//     mlistRef.child(medicineName).once('value', (snapshot) => {
//         const medicine = snapshot.val();
//         if (medicine) {
//             let batchToUpdate = null;

//             // Tìm batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất
//             snapshot.forEach((childSnapshot) => {
//                 const batch = childSnapshot.val();
//                 if (batch.expirationDate === expirationDate || new Date(batch.expirationDate) == new Date(expirationDate)) {
//                     batchToUpdate = childSnapshot.key;
//                     return; // Dừng vòng lặp khi tìm thấy batch thích hợp
//                 }
//             });

//             if (batchToUpdate) {
//                 // Nếu có batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất, cập nhật số lượng vào batch đó
//                 const currentQuantity = parseInt(medicine[batchToUpdate].quantity);
//                 const updatedQuantity = currentQuantity + parseInt(importQuantity);
//                 mlistRef.child(`${medicineName}/${batchToUpdate}/quantity`).set(updatedQuantity);
//                 console.log(`Đã nhập kho thành công ${importQuantity} đơn vị của thuốc ${medicineName} vào batch hạn sử dụng ${expirationDate}. Số lượng mới trong kho: ${updatedQuantity}`);
//             } else {
//                 // Nếu không có batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất, tạo một batch mới và lưu vào
//                 CreateMedicine(medicineName, importQuantity, expirationDate);
//                 console.log(`Đã tạo batch mới cho thuốc ${medicineName} với hạn sử dụng ${expirationDate} và số lượng ${importQuantity}`);
//             }

//             // Lưu thông tin về giao dịch nhập thuốc
//             const transactionData = {
//                 action: 'import',
//                 quantity: importQuantity,
//                 transactionDate: transactionDate,
//                 expirationDate: expirationDate
//             };
//             mlistRef.child(`${medicineName}/transactions`).push(transactionData);
//         } else {
//             // Nếu loại thuốc chưa tồn tại, tạo một batch mới và lưu vào
//             CreateMedicine(medicineName, importQuantity, expirationDate);
//             console.log(`Đã tạo batch mới cho thuốc ${medicineName} với hạn sử dụng ${expirationDate} và số lượng ${importQuantity}`);

//             // Lưu thông tin về giao dịch nhập thuốc
//             const transactionData = {
//                 action: 'nhập',
//                 quantity: importQuantity,
//                 transactionDate: transactionDate,
//                 expirationDate: expirationDate
//             };
//             mlistRef.child(`${medicineName}/transactions`).push(transactionData);
//         }
//     });
// }

// function exportMedicine(medicineName, exportQuantity, transactionDate) {
//     mlistRef.child(medicineName).once('value', (snapshot) => {
//         const medicine = snapshot.val();
//         if (medicine) {
//             let batches = [];

//             // Tạo một mảng các batch từ dữ liệu snapshot
//             snapshot.forEach((childSnapshot) => {
//                 const batch = childSnapshot.val();
//                 batches.push({
//                     id: childSnapshot.key,
//                     quantity: parseInt(batch.quantity),
//                     expirationDate: batch.expirationDate
//                 });
//             });

//             // Sắp xếp các batch theo hạn sử dụng tăng dần
//             batches.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

//             let quantityLeftToExport = exportQuantity;

//             // Xuất thuốc từ các batch theo hạn sử dụng
//             for (let i = 0; i < batches.length; i++) {
//                 const currentBatch = batches[i];
//                 const quantityInBatch = currentBatch.quantity;
//                 const batchId = currentBatch.id;

//                 if (quantityLeftToExport > 0 && quantityInBatch > 0) {
//                     const quantityToExportFromBatch = Math.min(quantityInBatch, quantityLeftToExport);
//                     const updatedQuantityInBatch = quantityInBatch - quantityToExportFromBatch;

//                     // Cập nhật số lượng thuốc trong batch
//                     mlistRef.child(`${medicineName}/${batchId}/quantity`).set(updatedQuantityInBatch);

//                     console.log(`Đã xuất kho thành công ${quantityToExportFromBatch} đơn vị của thuốc ${medicineName} từ batch hạn sử dụng ${currentBatch.expirationDate}.`);

//                     quantityLeftToExport -= quantityToExportFromBatch;

//                     // Xóa batch nếu đã xuất hết thuốc từ batch đó
//                     if (updatedQuantityInBatch === 0) {
//                         mlistRef.child(`${medicineName}/${batchId}`).remove();
//                         console.log(`Batch ${batchId} đã được xóa vì đã xuất hết thuốc.`);
//                     }
//                 }
//             }

//             // Kiểm tra nếu vẫn còn số lượng thuốc cần xuất nhưng đã hết batch
//             if (quantityLeftToExport > 0) {
//                 console.log(`Không đủ số lượng thuốc trong kho để xuất ${exportQuantity} đơn vị.`);
//             }

//             // Lưu thông tin về giao dịch xuất thuốc
//             const transactionData = {
//                 action: 'xuất',
//                 quantity: exportQuantity,
//                 transactionDate: transactionDate
//             };
//             mlistRef.child(`${medicineName}/transactions`).push(transactionData);
//         } else {
//             console.log(`Không tìm thấy thông tin về thuốc ${medicineName} trong kho.`);
//         }
//     });
// }



//   function getTotalQuantity(medicineName) {
//     mlistRef.child(medicineName).once('value', (snapshot) => {
//         const medicineData = snapshot.val();
//         if (medicineData) {
//             let totalQuantity = 0;
//             Object.keys(medicineData).forEach(batchId => {
//                 totalQuantity += parseInt(medicineData[batchId].quantity);
//             });
//             console.log(`Tổng số lượng của thuốc ${medicineName}: ${totalQuantity}`);
//         } else {
//             console.log(`Không tìm thấy thông tin về thuốc ${medicineName}`);
//         }
//     });
// }

// function findMedicineByNamePartial(medicineNamePartial) {
//     mlistRef.once('value', (snapshot) => {
//         const medicines = snapshot.val();
//         if (medicines) {
//             const foundMedicines = Object.keys(medicines).filter(medicineName => {
//                 return medicineName.toLowerCase().includes(medicineNamePartial.toLowerCase());
//             });
//             if (foundMedicines.length > 0) {
//                 console.log("Các thuốc được tìm thấy:");
//                 foundMedicines.forEach(medicineName => {
//                     const medicineInfo = medicines[medicineName];
//                     console.log(`Tên thuốc: ${medicineName}`);
//                     console.log(`Thông tin từng batch:`);
//                     Object.keys(medicineInfo).forEach(batchId => {
//                         const batchInfo = medicineInfo[batchId];
//                         console.log(`- Batch ${batchId}:`);
//                         console.log(`  + Số lượng: ${batchInfo.quantity}`);
//                         console.log(`  + Hạn sử dụng: ${batchInfo.expirationDate}`);
//                     });
//                     console.log("--------------------------------------");
//                 });
//             } else {
//                 console.log("Không tìm thấy thuốc phù hợp.");
//             }
//         } else {
//             console.log("Không có dữ liệu về thuốc trong hệ thống.");
//         }
//     });
// }



// function displayTransactionHistory() {
//     const medicinesRef = firebase.database().ref("Mlist");

//     // Lặp qua tất cả các loại thuốc
//     medicinesRef.once("value", (snapshot) => {
//         snapshot.forEach((medicineSnapshot) => {
//             const medicineName = medicineSnapshot.key;
//             const transactionRef = firebase.database().ref("Mlist").child(medicineName).child("transactions");

//             // Query transactions sorted by transactionDate in descending order
//             transactionRef.orderByChild("transactionDate").once("value", (transactionSnapshot) => {
//                 console.log(`Lịch sử nhập xuất cho thuốc ${medicineName}:`);
//                 transactionSnapshot.forEach((childSnapshot) => {
//                     const transaction = childSnapshot.val();
//                     console.log("Loại giao dịch:", transaction.action);
//                     console.log("Số lượng:", transaction.quantity);
                    
//                     // Kiểm tra loại giao dịch để hiển thị thông tin hạn sử dụng chỉ khi là giao dịch nhập
//                     if (transaction.action === "nhập") {
//                         console.log("Hạn sử dụng:", transaction.expirationDate);
//                     }
                    
//                     console.log("Ngày giao dịch:", transaction.transactionDate);
//                     console.log("------------");
//                     // Hiển thị thông tin giao dịch trên giao diện người dùng thay vì log ra console
//                 });
//             });
//         });
//     });
// }


  





