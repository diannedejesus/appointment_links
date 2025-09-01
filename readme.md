# Booking Office Meetings

**Built by Dianne De Jesus**

## Functional Description

This application will permit the user to create a custom link with available dates for a client to select (only a single date can be chosen). Once the client selects a date, it will be added to the user's calendar. The user will be notified which date was selected by email and the client will recieve a confirmation email.

### User Interfase Description

The user will be able to create date/time slots for a client to select. They will include the clients information and other details pertinate to the appointment. A link will be generated and sent to the client by email.

#### User Interfase Data & Functionality

User Input:

- Client: name [string]
- Appointment: Description [string], duration [number], location [string]
- Slots: Date [date], time [date]
  - slots will be saved as an array, the user will be able to add and remove slots before saving

Additional Data:

- unique link id [string]
- isFilled [boolean] (data availability)

Date Selection:
The user with be able to add as many date/time slots as need, ideally we will be able to verify the selected dates againts the users calendar to verify if the date is already filled. We will not limit or check if the date was included in another client list. The same date can be given to multiple clients, the first to select it get the date.

Date Verification:

- filled dates will be collected from the users calendar
- A local copy might help with speed, but update timing will be an issue
- data must be organised to facilite lookup

confirm/save:
Data will be saved to a database along with unique identifier for the client link

<!-- delete:
permitly removes an appointment selection -->

### Client Interfase Description

The client will see the times/dates available for the specified appointment and the details for the appointment. When a date is selected they will need to confirm the selection. Once the selection is confirmed the user will recieve an email and the date will be added to the user's calendar. The client will also recieve an email.

#### Client Interfase Data & Functionality

A set of buttons will allow the client to choose a sinlge time slot. An option for emailing user if no dates fit the clients schedule. Once it is confirmed then two emails will be sent.

- one to client
- one to the user

After the date is selected only the selected date and appointment details will be displayed.

## Goals and milestones

- Get the connection between the exchange server and nodejs established. [completed]
- Get a basic MVC nodejs working for the user and client interfase. [completed]
- Design the data schemas needed
- Determine the login format for the app.
- Verify authentication process for exchange servers
- Get email and calendar interation with app.
- [Feature] Verify that date/times don't overlap
- [Feature] Calendar display
- [Wishlist] Verify holidays and vacation days
- [Wishlist] limit access to link by email
