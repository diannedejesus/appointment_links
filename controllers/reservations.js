import TimeSlotDB from '../models/TimeSlots.js'
import ReservedSlotDB from '../models/Reservations.js'
import DatesDB from '../models/Dates.js'
//const ewsOptions = require('../ewsConnections')
import * as nanoid from 'nanoid'


export async function show_setDates (req,res){
    try{
        const slots = await TimeSlotDB.find()
        const itemsLeft = await TimeSlotDB.countDocuments({selectedSlot: ''})
        const reservationsMade = await ReservedSlotDB.find({owner: req.user.email})
        //TODO: the items needs to be sorted by date
        res.render('setDates.ejs', {timeSlots: slots, left: itemsLeft, reservations: reservationsMade})
    }catch(err){
        console.log(err)
    }
}

export async function selectTimeSlots (req,res) {
    try{
        let availableSlots
        let unavailableSlots = []

        let currentLink = {}
        if(req.params.id){
            currentLink = {linkId: req.params.id}
        }

        const reservation = await ReservedSlotDB.find(currentLink)
        const timeSlots = await TimeSlotDB.find(currentLink)
        const reservedSlots = await TimeSlotDB.find().select('selectedSlot')

        const isFilled = timeSlots[0].selectedSlot ? true : false

        if(isFilled){
            availableSlots = timeSlots[0].selectedSlot
        }else{
            availableSlots = timeSlots[0].slotChoices  
        }

        for(let slots of reservedSlots){
            if(slots.selectedSlot){
                unavailableSlots.push(`${slots.selectedSlot}`)
            }
        }
        
        //TODO: the items needs to be sorted by date
        res.render('selectTimeSlot.ejs', {todos: reservation, isFilled: isFilled, timeSlots: availableSlots, reserved: unavailableSlots})
    }catch(err){
        console.log(err)
    }
}

export async function resendEmail (req, res){ //uses ews

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

        console.log(req.body.dateTimeItem)  //validate

        await TimeSlotDB.create({
            slotChoices: req.body.dateTimeItem,
            linkId: linkId,
        })

        if(!Array.isArray(req.body.dateTimeItem)){
            const createdDate = await DatesDB.findOne({ dateTime: req.body.dateTimeItem })

            if(createdDate){
                await DatesDB.updateOne({_id: createdDate.id}, { $push: {references: linkId}})
            }else{
                await DatesDB.create({
                    dateTime: req.body.dateTimeItem,
                    references: [linkId],
                    reserved: false
                })
            }
        }else{
            for(let dateTime of req.body.dateTimeItem){
                const createdDate = await DatesDB.findOne({ dateTime: dateTime })

                if(createdDate){
                    await DatesDB.updateOne({_id: createdDate.id}, { $push: {references: linkId}})
                }else{
                    await DatesDB.create({
                        dateTime: dateTime,
                        references: [linkId],
                        reserved: false
                    })
                }
            }
        }
        
        req.body.idFromJSFile = linkId
        //resendEmail(req)

        console.log('Time slots were created')
        res.redirect('/setDates')
    }catch(err){
        console.log(err)
    }
}

export async function assignTimeSlot (req, res){ //uses ews
    try{
        await TimeSlotDB.findOneAndUpdate({linkId: req.body.idFromJSFile},{
            selectedSlot: new Date(req.body.dateTimeFromJSFile),
        })

        const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
        let durationTime = reservationData.duration
        const endDate = new Date(req.body.dateTimeFromJSFile).getTime() + (Number(durationTime) * 60000) //TODO use the duration but first set a standard for definition

        const options = {
            'Name': reservationData.name,
            'Subject': reservationData.subject,
            'Body': `${reservationData.name} ${reservationData.email}`,
            'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
            'End': new Date(endDate).toISOString(),
            'Location': reservationData.location,
            'Email': reservationData.email,
        }

        const optionsEmailUser = {
            'Name': reservationData.name,
            'Subject': 'An Appointment Date and Time has Been Reserved',
            'Body': `Hello ${req.user.email},\n\n${options.Name} has selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for their appointment. \n\nThe apppointment will be at ${reservationData.location} and you will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
            'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
            'End': new Date(endDate).toISOString(),
            'Location': reservationData.location,
            'Email': req.user.calendarEmail,
        }

        const optionsEmailClient = {
            'Name': 'Your Appointment Date and Time has Been Reserved',
            'Body': `Hello ${options.Name},\n\nYou have selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for your appointment. \n\nLike the selection page indicated the apppointment will be at ${reservationData.location}. \n\nWe will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
            'Email': reservationData.email,
        }
        //save to calendar
        //ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
        //ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
        //ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailUser)

        console.log('Time Slot Selected')
        res.json('Time Slot Selected')
    }catch(err){
        console.log(err)
    }
}

export async function deleteTimeSlot (req, res){
    //console.log(req.body.todoIdFromJSFile)

    try{
        const timeSlot = await TimeSlotDB.findOne({linkId:req.body.todoIdFromJSFile})

        for(let currentDateTime of timeSlot.slotChoices){
            await DatesDB.updateOne(
                {dateTime: currentDateTime}, 
                {$pull: {references: req.body.todoIdFromJSFile}}
            )

            const verifyItem = await DatesDB.findOne({dateTime: currentDateTime})

            if(verifyItem.references.length === 0){
                await DatesDB.findOneAndDelete({dateTime: currentDateTime})
            }
        }
        
        await TimeSlotDB.findOneAndDelete({linkId:req.body.todoIdFromJSFile})
        await ReservedSlotDB.findOneAndDelete({linkId:req.body.todoIdFromJSFile})
        
        console.log('Deleted Reservations')
        res.json('Deleted Reservations')
    }catch(error){
        console.log(error)
    }
}