import TimeSlotDB from '../models/TimeSlots.js'
import ReservedSlotDB from '../models/Reservations.js'
import * as nanoid from 'nanoid'
import * as ExchangeHandler from '../ewsConnections.js'


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

        let emailBody = `Proposito: ${req.body.subjectItem} &lt;br&gt;
                    Ubicación: ${req.body.locationItem} &lt;br&gt;
                    Citado por: ${req.user.email} &lt;br&gt;
                    Horario: &lt;a href='#'&gt${linkId}&lt;/a&gt &lt;br&gt;
                    Duración: ~${duration} minutos `
        
        const emailContent = {
            subject: 'Cita Programado',
            body: emailBody,
            recipient: req.body.emailItem,
        }

        ExchangeHandler.sendEmail(emailContent)

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

export async function selectOrShowTimeSlots (req,res) {  
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

        const reservedSlots = await TimeSlotDB.find({owner: reservation.owner,
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

        if(isFilled){
            res.render('ViewDateTime.ejs', {
                reservationInfo: reservation,
                timeSlots: availableSlots,
                reserved: unavailableSlots,
                isLoggedIn: req.user ? "true" : "false",
                selectedDay: req.query.selectedDate
            })
        }else{
            res.render('SelectDateTime.ejs', {
                reservationInfo: reservation,
                timeSlots: availableSlots,
                isLoggedIn: req.user ? "true" : "false",
                reserved: unavailableSlots,
                selectedDay: req.query.selectedDate
            })
        }
    }catch(err){
        console.log(err)
    }
}

