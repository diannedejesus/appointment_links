const deleteButton = document.querySelectorAll('.del')
const sendMail = document.querySelectorAll('.sendMail')
const optionButton = document.querySelectorAll('.option')

const signoutBtn = document.querySelector('.signout')
const addDateBtn = document.querySelector('.addDate')
const selectedSlot = document.querySelectorAll('.selectSlot')


if(addDateBtn){addDateBtn.addEventListener('click', addTimeSlot)}
//if(deleteButton){deleteButton.addEventListener('click', deleteReservation)}
if(signoutBtn){signoutBtn.addEventListener('click', signout)}

Array.from(selectedSlot).forEach((el)=>{
    el.addEventListener('click', selectTimeSlot)
})

// -----------
Array.from(sendMail).forEach((el)=>{
    el.addEventListener('click', resendEmail)
})

Array.from(deleteButton).forEach((el)=>{
    el.addEventListener('click', deleteReservation)
})

Array.from(optionButton).forEach((el)=>{
    el.addEventListener('click', optionReservation)
})
// ----------------

function optionReservation(){
    const selectedOption = document.querySelector('input[name="actionsMenu"]:checked').value;
    const todoId = this.parentNode.dataset.id

    switch(selectedOption){
        case "delete":
            deleteReservation(todoId)
            break
        case "edit":
            //
            break
        case "send":
            resendEmail(todoId)
            break
        default:
            console.log(`Sorry, ${selectedOption} is not an option.`);
    }
}

async function deleteReservation(linkId){
    const todoId = linkId //this.parentNode.dataset.id

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
    }catch(error){
        console.log(error)
    }
}

async function resendEmail(linkId){
    const id = linkId //this.parentNode.dataset.id

    try {
        const response = await fetch('../../sendEmail', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': id,
            })
        })

        const data = await response.json()

        console.log(data)
        location.reload()
    } catch (error) {
        console.log(error)
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

let orderedDatelist = []
function addTimeSlot(){
    const selectedDate = document.querySelector("[name='dateItem']").value
    const hourInput = document.querySelector("[name='hourItem']")
    const minuteInput = document.querySelector("[name='minuteItem']")
    const dateList = document.querySelector('#timeSlots') 

    const selectedHour = hourInput.options[hourInput.selectedIndex].value
    const selectedMinute = minuteInput.options[minuteInput.selectedIndex].value

    if(selectedDate !== '' && selectedHour !== '' && selectedMinute !== ''){        
        orderedDatelist.push(`${selectedDate}T${selectedHour}:${selectedMinute}`)
        buildDateList(dateList, orderedDatelist.sort())
    }
}

function buildDateList(listContainer, datesArray){
    listContainer.innerHTML = ""

    for(let dates of datesArray){
        let newItem = document.createElement("li")
        let newFormItem = document.createElement("input")
        
        newFormItem.type="datetime-local"
        newFormItem.name = 'dateTimeItem'
        newFormItem.value = `${dates}`
        
        newItem.appendChild(newFormItem)
        listContainer.appendChild(newItem)
    }
}

async function selectTimeSlot(){
    const name = this.parentNode.dataset.name
    const dateTime = this.parentNode.dataset.datetime
    const id = this.parentNode.dataset.id

    console.log(name)

    // try{
    //     const response = await fetch('../../setDates/assignTimeSlot', {
    //         method: 'PUT',
    //         headers: {'Content-type': 'application/json'},
    //         body: JSON.stringify({
    //             'dateTimeFromJSFile': dateTime,
    //             'idFromJSFile': id,
    //         })
    //     })
    //     const data = await response.json()
    //     console.log(data)
    //     location.reload()
    // }catch(err){
    //     console.log(err)
    // }
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