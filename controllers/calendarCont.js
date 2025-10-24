import TimeSlotDB from '../models/TimeSlots.js'
import userInfoDB from '../models/Reservations.js'
import ReservedSlotDB from '../models/UserInfo.js'
import crypto from "crypto";
//const EWS = require('node-ews');
//const NTLMAuth = require('httpntlm').ntlm;


export async function getIndex (req,res){
    const slots = await TimeSlotDB.find()
    const reservationList = []

    for(let timeslots of slots){
        const reservationInfo = await userInfoDB.findOne({linkId: timeslots.linkId})
        let reservation

        if(timeslots.selectTimeSlot){
            let date = new Date(timeslots.selectedSlot)

            reservation = {
                date,
                person: reservationInfo.name,
                subject: reservationInfo.subject,
                reserved: true
            }

            reservationList.push(reservation)
        }else{
            for(let dates of timeslots.slotChoices){
                let date = new Date(dates)

                reservation = {
                    date,
                    person: reservationInfo.name,
                    subject: reservationInfo.subject,
                    reserved: false
                }

                reservationList.push(reservation)
            }
        }
       
    }

    res.render('calendarIndex.ejs', {
        datenum: req.query.datenum ?? (new Date()).getDay(), 
        datemonth: req.query.datemonth ?? (new Date()).getMonth(),
        reservationList: reservationList
    }) 
}

// export async function addDate(req,res){
//     try{
//         const algorithm = "aes-256-cbc"; 
//         // the decipher function
//         const decipher = crypto.createDecipheriv(algorithm, 'testerkey12345678901234567891234', 'testerkey1234567');
//         let decryptedData = decipher.update(req.user.calendarPassword, "hex", "utf-8");

//         decryptedData += decipher.final("utf8");


//         // store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
//         const ntHashedPassword = NTLMAuth.create_NT_hashed_password(decryptedData);
//         const lmHashedPassword = NTLMAuth.create_LM_hashed_password(decryptedData);

//         // exchange server connection info
//         const ewsConfig = {
//         username: req.user.calendarEmail,
//         nt_password: ntHashedPassword,
//         lm_password: lmHashedPassword,
//         host: 'https://east.exch032.serverdata.net/'
//         };

//         // initialize node-ews
//         const ews = new EWS(ewsConfig);

//         const ewsFunction = 'CreateItem';
//         const ewsArgs = {
//         "attributes" : {
//             "SendMeetingInvitations" : "SendToAllAndSaveCopy"
//         },
//         'SavedItemFolderId': {
//             'DistinguishedFolderId': {
//             'attributes': {
//                 'Id':'calendar'
//             }
//             } 
//         },
//         'Items': {
//             'CalendarItem': {
//             'Subject': 'Planning Meeting',  //
//             'Body': 'Plan the agenda for next week\'s meeting.', //
//             'ReminderIsSet': true,
//             'ReminderMinutesBeforeStart': 60,
//             'Start': '2021-09-10T14:00:00', //
//             'End': '2021-09-10T15:00:00', //
//             'IsAllDayEvent':false,
//             'LegacyFreeBusyStatus': 'Busy',
//             'Location': 'Conference Room 721', //
//             }
//         }
//         };


//         // query EWS and print resulting JSON to console
//         ews.run(ewsFunction, ewsArgs)
//         .then(result => {
//             console.log(JSON.stringify(result));
//         })
//         .catch(err => {
//             console.log(err.message);
//         });

//         console.log("Decrypted message: " + decryptedData);
//         res.json('done')
//         //res.render('setDates.ejs', {timeSlots: slots, left: itemsLeft, reservations: reservationsMade})
//     }catch(err){
//         console.log(err)
//     }
// }


  