import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Import phần initializeApp từ firebase-app
var firebaseConfig = {
apiKey: "AIzaSyAd4_Np45sRl5uPdciyOrF3U6xT62gnzUQ",
authDomain: "ltnc-3a24c.firebaseapp.com",
databaseURL: "https://ltnc-3a24c-default-rtdb.firebaseio.com",
projectId: "ltnc-3a24c",
storageBucket: "ltnc-3a24c.appspot.com",
messagingSenderId: "1094416536083",
appId: "1:1094416536083:web:6b93941974081ac898a5e6",
measurementId: "G-05YGQ7YMHQ"
    // Cấu hình Firebase của bạn ở đây
};

let app = initializeApp(firebaseConfig);
let db = getDatabase();

// Gắn sự kiện submit cho form updateDevice
document.getElementById('updateDevice').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    let deviceName = document.getElementById('updateDeviceName').value.trim();
    let initialStatus = document.getElementById('updateInitialStatus').value.trim();
    let initialAvailability = document.getElementById('updateInitialAvailability').value.trim();
    let initialDate = document.getElementById('updateInitialDate').value;

    if (!deviceName || !initialStatus || !initialAvailability || !initialDate) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    try {
        // Kiểm tra sự tồn tại của thiết bị trong cơ sở dữ liệu
        const deviceSnapshot = await get(ref(db, "Elist/" + deviceName));
        if (deviceSnapshot.exists()) {
            // Nếu thiết bị tồn tại, thực hiện cập nhật thông tin
            await updateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate);
        } else {
            alert("Thiết bị không tồn tại trong cơ sở dữ liệu.");
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra sự tồn tại của thiết bị:", error);
        alert("Đã xảy ra lỗi khi kiểm tra sự tồn tại của thiết bị.");
    }
});

// Hàm cập nhật thông tin của thiết bị trong cơ sở dữ liệu Firebase
async function updateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate) {
    try {
        await update(ref(db, "Elist/" + deviceName), {
            initialStatus: initialStatus,
            initialAvailability: initialAvailability,
            initialDate: initialDate,
        });
        alert("Thông tin của thiết bị đã được cập nhật vào cơ sở dữ liệu.");
        location.reload();
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin của thiết bị:", error);
        alert("Đã xảy ra lỗi khi cập nhật thông tin của thiết bị.");
    }
}
