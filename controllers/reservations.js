import TimeSlotDB from '../models/TimeSlots.js'
import ReservedSlotDB from '../models/Reservations.js'
import * as nanoid from 'nanoid'


export async function sendEmail (req, res){ //uses ews

    try{
        const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
        //let durationTime = reservationData.duration

        const optionsEmailClient = {
            'Name': reservationData.name,
            'Body': `Hello ${reservationData.name},\n\nOur office needs to meet with you to complete some documentation or discuss a topic pertinate to your case. Please use the following link to schedule your appointment. \n\nIf none of these times/dates work with your schedule then please email or call us so we can find a time that works. \n\nWe will be discussing: ${reservationData.subject} and we estimate the meeting will be ${reservationData.duration}\n\n http://localhost:3000/setDates/selectTimeSlot/${reservationData.linkId}\n\n`, //Body: name email
            'Email': reservationData.email,
            'Subject': 'We need you to schedule an appointment',
        }

        ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)

        console.log('Email Sent')
        res.json('Email Sent')
    }catch(err){
        console.log(err)
    }
}

export async function createTimeSlot (req, res){
    try{
        const linkId = nanoid.nanoid()
        let duration = req.body.durationItem
        
        if(req.body.timeframItem === 'hours'){
            duration = duration * 60
        }

        await ReservedSlotDB.create({
            owner: req.user.email, 
            name: req.body.nameItem, 
            email: req.body.emailItem, 
            location: req.body.locationItem, 
            subject: req.body.subjectItem, 
            duration: duration,
            linkId: linkId,
        })

        await TimeSlotDB.create({
            owner: req.user.email,
            slotChoices: req.body.dateTimeItem,
            linkId: linkId,
        })
        
        req.body.idFromJSFile = linkId
        //sendEmail(req)

        console.log('Time slots were created')
        res.redirect('/setDates')
    }catch(err){
        console.log(err)
    }
}

export async function assignTimeSlot (req, res){ //uses ews
    try{
        await TimeSlotDB.findOneAndUpdate({
            linkId: req.body.timeslot[1]
        },
        {
            selectedSlot: new Date(req.body.timeslot[0]),
        })

        const reservationData = await ReservedSlotDB.findOne({linkId: req.body.timeslot[1]})
        let durationTime = reservationData.duration
        const endDate = new Date(req.body.timeslot[0]).getTime() + (Number(durationTime) * 60000) 

        const options = {
            'Name': reservationData.name,
            'Subject': reservationData.subject,
            'Body': `${reservationData.name} ${reservationData.email}`,
            'Start': new Date(req.body.timeslot[0]).toISOString(),
            'End': new Date(endDate).toISOString(),
            'Location': reservationData.location,
            'Email': reservationData.email,
        }

        const optionsEmailUser = {
            'Name': reservationData.name,
            'Subject': 'An Appointment Date and Time has Been Reserved',
            'Body': `Hello ${req.user.email},\n\n${options.Name} has selected the date ${new Date(req.body.timeslot[0]).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for their appointment. \n\nThe apppointment will be at ${reservationData.location} and you will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
            'Start': new Date(req.body.timeslot[0]).toISOString(),
            'End': new Date(endDate).toISOString(),
            'Location': reservationData.location,
            'Email': req.user.calendarEmail,
        }

        const optionsEmailClient = {
            'Name': 'Your Appointment Date and Time has Been Reserved',
            'Body': `Hello ${options.Name},\n\nYou have selected the date ${new Date(req.body.timeslot[0]).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for your appointment. \n\nLike the selection page indicated the apppointment will be at ${reservationData.location}. \n\nWe will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
            'Email': reservationData.email,
        }
        //save to calendar
        //ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
        //ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
        //ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailUser)

        console.log('Time Slot Selected')
        res.redirect(req.get('referer'))
    }catch(err){
        console.log(err)
    }
}

export async function deleteTimeSlot (req, res){
    try{       
        await TimeSlotDB.findOneAndDelete({linkId:req.body.todoIdFromJSFile})
        await ReservedSlotDB.findOneAndDelete({linkId:req.body.todoIdFromJSFile})
        
        console.log('Deleted Reservations')
        res.json('Deleted Reservations')
    }catch(error){
        console.log(error)
    }
}




export async function show_reservations (req,res){
    try{
        const reservationsMade = await ReservedSlotDB.find({owner: req.user.email})
        const slots = await TimeSlotDB.find({owner: req.user.email})

        const itemsLeft = await TimeSlotDB.countDocuments({
            owner: req.user.email, 
            selectedSlot: ''
        })
        
        res.render('ViewReservations.ejs', {
            timeSlots: slots, 
            left: itemsLeft,
            reservations: reservationsMade
        })
    }catch(error){
        console.log(error)
    }
}

export async function show_setDates (req,res){
    try{
        const reservationsMade = await ReservedSlotDB.find({owner: req.user.email})
        const slots = await TimeSlotDB.find({owner: req.user.email})
        const itemsLeft = await TimeSlotDB.countDocuments({
            owner: req.user.email, 
            selectedSlot: ''
        })
        
        res.render('setDates.ejs', {
            timeSlots: slots,
            left: itemsLeft,
            reservations: reservationsMade
        })
    }catch(error){
        console.log(error)
    }
}

export async function selectTimeSlots (req,res) {  
    try{
        let availableSlots = []
        let unavailableSlots = []
        let currentLink = {}

        if(req.params.id){
            currentLink = {linkId: req.params.id}
        }
        //else return error

        const reservation = await ReservedSlotDB.find(currentLink)
        const timeSlots = await TimeSlotDB.find(currentLink)

        const reservedSlots = await TimeSlotDB.find({owner: req.user.email,
            selectedSlot: { $ne : null }}).select('selectedSlot')
        for(let slots of reservedSlots){
            unavailableSlots.push(`${slots.selectedSlot}`)
        }
        
        const isFilled = timeSlots[0].selectedSlot ? true : false
        if(isFilled){
            availableSlots.push(timeSlots[0].selectedSlot)
        }else{
            availableSlots = timeSlots[0].slotChoices
        }

        availableSlots = availableSlots.sort()

        res.render('selectTimeSlot.ejs', {
            reservationInfo: reservation,
            isFilled: isFilled,
            timeSlots: availableSlots,
            reserved: unavailableSlots,
            selectedDay: req.query.selectedDate
        })
    }catch(err){
        console.log(err)
    }
}