As I was forming the email body I used these 5 lines:

         `Proposito: ${req.body.subjectItem} \r\n
                    Ubicación: ${req.body.locationItem} \r\n
                     Citado por: ${req.user.email} \r\n
                     Horario: <a href='#'>${linkId}</a> \r\n
                     Duración: ~${duration} minutos `

Which for some reason caused the ews module I was using (ews-javascript-api) to truncate all previous
text and leave just the last line.

Turns out it truncates html elements.
