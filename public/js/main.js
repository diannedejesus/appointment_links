const deleteButton = document.querySelectorAll('.del')
const signoutBtn = document.querySelector('.signout')
const addDateBtn = document.querySelector('.addDate')
const selectedSlot = document.querySelectorAll('.selectSlot')
const sendMail = document.querySelectorAll('.sendMail')

if(addDateBtn){addDateBtn.addEventListener('click', addTimeSlot)}
if(deleteButton){deleteButton.addEventListener('click', deleteReservation)}
if(signoutBtn){signoutBtn.addEventListener('click', signout)}

Array.from(selectedSlot).forEach((el)=>{
    el.addEventListener('click', selectTimeSlot)
})

Array.from(sendMail).forEach((el)=>{
    el.addEventListener('click', resendEmail)
})

Array.from(deleteButton).forEach((el)=>{
    el.addEventListener('click', deleteReservation)
})

async function deleteReservation(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('../setDates/deleteDates', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function signout(){
    try{
        const response = await fetch('signup/logout', {
            method: 'get',
            headers: {'Content-type': 'application/json'},
        })
        location.reload()
    }catch(err){
        console.log(err)
    }
}

function addTimeSlot(){
    const hourInput = document.querySelector("[name='hourItem']")
    const minuteInput = document.querySelector("[name='minuteItem']")
    const selectedHour = hourInput.options[hourInput.selectedIndex].value
    const selectedMinute = minuteInput.options[minuteInput.selectedIndex].value
    const selectedDate = document.querySelector("[name='dateItem']").value
    const dateList = document.querySelector('#timeSlots')

    if(selectedDate !== '' || selectedTime !== '' ){
        let newItem = document. createElement("li")
        let newFormItem = document. createElement("input")
        newFormItem.type = 'hidden'
        newFormItem.name = 'dateTimeItem'
        newFormItem.value = `${selectedDate} ${selectedHour}:${selectedMinute}`
        newItem.appendChild(document.createTextNode(`${selectedDate} ${selectedHour}:${selectedMinute}`))
        this.parentNode.appendChild(newFormItem)
        dateList.appendChild(newItem)
    }
}

async function selectTimeSlot(){
    const name = this.parentNode.dataset.name
    const dateTime = this.parentNode.dataset.datetime
    const id = this.parentNode.dataset.id

    try{
        const response = await fetch('../../setDates/assignTimeSlot', {
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'dateTimeFromJSFile': dateTime,
                'idFromJSFile': id,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function resendEmail(){
    const id = this.parentNode.dataset.id

    try {
        const response = await fetch('../../setDates/resendEmail', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'idFromJSFile': id,
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

// async function deleteReservation(){
//     const item1 = this.parentNode.dataset.id;
// console.log(item1)
//     try {
//         const response = await fetch('', {
//             method: 'delete',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({
//                 'item1': item1
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     } catch (error) {
//         console.log(error)
//     }
// }