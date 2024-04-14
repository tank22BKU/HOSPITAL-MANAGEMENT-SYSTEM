function setSchedule(day, shift, ID) {
    const ref = firebase.database().ref('Schedules/' + day + '/' + shift);
    ref.once('value', snapshot => {
        let ids = snapshot.val();
        if (ids) {
            ids = ids.toString(); // Convert ids to string
            // Check if the IDs already have a "-"
            if (ids.includes(".")) {
                //console.log("Đã đạt tối đa số lượng ID");
                alert("Đã đạt tối đa số lượng ID");
                return;
            }
            // Add the new ID to the existing one
            ids += " ; " + ID;
        } else {
            // Set the first ID
            ids = ID;
        }
        ref.set(ids, error => {
            if (error) {
                //console.log("Có lỗi xảy ra khi thêm lịch", error);
                alert("Có lỗi xảy ra khi thêm lịch");
            } else {
                //console.log("Thêm lịch thành công");
                alert("Thêm lịch thành công");
                updateSchedule();
            }
        });
    });
}

async function createScheduleTable(data) {
    let html = '<table>';
    // Header row
    html += '<tr><th>Ca làm việc</th><th>Thứ 2</th><th>Thứ 3</th><th>Thứ 4</th><th>Thứ 5</th><th>Thứ 6</th><th>Thứ 7</th></tr>';

    // Shift times
    const shiftTimes = {
        1: '8:00 - 11:30',
        2: '13:00 - 16:30',
        3: '16:30 - 20:00'
    };

    // Data rows
    for (let shift = 1; shift <= 3; shift++) {
        html += '<tr>';
        html += `<td style="white-space: nowrap;">Ca ${shift} (${shiftTimes[shift]})</td>`; // Shift column with time

        // Days of the week columns
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (let day of days) {
            if (data && data[day]) {
                const schedule = data[day] && data[day][`shift${shift}`];
                if (schedule) {
                    // Check if the schedule is a string containing a "-"
                    if (schedule.includes("-")) {
                            html += `<td>${schedule} <button onclick="deleteSchedule('${day}', 'shift${shift}', '${schedule}')"style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Xóa</button></td>`;
                        
                    } else {
                        // The schedule is a single ID
                        html += `<td>${schedule} <button onclick="deleteSchedule('${day}', 'shift${shift}', '${schedule}')"style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Xóa</button></td>`;
                    }
                } else {
                    html += '<td></td>';
                }
            }
        }
        html += '</tr>';
    }

    html += '</table>';
    return html;
}

const getDataSchedule = async (Type) => {
    try {
      const snapshot = await firebase.database().ref(Type).once("value");
      const data = snapshot.val(); // Get the data directly as an object
      return data;
    } catch (error) {
      console.error("Error getting data from Firebase:", error);
      return null;
    }
  };

const getScheduleHTML = async () => {
    const result = await getDataSchedule("Schedules");
    const tableHTML = await createScheduleTable(result);
    return tableHTML;
  };

async function updateSchedule() {
    // Find the tbody element to insert the table into
    var ScheduleTable = document.getElementById('scheduleTableContainer');
  
    // Create the table and insert it into the tbody
    var tableHTML = await getScheduleHTML();
    ScheduleTable.innerHTML = tableHTML;
    //console.log(tableHTML);
}

function setSchedulenByForm() {
    const form = document.getElementById('schedule-form');

    const day = form.elements.day.value;
    const shift = form.elements.shift.value;
    const ID = form.elements.ID.value;

    //console.log('Day:', day);
    //console.log('Shift:', shift);
    //console.log('ID:', ID);

    setSchedule(day, shift, ID);
    document.getElementById('schedule-form').reset();
    updateSchedule();
}

function deleteSchedule(day, shift) {
    //console.log(`Deleting schedule for ${day} ${shift}`);
    firebase.database().ref(`Schedules/${day}/${shift}`).remove()    
    .then(() => {
        //console.log("Schedule deleted successfully.");
        alert("Xóa lịch thành công");
        // Update the schedule on the page
        updateSchedule();
    })
    .catch((error) => {
        console.error("Error deleting schedule: ", error);
    });
}