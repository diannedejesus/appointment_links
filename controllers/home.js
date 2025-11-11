import ReservedSlotDB from '../models/Reservations.js'
import * as ExchangeHandler from '../ewsConnections.js'

export function getIndex (req,res){
    res.render('index.ejs')
}

export async function sendEmail (req,res){
    try {
        const reservationsMade = await ReservedSlotDB.findOne({ linkId: req.body.todoIdFromJSFile })

        let emailBody = `Proposito: ${reservationsMade.subject} &lt;br&gt;
        Ubicación: ${reservationsMade.location} &lt;br&gt; 
        Citado por: ${reservationsMade.owner} &lt;br&gt;
        Horario: &lt;a href='#'&gt;${req.body.todoIdFromJSFile}&lt;/a&gt; &lt;br&gt;
        Duración: ~${reservationsMade.duration} minutos`
                
        const emailContent = {
            subject: 'Cita Programado',
            body: emailBody,
            recipient: reservationsMade.email,
        }

        console.log(req.body.todoIdFromJSFile)
        ExchangeHandler.sendEmail(emailContent)

        console.log('Email Sent')
        res.json('Email Sent')

    }catch(error){
        console.log(error)
    }
}