import crypto from "crypto";
import ews, { BodyType, DateTime, EmailMessage } from 'ews-javascript-api';
var exch = new ews.ExchangeService(ews.ExchangeVersion.Exchange2016);
  exch.Url = new ews.Uri("https://east.exch032.serverdata.net/ews/exchange.asmx");

export async function GetEmail() {
  console.log('test')
  exch.Credentials = new ews.WebCredentials(process.env.exchangeUser, process.env.exchangePass);

  exch.FindItems(
    ews.WellKnownFolderName.Inbox,
    new ews.ItemView(1)
  ).then(findResults => {
    if (findResults.TotalCount > 0) {
      const itemId = findResults.Items[0].Id; // Get the first email's ID
      // Load the full email message
      ews.EmailMessage.Bind(exch, itemId).then(email => {
        console.log('Subject:', email.Subject);
        console.log('From:', email.From.Address);
        console.log('Body:', email.Body.Text);
      });
    }
  }).catch(error => {
    console.error('Error:', error);
  });
}

//subject, body, recipient, attachment, CC, options,
export async function sendEmail(recipient) {
  exch.Credentials = new ews.WebCredentials(process.env.exchangeUser, process.env.exchangePass);

  var msg = new EmailMessage(exch);
  msg.Subject = recipient.subject;
  msg.Body = new ews.MessageBody(BodyType.HTML, recipient.body);
  msg.ToRecipients.Add(recipient.recipient)
            //msg.CcRecipients
            //msg.IsDeliveryReceiptRequested
              
            /** var file = msgattach.Attachments.AddFileAttachment("filename to attach.txt", "c29tZSB0ZXh0");
             * AddFileAttachment parameters - 
             * filename (name of attachment as shown in outlook/owa not actual file from disk), 
             * base64 content of file (read file from disk and convert to base64 yourself)
             */

  msg.Send().then(() => {
    console.log("Email sent successfully.");
  }, (error) => {
    console.log("Error sending email: " + error.stack);
  });
}

//subject, body, start date, end date, location, invitetee, show as , email reminder
export async function addCalendarEvent() {
  exch.Credentials = new ews.WebCredentials(process.env.exchangeUser, process.env.exchangePass);
  let appointmentDate = new ews.DateTime(new Date().toISOString());

  const event = new ews.Appointment(exch)
  event.Subject = "the title"
  event.Start = appointmentDate;
  
  //event.End = appointmentDate.AddMinutes(30)


  event.Save(ews.WellKnownFolderName.Calendar, ews.SendInvitationsMode.SendToNone)
  .then(() => {
    console.log("Calendar sent successfully.");
  }, (error) => {
    console.log("Error sending Calendar: " + error.stack);
  });
}
